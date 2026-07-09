import { Text } from './Text';

const TEXT_SIZES = ['lg', 'base', 'sm', 'xs', 'xxs'] as const;

export function TextDemo() {
  return (
    <>
      {TEXT_SIZES.map((size) => (
        <Text key={size} size={size}>
          Text size {size}
        </Text>
      ))}
      <Text>
        Inline: <Text as="span">span</Text>, <Text as="em">em</Text>,{' '}
        <Text as="strong">strong</Text>
      </Text>
    </>
  );
}
