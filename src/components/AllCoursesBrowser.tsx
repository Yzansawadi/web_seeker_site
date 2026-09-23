import React, { useState, useMemo } from 'react';
import { Course, DAY_ORDER, Session } from '../types';
import { Search, Filter, BookOpen, Plus, Check, Clock, MapPin, User } from 'lucide-react';
import { canonicalDay } from '../utils/scheduleOptimizer';

interface AllCoursesBrowserProps {
  allCourses: Course[];
  selectedCourses: Course[];
  onToggleCourse: (course: Course) => void;
}

export const AllCoursesBrowser: React.FC<AllCoursesBrowserProps> = ({
  allCourses,
  selectedCourses,
  onToggleCourse,
}) => {
  const [search, setSearch] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<'all' | 'نظري' | 'عملي'>('all');

  const selectedCodes = useMemo(
    () => new Set(selectedCourses.map((c) => String(c.code).trim())),
    [selectedCourses]
  );

  // Flatten all sessions across courses for detailed inspection
  const flattenedSessions = useMemo(() => {
    const list: { course: Course; session: Session }[] = [];
    for (const c of allCourses) {
      if (yearFilter !== 'all' && c.year !== yearFilter) continue;
      for (const s of c.sessions) {
        if (dayFilter !== 'all' && canonicalDay(s.day) !== dayFilter) continue;
        if (activityFilter !== 'all' && s.activity !== activityFilter) continue;

        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = c.name.toLowerCase().includes(q);
          const matchCode = c.code.toLowerCase().includes(q);
          const matchTeacher = s.teacher?.toLowerCase().includes(q);
          const matchRoom = s.room?.toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchTeacher && !matchRoom) continue;
        }

        list.push({ course: c, session: s });
      }
    }
    return list;
  }, [allCourses, yearFilter, dayFilter, activityFilter, search]);

  return (
    <div className="space-y-6">
      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              دليل جميع أوقات وجلسات مواد الجامعة
            </h2>
            <p className="text-xs text-slate-500">
              استعراض {flattenedSessions.length} جلسة دراسية مسحوبة من جدول الجامعة الرسمي
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالمادة، الرمز، المدرس، القاعة..."
              className="w-full text-xs sm:text-sm pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium ml-2">
            <Filter className="w-3.5 h-3.5" />
            <span>تصفية:</span>
          </div>

          {/* Year selector */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">كل السنوات</option>
            <option value="1">السنة الأولى</option>
            <option value="2">السنة الثانية</option>
            <option value="3">السنة الثالثة</option>
            <option value="4">السنة الرابعة</option>
            <option value="5">السنة الخامسة</option>
          </select>

          {/* Day selector */}
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">كل الأيام</option>
            {DAY_ORDER.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Activity selector */}
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">كل الأنشطة (نظري وعملي)</option>
            <option value="نظري">نظري فقط</option>
            <option value="عملي">عملي فقط</option>
          </select>

          {(yearFilter !== 'all' || dayFilter !== 'all' || activityFilter !== 'all' || search) && (
            <button
              onClick={() => {
                setYearFilter('all');
                setDayFilter('all');
                setActivityFilter('all');
                setSearch('');
              }}
              className="text-blue-600 hover:text-blue-700 hover:underline px-2 py-1"
            >
              إلغاء التصفية
            </button>
          )}
        </div>
      </div>

      {/* Table view */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 text-white font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">المادة</th>
                <th className="py-3 px-4">السنة</th>
                <th className="py-3 px-4">النشاط والشعبة</th>
                <th className="py-3 px-4">اليوم والتوقيت</th>
                <th className="py-3 px-4">القاعة والمدرس</th>
                <th className="py-3 px-4 text-center">الإضافة للاختيارات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {flattenedSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    لا توجد جلسات تطابق خيارات البحث الحالية
                  </td>
                </tr>
              ) : (
                flattenedSessions.map((row, idx) => {
                  const isChosen = selectedCodes.has(String(row.course.code).trim());
                  const isTheory = row.session.activity === 'نظري';

                  return (
                    <tr key={`${row.course.code}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {row.course.code}
                          </span>
                          <span>{row.course.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        السنة {row.course.year > 0 ? row.course.year : '—'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              isTheory ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {row.session.activity || '—'}
                          </span>
                          {row.session.section && (
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">
                              شعبة {row.session.section}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-800">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900">{row.session.day}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {row.session.start && row.session.end
                                ? `${row.session.start} - ${row.session.end}`
                                : '—'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div className="space-y-0.5">
                          {row.session.room && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{row.session.room}</span>
                            </div>
                          )}
                          {row.session.teacher && (
                            <div className="flex items-center gap-1 text-slate-700">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>{row.session.teacher}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleCourse(row.course)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isChosen
                              ? 'bg-blue-100 text-blue-800 hover:bg-rose-100 hover:text-rose-800'
                              : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                          }`}
                        >
                          {isChosen ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-blue-600" />
                              <span>مختارة ✓</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>إضافة</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
