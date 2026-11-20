import React, { useState } from 'react';
import { Bell, Smartphone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { useT } from '../i18n/useT';
import Sheet from '../components/Sheet';
import BigButton from '../components/BigButton';

export function AlertsSheet({ open, onClose, pnr, apiBaseUrl = '' }) {
  const { t, lang } = useT();
  const [phoneAlertsEnabled, setPhoneAlertsEnabled] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappSuccess, setWhatsappSuccess] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unsupportedHint, setUnsupportedHint] = useState(false);

  if (!open) return null;

  const handlePhoneToggle = async () => {
    if (phoneAlertsEnabled) {
      setPhoneAlertsEnabled(false);
      setPhoneSuccess(false);
      return;
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      setUnsupportedHint(true);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPhoneAlertsEnabled(true);
        const mockFcmToken = 'fcm_token_' + Math.random().toString(36).substring(2, 10);
        const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/notify/subscribe` : '/api/notify/subscribe';

        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pnr,
            fcmToken: mockFcmToken,
            language: lang,
          }),
        }).catch(() => {});

        setPhoneSuccess(true);
        setUnsupportedHint(false);
      } else {
        setUnsupportedHint(true);
      }
    } catch (err) {
      setUnsupportedHint(true);
    }
  };

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleaned = whatsappNumber.replace(/[^\d]/g, '');
    if (cleaned.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/notify/subscribe` : '/api/notify/subscribe';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pnr,
          whatsapp: `+91${cleaned}`,
          language: lang,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setWhatsappSuccess(true);
      } else {
        setErrorMsg('Could not register WhatsApp alerts right now. Try again.');
      }
    } catch {
      // Local fallback for offline/demo
      setWhatsappSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title={t('ui.alerts') || 'Alerts on WhatsApp & Phone'}>
      <div className="space-y-5">
        {/* Section 1: Phone Notification */}
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-slate-800 shrink-0" />
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  {t('ui.alerts_phone') || 'Tell me on this phone'}
                </h3>
                <p className="text-xs font-semibold text-slate-600">
                  Instant visual notification on platform or timing change.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={phoneAlertsEnabled}
              onClick={handlePhoneToggle}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-slate-900 transition-colors ${
                phoneAlertsEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition ${
                  phoneAlertsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {phoneSuccess && (
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2.5 rounded-xl text-xs font-bold border border-emerald-300">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Phone notifications enabled for PNR {pnr}.</span>
            </div>
          )}

          {unsupportedHint && (
            <div className="flex items-start gap-2 text-amber-900 bg-amber-50 p-2.5 rounded-xl text-xs font-bold border border-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>Tip: On iPhone or tablet, tap "Add to Home Screen" to enable background alerts.</span>
            </div>
          )}
        </div>

        {/* Section 2: WhatsApp Alerts */}
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 space-y-3">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <h3 className="font-black text-slate-900 text-sm">
                {t('ui.alerts_whatsapp') || 'Also tell me on WhatsApp'}
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                Receive official WhatsApp alerts for your journey.
              </p>
            </div>
          </div>

          {whatsappSuccess ? (
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-xl text-sm font-bold border border-emerald-300">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Registered +91{whatsappNumber.replace(/\D/g, '')} for WhatsApp alerts.</span>
            </div>
          ) : (
            <form onSubmit={handleWhatsAppSubmit} className="space-y-3">
              <div className="rounded-xl border-2 border-slate-900 bg-slate-50 px-4 py-2.5">
                <label className="block text-[11px] font-black uppercase text-slate-500">
                  WhatsApp Number
                </label>
                <div className="flex items-center gap-2 mt-0.5 font-black text-base text-slate-900">
                  <span>+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-red-600">{errorMsg}</p>
              )}

              <BigButton type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? '...' : t('ui.send_whatsapp') || 'Register WhatsApp'}
              </BigButton>
            </form>
          )}

          <p className="text-[11px] font-semibold text-slate-500 leading-snug">
            {t('ui.whatsapp_join') || 'Twilio sandbox integration: messages sent directly to your registered number.'}
          </p>
        </div>
      </div>
    </Sheet>
  );
}

export default AlertsSheet;
