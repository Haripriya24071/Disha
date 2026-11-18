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
        <div className="space-y-4">
          <div className="rounded-[24px] bg-[#FFD600] border-2 border-[#0A0A0A] p-5 space-y-2">
            <span className="inline-block bg-[#0A0A0A] text-[#FFD600] text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              {selectedId}
            </span>
            <h3 className="text-[1.45rem] font-extrabold leading-tight">
              {t(`term.${selectedId}.name`)}
            </h3>
            <p className="text-[1.1rem] font-semibold leading-relaxed pt-1">
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
            <p className="text-xs font-bold bg-white border-2 border-[#0A0A0A] rounded-2xl p-3">
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
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-4 text-[#0A0A0A]/60" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="WL, RAC, GNWL, chart..."
              className="w-full min-h-[56px] pl-12 pr-5 rounded-full border-2 border-[#0A0A0A] bg-white font-bold outline-none"
            />
          </div>
          <div className="space-y-2">
            {filtered.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedId(id)}
                className="w-full min-h-[56px] px-5 py-3 rounded-full border-2 border-[#0A0A0A] bg-white hover:bg-[#FFD600] transition text-left flex items-center justify-between gap-3 font-extrabold"
              >
                <span>{t(`term.${id}.name`)}</span>
                <span>→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Sheet>
  );
}
