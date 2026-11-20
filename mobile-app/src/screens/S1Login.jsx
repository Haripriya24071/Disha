import React, { useState, useRef } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';
import { useT } from '../i18n/useT';
import Header from '../components/Header';
import BigButton from '../components/BigButton';

export default function S1Login({ onContinue }) {
  const { t } = useT();
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoNotice, setDemoNotice] = useState(false);
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      if (auth) {
        if (!recaptchaRef.current) {
          recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
          });
        }
        const confirmation = await signInWithPhoneNumber(
          auth,
          `+91${cleanPhone}`,
          recaptchaRef.current
        );
        confirmationRef.current = confirmation;
        setDemoNotice(false);
      } else {
        // Instant demo OTP mode when Firebase env keys aren't configured
        setDemoNotice(true);
      }
      setCodeSent(true);
    } catch (err) {
      console.warn('Firebase OTP fallback to demo mode:', err);
      setDemoNotice(true);
      setCodeSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    const cleanOtp = otp.replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setError('Enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      if (confirmationRef.current) {
        await confirmationRef.current.confirm(cleanOtp);
      } else if (cleanOtp !== '123456') {
        setError('Demo OTP is 123456.');
        setLoading(false);
        return;
      }
      localStorage.setItem('user_phone', `+91${phone}`);
      localStorage.setItem('auth_mode', 'logged_in');
      onContinue({ phone: `+91${phone}`, guest: false });
    } catch {
      setError('Invalid OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    localStorage.setItem('auth_mode', 'guest');
    onContinue({ phone: null, guest: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F3EF]">
      <Header />
      <div id="recaptcha-container" />
      <main className="flex-1 max-w-md w-full mx-auto px-5 py-4 space-y-5">
        <div>
          <span className="inline-block bg-[#FFD600] px-2.5 py-0.5 font-extrabold text-sm tracking-tight mb-2">
            Disha
          </span>
          <h1 className="text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#0A0A0A]">
            We make your train journey as easy as possible.
          </h1>
        </div>

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
          <div className="rounded-[24px] border-2 border-[#0A0A0A] bg-white px-5 py-3">
            <div className="flex items-center justify-between">
              <label htmlFor="phone-input" className="block text-xs font-bold text-[#0A0A0A]/70">
                Phone Number
              </label>
              {codeSent && (
                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setOtp('');
                    setError('');
                  }}
                  className="text-xs font-extrabold underline text-[#0A0A0A]"
                >
                  Change
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-extrabold text-[#0A0A0A]">+91</span>
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                disabled={codeSent}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full bg-transparent font-extrabold text-base text-[#0A0A0A] outline-none disabled:opacity-60"
              />
            </div>
          </div>

          {codeSent && (
            <div className="rounded-[24px] border-2 border-[#0A0A0A] bg-white px-5 py-3 space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="otp-input" className="block text-xs font-bold text-[#0A0A0A]/70">
                  6-Digit OTP
                </label>
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#15803D]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sent to +91 {phone}
                </span>
              </div>
              <input
                id="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-transparent font-extrabold text-xl text-[#0A0A0A] tracking-[0.25em] outline-none"
              />
              {demoNotice && (
                <p className="text-xs font-bold text-[#0A0A0A]/75 pt-1">
                  Test mode active: enter <span className="bg-[#FFD600] px-1.5 py-0.5 rounded font-extrabold">123456</span>
                </p>
              )}
            </div>
          )}

          {error && (
            <div role="alert" className="p-3.5 rounded-[18px] bg-[#FF4D4D] text-white border-2 border-[#0A0A0A] text-sm font-extrabold">
              {error}
            </div>
          )}

          <BigButton type="submit" variant="primary" disabled={loading}>
            {loading ? 'Please wait...' : codeSent ? t('ui.login') : t('ui.send_code')}
          </BigButton>
        </form>

        <BigButton icon={ArrowRight} variant="secondary" onClick={handleGuest}>
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
