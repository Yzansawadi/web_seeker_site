import * as XLSX from 'xlsx';
import { Course, DAY_ORDER, Session } from '../types';
import { canonicalDay } from './scheduleOptimizer';

const DAY_EN: Record<string, string> = {
  'السبت': 'Saturday',
  'الأحد': 'Sunday',
  'الاثنين': 'Monday',
  'الثلاثاء': 'Tuesday',
  'الأربعاء': 'Wednesday',
  'الخميس': 'Thursday',
  'الجمعة': 'Friday',
};

export function timeToMinutes(t: string | undefined): number {
  if (!t) return 24 * 60;
  const str = String(t).trim();
  const m = str.match(/^(\d{1,2}):(\d{2})(?::00)?\s*([AP]M)?$/i);
  if (!m) return 24 * 60;
  let h = parseInt(m[1], 10);
  const mins = parseInt(m[2], 10);
  const ampm = (m[3] || '').toUpperCase();
  if (mins > 59 || (ampm && (h < 1 || h > 12)) || (!ampm && h > 23)) {
    return 24 * 60;
  }
  if (ampm) {
    h = (h % 12) + (ampm === 'PM' ? 12 : 0);
  }
  return h * 60 + mins;
}

export function splitDays(daysField: string | undefined): string[] {
  if (!daysField) return [];
  const parts = String(daysField)
    .split(/[\/\,\-\+]/)
    .map((p) => p.trim())
    .filter(Boolean);

  const aliases: Record<string, string> = {
    'الاحد': 'الأحد',
    'الإثنين': 'الاثنين',
    'الاربعاء': 'الأربعاء',
  };
  for (const [ar, en] of Object.entries(DAY_EN)) {
    aliases[en.toLowerCase()] = ar;
  }

  const result: string[] = [];
  for (const p of parts) {
    const norm = aliases[p.toLowerCase()] || aliases[p] || canonicalDay(p);
    if (!result.includes(norm)) {
      result.push(norm);
    }
  }
  return result;
}

export interface ParseResult {
  updatedData: Record<number, Record<string, Course>>;
  totalSessions: number;
  totalCourses: number;
  message: string;
}

export function parseScheduleRows(
  rows: Record<string, any>[],
  baseData: Record<number, Record<string, Course>>
): ParseResult {
  // Deep clone baseData
  const newData: Record<number, Record<string, Course>> = JSON.parse(
    JSON.stringify(baseData)
  );

  // Clear existing sessions to reload fresh if table is a full schedule
  for (const year of Object.keys(newData)) {
    for (const c of Object.values(newData[Number(year)])) {
      c.sessions = [];
    }
  }

  let totalSessions = 0;

  for (const row of rows) {
    // Look up code by common column names or stripped BOM
    const rawCode =
      row.code ||
      row['\ufeffcode'] ||
      row['الرمز'] ||
      row['رمز المادة'] ||
      row['كود المادة'] ||
      row['رقم المادة'] ||
      row['Code'];

    if (!rawCode) continue;

    const codeStr = String(rawCode).trim().replace(/^0+/, '') || String(rawCode).trim();

    // Find course in newData
    let targetCourse: Course | undefined;
    for (const y of Object.keys(newData)) {
      if (newData[Number(y)][codeStr]) {
        targetCourse = newData[Number(y)][codeStr];
        break;
      }
    }

    const courseName =
      row.name || row['اسم المادة'] || row['المادة'] || row['Name'] || '';
    const activity =
      row.activity || row['النشاط'] || row['نوع النشاط'] || row['Activity'] || 'نظري';
    const startTime =
      row.start_time || row['بداية الوقت'] || row['وقت البداية'] || row['Start'] || '';
    const endTime =
      row.end_time || row['نهاية الوقت'] || row['وقت النهاية'] || row['End'] || '';
    const room = row.room || row['القاعة'] || row['قاعة'] || row['Room'] || '';
    const section =
      row.section || row['الشعبة'] || row['شعبة'] || row['Section'] || '1';
    const teacher =
      row.teacher || row['المدرس'] || row['أستاذ المادة'] || row['Teacher'] || '';
    const rawDays =
      row.days || row['الأيام'] || row['اليوم'] || row['Days'] || '';

    if (!targetCourse) {
      // Add as year 0 / general if not found
      if (!newData[0]) newData[0] = {};
      targetCourse = {
        code: codeStr,
        name: courseName || `مادة ${codeStr}`,
        year: 0,
        sessions: [],
      };
      newData[0][codeStr] = targetCourse;
    }

    const daysList = splitDays(rawDays);
    const effectiveDays = daysList.length > 0 ? daysList : ['السبت'];

    for (const d of effectiveDays) {
      targetCourse.sessions.push({
        day: d,
        activity: activity.trim(),
        start: startTime.trim(),
        end: endTime.trim(),
        start_min: timeToMinutes(startTime),
        end_min: timeToMinutes(endTime),
        room: room.trim(),
        section: section.trim(),
        teacher: teacher.trim(),
      });
      totalSessions++;
    }
  }

  let totalCourses = 0;
  for (const year of Object.keys(newData)) {
    for (const c of Object.values(newData[Number(year)])) {
      if (c.sessions.length > 0) totalCourses++;
    }
  }

  return {
    updatedData: newData,
    totalSessions,
    totalCourses,
    message: `تمت معالجة وتحديث ${totalSessions} جلسة أسبوعية لـ ${totalCourses} مادة بنجاح.`,
  };
}

export function parseCsvContent(
  csvText: string,
  baseData: Record<number, Record<string, Course>>
): ParseResult {
  const cleanText = csvText.replace(/^\ufeff/, '');
  const workbook = XLSX.read(cleanText, { type: 'string' });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName]);
  return parseScheduleRows(rows, baseData);
}

export function parseTextOrHtmlContent(
  text: string,
  baseData: Record<number, Record<string, Course>>
): ParseResult {
  const cleanText = text.replace(/^\ufeff/, '').trim();
  // Try reading as table / sheet
  const workbook = XLSX.read(cleanText, { type: 'string' });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName]);
  return parseScheduleRows(rows, baseData);
}

export async function fetchAndParseScheduleUrl(
  url: string,
  baseData: Record<number, Record<string, Course>>
): Promise<ParseResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`تعذر جلب الرابط (رمز الاستجابة: ${response.status} ${response.statusText})`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (
    contentType.includes('application/vnd.openxmlformats') ||
    contentType.includes('application/vnd.ms-excel') ||
    url.endsWith('.xlsx') ||
    url.endsWith('.xls')
  ) {
    const buffer = await response.arrayBuffer();
    return parseXlsxContent(buffer, baseData);
  } else {
    const text = await response.text();
    return parseTextOrHtmlContent(text, baseData);
  }
}

export function parseXlsxContent(
  buffer: ArrayBuffer,
  baseData: Record<number, Record<string, Course>>
): ParseResult {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName]);
  return parseScheduleRows(rows, baseData);
}

export function parseScrapedRows(
  rows: any[],
  baseData: Record<number, Record<string, Course>>
): ParseResult {
  return parseScheduleRows(rows, baseData);
}

