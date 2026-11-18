import React, { useState } from 'react';
import {
  Volume2,
  RefreshCw,
  Compass,
  Users,
  Bell,
  BookOpen,
  Settings,
  PhoneCall,
  HelpCircle,
  Search,
} from 'lucide-react';
import { useT } from '../i18n/useT';
import { useSpeech } from '../hooks/useSpeech';
import { stripRich } from '../components/Term';
import Header from '../components/Header';
import BigButton from '../components/BigButton';
import StatusCard from '../components/StatusCard';
import Glossary from '../sheets/Glossary';
import Accessibility from '../sheets/Accessibility';
import ShareSheet from '../sheets/Share';
import AlertsSheet from '../sheets/Alerts';

function minutesAgo(iso) {
  if (!iso) return '2 min ago';
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return mins === 0 ? 'just now' : `${mins} min ago`;
}

export default function S2Journey({ journeyState, onOpenBackup }) {
  const { t } = useT();
  const { speak, speaking, voiceUnavailable } = useSpeech();
  const { status, journey, errorCode, fetchJourney, reset } = journeyState;
  const [pnrInput, setPnrInput] = useState(() => localStorage.getItem('last_pnr') || '');
  const [activeSheet, setActiveSheet] = useState(null);
  const [termId, setTermId] = useState(null);

  const openTerm = (id) => {
    setTermId(id);
    setActiveSheet('glossary');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchJourney(pnrInput);
  };

  const buildSpokenSummary = () => {
    if (!journey) return '';
    const { ticket, platform, train_state, chart } = journey;
    let main = '';
    if (train_state === 'cancelled') main = t('alert.cancelled');
    else if (ticket?.type === 'CNF')
      main = t('status.cnf', { coach: ticket.coach || '', berth: ticket.berth || '' });
    else if (ticket?.type === 'RAC') main = t('status.rac');
    else main = t('status.wl', { pos: ticket?.wl_position || '' });

    const decide =
      train_state !== 'cancelled' && ticket?.type !== 'CNF'
        ? chart?.source === 'api'
          ? t('status.decide', { time: '' })
          : t('status.decide_est')
        : '';
    const plat = platform?.current ? `Platform ${platform.current}.` : '';
    return stripRich(`${main} ${decide} ${plat}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F3EF]">
      <Header onBack={status === 'ok' ? reset : undefined} />

      <main className="flex-1 max-w-md w-full mx-auto px-5 pt-2 pb-8 space-y-4">
        {status !== 'ok' ? (
          <div className="space-y-5 pt-2">
            <h1 className="text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.03em]">
              {t('ui.enter_pnr')}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-[24px] border-2 border-[#0A0A0A] bg-white px-5 py-3.5">
                <label className="block text-xs font-bold text-[#0A0A0A]/65">
                  10-Digit PNR Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="1111111111"
                  aria-label={t('ui.enter_pnr')}
                  className="w-full bg-transparent text-[1.4rem] font-extrabold tracking-widest text-[#0A0A0A] outline-none mt-1"
                />
              </div>

              {errorCode && (
                <div
                  role="alert"
                  className="p-4 rounded-[20px] bg-[#FF4D4D] text-white border-2 border-[#0A0A0A] font-bold"
                >
                  {t(`error.${errorCode}`)}
                </div>
              )}

              <BigButton type="submit" icon={Search} variant="primary" disabled={status === 'loading'}>
                {status === 'loading' ? '...' : t('ui.check_ticket')}
              </BigButton>
            </form>

            <button
              type="button"
              onClick={() => openTerm('pnr')}
              className="min-h-[48px] inline-flex items-center gap-2 font-bold underline text-[#0A0A0A]"
            >
              <HelpCircle className="w-5 h-5" />
              <span>{t('ui.what_is_pnr')}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {(journey?.data_source === 'cached' || errorCode) && (
              <div className="p-3 rounded-[18px] bg-white border-2 border-[#0A0A0A] font-bold text-sm">
                {t(errorCode === 'offline' ? 'error.offline' : 'error.nodata')}
              </div>
            )}

            {/* Yellow Hero Status Card */}
            <StatusCard journey={journey} onOpenTerm={openTerm} />

            {/* Side-by-side Listen & Refresh Pill Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <BigButton
                icon={Volume2}
                variant="secondary"
                onClick={() => speak(buildSpokenSummary())}
              >
                {speaking ? t('ui.stop') : t('ui.listen')}
              </BigButton>

              <BigButton
                icon={RefreshCw}
                variant="secondary"
                onClick={() => fetchJourney(journey.pnr)}
              >
                {t('ui.refresh')}
              </BigButton>
            </div>

            {voiceUnavailable && (
              <p className="text-xs font-bold bg-white border-2 border-[#0A0A0A] rounded-2xl p-3">
                {t('ui.voice_unavailable')}
              </p>
            )}

            {/* Solid Black Primary Pill Button */}
            <BigButton icon={Compass} variant="primary" onClick={onOpenBackup}>
              {t('ui.backup_plan')}
            </BigButton>

            {/* Stacked Outlined Pill Buttons */}
            <BigButton
              icon={Users}
              variant="secondary"
              onClick={() => setActiveSheet('share')}
            >
              {t('ui.share')}
            </BigButton>

            <BigButton
              icon={Bell}
              variant="secondary"
              onClick={() => setActiveSheet('alerts')}
            >
              {t('ui.alerts')}
            </BigButton>

            {/* Secondary Utilities (Glossary, Settings, Call 139) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setTermId(null);
                  setActiveSheet('glossary');
                }}
                className="min-h-[48px] px-4 rounded-full border border-[#0A0A0A]/40 font-bold text-sm flex items-center justify-center gap-2 hover:border-[#0A0A0A]"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('ui.glossary')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSheet('a11y')}
                className="min-h-[48px] px-4 rounded-full border border-[#0A0A0A]/40 font-bold text-sm flex items-center justify-center gap-2 hover:border-[#0A0A0A]"
              >
                <Settings className="w-4 h-4" />
                <span>{t('ui.settings')}</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <a
                href="tel:139"
                className="inline-flex items-center gap-1.5 text-sm font-extrabold underline text-[#0A0A0A] min-h-[44px]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t('ui.call_139')}</span>
              </a>
            </div>

            {/* Trust Footer */}
            <p className="text-[0.78rem] leading-snug text-[#0A0A0A]/70 text-center px-4">
              {t('trust.note', { ago: minutesAgo(journey?.last_updated_iso) })}
            </p>
          </div>
        )}
      </main>

      <Glossary
        open={activeSheet === 'glossary'}
        onClose={() => setActiveSheet(null)}
        initialTermId={termId}
      />
      <Accessibility
        open={activeSheet === 'a11y'}
        onClose={() => setActiveSheet(null)}
      />
      <ShareSheet
        open={activeSheet === 'share'}
        onClose={() => setActiveSheet(null)}
        journey={journey}
      />
      <AlertsSheet
        open={activeSheet === 'alerts'}
        onClose={() => setActiveSheet(null)}
        pnr={journey?.pnr}
        apiBaseUrl={import.meta.env.VITE_API_URL || ''}
      />
    </div>
  );
}
