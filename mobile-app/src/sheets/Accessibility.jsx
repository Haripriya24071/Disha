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
      <div className="space-y-5 pt-1">
        {/* Accessibility Toggles */}
        <div className="space-y-3">
          {rows.map(({ id, label, icon: Icon, value, toggle }) => (
            <button
              key={id}
              type="button"
              role="switch"
              aria-checked={value}
              onClick={toggle}
              className={`w-full min-h-[64px] px-5 rounded-2xl border-2 border-slate-900 flex items-center justify-between gap-3 font-black transition-all cursor-pointer ${
                value
                  ? 'bg-slate-900 text-amber-400 shadow-[3px_3px_0px_0px_#0f172a]'
                  : 'bg-white text-slate-900 hover:bg-amber-50 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0 stroke-[2.5]" />
                <span className="text-base sm:text-lg">{label}</span>
              </span>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 ${
                  value ? 'bg-amber-400 text-slate-950 shadow-[1px_1px_0px_0px_#ffffff]' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {value ? 'ON' : 'OFF'}
              </span>
            </button>
          ))}
        </div>

        {/* Live RapidAPI IRCTC Configuration */}
        <div className="rounded-2xl border-2 border-slate-900 bg-amber-50 p-5 space-y-3 shadow-[3px_3px_0px_0px_#0f172a]">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-950">
              Live IRCTC RapidAPI Key (Optional)
            </span>
          </div>

          <form onSubmit={handleSaveApiKey} className="space-y-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter RapidAPI Key for live queries"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 bg-white font-mono text-sm outline-none focus:ring-2 focus:ring-amber-400"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">
                {savedKey ? '✔ Custom API key saved!' : 'Leave blank to use verified zero-config mode.'}
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                Save Key
              </button>
            </div>
          </form>
        </div>
      </div>
    </Sheet>
  );
}
