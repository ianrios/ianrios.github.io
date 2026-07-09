import type { ProjectData } from '../../types/data';
import { MasonryCard } from './MasonryCard';

const DEMO_ITEM: ProjectData = {
  title: 'Sample Project',
  year: 2024,
  activelyMaintained: true,
  body: 'Masonry portfolio card with a meta line, body copy, and link actions.',
  href: 'https://github.com/ianrios',
  live: '/design-system',
  info: 'https://en.wikipedia.org/wiki/Design_system',
  tools: ['React', 'TypeScript'],
};

export function MasonryCardDemo() {
  return <MasonryCard item={DEMO_ITEM} index={0} />;
}
