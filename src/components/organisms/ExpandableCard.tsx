import { useId, useState } from 'react';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

export function ExpandableCard({
  title,
  company,
  period,
  tech = [],
  bullets = [],
  companyUrl,
}: {
  title?: string;
  company?: string;
  period?: string;
  tech?: string[];
  bullets?: string[];
  companyUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const expandable =
    tech.length > 0 || bullets.length > 0 || companyUrl !== undefined;

  const heading = (
    <div>
      <div className="skeu-expandable-card__title">{title}</div>
      <div className="skeu-expandable-card__meta">
        {company} · {period}
      </div>
    </div>
  );

  // Nothing to disclose (e.g. a stub entry): inert header, no caret, no aria.
  if (!expandable) {
    return (
      <div className="skeu-expandable-card">
        <div className="skeu-expandable-card__header skeu-expandable-card__header--static">
          {heading}
        </div>
      </div>
    );
  }

  return (
    <div
      className={['skeu-expandable-card', open ? 'is-open' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <button
        className="skeu-expandable-card__header"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => {
          setOpen((o) => !o);
        }}
      >
        {heading}
        <span className="skeu-expandable-card__caret">▾</span>
      </button>
      <div
        id={bodyId}
        className={['skeu-expandable-card__body', open ? 'is-open' : '']
          .filter(Boolean)
          .join(' ')}
      >
        <div className="skeu-expandable-card__divider">
          {tech.length > 0 && (
            <div className="skeu-expandable-card__tags">
              {tech.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          )}
          {bullets.map((b, i) => (
            <div key={i} className="skeu-expandable-card__bullet">
              {b}
            </div>
          ))}
          {companyUrl !== undefined && (
            <div className="skeu-expandable-card__company">
              <Button
                as="link"
                href={companyUrl}
                external
                size="xs"
                variant="surface"
              >
                company site
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
