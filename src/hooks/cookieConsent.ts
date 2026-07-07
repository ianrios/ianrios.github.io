import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent:v1';

type ConsentValue = 'accepted' | 'declined';

function isConsentValue(v: unknown): v is ConsentValue {
  return v === 'accepted' || v === 'declined';
}

/** Plain reader, callable outside React (analytics.ts runs from main.tsx). */
export function getCookieConsent(): ConsentValue | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isConsentValue(raw) ? raw : null;
  } catch {
    return null;
  }
}

function setCookieConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage unavailable (private mode, quota) - banner still works,
    // just re-prompts next visit
  }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentValue | null>(() =>
    getCookieConsent(),
  );

  useEffect(() => {
    if (consent !== null) setCookieConsent(consent);
  }, [consent]);

  return {
    consent,
    accept: () => {
      setConsent('accepted');
    },
    decline: () => {
      setConsent('declined');
    },
  };
}
