import React from 'react';
import { ArrowLeft, TrainTrack } from 'lucide-react';
import { useT } from '../i18n/useT';
import LangDropdown from './LangDropdown';

export default function Header({ title, onBack, rightElement }) {
  const { t } = useT();

  return (
    <header className="sticky top-0 z-40 bg-[#FCFCF9] border-b-2 border-slate-900 px-4 sm:px-6 py-3 shadow-[0_2px_0_0_#0f172a]">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-slate-900 bg-white hover:bg-amber-100 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center">
              <TrainTrack className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none block">
                {title || 'Disha'}
              </span>
              {!title && (
                <span className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-wider block mt-0.5">
                  {t('ui.railway_guide') || 'Indian Railways Guide'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {rightElement}
          <LangDropdown />
        </div>
      </div>
    </header>
  );
}
