import { useState } from 'react';
import type React from 'react';
import { Button } from '../atoms/Button';
import type { NavSection } from '../../types/admin';

const LINK_BTN: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--color-text)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  textAlign: 'left',
  padding: 'var(--space-xxs) var(--space-xs)',
  borderRadius: 'var(--radius-sm)',
  transition: 'background var(--anim-speed) ease',
  width: '100%',
  display: 'block',
};

export function NavVerticalSections({
  sections,
  defaultOpen,
  defaultActive,
  variant = 'buttons',
}: {
  sections: NavSection[];
  defaultOpen?: string;
  defaultActive?: string;
  variant?: 'buttons' | 'links';
}) {
  const [active, setActive] = useState<string | undefined>(
    defaultActive ?? sections[0]?.items[0]?.id,
  );
  const [openSection, setOpenSection] = useState<string | null>(
    defaultOpen ?? sections[0]?.id ?? null,
  );

  const isLinks = variant === 'links';

  return (
    <div
      className="skeu-card"
      style={{ width: 'var(--sidebar-width)', padding: 'var(--space-xs)' }}
    >
      {sections.map((section) => {
        const isOpen = openSection === section.id;
        return (
          <div key={section.id} style={{ marginBottom: 'var(--space-xxs)' }}>
            {isLinks ? (
              <button
                onClick={() => {
                  setOpenSection(isOpen ? null : section.id);
                }}
                style={{
                  ...LINK_BTN,
                  fontWeight: 700,
                  fontSize: 'var(--font-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--color-accent)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'none')
                }
              >
                <span>{section.label}</span>
                <span
                  style={{
                    fontSize: 'var(--font-xs)',
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform var(--anim-speed) ease',
                    display: 'inline-block',
                    opacity: 0.5,
                  }}
                >
                  ›
                </span>
              </button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setOpenSection(isOpen ? null : section.id);
                }}
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                }}
              >
                <span>{section.label}</span>
                <span
                  style={{
                    fontSize: 'var(--font-xs)',
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform var(--anim-speed) ease',
                    display: 'inline-block',
                  }}
                >
                  ›
                </span>
              </Button>
            )}

            <div
              style={{
                overflow: 'hidden',
                maxHeight: isOpen ? 400 : 0,
                transition: 'max-height var(--anim-speed) ease',
                paddingLeft: 'var(--space-sm)',
              }}
            >
              {section.items.map((item) =>
                isLinks ? (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActive(item.id);
                    }}
                    style={{
                      ...LINK_BTN,
                      marginTop: 'var(--space-xxs)',
                      fontSize: 'var(--font-xs)',
                      fontWeight: active === item.id ? 700 : 400,
                      color:
                        active === item.id
                          ? 'var(--color-text)'
                          : 'var(--color-muted)',
                      background:
                        active === item.id ? 'var(--color-accent)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (active !== item.id)
                        e.currentTarget.style.background =
                          'var(--color-accent)';
                    }}
                    onMouseLeave={(e) => {
                      if (active !== item.id)
                        e.currentTarget.style.background = 'none';
                    }}
                  >
                    {active === item.id ? '› ' : ''}
                    {item.label}
                  </button>
                ) : (
                  <Button
                    key={item.id}
                    variant={active === item.id ? 'primary' : 'outline'}
                    onClick={() => {
                      setActive(item.id);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      marginTop: 'var(--space-xxs)',
                      fontSize: 'var(--font-xs)',
                    }}
                  >
                    {item.label}
                  </Button>
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
