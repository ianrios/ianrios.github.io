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
      className={['skeu-expandable-card', open ? 'is-open' : '']
        .filter(Boolean)
        .join(' ')}
      role="button"
      tabIndex={0}
      onClick={() => {
        setOpen((o) => !o);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o);
      }}
    >
      <div className="skeu-expandable-card__header">
        <div>
          <div className="skeu-expandable-card__title">{title}</div>
          <div className="skeu-expandable-card__meta">
            {company} · {period}
          </div>
        </div>
        <span className="skeu-expandable-card__caret">▾</span>
      </div>
      <div
        className={['skeu-expandable-card__body', open ? 'is-open' : '']
          .filter(Boolean)
          .join(' ')}
      >
        <div className="skeu-expandable-card__divider">
          <div className="skeu-expandable-card__tags">
            {tech.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          {bullets.map((b, i) => (
            <div key={i} className="skeu-expandable-card__bullet">
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
