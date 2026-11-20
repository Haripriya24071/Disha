import { useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const ALERT_TYPES = new Set(['platform_changed', 'delayed', 'cancelled', 'confirmed']);

export function useSSE(pnr, { onAlert, onSilentUpdate }) {
  useEffect(() => {
    if (!pnr || !API_BASE) return;
    let source;
    let closed = false;

    const connect = () => {
      if (closed) return;
      source = new EventSource(`${API_BASE}/api/journey/${pnr}/stream`);

      source.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (ALERT_TYPES.has(event.type)) {
            onAlert?.(event);
          }
          if (event.journey) {
            onSilentUpdate?.(event.journey);
          }
        } catch {
          // ignore keep-alive comments
        }
      };

      source.onerror = () => {
        source.close();
        if (!closed) setTimeout(connect, 5000);
      };
    };

    connect();
    return () => {
      closed = true;
      source?.close();
    };
  }, [pnr, onAlert, onSilentUpdate]);
}
