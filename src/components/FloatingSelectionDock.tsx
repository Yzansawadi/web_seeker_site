import React, { useState } from 'react';
import { Sparkles, Calendar, Trash2, ChevronUp, ChevronDown, X, Eye, EyeOff } from 'lucide-react';
import { Course } from '../types';

interface FloatingSelectionDockProps {
  selectedCourses: Course[];
  showSchedulePreview: boolean;
  onToggleViewSchedule: () => void;
  onOptimizeSchedule: () => void;
  onClearSelection: () => void;
  onRemoveCourse: (code: string) => void;
}

export const FloatingSelectionDock: React.FC<FloatingSelectionDockProps> = ({
  selectedCourses,
  showSchedulePreview,
  onToggleViewSchedule,
  onOptimizeSchedule,
  onClearSelection,
  onRemoveCourse,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (selectedCourses.length === 0) return null;

  return (
    <aside
      aria-label="شريط المواد المختارة العائم"
      className="fixed bottom-2 sm:bottom-6 inset-x-0 z-40 max-w-xl mx-auto px-2.5 sm:px-4 pointer-events-none no-print w-full"
    >
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/90 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ring-1 ring-white/10 w-full box-border">
        {/* Expanded mini-list of selected courses */}
        {isExpanded && (
          <div className="p-2.5 sm:p-3 bg-slate-950/90 border-b border-slate-800 max-h-44 overflow-y-auto divide-y divide-slate-800/60">
            <div className="flex items-center justify-between pb-2 mb-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                المواد المختارة ({selectedCourses.length}):
              </span>
              <button
                onClick={onClearSelection}
                className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1 active:scale-95 transition-transform"
              >
                <Trash2 className="w-3 h-3" />
                <span>إلغاء الكل</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedCourses.map((c) => (
                <span
                  key={c.code}
                  className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] sm:text-xs"
                >
                  <span className="font-mono text-[10px] sm:text-[11px] text-blue-400 font-semibold">{c.code}</span>
                  <span className="truncate max-w-[110px] sm:max-w-[150px]">{c.name}</span>
                  <button
                    onClick={() => onRemoveCourse(c.code)}
                    className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors"
                    title="إزالة المادة"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main Floating Bar: Fully Fluid & Dynamically Scaled on All Screen Sizes */}
        <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1.5 sm:gap-3 w-full box-border">
          {/* Selected Count & Expand Trigger (Right side in RTL) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 sm:gap-2 text-right hover:bg-slate-800/80 px-1 sm:px-2 py-1 rounded-xl transition-colors shrink-0 group"
            title="اضغط لاستعراض أو إخفاء أسماء المواد المختارة"
          >
            <div className="relative shrink-0">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xs group-hover:scale-105 transition-transform">
                {selectedCourses.length}
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
            </div>

            <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-slate-100 whitespace-nowrap">
              <span className="hidden sm:inline">{selectedCourses.length} مواد مختارة</span>
              <span className="sm:hidden text-xs">{selectedCourses.length} مواد</span>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </div>
          </button>

          {/* Action Buttons: Dynamically sized & never overflowing (Left side in RTL) */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end min-w-0">
            {/* 1. Clear / Reset Button */}
            <button
              onClick={onClearSelection}
              className="flex items-center justify-center gap-1 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-2 rounded-xl transition-all shadow-2xs active:scale-95 shrink-0"
              title="تصفير وحذف جميع المواد المختارة"
              aria-label="تصفير وحذف جميع المواد المختارة"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="hidden sm:inline">تصفير</span>
            </button>

            {/* 2. View / Hide Schedule Preview Button */}
            <button
              onClick={onToggleViewSchedule}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 text-xs font-semibold w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-xl transition-all border shrink-0 ${
                showSchedulePreview
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
              }`}
              title={showSchedulePreview ? 'إخفاء جدول الأوقات بالأسفل' : 'عرض جدول أوقات المواد بالأسفل'}
              aria-label={showSchedulePreview ? 'إخفاء جدول الأوقات' : 'عرض جدول الأوقات'}
            >
              {showSchedulePreview ? (
                <EyeOff className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              )}
              <span className="hidden sm:inline">
                {showSchedulePreview ? 'إخفاء الأوقات' : 'عرض الأوقات'}
              </span>
            </button>

            {/* 3. Primary Action Button: "توليد أفضل جدول" (Fluid & Dynamically Scaled) */}
            <button
              onClick={onOptimizeSchedule}
              className="flex-1 sm:flex-initial min-w-[105px] max-w-[200px] h-8 sm:h-auto flex items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-2.5 sm:px-4 sm:py-2 rounded-xl shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30 overflow-hidden"
              title="توليد أفضل جدول متناسق أوتوماتيكياً بدون أي تعارض زمني"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0 animate-pulse" />
              <span className="truncate whitespace-nowrap hidden sm:inline">توليد أفضل جدول</span>
              <span className="truncate whitespace-nowrap sm:hidden font-bold text-xs">توليد الجدول</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
