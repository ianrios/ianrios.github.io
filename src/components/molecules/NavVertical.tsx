import { useState } from 'react';
import { Button } from '../atoms/Button';

export function NavVertical({
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

  const isLinks = variant === 'links';

  return (
    <div
      className="skeu-card"
      style={{ width: 160, padding: 'var(--space-sm)' }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 13,
          color: 'var(--color-text)',
          padding: 'var(--space-xxs) var(--space-xs)',
          marginBottom: 'var(--space-xs)',
        }}
      >
        {siteName}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xxs)',
        }}
      >
        {pages.map((page) =>
          isLinks ? (
            <button
              key={page}
              className={`skeu-nav-link-btn${active === page ? ' active' : ''}`}
              onClick={() => {
                handleClick(page);
              }}
              style={{ textTransform: 'capitalize' }}
            >
              {active === page ? '› ' : ''}
              {page}
            </button>
          ) : (
            <Button
              key={page}
              variant={active === page ? 'primary' : 'outline'}
              onClick={() => {
                handleClick(page);
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                textTransform: 'capitalize',
                fontSize: 13,
              }}
            >
              {page}
            </Button>
          ),
        )}
        {ctaLabel && (
          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              marginTop: 'var(--space-xxs)',
              paddingTop: 'var(--space-xxs)',
            }}
          >
            {isLinks ? (
              <button className="skeu-nav-link-btn" style={{ fontSize: 13 }}>
                {ctaLabel}
              </button>
            ) : (
              <Button
                variant="outline"
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: 13,
                }}
              >
                {ctaLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
