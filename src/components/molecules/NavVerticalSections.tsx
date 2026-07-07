import { useState } from 'react';
import { Button } from '../atoms/Button';
import { useDisclosureGroup } from '../../hooks/useDisclosure';
import type { NavSection } from '../../types/admin';

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
  const first = defaultOpen ?? sections[0]?.id;
  const { isOpen, toggle } = useDisclosureGroup({
    defaultOpen: first !== undefined ? [first] : [],
  });

  const isLinks = variant === 'links';

  return (
    <div className="skeu-nav-sections">
      {sections.map((section) => {
        const open = isOpen(section.id);
        return (
          <div
            key={section.id}
            className={['skeu-nav-sections__section', open ? 'is-open' : '']
              .filter(Boolean)
              .join(' ')}
          >
            {isLinks ? (
              <button
                className="skeu-nav-sections__section-btn"
                aria-expanded={open}
                onClick={() => {
                  toggle(section.id);
                }}
              >
                <span>{section.label}</span>
                <span className="skeu-nav-sections__caret">›</span>
              </button>
            ) : (
              <Button
                variant="outline"
                fullWidth
                justify="between"
                aria-expanded={open}
                onClick={() => {
                  toggle(section.id);
                }}
              >
                <span>{section.label}</span>
                <span className="skeu-nav-sections__caret">›</span>
              </Button>
            )}

            <div className="skeu-nav-sections__body">
              {section.items.map((item) =>
                isLinks ? (
                  <button
                    key={item.id}
                    className={[
                      'skeu-nav-sections__item-btn',
                      active === item.id ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      setActive(item.id);
                    }}
                  >
                    {active === item.id ? '› ' : ''}
                    {item.label}
                  </button>
                ) : (
                  <div key={item.id} className="skeu-nav-sections__item">
                    <Button
                      variant={active === item.id ? 'solid' : 'outline'}
                      fullWidth
                      onClick={() => {
                        setActive(item.id);
                      }}
                    >
                      {item.label}
                    </Button>
                  </div>
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
