import React, { useState, useEffect } from 'react';
import { Train, Bus, ExternalLink, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import { useT } from '../i18n/useT';
import Header from '../components/Header';
import BigButton from '../components/BigButton';

const API_BASE = import.meta.env.VITE_API_URL || '';

const FALLBACK_BACKUP = {
  trains: [
    {
      number: '12627',
      name: 'Karnataka Express',
      departs: '21:20',
      arrives: '05:10',
      availability: 'Available',
      book_url: 'https://www.irctc.co.in/',
    },
    {
      number: '16526',
      name: 'Island Express',
      departs: '20:15',
      arrives: '06:45',
      availability: 'Waiting',
      book_url: 'https://www.irctc.co.in/',
    },
  ],
  buses: [
    {
      operator: 'KSRTC',
      note: 'Check timings on the official site',
      url: 'https://ksrtc.in/',
    },
    {
      operator: 'MSRTC / Official State Bus',
      note: 'Check timings on the official site',
      url: 'https://www.redbus.in/',
    },
  ],
  fallback_help: '139',
};

export function S3Backup({ journey, onBack }) {
  const { t } = useT();
  const [data, setData] = useState(FALLBACK_BACKUP);

  useEffect(() => {
    if (!API_BASE || !journey?.route?.from || !journey?.route?.to) return;
    const date = (journey.departure_iso || '').slice(0, 10);
    fetch(`${API_BASE}/api/backup?from=${journey.route.from}&to=${journey.route.to}&date=${date}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.trains) setData(json);
      })
      .catch(() => {});
  }, [journey]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F3EF] text-[#0A0A0A]">
      <Header title={t('ui.backup_plan')} onBack={onBack} />

      <main className="flex-1 max-w-md w-full mx-auto px-5 pt-2 pb-8 space-y-5">
        <div className="rounded-[24px] bg-[#FFD600] border-2 border-[#0A0A0A] p-5">
          <p className="text-[1.15rem] font-extrabold leading-snug">
            Your ticket may not confirm. Here are other ways to go:
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0A0A0A]/70 flex items-center gap-2">
            <Train className="w-4 h-4" />
            <span>{t('ui.other_trains')}</span>
          </h2>

          {data.trains.map((tr) => {
            const isAvail = tr.availability === 'Available';
            const isWait = tr.availability === 'Waiting';
            return (
              <div
                key={tr.number}
                className="card-surface rounded-[24px] bg-white border-2 border-[#0A0A0A] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-extrabold text-base">
                      {tr.number} · {tr.name}
                    </p>
                    <p className="text-sm font-semibold text-[#0A0A0A]/75">
                      {tr.departs} → {tr.arrives}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold border border-[#0A0A0A] ${
                      isAvail
                        ? 'bg-[#FFD600] text-[#0A0A0A]'
                        : 'bg-[#F4F3EF] text-[#0A0A0A]'
                    }`}
                  >
                    {isAvail ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isWait ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : (
                      <HelpCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{tr.availability}</span>
                  </span>
                </div>

                <a
                  href={tr.book_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] px-5 rounded-full bg-[#0A0A0A] text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#222]"
                >
                  <span>{t('ui.book')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0A0A0A]/70 flex items-center gap-2">
            <Bus className="w-4 h-4" />
            <span>{t('ui.buses')}</span>
          </h2>

          {data.buses.map((bus, idx) => (
            <div
              key={idx}
              className="card-surface rounded-[24px] bg-white border-2 border-[#0A0A0A] p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-extrabold text-base">{bus.operator}</p>
                <p className="text-xs font-semibold text-[#0A0A0A]/75">{bus.note}</p>
              </div>
              <a
                href={bus.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-4 rounded-full border-2 border-[#0A0A0A] bg-[#F4F3EF] hover:bg-[#FFD600] font-extrabold text-sm inline-flex items-center gap-1.5 shrink-0"
              >
                <span>{t('ui.open_site')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </section>

        <div className="pt-2">
          <BigButton variant="secondary" onClick={onBack}>
            {t('ui.wait')}
          </BigButton>
        </div>
      </main>
    </div>
  );
}

export default S3Backup;
