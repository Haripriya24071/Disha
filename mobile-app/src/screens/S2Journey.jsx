import React, { useState } from 'react';
import {
  Search,
  HelpCircle,
  RefreshCw,
  Train,
  BookOpen,
  Share2,
  Bell,
  Settings,
  PhoneCall,
} from 'lucide-react';
import { useT } from '../i18n/useT';
import { stripRich } from '../components/Term';
import Header from '../components/Header';
import BigButton from '../components/BigButton';
import StatusCard from '../components/StatusCard';
import ListenButton from '../components/ListenButton';
import Glossary from '../sheets/Glossary';
import Accessibility from '../sheets/Accessibility';
import ShareSheet from '../sheets/Share';
import AlertsSheet from '../sheets/Alerts';

function minutesAgo(iso) {
  if (!iso) return 'just now';
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return mins === 0 ? 'just now' : `${mins} min ago`;
}

export default function S2Journey({
  journeyState,
  onOpenBackup,
}) {
  const { t } = useT();
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
    <div className="min-h-screen flex flex-col">
      <Header onBack={status === 'ok' ? reset : undefined} />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-6 space-y-5">
        {status !== 'ok' ? (
          <div className="space-y-5">
            <h1 className="text-[1.6rem] font-extrabold">{t('ui.enter_pnr')}</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                placeholder="1111111111"
                aria-label={t('ui.enter_pnr')}
                className="w-full min-h-[60px] px-4 rounded-xl border-2 border-[#1A1A2E] bg-white text-[1.4rem] font-bold tracking-widest"
              />

              {errorCode && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-100 border-2 border-red-600 text-red-950 font-bold"
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
              className="min-h-[48px] inline-flex items-center gap-2 font-bold underline text-blue-900"
            >
              <HelpCircle className="w-5 h-5" />
              <span>{t('ui.what_is_pnr')}</span>
            </button>

            <a
              href="tel:139"
              className="w-full min-h-[56px] px-5 py-3 rounded-xl font-bold border-2 border-[#1A1A2E] bg-white flex items-center justify-center gap-3"
            >
              <PhoneCall className="w-6 h-6" />
              <span>{t('ui.call_139')}</span>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {(journey?.data_source === 'cached' || errorCode) && (
              <div className="p-3 rounded-xl bg-amber-100 border-2 border-amber-500 font-bold text-amber-950">
                {t(errorCode === 'offline' ? 'error.offline' : 'error.nodata')}
              </div>
            )}

            <StatusCard journey={journey} onOpenTerm={openTerm} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ListenButton text={buildSpokenSummary()} variant="primary" />
              <BigButton
                icon={RefreshCw}
                variant="secondary"
                onClick={() => fetchJourney(journey.pnr)}
              >
                {t('ui.refresh')}
              </BigButton>
            </div>

            <BigButton icon={Train} variant="secondary" onClick={onOpenBackup}>
              {t('ui.backup_plan')}
            </BigButton>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <BigButton
                icon={BookOpen}
                variant="secondary"
                onClick={() => {
                  setTermId(null);
                  setActiveSheet('glossary');
                }}
              >
                {t('ui.glossary')}
              </BigButton>

              <BigButton
                icon={Share2}
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

              <BigButton
                icon={Settings}
                variant="secondary"
                onClick={() => setActiveSheet('a11y')}
              >
                {t('ui.settings')}
              </BigButton>

              <a
                href="tel:139"
                className="w-full min-h-[56px] px-5 py-3 rounded-xl font-bold border-2 border-[#1A1A2E] bg-white flex items-center justify-center gap-3"
              >
                <PhoneCall className="w-6 h-6" />
                <span>{t('ui.call_139')}</span>
              </a>
            </div>

            <p className="text-sm text-slate-700 text-center pt-2">
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
      />
    </div>
  );
}
