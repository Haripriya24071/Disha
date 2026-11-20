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
    primary: 'bg-[#0A0A0A] text-white border-2 border-[#0A0A0A] hover:bg-[#222222]',
    secondary: 'bg-[#F4F3EF] text-[#0A0A0A] border-2 border-[#0A0A0A] hover:bg-white',
    danger: 'bg-[#DC2626] text-white border-2 border-[#0A0A0A] hover:bg-[#B91C1C]',
    success: 'bg-[#15803D] text-white border-2 border-[#0A0A0A] hover:bg-[#166534]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-full min-h-[58px] px-6 py-3 rounded-full font-extrabold text-[1.05rem] tracking-tight flex items-center justify-center gap-2.5 transition active:scale-[0.98] disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
