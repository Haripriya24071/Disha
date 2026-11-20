import React from 'react';
import { ArrowLeft, TrainTrack } from 'lucide-react';
import { useT } from '../i18n/useT';
import LangDropdown from './LangDropdown';

export default function Header({ title, onBack, rightElement }) {
  const { t } = useT();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-2xs">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 active:scale-95 transition text-slate-800 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0A1E3F] text-amber-400 flex items-center justify-center shadow-xs">
              <TrainTrack className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0A1E3F]">
                {title || 'Disha'}
              </span>
              {!title && (
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {t('ui.railway_guide') || 'Indian Railways Guide'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rightElement}
          <LangDropdown />
        </div>
      </div>
    </header>
  );
}
