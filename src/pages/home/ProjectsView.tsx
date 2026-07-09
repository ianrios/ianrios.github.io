import Masonry from 'react-masonry-css';
import { independentProjectsData } from '../../data';
import { MasonryCard } from '../../components/organisms/MasonryCard';

export function ProjectsView({ condensed }: { condensed: boolean }) {
  // One fewer column while the design push-panel is open.
  const breakpointCols = condensed
    ? { default: 3, 992: 3, 991: 1 }
    : { default: 4, 992: 4, 991: 1 };

  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {independentProjectsData.map((item, i) => (
        <MasonryCard key={item.title} item={item} index={i} />
      ))}
    </Masonry>
  );
}
