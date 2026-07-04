import { useState } from 'react';
import { tools } from '../data';
import { Button } from './atoms/Button';
import { Icon } from './atoms/Icon';
import { Badge } from './atoms/Badge';
import { Card } from './molecules/Card';

interface MasonryCardItem {
  title?: string;
  year?: number;
  activelyMaintained?: boolean;
  body?: string;
  img_src_arr?: string[];
  tools?: string[];
  href?: string;
  live?: string;
  instagram?: string;
  url?: string;
}

const MasonryCard = ({
  index,
  item,
}: {
  index: number;
  item: MasonryCardItem;
}) => {
  const [panelOpened, setPanelOpened] = useState(false);

  const isAccent = (index % 2 !== 0 || index % 7 === 0) && index !== 0;
  const isInfo = index % 5 === 0 && index !== 0 && index < 10;
  const variant: 'muted' | 'accent' | undefined = isInfo
    ? 'muted'
    : isAccent
      ? 'accent'
      : undefined;

  return (
    <Card {...(variant !== undefined ? { variant } : {})}>
      {item.title && <h4 className="skeu-masonry-card__title">{item.title}</h4>}
      {item.img_src_arr && (
        <>
          {item.img_src_arr.length > 0 && (
            <img
              src={item.img_src_arr[0]}
              alt={item.title}
              className="skeu-masonry-card__img"
            />
          )}
          {item.img_src_arr.length > 1 && (
            <img
              src={item.img_src_arr[1]}
              alt={item.body}
              className="skeu-masonry-card__img"
            />
          )}
        </>
      )}
      {item.year && (
        <p className="skeu-masonry-card__meta">
          <em>
            {item.activelyMaintained
              ? `started in ${item.year} - active`
              : `built in ${item.year}`}
          </em>
        </p>
      )}
      {item.body && <p className="skeu-masonry-card__body">{item.body}</p>}
      {item.tools && (
        <>
          <hr className="skeu-masonry-card__divider" />
          <button
            onClick={() => {
              setPanelOpened(!panelOpened);
            }}
            className="skeu-masonry-card__tool-toggle"
          >
            tools used{' '}
            <Icon
              name={panelOpened ? 'chevron-down' : 'chevron-up'}
              size={14}
            />
          </button>
          {panelOpened && (
            <div className="skeu-masonry-card__tools">
              {item.tools.map((t, i) => {
                const toolHref = tools[t];
                return toolHref ? (
                  <Badge key={i} href={toolHref}>
                    {t}
                  </Badge>
                ) : (
                  <Badge key={i}>{t}</Badge>
                );
              })}
            </div>
          )}
        </>
      )}
      <div className="skeu-masonry-card__links">
        {!!item.href && (
          <Button
            as="link"
            icon="github"
            href={item.href}
            aria-label="GitHub"
            variant="ghost"
          />
        )}
        {item.title === 'Meta Spheres' && (
          <Button
            as="link"
            icon="info"
            href="https://en.wikipedia.org/wiki/Metaballs"
            aria-label="Info"
            variant="ghost"
          />
        )}
        {!!item.live && (
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
        {!!item.instagram && (
          <Button
            as="link"
            icon="instagram"
            href={item.instagram}
            aria-label="Instagram"
            variant="ghost"
          />
        )}
        {!!item.url && (
          <Button
            as="link"
            icon="external"
            href={item.url}
            aria-label="Open"
            variant="ghost"
          />
        )}
      </div>
    </Card>
  );
};

export default MasonryCard;
