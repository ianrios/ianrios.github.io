import { useState } from 'react';
import Masonry from 'react-masonry-css';
import { independentProjectsData, tools } from '../../data';
import type { SkillTuple } from '../../types/data';
import { MasonryCard } from '../../components/organisms/MasonryCard';
import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { Stack } from '../../components/atoms/Stack';

// Most-used skill first. Lives with the projects view because only
// independent projects carry tool tags (concepts doc section 3); Home
// re-exports it into the mobile drawer's sidebar until Phase 7.
export const skills: SkillTuple[] = Object.entries(
  independentProjectsData.reduce<Record<string, number>>((a, c) => {
    c.tools.forEach((t) => {
      a[t] = (a[t] ?? 0) + 1;
    });
    return a;
  }, {}),
).sort((a, b) => b[1] - a[1]);

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
