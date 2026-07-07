import { workProjectsData } from '../../data';
import type { CareerPhase, WorkExperience } from '../../types/data';
import { ExpandableCard } from '../../components/organisms/ExpandableCard';
import { Heading } from '../../components/atoms/Heading';
import { Section } from '../../components/atoms/Section';
import { Stack } from '../../components/atoms/Stack';

const PHASE_ORDER: CareerPhase[] = [
  'Senior Engineer',
  'Software Engineer II',
  'Early career',
  'Research',
];

function period(job: WorkExperience): string {
  if (job.endYear === job.startYear) return `${job.startYear}`;
  return `${job.startYear} to ${job.endYear ?? 'present'}`;
}

export function ExperienceView() {
  return (
    <div className="skeu-experience">
      {PHASE_ORDER.map((phase) => {
        const jobs = workProjectsData
          .filter((j) => j.phase === phase)
          .sort((a, b) => b.startYear - a.startYear);
        if (jobs.length === 0) return null;
        return (
          <Section
            key={phase}
            padding="none"
            className="skeu-experience__group"
          >
            <Heading level={3} className="skeu-experience__phase">
              {phase}
            </Heading>
            <Stack direction="col" gap="xs">
              {jobs.map((job) => (
                <ExpandableCard
                  key={`${job.company}-${job.startYear}`}
                  title={job.title}
                  company={job.company}
                  period={period(job)}
                  bullets={job.bullets}
                  {...(job.companyUrl !== undefined
                    ? { companyUrl: job.companyUrl }
                    : {})}
                />
              ))}
            </Stack>
          </Section>
        );
      })}
    </div>
  );
}
