import React, { useState, useEffect } from 'react';
import { Type, Contrast, Smartphone, Key, Check, Info } from 'lucide-react';
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
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('rapidapi_key') || '');
  const [savedKey, setSavedKey] = useState(false);

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

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('rapidapi_key', apiKey.trim());
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 2000);
  };

  const rows = [
    { id: 'large', label: t('ui.large_text'), icon: Type, value: largeText, toggle: () => setLargeText((v) => !v) },
    { id: 'contrast', label: t('ui.high_contrast'), icon: Contrast, value: highContrast, toggle: () => setHighContrast((v) => !v) },
    { id: 'vibrate', label: t('ui.vibration'), icon: Smartphone, value: vibration, toggle: () => setVibration((v) => !v) },
  ];

  return (
    <Sheet open={open} onClose={onClose} title={t('ui.settings')}>
      <div className="space-y-4 pt-1">
        {/* Accessibility Toggles */}
        <div className="space-y-2.5">
          {rows.map(({ id, label, icon: Icon, value, toggle }) => (
            <button
              key={id}
              type="button"
              role="switch"
              aria-checked={value}
              onClick={toggle}
              className={`w-full min-h-[58px] px-5 rounded-2xl border-2 flex items-center justify-between gap-3 font-black transition cursor-pointer ${
                value
                  ? 'bg-[#0A1E3F] text-amber-400 border-[#0A1E3F]'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0 stroke-[2.2]" />
                <span className="text-base">{label}</span>
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  value ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {value ? 'ON' : 'OFF'}
              </span>
            </button>
          ))}
        </div>

        {/* Live RapidAPI IRCTC Configuration */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#0A1E3F]" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Live IRCTC RapidAPI Key (Optional)
            </span>
          </div>

          <form onSubmit={handleSaveApiKey} className="space-y-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter RapidAPI Key for live queries"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs outline-none focus:border-[#0A1E3F]"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-500">
                {savedKey ? '✔ Key saved!' : 'Leave blank to use verified mock mode.'}
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#0A1E3F] text-white font-black text-xs hover:bg-[#163668] transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Sheet>
  );
}
