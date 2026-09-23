import React, { useState, useRef } from 'react';
import { Course } from '../types';
import {
  parseCsvContent,
  parseXlsxContent,
  parseTextOrHtmlContent,
  parseScrapedRows,
} from '../utils/scheduleParser';
import {
  RefreshCw,
  Upload,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  Database,
  X,
  RotateCcw,
  Globe,
  Sparkles,
  ClipboardList,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface DataUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  coursesData: Record<number, Record<string, Course>>;
  onUpdateCoursesData: (
    newData: Record<number, Record<string, Course>>,
    successMsg: string
  ) => void;
  onResetToDefault: () => void;
  totalSessionsCount: number;
  totalCoursesCount: number;
}

export const DataUpdateModal: React.FC<DataUpdateModalProps> = ({
  isOpen,
  onClose,
  coursesData,
  onUpdateCoursesData,
  onResetToDefault,
  totalSessionsCount,
  totalCoursesCount,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'scraper' | 'reload' | 'upload' | 'paste'>('scraper');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scrapingStep, setScrapingStep] = useState<string>('');
  const [pasteInput, setPasteInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Live Web Scraper matching extract_schedule.py
  const handleRunLiveScraper = async () => {
    setIsProcessing(true);
    setScrapingStep('الاتصال بموقع الجامعة (educate.iust.edu.sy) وقراءة ViewState...');
    setStatusMessage({
      type: 'info',
      text: 'جاري تشغيل الـ Web Scraper التلقائي للاتصال المباشر بنظام الجامعة وسحب أحدث الجداول...',
    });

    try {
      setScrapingStep('إرسال استعلام البحث وتصفح صفحات الشعب (50 صف/صفحة)...');
      const res = await fetch('/api/scrape-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId: '1' }), // كلية طب الأسنان
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `استجابة غير متوقعة من الخادم (${res.status})`);
      }

      setScrapingStep('معالجة الصفوف المستخرجة وتحويل المواعيد وحفظ البيانات...');
      const data = await res.json();

      if (!data.success || !data.rows || data.rows.length === 0) {
        throw new Error(data.error || 'لم يتم العثور على أوقات أو صفوف صالحة من موقع الجامعة.');
      }

      // Convert scraped rows into structured dataset
      const parseRes = parseScrapedRows(data.rows, coursesData);
      onUpdateCoursesData(
        parseRes.updatedData,
        `تم سحب وتحديث ${data.totalRows} شعبة وجلسة بنجاح من موقع الجامعة مباشرة!`
      );

      setStatusMessage({
        type: 'success',
        text: `تم اكتمال السحب الحي بنجاح! تم استخراج ${data.totalRows} شعبة لـ ${data.totalCourses} مادة، وتحديث الذاكرة والملف المعتمد فوراً.`,
      });
    } catch (err: any) {
      console.error('Live scraping error:', err);
      setStatusMessage({
        type: 'error',
        text:
          err?.message ||
          'تعذر الاتصال المباشر بموقع الجامعة في هذه اللحظة. يمكنك استخدام خيار إعادة تحميل الجدول المعتمد أو رفع ملف Excel.',
      });
    } finally {
      setIsProcessing(false);
      setScrapingStep('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: `جاري قراءة وتحليل ملف ${file.name}...` });

    try {
      const fileName = file.name.toLowerCase();
      let parseRes;

      if (fileName.endsWith('.csv')) {
        const text = await file.text();
        parseRes = parseCsvContent(text, coursesData);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        parseRes = parseXlsxContent(buffer, coursesData);
      } else {
        throw new Error('نوع الملف غير مدعوم. يرجى اختيار ملف Excel (.xlsx) أو ملف CSV (.csv)');
      }

      if (parseRes.totalSessions === 0) {
        throw new Error(
          'لم يتم العثور على أوقات أو جلسات صالحة في الملف المرفق. تأكد من احتواء الملف على أعمدة رمز المادة واليوم والتوقيت.'
        );
      }

      onUpdateCoursesData(parseRes.updatedData, parseRes.message);
      setStatusMessage({
        type: 'success',
        text: `تم استيراد ${parseRes.totalSessions} جلسة بنجاح وتحديث قاعدة بيانات المواد!`,
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'حدث خطأ أثناء معالجة الملف. يرجى التحقق من صِيغة الملف.',
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onResetToDefault();
      setIsProcessing(false);
      setStatusMessage({
        type: 'success',
        text: 'تمت إعادة تعيين وتحديث قاعدة البيانات بالكامل إلى الجدول الأصلي المعتمد (185 جلسة متكاملة).',
      });
    }, 400);
  };

  const handlePasteData = () => {
    if (!pasteInput.trim()) return;
    setIsProcessing(true);
    try {
      const res = parseTextOrHtmlContent(pasteInput, coursesData);
      if (res.totalSessions === 0) {
        throw new Error(
          'تعذر استخراج جلسات من النص المنسوخ. تأكد من نسخ جدول يحتوي على رمز المادة واليوم والوقت.'
        );
      }
      onUpdateCoursesData(res.updatedData, res.message);
      setStatusMessage({
        type: 'success',
        text: `تم استيراد ${res.totalSessions} جلسة بنجاح من البيانات المنسوخة!`,
      });
      setPasteInput('');
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'حدث خطأ أثناء معالجة النص المنسوخ.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden transition-all text-right flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>تحديث أوقات الجدول من موقع الجامعة</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-2 py-0.5 rounded-full border border-blue-400/30">
                  Live Web Scraper
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                جلب ومزامنة أحدث مواعيد وشُعب المواد مباشرة من بوابة IUST الأكاديمية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-xl p-1.5 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Status Metric Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-700 mb-2">إحصائيات قاعدة البيانات المحملة حاليًا:</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <span className="text-[11px] text-slate-500 block">عدد الجلسات والمواعيد</span>
                <span className="text-xl font-bold text-blue-600">{totalSessionsCount}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">شعبة ومحاضرة ومخبر</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <span className="text-[11px] text-slate-500 block">المواد الدراسية المتوفرة</span>
                <span className="text-xl font-bold text-slate-900">{totalCoursesCount}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">مادة عبر السنوات 1-5</span>
              </div>
            </div>
          </div>

          {/* Feedback message banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <RefreshCw className="w-4 h-4 text-blue-600 shrink-0 animate-spin mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <p className="font-semibold leading-relaxed">{statusMessage.text}</p>
                {scrapingStep && (
                  <p className="text-[11px] text-blue-700 font-mono animate-pulse">
                    ↳ الخطوة الحالية: {scrapingStep}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Sub-Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('scraper')}
              className={`flex-1 py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                activeSubTab === 'scraper' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>سحب حي من موقع الجامعة</span>
            </button>

            <button
              onClick={() => setActiveSubTab('reload')}
              className={`flex-1 py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                activeSubTab === 'reload' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>الجدول المعتمد</span>
            </button>

            <button
              onClick={() => setActiveSubTab('upload')}
              className={`flex-1 py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                activeSubTab === 'upload' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>ملف Excel/CSV</span>
            </button>

            <button
              onClick={() => setActiveSubTab('paste')}
              className={`flex-1 py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                activeSubTab === 'paste' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>لصق بيانات</span>
            </button>
          </div>

          {/* Tab 1: Live Web Scraper (matching extract_schedule.py) */}
          {activeSubTab === 'scraper' && (
            <div className="border border-blue-200 rounded-2xl p-5 bg-gradient-to-b from-blue-50/50 to-white space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>السحب التلقائي المباشر (extract_schedule)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    يقوم هذا الخيار بتنفيذ خوارزمية السحب الرسمية (Web Scraper) للاتصال المباشر بنظام الجامعة، والحصول على جلسة AJAX وتصفح جميع شُعب الكلية صفحة بصفحة، ثم تحليل الأوقات وتحديث قاعدة بياناتك وتخزينها تلقائياً.
                  </p>
                </div>
              </div>

              {/* Scraper Workflow Steps */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>خطوات الجلب من الرابط الرسمي:</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg break-all border border-slate-100 flex items-center justify-between gap-2">
                  <span className="truncate">https://educate.iust.edu.sy/faces/ui/pages/guest/scheduleCourses/index.xhtml</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1 pr-1 list-disc list-inside">
                  <li>فتح الجلسة واستخراج الـ ViewState المشفر</li>
                  <li>تنفيذ استعلام البحث وجلب إجمالي عدد الشعب (387 شعبة)</li>
                  <li>تصفح جميع الصفحات الـ 8 بمعدل 50 صف في كل دفعة</li>
                  <li>توليد ملفي IUST_schedule_full.xlsx و CSV المعتمدين وتحديث البرنامج</li>
                </ul>
              </div>

              <button
                onClick={handleRunLiveScraper}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري سحب الجدول من موقع الجامعة الآن...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>بدء سحب وتحديث الجدول الآن من موقع IUST</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tab 2: Reload Official Baseline */}
          {activeSubTab === 'reload' && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900">إعادة التحميل من ملف الجامعة المعتمد</h4>
                <p className="text-xs text-slate-500 mt-1">
                  يقوم هذا الخيار بإعادة تحميل أحدث جدول رسمي معتمد للجامعة كاملاً (185 شعبة وجلسة لـ 71 مادة) وتحديث ذاكرة التطبيق فوراً.
                </p>
              </div>
              <button
                onClick={handleReset}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة تحميل الجدول المعتمد الآن</span>
              </button>
            </div>
          )}

          {/* Tab 3: Upload Excel or CSV */}
          {activeSubTab === 'upload' && (
            <div className="border border-dashed border-slate-300 rounded-2xl p-5 text-center space-y-3 bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">رفع ملف جدول محدث (Excel أو CSV)</h4>
                <p className="text-xs text-slate-500 mt-0.5 max-w-sm mx-auto">
                  إذا أصدرت كلية طب الأسنان ملف جدول جديد بصيغة .xlsx أو .csv يمكنك رفعه هنا مباشرة ليتم استبدال المواعيد فوراً.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,.xlsx,.xls"
                className="hidden"
                id="schedule-file-upload-input"
              />

              <label
                htmlFor="schedule-file-upload-input"
                className="inline-flex items-center gap-2 text-xs bg-white hover:bg-slate-100 text-slate-800 font-semibold px-4 py-2.5 rounded-xl border border-slate-300 cursor-pointer shadow-2xs transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>اختيار ملف (.xlsx أو .csv)</span>
              </label>
            </div>
          )}

          {/* Tab 4: Paste Table Content */}
          {activeSubTab === 'paste' && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900">لصق بيانات الجدول يدوياً</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  إذا كنت قد نسخت الجدول من متصفحك أو ملف خارجي، يمكنك لصقه هنا:
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  rows={4}
                  placeholder="الصق نص الجدول أو بيانات Excel المنسوخة هنا..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                />

                <button
                  onClick={handlePasteData}
                  disabled={isProcessing || !pasteInput.trim()}
                  className="w-full flex items-center justify-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>استيراد وتحديث الجدول من النص الملصوق</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
