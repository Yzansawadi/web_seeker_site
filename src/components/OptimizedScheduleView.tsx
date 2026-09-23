import React, { useState } from 'react';
import { Course, OptimizedTimetable } from '../types';
import { WeeklyTimetableGrid } from './WeeklyTimetableGrid';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface OptimizedScheduleViewProps {
  result: OptimizedTimetable | null;
  isLoading: boolean;
  onRunOptimization: () => void;
  onBackToSelection: () => void;
  onTriggerLiveUpdate?: () => void;
  isLiveSyncing?: boolean;
  selectedCourses: Course[];
}

export const OptimizedScheduleView: React.FC<OptimizedScheduleViewProps> = ({
  result,
  isLoading,
  onRunOptimization,
  onBackToSelection,
  onTriggerLiveUpdate,
  isLiveSyncing = false,
  selectedCourses,
}) => {
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState<number>(-1); // -1 = primary

  const coursesWithoutSessions = selectedCourses.filter(
    (c) => !c.sessions || c.sessions.length === 0
  );

  if (selectedCourses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs">
        <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">لم تقم باختيار أي مواد بعد</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          يرجى اختيار المواد أولًا من شاشة اختيار المواد، ثم الضغط على "توليد أفضل جدول" ليقوم المحرك الذكي باختيار الشُعب الأنسب لك.
        </p>
        <button
          onClick={onBackToSelection}
          className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الذهاب لاختيار المواد</span>
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-xs">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-800">جاري تشغيل خوارزمية الفرع والحد (Branch & Bound)...</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          يتم فحص مئات التباديل والتركيبات وتطبيق MRV والأقنعة الزمنية بالدقيقة للوصول لأقل أيام حضور وأقل فجوات بين المحاضرات.
        </p>
      </div>
    );
  }

  if (!result || result.assignments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">تعذر إنشاء جدول متوافق</h3>
        
        {coursesWithoutSessions.length > 0 ? (
          <div className="mt-3 max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 text-right">
            <p className="font-bold">المواد التالية لا تتوفر لها مواعيد أو جلسات في قاعدة البيانات حالياً:</p>
            <ul className="list-disc list-inside mt-1.5 space-y-0.5 font-medium">
              {coursesWithoutSessions.map((c) => (
                <li key={c.code}>
                  {c.name} ({c.code})
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-amber-800 mt-2">
              يمكنك تحديث قاعدة البيانات أو رفع ملف جدول محدث عبر زر "تحديث أوقات الجدول".
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            توجد تعارضات زمنية شديدة بين مواعيد جميع شُعب المواد المختارة تحول دون الجمع بينها في أسبوع واحد.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={onBackToSelection}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-200"
          >
            تعديل المواد المختارة
          </button>
          {onTriggerLiveUpdate && (
            <button
              onClick={onTriggerLiveUpdate}
              disabled={isLiveSyncing}
              className="text-xs bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 font-semibold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLiveSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isLiveSyncing ? 'جاري تحديث الجدول من موقع الجامعة...' : 'تحديث أوقات المواد من موقع الجامعة'}</span>
            </button>
          )}
          <button
            onClick={onRunOptimization}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const activeSchedule =
    selectedAlternativeIndex === -1
      ? result
      : result.alternatives?.[selectedAlternativeIndex] || result;

  const totalGapsHours = Math.floor(activeSchedule.gapMinutes / 60);
  const totalGapsRemainingMinutes = activeSchedule.gapMinutes % 60;
  const gapString =
    totalGapsHours > 0
      ? `${totalGapsHours} ساعة و ${totalGapsRemainingMinutes} دقيقة`
      : `${totalGapsRemainingMinutes} دقيقة`;

  const timetableItems = activeSchedule.assignments.map((a) => ({
    courseCode: a.course_code,
    courseName: a.course_name,
    activity: a.activity,
    section: a.section_id,
    session: a.session,
  }));

  return (
    <div className="space-y-6">
      {/* Top Optimizer Result Metric Cards - Screen only */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 no-print">
        {/* Days count card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>أيام الحضور للجامعة</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {activeSchedule.daysCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">أيام في الأسبوع</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {activeSchedule.activeDays.join(' • ')}
          </p>
        </div>

        {/* Gap time card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>إجمالي الفراغات</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {activeSchedule.gapMinutes}
            </span>
            <span className="text-xs text-slate-500 font-medium">دقيقة فراغ</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">مجموع الفراغات: {gapString}</p>
        </div>

        {/* Sessions count card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>إجمالي الجلسات</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {activeSchedule.assignments.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">جلسة أسبوعية</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            تم انتقاء شعبة لكل نشاط متوفر
          </p>
        </div>

        {/* Optimization status card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>ضمان الأمثلية</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-emerald-700">
              {activeSchedule.optimalProven ? 'مثبتة الأمثلية ✓' : 'أفضل نتيجة متاحة'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {activeSchedule.timedOut ? 'انتهت المهلة وأعيد الأفضل' : 'بحث Branch & Bound دقيق'}
          </p>
        </div>
      </div>

      {/* Excluded Courses Alert if applicable - Screen only */}
      {result.excludedCourses && result.excludedCourses.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-900 flex items-start gap-3 no-print">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-950">
              تنبيه: تعذر إدراج بعض المواد المختارة بسبب تعارض أوقاتها مع بقية المواد:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {result.excludedCourses.map((c) => (
                <span
                  key={c.code}
                  className="bg-white text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold"
                >
                  {c.name} ({c.code})
                </span>
              ))}
            </div>
            <p className="text-[11px] text-amber-800">
              قام المحرك بإنشاء أفضل جدول ممكن لأكبر مجموعة مواد متوافقة (Maximal Subset).
            </p>
          </div>
        </div>
      )}

      {/* Alternatives Switcher if available - Screen only */}
      {result.alternatives && result.alternatives.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="text-xs">
            <h4 className="font-bold text-slate-900">خيارات وجداول بديلة متكافئة:</h4>
            <p className="text-slate-500">
              عُثر على بدائل بنفس عدد أيام الحضور ومجموع الفراغات مع اختلاف طفيف في مواعيد الشُعب.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedAlternativeIndex(-1)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedAlternativeIndex === -1
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الجدول الأساسي
            </button>
            {result.alternatives.map((alt, idx) => (
              <button
                key={alt.id}
                onClick={() => setSelectedAlternativeIndex(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedAlternativeIndex === idx
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                بديل {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid Timetable Component */}
      <WeeklyTimetableGrid
        items={timetableItems}
        title={`الجدول المثالي ${selectedAlternativeIndex === -1 ? '(الأساسي)' : `(البديل ${selectedAlternativeIndex + 1})`}`}
        subtitle={`أيام الحضور: ${activeSchedule.daysCount} أيام | الفراغات: ${gapString}`}
        isOptimized={true}
      />
    </div>
  );
};
