import React, { useState } from 'react';
import { Train, CheckCircle2, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import { useT } from '../i18n/useT';
import Header from '../components/Header';
import BigButton from '../components/BigButton';

export default function S1Login({ onContinue }) {
  const { t } = useT();
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
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-950">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Hero Branding Header */}
        <div className="rounded-3xl bg-white border-3 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a] space-y-3">
          <span className="inline-block bg-amber-400 text-slate-950 px-3.5 py-1.5 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
            Disha · दिशा · ದಿಶಾ
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-slate-950">
            {t('ui.railway_guide') || 'Indian Railways information you can actually understand.'}
          </h1>
          <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
            {t('ui.pnr_subtitle') || 'Plain language status, instant delay and platform alerts, and automatic backup options in 8 Indian languages.'}
          </p>
        </div>

        {/* Heritage Train Feature Badge */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#ffffff]">
              <Train className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                {t('ui.badge_pnr_status') || 'OFFICIAL PNR TRACKER'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                {t('ui.enter_pnr') || 'Know your seat, platform & chart status instantly.'}
              </h2>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={codeSent ? handleVerify : handleSendCode} className="rounded-3xl bg-white border-3 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a] space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              {t('ui.alerts_phone') || 'Mobile Number (For WhatsApp / SMS Alerts)'}
            </label>
            <div className="flex items-center gap-2 border-2 border-slate-900 rounded-2xl px-4 py-3 bg-[#FCFCF9] shadow-[2px_2px_0px_0px_#0f172a] focus-within:ring-2 focus-within:ring-amber-400">
              <span className="font-black text-slate-950 text-xl font-mono">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full bg-transparent font-black text-xl text-slate-950 outline-none font-mono placeholder:text-slate-400"
              />
            </div>
          </div>

          {codeSent && (
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                OTP (One-Time Password)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-[#FCFCF9] border-2 border-slate-900 rounded-2xl px-4 py-3 font-black text-2xl text-slate-950 tracking-widest outline-none font-mono shadow-[2px_2px_0px_0px_#0f172a]"
              />
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Demo mode: enter any 4–6 digit code to log in.</span>
              </p>
            </div>
          )}

          <BigButton type="submit" variant="primary">
            {codeSent ? t('ui.login') : t('ui.send_code')}
          </BigButton>

          <div className="pt-2 border-t-2 border-slate-200">
            <BigButton
              variant="secondary"
              onClick={onContinue}
              icon={ArrowRight}
            >
              {t('ui.continue_guest')}
            </BigButton>
          </div>
        </form>
      </main>
    </div>
  );
}
