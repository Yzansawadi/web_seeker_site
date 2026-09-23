import fs from 'fs';
import path from 'path';

export interface ScrapedRow {
  code: string;
  name: string;
  activity: string;
  days: string;
  start_time: string;
  end_time: string;
  room: string;
  section: string;
  teacher: string;
  rawTime: string;
}

export interface ScrapeResult {
  success: boolean;
  totalRows: number;
  totalCourses: number;
  totalSessions: number;
  rows: ScrapedRow[];
  timestamp: string;
  message: string;
}

const URL = 'https://educate.iust.edu.sy/faces/ui/pages/guest/scheduleCourses/index.xhtml';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const HEADERS = {
  'User-Agent': USER_AGENT,
  'X-Requested-With': 'XMLHttpRequest',
  'Faces-Request': 'partial/ajax',
};

// خريطة الأيام كما في extract_schedule.py
export const DAY_MAP: Record<string, string> = {
  س: 'السبت',
  ح: 'الأحد',
  ن: 'الاثنين',
  ث: 'الثلاثاء',
  ر: 'الأربعاء',
};

const KEYS = ['index', 'code', 'name', 'activity', 'time', 'room', 'section', 'status', 'teacher', 'building'];

// تحويل 24h إلى 12h كما في extract_schedule.py
export function to12h(t: string): string {
  if (!t || !t.includes(':')) return '';
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  const suffix = h < 12 ? 'AM' : 'PM';
  h = h >= 1 && h <= 12 ? h : h > 12 ? h - 12 : 12;
  return `${h}:${mStr} ${suffix}`;
}

// دالة تحليل الوقت المطابقة لـ extract_schedule.py
export function parseTimeField(t: string): {
  days: string;
  start12: string;
  end12: string;
  raw: string;
} {
  const clean = (t || '').trim();
  const blockRegex = /\[\s*(\d{2}:\d{2})_(\d{2}:\d{2})\s*\]/g;
  const blocks: [string, string][] = [];
  let match;
  while ((match = blockRegex.exec(clean)) !== null) {
    blocks.push([match[1], match[2]]);
  }

  const daysPart = clean.replace(/\[.*?\]/g, '').trim();
  const daysList = daysPart.split(/\s+/).filter(Boolean);
  const fullDays = daysList.map((d) => DAY_MAP[d] || d);
  const fullDaysStr = fullDays.join(' / ');

  if (blocks.length === 0) {
    return { days: fullDaysStr, start12: '', end12: '', raw: clean };
  }

  const [start24, end24] = blocks[0];
  const start12 = to12h(start24);
  const end12 = to12h(end24);

  return { days: fullDaysStr, start12, end12, raw: clean };
}

// استخراج ViewState من HTML/XML
export function getViewState(html: string): string | null {
  const m =
    html.match(/name="javax\.faces\.ViewState"[^>]*value="([^"]+)"/) ||
    html.match(/<update[^>]*id="javax\.faces\.ViewState"[^>]*>(.*?)<\/update>/s) ||
    html.match(/javax\.faces\.ViewState.*?CDATA\[(.*?)\]/s);

  if (!m) return null;
  let val = m[1];
  if (val.includes('CDATA[')) {
    val = val.split('CDATA[')[1].split(']]>')[0];
  }
  return val.replace(/<.*?>/g, '').trim();
}

// استخراج الصفوف من partial-response
export function extractRowsFromPartial(text: string): string[][] {
  const rows: string[][] = [];
  const updateMatches = text.match(/<update[^>]*id="([^"]*scheduleDtl[^"]*)"[^>]*>(.*?)<\/update>/gs) || [];

  for (const m of updateMatches) {
    const cdataMatch = m.match(/CDATA\[(.*?)\]\]>/s);
    const fragment = cdataMatch ? cdataMatch[1] : m;

    const trMatches = fragment.match(/<tr[^>]*data-ri=[^>]*>(.*?)<\/tr>/gs) || [];
    for (const tr of trMatches) {
      const tdMatches = tr.match(/<td[^>]*>(.*?)<\/td>/gs) || [];
      const cells = tdMatches.map((td) => td.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
      if (cells.length > 0) {
        rows.push(cells);
      }
    }
  }

  return rows;
}

// تنفيذ الـ Web Scraper الكامل كما في extract_schedule.py
export async function runScheduleScraper(collegeId: string = '1'): Promise<ScrapeResult> {
  let cookie = '';

  // 1. فتح الصفحة الرئيسية والحصول على JSESSIONID و ViewState
  const initRes = await fetch(URL, {
    headers: { 'User-Agent': USER_AGENT },
  });

  const setCookie = initRes.headers.get('set-cookie');
  if (setCookie) {
    cookie = setCookie.split(';')[0];
  }

  const initHtml = await initRes.text();
  let viewState = getViewState(initHtml);
  if (!viewState) {
    throw new Error('تعذر العثور على ViewState في الصفحة الرئيسية لموقع الجامعة');
  }

  // 2. إرسال طلب البحث الأولي
  const searchParams = new URLSearchParams({
    'javax.faces.partial.ajax': 'true',
    'javax.faces.source': 'serviceContents:scheduleDtl:j_idt68',
    'javax.faces.partial.execute': '@all',
    'javax.faces.partial.render': 'serviceContents:scheduleDtl serviceContents:msgs',
    'serviceContents:scheduleDtl:j_idt68': 'serviceContents:scheduleDtl:j_idt68',
    serviceContents: 'serviceContents',
    'serviceContents:j_idt62_input': collegeId, // 1 = كلية طب الأسنان
    'serviceContents:depts_input': '',
    'javax.faces.ViewState': viewState,
  });

  const searchRes = await fetch(URL, {
    method: 'POST',
    headers: {
      ...HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: cookie,
    },
    body: searchParams.toString(),
  });

  const searchHtml = await searchRes.text();
  viewState = getViewState(searchHtml) || viewState;

  const rowCountMatch = searchHtml.match(/rowCount:(\d+)/);
  if (!rowCountMatch) {
    throw new Error('لم يتم العثور على عدد المواد في استجابة موقع الجامعة');
  }

  const total = parseInt(rowCountMatch[1], 10);
  const pages = Math.ceil(total / 50);

  // 3. تغيير عدد الصفوف إلى 50 لكل صفحة
  const baseParams = {
    'javax.faces.partial.ajax': 'true',
    'javax.faces.source': 'serviceContents:scheduleDtl',
    'javax.faces.partial.execute': 'serviceContents:scheduleDtl',
    'javax.faces.partial.render': 'serviceContents:scheduleDtl',
    'serviceContents:scheduleDtl': 'serviceContents:scheduleDtl',
    'serviceContents:scheduleDtl_pagination': 'true',
    'serviceContents:scheduleDtl_first': '0',
    'serviceContents:scheduleDtl_rows': '50',
    'serviceContents:scheduleDtl_skipChildren': 'true',
    'serviceContents:scheduleDtl_encodeFeature': 'true',
    serviceContents: 'serviceContents',
    'serviceContents:scheduleDtl_rppDD': '50',
    'javax.faces.ViewState': viewState,
  };

  const set50Res = await fetch(URL, {
    method: 'POST',
    headers: {
      ...HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: cookie,
    },
    body: new URLSearchParams(baseParams).toString(),
  });

  const set50Text = await set50Res.text();
  viewState = getViewState(set50Text) || viewState;

  // 4. تحميل جميع الصفحات
  const allRawRows: string[][] = [];
  for (let page = 0; page < pages; page++) {
    const first = page * 50;
    const pageParams = {
      ...baseParams,
      'serviceContents:scheduleDtl_first': String(first),
      'javax.faces.ViewState': viewState || '',
    };

    const pageRes = await fetch(URL, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Cookie: cookie,
      },
      body: new URLSearchParams(pageParams).toString(),
    });

    const pageText = await pageRes.text();
    const rows = extractRowsFromPartial(pageText);
    allRawRows.push(...rows);
    viewState = getViewState(pageText) || viewState;
  }

  // 5. بناء السجلات والأعمدة كما في Python
  const scrapedRows: ScrapedRow[] = [];
  const uniqueCourses = new Set<string>();

  for (const r of allRawRows) {
    const d: Record<string, string> = {};
    for (let i = 0; i < KEYS.length; i++) {
      d[KEYS[i]] = i < r.length ? r[i] : '';
    }

    const { days, start12, end12, raw } = parseTimeField(d['time']);
    if (d['code']) {
      uniqueCourses.add(d['code']);
    }

    scrapedRows.push({
      code: d['code'] || '',
      name: d['name'] || '',
      activity: d['activity'] || '',
      days: days || '',
      start_time: start12 || '',
      end_time: end12 || '',
      room: d['room'] || '',
      section: d['section'] || '',
      teacher: d['teacher'] || '',
      rawTime: raw,
    });
  }

  // 6. حفظ ملف IUST_schedule_full.csv المحدث على الخادم
  try {
    const csvHeader = 'code,name,activity,days,start_time,end_time,room,section,teacher\n';
    const csvLines = scrapedRows.map((r) => {
      const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      return [
        escape(r.code),
        escape(r.name),
        escape(r.activity),
        escape(r.days),
        escape(r.start_time),
        escape(r.end_time),
        escape(r.room),
        escape(r.section),
        escape(r.teacher),
      ].join(',');
    });

    // Write with UTF-8 BOM (\ufeff)
    const csvContent = '\ufeff' + csvHeader + csvLines.join('\n');
    const csvPath = path.join(process.cwd(), 'IUST_schedule_full.csv');
    fs.writeFileSync(csvPath, csvContent, 'utf-8');
  } catch (fsErr) {
    console.warn('Could not write CSV to disk:', fsErr);
  }

  return {
    success: true,
    totalRows: scrapedRows.length,
    totalCourses: uniqueCourses.size,
    totalSessions: scrapedRows.length,
    rows: scrapedRows,
    timestamp: new Date().toISOString(),
    message: `تم سحب ${scrapedRows.length} شعبة وجلسة لـ ${uniqueCourses.size} مادة دراسية بنجاح من موقع الجامعة مباشرة!`,
  };
}
