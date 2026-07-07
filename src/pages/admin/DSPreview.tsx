import { useState } from 'react';
import { Button } from '../../components/atoms/Button';
import { TokensSection } from './preview/TokensSection';
import { AtomsSection } from './preview/AtomsSection';
import { MoleculesSection } from './preview/MoleculesSection';
import { OrganismsSection } from './preview/OrganismsSection';
import { CombinationsSection } from './preview/CombinationsSection';

// The five design-system tiers are real nav sections (a segment switcher that
// shows one tier at a time) rather than one continuous scroll. Every tier
// component stays statically imported so [demo-missing] still sees each
// component reachable from the preview tree.
const SECTIONS = [
  { id: 'tokens', label: 'Tokens', render: () => <TokensSection /> },
  { id: 'atoms', label: 'Atoms', render: () => <AtomsSection /> },
  { id: 'molecules', label: 'Molecules', render: () => <MoleculesSection /> },
  { id: 'organisms', label: 'Organisms', render: () => <OrganismsSection /> },
  { id: 'patterns', label: 'Patterns', render: () => <CombinationsSection /> },
] as const;

export function DSPreview({ exportText }: { exportText: string }) {
  const [active, setActive] = useState<string>('tokens');
  const current = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  return (
    <>
      <nav className="skeu-ds-section-nav" aria-label="Design system sections">
        {SECTIONS.map(({ id, label }) => (
          <Button
            key={id}
            variant={active === id ? 'solid' : 'outline'}
            size="sm"
            aria-current={active === id ? 'page' : undefined}
            onClick={() => {
              setActive(id);
            }}
          >
            {label}
          </Button>
        ))}
      </nav>

      <div className="skeu-preview-page-frame">
        <div className="skeu-ds-annotation">
          Page: padding = space-lg · border-radius = radius-lg · bg = color-bg
        </div>
        {current.render()}
      </div>

      <hr />
      <h3 className="skeu-admin-section-heading">Export</h3>
      <textarea readOnly value={exportText} className="skeu-ds-export" />
    </>
  );
}
