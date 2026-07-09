import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { FloatingNav } from './FloatingNav';

export function FloatingNavDemo() {
  return (
    <FloatingNav inline>
      <Button variant="outline" fullWidth justify="start" aria-current="page">
        home
      </Button>
      <Button variant="outline" fullWidth justify="start">
        about
      </Button>
      <Button variant="outline" fullWidth justify="between">
        contact <Icon name="send" size={13} />
      </Button>
    </FloatingNav>
  );
}
