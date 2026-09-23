import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { Search, Check, Plus, Trash2, Calendar, Sparkles, AlertCircle, BookOpen } from 'lucide-react';

interface YearCourseSelectorProps {
  coursesByYear: Record<number, Course[]>;
  selectedCourses: Course[];
  showSchedulePreview?: boolean;
  onToggleCourse: (course: Course) => void;
  onRemoveCourse: (courseCode: string) => void;
  onClearSelection: () => void;
  onViewSchedule: () => void;
  onOptimizeSchedule: () => void;
}

const YEAR_LABELS: { year: number; title: string; subtitle: string }[] = [
  { year: 1, title: 'السنة الأولى', subtitle: 'العلوم الطبية التأسيسية' },
  { year: 2, title: 'السنة الثانية', subtitle: 'طب الأسنان ما قبل السريري' },
  { year: 3, title: 'السنة الثالثة', subtitle: 'العلوم السريرية والتعويضات' },
  { year: 4, title: 'السنة الرابعة', subtitle: 'المداواة والعيادات المتقدمة' },
  { year: 5, title: 'السنة الخامسة', subtitle: 'سنة التخرج والتدريب السريري' },
];

export const YearCourseSelector: React.FC<YearCourseSelectorProps> = ({
  coursesByYear,
  selectedCourses,
  showSchedulePreview = false,
  onToggleCourse,
  onRemoveCourse,
  onClearSelection,
  onViewSchedule,
  onOptimizeSchedule,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedCodes = useMemo(
    () => new Set(selectedCourses.map((c) => String(c.code).trim())),
    [selectedCourses]
  );

  const currentYearCourses = useMemo(() => {
    const list = coursesByYear[selectedYear] || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        String(c.code).toLowerCase().includes(q)
    );
  }, [coursesByYear, selectedYear, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Selected Courses Drawer / Box */}
      {selectedCourses.length > 0 ? (
        <div className="bg-gradient-to-l from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                {selectedCourses.length}
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  المواد المختارة للتسجيل ({selectedCourses.length} مواد)
                </h3>
                <p className="text-xs text-slate-500">
                  يمكنك استعراض مواعيدها أو ترك المحرك يختار لك أفضل شُعب متوافقة تلقائيًا
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={onClearSelection}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-100/50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                title="إلغاء كل المواد المختارة"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>تصفير</span>
              </button>

              <button
                onClick={onViewSchedule}
                className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border transition-colors shrink-0 ${
                  showSchedulePreview
                    ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
                }`}
                title={showSchedulePreview ? 'إخفاء جدول أوقات المواد بالأسفل' : 'عرض جدول أوقات المواد بالأسفل'}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{showSchedulePreview ? 'إخفاء الأوقات' : 'عرض الأوقات'}</span>
              </button>

              <button
                onClick={onOptimizeSchedule}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-3 sm:px-4 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 min-w-[100px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="hidden sm:inline">توليد أفضل جدول</span>
                <span className="sm:hidden">توليد الجدول</span>
              </button>
            </div>
          </div>

          {/* Chips of chosen courses */}
          <div className="flex flex-wrap gap-2 pt-3">
            {selectedCourses.map((c) => (
              <span
                key={c.code}
                className="inline-flex items-center gap-1.5 bg-white text-slate-800 border border-blue-200/90 rounded-xl px-3 py-1 text-xs font-medium shadow-2xs"
              >
                <span className="font-mono text-[11px] text-blue-600 font-semibold">{c.code}</span>
                <span>{c.name}</span>
                <button
                  onClick={() => onRemoveCourse(c.code)}
                  className="text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 p-0.5 transition-colors"
                  title="حذف هذه المادة"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-4 sm:p-5 text-center shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-slate-600 text-xs sm:text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
              0
            </span>
            <span className="font-medium">
              لم يتم اختيار أي مواد بعد (0 مادة). اختر سنتك الدراسية بالأسفل ثم اضغط على زر <strong>«اختيار المادة»</strong> للبدء بتوليد جدولك.
            </span>
          </div>
        </div>
      )}

      {/* Year Selection Tabs: 5 columns on all screens for clean symmetry */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 sm:p-2 shadow-xs">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {YEAR_LABELS.map((item) => {
            const isSelected = selectedYear === item.year;
            const yearCourses = coursesByYear[item.year] || [];
            const selectedInThisYear = yearCourses.filter((c) =>
              selectedCodes.has(String(c.code).trim())
            ).length;

            return (
              <button
                key={item.year}
                onClick={() => setSelectedYear(item.year)}
                className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-all text-center relative ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                }`}
              >
                <span className="hidden sm:inline text-sm">{item.title}</span>
                <span className="sm:hidden text-xs font-bold">سنة {item.year}</span>
                <span
                  className={`text-[10px] sm:text-[11px] mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {yearCourses.length} مادة
                </span>
                {selectedInThisYear > 0 && (
                  <span
                    className={`absolute -top-1 -left-1 sm:top-1.5 sm:left-1.5 text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-amber-400 text-slate-900' : 'bg-blue-600 text-white'
                    }`}
                  >
                    ✓ {selectedInThisYear}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Actions Header for Selected Year */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            مواد {YEAR_LABELS.find((y) => y.year === selectedYear)?.title}
          </h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
            {currentYearCourses.length} مادة
          </span>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث عن اسم أو رمز مادة..."
            className="w-full text-xs sm:text-sm pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {currentYearCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">لم يتم العثور على مواد مطابقة للبحث</p>
          <p className="text-xs text-slate-500 mt-1">جرّب كتابة كلمة بحث أخرى أو مسح حقل البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {currentYearCourses.map((course) => {
            const isChosen = selectedCodes.has(String(course.code).trim());
            const hasSessions = course.sessions && course.sessions.length > 0;
            const theorySessions = course.sessions.filter((s) => s.activity === 'نظري');
            const practicalSessions = course.sessions.filter((s) => s.activity === 'عملي');

            return (
              <div
                key={course.code}
                onClick={() => onToggleCourse(course)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                  isChosen
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {course.code}
                      </span>
                      {hasSessions ? (
                        <div className="flex items-center gap-1.5 text-[11px]">
                          {theorySessions.length > 0 && (
                            <span className="bg-sky-100 text-sky-800 px-2 py-0.2 rounded font-medium">
                              نظري ({theorySessions.length})
                            </span>
                          )}
                          {practicalSessions.length > 0 && (
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-medium">
                              عملي ({practicalSessions.length})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.2 rounded">
                          لا تتوفر أوقات مجدولة
                        </span>
                      )}
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isChosen
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'border border-slate-300 text-slate-400 bg-slate-50'
                      }`}
                    >
                      {isChosen ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2 leading-snug">
                    {course.name}
                  </h3>
                </div>

                {hasSessions && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {Array.from(new Set(course.sessions.map((s) => s.day))).filter(Boolean).join(' • ')}
                    </span>
                    <span className="text-blue-600 font-medium">
                      {isChosen ? 'تمت الإضافة ✓' : 'اضغط للإضافة'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
