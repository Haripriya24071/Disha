import { useEffect } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const ALERT_TYPES = new Set([
  'platform_changed',
  'delayed',
  'cancelled',
  'confirmed',
]);

export function useSSE(pnr, { onAlert, onSilentUpdate } = {}) {
  useEffect(() => {
    if (!pnr || !/^\d{10}$/.test(pnr)) return;
    if (typeof EventSource === 'undefined') return;

    let closed = false;
    const source = new EventSource(
      `${API_BASE}/api/journey/${encodeURIComponent(pnr)}/stream`
    );

    source.onmessage = (message) => {
      if (closed || !message.data) return;

      try {
        const event = JSON.parse(message.data);

        if (ALERT_TYPES.has(event.type)) {
          onAlert?.(event);
        }

        if (event.journey) {
          onSilentUpdate?.(event.journey);
        }
      } catch (error) {
        console.warn('Unable to process SSE event:', error);
      }
    };

    source.onerror = () => {
      if (!closed) {
        console.warn('SSE connection interrupted; waiting for reconnection.');
      }
    };

    return () => {
      closed = true;
      source.close();
    };
  }, [pnr, onAlert, onSilentUpdate]);
}
