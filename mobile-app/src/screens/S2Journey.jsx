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
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Train,
  Check,
  X,
  ClipboardPaste,
  ShieldCheck,
  Luggage,
  Coffee,
  Accessibility as AccessibilityIcon,
  HelpCircle as QuestionIcon,
  Info
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

export default function S2Journey({ journeyState, onOpenBackup, sseConnected }) {
  const { t, lang } = useT();
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
      accent: 'border-slate-900 bg-amber-50 text-slate-950',
      badge: 'bg-amber-400 text-slate-950 border border-slate-900',
      tag: 'Waitlist #8'
    },
    {
      pnr: '2222222222',
      label: 'RAC 14',
      desc: t('ui.scenarios_rac') || 'Sitting Seat',
      accent: 'border-slate-900 bg-blue-50 text-slate-950',
      badge: 'bg-blue-300 text-slate-950 border border-slate-900',
      tag: 'RAC (Confirmed Seat)'
    },
    {
      pnr: '3333333333',
      label: 'CNF B2/32',
      desc: t('ui.scenarios_cnf') || 'Confirmed',
      accent: 'border-slate-900 bg-emerald-50 text-slate-950',
      badge: 'bg-emerald-400 text-slate-950 border border-slate-900',
      tag: 'Coach B2 · Berth 32'
    },
    {
      pnr: '4444444444',
      label: 'Cancelled',
      desc: t('ui.scenarios_cancelled') || 'Cancelled Train',
      accent: 'border-slate-900 bg-red-50 text-slate-950',
      badge: 'bg-red-400 text-slate-950 border border-slate-900',
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
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-950 font-sans">
      <Header
        onBack={status === 'ok' ? reset : undefined}
        rightElement={
          status === 'ok' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border-2 border-slate-900 text-xs font-black text-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
              <span className={`w-2.5 h-2.5 rounded-full ${sseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline">{sseConnected ? (t('ui.live_connected') || 'Live SSE') : 'Polling'}</span>
            </div>
          )
        }
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        {status !== 'ok' ? (
          /* STATE A: PNR Input Screen */
          <div className="space-y-8">
            {/* Indian Railways Hero Header */}
            <div className="rounded-3xl bg-white text-slate-950 p-6 sm:p-8 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-3 relative overflow-hidden">
              <span className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-1.5 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                <Train className="w-4 h-4 stroke-[2.5]" />
                <span>{t('ui.badge_pnr_status') || 'Official Indian Railways Assistant'}</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-slate-950">
                {t('ui.enter_pnr')}
              </h1>
              <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed max-w-2xl">
                {t('ui.pnr_subtitle') || 'Enter your 10-digit ticket number to get plain-language updates in your own language.'}
              </p>
            </div>

            {/* Indian Railways Boarding Pass Ticket Search Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-3xl border-3 border-slate-900 bg-white shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden">
                {/* Yellow Header Strip */}
                <div className="bg-amber-400 px-6 py-3.5 text-slate-950 flex items-center justify-between border-b-2 border-slate-900">
                  <div className="flex items-center gap-2">
                    <Train className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950">
                      {t('ui.pnr_label') || '10-Digit PNR Number'}
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-black px-3 py-1 rounded-xl border-2 border-slate-900 transition-all ${
                    isTenDigits ? 'bg-emerald-400 text-slate-950 shadow-[1px_1px_0px_0px_#0f172a]' : 'bg-white text-slate-900'
                  }`}>
                    {isTenDigits ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Ready (10 Digits)</span>
                      </span>
                    ) : (
                      <span>{cleanDigits.length} / 10 Digits</span>
                    )}
                  </span>
                </div>

                {/* Input & Action Bar */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={pnrInput}
                      onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="4801952313"
                      aria-label={t('ui.enter_pnr')}
                      className="w-full bg-transparent text-3xl sm:text-4xl font-black tracking-widest text-slate-950 outline-none font-mono placeholder:text-slate-300"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      {!pnrInput && (
                        <button
                          type="button"
                          onClick={handlePaste}
                          className="px-4 py-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-amber-100 text-slate-950 text-xs font-black shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <ClipboardPaste className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                          <span>{t('ui.paste') || 'Paste'}</span>
                        </button>
                      )}

                      {pnrInput && (
                        <button
                          type="button"
                          onClick={() => setPnrInput('')}
                          className="px-4 py-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-950 text-xs font-black shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                          <span>{t('ui.clear') || 'Clear'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Character Progress Pip Line */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full border border-slate-900 transition-all duration-200 ${
                          i < cleanDigits.length ? 'bg-amber-400' : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {errorCode && (
                <div
                  role="alert"
                  className="p-5 rounded-2xl bg-red-100 text-red-950 border-2 border-slate-900 font-bold text-base flex items-start gap-3.5 shadow-[3px_3px_0px_0px_#0f172a]"
                >
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 stroke-[2.5]" />
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

            {/* Quick Test Scenarios Cards */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t('ui.quick_scenarios') || 'Quick Test Scenarios (1-Tap Test)'}</span>
                </span>
                <span className="text-xs font-bold text-slate-500">Official Cases</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {testScenarios.map((item) => (
                  <button
                    key={item.pnr}
                    type="button"
                    onClick={() => handleQuickPnr(item.pnr)}
                    className={`p-4 rounded-2xl border-2 text-left transition shadow-[3px_3px_0px_0px_#0f172a] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ${item.accent}`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-black text-base text-slate-950">
                        {item.label}
                      </span>
                    </div>
                    <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg mt-2 ${item.badge}`}>
                      {item.desc}
                    </span>
                    <span className="block text-xs font-bold text-slate-600 mt-2 truncate">
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Helper Links */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => openTerm('pnr')}
                className="inline-flex items-center gap-2 font-black text-sm text-slate-950 bg-white border-2 border-slate-900 px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] hover:bg-amber-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                <span>{t('ui.what_is_pnr')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSheet('glossary')}
                className="inline-flex items-center gap-2 font-black text-sm text-slate-950 bg-white border-2 border-slate-900 px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] hover:bg-amber-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                <span>{t('ui.glossary')} (14 Terms)</span>
              </button>
            </div>
          </div>
        ) : (
          /* STATE B: Journey Loaded */
          <div className="space-y-8">
            {/* Quick Test Switcher Bar (in Journey View) */}
            <div className="flex items-center justify-between gap-3 p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0f172a]">
              <span className="text-xs font-black uppercase text-slate-700 shrink-0">Switch Scenario:</span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {testScenarios.map((item) => {
                  const active = journey?.pnr === item.pnr;
                  return (
                    <button
                      key={item.pnr}
                      type="button"
                      onClick={() => handleQuickPnr(item.pnr)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-2 transition cursor-pointer shrink-0 ${
                        active
                          ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                          : 'bg-white text-slate-900 border-slate-900 hover:bg-amber-50'
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
              <div className="p-4 rounded-2xl bg-amber-100 border-2 border-slate-900 font-bold text-sm text-amber-950 flex items-center gap-3 shadow-[3px_3px_0px_0px_#0f172a]">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 stroke-[2.5]" />
                <span>{t(errorCode === 'offline' ? 'error.offline' : 'error.nodata')}</span>
              </div>
            )}

            {/* Neo-brutalist Status Card */}
            <StatusCard journey={journey} onOpenTerm={openTerm} />

            {/* Side-by-side Listen & Refresh Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BigButton
                icon={speaking ? VolumeX : Volume2}
                variant={speaking ? 'accent' : 'secondary'}
                onClick={() => (speaking ? cancel() : speak(buildSpokenSummary()))}
              >
                {speaking ? t('ui.stop') : `${t('ui.listen')} (Audio Status)`}
              </BigButton>

              <BigButton
                icon={RefreshCw}
                variant="secondary"
                onClick={handleRefresh}
                className={isRefreshing ? 'animate-pulse' : ''}
              >
                {isRefreshing ? 'Updating from IRCTC...' : t('ui.refresh')}
              </BigButton>
            </div>

            {voiceUnavailable && (
              <p className="text-xs font-bold text-amber-950 bg-amber-100 border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_#0f172a]">
                {t('ui.voice_unavailable')}
              </p>
            )}

            {/* Primary Action Button: Backup Plan */}
            <BigButton icon={Compass} variant="accent" onClick={onOpenBackup}>
              {t('ui.backup_plan')} (Alternative Trains & State Buses)
            </BigButton>

            {/* Secondary Utility Row (Family Share & Alerts) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BigButton
                icon={Users}
                variant="secondary"
                onClick={() => setActiveSheet('share')}
              >
                {t('ui.share')} (WhatsApp / SMS)
              </BigButton>

              <BigButton
                icon={Bell}
                variant="secondary"
                onClick={() => setActiveSheet('alerts')}
              >
                {t('ui.alerts')} (WhatsApp & SMS)
              </BigButton>
            </div>

            {/* Tertiary Utility Buttons (Glossary, Settings, Call 139) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTermId(null);
                  setActiveSheet('glossary');
                }}
                className="min-h-[54px] px-4 rounded-2xl border-2 border-slate-900 bg-white hover:bg-slate-50 font-black text-sm text-slate-950 flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-slate-900 stroke-[2.5]" />
                <span>{t('ui.glossary')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSheet('a11y')}
                className="min-h-[54px] px-4 rounded-2xl border-2 border-slate-900 bg-white hover:bg-slate-50 font-black text-sm text-slate-950 flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition cursor-pointer"
              >
                <Settings className="w-5 h-5 text-slate-900 stroke-[2.5]" />
                <span>{t('ui.settings')}</span>
              </button>

              <a
                href="tel:139"
                className="min-h-[54px] px-4 rounded-2xl border-2 border-slate-900 bg-red-100 hover:bg-red-200 font-black text-sm text-red-950 flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 text-red-700 stroke-[2.5]" />
                <span>139 Helpline</span>
              </a>
            </div>

            {/* Station Amenities & Passenger Facilities Guide (From Report §10) */}
            <section className="rounded-3xl bg-white border-3 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a] space-y-5">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <div className="flex items-center gap-2.5">
                  <Luggage className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    Station Facilities & Amenities Guide
                  </h3>
                </div>
                <span className="text-xs font-black uppercase bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg border border-slate-900">
                  IRCTC Official
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border-2 border-slate-900 bg-[#FCFCF9] space-y-1 shadow-[2px_2px_0px_0px_#0f172a]">
                  <h4 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                    <span>🏠 Retiring Rooms & AC Waiting Halls</span>
                  </h4>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    Air-conditioned and general waiting halls available on Platform 1 & 4. Free access for Confirmed & RAC passengers. Book retiring rooms via IRCTC tourism.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-slate-900 bg-[#FCFCF9] space-y-1 shadow-[2px_2px_0px_0px_#0f172a]">
                  <h4 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                    <span>🧳 Official Coolie / Porter Fixed Tariff</span>
                  </h4>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    Standard fixed tariff: ₹80 to ₹120 for headload up to 40 kg per trip. Report overcharging immediately to Rail Madad 139 or station RPF.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-slate-900 bg-[#FCFCF9] space-y-1 shadow-[2px_2px_0px_0px_#0f172a]">
                  <h4 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                    <span>♿ Wheelchair & Senior Citizen Facilitation</span>
                  </h4>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    Free wheelchairs available at the Station Master enquiry office. Battery-operated transit cars operate between platforms for senior citizens & Divyangjan.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-slate-900 bg-[#FCFCF9] space-y-1 shadow-[2px_2px_0px_0px_#0f172a]">
                  <h4 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                    <span>🔒 Cloak Room & Luggage Lockers</span>
                  </h4>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    Secure luggage storage at ₹20 per package for 24 hours. Luggage must be securely locked and passenger must show a valid ticket.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <span>Jan Aahaar food plaza (Standard meals ₹20–₹50) & RO Water Vending Machines (1L @ ₹5).</span>
                </span>
              </div>
            </section>

            {/* Passenger Rights & TDR Refund Advisory (From Report §10) */}
            <section className="rounded-3xl bg-amber-50 border-3 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
              <div className="flex items-center gap-2.5 border-b-2 border-slate-900 pb-3">
                <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  Indian Railways Passenger Rights & TDR Refund Rules
                </h3>
              </div>

              <div className="space-y-3 text-sm font-bold text-slate-900">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 border border-slate-900 text-xs">
                    1
                  </span>
                  <p className="leading-relaxed">
                    <strong>Train Delayed Over 3 Hours:</strong> You are entitled to a 100% full fare refund without cancellation charges if you decide not to travel. File TDR before actual train departure.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 border border-slate-900 text-xs">
                    2
                  </span>
                  <p className="leading-relaxed">
                    <strong>Waitlisted After Chart Preparation:</strong> For e-tickets, if your ticket remains in Waiting List (WL) after chart preparation, IRCTC automatically cancels it and credits the full refund to your bank account.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 border border-slate-900 text-xs">
                    3
                  </span>
                  <p className="leading-relaxed">
                    <strong>24x7 Rail Madad Helplines:</strong> Security helpline dial <strong>182</strong> · All-in-One Railway helpline dial <strong>139</strong> · Disaster management dial <strong>1072</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Interactive Live SSE Change Event Simulation Drawer */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSimulator((v) => !v)}
                className="w-full py-4 px-5 rounded-2xl border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-between transition cursor-pointer shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <span className="flex items-center gap-2.5">
                  <Zap className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                  <span>Test Real-Time Live SSE Events (S4 Emergency Alert)</span>
                </span>
                <span className="text-xs font-black underline">
                  {showSimulator ? 'Close Drawer' : 'Open Drawer'}
                </span>
              </button>

              {showSimulator && (
                <div className="mt-4 p-5 rounded-3xl bg-white border-3 border-slate-900 space-y-4 shadow-[6px_6px_0px_0px_#0f172a] animate-slide-up">
                  <p className="text-xs font-bold text-slate-600">
                    Push real Server-Sent Events (SSE) to test full-screen alerts and live state changes:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('platform_changed')}
                      className="p-3.5 rounded-xl border-2 border-slate-900 bg-amber-50 hover:bg-amber-100 text-xs font-black text-slate-950 text-left transition cursor-pointer shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                      📢 Platform 3 ➔ 6
                    </button>
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('delayed')}
                      className="p-3.5 rounded-xl border-2 border-slate-900 bg-amber-50 hover:bg-amber-100 text-xs font-black text-slate-950 text-left transition cursor-pointer shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                      ⏱ +45m Train Delay
                    </button>
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('cancelled')}
                      className="p-3.5 rounded-xl border-2 border-slate-900 bg-red-50 hover:bg-red-100 text-xs font-black text-red-950 text-left transition cursor-pointer shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                      ⚠️ Train Cancelled
                    </button>
                    <button
                      type="button"
                      disabled={triggeringEvent !== null}
                      onClick={() => triggerLiveDemoEvent('confirmed')}
                      className="p-3.5 rounded-xl border-2 border-slate-900 bg-emerald-50 hover:bg-emerald-100 text-xs font-black text-emerald-950 text-left transition cursor-pointer shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                      🎉 Ticket Confirmed
                    </button>
                  </div>
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={handleResetDemo}
                      className="text-xs font-black text-slate-700 hover:text-slate-950 underline cursor-pointer"
                    >
                      Reset Journey to Initial State
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Official Indian Railways Trust Footer */}
            <div className="pt-4 text-center space-y-1">
              <p className="text-xs font-bold text-slate-500 leading-snug">
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
