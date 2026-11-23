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
    primary:
      'bg-slate-900 text-white hover:bg-slate-800 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    secondary:
      'bg-white text-slate-900 hover:bg-slate-50 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    accent:
      'bg-amber-400 text-slate-950 hover:bg-amber-300 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    danger:
      'bg-red-500 text-white hover:bg-red-600 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    success:
      'bg-emerald-500 text-slate-950 hover:bg-emerald-400 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-full min-h-[56px] px-5 py-3.5 rounded-2xl font-black text-base sm:text-[1.05rem] tracking-tight flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant] || variants.primary} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0 stroke-[2.5]" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
