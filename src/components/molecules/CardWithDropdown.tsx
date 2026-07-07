import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Card } from './Card';
import { Icon } from '../atoms/Icon';
import type { DropdownOption } from '../../types/admin';

export function CardWithDropdown({
  title,
  subtitle,
  options,
  cta,
}: {
  title: string;
  subtitle: string;
  options: DropdownOption[];
  cta: string;
}) {
  const opts = options;
  const [selected, setSelected] = useState<string | undefined>(opts[0]?.value);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card maxWidth={280}>
      <h4 className="skeu-card-dropdown__title">{title}</h4>
      <p className="skeu-card-dropdown__subtitle">{subtitle}</p>
      <div
        className={['skeu-card-dropdown__trigger', isOpen ? 'is-open' : '']
          .filter(Boolean)
          .join(' ')}
      >
        <Button
          variant="outline"
          fullWidth
          justify="between"
          onClick={() => {
            setIsOpen((o) => !o);
          }}
        >
          <span>{opts.find((o) => o.value === selected)?.label}</span>
          <Icon name="chevron-down" size={14} />
        </Button>
        <div className="skeu-card-dropdown__list">
          <Card padding="xxs">
            {opts.map((opt) => (
              <div key={opt.value} className="skeu-card-dropdown__opt">
                <Button
                  variant={selected === opt.value ? 'solid' : 'outline'}
                  fullWidth
                  onClick={() => {
                    setSelected(opt.value);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                </Button>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <Button variant="solid" fullWidth justify="center">
        <Icon name="check" /> {cta}
      </Button>
    </Card>
  );
}
