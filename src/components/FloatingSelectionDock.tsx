import React, { useState } from 'react';
import { Sparkles, Calendar, Trash2, ChevronUp, ChevronDown, BookOpen, X } from 'lucide-react';
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
      aria-label="قائمة المواد المختارة العائمة"
      className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 max-w-2xl mx-auto px-3 sm:px-4 pointer-events-none no-print"
    >
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/90 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ring-1 ring-white/10">
        {/* Expanded mini-list of selected courses if user clicks the count */}
        {isExpanded && (
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 max-h-48 overflow-y-auto divide-y divide-slate-800/60">
            <div className="flex items-center justify-between pb-2 mb-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">المواد المحددة ({selectedCourses.length}):</span>
              <button
                onClick={onClearSelection}
                className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>إلغاء الكل</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedCourses.map((c) => (
                <span
                  key={c.code}
                  className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs"
                >
                  <span className="font-mono text-[11px] text-blue-400">{c.code}</span>
                  <span className="truncate max-w-[130px]">{c.name}</span>
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

        {/* Main Floating Bar */}
        <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:gap-3">
          {/* Selected Count & Expand Trigger */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-right hover:bg-slate-800/80 px-2 py-1.5 rounded-xl transition-colors shrink-0 group"
            title="اضغط لاستعراض أسماء المواد المختارة"
          >
            <div className="relative">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xs group-hover:scale-105 transition-transform">
                {selectedCourses.length}
              </span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-slate-100">
                <span>{selectedCourses.length} مواد مختارة</span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {isExpanded ? 'إخفاء أسماء المواد' : 'اضغط لعرض المواد'}
              </p>
            </div>
          </button>

          {/* Action Buttons: Clear, View Schedule & Generate Timetable */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Clear / Reset Button */}
            <button
              onClick={onClearSelection}
              className="flex items-center gap-1 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 px-2 sm:px-2.5 py-2 rounded-xl transition-all shadow-2xs active:scale-95"
              title="تصفير وحذف جميع المواد المختارة"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>تصفير</span>
            </button>

            {/* View / Hide Schedule Button */}
            <button
              onClick={onToggleViewSchedule}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2 sm:px-3 py-2 rounded-xl transition-all border ${
                showSchedulePreview
                  ? 'bg-slate-800 text-blue-300 border-blue-500/50 shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
              }`}
              title={showSchedulePreview ? 'إخفاء جدول الأوقات' : 'عرض أوقات المواد بالجدول'}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden xs:inline">
                {showSchedulePreview ? 'إخفاء الأوقات' : 'عرض الأوقات'}
              </span>
              <span className="xs:hidden">{showSchedulePreview ? 'إخفاء' : 'الأوقات'}</span>
            </button>

            {/* Optimize Button */}
            <button
              onClick={onOptimizeSchedule}
              className="flex items-center gap-1.5 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-3 sm:px-4 py-2 rounded-xl shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30"
              title="توليد أفضل جدول متناسق أوتوماتيكياً بدون أي تعارض زمني"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0 animate-pulse" />
              <span className="hidden sm:inline">توليد أفضل جدول</span>
              <span className="sm:hidden">توليد الجدول</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
