import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ExperienceView } from './home/ExperienceView';
import { ProjectsView, skills } from './home/ProjectsView';
import { HobbiesView } from './home/HobbiesView';
import { ContactModal } from '../components/organisms/ContactModal';
import { PushPanel } from '../components/organisms/PushPanel';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { Stack } from '../components/atoms/Stack';
import { ScrollArea } from '../components/molecules/ScrollArea';
import { TokenSidebar } from './admin/TokenSidebar';
import { useHomeDesignPanel } from '../hooks/useHomeDesignPanel';
import { useNavChrome } from '../hooks/navChromeContext';
import { WelcomeView } from './WelcomeView';
import { MobileNavDrawer } from './MobileNavDrawer';
import { Heading } from '../components/atoms/Heading';
import type { PageId, View } from '../types/data';

const MOBILE_BREAKPOINT = 992;

// router state is untyped external input; accept only a known view value
function viewFromState(state: unknown): View | null {
  if (typeof state !== 'object' || state === null) return null;
  const view: unknown = (state as Record<string, unknown>).view;
  return view === 'welcome' || view === 'main' ? view : null;
}

const PAGE_TITLES: Record<PageId, string> = {
  work: 'experience',
  projects: 'projects',
  hobbies: 'hobbies',
};

export function Main({ initialView = 'welcome' }: { initialView?: View }) {
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [view, setView] = useState(
    viewFromState(location.state) ?? initialView,
  );
  const [page, setPage] = useState<PageId>('work');
  const onMobile = windowWidth < MOBILE_BREAKPOINT;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const designPanelProps = useHomeDesignPanel();
  const [panelOpen, setPanelOpen] = useState(false);

  // The floating site nav must never overlay the MetaBalls splash.
  const { setHidden } = useNavChrome();
  useEffect(() => {
    setHidden(view === 'welcome');
    return () => {
      setHidden(false);
    };
  }, [view, setHidden]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const changePage = (p: PageId) => {
    setPage(p);
    document.getElementById('home-scroll')?.scrollTo({ top: 0 });
  };

  const sidebarProps = {
    page,
    setPage: changePage,
    showTools,
    setShowTools,
    linksOpen,
    setLinksOpen,
    setModalShow,
    skills,
    workVisible: true,
  };

  return (
    <>
      {view === 'welcome' && <WelcomeView setView={setView} />}

      {view === 'main' && (
        <Stack
          direction="row"
          height="100vh"
          overflow="hidden"
          className="view-2"
        >
          <PushPanel
            label="design"
            width="clamp(320px, 22vw, 440px)"
            revealDelay={3000}
            tabVariant="rotated"
            onOpenChange={setPanelOpen}
          >
            <TokenSidebar {...designPanelProps} />
          </PushPanel>

          {onMobile && (
            <>
              <button
                className="skeu-hamburger"
                onClick={() => {
                  setMobileNavOpen(true);
                }}
                aria-label="Open navigation"
              >
                <Icon name="menu" size={28} />
              </button>
              <MobileNavDrawer
                mobileNavOpen={mobileNavOpen}
                setMobileNavOpen={setMobileNavOpen}
                sidebarProps={sidebarProps}
              />
            </>
          )}

          <Stack
            direction="col"
            flex="1"
            overflow="hidden"
            className={onMobile ? 'home-content--mobile' : ''}
          >
            {onMobile ? (
              <Stack
                direction="col"
                align="center"
                className="home-content__header"
              >
                <Heading level={2} className="home-content__title">
                  {PAGE_TITLES[page]}
                </Heading>
              </Stack>
            ) : (
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
            )}
            <ScrollArea
              id="home-scroll"
              hideScrollbars
              height="calc(100vh - 80px)"
            >
              {page === 'work' && <ExperienceView />}
              {page === 'projects' && <ProjectsView condensed={panelOpen} />}
              {page === 'hobbies' && <HobbiesView />}
            </ScrollArea>
          </Stack>

          <ContactModal
            show={modalShow}
            onHide={() => {
              setModalShow(false);
            }}
          />
        </Stack>
      )}
    </>
  );
}
