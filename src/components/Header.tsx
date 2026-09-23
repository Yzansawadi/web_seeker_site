import React from 'react';
import { Calendar, Sparkles, BookOpen, RefreshCw, Globe, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'selector' | 'optimizer' | 'browser';
  setActiveTab: (tab: 'selector' | 'optimizer' | 'browser') => void;
  selectedCount: number;
  totalCoursesCount: number;
  totalSessionsCount: number;
  onTriggerLiveUpdate: () => void;
  isLiveSyncing: boolean;
  lastSyncedTime: string | null;
  hasOptimizerResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCount,
  totalCoursesCount,
  totalSessionsCount,
  onTriggerLiveUpdate,
  isLiveSyncing,
  lastSyncedTime,
  hasOptimizerResult,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top University Brand Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-['Orbitron',sans-serif] tracking-wider text-amber-400 font-semibold">WEBSEEKER</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">الجامعة الدولية الخاصة للعلوم والتكنولوجيا (IUST)</span>
            <span className="hidden lg:flex items-center gap-1 text-[11px] text-emerald-400 font-medium mr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              تحديث مباشر من البوابة
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            {lastSyncedTime && (
              <span className="hidden md:inline text-[11px] text-slate-400">
                آخر تحديث: {lastSyncedTime}
              </span>
            )}
            <span className="hidden sm:inline">كلية طب الأسنان</span>
            <span className="bg-slate-800 text-blue-300 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700">
              {totalCoursesCount} مادة
            </span>
            <span className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700">
              {totalSessionsCount} جلسة وشعبة
            </span>
          </div>
        </div>
      </div>

      {/* Main Header & Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs hover:bg-blue-700 transition-colors"
                title="جدول المواد"
                aria-label="جدول المواد"
              >
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <button
              onClick={onTriggerLiveUpdate}
              disabled={isLiveSyncing}
              title="تحديث أحدث الأوقات تلقائياً من موقع الجامعة (educate.iust.edu.sy)"
              className={`md:hidden flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${
                isLiveSyncing
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLiveSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isLiveSyncing ? 'جاري التحديث...' : 'تحديث الجدول'}</span>
            </button>
          </div>

          {/* Navigation Tabs & Direct Live Scraper Button */}
          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                id="tab-selector-btn"
                onClick={() => setActiveTab('selector')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'selector'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>اختيار المواد</span>
                {selectedCount > 0 && (
                  <span className="bg-blue-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                    {selectedCount}
                  </span>
                )}
              </button>

              <button
                id="tab-browser-btn"
                onClick={() => setActiveTab('browser')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'browser'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">جميع أوقات المواد</span>
                <span className="sm:hidden">كل المواد</span>
              </button>
            </div>

            {/* Direct University Live Scraper Button */}
            <button
              onClick={onTriggerLiveUpdate}
              disabled={isLiveSyncing}
              title="تحديث أحدث أوقات وشُعب المواد تلقائياً من موقع الجامعة الرسمي"
              className={`hidden md:flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl border transition-all font-semibold shadow-2xs ${
                isLiveSyncing
                  ? 'bg-blue-100 text-blue-800 border-blue-300 cursor-wait'
                  : 'bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border-blue-200 hover:border-blue-600'
              }`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLiveSyncing ? 'animate-spin text-blue-600' : 'text-blue-600 group-hover:text-white'}`}
              />
              <span>{isLiveSyncing ? 'جاري تحديث الجدول من موقع الجامعة...' : 'تحديث الجدول'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
