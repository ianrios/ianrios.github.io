import { Heading } from '../atoms/Heading';
import { Stack } from '../atoms/Stack';
import { NavVertical } from './NavVertical';

export function NavVerticalDemo() {
  return (
    <Stack direction="col" gap="lg">
      <Stack direction="col" gap="xs">
        <Heading level={5}>Button variant</Heading>
        <div className="skeu-preview-flex skeu-preview-section--sm">
          <NavVertical />
          <div className="skeu-preview-sidebar-desc">
            Raised surface buttons · click to set active
          </div>
        </div>
      </Stack>

      <Stack direction="col" gap="xs">
        <Heading level={5}>Link variant</Heading>
        <div className="skeu-preview-flex skeu-preview-section">
          <NavVertical variant="links" />
          <div className="skeu-preview-sidebar-desc">
            Flat link buttons, no elevation, accent bg on hover/active
          </div>
        </div>
      </Stack>
    </Stack>
  );
}
