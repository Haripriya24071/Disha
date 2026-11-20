import React from 'react';

export function Term({ id, children, onOpenTerm }) {
  return (
    <button
      type="button"
      onClick={() => onOpenTerm(id)}
      className="inline underline decoration-solid decoration-2 underline-offset-4 font-extrabold text-[#0A0A0A] hover:opacity-75 px-0.5 min-h-[44px]"
      aria-label={`${children} — tap for meaning`}
    >
      {children}
    </button>
  );
}

export function renderRich(text, onOpenTerm) {
  if (!text) return null;
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[\[([^:]+):([^\]]+)\]\]$/);
    if (match) {
      const [, id, label] = match;
      return (
        <Term key={i} id={id.trim()} onOpenTerm={onOpenTerm}>
          {label}
        </Term>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function stripRich(text) {
  if (!text) return '';
  return text.replace(/\[\[[^:]+:([^\]]+)\]\]/g, '$1');
}
