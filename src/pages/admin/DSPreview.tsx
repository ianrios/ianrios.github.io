import { AtomsSection } from './preview/AtomsSection';
import { MoleculesSection } from './preview/MoleculesSection';
import { OrganismsSection } from './preview/OrganismsSection';
import { CombinationsSection } from './preview/CombinationsSection';

export function DSPreview({ exportText }: { exportText: string }) {
  return (
    <>
      <div
        style={{
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          padding: 'var(--space-lg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(128,128,128,0.10)',
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          Page — padding = space-lg · border-radius = radius-lg · bg = color-bg
        </div>
        <AtomsSection />
        <MoleculesSection />
        <OrganismsSection />
        <CombinationsSection />
      </div>
      <hr />
      <h3 style={{ color: 'var(--color-text)' }}>Export</h3>
      <textarea
        readOnly
        value={exportText}
        style={{
          width: '100%',
          height: 180,
          fontSize: 11,
          fontFamily: 'monospace',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid rgba(128,128,128,0.2)',
        }}
      />
    </>
  );
}
