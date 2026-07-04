import { useState } from 'react';
import type { AccordionItem } from '../../types/admin';

export function Accordion({
  items,
  inline = false,
}: {
  items: AccordionItem[];
  inline?: boolean;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div
      className={['skeu-accordion', inline ? 'skeu-accordion--inline' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => (
        <div key={item.id} className="skeu-accordion__item">
          <button
            onClick={() => {
              setOpen(open === item.id ? null : item.id);
            }}
            className={['skeu-accordion-btn', open === item.id ? 'is-open' : '']
              .filter(Boolean)
              .join(' ')}
          >
            <span>{item.title}</span>
            <span className="skeu-accordion__caret">›</span>
          </button>
          <div
            className={[
              'skeu-accordion__body',
              open === item.id ? 'is-open' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="skeu-accordion__content">{item.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
