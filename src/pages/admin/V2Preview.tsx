import { ExperienceView } from '../home/ExperienceView';
import { Heading } from '../../components/atoms/Heading';
import { Text } from '../../components/atoms/Text';
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
      <Heading level={3} className="skeu-admin-section-heading">
        Portfolio v2: Layout Exploration
      </Heading>
      <Text className="skeu-v2-desc">
        Click role cards to expand. Patterns from portfolio-overhaul.md.
      </Text>

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

      <SectionLabel>Experience view (live Phase 3 layout)</SectionLabel>
      <div className="skeu-preview-note">
        Real work history from data.ts - the same component tree the home
        experience tab renders.
      </div>
      <ExperienceView />

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
