import { Heading } from '../components/atoms/Heading';
import { Stack } from '../components/atoms/Stack';
import { Text } from '../components/atoms/Text';
import { aboutData } from '../data';

export function About() {
  return (
    <Stack direction="col" padding="lg" height="100vh">
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
        <Text className="skeu-about__closing">{aboutData.closing}</Text>
      </Stack>
    </Stack>
  );
}
