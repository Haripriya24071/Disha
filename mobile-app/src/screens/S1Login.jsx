import React, { useState } from 'react';
import { ShieldCheck, Train, CheckCircle2, ArrowRight, Globe } from 'lucide-react';
import { useT, LANGUAGES } from '../i18n/useT';
import Header from '../components/Header';
import BigButton from '../components/BigButton';

export default function S1Login({ onContinue }) {
  const { t, lang, setLang } = useT();
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendCode = (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length === 10) {
      setCodeSent(true);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length >= 4) {
      localStorage.setItem('user_phone', `+91${phone}`);
      onContinue();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-md w-full mx-auto px-4 sm:px-5 py-5 space-y-5">
        {/* Hero Branding Header */}
        <div>
          <span className="inline-block bg-amber-400 text-slate-950 px-3 py-1 font-black text-xs uppercase tracking-wider rounded-md mb-2">
            Disha · दिशा · ದಿಶಾ
          </span>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[#0A1E3F]">
            {t('ui.railway_guide') || 'Indian Railways information you can actually understand.'}
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-2">
            {t('ui.pnr_subtitle') || 'Plain language status, instant delay and platform alerts, and automatic backup options in 8 Indian languages.'}
          </p>
        </div>

        {/* All Available Languages Directly on Screen */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-600">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#0A1E3F]" />
              <span>{t('ui.languages_label') || 'Choose Language'}</span>
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              8 Languages
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {LANGUAGES.map((l) => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`py-2 px-1 rounded-xl text-xs font-black text-center transition border cursor-pointer ${
                    active
                      ? 'bg-[#0A1E3F] text-amber-400 border-[#0A1E3F] shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="block truncate">{l.native}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Classic Heritage Train Emblem Card */}
        <div className="rounded-3xl bg-[#0A1E3F] text-white p-5 shadow-sm border border-slate-900 relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
              <Train className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                {t('ui.badge_pnr_status') || 'Official PNR Tracker'}
              </span>
              <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                {t('ui.enter_pnr') || 'Know your seat, platform & chart status instantly.'}
              </h2>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={codeSent ? handleVerify : handleSendCode} className="space-y-3.5">
          <div className="rounded-2xl border-2 border-slate-300 bg-white p-3.5 shadow-2xs focus-within:border-[#0A1E3F] transition">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              {t('ui.alerts_phone') || 'Mobile Number (For WhatsApp / SMS Alerts)'}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-black text-slate-900 text-lg">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full bg-transparent font-black text-lg text-slate-900 outline-none font-mono"
              />
            </div>
          </div>

          {codeSent && (
            <div className="rounded-2xl border-2 border-slate-300 bg-white p-3.5 shadow-2xs focus-within:border-[#0A1E3F] transition">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                OTP (One-Time Password)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-transparent font-black text-xl text-slate-900 tracking-widest outline-none font-mono mt-1"
              />
              <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Demo mode: enter any 4–6 digit code to log in.</span>
              </p>
            </div>
          )}

          <BigButton type="submit" variant="primary">
            {codeSent ? t('ui.login') : t('ui.send_code')}
          </BigButton>
        </form>

        {/* Guest Mode Button */}
        <div className="pt-0.5">
          <BigButton
            variant="secondary"
            onClick={onContinue}
            icon={ArrowRight}
          >
            {t('ui.continue_guest')}
          </BigButton>
        </div>

        {/* Privacy Note */}
        <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
          <span>
            Privacy guarantee: We only store your language preference and tracked PNR. We never sell your data, and journey records are cleared after completion.
          </span>
        </div>
      </main>
    </div>
  );
}
