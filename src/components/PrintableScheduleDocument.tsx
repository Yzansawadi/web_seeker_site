import React, { useMemo } from 'react';
import { Session, DAY_ORDER } from '../types';
import { canonicalDay } from '../utils/scheduleOptimizer';

export interface PrintableTimetableItem {
  courseCode: string;
  courseName: string;
  activity: string;
  section: string;
  session: Session;
  isConflict?: boolean;
}

interface PrintableScheduleDocumentProps {
  items: PrintableTimetableItem[];
  title?: string;
  subtitle?: string;
  isOptimized?: boolean;
}

interface TimeSlot {
  label: string;
  startMin: number;
  endMin: number;
  index: number;
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { label: '8:00 ص', startMin: 480, endMin: 540, index: 0 },
  { label: '9:00 ص', startMin: 540, endMin: 600, index: 1 },
  { label: '10:00 ص', startMin: 600, endMin: 660, index: 2 },
  { label: '11:00 ص', startMin: 660, endMin: 720, index: 3 },
  { label: '12:00 م', startMin: 720, endMin: 780, index: 4 },
  { label: '1:00 م', startMin: 780, endMin: 840, index: 5 },
  { label: '2:00 م', startMin: 840, endMin: 900, index: 6 },
  { label: '3:00 م', startMin: 900, endMin: 960, index: 7 },
  { label: '4:00 م', startMin: 960, endMin: 1020, index: 8 },
];

// ارتفاع الكبسولة: يجب أن يتسع لسطرين بخط عربي (Cairo) دون قصّ الحروف
const LANE_HEIGHT_PX = 44;
const LANE_GAP_PX = 4;

export const PrintableScheduleDocument: React.FC<PrintableScheduleDocumentProps> = ({
  items,
  title = 'جدول الأسبوع الأكاديمي',
  subtitle,
  isOptimized = false,
}) => {
  // Check if any session goes past 5 PM (1020 mins)
  const timeSlots = useMemo(() => {
    let maxEndMin = 1020;
    for (const it of items) {
      if (it.session.end_min > maxEndMin) {
        maxEndMin = it.session.end_min;
      }
    }
    const slots = [...DEFAULT_TIME_SLOTS];
    if (maxEndMin > 1020) {
      slots.push({ label: '5:00 م', startMin: 1020, endMin: 1080, index: 9 });
    }
    if (maxEndMin > 1080) {
      slots.push({ label: '6:00 م', startMin: 1080, endMin: 1140, index: 10 });
    }
    return slots;
  }, [items]);

  const totalSlotCols = timeSlots.length;

  // The university days in order
  const displayDays = useMemo(() => {
    const hasThu = items.some((it) => canonicalDay(it.session.day) === 'الخميس');
    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'];
    if (hasThu) days.push('الخميس');
    return days;
  }, [items]);

  // Compute lanes for each day
  const dayLanesData = useMemo(() => {
    const result: Record<
      string,
      {
        totalLanes: number;
        placedItems: {
          item: PrintableTimetableItem;
          startCol: number;
          span: number;
          lane: number;
        }[];
      }
    > = {};

    for (const day of displayDays) {
      const dayItems = items.filter((it) => canonicalDay(it.session.day) === day);

      if (dayItems.length === 0) {
        result[day] = { totalLanes: 1, placedItems: [] };
        continue;
      }

      const mapped = dayItems.map((it) => {
        const sMin = it.session.start_min;
        const eMin = it.session.end_min;

        let startCol = 0;
        let endCol = totalSlotCols;

        for (let i = 0; i < timeSlots.length; i++) {
          if (sMin < timeSlots[i].endMin) {
            startCol = i;
            break;
          }
        }

        for (let i = timeSlots.length - 1; i >= 0; i--) {
          if (eMin > timeSlots[i].startMin) {
            endCol = i + 1;
            break;
          }
        }

        const span = Math.max(1, endCol - startCol);

        return {
          item: it,
          startCol,
          endCol,
          span,
          startMin: sMin,
          endMin: eMin,
          lane: 0,
        };
      });

      mapped.sort((a, b) => a.startMin - b.startMin || b.span - a.span);

      const laneEndCols: number[] = [];
      for (const m of mapped) {
        let assignedLane = -1;
        for (let l = 0; l < laneEndCols.length; l++) {
          if (m.startCol >= laneEndCols[l]) {
            assignedLane = l;
            laneEndCols[l] = m.endCol;
            break;
          }
        }

        if (assignedLane === -1) {
          assignedLane = laneEndCols.length;
          laneEndCols.push(m.endCol);
        }

        m.lane = assignedLane;
      }

      result[day] = {
        totalLanes: Math.max(1, laneEndCols.length),
        placedItems: mapped,
      };
    }

    return result;
  }, [displayDays, items, timeSlots, totalSlotCols]);

  // Statistics
  const activeDays = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => set.add(canonicalDay(it.session.day)));
    return Array.from(set);
  }, [items]);

  const uniqueCourses = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((it) => map.set(it.courseCode, it.courseName));
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, [items]);

  const currentDate = new Date().toLocaleDateString('ar-SY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      id="printable-schedule-document"
      className="print-document-root font-['Cairo',sans-serif] text-slate-900 bg-white box-border w-full max-w-full"
      dir="rtl"
      style={{ boxSizing: 'border-box' }}
    >
      {/* ========================================================================= */}
      {/* PAGE 1: The Official Schedule Grid (Exact A4 Landscape fit)              */}
      {/* ========================================================================= */}
      <div className="print-page-1 print-avoid-break flex flex-col justify-between p-3.5 bg-white border border-slate-300 rounded-lg mb-4 print:border-0 print:p-0 print:mb-0 box-border w-full">
        <div>
          {/* Academic Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#0f2d59]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#0f2d59] text-white flex flex-col items-center justify-center font-bold text-sm leading-none shadow-xs">
                <span>IUST</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">
                  الجامعة الدولية الخاصة للعلوم والتكنولوجيا (IUST)
                </h1>
                <p className="text-[11px] text-slate-600 font-semibold">
                  كلية طب الأسنان • جدول الفصل الدراسي الأكاديمي
                </p>
              </div>
            </div>

            <div className="text-left text-xs space-y-0.5">
              <div className="font-bold text-[#0f2d59] text-xs">{title}</div>
              <div className="text-slate-500 text-[10px]">تاريخ الاستخراج: {currentDate}</div>
              {isOptimized && (
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                  جدول مثالي منسّق بدون تعارض ✓
                </span>
              )}
            </div>
          </div>

          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-4 gap-1.5 mb-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-center text-[10px]">
            <div>
              <span className="text-slate-500 block text-[9px]">أيام الدوام</span>
              <span className="font-bold text-slate-900 text-[10.5px]">
                {activeDays.length} أيام ({activeDays.join(' • ')})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">المواد المسجلة</span>
              <span className="font-bold text-slate-900 text-[10.5px]">{uniqueCourses.length} مقررات</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">الجلسات الأسبوعية</span>
              <span className="font-bold text-slate-900 text-[10.5px]">{items.length} شعبة ونشاط</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">مفتاح الألوان</span>
              <div className="flex items-center justify-center gap-2 pt-0.5 font-bold text-[10px]">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-[#0f2d59] inline-block" />
                  <span>نظري</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-[#2d6096] inline-block" />
                  <span>عملي</span>
                </span>
              </div>
            </div>
          </div>

          {/* Schedule Grid Box (Enclosed & Perfectly Scaled to Fit within margins) */}
          <div className="rounded-lg border border-[#547392]/60 overflow-hidden bg-white shadow-2xs w-full box-border">
            {/* Header Row: Days + Time Slots */}
            <div
              className="grid border-b border-[#547392]/50 bg-slate-100 text-center text-[10px] font-bold text-[#0f2d59] w-full"
              style={{
                gridTemplateColumns: `72px repeat(${totalSlotCols}, minmax(0, 1fr))`,
              }}
            >
              <div className="py-1.5 px-1 bg-slate-200/80 border-l border-[#547392]/30">اليوم</div>
              {timeSlots.map((slot, idx) => (
                <div
                  key={slot.label}
                  className={`py-1.5 px-0.5 font-bold ${
                    idx < timeSlots.length - 1 ? 'border-l border-[#547392]/30' : ''
                  }`}
                >
                  {slot.label}
                </div>
              ))}
            </div>

            {/* Day Rows */}
            <div className="divide-y divide-[#547392]/30">
              {displayDays.map((day) => {
                const dayData = dayLanesData[day] || { totalLanes: 1, placedItems: [] };
                const rowHeight = Math.max(
                  52,
                  dayData.totalLanes * (LANE_HEIGHT_PX + LANE_GAP_PX) + 8
                );

                return (
                  <div
                    key={day}
                    className="grid relative w-full"
                    style={{
                      gridTemplateColumns: `72px repeat(${totalSlotCols}, minmax(0, 1fr))`,
                      minHeight: `${rowHeight}px`,
                    }}
                  >
                    {/* Day Name */}
                    <div className="flex items-center justify-center font-bold text-[11px] text-[#0f2d59] bg-slate-50/90 border-l border-[#547392]/30 select-none">
                      {day}
                    </div>

                    {/* Background Column Grid Lines */}
                    {timeSlots.map((slot, idx) => (
                      <div
                        key={slot.index}
                        className={`h-full pointer-events-none ${
                          idx < timeSlots.length - 1 ? 'border-l border-[#547392]/20' : ''
                        }`}
                      />
                    ))}

                    {/* Capsule Placed Grid */}
                    <div
                      className="absolute inset-y-0 left-0 right-[72px] p-1"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${totalSlotCols}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${dayData.totalLanes}, ${LANE_HEIGHT_PX}px)`,
                        gap: `${LANE_GAP_PX}px`,
                        alignContent: 'center',
                      }}
                    >
                      {dayData.placedItems.map(({ item, startCol, span, lane }, idx) => {
                        const isTheory = item.activity === 'نظري';

                        return (
                          <div
                            key={`${item.courseCode}-${item.section}-${idx}`}
                            className={`rounded-md flex flex-col justify-center px-1.5 text-white overflow-hidden ${
                              isTheory ? 'bg-[#0f2d59]' : 'bg-[#2d6096]'
                            }`}
                            style={{
                              gridColumnStart: startCol + 1,
                              gridColumnEnd: startCol + span + 1,
                              gridRowStart: lane + 1,
                              gridRowEnd: lane + 2,
                            }}
                          >
                            {/* سطر الاسم: line-height كبير حتى لا تُقصّ نقاط وأطراف الحروف العربية */}
                            <div
                              className="font-bold text-center whitespace-nowrap overflow-hidden text-ellipsis"
                              style={{ fontSize: '11px', lineHeight: '18px' }}
                            >
                              {item.courseName}
                            </div>
                            <div
                              className="flex items-center justify-center gap-1 text-white/90 whitespace-nowrap"
                              style={{ fontSize: '9px', lineHeight: '14px' }}
                            >
                              <span>
                                {item.activity} {item.section ? `(ش${item.section})` : ''}
                              </span>
                              {item.session.room && <span>• {item.session.room}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer for Page 1 */}
        <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 font-medium">
          <span>الجامعة الدولية الخاصة للعلوم والتكنولوجيا (IUST) • الصفحة 1 من 2 (الجدول الأسبوعي)</span>
          <span>منظّم ومولّد أفضل جدول أسبوعي ذكي • IUST Schedule Optimizer</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: Detailed Registered Courses Table (Guaranteed Clean Break)        */}
      {/* ========================================================================= */}
      <div className="print-page-2 print-page-break p-3.5 bg-white border border-slate-300 rounded-lg print:border-0 print:p-0 box-border w-full">
        {/* Table Page Header */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-[#0f2d59]">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              جدول تفاصيل المقررات والشُعب المعتمدة والقاعات
            </h2>
            <p className="text-[10px] text-slate-600 font-medium">
              البيانات الأكاديمية الكاملة لجميع جلسات ومحاضرات الفصل الدراسي
            </p>
          </div>
          <div className="text-left text-[11px] font-bold text-[#0f2d59]">
            {uniqueCourses.length} مواد مسجلة • {items.length} جلسة أسبوعية
          </div>
        </div>

        {/* Proportional Table with 100% Fixed Width */}
        <div className="w-full overflow-hidden rounded-md border border-slate-300">
          <table className="w-full table-fixed text-right text-[10px] border-collapse">
            <thead>
              <tr className="bg-[#0f2d59] text-white font-bold text-[10px]">
                <th style={{ width: '4%' }} className="py-2 px-1 border border-slate-300 text-center">#</th>
                <th style={{ width: '9%' }} className="py-2 px-1 border border-slate-300 text-center">الرمز</th>
                <th style={{ width: '27%' }} className="py-2 px-2 border border-slate-300">اسم المقرر الدراسي</th>
                <th style={{ width: '8%' }} className="py-2 px-1 border border-slate-300 text-center">النشاط</th>
                <th style={{ width: '6%' }} className="py-2 px-1 border border-slate-300 text-center">الشعبة</th>
                <th style={{ width: '9%' }} className="py-2 px-1 border border-slate-300 text-center">اليوم</th>
                <th style={{ width: '13%' }} className="py-2 px-1 border border-slate-300 text-center">التوقيت</th>
                <th style={{ width: '11%' }} className="py-2 px-1 border border-slate-300 text-center">القاعة/المخبر</th>
                <th style={{ width: '13%' }} className="py-2 px-1.5 border border-slate-300">المدرس</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const isTheory = it.activity === 'نظري';
                return (
                  <tr
                    key={`${it.courseCode}-${it.section}-${it.session.day}-${idx}`}
                    className={`print-avoid-break ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                  >
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-mono font-bold text-slate-800 text-[9.5px]">
                      {it.courseCode}
                    </td>
                    <td
                      className="py-1.5 px-2 border border-slate-300 font-bold text-slate-900"
                      style={{ lineHeight: '1.6' }}
                    >
                      {it.courseName}
                    </td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold text-white ${
                          isTheory ? 'bg-[#0f2d59]' : 'bg-[#2d6096]'
                        }`}
                        style={{ lineHeight: '1.6' }}
                      >
                        {it.activity}
                      </span>
                    </td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-bold text-slate-800">
                      {it.section || '—'}
                    </td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-semibold text-slate-800">
                      {it.session.day}
                    </td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-mono font-medium text-slate-800 dir-ltr text-[9px]">
                      {it.session.start} - {it.session.end}
                    </td>
                    <td
                      className="py-1.5 px-1 border border-slate-300 text-center font-medium text-slate-700"
                      style={{ lineHeight: '1.6' }}
                    >
                      {it.session.room || '—'}
                    </td>
                    <td
                      className="py-1.5 px-1.5 border border-slate-300 text-slate-700"
                      style={{ lineHeight: '1.6' }}
                    >
                      {it.session.teacher || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Notes & Student Instructions */}
        <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-md text-[9.5px] space-y-0.5 print-avoid-break">
          <p className="font-bold text-slate-800">ملاحظات أكاديمية هامة:</p>
          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
            <li>يرجى الالتزام التام بالقاعات والشُعب المحددة أعلاه لكل جلسة مخبرية أو نظرية.</li>
            <li>في حال طرأ أي تعديل من إدارة الكلية، يمكنك إعادة فحص جدولك عبر نظام IUST الذكي.</li>
          </ul>
        </div>

        {/* Footer for Page 2 */}
        <div className="pt-2 mt-3 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 font-medium">
          <span>الجامعة الدولية الخاصة للعلوم والتكنولوجيا (IUST) • الصفحة 2 من 2 (قائمة المواد والشُعب)</span>
          <span>ختم واعتماد الطالب: .......................................</span>
        </div>
      </div>
    </div>
  );
};
