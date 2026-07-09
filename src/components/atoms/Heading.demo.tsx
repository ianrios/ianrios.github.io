import { Heading } from './Heading';

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

export function HeadingDemo() {
  return (
    <>
      {HEADING_LEVELS.map((level) => (
        <Heading key={level} level={level}>
          Heading level {level}
        </Heading>
      ))}
    </>
  );
}
