import { Course, DAY_ORDER, ScheduleAssignment, Session } from '../types';
import { canonicalDay } from './scheduleOptimizer';

export function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : `${m}`;
  return `${displayH}:${displayM} ${ampm}`;
}

export function formatTimeRange(startMin: number, endMin: number): string {
  return `${formatMinutes(startMin)} - ${formatMinutes(endMin)}`;
}

/** Formats a schedule into the clean text layout used in the original Telegram bot */
export function formatScheduleAsText(
  title: string,
  assignments: { courseName: string; activity: string; section: string; session: Session }[]
): string {
  const byDay: Record<string, typeof assignments> = {};
  for (const item of assignments) {
    const day = canonicalDay(item.session.day);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(item);
  }

  let text = `📅 ${title}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  let totalClasses = 0;

  for (const day of DAY_ORDER) {
    const list = byDay[day];
    if (!list || list.length === 0) continue;

    // sort by start_min
    list.sort((a, b) => a.session.start_min - b.session.start_min);
    totalClasses += list.length;

    text += `🔹 ${day}:\n`;
    for (const item of list) {
      const s = item.session;
      const act = s.activity ? `[${s.activity}]` : '';
      const sec = s.section ? `(شعبة ${s.section})` : '';
      const time = s.start && s.end ? `${s.start} - ${s.end}` : formatTimeRange(s.start_min, s.end_min);
      const room = s.room ? ` | قاعة: ${s.room}` : '';
      const teacher = s.teacher ? ` | د. ${s.teacher}` : '';

      text += `  • ${item.courseName} ${act} ${sec}\n`;
      text += `    ⏰ ${time}${room}${teacher}\n`;
    }
    text += `\n`;
  }

  if (totalClasses === 0) {
    text += `لا توجد جلسات مجدولة.\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `نظام جدول مواد جامعة IUST الدولية للعلوم والتكنولوجيا\n`;

  return text;
}
