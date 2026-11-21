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
  X,
  ClipboardPaste,
  ShieldCheck,
  ArrowRight
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
    {
      pnr: '1111111111',
      label: 'WL 8',
      desc: t('ui.scenarios_wl') || 'Waiting List',
      accent: 'border-amber-400 bg-amber-500/10 text-amber-950',
      badge: 'bg-amber-500 text-slate-950',
      tag: 'Waitlist #8'
    },
    {
      pnr: '2222222222',
      label: 'RAC 14',
      desc: t('ui.scenarios_rac') || 'Sitting Seat',
      accent: 'border-blue-400 bg-blue-500/10 text-blue-950',
      badge: 'bg-[#0A1E3F] text-amber-300',
      tag: 'RAC (Confirmed Seat)'
    },
    {
      pnr: '3333333333',
      label: 'CNF B2/32',
      desc: t('ui.scenarios_cnf') || 'Confirmed',
      accent: 'border-emerald-500 bg-emerald-500/10 text-emerald-950',
      badge: 'bg-emerald-700 text-white',
      tag: 'Coach B2 · Berth 32'
    },
    {
      pnr: '4444444444',
      label: 'Cancelled',
      desc: t('ui.scenarios_cancelled') || 'Cancelled Train',
      accent: 'border-red-500 bg-red-500/10 text-red-950',
      badge: 'bg-red-700 text-white',
      tag: 'Emergency Alert'
    },
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/\D/g, '').slice(0, 10);
      if (cleaned) {
        setPnrInput(cleaned);
        if (cleaned.length === 10) {
          fetchJourney(cleaned);
        }
      }
    } catch {
      // Clipboard denied
    }
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

  const cleanDigits = pnrInput.replace(/\D/g, '');
  const isTenDigits = cleanDigits.length === 10;

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA] text-slate-900">
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

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 pt-3 pb-12 space-y-5">
        {/* Visible On-Screen Language Bar (All 8 Languages in native script, 100% visible on-screen) */}
        <div className="rounded-2xl bg-white border-2 border-slate-200/90 p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#0A1E3F]" />
              <span>{t('ui.languages_label') || 'Select Language'}</span>
            </span>
            <span className="text-[11px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              8 Languages
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {LANGUAGES.map((l) => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`py-2 px-1 rounded-xl text-xs font-black text-center transition-all cursor-pointer border-2 ${
                    active
                      ? 'bg-[#0A1E3F] text-amber-400 border-[#0A1E3F] shadow-md scale-[1.03] ring-2 ring-amber-400/40'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-amber-50/60 hover:border-amber-300'
                  }`}
                >
                  <span className="block truncate text-xs font-black">{l.native}</span>
                  <span className={`block text-[9px] font-bold uppercase tracking-wider mt-0.5 ${active ? 'text-amber-300' : 'text-slate-400'}`}>
                    {l.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {status !== 'ok' ? (
          /* STATE A: PNR Input Screen */
          <div className="space-y-6 pt-1">
            {/* Indian Railways Hero Header */}
            <div className="rounded-3xl bg-gradient-to-r from-[#07162C] via-[#0A1E3F] to-[#123363] text-white p-6 shadow-md border-2 border-slate-900 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-4">
                <Train className="w-40 h-40 text-white" />
              </div>

              <div className="relative z-10 space-y-2">
                <span className="inline-block bg-amber-400 text-slate-950 px-3 py-1 font-black text-xs uppercase tracking-wider rounded-lg shadow-2xs">
                  {t('ui.badge_pnr_status') || 'Indian Railways PNR Status'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white drop-shadow-xs">
                  {t('ui.enter_pnr')}
                </h1>
                <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                  {t('ui.pnr_subtitle') || 'Enter your 10-digit ticket number to get plain-language updates in your own language.'}
                </p>
              </div>
            </div>

            {/* Quick Test Scenarios Cards */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('ui.quick_scenarios') || 'Quick Test Scenarios'}</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500">1-Tap to inspect</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {testScenarios.map((item) => (
                  <button
                    key={item.pnr}
                    type="button"
                    onClick={() => handleQuickPnr(item.pnr)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition shadow-xs hover:scale-[1.02] active:scale-[0.99] cursor-pointer group bg-white ${item.accent}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900 group-hover:text-[#0A1E3F]">
                        {item.label}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.badge}`}>
                        {item.desc}
                      </span>
                    </div>
                    <span className="block text-xs font-bold text-slate-500 mt-2 truncate">
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Indian Railways Boarding Pass Ticket Search Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-3xl border-2 border-[#0A1E3F] bg-white shadow-md overflow-hidden relative">
                {/* Golden Header Strip */}
                <div className="bg-[#0A1E3F] px-5 py-3 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      {t('ui.pnr_label') || '10-Digit PNR Number'}
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1 transition ${
                    isTenDigits ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isTenDigits ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{t('ui.ready_10_digits') || 'Ready (10 Digits)'}</span>
                      </>
                    ) : (
                      <span>{cleanDigits.length} / 10 Digits</span>
                    )}
                  </span>
                </div>

                {/* Input & Action Bar */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={pnrInput}
                      onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="4801952313"
                      aria-label={t('ui.enter_pnr')}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black tracking-widest text-[#0A1E3F] outline-none font-mono placeholder:text-slate-300"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      {!pnrInput && (
                        <button
                          type="button"
                          onClick={handlePaste}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <ClipboardPaste className="w-3.5 h-3.5 text-slate-600" />
                          <span>{t('ui.paste') || 'Paste'}</span>
                        </button>
                      )}

                      {pnrInput && (
                        <button
                          type="button"
                          onClick={() => setPnrInput('')}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t('ui.clear') || 'Clear'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Character Progress Pip Line */}
                  <div className="flex items-center gap-1 pt-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                          i < cleanDigits.length ? 'bg-amber-500' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {errorCode && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-red-50 text-red-900 border-2 border-red-300 font-bold text-sm flex items-start gap-3 shadow-xs"
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
          <div className="space-y-5">
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
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSimulator((v) => !v)}
                className="w-full py-3 px-4 rounded-2xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100/80 text-amber-950 font-black text-xs flex items-center justify-between transition cursor-pointer shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Test Real-Time Live SSE Events (S4 Emergency Alert)</span>
                </span>
                <span className="text-[11px] font-bold underline">
                  {showSimulator ? 'Hide Drawer' : 'Open Drawer'}
                </span>
              </button>

              {showSimulator && (
                <div className="mt-2.5 p-4 rounded-2xl bg-white border-2 border-amber-300 space-y-3 shadow-md animate-slide-up">
                  <p className="text-xs font-semibold text-slate-600">
                    Push real Server-Sent Events (SSE) to test full-screen alerts and live state changes:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('platform_changed')}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-100 text-xs font-black text-slate-900 text-left transition cursor-pointer"
                    >
                      📢 Platform 3 ➔ 6
                    </button>
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('delayed')}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-100 text-xs font-black text-slate-900 text-left transition cursor-pointer"
                    >
                      ⏱ +45m Train Delay
                    </button>
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('cancelled')}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-100 text-xs font-black text-slate-900 text-left transition cursor-pointer"
                    >
                      ⚠️ Train Cancelled
                    </button>
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('confirmed')}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-100 text-xs font-black text-slate-900 text-left transition cursor-pointer"
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
