import React, { useState } from 'react';
import {
  AlarmClock,
  Train,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Radio,
  ArrowRight
} from 'lucide-react';
import { useT } from '../i18n/useT';
import { renderRich } from './Term';

export default function StatusCard({ journey, onOpenTerm }) {
  const { t, lang } = useT();
  const [showRaw, setShowRaw] = useState(false);

  if (!journey) return null;
  const { train, route, departure_iso, ticket, platform, delay_minutes, train_state, chart, data_source } = journey;

  const isCancelled = train_state === 'cancelled';
  const type = ticket?.type || 'WL';

  // Status themes in Neo-brutalist style
  let statusBadge = {
    title: t('ui.scenarios_wl') || 'WAITING LIST',
    color: 'bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]',
    bannerBg: 'bg-amber-50 border-2 border-slate-900',
    icon: Clock,
    bodyKey: 'status.wl',
    bodyVars: { pos: ticket?.wl_position ?? '8' },
  };

  if (isCancelled) {
    statusBadge = {
      title: t('ui.scenarios_cancelled') || 'TRAIN CANCELLED',
      color: 'bg-red-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]',
      bannerBg: 'bg-red-50 border-2 border-slate-900',
      icon: AlertTriangle,
      bodyKey: 'alert.cancelled',
      bodyVars: {},
    };
  } else if (type === 'CNF') {
    statusBadge = {
      title: t('ui.scenarios_cnf') || 'TICKET CONFIRMED',
      color: 'bg-emerald-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]',
      bannerBg: 'bg-emerald-50 border-2 border-slate-900',
      icon: CheckCircle2,
      bodyKey: 'status.cnf',
      bodyVars: { coach: ticket?.coach || 'B2', berth: ticket?.berth || '32' },
    };
  } else if (type === 'RAC') {
    statusBadge = {
      title: t('ui.scenarios_rac') || 'SEAT TO SIT (RAC)',
      color: 'bg-blue-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]',
      bannerBg: 'bg-blue-50 border-2 border-slate-900',
      icon: Layers,
      bodyKey: 'status.rac',
      bodyVars: {},
    };
  }

  const departureDate = departure_iso ? new Date(departure_iso) : null;
  const formattedTime = departureDate
    ? new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit' }).format(departureDate)
    : null;
  const formattedDate = departureDate
    ? new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', weekday: 'short' }).format(departureDate)
    : null;

  const decideText =
    !isCancelled && type !== 'CNF'
      ? chart?.source === 'api' && chart?.time_iso
        ? t('status.decide', {
            time: new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit' }).format(
              new Date(chart.time_iso)
            ),
          })
        : t('status.decide_est')
      : null;

  const berthTypeStr =
    ticket?.berth_type ||
    (ticket?.raw?.includes('LB')
      ? 'Lower Berth'
      : ticket?.raw?.includes('UB')
      ? 'Upper Berth'
      : ticket?.raw?.includes('SL')
      ? 'Side Lower'
      : 'Berth Assigned');

  return (
    <article className="rounded-3xl bg-white border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden">
      {/* Top Railway Masthead */}
      <div className="bg-slate-900 text-white p-5 sm:p-7 border-b-3 border-slate-900 relative">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black tracking-wider uppercase px-3 py-1 rounded-lg bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#ffffff]">
                {train?.class || '3A'}
              </span>
              <span className="text-xs font-bold text-slate-300">
                PNR: <strong className="text-amber-300 font-mono text-sm tracking-wider">{journey.pnr}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2 flex items-center gap-2.5">
              <Train className="w-6 h-6 text-amber-400 shrink-0" />
              <span>{train?.number || '12345'} · {train?.name || 'Express'}</span>
            </h2>
          </div>

          {/* Authentic Electronic LED Amber Platform Board */}
          <div className="self-start sm:self-auto sm:text-right shrink-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block mb-1">
              {t('ui.platform_label') || 'PLATFORM · प्लेटफॉर्म'}
            </span>
            <div className="inline-flex items-center gap-2 bg-black border-2 border-amber-400 rounded-xl px-4 py-1.5 shadow-[inset_0_0_10px_rgba(251,191,36,0.3)]">
              <span className="font-mono font-black text-amber-400 text-3xl sm:text-4xl tracking-widest leading-none">
                {platform?.current ? `PF ${platform.current}` : 'PF —'}
              </span>
              <span className="text-[10px] font-black uppercase text-amber-300/80 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                {isCancelled ? 'CANCELLED' : delay_minutes > 0 ? `+${delay_minutes}M` : 'ON TIME'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Animated Train Track Route */}
        <div className="mt-6 pt-4 border-t-2 border-slate-700/80">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-black text-white text-base sm:text-lg">{route?.from || 'SBC'}</span>
                <span className="text-slate-300 text-xs ml-1.5 block sm:inline">({route?.from_name || 'Origin'})</span>
              </div>
            </div>

            {/* Track Line with moving train */}
            <div className="flex-1 mx-3 sm:mx-6 relative flex items-center justify-center">
              <div className="w-full h-1.5 bg-slate-700 rounded-full relative">
                <div className="absolute left-0 top-0 bottom-0 bg-amber-400 rounded-full w-2/3" />
                <div className="absolute left-2/3 -top-3 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center border-2 border-slate-900 shadow-sm animate-pulse">
                  <Train className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            <div className="text-right">
              <div>
                <span className="font-black text-white text-base sm:text-lg">{route?.to || 'MAS'}</span>
                <span className="text-slate-300 text-xs ml-1.5 block sm:inline">({route?.to_name || 'Destination'})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Status Information Body */}
      <div className="p-6 sm:p-8 space-y-6 bg-white">
        {/* Status Pill & Live API Indicator */}
        <div className={`p-5 rounded-2xl ${statusBadge.bannerBg} shadow-[3px_3px_0px_0px_#0f172a]`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase ${statusBadge.color}`}>
              <statusBadge.icon className="w-4 h-4 shrink-0 stroke-[3]" />
              <span>{statusBadge.title}</span>
            </span>

            {data_source && (
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-300">
                <span className={`w-2.5 h-2.5 rounded-full ${data_source === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span>{data_source === 'live' ? 'Live Railway API' : data_source === 'cached' ? 'Cached Record' : 'Verified PNR'}</span>
              </span>
            )}
          </div>

          {/* Plain Language Status Sentence */}
          <h3 className="text-xl sm:text-2xl font-black leading-snug tracking-tight text-slate-950">
            {renderRich(t(statusBadge.bodyKey, statusBadge.bodyVars), onOpenTerm)}
          </h3>
        </div>

        {/* Visual Coach & Berth Map (for Confirmed CNF) */}
        {type === 'CNF' && ticket?.coach && ticket?.berth && (
          <div className="rounded-2xl border-2 border-slate-900 bg-emerald-50/80 p-5 space-y-4 shadow-[3px_3px_0px_0px_#0f172a]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  {ticket.coach}
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                    {t('ui.coach_berth') || 'Assigned Coach & Berth'}
                  </p>
                  <p className="text-xl font-black text-slate-950">
                    Berth {ticket.berth} · {berthTypeStr}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-slate-950 bg-emerald-300 border-2 border-slate-900 px-3 py-1 rounded-xl shadow-[1px_1px_0px_0px_#0f172a]">
                ✔ {t('ui.confirmed') || 'Confirmed Seat'}
              </span>
            </div>

            {/* Interactive Mini Coach Cross-Section Layout */}
            <div className="p-3 bg-white rounded-xl border-2 border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Coach {ticket.coach} Layout:
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-600">LB (Lower)</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-600">MB (Middle)</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-600">UB (Upper)</span>
                <span className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] animate-pulse">
                  Seat #{ticket.berth}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-600">SL (Side)</span>
              </div>
            </div>
          </div>
        )}

        {/* RAC Berth Details */}
        {type === 'RAC' && (
          <div className="rounded-2xl border-2 border-slate-900 bg-blue-50 p-5 flex flex-wrap items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#0f172a]">
            <div>
              <p className="text-xs font-black uppercase text-blue-900 tracking-wider">
                {t('ui.seat_allocation') || 'Seat Allocation'}
              </p>
              <p className="text-lg font-black text-slate-950">
                {ticket.berth || ticket.raw || 'Sitting Seat Reserved in Coach S4'}
              </p>
            </div>
            <span className="text-xs font-black text-slate-950 bg-amber-300 border-2 border-slate-900 px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#0f172a]">
              Eligible for Full Berth on Cancellation
            </span>
          </div>
        )}

        {/* Charting Decide-By Time Box */}
        {decideText && (
          <div className="rounded-2xl border-2 border-slate-900 bg-amber-50 p-5 flex items-start gap-3.5 shadow-[3px_3px_0px_0px_#0f172a]">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#0f172a]">
              <AlarmClock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-950 block">
                Reservation Charting Schedule (Decide-By Time)
              </span>
              <p className="text-base font-bold leading-relaxed text-slate-900">
                {renderRich(decideText, onOpenTerm)}
              </p>
            </div>
          </div>
        )}

        {/* Delay notice if train delayed */}
        {delay_minutes > 0 && (
          <div className="rounded-2xl border-2 border-slate-900 bg-red-50 p-5 flex items-center gap-3.5 shadow-[3px_3px_0px_0px_#0f172a]">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#0f172a]">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-base font-black text-red-950">
              {t('alert.delay', { min: delay_minutes, time: formattedTime || '' })}
            </div>
          </div>
        )}

        {/* Departure Time & Date Footer */}
        <div className="pt-4 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-3 text-sm font-black text-slate-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-900" />
            <span>Scheduled Departure: {formattedDate} at {formattedTime}</span>
          </div>

          {ticket?.raw && (
            <button
              type="button"
              onClick={() => setShowRaw((v) => !v)}
              className="text-xs font-black text-slate-900 hover:text-amber-600 border border-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition"
            >
              <span>{showRaw ? `Raw: ${ticket.raw}` : t('ui.show_technical')}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showRaw ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
