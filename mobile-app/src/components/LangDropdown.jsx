import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useT, LANGUAGES } from '../i18n/useT';
import Sheet from './Sheet';

export default function LangDropdown() {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="min-h-[56px] px-4 rounded-xl bg-white text-[#1A1A2E] border-2 border-[#1A1A2E] font-bold flex items-center gap-2"
      >
        <Globe className="w-5 h-5" aria-hidden="true" />
        <span lang={current.code}>{current.native}</span>
        <ChevronDown className="w-5 h-5" aria-hidden="true" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Language / भाषा / ಭಾಷೆ">
        <div className="grid grid-cols-1 gap-2" role="listbox">
          {LANGUAGES.map((item) => {
            const active = item.code === lang;
            return (
              <button
                key={item.code}
                type="button"
                lang={item.code}
                onClick={() => {
                  setLang(item.code);
                  setOpen(false);
                }}
                className={`min-h-[56px] px-4 rounded-xl border-2 flex items-center justify-between text-left font-bold ${
                  active
                    ? 'bg-[#1A1A2E] text-white border-[#1A1A2E]'
                    : 'bg-white text-[#1A1A2E] border-slate-300'
                }`}
              >
                <span>{item.native}</span>
                {active && <Check className="w-6 h-6" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </Sheet>
    </>
  );
}
