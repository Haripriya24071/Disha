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
    primary: 'bg-[#1A1A2E] text-white hover:bg-[#2a2a48]',
    secondary: 'bg-white text-[#1A1A2E] border-2 border-[#1A1A2E] hover:bg-slate-100',
    danger: 'bg-[#B91C1C] text-white hover:bg-[#991B1B]',
    success: 'bg-[#15803D] text-white hover:bg-[#166534]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-full min-h-[56px] px-5 py-3 rounded-xl font-bold text-[1.1rem] flex items-center justify-center gap-3 transition active:scale-[0.99] disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-6 h-6 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
