import { Button } from '../components/atoms/Button';
import { Heading } from '../components/atoms/Heading';
import { Stack } from '../components/atoms/Stack';
import { Text } from '../components/atoms/Text';
import { ScrollArea } from '../components/molecules/ScrollArea';
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
            variant="chisel"
          />
        )}
        {hobby.url !== '' && (
          <Button
            as="link"
            icon="external"
            href={hobby.url}
            aria-label={`${hobby.title} website`}
            variant="chisel"
          />
        )}
      </Stack>
      <Text size="sm" className="skeu-hobby__body">
        {hobby.body}
      </Text>
    </Stack>
  );
}

// The design push-panel lives in PanelLayout now (one shared instance) -
// About only renders what goes inside its flex-1 content column.
export function About() {
  const personal = hobbyData.filter((h) => h.kind !== 'volunteering');
  const volunteering = hobbyData.filter((h) => h.kind === 'volunteering');

  return (
    <Stack direction="col" height="100%" className="skeu-about-page">
      <ScrollArea
        id="about-scroll"
        hideScrollbars
        height="100%"
        className="skeu-about"
      >
        <Stack
          direction="col"
          padding="lg"
          gap="md"
          className="skeu-about__column"
        >
          {/* About stays pinned always; hobbies and volunteering & mentorship
              share the sticky slot right below it, taking turns (same
              level={2}, same top offset, volunteering's higher z-index
              pushes hobbies out once its own scroll position arrives) -
              never a 3rd tier stacked below both. */}
          <Heading level={1} className="skeu-about__pin skeu-about__pin--about">
            About
          </Heading>
          <Text size="lg">{aboutData.bio}</Text>
          <img
            src="/img/ian-1.webp"
            alt="Ian Rios sitting in a reading nook"
            width={720}
            height={480}
            className="skeu-about__photo"
          />

          <Heading
            level={2}
            className="skeu-about__pin skeu-about__pin--hobbies"
          >
            hobbies
          </Heading>
          <Text>{aboutData.hobbiesIntro}</Text>
          <Stack direction="col" gap="md">
            {personal.map((h) => (
              <HobbyRow key={h.title} hobby={h} />
            ))}
          </Stack>

          <img
            src="/img/ian-2.webp"
            alt="Ian Rios"
            width={720}
            height={480}
            className="skeu-about__photo"
          />

          <Heading
            level={2}
            className="skeu-about__pin skeu-about__pin--volunteering"
          >
            volunteering & mentorship
          </Heading>
          <Text>{aboutData.volunteeringIntro}</Text>
          <Stack direction="col" gap="md">
            {volunteering.map((h) => (
              <HobbyRow key={h.title} hobby={h} />
            ))}
          </Stack>

          <img
            src="/img/ian-3.webp"
            alt="Ian Rios"
            width={720}
            height={480}
            className="skeu-about__photo"
          />

          <Text className="skeu-about__closing">{aboutData.closing}</Text>
        </Stack>
      </ScrollArea>

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
  );
}
