import { Heading } from '../atoms/Heading';
import { Stack } from '../atoms/Stack';
import { NavBar } from './NavBar';

export function NavBarDemo() {
  return (
    <Stack direction="col" gap="lg">
      <Stack direction="col" gap="xs">
        <Heading level={5}>Link-style</Heading>
        <div className="skeu-preview-section--sm">
          <NavBar variant="links" pages={['home', 'work']} />
        </div>
      </Stack>

      <Stack direction="col" gap="xs">
        <Heading level={5}>Interactive active state</Heading>
        <div className="skeu-preview-section">
          <NavBar />
        </div>
      </Stack>
    </Stack>
  );
}
