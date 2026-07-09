import { Button } from '../components/atoms/Button';
import { Heading } from '../components/atoms/Heading';
import { Stack } from '../components/atoms/Stack';
import { Text } from '../components/atoms/Text';
import { aboutData, hobbyData, externalLinks } from '../data';
import type { HobbyData } from '../types/data';

function HobbyRow({ hobby }: { hobby: HobbyData }) {
  const meta = hobby.activelyMaintained
    ? `since ${hobby.year}`
    : `${hobby.year}`;
  return (
    <Stack direction="col" gap="xxs">
      {hobby.role !== undefined && (
        <Heading level={4} className="skeu-hobby__title">
          {hobby.role}
        </Heading>
      )}
      <Stack direction="row" gap="xs" align="center">
        <Heading level={4} className="skeu-hobby__title">
          {hobby.title}
        </Heading>
        <Text as="span" size="xs" className="skeu-hobby__meta">
          {meta}
        </Text>
        {hobby.instagram !== '' && (
          <Button
            as="link"
            icon="instagram"
            href={hobby.instagram}
            aria-label={`${hobby.title} on Instagram`}
            variant="ghost"
          />
        )}
        {hobby.url !== '' && (
          <Button
            as="link"
            icon="external"
            href={hobby.url}
            aria-label={`${hobby.title} website`}
            variant="ghost"
          />
        )}
      </Stack>
      <Text size="sm" className="skeu-hobby__body">
        {hobby.body}
      </Text>
    </Stack>
  );
}

export function About() {
  const personal = hobbyData.filter((h) => h.kind !== 'volunteering');
  const volunteering = hobbyData.filter((h) => h.kind === 'volunteering');
  return (
    <Stack direction="col" padding="lg" className="skeu-about">
      <Stack direction="col" gap="md" className="skeu-about__column">
        <Heading level={1}>About</Heading>
        {aboutData.photo !== undefined && (
          <img
            src={aboutData.photo}
            alt="Ian Rios"
            className="skeu-about__photo"
          />
        )}
        <Text size="lg">{aboutData.bio}</Text>
        <Text>{aboutData.personal}</Text>

        <Heading level={2} className="skeu-about__section">
          hobbies
        </Heading>
        <Stack direction="col" gap="md">
          {personal.map((h) => (
            <HobbyRow key={h.title} hobby={h} />
          ))}
        </Stack>
        <Heading level={3} className="skeu-hobbies__sublabel">
          volunteering & mentorship
        </Heading>
        <Stack direction="col" gap="md">
          {volunteering.map((h) => (
            <HobbyRow key={h.title} hobby={h} />
          ))}
        </Stack>

        <Text className="skeu-about__closing">{aboutData.closing}</Text>

        <Heading level={2} className="skeu-about__section">
          links
        </Heading>
        <Stack direction="row" gap="sm" className="skeu-about__links">
          {externalLinks.map((link) => (
            <Button
              key={link.href}
              as="link"
              href={link.href}
              external
              variant="chisel"
              size="sm"
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
