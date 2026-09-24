import { toCanvas, getFontEmbedCSS } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * تصدير الجدول إلى PDF بحجم A4 أفقي.
 *
 * نستخدم html-to-image بدل html2canvas: المتصفح نفسه هو من يرسم النص (عبر SVG foreignObject)
 * فيطابق الشاشة تمامًا. html2canvas يعيد رسم النص بنفسه بإزاحة خاطئة مع خط Cairo،
 * فكان نصف الحروف يختفي، كما لا يفهم ألوان Tailwind v4 (oklch).
 *
 * كل صفحة من الوثيقة (الجدول الأسبوعي، ثم جدول التفاصيل) تُرسم كصورة وتوضع في jsPDF،
 * مع مهلة قصوى حتى لا يعلق الموقع أبدًا.
 */

const A4_W = 297;
const A4_H = 210;
const MARGIN = 6;
const CONTENT_W = A4_W - MARGIN * 2; // 285mm
const CONTENT_H = A4_H - MARGIN * 2; // 198mm
const RENDER_SCALE = 2;
const TIMEOUT_MS = 60000;

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

async function renderPage(pageEl: HTMLElement, fontEmbedCSS: string | undefined): Promise<HTMLCanvasElement> {
  const base = { pixelRatio: RENDER_SCALE, backgroundColor: '#ffffff' };
  try {
    return await toCanvas(pageEl, fontEmbedCSS ? { ...base, fontEmbedCSS } : base);
  } catch (err) {
    // إذا فشل تضمين الخطوط (مثلًا لا يوجد اتصال بـ Google Fonts) نرسم بدونها بدل الفشل الكامل
    console.warn('Font embedding failed, retrying without web fonts:', err);
    return await toCanvas(pageEl, { ...base, skipFonts: true });
  }
}

async function buildPdf(element: HTMLElement, filename: string) {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const pages = Array.from(element.children) as HTMLElement[];
  if (pages.length === 0) throw new Error('لا توجد صفحات للتصدير');

  // نحسب CSS الخطوط المضمّنة مرة واحدة ونعيد استخدامه لكل الصفحات
  let fontEmbedCSS: string | undefined;
  try {
    fontEmbedCSS = await getFontEmbedCSS(pages[0]);
  } catch (err) {
    console.warn('getFontEmbedCSS failed:', err);
  }

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

    const canvas = await renderPage(pageEl, fontEmbedCSS);

    const k = canvas.width / cssW; // عدد بكسلات الكانفاس لكل بكسل CSS
    const pageHeightCss = (cssW * CONTENT_H) / CONTENT_W;

    if (!isTablePage || cssH <= pageHeightCss) {
      // صفحة واحدة: نناسب A4 مع الحفاظ على النسبة
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
    await withTimeout(buildPdf(element, filename), TIMEOUT_MS);
    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    return false;
  }
}
