import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { applySavedA11ySettings } from './sheets/Accessibility';

applySavedA11ySettings();

// Force service worker to check for updates on reload
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const r of registrations) {
      r.update();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
