import { useState } from 'react';
import Masonry from 'react-masonry-css';
import { independentProjectsData, tools } from '../../data';
import { MasonryCard } from '../../components/organisms/MasonryCard';
import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { Stack } from '../../components/atoms/Stack';
import { skills } from './projectsData';

function SkillsCloud() {
  const [open, setOpen] = useState(false);
  return (
    <Stack direction="col" gap="xs" padding="md">
      <Button
        variant="outline"
        size="sm"
        aria-expanded={open}
        onClick={() => {
          setOpen(!open);
        }}
      >
        all skills{' '}
        <Icon name={open ? 'chevron-down' : 'chevron-up'} size={13} />
      </Button>
      {open && (
        <Stack direction="row" gap="xxs" flex="wrap">
          {skills.map(([name]) => {
            const href = tools[name];
            return href !== undefined ? (
              <Badge key={name} href={href}>
                {name}
              </Badge>
            ) : (
              <Badge key={name}>{name}</Badge>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export function ProjectsView({ condensed }: { condensed: boolean }) {
  // One fewer column while the design push-panel is open.
  const breakpointCols = condensed
    ? { default: 2, 992: 2, 991: 1 }
    : { default: 3, 992: 3, 991: 1 };

  return (
    <>
      <SkillsCloud />
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {independentProjectsData.map((item, i) => (
          <MasonryCard key={item.title} item={item} index={i} />
        ))}
      </Masonry>
    </>
  );
}
