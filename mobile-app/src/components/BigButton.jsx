import React from 'react';

export default function BigButton({
  icon: Icon,
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  ariaLabel,
}) {
  const variants = {
    primary: 'bg-[#0A1E3F] text-white hover:bg-[#163668] active:bg-[#07152D] shadow-sm border border-[#0A1E3F]',
    secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 shadow-xs',
    accent: 'bg-amber-400 text-slate-950 font-black border border-amber-500 hover:bg-amber-300 active:bg-amber-500 shadow-sm',
    danger: 'bg-red-700 text-white border border-red-800 hover:bg-red-800 active:bg-red-900 shadow-sm',
    success: 'bg-emerald-700 text-white border border-emerald-800 hover:bg-emerald-800 active:bg-emerald-900 shadow-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-full min-h-[56px] px-5 py-3.5 rounded-2xl font-black text-base sm:text-[1.05rem] tracking-tight flex items-center justify-center gap-2.5 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer ${variants[variant] || variants.primary} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0 stroke-[2.2]" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
