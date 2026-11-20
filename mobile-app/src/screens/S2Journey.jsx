import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  RefreshCw,
  Compass,
  Users,
  Bell,
  BookOpen,
  Settings,
  PhoneCall,
  HelpCircle,
  Search,
  Radio,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Globe,
  Train,
  Check,
  X
} from 'lucide-react';
import { useT, LANGUAGES } from '../i18n/useT';
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

export default function S2Journey({ journeyState, onOpenBackup, sseConnected }) {
  const { t, lang, setLang } = useT();
  const { speak, speaking, cancel, voiceUnavailable } = useSpeech();
  const { status, journey, errorCode, fetchJourney, reset } = journeyState;
  const [pnrInput, setPnrInput] = useState(() => localStorage.getItem('last_pnr') || '');
  const [activeSheet, setActiveSheet] = useState(null);
  const [termId, setTermId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [triggeringEvent, setTriggeringEvent] = useState(null);
  const [showSimulator, setShowSimulator] = useState(false);

  const testScenarios = [
    { pnr: '1111111111', label: 'WL 8', desc: t('ui.scenarios_wl') || 'Waiting List', badge: 'bg-amber-100 text-amber-900 border-amber-300' },
    { pnr: '2222222222', label: 'RAC', desc: t('ui.scenarios_rac') || 'Sitting Seat', badge: 'bg-blue-100 text-blue-900 border-blue-300' },
    { pnr: '3333333333', label: 'CNF S4/32', desc: t('ui.scenarios_cnf') || 'Confirmed', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { pnr: '4444444444', label: 'Cancelled', desc: t('ui.scenarios_cancelled') || 'Cancelled Train', badge: 'bg-red-100 text-red-900 border-red-300' },
  ];

  const openTerm = (id) => {
    setTermId(id);
    setActiveSheet('glossary');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pnrInput.trim()) {
      fetchJourney(pnrInput);
    }
  };

  const handleQuickPnr = (pnr) => {
    setPnrInput(pnr);
    fetchJourney(pnr);
  };

  const handleRefresh = async () => {
    if (!journey?.pnr) return;
    setIsRefreshing(true);
    await fetchJourney(journey.pnr);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const triggerLiveDemoEvent = async (eventType) => {
    if (!journey?.pnr) return;
    setTriggeringEvent(eventType);
    try {
      await fetch('/api/demo/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr: journey.pnr, event: eventType }),
      });
    } catch (err) {
      console.warn('Demo trigger failed:', err);
    } finally {
      setTimeout(() => setTriggeringEvent(null), 500);
    }
  };

  const handleResetDemo = async () => {
    if (!journey?.pnr) return;
    try {
      await fetch('/api/demo/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr: journey.pnr }),
      });
      await fetchJourney(journey.pnr);
    } catch (err) {
      console.warn('Reset failed:', err);
    }
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

  const isTenDigits = pnrInput.replace(/\D/g, '').length === 10;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header
        onBack={status === 'ok' ? reset : undefined}
        rightElement={
          status === 'ok' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <span className={`w-2 h-2 rounded-full ${sseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="hidden sm:inline">{sseConnected ? (t('ui.live_connected') || 'Live') : 'Polling'}</span>
            </div>
          )
        }
      />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 pt-3 pb-10 space-y-5">
        {/* Visible On-Screen Language Bar (All 8 Languages) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-black uppercase text-slate-500 shrink-0 flex items-center gap-1 mr-1">
            <Globe className="w-3.5 h-3.5 text-[#0A1E3F]" />
            <span>{t('ui.languages_label') || 'Languages'}:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {LANGUAGES.map((l) => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer shrink-0 border ${
                    active
                      ? 'bg-[#0A1E3F] text-amber-400 border-[#0A1E3F] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {l.native}
                </button>
              );
            })}
          </div>
        </div>

        {status !== 'ok' ? (
          /* STATE A: PNR Input Screen */
          <div className="space-y-6 pt-1">
            {/* Indian Railways Heading */}
            <div>
              <span className="inline-block bg-amber-400 text-slate-950 px-3 py-1 font-black text-xs uppercase tracking-wider rounded-md mb-2 shadow-2xs">
                {t('ui.badge_pnr_status') || 'Indian Railways PNR Status'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[#0A1E3F]">
                {t('ui.enter_pnr')}
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                {t('ui.pnr_subtitle') || 'Enter your 10-digit ticket number to get plain-language updates in your own language.'}
              </p>
            </div>

            {/* Quick Test PNR Selector Chips */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('ui.quick_scenarios') || 'Quick Test Scenarios'}</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {testScenarios.map((item) => (
                  <button
                    key={item.pnr}
                    type="button"
                    onClick={() => handleQuickPnr(item.pnr)}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 text-left transition shadow-2xs group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-slate-900 group-hover:text-amber-900">
                        {item.label}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${item.pnr === '3333333333' ? 'bg-emerald-500' : item.pnr === '4444444444' ? 'bg-red-500' : 'bg-amber-400'}`} />
                    </div>
                    <span className="block text-[11px] font-semibold text-slate-500 truncate mt-1">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Classic Indian Railways Boarding Pass Ticket Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-3xl border-2 border-[#0A1E3F] bg-white shadow-md overflow-hidden">
                {/* Golden Railway Ticket Top Bar */}
                <div className="bg-[#0A1E3F] px-5 py-3 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      {t('ui.pnr_label') || '10-Digit PNR Number'}
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isTenDigits ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isTenDigits && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{pnrInput.length} / 10 Digits</span>
                  </span>
                </div>

                {/* Input Field */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 4801952313"
                    aria-label={t('ui.enter_pnr')}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-black tracking-widest text-[#0A1E3F] outline-none font-mono placeholder:text-slate-300"
                  />
                  {pnrInput && (
                    <button
                      type="button"
                      onClick={() => setPnrInput('')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{t('ui.clear') || 'Clear'}</span>
                    </button>
                  )}
                </div>
              </div>

              {errorCode && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-red-50 text-red-900 border-2 border-red-300 font-bold text-sm flex items-start gap-3 shadow-xs animate-shake"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black block">{t('ui.error_label') || 'Error'}</span>
                    <span>{t(`error.${errorCode}`) || 'Ticket not found or network down.'}</span>
                  </div>
                </div>
              )}

              <BigButton
                type="submit"
                icon={Search}
                variant="primary"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Checking with Indian Railways...' : t('ui.check_ticket')}
              </BigButton>
            </form>

            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => openTerm('pnr')}
                className="inline-flex items-center gap-2 font-black text-sm text-[#0A1E3F] hover:underline cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>{t('ui.what_is_pnr')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSheet('glossary')}
                className="inline-flex items-center gap-1.5 font-bold text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('ui.glossary')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* STATE B: Journey Loaded */
          <div className="space-y-4">
            {/* Quick Test Switcher Bar (in Journey View) */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-black uppercase text-slate-500 shrink-0">Switch:</span>
              <div className="flex items-center gap-1.5">
                {testScenarios.map((item) => {
                  const active = journey?.pnr === item.pnr;
                  return (
                    <button
                      key={item.pnr}
                      type="button"
                      onClick={() => handleQuickPnr(item.pnr)}
                      className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer shrink-0 ${
                        active
                          ? 'bg-[#0A1E3F] text-amber-400 shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Offline or Cached Banner */}
            {(journey?.data_source === 'cached' || errorCode) && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 font-bold text-xs text-amber-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t(errorCode === 'offline' ? 'error.offline' : 'error.nodata')}</span>
              </div>
            )}

            {/* Classic Hero Status Card */}
            <StatusCard journey={journey} onOpenTerm={openTerm} />

            {/* Side-by-side Listen & Refresh Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <BigButton
                icon={speaking ? VolumeX : Volume2}
                variant={speaking ? 'accent' : 'secondary'}
                onClick={() => (speaking ? cancel() : speak(buildSpokenSummary()))}
              >
                {speaking ? t('ui.stop') : t('ui.listen')}
              </BigButton>

              <BigButton
                icon={RefreshCw}
                variant="secondary"
                onClick={handleRefresh}
                className={isRefreshing ? 'animate-pulse' : ''}
              >
                {isRefreshing ? 'Updating...' : t('ui.refresh')}
              </BigButton>
            </div>

            {voiceUnavailable && (
              <p className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-xl p-3">
                {t('ui.voice_unavailable')}
              </p>
            )}

            {/* Primary Action Button: Backup Plan */}
            <BigButton icon={Compass} variant="primary" onClick={onOpenBackup}>
              {t('ui.backup_plan')}
            </BigButton>

            {/* Secondary Utility Row (Family Share & Alerts) */}
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Tertiary Utility Buttons (Glossary, Settings, Call 139) */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setTermId(null);
                  setActiveSheet('glossary');
                }}
                className="min-h-[48px] px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-600 shrink-0" />
                <span>{t('ui.glossary')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSheet('a11y')}
                className="min-h-[48px] px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-600 shrink-0" />
                <span>{t('ui.settings')}</span>
              </button>

              <a
                href="tel:139"
                className="min-h-[48px] px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 font-bold text-xs sm:text-sm text-red-800 flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer text-center"
              >
                <PhoneCall className="w-4 h-4 text-red-700 shrink-0" />
                <span>139 Help</span>
              </a>
            </div>

            {/* Interactive Live SSE Change Event Simulation Hub */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setShowSimulator((v) => !v)}
                className="w-full py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 font-black text-xs flex items-center justify-between transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Test Real-Time Live SSE Events (S4 Trigger)</span>
                </span>
                <span className="text-[11px] underline">
                  {showSimulator ? 'Hide Simulator' : 'Show Simulator'}
                </span>
              </button>

              {showSimulator && (
                <div className="mt-2 p-3.5 rounded-2xl bg-white border-2 border-amber-300 space-y-2.5 shadow-sm">
                  <p className="text-xs font-semibold text-slate-600">
                    Click any scenario to push a live Server-Sent Event (SSE) to this screen and test S4 Change Alert:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('platform_changed')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-100 text-xs font-black text-slate-900 text-left transition cursor-pointer"
                    >
                      📢 Platform 3 ➔ 6
                    </button>
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('delayed')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-100 text-xs font-black text-slate-900 text-left transition cursor-pointer"
                    >
                      ⏱ +45m Train Delay
                    </button>
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('cancelled')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-100 text-xs font-black text-slate-900 text-left transition cursor-pointer"
                    >
                      ⚠️ Train Cancelled
                    </button>
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('confirmed')}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-100 text-xs font-black text-slate-900 text-left transition cursor-pointer"
                    >
                      🎉 Ticket Confirmed
                    </button>
                  </div>
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={handleResetDemo}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 underline cursor-pointer"
                    >
                      Reset Journey to Initial State
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Official Indian Railways Trust Footer */}
            <div className="pt-3 text-center space-y-1">
              <p className="text-xs font-semibold text-slate-500 leading-snug">
                {t('trust.note', { ago: minutesAgo(journey?.last_updated_iso) })}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Slide-Up Sheets */}
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
