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

  const handleSilentUpdate = useCallback(
    (updatedJourney) => {
      journeyState.setJourney(updatedJourney);
    },
    [journeyState]
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

  const triggerDemoPlatformChange = () => {
    if (!journeyState.journey) return;
    const prevPlat = journeyState.journey.platform?.current || '3';
    const nextPlat = prevPlat === '6' ? '3' : '6';
    const updated = {
      ...journeyState.journey,
      platform: { current: nextPlat, previous: prevPlat },
      last_updated_iso: new Date().toISOString(),
    };
    journeyState.setJourney(updated);
    setAlertEvent({
      pnr: updated.pnr,
      type: 'platform_changed',
      data: { from: prevPlat, to: nextPlat },
      timestamp_iso: new Date().toISOString(),
      journey: updated,
    });
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
