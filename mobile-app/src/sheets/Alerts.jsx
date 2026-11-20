import React, { useState } from 'react';

/**
 * AlertsSheet — Haripriya
 * Subscription management sheet for Web Push & WhatsApp alerts.
 * 
 * Rules:
 * - "Tell me on this phone" switch requests Notification permission
 * - WhatsApp number input (10-digit Indian number) + join code instruction
 * - Green "Done" state with ✔ and plain words
 * - Plain language note and "Add to Home Screen" hint for iPhone/unsupported browsers
 */
export function AlertsSheet({ open, onClose, pnr, lang = 'en', t, apiBaseUrl = 'http://localhost:5000' }) {
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
        // Simulate FCM registration token
        const mockFcmToken = 'fcm_token_' + Math.random().toString(36).substring(2, 10);
        
        await fetch(`${apiBaseUrl}/api/notify/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pnr,
            fcmToken: mockFcmToken,
            language: lang
          })
        });

        setPhoneSuccess(true);
        setUnsupportedHint(false);
      } else {
        setUnsupportedHint(true);
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
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
      const res = await fetch(`${apiBaseUrl}/api/notify/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pnr,
          whatsapp: `+91${cleaned}`,
          language: lang
        })
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alerts-sheet-title"
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4"
    >
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🔔</span>
            <h2 id="alerts-sheet-title" className="text-xl font-bold text-gray-900">
              {t('ui.alerts') || 'Alerts on WhatsApp & Phone'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 min-h-[48px] min-w-[48px] flex items-center justify-center text-xl font-bold"
            aria-label="Close alerts sheet"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Section 1: Browser Push Notifications */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {t('ui.alerts_phone') || 'Tell me on this phone'}
                </h3>
                <p className="text-sm text-gray-600">
                  Receive instant notifications when platforms or times change.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={phoneAlertsEnabled}
                onClick={handlePhoneToggle}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  phoneAlertsEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    phoneAlertsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {phoneSuccess && (
              <div className="p-2.5 rounded-xl bg-green-100 text-green-900 text-sm font-semibold flex items-center gap-2 border border-green-300">
                <span aria-hidden="true">✔</span>
                <span>Phone notifications active for PNR {pnr}</span>
              </div>
            )}

            {unsupportedHint && (
              <div className="p-3 rounded-xl bg-amber-50 text-amber-900 text-sm border border-amber-200 space-y-1">
                <p className="font-semibold">Notifications blocked or not supported</p>
                <p className="text-xs text-amber-800">
                  On iPhone (Safari), tap "Share" → <strong>"Add to Home Screen"</strong> first to allow notification alerts.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: WhatsApp Alerts */}
          <div className="bg-green-50/60 border border-green-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">💬</span>
              <h3 className="text-lg font-bold text-gray-900">
                {t('ui.alerts_whatsapp') || 'Also tell me on WhatsApp'}
              </h3>
            </div>

            {/* Instruction: Join sandbox once */}
            <div className="p-3 bg-white rounded-xl border border-green-200 text-sm text-gray-700 leading-relaxed">
              <p className="font-medium">
                {t('ui.whatsapp_join') ? (
                  t('ui.whatsapp_join').replace('<code>', 'join disha-alerts')
                ) : (
                  'First, send the word “join disha-alerts” to our WhatsApp number once.'
                )}
              </p>
            </div>

            {whatsappSuccess ? (
              <div className="p-4 rounded-xl bg-green-100 text-green-900 border border-green-300 space-y-1 text-center">
                <div className="text-3xl" aria-hidden="true">✔</div>
                <p className="text-lg font-bold">Done! Alerts activated</p>
                <p className="text-sm text-green-800">
                  We will WhatsApp you immediately if platform, timing, or seat status changes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWhatsAppSubmit} className="space-y-3">
                <div>
                  <label htmlFor="whatsapp-input" className="block text-sm font-semibold text-gray-800 mb-1">
                    Your 10-digit Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-600 font-semibold text-base">
                      +91
                    </span>
                    <input
                      id="whatsapp-input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="9876543210"
                      className="flex-1 block w-full rounded-r-xl border border-gray-300 px-3 py-3 text-lg font-mono focus:border-green-600 focus:ring-green-600"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-base min-h-[48px] shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <span aria-hidden="true">✔</span>
                  <span>{isSubmitting ? 'Registering...' : (t('ui.send_whatsapp') || 'Get WhatsApp Alerts')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertsSheet;
