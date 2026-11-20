import { useEffect, useState } from 'react';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '';
const ALERT_TYPES = new Set(['platform_changed', 'delayed', 'cancelled', 'confirmed']);

export function useSSE(pnr, { onAlert, onSilentUpdate } = {}) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!pnr) {
      setConnected(false);
      return;
    }

    let source;
    let closed = false;

    const connect = () => {
      if (closed) return;
      const url = API_BASE ? `${API_BASE}/api/journey/${pnr}/stream` : `/api/journey/${pnr}/stream`;
      
      try {
        source = new EventSource(url);

        source.onopen = () => {
          setConnected(true);
        };

        source.onmessage = (e) => {
          try {
            if (!e.data || e.data.startsWith(':')) return;
            const event = JSON.parse(e.data);
            if (ALERT_TYPES.has(event.type)) {
              onAlert?.(event);
            }
            if (event.journey) {
              onSilentUpdate?.(event.journey);
            }
          } catch (err) {
            // Ignore non-json comments
          }
        };

        source.onerror = () => {
          setConnected(false);
          source?.close();
          if (!closed) {
            setTimeout(connect, 4000);
          }
        };
      } catch (e) {
        setConnected(false);
      }
    };

    connect();

    return () => {
      closed = true;
      setConnected(false);
      source?.close();
    };
  }, [pnr, onAlert, onSilentUpdate]);

  return { connected };
}
