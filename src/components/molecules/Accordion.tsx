import { useId } from 'react';
import { useDisclosureGroup } from '../../hooks/useDisclosure';
import type { AccordionItem } from '../../types/admin';

export function Accordion({
  items,
  inline = false,
  autoClose = true,
  defaultOpen = [],
}: {
  items: AccordionItem[];
  inline?: boolean;
  /** Close the open section when another opens (classic accordion). */
  autoClose?: boolean;
  /** Item ids that start open. */
  defaultOpen?: string[];
}) {
  const { isOpen, toggle } = useDisclosureGroup({ autoClose, defaultOpen });
  const uid = useId();

  return (
    <div
      className={['skeu-accordion', inline ? 'skeu-accordion--inline' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => {
        const open = isOpen(item.id);
        const bodyId = `${uid}-${item.id}`;
        return (
          <div key={item.id} className="skeu-accordion__item">
            <button
              onClick={() => {
                toggle(item.id);
              }}
              aria-expanded={open}
              aria-controls={bodyId}
              className={['skeu-accordion-btn', open ? 'is-open' : '']
                .filter(Boolean)
                .join(' ')}
            >
              <span>{item.title}</span>
              <span className="skeu-accordion__caret">›</span>
            </button>
            <div
              id={bodyId}
              className={['skeu-accordion__body', open ? 'is-open' : '']
                .filter(Boolean)
                .join(' ')}
            >
              <div className="skeu-accordion__content">{item.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
