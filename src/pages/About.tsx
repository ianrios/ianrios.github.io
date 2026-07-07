import { Heading } from '../components/atoms/Heading';
import { Section } from '../components/atoms/Section';
import { Stack } from '../components/atoms/Stack';
import { Text } from '../components/atoms/Text';
import { aboutData } from '../data';

export function About() {
  return (
    <Section padding="lg" className="skeu-about">
      <Stack direction="col" gap="md" className="skeu-about__column">
        <Heading level={1}>About</Heading>
        {aboutData.photo !== undefined && (
          <img
            src={aboutData.photo}
            alt="Ian Rios"
            className="skeu-about__photo"
          />
        )}
        <Text className="skeu-about__lead">{aboutData.bio}</Text>
        <Text>{aboutData.personal}</Text>
        <Text className="skeu-about__closing">{aboutData.closing}</Text>
      </Stack>
    </Section>
  );
}
