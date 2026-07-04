import { useState } from 'react';
import { Button } from '../atoms/Button';

export function NavBar({
  pages = ['home', 'work', 'about'],
  ctaLabel = 'Sign In',
  siteName = 'MySite',
  variant = 'buttons',
  active: controlledActive,
  onNavigate,
}: {
  pages?: string[];
  ctaLabel?: string;
  siteName?: string;
  variant?: 'buttons' | 'links';
  active?: string;
  onNavigate?: (page: string) => void;
}) {
  const [localActive, setLocalActive] = useState<string | undefined>(
    controlledActive ?? pages[0],
  );
  const active = controlledActive ?? localActive;

  const handleClick = (page: string) => {
    setLocalActive(page);
    onNavigate?.(page);
  };

  return (
    <div className="skeu-nav">
      <div className="skeu-nav__title">{siteName}</div>
      <div className="skeu-nav__links">
        {pages.map((page) =>
          variant === 'links' ? (
            <a key={page} href="#demo" className="skeu-link">
              {page}
            </a>
          ) : (
            <Button
              key={page}
              variant={active === page ? 'solid' : 'outline'}
              onClick={() => {
                handleClick(page);
              }}
            >
              {page[0]?.toUpperCase()}
              {page.slice(1)}
            </Button>
          ),
        )}
        {ctaLabel && <Button variant="outline">{ctaLabel}</Button>}
      </div>
    </div>
  );
}
