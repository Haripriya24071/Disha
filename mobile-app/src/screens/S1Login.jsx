import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
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
    if (phone.replace(/\D/g, '').length === 10) setCodeSent(true);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length >= 4) {
      localStorage.setItem('user_phone', `+91${phone}`);
      onContinue();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F3EF]">
      <Header />
      <main className="flex-1 max-w-md w-full mx-auto px-5 py-4 space-y-5">
        <div>
          <span className="inline-block bg-[#FFD600] px-2.5 py-0.5 font-extrabold text-sm tracking-tight mb-2">
            Disha
          </span>
          <h1 className="text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#0A0A0A]">
            We make your train journey as easy as possible.
          </h1>
        </div>

        {/* Yellow Hero Train Card */}
        <div className="train-speed-bg rounded-[28px] p-6 flex items-center justify-center">
          <svg width="230" height="90" viewBox="0 0 230 90" fill="none" aria-hidden="true">
            <path d="M12 78L218 52" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
            <path d="M40 84L222 62" stroke="white" strokeWidth="2.5" strokeOpacity="0.6" />
            <path
              d="M32 58C32 41 56 26 90 23L192 14C206 13 215 21 215 33V49C215 56 209 60 201 60H38C34 60 32 59 32 58Z"
              fill="#FFFFFF"
              stroke="#0A0A0A"
              strokeWidth="2.5"
            />
            <path d="M36 48H213V55H34L36 48Z" fill="#FFD600" />
            <path d="M48 37C60 30 77 27 94 26L88 40H43L48 37Z" fill="#0A0A0A" />
            <rect x="106" y="28" width="22" height="10" rx="2.5" fill="#0A0A0A" />
            <rect x="135" y="25" width="22" height="10" rx="2.5" fill="#0A0A0A" />
            <rect x="164" y="22" width="22" height="10" rx="2.5" fill="#0A0A0A" />
          </svg>
        </div>

        <form onSubmit={codeSent ? handleVerify : handleSendCode} className="space-y-3.5">
          <div className="rounded-[24px] border-2 border-[#0A0A0A] bg-[#F4F3EF] px-5 py-3">
            <label className="block text-xs font-bold text-[#0A0A0A]/70">
              Phone Number
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-extrabold text-[#0A0A0A]">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full bg-transparent font-extrabold text-base text-[#0A0A0A] outline-none"
              />
            </div>
          </div>

          {codeSent && (
            <div className="rounded-[24px] border-2 border-[#0A0A0A] bg-[#F4F3EF] px-5 py-3">
              <label className="block text-xs font-bold text-[#0A0A0A]/70">
                OTP Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full bg-transparent font-extrabold text-base text-[#0A0A0A] tracking-widest outline-none mt-0.5"
              />
            </div>
          )}

          <BigButton type="submit" variant="primary">
            {codeSent ? t('ui.login') : t('ui.send_code')}
          </BigButton>
        </form>

        <BigButton variant="secondary" onClick={onContinue}>
          {t('ui.continue_guest')}
        </BigButton>

        <p className="text-xs text-[#0A0A0A]/70 flex items-start gap-2 px-1">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#0A0A0A]" />
          <span>
            We only store your language, phone number (if logged in), and tracked PNR—deleted 24h after your journey.
          </span>
        </p>
      </main>
    </div>
  );
}
