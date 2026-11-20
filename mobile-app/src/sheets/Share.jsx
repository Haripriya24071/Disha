import React, { useState } from 'react';

/**
 * ShareSheet — Haripriya
 * Allows users to share their current train status with family members.
 * 
 * Rules:
 * - Status preview card built from t() in the user's selected language
 * - Primary button "Send on WhatsApp" (wa.me link)
 * - Secondary button "Copy" with temporary "Copied" feedback
 * - Privacy: Never include the full 10-digit PNR in shared text; show only the last 4 digits!
 */
export function ShareSheet({ open, onClose, journey, t }) {
  const [copied, setCopied] = useState(false);

  if (!open || !journey) return null;

  // Mask PNR for passenger privacy (only show last 4 digits)
  const fullPnr = String(journey.pnr || '1111111111');
  const maskedPnr = `******${fullPnr.slice(-4)}`;

  const trainNumber = journey.train?.number || '12345';
  const trainName = journey.train?.name || 'Express';
  const departureDate = journey.departure_iso
    ? new Date(journey.departure_iso).toLocaleDateString()
    : 'Upcoming';

  // Construct headline and sentences based on ticket status
  const ticketType = journey.ticket?.type;
  let headline = 'WAITING LIST';
  let sentences = t('status.wl', { pos: journey.ticket?.wl_position || '8' });

  if (ticketType === 'RAC') {
    headline = 'RAC (SITTING SEAT CONFIRMED)';
    sentences = t('status.rac');
  } else if (ticketType === 'CNF') {
    headline = 'CONFIRMED TICKET';
    sentences = t('status.cnf', {
      coach: journey.ticket?.coach || 'S4',
      berth: journey.ticket?.berth || '32'
    });
  }

  // Clean tags like [[wl:waiting line]] from text
  const cleanedSentences = sentences.replace(/\[\[.*?:(.*?)\]\]/g, '$1');

  // Build the message formatted strictly according to Haripriya's spec:
  // "Disha — {headline}\n{sentences}\nTrain {number} · {date}\nAlways confirm with IRCTC or 139."
  const shareMessage = `Disha — ${headline}\n${cleanedSentences}\nTrain ${trainNumber} (${trainName}) · ${departureDate} · PNR: ${maskedPnr}\nAlways confirm with IRCTC or 139.`;

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-sheet-title"
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4"
    >
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-slide-up">
        {/* Sheet Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">👪</span>
            <h2 id="share-sheet-title" className="text-xl font-bold text-gray-900">
              {t('ui.share') || 'Share with family'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 min-h-[48px] min-w-[48px] flex items-center justify-center text-xl font-bold"
            aria-label="Close share sheet"
          >
            ✕
          </button>
        </div>

        {/* Status Preview Card */}
        <div className="p-5 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Message Preview (PNR: {maskedPnr})
            </p>
            <p className="text-lg font-bold text-gray-900">
              Disha — {headline}
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              {cleanedSentences}
            </p>
            <div className="pt-2 text-sm text-gray-600 font-medium border-t border-blue-200/60">
              Train {trainNumber} · {departureDate}
              <div className="text-xs text-gray-500 mt-0.5">
                Always confirm with IRCTC or 139.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {/* Primary Action: WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-lg min-h-[56px] shadow-md flex items-center justify-center gap-3 transition"
            >
              <span className="text-2xl" aria-hidden="true">💬</span>
              <span>{t('ui.send_whatsapp') || 'Send on WhatsApp'}</span>
            </button>

            {/* Secondary Action: Copy */}
            <button
              onClick={handleCopy}
              className="w-full py-3.5 px-6 rounded-2xl border-2 border-gray-300 hover:border-gray-400 bg-gray-50 text-gray-900 font-semibold text-base min-h-[48px] flex items-center justify-center gap-2 transition"
            >
              <span aria-hidden="true">{copied ? '✔' : '📋'}</span>
              <span>{copied ? (t('ui.copied') || 'Copied') : (t('ui.copy') || 'Copy')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareSheet;
