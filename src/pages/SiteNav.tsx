import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { FloatingNav } from '../components/organisms/FloatingNav';
import { useNavChrome } from '../hooks/navChromeContext';
import { useDesignPanel } from '../hooks/designPanelContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SiteNavDrawer } from './SiteNavDrawer';
import type { View } from '../types/data';

// The floating "remote" is the sole page-to-page nav. `view` rides the
// router state: portfolio enters the main view, title returns to the
// MetaBalls splash. `match` drives aria-current (title is an action into
// the splash, never a highlighted location, so it has no match).
const DESTINATIONS: {
  key: string;
  label: string;
  href: string;
  view?: View;
  match: string | null;
}[] = [
  { key: 'about', label: 'about', href: '/about', match: '/about' },
  { key: 'portfolio', label: 'portfolio', href: '/', view: 'main', match: '/' },
  { key: 'contact', label: 'contact', href: '/contact', match: '/contact' },
  {
    key: 'design',
    label: 'design system',
    href: '/design-system',
    match: '/design-system',
  },
  { key: 'title', label: 'title', href: '/', view: 'welcome', match: null },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const { setOpen } = useDesignPanel();
  // Arriving at the design system opens its controls by default.
  const handleClick = (key: string) => {
    if (key === 'design') setOpen(true);
    onNavigate?.();
  };
  return (
    <>
      {DESTINATIONS.map((d) => (
        <Button
          key={d.key}
          as="link"
          href={d.href}
          variant="chisel"
          fullWidth
          justify="start"
          {...(d.view ? { routerState: { view: d.view } } : {})}
          {...(d.match !== null && pathname === d.match
            ? { 'aria-current': 'page' as const }
            : {})}
          onClick={() => {
            handleClick(d.key);
          }}
        >
          {d.label}
        </Button>
      ))}
    </>
  );
}

export function SiteNav() {
  const { hidden } = useNavChrome();
  const onMobile = useMediaQuery('(max-width: 991px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  if (hidden) return null;

  if (onMobile) {
    return (
      <>
        <button
          className="skeu-hamburger"
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          onClick={() => {
            setDrawerOpen(true);
          }}
        >
          <Icon name="menu" size={24} />
        </button>
        <SiteNavDrawer open={drawerOpen} onClose={closeDrawer}>
          <NavContent onNavigate={closeDrawer} />
        </SiteNavDrawer>
      </>
    );
  }

  return (
    <FloatingNav>
      <NavContent />
    </FloatingNav>
  );
}
