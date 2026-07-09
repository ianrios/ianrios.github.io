import { Badge } from './Badge';

const BADGE_SAMPLES = [
  'React',
  'TypeScript',
  'Three.js',
  'Python',
  'MySQL',
  'WebGL',
];

export function BadgeDemo() {
  return (
    <>
      {BADGE_SAMPLES.map((b) => (
        <Badge key={b}>{b}</Badge>
      ))}
      <Badge href="https://github.com/ianrios">linked badge</Badge>
    </>
  );
}
