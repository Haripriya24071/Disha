import React from 'react';

export function Term({ id, children, onOpenTerm }) {
  return (
    <button
      type="button"
      onClick={() => onOpenTerm(id)}
      className="inline-flex items-center gap-1 underline decoration-dotted decoration-2 underline-offset-4 font-bold text-blue-800 px-1.5 py-1 min-h-[48px] rounded hover:bg-blue-100"
      aria-label={`${children} — tap for meaning`}
    >
      <span>{children}</span>
      <span className="text-xs border border-current rounded-full w-5 h-5 inline-flex items-center justify-center">
        ?
      </span>
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
