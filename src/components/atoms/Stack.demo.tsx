import { Badge } from './Badge';
import { Stack } from './Stack';

export function StackDemo() {
  return (
    <>
      <Stack direction="row" gap="sm">
        <Badge>row</Badge>
        <Badge>gap</Badge>
      </Stack>
      <Stack direction="col" gap="xs">
        <Badge>col</Badge>
      </Stack>
    </>
  );
}
