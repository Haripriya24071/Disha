import React, { useState, useCallback } from 'react';
import { LangProvider } from './i18n/useT';
import { useJourney } from './hooks/useJourney';
import { useSSE } from './hooks/useSSE';
import S1Login from './screens/S1Login';
import S2Journey from './screens/S2Journey';
import S3Backup from './screens/S3Backup';
import S4Alert from './screens/S4Alert';

function ClearTrackApp() {
  const [user, setUser] = useState(() => {
    const mode = localStorage.getItem('auth_mode');
    const phone = localStorage.getItem('user_phone');
    if (mode === 'logged_in' && phone) return { phone, guest: false };
    if (mode === 'guest') return { phone: null, guest: true };
    return null;
  });
  const [screen, setScreen] = useState(() => (localStorage.getItem('auth_mode') ? 'S2' : 'S1'));
  const [alertEvent, setAlertEvent] = useState(null);
  const journeyState = useJourney();

  const handleAlert = useCallback((evt) => {
    setAlertEvent(evt);
  }, []);

  const setJourney = journeyState.setJourney;

  const handleSilentUpdate = useCallback(
    (updatedJourney) => {
      setJourney(updatedJourney);
    },
    [setJourney]
  );

  useSSE(journeyState.journey?.pnr, {
    onAlert: handleAlert,
    onSilentUpdate: handleSilentUpdate,
  });

  const handleLoginComplete = (sessionUser) => {
    setUser(sessionUser);
    setScreen('S2');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_mode');
    localStorage.removeItem('user_phone');
    setUser(null);
    journeyState.reset();
    setScreen('S1');
  };

  const triggerDemoPlatformChange = async () => {
    const pnr = journeyState.journey?.pnr;
    if (!pnr) return;

    try {
      const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

      const response = await fetch(`${apiBase}/api/demo/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          pnr,
          event: 'platform_changed',
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || `Demo trigger failed: ${response.status}`);
      }

      console.info('Demo event triggered:', result);
    } catch (error) {
      console.error('Unable to trigger demo platform change:', error);
    }
  };

  if (alertEvent) {
    return (
      <S4Alert
        event={alertEvent}
        onDismiss={() => setAlertEvent(null)}
        onOpenBackup={() => {
          setAlertEvent(null);
          setScreen('S3');
        }}
      />
    );
  }

  if (screen === 'S1') {
    return <S1Login onContinue={handleLoginComplete} />;
  }

  if (screen === 'S3') {
    return (
      <S3Backup
        journey={journeyState.journey}
        onBack={() => setScreen('S2')}
      />
    );
  }

  return (
    <S2Journey
      journeyState={journeyState}
      user={user}
      onLogout={handleLogout}
      onOpenBackup={() => setScreen('S3')}
      onTriggerDemoAlert={triggerDemoPlatformChange}
    />
  );
}

export default function App() {
  return (
    <LangProvider>
      <ClearTrackApp />
    </LangProvider>
  );
}
