import { useState } from 'react';
import type React from 'react';
import { Main } from './Home';
import { TokenSidebar } from './admin/TokenSidebar';
import { DSPreview } from './admin/DSPreview';
import { V2Preview } from './admin/V2Preview';
import {
  COLOR_PRESETS,
  SHAPE_PRESETS,
  ELEVATION_PRESETS,
} from './admin/adminData';
import { PageLayout } from '../components/organisms/PageLayout';
import { PushPanel } from '../components/organisms/PushPanel';
import { useDesignVars } from '../hooks/useDesignVars';

const TABS = [
  { id: 'design', label: 'Design System' },
  { id: 'v2', label: 'Portfolio v2 Preview' },
  { id: 'home', label: 'Home (live)' },
];

const SIDEBAR_STYLE: React.CSSProperties = {
  maxHeight: 'none',
  overflow: 'visible',
  width: '100%',
  paddingRight: 0,
  flexShrink: 1,
  minWidth: 0,
  boxSizing: 'border-box',
};

function Admin() {
  const [activeView, setActiveView] = useState('design');

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
    exportText,
  } = useDesignVars();

  const tokenSidebarProps = {
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
    sidebarStyle: SIDEBAR_STYLE,
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      <PushPanel label="controls" defaultOpen width={400}>
        <PageLayout
          style={{
            borderRadius: 0,
            padding: 'var(--space-sm)',
            minHeight: '100%',
          }}
        >
          <TokenSidebar {...tokenSidebarProps} />
        </PageLayout>
      </PushPanel>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          minWidth: 0,
          padding: '24px 24px 48px',
        }}
      >
        <h2>/admin — Design tokens</h2>
        <p style={{ opacity: 0.6, fontSize: 14 }}>
          Changes persist to localStorage and apply to the whole page
          immediately.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              className={`skeu-btn ${activeView === id ? 'skeu-btn--primary' : 'skeu-btn--outline'}`}
              onClick={() => {
                setActiveView(id);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {activeView === 'design' && <DSPreview exportText={exportText} />}
        {activeView === 'v2' && <V2Preview />}
        {activeView === 'home' && (
          <div
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'auto',
              height: 'calc(100vh - 220px)',
            }}
          >
            <Main initialView="main" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
