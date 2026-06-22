import { ExpandableCard } from '../../components/organisms/ExpandableCard';
import { SectionLabel } from './AdminUI';
import { TIMELINE_EVENTS } from './adminData';
import { MixedProjectGrid } from './MixedProjectGrid';

function TimelineDot({ isLast }: { isLast: boolean }) {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: isLast ? 'var(--color-accent)' : 'var(--color-surface)',
        border: '2px solid var(--color-muted)',
        boxShadow: 'var(--pop-shadow-dark)',
        zIndex: 1,
      }}
    />
  );
}

export function V2Preview() {
  return (
    <div
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(128,128,128,0.10)',
        maxWidth: 860,
        margin: '0 auto',
      }}
    >
      <h3 style={{ color: 'var(--color-text)', marginTop: 0 }}>
        Portfolio v2 — Layout Exploration
      </h3>
      <p
        style={{
          fontSize: 12,
          color: 'var(--color-muted)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        Click role cards to expand. Patterns from portfolio-overhaul.md.
      </p>

      <SectionLabel>Career timeline (organism)</SectionLabel>
      <div
        style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-sm) var(--space-lg)',
          marginBottom: 'var(--space-lg)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: 'calc(var(--space-lg) + 6px)',
            right: 'calc(var(--space-lg) + 6px)',
            height: 2,
            background: 'rgba(128,128,128,0.18)',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {TIMELINE_EVENTS.map((e, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-xxs)',
                minWidth: 60,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--color-muted)',
                }}
              >
                {e.year}
              </div>
              <TimelineDot isLast={i === TIMELINE_EVENTS.length - 1} />
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--color-text)',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {e.role}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--color-muted)',
                  textAlign: 'center',
                }}
              >
                {e.company}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionLabel>
        Expandable experience (organism — molecule × N)
      </SectionLabel>
      <ExpandableCard
        title="Senior Frontend Engineer"
        company="Built Technologies"
        period="2022–now"
        tech={['TypeScript', 'React', 'Three.js', 'Python', 'MySQL']}
        bullets={[
          'Budget versioning & change order system',
          'AI document extraction + MySQL migration',
          'Design system (this!)',
          'Unit-based pay app with autosave & rollback',
        ]}
      />
      <ExpandableCard
        title="Frontend Engineer"
        company="Previous Co"
        period="2020–2022"
        tech={['React', 'Redux', 'Node.js', 'CSS']}
        bullets={[
          'Internal tooling dashboard',
          'API integration layer',
          'Accessibility improvements',
        ]}
      />

      <SectionLabel>
        Mixed-density project grid — without images (organism)
      </SectionLabel>
      <MixedProjectGrid showImages={false} />

      <SectionLabel>
        Mixed-density project grid — with images (organism)
      </SectionLabel>
      <MixedProjectGrid showImages={true} />
    </div>
  );
}
