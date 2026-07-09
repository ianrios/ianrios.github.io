import { BulletList } from './BulletList';

export function BulletListDemo() {
  return (
    <BulletList
      items={[
        'Architected the design system powering this site, editable live.',
        'Cut alert noise from 90% to 50% with an LLM-guided triage agent.',
        'Led standards for a guild serving 12+ engineering teams.',
      ]}
    />
  );
}
