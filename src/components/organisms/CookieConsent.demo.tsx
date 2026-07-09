import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Stack } from '../atoms/Stack';
import { CookieConsent } from './CookieConsent';

export function CookieConsentDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <Stack direction="col" gap="sm">
      <Button
        variant="outline"
        onClick={() => {
          setVisible(true);
        }}
      >
        Show cookie consent banner
      </Button>
      <CookieConsent
        visible={visible}
        onAccept={() => {
          setVisible(false);
        }}
        onDecline={() => {
          setVisible(false);
        }}
      />
    </Stack>
  );
}
