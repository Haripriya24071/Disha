import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare } from 'lucide-react';
import { useT } from '../i18n/useT';
import Sheet from '../components/Sheet';
import BigButton from '../components/BigButton';

export function ShareSheet({ open, onClose, journey }) {
  const { t } = useT();
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
      berth: journey.ticket?.berth || '32',
    });
  }

  const cleanedSentences = sentences.replace(/\[\[.*?:(.*?)\]\]/g, '$1');

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
    } catch {
      // Fallback
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title={t('ui.share')}>
      <div className="space-y-4">
        {/* Preview Card */}
        <div className="rounded-2xl border-2 border-slate-900 bg-amber-50 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-slate-900 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
              Disha Share Preview
            </span>
            <span className="text-xs font-bold text-slate-600">PNR: {maskedPnr}</span>
          </div>
          <p className="font-black text-slate-900 text-base">{headline}</p>
          <p className="text-sm font-semibold text-slate-800 leading-snug">{cleanedSentences}</p>
          <div className="pt-1 text-xs font-bold text-slate-600 border-t border-slate-200">
            Train {trainNumber} ({trainName}) · {departureDate}
          </div>
        </div>

        {/* Action Buttons */}
        <BigButton
          icon={MessageSquare}
          variant="primary"
          onClick={handleWhatsApp}
        >
          {t('ui.send_whatsapp')}
        </BigButton>

        <BigButton
          icon={copied ? Check : Copy}
          variant="secondary"
          onClick={handleCopy}
        >
          {copied ? t('ui.copied') : t('ui.copy')}
        </BigButton>
      </div>
    </Sheet>
  );
}

export default ShareSheet;
