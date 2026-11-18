import React, { useState, useEffect } from 'react';
import { Type, Contrast, Smartphone } from 'lucide-react';
import { useT } from '../i18n/useT';
import Sheet from '../components/Sheet';

export function applySavedA11ySettings() {
  const largeText = localStorage.getItem('a11y_large_text') === 'true';
  const highContrast = localStorage.getItem('a11y_high_contrast') === 'true';
  document.documentElement.classList.toggle('text-large', largeText);
  document.documentElement.classList.toggle('high-contrast', highContrast);
}

export default function Accessibility({ open, onClose }) {
  const { t } = useT();
  const [largeText, setLargeText] = useState(() => localStorage.getItem('a11y_large_text') === 'true');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('a11y_high_contrast') === 'true');
  const [vibration, setVibration] = useState(() => localStorage.getItem('a11y_vibration') !== 'false');

  useEffect(() => {
    localStorage.setItem('a11y_large_text', String(largeText));
    document.documentElement.classList.toggle('text-large', largeText);
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem('a11y_high_contrast', String(highContrast));
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('a11y_vibration', String(vibration));
  }, [vibration]);

  const rows = [
    { id: 'large', label: t('ui.large_text'), icon: Type, value: largeText, toggle: () => setLargeText((v) => !v) },
    { id: 'contrast', label: t('ui.high_contrast'), icon: Contrast, value: highContrast, toggle: () => setHighContrast((v) => !v) },
    { id: 'vibrate', label: t('ui.vibration'), icon: Smartphone, value: vibration, toggle: () => setVibration((v) => !v) },
  ];

  return (
    <Sheet open={open} onClose={onClose} title={t('ui.settings')}>
      <div className="space-y-3">
        {rows.map(({ id, label, icon: Icon, value, toggle }) => (
          <button
            key={id}
            type="button"
            role="switch"
            aria-checked={value}
            onClick={toggle}
            className={`w-full min-h-[62px] px-5 rounded-full border-2 border-[#0A0A0A] flex items-center justify-between gap-3 font-extrabold transition ${
              value ? 'bg-[#FFD600] text-[#0A0A0A]' : 'bg-white text-[#0A0A0A]'
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-5 h-5 shrink-0 stroke-[2.5]" />
              <span>{label}</span>
            </span>
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-extrabold ${
                value ? 'bg-[#0A0A0A] text-[#FFD600]' : 'bg-[#F4F3EF] text-[#0A0A0A] border border-[#0A0A0A]'
              }`}
            >
              {value ? 'ON' : 'OFF'}
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
