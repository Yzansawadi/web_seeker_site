import React, { useState, useMemo } from 'react';
import { Session, DAY_ORDER } from '../types';
import { canonicalDay } from '../utils/scheduleOptimizer';
import { Clock, MapPin, User, Info, X } from 'lucide-react';

export interface OverviewItem {
  courseCode: string;
  courseName: string;
  activity: string;
  section: string;
  session: Session;
  isConflict?: boolean;
}

interface WeeklyOverviewGridProps {
  items: OverviewItem[];
  title?: string;
}

// 9 time slots: 8 AM to 4 PM (covering 8:00 to 17:00)
interface TimeSlot {
  label: string;
  startMin: number;
  endMin: number;
  index: number;
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { label: '8 AM', startMin: 480, endMin: 540, index: 0 },
  { label: '9 AM', startMin: 540, endMin: 600, index: 1 },
  { label: '10 AM', startMin: 600, endMin: 660, index: 2 },
  { label: '11 AM', startMin: 660, endMin: 720, index: 3 },
  { label: '12 PM', startMin: 720, endMin: 780, index: 4 },
  { label: '1 PM', startMin: 780, endMin: 840, index: 5 },
  { label: '2 PM', startMin: 840, endMin: 900, index: 6 },
  { label: '3 PM', startMin: 900, endMin: 960, index: 7 },
  { label: '4 PM', startMin: 960, endMin: 1020, index: 8 },
];

export const WeeklyOverviewGrid: React.FC<WeeklyOverviewGridProps> = ({
  items,
  title = 'نظرة عامة على الأسبوع',
}) => {
  const [selectedItem, setSelectedItem] = useState<OverviewItem | null>(null);

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
      slots.push({ label: '5 PM', startMin: 1020, endMin: 1080, index: 9 });
    }
    if (maxEndMin > 1080) {
      slots.push({ label: '6 PM', startMin: 1080, endMin: 1140, index: 10 });
    }
    return slots;
  }, [items]);

  const totalSlotCols = timeSlots.length;

  // The 5 main university days in order
  const displayDays = useMemo(() => {
    // If Thursday has sessions, include it
    const hasThu = items.some((it) => canonicalDay(it.session.day) === 'الخميس');
    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'];
    if (hasThu) days.push('الخميس');
    return days;
  }, [items]);

  // For each day, compute horizontal column start, span, and vertical lane placement
  const dayLanesData = useMemo(() => {
    const result: Record<
      string,
      {
        totalLanes: number;
        placedItems: {
          item: OverviewItem;
          startCol: number; // 0 to totalSlotCols - 1
          span: number;
          lane: number;
        }[];
      }
    > = {};

    for (const day of displayDays) {
      // Find all items on this day
      const dayItems = items.filter((it) => canonicalDay(it.session.day) === day);

      if (dayItems.length === 0) {
        result[day] = { totalLanes: 1, placedItems: [] };
        continue;
      }

      // Convert each item into startCol and span
      const mapped = dayItems.map((it) => {
        const sMin = it.session.start_min;
        const eMin = it.session.end_min;

        // Find which slots this overlaps
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

      // Sort mapped by start time, then duration
      mapped.sort((a, b) => a.startMin - b.startMin || b.span - a.span);

      // Assign to first available non-overlapping lane
      // laneEndCols[lane] = the rightmost column occupied in that lane
      const laneEndCols: number[] = [];

      for (const m of mapped) {
        let placedLane = -1;
        for (let l = 0; l < laneEndCols.length; l++) {
          if (laneEndCols[l] <= m.startCol) {
            placedLane = l;
            laneEndCols[l] = m.endCol;
            break;
          }
        }
        if (placedLane === -1) {
          placedLane = laneEndCols.length;
          laneEndCols.push(m.endCol);
        }
        m.lane = placedLane;
      }

      result[day] = {
        totalLanes: Math.max(1, laneEndCols.length),
        placedItems: mapped.map((m) => ({
          item: m.item,
          startCol: m.startCol,
          span: m.span,
          lane: m.lane,
        })),
      };
    }

    return result;
  }, [items, displayDays, timeSlots, totalSlotCols]);

  return (
    <div className="space-y-4">
      {/* Overview Top Header: Title and Legend (exact screenshot match) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        {/* Right side in RTL: Title with dark blue accent bar */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#0f2d59] rounded-full shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f2d59] tracking-tight">
            {title}
          </h2>
        </div>

        {/* Left side in RTL: Legend matching screenshot */}
        <div className="flex items-center gap-6 text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">نظري</span>
            <span className="w-4 h-4 rounded-md bg-[#0f2d59] inline-block shadow-2xs" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">عملي</span>
            <span className="w-4 h-4 rounded-md bg-[#2d6096] inline-block shadow-2xs" />
          </div>
        </div>
      </div>

      {/* Main Weekly Table Container with Rounded Outer Border */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-[#547392]/50 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[780px]">
            {/* Header Row: Days Column on right, Time Slots from 8 AM to 4 PM */}
            <div
              className="grid border-b border-[#547392]/40 bg-slate-50/70 text-center text-xs sm:text-sm font-medium text-[#486581]"
              style={{
                gridTemplateColumns: `100px repeat(${totalSlotCols}, minmax(0, 1fr))`,
              }}
            >
              {/* Day Header (Rightmost Column in RTL) */}
              <div className="py-2.5 px-2 font-bold text-[#0f2d59] bg-slate-100/50 border-l border-[#547392]/20">
                اليوم
              </div>

              {/* In RTL: Time slots go 8 AM, 9 AM, ... 4 PM from right to left */}
              {timeSlots.map((slot, idx) => (
                <div
                  key={slot.label}
                  className={`py-2.5 px-1 font-semibold ${
                    idx < timeSlots.length - 1 ? 'border-l border-[#547392]/20' : ''
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
                const laneHeightPx = 36;
                const rowHeight = Math.max(54, dayData.totalLanes * (laneHeightPx + 6) + 16);

                return (
                  <div
                    key={day}
                    className="grid relative hover:bg-slate-50/40 transition-colors"
                    style={{
                      gridTemplateColumns: `100px repeat(${totalSlotCols}, minmax(0, 1fr))`,
                      minHeight: `${rowHeight}px`,
                    }}
                  >
                    {/* Day Name Label (Rightmost Column in RTL) */}
                    <div className="flex items-center justify-center font-bold text-sm sm:text-base text-[#0f2d59] bg-slate-50/50 p-2 select-none border-l border-[#547392]/20">
                      {day}
                    </div>

                    {/* Background Column Grid Lines (Time slots) */}
                    {timeSlots.map((slot, idx) => (
                      <div
                        key={slot.index}
                        className={`h-full pointer-events-none ${
                          idx < timeSlots.length - 1 ? 'border-l border-[#547392]/20' : ''
                        }`}
                      />
                    ))}

                    {/* Overlay Grid for Absolute Positioned / Lane Placed Capsules */}
                    <div
                      className="absolute inset-y-0 left-0 right-[100px] p-2"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${totalSlotCols}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${dayData.totalLanes}, ${laneHeightPx}px)`,
                        gap: '6px',
                        alignContent: 'center',
                      }}
                    >
                      {dayData.placedItems.map(({ item, startCol, span, lane }, idx) => {
                        const isTheory = item.activity === 'نظري';

                        return (
                          <div
                            key={`${item.courseCode}-${item.section}-${idx}`}
                            onClick={() => setSelectedItem(item)}
                            title={`${item.courseName} (${item.activity} - شعبة ${item.section}) | ${item.session.start} - ${item.session.end} | قاعة ${item.session.room || '—'}`}
                            className={`rounded-xl flex items-center justify-center px-2 cursor-pointer transition-all shadow-xs select-none hover:ring-2 hover:ring-amber-300 hover:scale-[1.01] active:scale-[0.99] text-white ${
                              isTheory
                                ? 'bg-[#0f2d59] hover:bg-[#163868]'
                                : 'bg-[#2d6096] hover:bg-[#3871ad]'
                            }`}
                            style={{
                              // In RTL: column 1 is 8 AM (startCol 0), column totalSlotCols is 4 PM
                              gridColumnStart: startCol + 1,
                              gridColumnEnd: startCol + span + 1,
                              gridRowStart: lane + 1,
                              gridRowEnd: lane + 2,
                            }}
                          >
                            <span className="font-bold text-[11px] sm:text-xs truncate text-center leading-none">
                              {item.courseName}
                            </span>
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
      </div>

      {/* Course Detail Modal when clicking on any capsule */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 text-right space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    selectedItem.activity === 'نظري'
                      ? 'bg-[#0f2d59] text-white'
                      : 'bg-[#2d6096] text-white'
                  }`}
                >
                  {selectedItem.activity}
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  {selectedItem.courseCode}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 leading-snug">
                {selectedItem.courseName}
              </h3>
              {selectedItem.section && (
                <span className="inline-block mt-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                  شعبة {selectedItem.section}
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">
                  {selectedItem.session.day}: {selectedItem.session.start} - {selectedItem.session.end}
                </span>
              </div>
              {selectedItem.session.room && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>القاعة: {selectedItem.session.room}</span>
                </div>
              )}
              {selectedItem.session.teacher && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  <span>المدرس: {selectedItem.session.teacher}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
