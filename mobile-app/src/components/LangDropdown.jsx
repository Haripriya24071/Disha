import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
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
        className="min-h-[48px] px-5 rounded-full bg-[#F4F3EF] text-[#0A0A0A] border-2 border-[#0A0A0A] font-bold text-base flex items-center gap-2 hover:bg-white transition"
      >
        <span lang={current.code}>{current.native}</span>
        <ChevronDown className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Language / भाषा / ಭಾಷೆ">
        <div className="grid grid-cols-1 gap-2.5" role="listbox">
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
                className={`min-h-[56px] px-6 rounded-full border-2 border-[#0A0A0A] flex items-center justify-between text-left font-extrabold ${
                  active
                    ? 'bg-[#0A0A0A] text-[#FFD600]'
                    : 'bg-[#F4F3EF] text-[#0A0A0A] hover:bg-white'
                }`}
              >
                <span>{item.native}</span>
                {active && <Check className="w-5 h-5" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </Sheet>
    </>
  );
}
