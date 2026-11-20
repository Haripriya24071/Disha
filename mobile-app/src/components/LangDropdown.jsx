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
        className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-black text-sm sm:text-base flex items-center gap-2 transition cursor-pointer"
      >
        <Globe className="w-4 h-4 text-slate-700 shrink-0" aria-hidden="true" />
        <span lang={current.code} className="font-extrabold">{current.native}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-600 stroke-[2.5]" aria-hidden="true" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Select Language / भाषा चुनें / ಭಾಷೆ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1" role="listbox">
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
                className={`min-h-[58px] px-4 py-3 rounded-2xl border-2 flex items-center justify-between text-left font-black transition cursor-pointer ${
                  active
                    ? 'bg-[#0A1E3F] text-amber-400 border-[#0A1E3F] shadow-sm'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg">{item.native}</span>
                  <span className="text-[11px] font-semibold opacity-70 uppercase tracking-wider">{item.code}</span>
                </div>
                {active && <Check className="w-5 h-5 text-amber-400 stroke-[3]" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </Sheet>
    </>
  );
}
