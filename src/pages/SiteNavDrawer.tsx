import { useEffect, useRef } from 'react';
import type React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Heading } from '../components/atoms/Heading';
import { Stack } from '../components/atoms/Stack';

// Mobile shell for the site nav: overlay + right-side panel. Closes on
// overlay tap, Escape, and route change (backstop for the onNavigate
// callback, since RouteTransitions owns the actual navigation).
export function SiteNavDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Close only when the route has actually changed, not merely because
    // this effect re-ran (e.g. onClose getting a new identity on parent
    // render). Comparing against a ref decouples the close-decision from
    // onClose's identity entirely.
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="skeu-mobile-drawer">
      <div
        role="presentation"
        className="skeu-mobile-drawer__overlay"
        onClick={onClose}
      />
      <div className="skeu-mobile-drawer__panel">
        <Stack direction="row" justify="between" align="center" gap="sm">
          <Heading level={2} className="skeu-mobile-drawer__brand">
            Ian Rios
          </Heading>
          <Button
            icon="close"
            aria-label="Close navigation"
            onClick={onClose}
          />
        </Stack>
        <Stack direction="col" gap="xxs">
          {children}
        </Stack>
      </div>
    </div>
  );
}
