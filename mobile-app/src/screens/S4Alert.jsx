import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';
import { useT } from '../i18n/useT';
import { useSpeech } from '../hooks/useSpeech';

/**
 * S4Alert — Full-screen urgent change alert.
 * Accessible, safe flashing (<= 2 flashes/s), vibration, and voice narration.
 */
export function S4Alert({
  event,
  onDismiss,
  onOpenBackup,
  onNavigateBackup,
  settings = { vibration: true }
}) {
  const { t } = useT();
  const { speak, speaking, cancel } = useSpeech();
  const headingRef = useRef(null);

  const handleBackup = onOpenBackup || onNavigateBackup;

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }

    if (settings?.vibration && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([300, 150, 300, 150, 600]);
      } catch (err) {
        // Vibration not supported or blocked
      }
    }
  }, [event, settings]);

  if (!event) return null;

  const type = event.type || 'platform_changed';
  const data = event.data || {};

  const isPlatformChange = type === 'platform_changed';
  const isDelayed = type === 'delayed';
  const isCancelled = type === 'cancelled';
  const isConfirmed = type === 'confirmed';

  let alertTitle = 'RAILWAY ALERT';
  let speechText = '';

  if (isPlatformChange) {
    alertTitle = 'PLATFORM CHANGED';
    speechText = t('alert.platform', { to: data.to || '' });
  } else if (isDelayed) {
    alertTitle = 'TRAIN DELAYED';
    const formattedTime = data.new_departure
      ? new Date(data.new_departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
    speechText = t('alert.delay', { min: data.minutes || '45', time: formattedTime });
  } else if (isCancelled) {
    alertTitle = 'TRAIN CANCELLED';
    speechText = t('alert.cancelled');
  } else if (isConfirmed) {
    alertTitle = 'TICKET CONFIRMED';
    speechText = t('alert.confirmed', { coach: data.coach || '', berth: data.berth || '' });
  }

  // Strip rich formatting tags for clean voice and text display
  const cleanedSpeechText = speechText.replace(/\[\[.*?:(.*?)\]\]/g, '$1');

  const bgColor = isConfirmed
    ? 'bg-[#14532D]'
    : isCancelled
    ? 'bg-[#7F1D1D]'
    : 'bg-[#7C2D12]';

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
      aria-labelledby="alert-heading"
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto ${bgColor} text-white animate-safe-flash`}
    >
      {/* Top Banner Bar */}
      <header className="flex items-center justify-between pb-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          {isConfirmed ? (
            <CheckCircle className="w-8 h-8 text-emerald-300 stroke-[2.5]" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-amber-300 stroke-[2.5]" />
          )}
          <span className="text-xl sm:text-2xl font-black tracking-wider uppercase">
            DISHA LIVE ALERT
          </span>
        </div>

        <button
          type="button"
          onClick={() => (speaking ? cancel() : speak(cleanedSpeechText))}
          className="min-h-[48px] px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm flex items-center gap-2 backdrop-blur-sm border border-white/40 active:scale-95 transition"
        >
          {speaking ? <VolumeX className="w-5 h-5 text-red-200" /> : <Volume2 className="w-5 h-5" />}
          <span>{speaking ? t('ui.stop') : t('ui.listen')}</span>
        </button>
      </header>

      {/* Main Alert Body */}
      <main className="my-auto py-8 text-center space-y-6 max-w-lg mx-auto w-full">
        <h1
          id="alert-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl sm:text-4xl font-black uppercase tracking-wide focus:outline-none drop-shadow"
        >
          {alertTitle}
        </h1>

        {/* Variant 1: Platform Changed */}
        {isPlatformChange && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 sm:gap-6 font-mono font-black">
              {data.from && (
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase tracking-widest text-white/70">Previous</span>
                  <span className="text-4xl sm:text-5xl line-through text-white/60">
                    Plat {data.from}
                  </span>
                </div>
              )}
              <span className="text-3xl sm:text-4xl text-amber-300" aria-hidden="true">➔</span>
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">New Platform</span>
                <span
                  className="text-6xl sm:text-8xl leading-none font-black bg-white text-slate-900 px-6 py-3 rounded-2xl shadow-2xl border-4 border-amber-400"
                  aria-label={`New platform ${data.to}`}
                >
                  {data.to || '6'}
                </span>
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold leading-relaxed px-2">
              {cleanedSpeechText}
            </p>
          </div>
        )}

        {/* Variant 2: Train Delayed */}
        {isDelayed && (
          <div className="space-y-6">
            <div className="inline-block bg-white text-slate-900 px-8 py-4 rounded-3xl shadow-2xl border-4 border-amber-400 font-black">
              <span className="text-5xl sm:text-7xl">+{data.minutes || 45}</span>
              <span className="text-2xl sm:text-3xl ml-2">min late</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold leading-relaxed px-2">
              {cleanedSpeechText}
            </p>
          </div>
        )}

        {/* Variant 3: Train Cancelled */}
        {isCancelled && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-600/60 border-4 border-white flex items-center justify-center text-5xl font-black">
              ✕
            </div>
            <p className="text-xl sm:text-2xl font-bold leading-relaxed px-2">
              {cleanedSpeechText}
            </p>
            {handleBackup && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    cancel();
                    onDismiss();
                    handleBackup();
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg min-h-[56px] shadow-xl hover:bg-amber-300 active:scale-95 transition flex items-center justify-center gap-2 border-2 border-white"
                >
                  <Navigation className="w-5 h-5" />
                  <span>{t('ui.see_other_ways') || 'See other ways to travel'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Variant 4: Ticket Confirmed */}
        {isConfirmed && (
          <div className="space-y-6">
            <div className="inline-block bg-white text-emerald-950 px-8 py-5 rounded-3xl shadow-2xl border-4 border-emerald-400">
              <span className="block text-sm font-black uppercase tracking-wider text-emerald-800">
                Assigned Berth
              </span>
              <span className="text-4xl sm:text-6xl font-black">
                Coach {data.coach || 'B2'}, Berth {data.berth || '32'}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold leading-relaxed px-2">
              {cleanedSpeechText}
            </p>
          </div>
        )}
      </main>

      {/* Dismiss Button (min 64px for accessibility) */}
      <footer className="pt-4 max-w-lg mx-auto w-full">
        <button
          type="button"
          onClick={() => {
            cancel();
            onDismiss();
          }}
          className="w-full py-5 px-6 rounded-2xl bg-white text-slate-950 font-black text-xl sm:text-2xl min-h-[64px] shadow-2xl hover:bg-slate-100 active:scale-[0.98] transition flex items-center justify-center gap-3 border-4 border-slate-950"
        >
          <CheckCircle className="w-7 h-7 text-emerald-600" />
          <span>{t('ui.got_it') || 'Got it'}</span>
        </button>
      </footer>
    </div>
  );
}

export default S4Alert;
