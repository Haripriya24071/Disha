import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useT } from '../i18n/useT';
import LangDropdown from './LangDropdown';

export default function Header({ title, onBack }) {
  const { t } = useT();

  return (
    <header className="sticky top-0 z-40 bg-[#F0F4FF] border-b border-slate-300 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl border-2 border-[#1A1A2E] bg-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <span className="text-[1.45rem] font-extrabold tracking-tight">
            {title || t('ui.app_name')}
          </span>
        </div>
        <LangDropdown />
      </div>
    </header>
  );
}
