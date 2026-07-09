import { Text } from '../atoms/Text';

type TextSize = 'xxs' | 'xs' | 'sm' | 'base' | 'lg';

// Accent-barred achievement list - the resume-bullet treatment, extracted
// from ExpandableCard so the pattern is a reusable, demoed primitive.
export function BulletList({
  items,
  size = 'sm',
}: {
  items: string[];
  size?: TextSize;
}) {
  return (
    <ul className="skeu-bullet-list">
      {items.map((item, i) => (
        <li key={i} className="skeu-bullet-list__item">
          <Text as="span" size={size}>
            {item}
          </Text>
        </li>
      ))}
    </ul>
  );
}
