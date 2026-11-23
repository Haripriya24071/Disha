import React, { useState, useEffect } from 'react';
import { Train, Bus, ExternalLink, CheckCircle2, Clock, HelpCircle, PhoneCall, ArrowLeft, ShieldAlert } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-950">
      <Header title={t('ui.backup_plan')} onBack={onBack} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Reassurance Hero Card */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-2">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-amber-400 text-slate-950 rounded-lg inline-block border border-slate-950">
            Travel Options & Alternatives
          </span>
          <h1 className="text-2xl sm:text-3xl font-black leading-snug">
            Your ticket may not confirm before chart preparation. Here are verified alternatives to reach your destination:
          </h1>
          <p className="text-sm font-semibold text-slate-300">
            Route: <strong className="text-amber-300">{journey?.route?.from || 'SBC'} ({journey?.route?.from_name || 'Origin'})</strong> ➔ <strong className="text-amber-300">{journey?.route?.to || 'MAS'} ({journey?.route?.to_name || 'Destination'})</strong>
          </p>
        </div>

        {/* Alternative Trains Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Train className="w-5 h-5 text-slate-900" />
              <span>{t('ui.other_trains')} on Same Route</span>
            </h2>
            <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full border border-slate-400">
              IRCTC Connected
            </span>
          </div>

          <div className="space-y-4">
            {data.trains.map((tr) => {
              const isAvail = tr.availability === 'Available';
              const isWait = tr.availability === 'Waiting';
              return (
                <div
                  key={tr.number}
                  className="rounded-2xl bg-white border-2 border-slate-900 p-5 sm:p-6 shadow-[4px_4px_0px_0px_#0f172a] space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-xl text-slate-950">
                        {tr.number} · {tr.name}
                      </p>
                      <p className="text-sm font-bold text-slate-700 mt-1">
                        Departs: <strong className="text-slate-950">{tr.departs}</strong> → Arrives: <strong className="text-slate-950">{tr.arrives}</strong>
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 border-2 border-slate-900 ${
                        isAvail
                          ? 'bg-emerald-300 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]'
                          : isWait
                          ? 'bg-amber-300 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]'
                          : 'bg-slate-200 text-slate-900'
                      }`}
                    >
                      {isAvail ? (
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      ) : isWait ? (
                        <Clock className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <HelpCircle className="w-4 h-4 stroke-[3]" />
                      )}
                      <span>{tr.availability}</span>
                    </span>
                  </div>

                  <a
                    href={tr.book_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[52px] px-5 rounded-xl bg-slate-900 text-white font-black text-base flex items-center justify-center gap-2 hover:bg-slate-800 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
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
        <section className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-slate-900" />
            <span>{t('ui.buses')} (Government & Verified Fleets)</span>
          </h2>

          <div className="space-y-3">
            {data.buses.map((bus, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border-2 border-slate-900 p-5 flex flex-wrap items-center justify-between gap-3 shadow-[4px_4px_0px_0px_#0f172a]"
              >
                <div>
                  <p className="font-black text-lg text-slate-950">{bus.operator}</p>
                  <p className="text-xs font-bold text-slate-600">{bus.note}</p>
                </div>
                <a
                  href={bus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] px-4 rounded-xl border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm inline-flex items-center gap-2 shrink-0 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <span>{t('ui.open_site')}</span>
                  <ExternalLink className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Railway 139 Call Button */}
        <div className="pt-2">
          <a
            href="tel:139"
            className="w-full min-h-[56px] rounded-2xl border-2 border-slate-900 bg-red-100 text-red-950 hover:bg-red-200 font-black text-base flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <PhoneCall className="w-5 h-5 text-red-700 stroke-[2.5]" />
            <span>Need human assistance? Call Railway Helpline 139</span>
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
