import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Course, OptimizedTimetable } from './types';
import {
  INITIAL_COURSES_DATA,
  getAllCourses,
  getCoursesByYear,
  getCourseByCode,
} from './data/coursesData';
import { Header } from './components/Header';
import { YearCourseSelector } from './components/YearCourseSelector';
import { WeeklyTimetableGrid } from './components/WeeklyTimetableGrid';
import { OptimizedScheduleView } from './components/OptimizedScheduleView';
import { AllCoursesBrowser } from './components/AllCoursesBrowser';
import { DataUpdateModal } from './components/DataUpdateModal';
import { findBestSchedules } from './utils/scheduleOptimizer';
import { parseScrapedRows } from './utils/scheduleParser';
import { FloatingSelectionDock } from './components/FloatingSelectionDock';
import { AppFooter } from './components/AppFooter';
import { Check, RefreshCw, EyeOff } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'selector' | 'optimizer' | 'browser'>('selector');
  const [coursesData, setCoursesData] = useState<Record<number, Record<string, Course>>>(() => {
    try {
      const savedData = localStorage.getItem('iust_custom_courses_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Verify it contains actual sessions
        let count = 0;
        Object.values(parsed).forEach((yr: any) => {
          Object.values(yr).forEach((c: any) => {
            if (c.sessions && c.sessions.length > 0) count += c.sessions.length;
          });
        });
        if (count > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved courses data:', e);
    }
    return INITIAL_COURSES_DATA;
  });

  const [selectedCourses, setSelectedCourses] = useState<Course[]>(() => {
    try {
      localStorage.removeItem('iust_selected_courses');
    } catch (e) {
      console.warn('Error clearing selected courses:', e);
    }
    // Start with completely zero selected courses
    return [];
  });

  const [optimizerResult, setOptimizerResult] = useState<OptimizedTimetable | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [showSchedulePreview, setShowSchedulePreview] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);
  const [liveSyncStatus, setLiveSyncStatus] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(() => {
    return localStorage.getItem('iust_last_synced_time') || null;
  });

  // Re-hydrate function: ensures all course objects in selectedCourses have fresh session arrays
  const hydrateCourses = useCallback(
    (coursesList: Course[], dataset: Record<number, Record<string, Course>>): Course[] => {
      return coursesList.map((c) => {
        const fresh = getCourseByCode(String(c.code).trim(), dataset);
        return fresh ? { ...fresh, code: String(fresh.code).trim() } : c;
      });
    },
    []
  );

  const showToast = useCallback((message: string) => {
    setToastNotification(message);
    setTimeout(() => setToastNotification(null), 5000);
  }, []);

  // Live Scraper: directly fetches latest schedule live from educate.iust.edu.sy
  const handleTriggerLiveScrape = useCallback(
    async (isAutoOnEntry: boolean = false) => {
      setIsLiveSyncing(true);
      if (isAutoOnEntry) {
        setLiveSyncStatus('جاري تحديث أوقات الجدول تلقائياً من موقع الجامعة المباشر (educate.iust.edu.sy)...');
      } else {
        setLiveSyncStatus('جاري الاتصال بنظام الجامعة وتحديث أحدث أوقات وشُعب المواد...');
      }

      try {
        const res = await fetch('/api/scrape-schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: '1' }), // كلية طب الأسنان
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `خطأ في الاتصال بالخادم (${res.status})`);
        }

        const data = await res.json();
        if (!data.success || !data.rows || data.rows.length === 0) {
          throw new Error(data.error || 'لم يتم العثور على أوقات أو صفوف صالحة من موقع الجامعة.');
        }

        setCoursesData((currentData) => {
          const parseRes = parseScrapedRows(data.rows, currentData);
          localStorage.setItem('iust_custom_courses_data', JSON.stringify(parseRes.updatedData));
          return parseRes.updatedData;
        });

        const nowTime = new Date().toLocaleTimeString('ar-SY', {
          hour: '2-digit',
          minute: '2-digit',
        });
        setLastSyncedTime(nowTime);
        localStorage.setItem('iust_last_synced_time', nowTime);

        const successNotice = isAutoOnEntry
          ? `✓ تم تحديث أوقات وشُعب الجدول تلقائياً من موقع الجامعة بنجاح (${data.totalRows} شعبة لـ ${data.totalCourses} مادة)`
          : `✓ تم تحديث أوقات المواد من موقع الجامعة بنجاح (${data.totalRows} شعبة لـ ${data.totalCourses} مادة)`;

        showToast(successNotice);
      } catch (err: any) {
        console.warn('Scraper notice:', err);
        if (!isAutoOnEntry) {
          showToast(err?.message || 'تعذر الاتصال بموقع الجامعة حالياً، تم الاحتفاظ بأحدث أوقات المواد المحفوظة.');
        } else {
          showToast('مرحباً بك! تم اعتماد أحدث أوقات المواد المحفوظة للجدول الدراسي الأكاديمي.');
        }
      } finally {
        setIsLiveSyncing(false);
        setLiveSyncStatus(null);
      }
    },
    [showToast]
  );

  // Auto-update schedule from university website every time user enters the site
  useEffect(() => {
    handleTriggerLiveScrape(true);
  }, [handleTriggerLiveScrape]);

  // Calculate statistics
  const allCourses = useMemo(() => getAllCourses(coursesData), [coursesData]);

  const totalSessionsCount = useMemo(() => {
    return allCourses.reduce((sum, c) => sum + (c.sessions?.length || 0), 0);
  }, [allCourses]);

  const coursesByYear: Record<number, Course[]> = useMemo(() => {
    return {
      1: getCoursesByYear(1, coursesData),
      2: getCoursesByYear(2, coursesData),
      3: getCoursesByYear(3, coursesData),
      4: getCoursesByYear(4, coursesData),
      5: getCoursesByYear(5, coursesData),
    };
  }, [coursesData]);

  // Re-hydrate selected courses when dataset changes, without altering user selection
  useEffect(() => {
    setSelectedCourses((prev) => {
      if (prev.length === 0) return prev;
      return hydrateCourses(prev, coursesData);
    });
  }, [coursesData, hydrateCourses]);

  // Always persist selections to localStorage (even if empty array)
  useEffect(() => {
    localStorage.setItem('iust_selected_courses', JSON.stringify(selectedCourses));
  }, [selectedCourses]);

  const handleToggleCourse = (course: Course) => {
    const targetCode = String(course.code).trim();
    if (!targetCode) return;

    setSelectedCourses((prev) => {
      const exists = prev.some((c) => String(c.code).trim() === targetCode);
      if (exists) {
        // Unselecting: cleanly remove all instances of this course
        return prev.filter((c) => String(c.code).trim() !== targetCode);
      } else {
        // Selecting: ensure no duplicates exist and add the fresh course
        const clean = prev.filter((c) => String(c.code).trim() !== targetCode);
        const freshCourse = getCourseByCode(targetCode, coursesData) || course;
        return [...clean, { ...freshCourse, code: targetCode }];
      }
    });
    setOptimizerResult(null);
  };

  const handleRemoveCourse = (courseCode: string) => {
    const targetCode = String(courseCode).trim();
    setSelectedCourses((prev) => {
      const next = prev.filter((c) => String(c.code).trim() !== targetCode);
      if (next.length === 0) {
        setShowSchedulePreview(false);
      }
      return next;
    });
    setOptimizerResult(null);
  };

  const handleClearSelection = () => {
    setSelectedCourses([]);
    setShowSchedulePreview(false);
    setOptimizerResult(null);
    localStorage.removeItem('iust_selected_courses');
    showToast('تم تصفير جميع المواد المختارة بالكامل');
  };

  const handleToggleViewSchedule = () => {
    if (showSchedulePreview) {
      setShowSchedulePreview(false);
    } else {
      setShowSchedulePreview(true);
      setTimeout(() => {
        const el = document.getElementById('selected-schedule-grid');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 70);
    }
  };

  const handleRunOptimization = () => {
    if (selectedCourses.length === 0) return;
    setIsOptimizing(true);
    setActiveTab('optimizer');

    // Ensure courses are fully hydrated with current dataset sessions
    const hydratedCourses = hydrateCourses(selectedCourses, coursesData);
    setSelectedCourses(hydratedCourses);

    setTimeout(() => {
      try {
        const result = findBestSchedules(hydratedCourses);
        setOptimizerResult(result);
      } catch (err) {
        console.error('Optimization error:', err);
      } finally {
        setIsOptimizing(false);
      }
    }, 120);
  };

  const handleUpdateCoursesData = (
    newData: Record<number, Record<string, Course>>,
    successMsg: string
  ) => {
    setCoursesData(newData);
    localStorage.setItem('iust_custom_courses_data', JSON.stringify(newData));

    // Re-hydrate any selected courses
    setSelectedCourses((prev) => hydrateCourses(prev, newData));
    setOptimizerResult(null);
    showToast(successMsg);
  };

  const handleResetToDefault = () => {
    localStorage.removeItem('iust_custom_courses_data');
    setCoursesData(INITIAL_COURSES_DATA);

    // Re-hydrate selected courses with default dataset
    setSelectedCourses((prev) => hydrateCourses(prev, INITIAL_COURSES_DATA));
    setOptimizerResult(null);
    showToast('تمت إعادة ضبط وتحديث قاعدة البيانات إلى جدول الجامعة المعتمد (185 جلسة متكاملة) ✓');
  };

  // Convert selected courses into timetable items for manual viewing
  const manualTimetableItems = useMemo(() => {
    const list: {
      courseCode: string;
      courseName: string;
      activity: string;
      section: string;
      session: any;
    }[] = [];

    for (const c of selectedCourses) {
      const freshCourse = getCourseByCode(c.code, coursesData) || c;
      if (freshCourse.sessions) {
        for (const s of freshCourse.sessions) {
          list.push({
            courseCode: freshCourse.code,
            courseName: freshCourse.name,
            activity: s.activity,
            section: s.section,
            session: s,
          });
        }
      }
    }
    return list;
  }, [selectedCourses, coursesData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Cairo',sans-serif]">
      {/* Live Sync Status Banner (Active upon site entry or manual click) */}
      {liveSyncStatus && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 shadow-md no-print sticky top-0 z-50">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-300 shrink-0" />
          <span>{liveSyncStatus}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCount={selectedCourses.length}
        totalCoursesCount={allCourses.length}
        totalSessionsCount={totalSessionsCount}
        onTriggerLiveUpdate={() => handleTriggerLiveScrape(false)}
        isLiveSyncing={isLiveSyncing}
        lastSyncedTime={lastSyncedTime}
        hasOptimizerResult={optimizerResult !== null}
      />

      {/* Notification Toast */}
      {toastNotification && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 text-xs font-semibold flex items-center gap-2 max-w-md">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'selector' && (
          <div className="space-y-8">
            <div className="no-print">
              <YearCourseSelector
                coursesByYear={coursesByYear}
                selectedCourses={selectedCourses}
                showSchedulePreview={showSchedulePreview}
                onToggleCourse={handleToggleCourse}
                onRemoveCourse={handleRemoveCourse}
                onClearSelection={handleClearSelection}
                onViewSchedule={handleToggleViewSchedule}
                onOptimizeSchedule={handleRunOptimization}
              />
            </div>

            {/* If user explicitly requests to view times, show preview grid */}
            {selectedCourses.length > 0 && showSchedulePreview && (
              <div id="selected-schedule-grid" className="pt-6 border-t border-slate-200 animate-fade-in">
                <div className="flex items-center justify-between mb-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl no-print">
                  <div className="text-xs text-slate-700 font-medium">
                    معاينة أوقات وجلسات كافة المواد المختارة ({selectedCourses.length} مواد)
                  </div>
                  <button
                    onClick={() => setShowSchedulePreview(false)}
                    className="text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-medium shadow-2xs"
                    title="إغفاء جدول المعاينة بالأسفل"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                    <span>إخفاء الأوقات</span>
                  </button>
                </div>
                <WeeklyTimetableGrid
                  items={manualTimetableItems}
                  title={`جدول المواد المختارة (${selectedCourses.length} مواد)`}
                  subtitle="يعرض جميع أوقات وشُعب المواد المختارة. لتجنب التعارض الزمني اختر شعبة متوافقة أو استخدم مولّد أفضل جدول."
                />
              </div>
            )}

            {/* Mobile & Desktop Floating Selection Dock (moves with the user while browsing courses) */}
            <FloatingSelectionDock
              selectedCourses={selectedCourses}
              showSchedulePreview={showSchedulePreview}
              onToggleViewSchedule={handleToggleViewSchedule}
              onOptimizeSchedule={handleRunOptimization}
              onClearSelection={handleClearSelection}
              onRemoveCourse={handleRemoveCourse}
            />
          </div>
        )}

        {activeTab === 'optimizer' && (
          <OptimizedScheduleView
            result={optimizerResult}
            isLoading={isOptimizing}
            onRunOptimization={handleRunOptimization}
            onBackToSelection={() => setActiveTab('selector')}
            onTriggerLiveUpdate={() => handleTriggerLiveScrape(false)}
            isLiveSyncing={isLiveSyncing}
            selectedCourses={selectedCourses}
          />
        )}

        {activeTab === 'browser' && (
          <div className="no-print">
            <AllCoursesBrowser
              allCourses={allCourses}
              selectedCourses={selectedCourses}
              onToggleCourse={handleToggleCourse}
            />
          </div>
        )}
      </main>

      {/* Data Update & File Upload Modal (Kept as secondary fallback) */}
      <DataUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        coursesData={coursesData}
        onUpdateCoursesData={handleUpdateCoursesData}
        onResetToDefault={handleResetToDefault}
        totalSessionsCount={totalSessionsCount}
        totalCoursesCount={allCourses.length}
      />

      {/* Modern Professional Footer */}
      <AppFooter />
    </div>
  );
}

export default App;
