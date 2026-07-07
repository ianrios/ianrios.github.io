import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { ContactModal } from '../components/organisms/ContactModal';
import { FloatingNav } from '../components/organisms/FloatingNav';
import { externalLinks } from '../data';
import { useNavChrome } from '../hooks/navChromeContext';

// The home link carries {view: 'main'} so returning home skips the splash.
const DESTINATIONS = [
  { label: 'home', href: '/' },
  { label: 'about', href: '/about' },
  { label: 'design system', href: '/design-system' },
  { label: 'metaballs', href: '/metaballs' },
];

export function SiteNav() {
  const { hidden } = useNavChrome();
  const { pathname } = useLocation();
  const [linksOpen, setLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  if (hidden) return null;

  return (
    <>
      <FloatingNav>
        {DESTINATIONS.map((d) => (
          <Button
            key={d.href}
            as="link"
            href={d.href}
            variant="outline"
            fullWidth
            justify="start"
            {...(d.href === '/' ? { routerState: { view: 'main' } } : {})}
            {...(pathname === d.href
              ? { 'aria-current': 'page' as const }
              : {})}
          >
            {d.label}
          </Button>
        ))}
        <Button
          variant="outline"
          fullWidth
          justify="between"
          aria-expanded={linksOpen}
          onClick={() => {
            setLinksOpen(!linksOpen);
          }}
        >
          external{' '}
          <Icon name={linksOpen ? 'chevron-down' : 'chevron-up'} size={13} />
        </Button>
        {linksOpen && (
          <ul className="skeu-floating-nav__links">
            {externalLinks.map((link) => (
              <li key={link.href}>
                <a rel="noreferrer" target="_blank" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        <Button
          variant="outline"
          fullWidth
          justify="between"
          onClick={() => {
            setContactOpen(true);
          }}
        >
          contact <Icon name="send" size={13} />
        </Button>
      </FloatingNav>
      <ContactModal
        show={contactOpen}
        onHide={() => {
          setContactOpen(false);
        }}
      />
    </>
  );
}
