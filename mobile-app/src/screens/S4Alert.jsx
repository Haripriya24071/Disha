import React, { useEffect, useRef } from 'react';

/**
 * S4Alert — Haripriya
 * Full-screen urgent change alert shown immediately upon receiving a ChangeEvent.
 * 
 * Accessibility & Safety rules:
 * - Flashing rate strictly ≤ 2 flashes per second (photosensitive seizure safety)
 * - Respects prefers-reduced-motion (disables flashing, keeps bold high-contrast border)
 * - Focus automatically set to alertdialog heading
 * - Vibration pattern [300, 150, 300, 150, 600] where supported
 * - Big "Got it" button ≥ 64px
 */
export function S4Alert({ event, onDismiss, onNavigateBackup, t, ListenButtonComponent, settings = { vibration: true } }) {
  const headingRef = useRef(null);

  // Trigger vibration and set focus upon appearance
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }

    // Check user vibration setting & browser support
    if (settings?.vibration && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([300, 150, 300, 150, 600]);
      } catch (err) {
        console.warn('Vibration failed:', err);
      }
    }
  }, [event, settings]);

  if (!event) return null;

  const type = event.type || 'platform_changed';
  const data = event.data || {};

  // Color schemes and content variants
  const isPlatformChange = type === 'platform_changed';
  const isDelayed = type === 'delayed';
  const isCancelled = type === 'cancelled';
  const isConfirmed = type === 'confirmed';

  let alertTitle = 'ALERT';
  let speechText = '';

  if (isPlatformChange) {
    alertTitle = 'PLATFORM CHANGED';
    speechText = t('alert.platform', { to: data.to || '' });
  } else if (isDelayed) {
    alertTitle = 'TRAIN DELAYED';
    speechText = t('alert.delay', { min: data.minutes || '45', time: data.new_departure ? new Date(data.new_departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' });
  } else if (isCancelled) {
    alertTitle = 'TRAIN CANCELLED';
    speechText = t('alert.cancelled');
  } else if (isConfirmed) {
    alertTitle = 'TICKET CONFIRMED';
    speechText = t('alert.confirmed', { coach: data.coach || '', berth: data.berth || '' });
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
      aria-labelledby="alert-heading"
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 overflow-y-auto bg-amber-500 text-black animate-safe-flash reduced-motion:animate-none reduced-motion:border-8 reduced-motion:border-black"
      style={{
        backgroundColor: isConfirmed ? '#2E7D32' : isCancelled ? '#C62828' : '#E65100',
        color: '#FFFFFF'
      }}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-2xl font-bold flex items-center gap-2">
          <span aria-hidden="true">{isConfirmed ? '✔' : '⚠'}</span>
          <span>DISHA ALERT</span>
        </span>
        {ListenButtonComponent && (
          <ListenButtonComponent text={speechText} label={t('ui.listen')} />
        )}
      </div>

      {/* Main Alert Content */}
      <main className="my-auto text-center space-y-6 py-6">
        <h1
          id="alert-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide focus:outline-none drop-shadow-md"
        >
          {alertTitle}
        </h1>

        {/* Variant 1: Platform Changed */}
        {isPlatformChange && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6 font-mono font-black">
              {data.from && (
                <span className="text-5xl line-through opacity-70 text-gray-200" aria-label={`Old platform ${data.from}`}>
                  {data.from}
                </span>
              )}
              <span className="text-4xl" aria-hidden="true">➔</span>
              <span
                className="text-[96px] sm:text-[120px] leading-none font-extrabold bg-white text-black px-6 py-2 rounded-2xl shadow-2xl inline-block"
                aria-label={`New platform ${data.to}`}
              >
                {data.to || '6'}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold max-w-md mx-auto leading-relaxed">
              {speechText}
            </p>
          </div>
        )}

        {/* Variant 2: Delayed */}
        {isDelayed && (
          <div className="space-y-4">
            <div className="text-[72px] sm:text-[96px] font-black leading-none tracking-tight">
              +{data.minutes || 45} min
            </div>
            <p className="text-2xl sm:text-3xl font-semibold max-w-md mx-auto leading-relaxed">
              {speechText}
            </p>
          </div>
        )}

        {/* Variant 3: Cancelled */}
        {isCancelled && (
          <div className="space-y-6">
            <div className="text-6xl" aria-hidden="true">✕</div>
            <p className="text-2xl sm:text-3xl font-semibold max-w-md mx-auto leading-relaxed">
              {speechText}
            </p>
            {onNavigateBackup && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onDismiss();
                    onNavigateBackup();
                  }}
                  className="w-full max-w-sm mx-auto py-4 px-6 rounded-2xl bg-white text-red-900 font-bold text-xl min-h-[56px] shadow-lg hover:bg-gray-100 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span aria-hidden="true">🧭</span>
                  <span>{t('ui.see_other_ways') || 'See other ways to travel'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Variant 4: Confirmed */}
        {isConfirmed && (
          <div className="space-y-4">
            <div className="text-7xl font-bold" aria-hidden="true">✔</div>
            <div className="text-3xl font-black">
              Coach {data.coach || 'B2'}, Berth {data.berth || '45'}
            </div>
            <p className="text-2xl sm:text-3xl font-semibold max-w-md mx-auto leading-relaxed">
              {speechText}
            </p>
          </div>
        )}
      </main>

      {/* Primary Dismiss Button (Min 64px tall for accessibility) */}
      <footer className="pt-4">
        <button
          type="button"
          onClick={onDismiss}
          className="w-full py-5 px-6 rounded-2xl bg-white text-black font-extrabold text-2xl min-h-[64px] shadow-2xl hover:bg-gray-100 active:scale-[0.99] transition flex items-center justify-center gap-3 border-4 border-black"
        >
          <span aria-hidden="true">✔</span>
          <span>{t('ui.got_it') || 'Got it'}</span>
        </button>
      </footer>
    </div>
  );
}

export default S4Alert;
