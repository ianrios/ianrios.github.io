import { Button } from '../components/atoms/Button';

export function NotFound() {
  return (
    <div className="skeu-admin-content__body">
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Button as="link" href="/" variant="surface" size="sm">
        Back to portfolio
      </Button>
    </div>
  );
}
