import { Accordion } from './Accordion';
import type { AccordionItem } from '../../types/admin';

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'exp',
    title: 'Experience',
    body: 'Detailed work history, key accomplishments, and technologies across roles.',
  },
  {
    id: 'proj',
    title: 'Projects',
    body: 'Personal and professional projects with live demos and source links.',
  },
  {
    id: 'edu',
    title: 'Education',
    body: 'Degrees, certifications, and self-directed learning.',
  },
];

export function AccordionDemo() {
  return (
    <div className="skeu-accordion-demo">
      <Accordion items={FAQ_ITEMS} />
    </div>
  );
}
