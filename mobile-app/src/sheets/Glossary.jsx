import React, { useState, useEffect } from 'react';
import { Search, Volume2, Square, ArrowLeft } from 'lucide-react';
import { useT } from '../i18n/useT';
import { useSpeech } from '../hooks/useSpeech';
import Sheet from '../components/Sheet';
import BigButton from '../components/BigButton';

const TERM_IDS = [
  'pnr', 'wl', 'gnwl', 'rlwl', 'pqwl', 'rac', 'cnf',
  'chart', 'berth', 'coach', 'class', 'tatkal', 'platform', 'decideby',
];

export default function Glossary({ open, onClose, initialTermId = null }) {
  const { t } = useT();
  const { speak, speaking, voiceUnavailable } = useSpeech();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(initialTermId);

  useEffect(() => {
    setSelectedId(initialTermId);
    setQuery('');
  }, [initialTermId, open]);

  const filtered = TERM_IDS.filter((id) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      id.includes(q) ||
      t(`term.${id}.name`).toLowerCase().includes(q) ||
      t(`term.${id}.meaning`).toLowerCase().includes(q)
    );
  });

  return (
    <Sheet open={open} onClose={onClose} title={t('ui.glossary')}>
      {selectedId ? (
        <div className="space-y-4 pt-1">
          <div className="rounded-2xl bg-amber-400 border-2 border-slate-900 p-6 space-y-2 shadow-[4px_4px_0px_0px_#0f172a]">
            <span className="inline-block bg-slate-900 text-amber-400 text-xs font-black uppercase px-3 py-1 rounded-lg border border-slate-900">
              {selectedId}
            </span>
            <h3 className="text-2xl font-black text-slate-950 leading-tight">
              {t(`term.${selectedId}.name`)}
            </h3>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed pt-1">
              {t(`term.${selectedId}.meaning`)}
            </p>
          </div>

          <BigButton
            icon={speaking ? Square : Volume2}
            variant="primary"
            onClick={() =>
              speak(`${t(`term.${selectedId}.name`)}. ${t(`term.${selectedId}.meaning`)}`)
            }
          >
            {speaking ? t('ui.stop') : t('ui.listen')}
          </BigButton>

          {voiceUnavailable && (
            <p className="text-xs font-bold bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_#0f172a]">
              {t('ui.voice_unavailable')}
            </p>
          )}

          {!initialTermId && (
            <BigButton
              icon={ArrowLeft}
              variant="secondary"
              onClick={() => setSelectedId(null)}
            >
              {t('ui.glossary')}
            </BigButton>
          )}
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-4 text-slate-900" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search WL, RAC, GNWL, chart, berth..."
              className="w-full min-h-[56px] pl-12 pr-5 rounded-2xl border-2 border-slate-900 bg-white font-black text-base text-slate-900 outline-none shadow-[2px_2px_0px_0px_#0f172a] focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {filtered.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedId(id)}
                className="w-full min-h-[56px] px-5 py-3 rounded-2xl border-2 border-slate-900 bg-white hover:bg-amber-100 transition-all text-left flex items-center justify-between gap-3 font-black shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-mono text-xs flex items-center justify-center border border-slate-900">
                    {id.toUpperCase().slice(0, 3)}
                  </span>
                  <span className="text-base text-slate-950">{t(`term.${id}.name`)}</span>
                </div>
                <span className="text-slate-900 font-bold text-lg">➔</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Sheet>
  );
}
