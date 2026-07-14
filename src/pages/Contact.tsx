import { Heading } from '../components/atoms/Heading';
import { Stack } from '../components/atoms/Stack';
import { Text } from '../components/atoms/Text';
import { ScrollArea } from '../components/molecules/ScrollArea';

const FORM_SRC =
  'https://docs.google.com/forms/d/e/1FAIpQLSdZuZHU8gkftr7wgn5DF2nYYG8Ds4HCDp-Vh-_OfYIE-YoBwQ/viewform?embedded=true';

// The design push-panel lives in PanelLayout now (one shared instance) -
// Contact only renders what goes inside its flex-1 content column.
export function Contact() {
  return (
    <ScrollArea
      id="contact-scroll"
      hideScrollbars
      height="100vh"
      className="skeu-contact"
    >
      <Stack
        direction="col"
        padding="lg"
        gap="sm"
        className="skeu-contact__column"
      >
        <Heading level={1}>Contact</Heading>
        <Text className="skeu-contact__lead">
          Reach out about work, collaboration, or anything you are building.
        </Text>
        <iframe
          src={FORM_SRC}
          title="Contact form"
          className="skeu-contact__form"
        >
          Loading
        </iframe>
      </Stack>
    </ScrollArea>
  );
}
