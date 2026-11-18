import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-6 space-y-6">
        <h1 className="text-[1.65rem] font-extrabold leading-tight">
          Know your train status in your own language.
        </h1>

        <form onSubmit={codeSent ? handleVerify : handleSendCode} className="space-y-4">
          <label className="block font-bold">
            Phone number
            <div className="mt-2 flex items-center rounded-xl border-2 border-[#1A1A2E] bg-white overflow-hidden">
              <span className="px-4 font-bold text-slate-700 border-r border-slate-300">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full min-h-[56px] px-4 font-bold tracking-wider outline-none"
              />
            </div>
          </label>

          {codeSent && (
            <label className="block font-bold">
              OTP
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="mt-2 w-full min-h-[56px] px-4 rounded-xl border-2 border-[#1A1A2E] bg-white font-bold tracking-widest"
              />
            </label>
          )}

          <BigButton type="submit" icon={Phone} variant="primary">
            {codeSent ? t('ui.login') : t('ui.send_code')}
          </BigButton>
        </form>

        <div className="text-center font-bold text-slate-500">or</div>

        <BigButton icon={ArrowRight} variant="secondary" onClick={onContinue}>
          {t('ui.continue_guest')}
        </BigButton>

        <p className="text-sm text-slate-700 flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-300">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-[#15803D]" />
          <span>
            We only store your language, phone number (if you log in), and tracked PNR to send alerts—deleted 24 hours after your journey.
          </span>
        </p>
      </main>
    </div>
  );
}
