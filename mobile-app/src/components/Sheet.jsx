import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Sheet({ open, onClose, title, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
    >
      <div
        className="w-full max-w-xl bg-white text-slate-900 border-3 border-slate-900 rounded-3xl p-6 sm:p-7 max-h-[88vh] overflow-y-auto shadow-[8px_8px_0px_0px_#0f172a] space-y-4 my-auto relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-slate-900">
          <h2 id="sheet-title" className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
        <div className="pt-1">{children}</div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
