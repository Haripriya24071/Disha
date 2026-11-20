import { useState, useCallback, useRef } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const FALLBACK_MOCKS = {
  '1111111111': {
    pnr: '1111111111',
    train: { number: '12345', name: 'Sample Express', class: '3A' },
    route: { from: 'SBC', to: 'MAS', from_name: 'Bengaluru', to_name: 'Chennai' },
    departure_iso: new Date(Date.now() + 86400000).toISOString(),
    ticket: { type: 'WL', wl_position: 8, coach: null, berth: null, raw: 'GNWL 8/WL 5' },
    platform: { current: '3', previous: null },
    delay_minutes: 0,
    train_state: 'scheduled',
    chart: { time_iso: null, source: 'estimate', prepared: false },
    last_updated_iso: new Date().toISOString(),
    data_source: 'mock',
  },
  '2222222222': {
    pnr: '2222222222',
    train: { number: '12627', name: 'Karnataka Express', class: 'SL' },
    route: { from: 'SBC', to: 'NDLS', from_name: 'Bengaluru', to_name: 'New Delhi' },
    departure_iso: new Date(Date.now() + 86400000).toISOString(),
    ticket: { type: 'RAC', wl_position: null, coach: null, berth: null, raw: 'RAC 14' },
    platform: { current: '1', previous: null },
    delay_minutes: 0,
    train_state: 'scheduled',
    chart: { time_iso: null, source: 'estimate', prepared: false },
    last_updated_iso: new Date().toISOString(),
    data_source: 'mock',
  },
  '3333333333': {
    pnr: '3333333333',
    train: { number: '12007', name: 'Shatabdi Express', class: 'CC' },
    route: { from: 'MAS', to: 'SBC', from_name: 'Chennai', to_name: 'Bengaluru' },
    departure_iso: new Date(Date.now() + 86400000).toISOString(),
    ticket: { type: 'CNF', wl_position: null, coach: 'S4', berth: '32', raw: 'CNF/S4/32/LB' },
    platform: { current: '4', previous: null },
    delay_minutes: 0,
    train_state: 'scheduled',
    chart: { time_iso: null, source: 'estimate', prepared: false },
    last_updated_iso: new Date().toISOString(),
    data_source: 'mock',
  },
  '4444444444': {
    pnr: '4444444444',
    train: { number: '16526', name: 'Island Express', class: '3A' },
    route: { from: 'SBC', to: 'CAPE', from_name: 'Bengaluru', to_name: 'Kanyakumari' },
    departure_iso: new Date(Date.now() + 86400000).toISOString(),
    ticket: { type: 'WL', wl_position: 4, coach: null, berth: null, raw: 'GNWL 4' },
    platform: { current: null, previous: null },
    delay_minutes: 0,
    train_state: 'cancelled',
    chart: { time_iso: null, source: 'estimate', prepared: false },
    last_updated_iso: new Date().toISOString(),
    data_source: 'mock',
  },
};

function readCache(pnr) {
  try {
    const cached = localStorage.getItem(`journey_${pnr}`);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function saveCache(pnr, data) {
  try {
    localStorage.setItem(`journey_${pnr}`, JSON.stringify(data));
    localStorage.setItem('last_pnr', pnr);
  } catch {
    // Storage may be unavailable.
  }
}

export function useJourney() {
  const [status, setStatus] = useState('idle');
  const [journey, setJourney] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const requestId = useRef(0);

  const fetchJourney = useCallback(async (rawPnr) => {
    const pnr = (rawPnr || '').replace(/\D/g, '');
    const currentRequest = ++requestId.current;

    if (pnr.length !== 10 || pnr === '5555555555') {
      setStatus('error');
      setErrorCode('badpnr');
      setJourney(null);
      return;
    }

    setStatus('loading');
    setErrorCode(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/journey/${encodeURIComponent(pnr)}`,
        { headers: { Accept: 'application/json' } }
      );

      if (currentRequest !== requestId.current) return;

      if (response.status === 400 || response.status === 404) {
        setJourney(null);
        setStatus('error');
        setErrorCode('badpnr');
        return;
      }

      if (!response.ok) {
        throw new Error(`Journey API returned ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.pnr || !data.train || !data.ticket) {
        throw new Error('Invalid journey response');
      }

      saveCache(pnr, data);
      setJourney(data);
      setStatus('ok');
      setErrorCode(null);
    } catch (error) {
      if (currentRequest !== requestId.current) return;

      console.warn('Journey request failed:', error);

      const cached = readCache(pnr);

      if (cached) {
        setJourney({ ...cached, data_source: 'cached' });
        setStatus('ok');
        setErrorCode(navigator.onLine ? 'nodata' : 'offline');
        return;
      }

      if (FALLBACK_MOCKS[pnr]) {
        setJourney({
          ...FALLBACK_MOCKS[pnr],
          last_updated_iso: new Date().toISOString(),
        });
        setStatus('ok');
        setErrorCode(null);
        return;
      }

      setJourney(null);
      setStatus('error');
      setErrorCode(navigator.onLine ? 'nodata' : 'offline');
    }
  }, []);

  const reset = useCallback(() => {
    requestId.current += 1;
    setStatus('idle');
    setJourney(null);
    setErrorCode(null);
  }, []);

  return {
    status,
    journey,
    setJourney,
    errorCode,
    fetchJourney,
    reset,
  };
}
