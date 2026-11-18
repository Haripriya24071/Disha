import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useT } from '../i18n/useT';
import LangDropdown from './LangDropdown';

export default function Header({ title, onBack }) {
  const { t } = useT();

  return (
    <header className="sticky top-0 z-40 bg-[#F4F3EF]/95 backdrop-blur-sm px-5 pt-5 pb-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#0A0A0A] bg-[#F4F3EF] hover:bg-white transition"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
          <span className="text-[1.75rem] font-extrabold tracking-[-0.03em] text-[#0A0A0A]">
            {title || 'Disha'}
          </span>
        </div>
        <LangDropdown />
      </div>
    </header>
  );
}
