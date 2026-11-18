import React, { useState, useCallback } from 'react';
import { LangProvider } from './i18n/useT';
import { useJourney } from './hooks/useJourney';
import { useSSE } from './hooks/useSSE';
import S1Login from './screens/S1Login';
import S2Journey from './screens/S2Journey';
import S3Backup from './screens/S3Backup';
import S4Alert from './screens/S4Alert';

function ClearTrackApp() {
  const [screen, setScreen] = useState('S1');
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
