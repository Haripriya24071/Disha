import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useT } from '../i18n/useT';
import Sheet from '../components/Sheet';
import ListenButton from '../components/ListenButton';

const TERM_IDS = [
  'pnr', 'wl', 'gnwl', 'rlwl', 'pqwl', 'rac', 'cnf',
  'chart', 'berth', 'coach', 'class', 'tatkal', 'platform', 'decideby',
];

export default function Glossary({ open, onClose, initialTermId = null }) {
  const { t } = useT();
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
        <div className="space-y-4">
          <h3 className="text-[1.4rem] font-extrabold">{t(`term.${selectedId}.name`)}</h3>
          <p className="text-[1.15rem] leading-relaxed">{t(`term.${selectedId}.meaning`)}</p>
          <ListenButton
            text={`${t(`term.${selectedId}.name`)}. ${t(`term.${selectedId}.meaning`)}`}
            variant="primary"
          />
          {!initialTermId && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="underline font-bold min-h-[48px] block"
            >
              ← {t('ui.glossary')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-4 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="WL, RAC, GNWL, chart..."
              className="w-full min-h-[56px] pl-11 pr-4 rounded-xl border-2 border-[#1A1A2E]"
            />
          </div>
          <div className="divide-y divide-slate-200">
            {filtered.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedId(id)}
                className="w-full min-h-[56px] py-3 text-left flex items-center justify-between gap-3 font-bold hover:bg-slate-50"
              >
                <span>{t(`term.${id}.name`)}</span>
                <span className="text-slate-500">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Sheet>
  );
}
