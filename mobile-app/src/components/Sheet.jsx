import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
    >
      <div
        className="card-surface w-full max-w-md bg-[#F4F3EF] text-[#0A0A0A] border-t-2 border-x-2 border-[#0A0A0A] rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-[#0A0A0A]/25 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-[#0A0A0A]/15">
          <h2
            id="sheet-title"
            className="text-[1.45rem] font-extrabold tracking-[-0.02em]"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#0A0A0A] bg-white hover:bg-[#FFD600] transition"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="pt-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
