import { useState, useEffect } from 'react';
import type React from 'react';
import { independentProjectsData, hobbyData, workProjectsData } from '../data';
import Masonry from 'react-masonry-css';
import MasonryCard from '../components/masonry-card';
import { PortfolioSidebar } from '../components/organisms/PortfolioSidebar';
import { ContactModal } from '../components/organisms/ContactModal';
import { PushPanel } from '../components/organisms/PushPanel';
import { Icon } from '../components/atoms/Icon';
import { TokenSidebar } from './admin/TokenSidebar';
import { useDesignVars } from '../hooks/useDesignVars';
import { WelcomeView } from './WelcomeView';
import { MobileNavDrawer } from './MobileNavDrawer';
import {
  COLOR_PRESETS,
  SHAPE_PRESETS,
  ELEVATION_PRESETS,
} from './admin/adminData';

const breakpointColumnsObj = { default: 3, 992: 3, 991: 1 };
const MOBILE_BREAKPOINT = 992;

const allProjects = [...workProjectsData, ...independentProjectsData];
const skills = Object.entries(
  allProjects.reduce<Record<string, number>>((a, c) => {
    c.tools.forEach((t) => {
      a[t] = (a[t] ?? 0) + 1;
    });
    return a;
  }, {}),
);

const DESIGN_SIDEBAR_STYLE: React.CSSProperties = {
  width: '100%',
  maxHeight: '100vh',
  overflow: 'auto',
  paddingRight: 0,
  boxSizing: 'border-box',
  flexShrink: 1,
  minWidth: 0,
  padding: 'var(--space-sm)',
};

export function Main({ initialView = 'welcome' }: { initialView?: string }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [view, setView] = useState(initialView);
  const [page, setPage] = useState('work');
  const onMobile = windowWidth < MOBILE_BREAKPOINT;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [ul, setUl] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const workVisible = true;

  // Apply stored design tokens + live-editing controls
  const {
    vars,
    setVar,
    elevationLevel,
    customElevation,
    setCustomElevation,
    activeColorPreset,
    applyColorPreset,
    activeShapePreset,
    applyShapePreset,
    applyElevation,
    warmFound,
    warmKeys,
    dismissWarmTones,
    autoFixWarmTones,
    recomputeDepthShadows,
    autoPopShadows,
  } = useDesignVars();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (view === 'main') {
      const el = document.getElementById('three-container');
      if (el) while (el.firstChild) el.removeChild(el.firstChild);
    }
  }, [view]);

  const titleSelector = () => {
    document.getElementById('masonrygrid')?.scrollIntoView();
    const MAP: Record<string, string> = {
      work: 'experience',
      projects: 'projects',
      hobbies: 'hobbies',
    };
    return MAP[page] ?? 'Not Found';
  };

  const sidebarProps = {
    page,
    setPage,
    showTools,
    setShowTools,
    ul,
    setUl,
    setModalShow,
    skills,
    workVisible,
  };

  const designPanelProps = {
    vars,
    setVar,
    colorPresets: COLOR_PRESETS,
    shapePresets: SHAPE_PRESETS,
    elevationPresets: ELEVATION_PRESETS,
    activeColorPreset,
    applyColorPreset,
    activeShapePreset,
    applyShapePreset,
    elevationLevel,
    applyElevation,
    customElevation,
    setCustomElevation,
    recomputeDepthShadows,
    autoPopShadows,
    warmFound,
    warmKeys,
    autoFixWarmTones,
    dismissWarmTones,
    sidebarStyle: DESIGN_SIDEBAR_STYLE,
  };

  return (
    <>
      {view === 'welcome' && <WelcomeView setView={setView} />}

      {view === 'main' && (
        <div className="view-2" style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Design system panel — slides in after 3 s */}
          <PushPanel
            label="design"
            width={360}
            revealDelay={3000}
            panelStyle={{ padding: 0, overflowY: 'auto' }}
          >
            <TokenSidebar {...designPanelProps} />
          </PushPanel>

          {onMobile ? (
            <>
              <button
                onClick={() => {
                  setMobileNavOpen(true);
                }}
                style={{
                  position: 'fixed',
                  top: 'var(--space-xs)',
                  left: 'var(--space-xs)',
                  zIndex: 50,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text)',
                  padding: 'var(--space-xxs)',
                  lineHeight: 1,
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
            <div
              style={{
                width: 'var(--sidebar-width)',
                flexShrink: 0,
                padding: 'var(--space-md)',
                overflowY: 'auto',
                maxHeight: '100vh',
                position: 'sticky',
                top: 0,
              }}
            >
              <h1 style={{ marginBottom: 'var(--space-md)' }}>Ian Rios</h1>
              <PortfolioSidebar {...sidebarProps} />
            </div>
          )}

          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              minWidth: 0,
              paddingTop: onMobile ? '60px' : 0,
            }}
          >
            <div style={{ textAlign: 'center', padding: 'var(--space-sm) 0' }}>
              <h2 style={{ cursor: 'default', margin: 0 }}>
                {titleSelector()}
              </h2>
            </div>
            <div
              className="hide-scrollbars"
              style={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}
            >
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                id="masonrygrid"
                columnClassName="my-masonry-grid_column"
              >
                {page === 'work' &&
                  workProjectsData.map((item, i) => (
                    <MasonryCard key={i} item={item} index={i} />
                  ))}
                {page === 'projects' &&
                  independentProjectsData.map((item, i) => (
                    <MasonryCard key={i} item={item} index={i} />
                  ))}
                {page === 'hobbies' &&
                  hobbyData.map((item, i) => (
                    <MasonryCard key={i} item={item} index={i} />
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
