import React, { useMemo, useState } from 'react';
import { Course, DAY_ORDER, Session } from '../types';
import { canonicalDay, sessionsOverlap } from '../utils/scheduleOptimizer';
import { formatScheduleAsText, formatTimeRange } from '../utils/formatters';
import { WeeklyOverviewGrid } from './WeeklyOverviewGrid';
import {
  Clock,
  MapPin,
  User,
  Copy,
  Check,
  Printer,
  FileDown,
  AlertTriangle,
  Calendar,
  LayoutGrid,
  CalendarDays,
} from 'lucide-react';
import { PrintableScheduleDocument } from './PrintableScheduleDocument';
import { exportScheduleToPdf } from '../utils/pdfExport';

interface TimetableItem {
  courseCode: string;
  courseName: string;
  activity: string;
  section: string;
  session: Session;
  isConflict?: boolean;
}

interface WeeklyTimetableGridProps {
  items: TimetableItem[];
  title?: string;
  subtitle?: string;
  isOptimized?: boolean;
}

export const WeeklyTimetableGrid: React.FC<WeeklyTimetableGridProps> = ({
  items,
  title = 'جدول الأسبوع الأكاديمي',
  subtitle,
  isOptimized = false,
}) => {
  // 'overview' is the new screenshot view, active FIRST and BY DEFAULT
  const [viewMode, setViewMode] = useState<'overview' | 'cards'>('overview');
  const [copied, setCopied] = useState<boolean>(false);

  // Group items by day and detect time overlaps
  const { groupedByDay, totalConflicts, activeDaysList } = useMemo(() => {
    const byDay: Record<string, TimetableItem[]> = {};
    for (const d of DAY_ORDER) {
      byDay[d] = [];
    }

    let conflictsCount = 0;

    for (let i = 0; i < items.length; i++) {
      const item = { ...items[i] };
      const day = canonicalDay(item.session.day);
      if (!byDay[day]) byDay[day] = [];

      // Check conflict with other items on same day
      for (let j = 0; j < items.length; j++) {
        if (i !== j && canonicalDay(items[j].session.day) === day) {
          if (sessionsOverlap(item.session, items[j].session)) {
            item.isConflict = true;
            conflictsCount++;
            break;
          }
        }
      }

      byDay[day].push(item);
    }

    // Sort items by start_min inside each day
    for (const d of DAY_ORDER) {
      byDay[d].sort((a, b) => a.session.start_min - b.session.start_min);
    }

    const activeDays = DAY_ORDER.filter((d) => byDay[d] && byDay[d].length > 0);

    return {
      groupedByDay: byDay,
      totalConflicts: Math.floor(conflictsCount / 2),
      activeDaysList: activeDays,
    };
  }, [items]);

  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleCopyText = () => {
    const text = formatScheduleAsText(
      title,
      items.map((it) => ({
        courseName: it.courseName,
        activity: it.activity,
        section: it.section,
        session: it.session,
      }))
    );
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'جدول_مواد_جامعة_IUST_المعتمد';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleSavePdf = async () => {
    setIsExportingPdf(true);
    setExportNotice('جاري إنشاء وحفظ ملف PDF المنسق عالي الدقة...');
    try {
      const fileName = `جدول_مواد_جامعة_IUST_${new Date().toISOString().slice(0, 10)}.pdf`;
      const success = await exportScheduleToPdf('printable-schedule-document', fileName);
      if (success) {
        setExportNotice('✓ تم تنزيل وحفظ ملف PDF بنجاح على جهازك!');
      }
    } catch (err) {
      console.warn('PDF generation error, fallback to print:', err);
      handlePrint();
    } finally {
      setIsExportingPdf(false);
      setTimeout(() => setExportNotice(null), 4500);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">لا توجد مواد في الجدول حاليًا</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          يرجى اختيار المواد من قائمة السنوات أو الضغط على "توليد أفضل جدول" لتوليد جدول دراسي منظم.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Screen Interactive UI (hidden on print) */}
      <div className="screen-only space-y-4">
        {/* Top Banner & Control Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {isOptimized && (
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                جدول مثالي بدون تعارض ✓
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle || `إجمالي الجلسات الأسبوعية: ${items.length} جلسة موزعة على ${activeDaysList.length} أيام`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print w-full sm:w-auto justify-end">
          {/* View Mode Toggle: Overview (screenshot) vs Cards */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('overview')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'overview'
                  ? 'bg-white text-[#0f2d59] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="عرض الجدول بالطريقة الرسمية الأفقية (نظرة عامة على الأسبوع)"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
              <span>نظرة عامة</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-[#0f2d59] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="عرض الجلسات مقسمة حسب الأيام في بطاقات مفصلة"
            >
              <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
              <span>بطاقات الأيام</span>
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 sm:px-3 py-2 rounded-xl transition-colors border border-slate-200"
            title="نسخ الجدول كنص مهيأ للمشاركة في تيليغرام أو واتساب"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>

          {/* Separate Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-900 text-white font-semibold px-2.5 sm:px-3 py-2 rounded-xl transition-all shadow-xs"
            title="طباعة الجدول عبر الطابعة أو نافذة الطباعة الرسمية"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>طباعة</span>
          </button>

          {/* Separate Save as PDF button */}
          <button
            onClick={handleSavePdf}
            disabled={isExportingPdf}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 sm:px-3.5 py-2 rounded-xl transition-all shadow-xs ${
              isExportingPdf
                ? 'bg-blue-100 text-blue-800 border border-blue-300 cursor-wait'
                : 'bg-[#0f2d59] hover:bg-[#163868] text-white'
            }`}
            title="حفظ وتنزيل الجدول كملف PDF عالي الدقة على جهازك"
          >
            <FileDown className={`w-3.5 h-3.5 ${isExportingPdf ? 'animate-bounce text-amber-300' : 'text-sky-200'}`} />
            <span>{isExportingPdf ? 'جاري التنزيل...' : 'حفظ PDF'}</span>
          </button>
        </div>
      </div>

      {/* Conflict Warning Box if manual selection has overlaps */}
      {!isOptimized && totalConflicts > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-amber-950">
              تنبيه: يوجد {totalConflicts} تعارض زمني في المواد المختارة!
            </p>
            <p className="text-amber-800 mt-0.5">
              بعض الجلسات تتزامن في نفس الوقت واليوم. يمكنك الانتقال إلى تبويب{' '}
              <strong className="font-bold underline cursor-pointer">مولّد أفضل جدول</strong> ليقوم
              المحرك باختيار الشُعب المتوافقة تلقائيًا وتجنب أي تضارب.
            </p>
          </div>
        </div>
      )}

      {/* Main Schedule View: Overview Grid (First/Default) or Cards */}
      {viewMode === 'overview' ? (
        <WeeklyOverviewGrid items={items} title={title} />
      ) : (
        /* Weekly Grid Columns (Cards mode) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {DAY_ORDER.filter((d) => d !== 'الجمعة' || (groupedByDay[d] && groupedByDay[d].length > 0)).map((day) => {
          const dayItems = groupedByDay[day] || [];
          const hasClasses = dayItems.length > 0;

          return (
            <div
              key={day}
              className={`rounded-2xl border flex flex-col transition-all ${
                hasClasses ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-3 rounded-t-2xl border-b flex items-center justify-between text-xs font-bold ${
                  hasClasses
                    ? 'bg-slate-900 text-white border-slate-800'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                <span>{day}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    hasClasses ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {dayItems.length} {dayItems.length === 1 ? 'جلسة' : 'جلسات'}
                </span>
              </div>

              {/* Day Sessions List */}
              <div className="p-2 space-y-2 flex-1">
                {dayItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">لا توجد محاضرات</div>
                ) : (
                  dayItems.map((item, idx) => {
                    const isTheory = item.activity === 'نظري';
                    const timeStr =
                      item.session.start && item.session.end
                        ? `${item.session.start} - ${item.session.end}`
                        : formatTimeRange(item.session.start_min, item.session.end_min);

                    return (
                      <div
                        key={`${item.courseCode}-${item.section}-${idx}`}
                        className={`p-3 rounded-xl border text-xs transition-all relative ${
                          item.isConflict
                            ? 'bg-rose-50 border-rose-300 text-rose-950'
                            : isTheory
                            ? 'bg-sky-50/70 border-sky-200/90 text-slate-900'
                            : 'bg-emerald-50/70 border-emerald-200/90 text-slate-900'
                        }`}
                      >
                        {item.isConflict && (
                          <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            <span>تعارض</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              isTheory ? 'bg-sky-200/80 text-sky-900' : 'bg-emerald-200/80 text-emerald-900'
                            }`}
                          >
                            {item.activity}
                          </span>
                          {item.section && (
                            <span className="text-[10px] bg-slate-200/70 text-slate-700 px-1 rounded font-medium">
                              شعبة {item.section}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 leading-snug line-clamp-2">
                          {item.courseName}
                        </h4>

                        <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{timeStr}</span>
                          </div>

                          {item.session.room && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>قاعة: {item.session.room}</span>
                            </div>
                          )}

                          {item.session.teacher && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="line-clamp-1">{item.session.teacher}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}
      </div>

      {/* Export Notice Toast */}
      {exportNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fade-in no-print">
          <FileDown className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Dedicated Printable Schedule Document: Strictly formatted for Print & PDF export */}
      <div
        className="print-only"
        style={
          isExportingPdf
            ? {
                position: 'fixed',
                left: '0px',
                top: '0px',
                width: '285mm',
                maxWidth: '285mm',
                zIndex: 9999,
                background: '#ffffff',
                pointerEvents: 'none',
                boxSizing: 'border-box',
              }
            : {
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                width: '285mm',
                maxWidth: '285mm',
                pointerEvents: 'none',
                boxSizing: 'border-box',
              }
        }
      >
        <PrintableScheduleDocument
          items={items}
          title={title}
          subtitle={subtitle}
          isOptimized={isOptimized}
        />
      </div>
    </div>
  );
};
