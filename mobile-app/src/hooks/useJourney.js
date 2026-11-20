import { useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

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
    chart: { time_iso: new Date(Date.now() + 86400000 - 14400000).toISOString(), source: 'estimate', prepared: false },
    last_updated_iso: new Date().toISOString(),
    data_source: 'mock',
  },
  '2222222222': {
    pnr: '2222222222',
    train: { number: '12627', name: 'Karnataka Express', class: 'SL' },
    route: { from: 'SBC', to: 'NDLS', from_name: 'Bengaluru', to_name: 'New Delhi' },
    departure_iso: new Date(Date.now() + 86400000).toISOString(),
    ticket: { type: 'RAC', wl_position: null, coach: 'S4', berth: 'RAC 14', raw: 'RAC 14' },
    platform: { current: '1', previous: null },
    delay_minutes: 0,
    train_state: 'scheduled',
    chart: { time_iso: new Date(Date.now() + 86400000 - 14400000).toISOString(), source: 'estimate', prepared: false },
    last_updated_iso: new Date().toISOString(),
    data_source: 'mock',
  },
  '3333333333': {
    pnr: '3333333333',
    train: { number: '12007', name: 'Shatabdi Express', class: 'CC' },
    route: { from: 'MAS', to: 'SBC', from_name: 'Chennai', to_name: 'Bengaluru' },
    departure_iso: new Date(Date.now() + 86400000).toISOString(),
    ticket: { type: 'CNF', wl_position: null, coach: 'B2', berth: '32', raw: 'CNF/B2/32/LB' },
    platform: { current: '4', previous: null },
    delay_minutes: 0,
    train_state: 'scheduled',
    chart: { time_iso: new Date(Date.now() + 86400000 - 14400000).toISOString(), source: 'estimate', prepared: false },
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
    chart: { time_iso: new Date(Date.now() + 86400000 - 14400000).toISOString(), source: 'estimate', prepared: false },
    last_updated_iso: new Date().toISOString(),
    data_source: 'mock',
  },
};

export function useJourney() {
  const [status, setStatus] = useState('idle');
  const [journey, setJourney] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  const fetchJourney = useCallback(async (rawPnr) => {
    const pnr = (rawPnr || '').replace(/\D/g, '');
    if (pnr.length !== 10 || pnr === '5555555555') {
      setStatus('error');
      setErrorCode('badpnr');
      return;
    }

    setStatus('loading');
    setErrorCode(null);

    const customKey = localStorage.getItem('rapidapi_key') || '';
    const headers = {};
    if (customKey) {
      headers['x-rapidapi-key'] = customKey;
    }

    try {
      const endpoint = API_BASE ? `${API_BASE}/api/journey/${pnr}` : `/api/journey/${pnr}`;
      const res = await fetch(endpoint, { headers });

      if (res.status === 400 || res.status === 404) {
        setStatus('error');
        setErrorCode('badpnr');
        return;
      }

      if (!res.ok) throw new Error('API failure');

      const data = await res.json();
      localStorage.setItem(`journey_${pnr}`, JSON.stringify(data));
      localStorage.setItem('last_pnr', pnr);
      setJourney(data);
      setStatus('ok');
    } catch {
      // Offline or network error fallback
      if (FALLBACK_MOCKS[pnr]) {
        const mockData = { ...FALLBACK_MOCKS[pnr], last_updated_iso: new Date().toISOString() };
        localStorage.setItem(`journey_${pnr}`, JSON.stringify(mockData));
        localStorage.setItem('last_pnr', pnr);
        setJourney(mockData);
        setStatus('ok');
        return;
      }
      const cached = localStorage.getItem(`journey_${pnr}`);
      if (cached) {
        setJourney({ ...JSON.parse(cached), data_source: 'cached' });
        setStatus('ok');
        setErrorCode(navigator.onLine ? 'nodata' : 'offline');
      } else {
        setStatus('error');
        setErrorCode(navigator.onLine ? 'nodata' : 'offline');
      }
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setJourney(null);
    setErrorCode(null);
  }, []);

  return { status, journey, setJourney, errorCode, fetchJourney, reset };
}
