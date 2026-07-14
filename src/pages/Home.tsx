import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ExperienceView } from './home/ExperienceView';
import { ProjectsView } from './home/ProjectsView';
import { Button } from '../components/atoms/Button';
import { Stack } from '../components/atoms/Stack';
import { ScrollArea } from '../components/molecules/ScrollArea';
import { useDesignPanel } from '../hooks/designPanelContext';
import { useNavChrome } from '../hooks/navChromeContext';
import { WelcomeView } from './WelcomeView';
import { Heading } from '../components/atoms/Heading';
import type { PageId, View } from '../types/data';

// router state is untyped external input; accept only a known view value
function viewFromState(state: unknown): View | null {
  if (typeof state !== 'object' || state === null) return null;
  const view: unknown = (state as Record<string, unknown>).view;
  return view === 'welcome' || view === 'main' ? view : null;
}

const PAGE_TITLES: Record<PageId, string> = {
  work: 'experience',
  projects: 'projects',
};

// The design push-panel itself lives in PanelLayout now (one shared
// instance for every route that has one), not here - Main only renders
// whatever goes inside its flex-1 content column, plus the full-screen
// splash when PanelLayout is bypassing the row entirely (see its `hidden`
// check).
export function Main({ initialView = 'welcome' }: { initialView?: View }) {
  const location = useLocation();
  const [view, setView] = useState(
    viewFromState(location.state) ?? initialView,
  );
  const [page, setPage] = useState<PageId>('work');

  const { open } = useDesignPanel();

  // The site nav (floating remote / mobile hamburger, both owned by
  // SiteNav at the App root) must never overlay the MetaBalls splash.
  const { setHidden } = useNavChrome();
  useEffect(() => {
    setHidden(view === 'welcome');
    return () => {
      setHidden(false);
    };
  }, [view, setHidden]);

  const changePage = (p: PageId) => {
    setPage(p);
    document.getElementById('home-scroll')?.scrollTo({ top: 0 });
  };

  return (
    <>
      {view === 'welcome' && <WelcomeView setView={setView} />}

      {view === 'main' && (
        <Stack
          direction="col"
          height="100%"
          overflow="hidden"
          className="view-2"
        >
          <Stack
            direction="row"
            justify="between"
            align="center"
            gap="sm"
            className="home-content__header"
          >
            <Heading level={1} className="home-content__brand">
              Ian Rios
            </Heading>
            <Stack direction="row" gap="xs">
              {(Object.keys(PAGE_TITLES) as PageId[]).map((id) => (
                <Button
                  key={id}
                  variant="outline"
                  aria-pressed={page === id}
                  onClick={() => {
                    changePage(id);
                  }}
                >
                  {PAGE_TITLES[id]}
                </Button>
              ))}
            </Stack>
          </Stack>
          <ScrollArea
            id="home-scroll"
            hideScrollbars
            height="calc(100vh - 80px)"
            className="home-content__views"
          >
            {page === 'work' && <ExperienceView />}
            {page === 'projects' && <ProjectsView condensed={open} />}
          </ScrollArea>
        </Stack>
      )}
    </>
  );
}
