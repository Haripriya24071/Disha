import React, { useState, useEffect } from 'react';
import { Train, Bus, ExternalLink, CheckCircle2, Clock, HelpCircle, PhoneCall, ArrowLeft } from 'lucide-react';
import { useT } from '../i18n/useT';
import Header from '../components/Header';
import BigButton from '../components/BigButton';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '';

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
      number: '12607',
      name: 'Lalbagh Express',
      departs: '15:30',
      arrives: '21:00',
      availability: 'Waiting',
      book_url: 'https://www.irctc.co.in/',
    },
    {
      number: '12007',
      name: 'Shatabdi Express',
      departs: '06:00',
      arrives: '10:55',
      availability: 'Available',
      book_url: 'https://www.irctc.co.in/',
    },
  ],
  buses: [
    {
      operator: 'KSRTC (Airavat / Club Class)',
      note: 'Karnataka State Road Transport Corporation',
      url: 'https://ksrtc.in/',
    },
    {
      operator: 'MSRTC / State Road Transport',
      note: 'Official Interstate State Transport',
      url: 'https://msrtc.maharashtra.gov.in/',
    },
    {
      operator: 'redBus (Private & State Fleets)',
      note: 'Compare timings & sleeper buses',
      url: 'https://www.redbus.in/',
    },
  ],
  fallback_help: '139',
};

export function S3Backup({ journey, onBack }) {
  const { t } = useT();
  const [data, setData] = useState(FALLBACK_BACKUP);

  useEffect(() => {
    const endpoint = API_BASE ? `${API_BASE}/api/backup` : '/api/backup';
    const date = (journey?.departure_iso || '').slice(0, 10);
    const from = journey?.route?.from || 'SBC';
    const to = journey?.route?.to || 'MAS';

    fetch(`${endpoint}?from=${from}&to=${to}&date=${date}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.trains) setData(json);
      })
      .catch(() => {});
  }, [journey]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Header title={t('ui.backup_plan')} onBack={onBack} />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 pt-3 pb-10 space-y-6">
        {/* Reassurance Hero Card */}
        <div className="rounded-3xl bg-[#0A1E3F] text-white p-5 sm:p-6 shadow-sm border border-slate-900">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">
            Travel Options & Alternatives
          </span>
          <h1 className="text-xl sm:text-2xl font-black leading-snug">
            Your ticket may not confirm before chart preparation. Here are verified alternatives to reach your destination:
          </h1>
        </div>

        {/* Alternative Trains Section */}
        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Train className="w-4 h-4 text-[#0A1E3F]" />
            <span>{t('ui.other_trains')} on Same Route</span>
          </h2>

          <div className="space-y-3">
            {data.trains.map((tr) => {
              const isAvail = tr.availability === 'Available';
              const isWait = tr.availability === 'Waiting';
              return (
                <div
                  key={tr.number}
                  className="rounded-2xl bg-white border border-slate-300/80 p-4 sm:p-5 shadow-xs space-y-3 hover:border-slate-400 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-base sm:text-lg text-[#0A1E3F]">
                        {tr.number} · {tr.name}
                      </p>
                      <p className="text-sm font-semibold text-slate-600 mt-0.5">
                        Departs: <strong className="text-slate-900">{tr.departs}</strong> → Arrives: <strong className="text-slate-900">{tr.arrives}</strong>
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shrink-0 ${
                        isAvail
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isWait
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {isAvail ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                      ) : isWait ? (
                        <Clock className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />
                      ) : (
                        <HelpCircle className="w-3.5 h-3.5 text-slate-600 stroke-[2.5]" />
                      )}
                      <span>{tr.availability}</span>
                    </span>
                  </div>

                  <a
                    href={tr.book_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[48px] px-4 rounded-xl bg-[#0A1E3F] text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-[#163668] active:scale-[0.99] transition shadow-xs"
                  >
                    <span>{t('ui.book')} on Official IRCTC</span>
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* State Buses Section */}
        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Bus className="w-4 h-4 text-[#0A1E3F]" />
            <span>{t('ui.buses')} (Government & Verified Services)</span>
          </h2>

          <div className="space-y-2.5">
            {data.buses.map((bus, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-300/80 p-4 flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <p className="font-black text-base text-slate-900">{bus.operator}</p>
                  <p className="text-xs font-semibold text-slate-500">{bus.note}</p>
                </div>
                <a
                  href={bus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-amber-50 hover:border-amber-400 text-slate-900 font-black text-xs sm:text-sm inline-flex items-center gap-1.5 shrink-0 transition"
                >
                  <span>{t('ui.open_site')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Railway 139 Call Button */}
        <div className="pt-1">
          <a
            href="tel:139"
            className="w-full min-h-[52px] rounded-2xl border border-red-200 bg-red-50 text-red-900 hover:bg-red-100 font-black text-sm flex items-center justify-center gap-2 transition"
          >
            <PhoneCall className="w-4 h-4 text-red-700" />
            <span>Need human help? Call Railway Helpline 139</span>
          </a>
        </div>

        {/* Return Button: No Pressure */}
        <div className="pt-2">
          <BigButton variant="secondary" onClick={onBack} icon={ArrowLeft}>
            {t('ui.wait')}
          </BigButton>
        </div>
      </main>
    </div>
  );
}

export default S3Backup;
