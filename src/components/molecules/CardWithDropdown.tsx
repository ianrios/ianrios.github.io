import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Card } from './Card';
import { Icon } from '../atoms/Icon';

interface DropdownOption {
  value: string;
  label: string;
}

const DEFAULT_OPTIONS: DropdownOption[] = [
  { value: 'monthly', label: 'Monthly report' },
  { value: 'weekly', label: 'Weekly summary' },
  { value: 'annual', label: 'Annual overview' },
];

export function CardWithDropdown({
  title = 'Report settings',
  subtitle = 'Select report type',
  options,
  cta = 'Generate',
}: {
  title?: string;
  subtitle?: string;
  options?: DropdownOption[];
  cta?: string;
}) {
  const opts = options ?? DEFAULT_OPTIONS;
  const [selected, setSelected] = useState<string | undefined>(opts[0]?.value);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card style={{ maxWidth: 280 }}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      <p
        style={{
          fontSize: 'var(--font-sm)',
          color: 'var(--color-muted)',
          margin: 'var(--space-xxs) 0 var(--space-sm)',
        }}
      >
        {subtitle}
      </p>
      <div style={{ position: 'relative', marginBottom: 'var(--space-sm)' }}>
        <Button
          variant="outline"
          onClick={() => {
            setIsOpen((o) => !o);
          }}
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{opts.find((o) => o.value === selected)?.label}</span>
          <Icon
            name="chevron"
            iconStyle={{
              transform: isOpen ? 'rotate(90deg)' : 'none',
              transition: 'transform var(--anim-speed) ease',
            }}
          />
        </Button>
        <div
          style={{
            overflow: 'hidden',
            maxHeight: isOpen ? 200 : 0,
            transition: 'max-height var(--anim-speed) ease',
            position: 'absolute',
            top: 'calc(100% + var(--space-xxs))',
            left: 0,
            right: 0,
            zIndex: 20,
          }}
        >
          <Card style={{ padding: 'var(--space-xxs)' }}>
            {opts.map((opt) => (
              <Button
                key={opt.value}
                variant={selected === opt.value ? 'primary' : 'outline'}
                onClick={() => {
                  setSelected(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  marginBottom: 'var(--space-xxs)',
                  fontSize: 'var(--font-sm)',
                }}
              >
                {opt.label}
              </Button>
            ))}
          </Card>
        </div>
      </div>
      <Button
        variant="primary"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-xxs)',
        }}
      >
        <Icon name="check" /> {cta}
      </Button>
    </Card>
  );
}
