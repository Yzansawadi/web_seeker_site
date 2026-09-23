import React from 'react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-3 sm:py-3.5 text-xs text-slate-500 no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-right">
        {/* web seeker copyright notice */}
        <p className="text-slate-600 font-normal text-[11px] sm:text-xs">
          © {new Date().getFullYear()} <span className="font-semibold text-slate-800">web seeker</span>. جميع الحقوق محفوظة.
        </p>

        {/* by yazan alsawadi & contact info */}
        <div className="flex flex-col items-center sm:items-end gap-0.5">
          <p
            className="text-slate-600 font-medium tracking-wide text-[11px] sm:text-xs"
            style={{ fontFamily: "'Comfortaa', cursive, sans-serif" }}
          >
            Designed & Built by yazan alsawadi
          </p>
          <p
            className="text-slate-500 font-normal tracking-wide text-[10px] sm:text-[10.5px]"
            style={{ fontFamily: "'Comfortaa', cursive, sans-serif", direction: 'ltr' }}
          >
            for contact{' '}
            <a
              href="https://wa.me/963960035835"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-emerald-600 transition-colors"
            >
              +963 960035835
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
