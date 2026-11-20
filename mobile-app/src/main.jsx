import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { applySavedA11ySettings } from './sheets/Accessibility';

applySavedA11ySettings();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
