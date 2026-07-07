import { useState } from 'react';
import { tools } from '../../data';
import type { PortfolioItem } from '../../types/data';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { Card } from '../molecules/Card';

export function MasonryCard({
  index,
  item,
}: {
  index: number;
  item: PortfolioItem;
}) {
  const [panelOpened, setPanelOpened] = useState(false);

  const isAccent = (index % 2 !== 0 || index % 7 === 0) && index !== 0;
  const isInfo = index % 5 === 0 && index !== 0 && index < 10;
  const variant: 'muted' | 'accent' | undefined = isInfo
    ? 'muted'
    : isAccent
      ? 'accent'
      : undefined;

  const itemTools = 'tools' in item ? item.tools : undefined;
  const href = 'href' in item ? item.href : undefined;
  const live = 'live' in item ? item.live : undefined;
  const info = 'info' in item ? item.info : undefined;
  const instagram = 'instagram' in item ? item.instagram : undefined;
  const url = 'url' in item ? item.url : undefined;

  return (
    <Card {...(variant !== undefined ? { variant } : {})}>
      <h4 className="skeu-masonry-card__title">{item.title}</h4>
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
              alt=""
              className="skeu-masonry-card__img"
            />
          )}
        </>
      )}
      <p className="skeu-masonry-card__meta">
        <em>
          {item.activelyMaintained
            ? `started in ${item.year} - active`
            : `built in ${item.year}`}
        </em>
      </p>
      {item.body && <p className="skeu-masonry-card__body">{item.body}</p>}
      {itemTools && (
        <>
          <hr className="skeu-masonry-card__divider" />
          <button
            onClick={() => {
              setPanelOpened(!panelOpened);
            }}
            aria-expanded={panelOpened}
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
              {itemTools.map((t) => {
                const toolHref = tools[t];
                return toolHref ? (
                  <Badge key={t} href={toolHref}>
                    {t}
                  </Badge>
                ) : (
                  <Badge key={t}>{t}</Badge>
                );
              })}
            </div>
          )}
        </>
      )}
      <div className="skeu-masonry-card__links">
        {!!href && (
          <Button
            as="link"
            icon="github"
            href={href}
            aria-label="GitHub"
            variant="ghost"
          />
        )}
        {!!info && (
          <Button
            as="link"
            icon="info"
            href={info}
            aria-label="Info"
            variant="ghost"
          />
        )}
        {!!live && (
          <Button
            as="link"
            href={live}
            external={!live.startsWith('/')}
            size="xs"
            variant="surface"
          >
            Visit Live Demo
          </Button>
        )}
        {!!instagram && (
          <Button
            as="link"
            icon="instagram"
            href={instagram}
            aria-label="Instagram"
            variant="ghost"
          />
        )}
        {!!url && (
          <Button
            as="link"
            icon="external"
            href={url}
            aria-label="Open"
            variant="ghost"
          />
        )}
      </div>
    </Card>
  );
}
