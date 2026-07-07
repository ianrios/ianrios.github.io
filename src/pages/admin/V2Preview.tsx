import { ExpandableCard } from '../../components/organisms/ExpandableCard';
import { SectionLabel } from './AdminUI';
import { TIMELINE_EVENTS } from './adminData';
import { MixedProjectGrid } from './MixedProjectGrid';

function TimelineDot({ isLast }: { isLast: boolean }) {
  return (
    <div
      className={[
        'skeu-timeline-dot',
        isLast ? 'skeu-timeline-dot--active' : 'skeu-timeline-dot--inactive',
      ].join(' ')}
    />
  );
}

export function V2Preview() {
  return (
    <div className="skeu-preview-page-frame skeu-v2-preview">
      <h3 className="skeu-admin-section-heading">
        Portfolio v2: Layout Exploration
      </h3>
      <p className="skeu-v2-desc">
        Click role cards to expand. Patterns from portfolio-overhaul.md.
      </p>

      <SectionLabel>Career timeline (organism)</SectionLabel>
      <div className="skeu-timeline">
        <div className="skeu-timeline__rail" />
        <div className="skeu-timeline__dots">
          {TIMELINE_EVENTS.map((e, i) => (
            <div key={i} className="skeu-timeline__entry">
              <div className="skeu-timeline__year">{e.year}</div>
              <TimelineDot isLast={i === TIMELINE_EVENTS.length - 1} />
              <div className="skeu-timeline__role">{e.role}</div>
              <div className="skeu-timeline__company">{e.company}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionLabel>
        Expandable experience (organism: molecule × N)
      </SectionLabel>
      <div className="skeu-preview-note">
        Sample data for layout preview, not a real work history.
      </div>
      <ExpandableCard
        title="Senior Frontend Engineer"
        company="Built Technologies"
        period="2022 to now"
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
        company="Sample Co"
        period="2020 to 2022"
        tech={['React', 'Redux', 'Node.js', 'CSS']}
        bullets={[
          'Internal tooling dashboard',
          'API integration layer',
          'Accessibility improvements',
        ]}
      />

      <SectionLabel>
        Mixed-density project grid: without images (organism)
      </SectionLabel>
      <MixedProjectGrid showImages={false} />

      <SectionLabel>
        Mixed-density project grid: with images (organism)
      </SectionLabel>
      <MixedProjectGrid showImages={true} />
    </div>
  );
}
