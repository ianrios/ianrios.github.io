import { ExpandableCard } from './ExpandableCard';

export function ExpandableCardDemo() {
  return (
    <ExpandableCard
      title="Senior Engineer"
      company="Acme Corp"
      period="2022 to now"
      tech={['React', 'TypeScript']}
      bullets={['Led migration to a token-based design system.']}
      companyUrl="https://example.com"
    />
  );
}
