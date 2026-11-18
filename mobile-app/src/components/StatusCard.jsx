import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { useT } from '../i18n/useT';
import { renderRich } from './Term';

export default function StatusCard({ journey, onOpenTerm }) {
  const { t, lang } = useT();
  const [showRaw, setShowRaw] = useState(false);

  if (!journey) return null;
  const { train, route, departure_iso, ticket, platform, delay_minutes, train_state, chart } = journey;

  const isCancelled = train_state === 'cancelled';
  const type = ticket?.type || 'WL';

  let badgeStyle = 'bg-amber-100 text-amber-950 border-amber-500';
  let Icon = Clock;
  let headline = 'NOT CONFIRMED YET';
  let bodyKey = 'status.wl';
  let bodyVars = { pos: ticket?.wl_position ?? '' };

  if (isCancelled) {
    badgeStyle = 'bg-red-100 text-red-950 border-red-600';
    Icon = XCircle;
    headline = 'TRAIN CANCELLED';
    bodyKey = 'alert.cancelled';
  } else if (type === 'CNF') {
    badgeStyle = 'bg-green-100 text-green-950 border-green-600';
    Icon = CheckCircle2;
    headline = 'CONFIRMED';
    bodyKey = 'status.cnf';
    bodyVars = { coach: ticket?.coach || '-', berth: ticket?.berth || '-' };
  } else if (type === 'RAC') {
    badgeStyle = 'bg-amber-100 text-amber-950 border-amber-500';
    Icon = AlertTriangle;
    headline = 'SEAT TO SIT (RAC)';
    bodyKey = 'status.rac';
  }

  const formattedDeparture = departure_iso
    ? new Intl.DateTimeFormat(lang, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(departure_iso))
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

  return (
    <section className="card-surface bg-white rounded-2xl border-2 border-[#1A1A2E] p-5 space-y-4 shadow-sm">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-extrabold ${badgeStyle}`}>
        <Icon className="w-6 h-6 shrink-0" aria-hidden="true" />
        <span>{headline}</span>
      </div>

      <p className="text-[1.2rem] leading-relaxed font-medium">
        {renderRich(t(bodyKey, bodyVars), onOpenTerm)}
      </p>

      {decideText && (
        <div className="bg-blue-50 border-l-4 border-[#1A1A2E] p-3 rounded-r-lg font-semibold">
          {renderRich(decideText, onOpenTerm)}
        </div>
      )}

      {delay_minutes > 0 && (
        <p className="font-bold text-red-700">
          {t('alert.delay', { min: delay_minutes, time: formattedDeparture || '' })}
        </p>
      )}

      <div className="pt-3 border-t border-slate-200 space-y-1 text-base">
        {train && (
          <p className="font-bold">
            {train.number} · {train.name} {train.class ? `(${train.class})` : ''}
          </p>
        )}
        {route?.from_name && route?.to_name && (
          <p className="text-slate-700">
            {route.from_name} → {route.to_name}
          </p>
        )}
        {formattedDeparture && <p className="text-slate-700">{formattedDeparture}</p>}
        {platform?.current && (
          <p className="font-bold text-lg">
            {renderRich(`[[platform:Platform]] ${platform.current}`, onOpenTerm)}
          </p>
        )}
      </div>

      {ticket?.raw && (
        <div>
          <button
            type="button"
            onClick={() => setShowRaw((v) => !v)}
            className="text-sm underline text-slate-600 min-h-[48px] inline-flex items-center"
          >
            {t('ui.show_technical')}
          </button>
          {showRaw && (
            <p className="mt-1 font-mono text-sm bg-slate-100 p-2 rounded border border-slate-300">
              {ticket.raw}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
