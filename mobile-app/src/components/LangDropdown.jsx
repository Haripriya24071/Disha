import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useT, LANGUAGES } from '../i18n/useT';
import Sheet from './Sheet';

const LANG_DETAILS = {
  en: { englishName: 'English', state: 'Pan-India' },
  kn: { englishName: 'Kannada', state: 'Karnataka' },
  hi: { englishName: 'Hindi', state: 'National' },
  ta: { englishName: 'Tamil', state: 'Tamil Nadu' },
  te: { englishName: 'Telugu', state: 'Andhra Pradesh & Telangana' },
  ml: { englishName: 'Malayalam', state: 'Kerala' },
  bn: { englishName: 'Bengali', state: 'West Bengal' },
  mr: { englishName: 'Marathi', state: 'Maharashtra' },
};

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
        className="min-h-[46px] px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
      >
        <Globe className="w-4 h-4 text-slate-950 shrink-0 stroke-[2.5]" aria-hidden="true" />
        <span lang={current.code} className="font-black">{current.native}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-950 stroke-[3]" aria-hidden="true" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Select Language / भाषा चुनें / ಭಾಷೆ">
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-600">
            Choose your preferred Indian language. The entire screen and audio status updates will adapt instantly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1" role="listbox">
            {LANGUAGES.map((item) => {
              const active = item.code === lang;
              const detail = LANG_DETAILS[item.code] || { englishName: item.label, state: '' };

              return (
                <button
                  key={item.code}
                  type="button"
                  lang={item.code}
                  onClick={() => {
                    setLang(item.code);
                    setOpen(false);
                  }}
                  className={`min-h-[64px] px-4 py-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] ring-2 ring-amber-400/50'
                      : 'bg-white text-slate-900 border-slate-900 hover:bg-amber-50/80 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-xl font-black">{item.native}</span>
                    <span className={`text-xs font-bold mt-0.5 ${active ? 'text-slate-300' : 'text-slate-600'}`}>
                      {detail.englishName} · <span className="uppercase text-[10px] font-mono">{item.code}</span>
                    </span>
                  </div>
                  {active && (
                    <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 border border-slate-950">
                      <Check className="w-5 h-5 stroke-[3]" aria-hidden="true" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Sheet>
    </>
  );
}
