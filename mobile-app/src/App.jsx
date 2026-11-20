import React, { useState, useCallback, useEffect } from 'react';
import { LangProvider } from './i18n/useT';
import { useJourney } from './hooks/useJourney';
import { useSSE } from './hooks/useSSE';
import { applySavedA11ySettings } from './sheets/Accessibility';
import S1Login from './screens/S1Login';
import S2Journey from './screens/S2Journey';
import S3Backup from './screens/S3Backup';
import S4Alert from './screens/S4Alert';

function DishaApp() {
  const [screen, setScreen] = useState(() => {
    // If user has already visited or checked a PNR before, go straight to S2
    return localStorage.getItem('last_pnr') || localStorage.getItem('user_phone') ? 'S2' : 'S1';
  });
  const [alertEvent, setAlertEvent] = useState(null);
  const journeyState = useJourney();

  useEffect(() => {
    applySavedA11ySettings();
  }, []);

  const handleAlert = useCallback((evt) => {
    setAlertEvent(evt);
  }, []);

  const handleSilentUpdate = useCallback(
    (updatedJourney) => {
      journeyState.setJourney(updatedJourney);
    },
    [journeyState]
  );

  const { connected } = useSSE(journeyState.journey?.pnr, {
    onAlert: handleAlert,
    onSilentUpdate: handleSilentUpdate,
  });

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
    return <S1Login onContinue={() => setScreen('S2')} />;
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
      onOpenBackup={() => setScreen('S3')}
      sseConnected={connected}
    />
  );
}

export default function App() {
  return (
    <LangProvider>
      <DishaApp />
    </LangProvider>
  );
}
