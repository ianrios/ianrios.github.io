import { workProjectsData } from '../../data';
import type { CareerPhase, WorkExperience } from '../../types/data';
import type { AccordionItem } from '../../types/admin';
import { Accordion } from '../../components/molecules/Accordion';
import { BulletList } from '../../components/molecules/BulletList';
import { Button } from '../../components/atoms/Button';
import { Heading } from '../../components/atoms/Heading';
import { Stack } from '../../components/atoms/Stack';
import { Text } from '../../components/atoms/Text';

// Newest phase first; only Senior is expanded on arrival.
const PHASE_ORDER: CareerPhase[] = [
  'Senior Software Engineer',
  'Software Engineer II',
  'Early Career',
  'Research',
];

function period(job: WorkExperience): string {
  if (job.endYear === job.startYear) return `${job.startYear}`;
  return `${job.startYear} to ${job.endYear ?? 'present'}`;
}

// A phase opens to reveal its roles with achievements shown directly - one
// level of disclosure (career era), not a nested accordion per job.
function JobEntry({ job }: { job: WorkExperience }) {
  return (
    <Stack direction="col" gap="xxs" className="skeu-job">
      <Heading level={4} className="skeu-job__title">
        {job.title}
      </Heading>
      <Text as="span" size="xs" className="skeu-job__meta">
        {job.company} · {period(job)}
      </Text>
      {job.bullets.length > 0 && <BulletList items={job.bullets} />}
      {job.companyUrl !== undefined && (
        <Button
          as="link"
          href={job.companyUrl}
          external
          size="xs"
          variant="surface"
        >
          company site
        </Button>
      )}
    </Stack>
  );
}

export function ExperienceView() {
  const items: AccordionItem[] = PHASE_ORDER.flatMap((phase) => {
    const jobs = workProjectsData
      .filter((j) => j.phase === phase)
      .sort((a, b) => b.startYear - a.startYear);
    if (jobs.length === 0) return [];
    return [
      {
        id: phase,
        title: phase,
        body: (
          <Stack direction="col" gap="md">
            {jobs.map((job) => (
              <JobEntry key={`${job.company}-${job.startYear}`} job={job} />
            ))}
          </Stack>
        ),
      },
    ];
  });

  return (
    <Stack direction="col" padding="md" className="skeu-experience">
      <Accordion
        items={items}
        autoClose={false}
        defaultOpen={['Senior Engineer']}
      />
    </Stack>
  );
}
