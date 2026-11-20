import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

let auth = null;
try {
  const raw = import.meta.env.VITE_FIREBASE_CONFIG;
  if (raw) {
    const cfg = JSON.parse(raw);
    const app = getApps().length ? getApps()[0] : initializeApp(cfg);
    auth = getAuth(app);
  }
} catch (e) {
  console.warn('Firebase config not set, using demo OTP mode:', e);
}

export { auth };
