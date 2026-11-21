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
  Armchair,
  Sparkles,
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

  // Status-specific themes
  let statusBadge = {
    title: t('ui.scenarios_wl') || 'WAITING LIST',
    color: 'bg-amber-500 text-slate-950',
    border: 'border-amber-500',
    icon: Clock,
    bodyKey: 'status.wl',
    bodyVars: { pos: ticket?.wl_position ?? '8' },
  };

  if (isCancelled) {
    statusBadge = {
      title: t('ui.scenarios_cancelled') || 'TRAIN CANCELLED',
      color: 'bg-red-700 text-white',
      border: 'border-red-700',
      icon: AlertTriangle,
      bodyKey: 'alert.cancelled',
      bodyVars: {},
    };
  } else if (type === 'CNF') {
    statusBadge = {
      title: t('ui.scenarios_cnf') || 'TICKET CONFIRMED',
      color: 'bg-emerald-700 text-white',
      border: 'border-emerald-700',
      icon: CheckCircle2,
      bodyKey: 'status.cnf',
      bodyVars: { coach: ticket?.coach || '-', berth: ticket?.berth || '-' },
    };
  } else if (type === 'RAC') {
    statusBadge = {
      title: t('ui.scenarios_rac') || 'SEAT TO SIT (RAC)',
      color: 'bg-[#0A1E3F] text-amber-300',
      border: 'border-[#0A1E3F]',
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

  const berthNumber = Number(ticket?.berth) || 32;
  const berthTypeStr = ticket?.berth_type || (ticket?.raw?.includes('LB') ? 'Lower Berth' : ticket?.raw?.includes('UB') ? 'Upper Berth' : ticket?.raw?.includes('SL') ? 'Side Lower' : 'Berth Assigned');

  return (
    <article className="card-surface rounded-3xl bg-white border-2 border-slate-300/80 shadow-md overflow-hidden space-y-0">
      {/* Top Railway Board Bar */}
      <div className="bg-[#0A1E3F] text-white p-5 sm:p-6 relative overflow-hidden">
        {/* Subtle Watermark Rail Track */}
        <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none flex items-center pr-4">
          <Train className="w-48 h-48 text-white" />
        </div>

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-2xs">
                {train?.class || '3A'}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                PNR: <strong className="text-white font-mono">{journey.pnr}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1.5 flex items-center gap-2">
              <Train className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{train?.number || '12345'} · {train?.name || 'Express'}</span>
            </h2>
          </div>

          {/* Authentic Electronic Platform Signboard */}
          <div className="text-right shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-0.5">
              {t('ui.platform_label') || 'PLATFORM'}
            </span>
            <div className="inline-block bg-slate-950 border-2 border-amber-500/80 rounded-xl px-3.5 py-1 font-mono font-black text-amber-400 text-2xl tracking-wider shadow-inner">
              {platform?.current ? platform.current : '—'}
            </div>
          </div>
        </div>

        {/* Visual Animated Train Track Route */}
        <div className="mt-5 pt-3.5 border-t border-white/15 relative z-10">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-black text-white text-sm sm:text-base">{route?.from || 'SBC'}</span>
                <span className="text-slate-300 text-xs ml-1 block sm:inline">({route?.from_name || 'Origin'})</span>
              </div>
            </div>

            {/* Track Line with moving train */}
            <div className="flex-1 mx-3 sm:mx-6 relative flex items-center justify-center">
              <div className="w-full h-1 bg-white/20 rounded-full relative">
                <div className="absolute left-0 top-0 bottom-0 bg-amber-400 rounded-full w-2/3" />
                <div className="absolute left-2/3 -top-2.5 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md animate-pulse">
                  <Train className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            <div className="text-right">
              <div>
                <span className="font-black text-white text-sm sm:text-base">{route?.to || 'MAS'}</span>
                <span className="text-slate-300 text-xs ml-1 block sm:inline">({route?.to_name || 'Destination'})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Status Information Body */}
      <div className="p-5 sm:p-6 space-y-5 bg-gradient-to-b from-slate-50/50 to-white">
        {/* Status Pill & Live Indicator */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${statusBadge.color}`}>
              <statusBadge.icon className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
              <span>{statusBadge.title}</span>
            </span>

            {data_source && (
              <span className="text-[11px] font-semibold text-slate-500 ml-auto flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${data_source === 'live' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <span>{data_source === 'live' ? 'Live IRCTC API' : data_source === 'cached' ? 'Cached' : 'Verified Mock'}</span>
              </span>
            )}
          </div>

          {/* Plain Language Status Sentence */}
          <h3 className="text-xl sm:text-2xl font-black leading-snug tracking-tight text-slate-900">
            {renderRich(t(statusBadge.bodyKey, statusBadge.bodyVars), onOpenTerm)}
          </h3>
        </div>

        {/* Visual Coach & Berth Map (for CNF and RAC) */}
        {type === 'CNF' && ticket?.coach && ticket?.berth && (
          <div className="rounded-2xl border-2 border-emerald-600 bg-emerald-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center text-lg shadow-xs">
                  {ticket.coach}
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                    {t('ui.coach_berth') || 'Coach & Berth'}
                  </p>
                  <p className="text-lg font-black text-emerald-950">
                    Berth {ticket.berth} · {berthTypeStr}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-200/80 px-2.5 py-1 rounded-lg">
                {t('ui.confirmed') || 'Confirmed'}
              </span>
            </div>

            {/* Visual Mini Coach Layout */}
            <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Coach {ticket.coach} Layout:</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-500">LB</span>
                <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-500">MB</span>
                <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-500">UB</span>
                <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-black border border-emerald-700 shadow-xs animate-pulse">
                  Seat #{ticket.berth}
                </span>
                <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-500">SL</span>
              </div>
            </div>
          </div>
        )}

        {/* RAC Berth Details */}
        {type === 'RAC' && (
          <div className="rounded-2xl border-2 border-slate-800 bg-slate-50 p-4 flex items-center justify-between shadow-2xs">
            <div>
              <p className="text-xs font-black uppercase text-slate-500 tracking-wider">
                {t('ui.seat_allocation') || 'Seat Allocation'}
              </p>
              <p className="text-base font-black text-slate-900">
                {ticket.berth || ticket.raw || 'Sitting Seat Reserved'}
              </p>
            </div>
            <span className="text-xs font-black text-slate-900 bg-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Can Upgrade to CNF
            </span>
          </div>
        )}

        {/* Charting Decide-By Time Box */}
        {decideText && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 flex items-start gap-3 shadow-2xs">
            <AlarmClock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 stroke-[2.2]" />
            <div className="space-y-0.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                Reservation Charting Schedule
              </span>
              <p className="text-sm font-semibold leading-relaxed text-slate-900">
                {renderRich(decideText, onOpenTerm)}
              </p>
            </div>
          </div>
        )}

        {/* Delay notice if train delayed */}
        {delay_minutes > 0 && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-red-700 shrink-0 stroke-[2.2]" />
            <div className="text-sm font-black text-red-900">
              {t('alert.delay', { min: delay_minutes, time: formattedTime || '' })}
            </div>
          </div>
        )}

        {/* Departure Time & Date Footer */}
        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Scheduled: {formattedDate} at {formattedTime}</span>
          </div>

          {ticket?.raw && (
            <button
              type="button"
              onClick={() => setShowRaw((v) => !v)}
              className="text-xs font-extrabold text-[#0A1E3F] hover:underline flex items-center gap-1 cursor-pointer"
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
