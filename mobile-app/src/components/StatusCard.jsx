import React, { useState } from 'react';
import { AlarmClock, TrainFront } from 'lucide-react';
import { useT } from '../i18n/useT';
import { renderRich } from './Term';

export default function StatusCard({ journey, onOpenTerm }) {
  const { t, lang } = useT();
  const [showRaw, setShowRaw] = useState(false);

  if (!journey) return null;
  const { train, route, departure_iso, ticket, platform, delay_minutes, train_state, chart } = journey;

  const isCancelled = train_state === 'cancelled';
  const type = ticket?.type || 'WL';

  let cardBg = 'train-speed-bg';
  let headline = 'NOT CONFIRMED YET';
  let bodyKey = 'status.wl';
  let bodyVars = { pos: ticket?.wl_position ?? '' };

  if (isCancelled) {
    cardBg = 'bg-[#FF4D4D] text-white';
    headline = 'TRAIN CANCELLED';
    bodyKey = 'alert.cancelled';
  } else if (type === 'CNF') {
    cardBg = 'bg-[#FFD600]';
    headline = 'TICKET CONFIRMED';
    bodyKey = 'status.cnf';
    bodyVars = { coach: ticket?.coach || '-', berth: ticket?.berth || '-' };
  } else if (type === 'RAC') {
    cardBg = 'train-speed-bg';
    headline = 'SEAT TO SIT (RAC)';
    bodyKey = 'status.rac';
  }

  const formattedDeparture = departure_iso
    ? new Intl.DateTimeFormat(lang, {
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
    <section
      className={`card-surface relative overflow-hidden rounded-[28px] p-6 space-y-4 text-[#0A0A0A] ${cardBg}`}
    >
      {/* Top Hero Train Illustration */}
      <div className="flex justify-end -mt-2 -mr-2 pointer-events-none select-none">
        <svg width="165" height="62" viewBox="0 0 180 68" fill="none" aria-hidden="true">
          <path d="M10 62L175 40" stroke="white" strokeWidth="2.5" strokeOpacity="0.7" />
          <path d="M35 66L178 48" stroke="white" strokeWidth="2" strokeOpacity="0.55" />
          {/* Sleek bullet train */}
          <path
            d="M42 42C42 30 58 20 82 18L152 12C162 11 168 17 168 25V36C168 41 164 44 158 44H46C43 44 42 43 42 42Z"
            fill="#F8FAFC"
            stroke="#0A0A0A"
            strokeWidth="2"
          />
          <path d="M46 35H166V40H44L46 35Z" fill="#FFD600" />
          <path d="M54 27C62 22 74 20 86 19L82 29H50L54 27Z" fill="#1E293B" />
          <rect x="94" y="21" width="16" height="7" rx="2" fill="#1E293B" />
          <rect x="115" y="19" width="16" height="7" rx="2" fill="#1E293B" />
          <rect x="136" y="17" width="16" height="7" rx="2" fill="#1E293B" />
        </svg>
      </div>

      {/* Uppercase Small Status Label */}
      <div className="-mt-6">
        <p className="text-[0.82rem] font-extrabold uppercase tracking-[0.06em] text-[#0A0A0A]/85">
          {headline}
        </p>

        {/* Bold Display Headline */}
        <h2 className="mt-1.5 text-[1.42rem] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#0A0A0A]">
          {renderRich(t(bodyKey, bodyVars), onOpenTerm)}
        </h2>
      </div>

      {/* White Inner Pill Box for Decide-By Info */}
      {decideText && (
        <div className="bg-white rounded-[18px] px-4 py-3.5 flex items-start gap-3 shadow-xs">
          <AlarmClock className="w-5 h-5 shrink-0 mt-0.5 text-[#DC2626] stroke-[2.2]" aria-hidden="true" />
          <p className="text-[0.88rem] font-semibold leading-[1.4] text-[#0A0A0A]">
            {renderRich(decideText, onOpenTerm)}
          </p>
        </div>
      )}

      {delay_minutes > 0 && (
        <div className="bg-white rounded-[18px] px-4 py-3 font-extrabold text-[0.9rem] text-[#DC2626]">
          {t('alert.delay', { min: delay_minutes, time: formattedDeparture || '' })}
        </div>
      )}

      {/* Compact Train Metadata Footer inside Yellow Card */}
      <div className="pt-1 flex items-start gap-2 text-[0.86rem] font-bold text-[#0A0A0A]/90">
        <TrainFront className="w-4 h-4 shrink-0 mt-0.5 stroke-[2.2]" aria-hidden="true" />
        <div>
          <span>
            Train {train?.number} ({train?.name})
            {platform?.current ? ` · Platform ${platform.current}` : ''}
            {route?.from && route?.to ? ` · ${route.from} → ${route.to}` : ''}
          </span>
          {ticket?.raw && (
            <button
              type="button"
              onClick={() => setShowRaw((v) => !v)}
              className="ml-2 underline text-xs font-extrabold opacity-75 hover:opacity-100"
            >
              {showRaw ? ticket.raw : `(${ticket.raw})`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
