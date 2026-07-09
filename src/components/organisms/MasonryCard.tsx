import type { ProjectData } from '../../types/data';
import { Button } from '../atoms/Button';
import { Card } from '../molecules/Card';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

export function MasonryCard({
  index,
  item,
}: {
  index: number;
  item: ProjectData;
}) {
  const isAccent = (index % 2 !== 0 || index % 7 === 0) && index !== 0;
  const isInfo = index % 5 === 0 && index !== 0 && index < 10;
  const variant: 'muted' | 'accent' | undefined = isInfo
    ? 'muted'
    : isAccent
      ? 'accent'
      : undefined;

  const meta = item.activelyMaintained
    ? `started in ${item.year} - active`
    : `built in ${item.year}`;

  return (
    <Card {...(variant !== undefined ? { variant } : {})}>
      <Heading level={4} className="skeu-masonry-card__title">
        {item.title}
      </Heading>
      {item.img_src_arr?.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? item.title : ''}
          className="skeu-masonry-card__img"
        />
      ))}
      <Text className="skeu-masonry-card__meta">
        <em>{meta}</em>
      </Text>
      {item.body !== '' && (
        <Text className="skeu-masonry-card__body">{item.body}</Text>
      )}
      <div className="skeu-masonry-card__links">
        {item.href !== '' && (
          <Button
            as="link"
            icon="github"
            href={item.href}
            aria-label="GitHub"
            variant="ghost"
          />
        )}
        {item.info !== undefined && (
          <Button
            as="link"
            icon="info"
            href={item.info}
            aria-label="Info"
            variant="ghost"
          />
        )}
        {item.live !== '' && (
          <Button
            as="link"
            href={item.live}
            external={!item.live.startsWith('/')}
            size="xs"
            variant="surface"
          >
            Visit Live Demo
          </Button>
        )}
      </div>
    </Card>
  );
}
