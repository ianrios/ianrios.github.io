// Firebase Analytics only — hosting itself needs no SDK. Loaded lazily after
// hydration (dynamic imports land in their own chunk) so it never competes
// with first paint. The config is public by design; Firebase security comes
// from project rules, not from hiding these values. Gated on cookie
// consent — see src/hooks/cookieConsent.ts.
import { getCookieConsent } from './hooks/cookieConsent';

const firebaseConfig = {
  apiKey: 'AIzaSyD2ofxnZkHr8ssbnZsWQKdD1QKnLpjlLV4',
  authDomain: 'ian-rios-portfolio.firebaseapp.com',
  databaseURL: 'https://ian-rios-portfolio.firebaseio.com',
  projectId: 'ian-rios-portfolio',
  storageBucket: 'ian-rios-portfolio.appspot.com',
  messagingSenderId: '519475978364',
  appId: '1:519475978364:web:adcaaa7587d4231d0869f9',
  measurementId: 'G-9XXHJYB42F',
};

// main.tsx calls this unconditionally on boot (handles "already consented
// last visit"); CookieConsent also calls it right after Accept (handles
// "just consented this session"). Guard so a rapid double-call - e.g. both
// paths firing close together - never calls Firebase's initializeApp twice.
let started = false;

export function initAnalytics(): void {
  if (started || getCookieConsent() !== 'accepted') return;
  started = true;
  void (async () => {
    try {
      const { initializeApp } = await import('firebase/app');
      const { getAnalytics, isSupported } = await import('firebase/analytics');
      if (!(await isSupported())) return;
      getAnalytics(initializeApp(firebaseConfig));
    } catch {
      // best-effort: ad blockers / unsupported environments are fine
    }
  })();
}
