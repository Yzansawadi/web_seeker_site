import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * تصدير الجدول إلى PDF بحجم A4 أفقي.
 *
 * لماذا لا نستخدم html2pdf.js:
 *  - يضع طبقة (overlay) شاملة للشاشة أثناء التصدير، وإذا فشل التصدير تبقى الطبقة
 *    فوق الموقع وتمنع أي ضغطة => يبدو الموقع "متجمدًا".
 *  - html2canvas لا يفهم ألوان Tailwind v4 (oklch / color-mix) ويرمي خطأً.
 *  - خيار letterRendering يفصل الحروف العربية عن بعضها.
 *
 * هنا نرسم كل صفحة من الوثيقة (الجدول الأسبوعي، ثم جدول التفاصيل) بـ html2canvas
 * مباشرة ونضعها في jsPDF، مع مهلة قصوى حتى لا يعلق الموقع أبدًا.
 */

const A4_W = 297;
const A4_H = 210;
const MARGIN = 6;
const CONTENT_W = A4_W - MARGIN * 2; // 285mm
const CONTENT_H = A4_H - MARGIN * 2; // 198mm
const RENDER_SCALE = 2;
const TIMEOUT_MS = 45000;

const COLOR_PROPS = [
  'color',
  'background-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
];

/** يحوّل أي لون CSS (oklch, color-mix, color(srgb ...)) إلى rgba() يفهمه html2canvas */
function createColorConverter() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const cache = new Map<string, string>();

  return (value: string): string => {
    const cached = cache.get(value);
    if (cached) return cached;
    if (!ctx) return value;

    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillStyle = value; // إذا كان اللون غير صالح يبقى شفافًا
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const out = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
    cache.set(value, out);
    return out;
  };
}

function isSafeColor(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === '' || v === 'transparent' || v.startsWith('rgb(') || v.startsWith('rgba(') || v.startsWith('#');
}

function fixNode(node: Element, win: Window, convert: (v: string) => string) {
  const el = node as HTMLElement;
  if (!el.style) return;
  const cs = win.getComputedStyle(el);

  for (const prop of COLOR_PROPS) {
    const v = cs.getPropertyValue(prop);
    if (v && !isSafeColor(v)) {
      el.style.setProperty(prop, convert(v), 'important');
    }
  }
  // الظلال قد تحتوي ألوانًا لا يفهمها html2canvas، وهي زخرفية فقط
  el.style.setProperty('box-shadow', 'none', 'important');
  el.style.setProperty('text-shadow', 'none', 'important');
}

/** يُنفَّذ على النسخة المستنسخة فقط، ولا يمس الصفحة الحقيقية */
function sanitizeClone(doc: Document, rootId: string, convert: (v: string) => string) {
  const win = doc.defaultView;
  const root = doc.getElementById(rootId);
  if (!win || !root) return;

  // html2canvas يقرأ خلفية html و body دائمًا، لذلك يجب تنظيفهما أيضًا
  fixNode(doc.documentElement, win, convert);
  if (doc.body) fixNode(doc.body, win, convert);

  // الحاويات الأب: نجعلها ظاهرة (الأصل مخفي بـ opacity:0 و z-index سالب)
  let parent = root.parentElement;
  while (parent) {
    fixNode(parent, win, convert);
    parent.style.setProperty('opacity', '1', 'important');
    parent.style.setProperty('z-index', 'auto', 'important');
    parent = parent.parentElement;
  }

  fixNode(root, win, convert);
  root.querySelectorAll('*').forEach((n) => fixNode(n, win, convert));

  // إخفاء إطار الصفحة المستدير دون تغيير الأبعاد (حتى تبقى مواضع الصفوف صحيحة)
  Array.from(root.children).forEach((child) => {
    const c = child as HTMLElement;
    c.style.setProperty('border-color', 'transparent', 'important');
    c.style.setProperty('border-radius', '0', 'important');
  });
}

const nextTick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('انتهت مهلة إنشاء الـ PDF')), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

async function buildPdf(element: HTMLElement, elementId: string, filename: string) {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const pages = Array.from(element.children) as HTMLElement[];
  if (pages.length === 0) throw new Error('لا توجد صفحات للتصدير');

  const convert = createColorConverter();
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
  let pdfPages = 0;

  const addCanvasToPdf = (canvas: HTMLCanvasElement, widthMm: number, heightMm: number, x: number) => {
    if (pdfPages > 0) pdf.addPage('a4', 'landscape');
    pdfPages++;
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', x, MARGIN, widthMm, heightMm, undefined, 'FAST');
  };

  for (const pageEl of pages) {
    await nextTick(); // نترك المتصفح يتنفس بين الصفحات

    const rect = pageEl.getBoundingClientRect();
    const cssW = rect.width;
    const cssH = rect.height;
    if (cssW === 0 || cssH === 0) continue;

    // مواضع الصفوف الآمنة للقطع (قياس من الصفحة الحقيقية قبل الرسم)
    const isTablePage = pageEl.querySelector('tbody tr') !== null;
    const breakTops: number[] = [];
    if (isTablePage) {
      pageEl.querySelectorAll<HTMLElement>('tr, .print-avoid-break').forEach((n) => {
        breakTops.push(Math.round(n.getBoundingClientRect().top - rect.top));
      });
      const last = pageEl.lastElementChild as HTMLElement | null;
      if (last) breakTops.push(Math.round(last.getBoundingClientRect().top - rect.top));
    }

    const canvas = await html2canvas(pageEl, {
      scale: RENDER_SCALE,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      onclone: (doc) => sanitizeClone(doc, elementId, convert),
    });

    const k = canvas.width / cssW; // عدد بكسلات الكانفاس لكل بكسل CSS
    const pageHeightCss = (cssW * CONTENT_H) / CONTENT_W;

    if (!isTablePage || cssH <= pageHeightCss) {
      // صفحة واحدة: نكبّر/نصغّر لتناسب A4 مع الحفاظ على النسبة
      const ratio = canvas.width / canvas.height;
      let w = CONTENT_W;
      let h = w / ratio;
      if (h > CONTENT_H) {
        h = CONTENT_H;
        w = h * ratio;
      }
      addCanvasToPdf(canvas, w, h, MARGIN + (CONTENT_W - w) / 2);
    } else {
      // جدول طويل: نقطعه عند حدود الصفوف حتى لا ينشطر صف بين صفحتين
      const tops = Array.from(new Set(breakTops)).filter((t) => t > 0).sort((a, b) => b - a);
      let start = 0;
      while (start < cssH - 1) {
        let end = start + pageHeightCss;
        if (end >= cssH) {
          end = cssH;
        } else {
          const candidate = tops.find((t) => t > start + 20 && t <= end);
          if (candidate) end = candidate;
        }

        const sy = Math.round(start * k);
        const sh = Math.min(canvas.height - sy, Math.round((end - start) * k));
        if (sh > 0) {
          const slice = document.createElement('canvas');
          slice.width = canvas.width;
          slice.height = sh;
          const ctx = slice.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, slice.width, slice.height);
            ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);
            addCanvasToPdf(slice, CONTENT_W, (sh / canvas.width) * CONTENT_W, MARGIN);
          }
          slice.width = 0;
          slice.height = 0;
        }
        start = end;
      }
    }

    canvas.width = 0;
    canvas.height = 0;
  }

  if (pdfPages === 0) throw new Error('لم يتم إنشاء أي صفحة');
  pdf.save(filename);
}

export async function exportScheduleToPdf(
  elementId: string,
  filename: string = 'جدول_مواد_IUST.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Export error: element #${elementId} not found`);
    return false;
  }

  try {
    await withTimeout(buildPdf(element, elementId, filename), TIMEOUT_MS);
    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    return false;
  }
}
