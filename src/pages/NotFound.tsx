import { Button } from '../components/atoms/Button';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';

export function NotFound() {
  return (
    <div className="skeu-admin-content__body">
      <Heading level={2}>Page not found</Heading>
      <Text>The page you are looking for does not exist.</Text>
      <Button as="link" href="/" variant="surface" size="sm">
        Back to portfolio
      </Button>
    </div>
  );
}
