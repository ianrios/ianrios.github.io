import { useState } from 'react';
import { Badge } from '../atoms/Badge';

export function ExpandableCard({
  title,
  company,
  period,
  tech = [],
  bullets = [],
}: {
  title?: string;
  company?: string;
  period?: string;
  tech?: string[];
  bullets?: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="skeu-card"
      role="button"
      tabIndex={0}
      style={{
        cursor: 'pointer',
        marginBottom: 'var(--space-sm)',
        userSelect: 'none',
      }}
      onClick={() => {
        setOpen((o) => !o);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o);
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 700,
              color: 'var(--color-text)',
              fontSize: 15,
            }}
          >
            {title}
          </div>
          <div
            style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}
          >
            {company} · {period}
          </div>
        </div>
        <span
          style={{
            fontSize: 16,
            color: 'var(--color-muted)',
            flexShrink: 0,
            display: 'inline-block',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--anim-speed, 0.12s) ease',
          }}
        >
          ▾
        </span>
      </div>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 400 : 0,
          opacity: open ? 1 : 0,
          transition:
            'max-height var(--anim-speed, 0.12s) ease, opacity var(--anim-speed, 0.12s) ease',
        }}
      >
        <div
          style={{
            marginTop: 'var(--space-sm)',
            borderTop: '1px solid rgba(128,128,128,0.12)',
            paddingTop: 'var(--space-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-xxs)',
              flexWrap: 'wrap',
              marginBottom: 'var(--space-xs)',
            }}
          >
            {tech.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          {bullets.map((b, i) => (
            <div
              key={i}
              style={{
                fontSize: 12,
                color: 'var(--color-text)',
                opacity: 0.8,
                paddingLeft: 'var(--space-sm)',
                marginBottom: 'var(--space-xxs)',
                borderLeft: '2px solid var(--color-accent)',
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
