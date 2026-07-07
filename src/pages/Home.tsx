import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { independentProjectsData, hobbyData, workProjectsData } from '../data';
import Masonry from 'react-masonry-css';
import { MasonryCard } from '../components/organisms/MasonryCard';
import { PortfolioSidebar } from '../components/organisms/PortfolioSidebar';
import { ContactModal } from '../components/organisms/ContactModal';
import { PushPanel } from '../components/organisms/PushPanel';
import { Icon } from '../components/atoms/Icon';
import { TokenSidebar } from './admin/TokenSidebar';
import { useHomeDesignPanel } from '../hooks/useHomeDesignPanel';
import { WelcomeView } from './WelcomeView';
import { MobileNavDrawer } from './MobileNavDrawer';
import type { PageId, View } from '../types/data';

const MOBILE_BREAKPOINT = 992;

// router state is untyped external input; accept only a known view value
function viewFromState(state: unknown): View | null {
  if (typeof state !== 'object' || state === null) return null;
  const view: unknown = (state as Record<string, unknown>).view;
  return view === 'welcome' || view === 'main' ? view : null;
}

const allProjects = [...workProjectsData, ...independentProjectsData];
// most-used skill first
const skills = Object.entries(
  allProjects.reduce<Record<string, number>>((a, c) => {
    c.tools.forEach((t) => {
      a[t] = (a[t] ?? 0) + 1;
    });
    return a;
  }, {}),
).sort((a, b) => b[1] - a[1]);

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
  const breakpointColumnsObj = panelOpen
    ? { default: 2, 992: 2, 991: 1 }
    : { default: 3, 992: 3, 991: 1 };

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
    document.getElementById('masonrygrid')?.scrollIntoView();
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
        <div className="view-2 home-layout">
          <PushPanel
            label="design"
            width="clamp(320px, 22vw, 440px)"
            revealDelay={3000}
            tabVariant="rotated"
            onOpenChange={setPanelOpen}
          >
            <TokenSidebar {...designPanelProps} />
          </PushPanel>

          {onMobile ? (
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
          ) : (
            <div className="home-sidebar">
              <h1>Ian Rios</h1>
              <PortfolioSidebar {...sidebarProps} />
            </div>
          )}

          <div
            className={['home-content', onMobile ? 'home-content--mobile' : '']
              .filter(Boolean)
              .join(' ')}
          >
            <div className="home-content__header">
              <h2 className="home-content__title">{PAGE_TITLES[page]}</h2>
            </div>
            <div className="hide-scrollbars home-content__scroll">
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                id="masonrygrid"
                columnClassName="my-masonry-grid_column"
              >
                {page === 'work' &&
                  workProjectsData.map((item, i) => (
                    <MasonryCard key={item.title} item={item} index={i} />
                  ))}
                {page === 'projects' &&
                  independentProjectsData.map((item, i) => (
                    <MasonryCard key={item.title} item={item} index={i} />
                  ))}
                {page === 'hobbies' &&
                  hobbyData.map((item, i) => (
                    <MasonryCard key={item.title} item={item} index={i} />
                  ))}
              </Masonry>
            </div>
          </div>

          <ContactModal
            show={modalShow}
            onHide={() => {
              setModalShow(false);
            }}
          />
        </div>
      )}
    </>
  );
}
