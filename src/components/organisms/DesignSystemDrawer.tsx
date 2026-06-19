import type React from 'react';
import { PushPanel } from './PushPanel';
import { TokenSidebar } from '../../pages/admin/TokenSidebar';
import { PageLayout } from './PageLayout';
import {
  COLOR_PRESETS,
  SHAPE_PRESETS,
  ELEVATION_PRESETS,
} from '../../pages/admin/adminData';
import { useDesignVars } from '../../hooks/useDesignVars';

const PANEL_PX = 400;

const SIDEBAR_STYLE: React.CSSProperties = {
  maxHeight: 'none',
  overflow: 'visible',
  width: '100%',
  paddingRight: 0,
  flexShrink: 1,
  minWidth: 0,
  boxSizing: 'border-box',
};

export function DesignSystemDrawer() {
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

  return (
    <PushPanel label="design" width={PANEL_PX}>
      <PageLayout
        style={{
          borderRadius: 0,
          padding: 'var(--space-sm)',
          minHeight: '100%',
        }}
      >
        <TokenSidebar
          vars={vars}
          setVar={setVar}
          colorPresets={COLOR_PRESETS}
          shapePresets={SHAPE_PRESETS}
          elevationPresets={ELEVATION_PRESETS}
          activeColorPreset={activeColorPreset}
          applyColorPreset={applyColorPreset}
          activeShapePreset={activeShapePreset}
          applyShapePreset={applyShapePreset}
          elevationLevel={elevationLevel}
          applyElevation={applyElevation}
          customElevation={customElevation}
          setCustomElevation={setCustomElevation}
          recomputeDepthShadows={recomputeDepthShadows}
          autoPopShadows={autoPopShadows}
          warmFound={warmFound}
          warmKeys={warmKeys}
          autoFixWarmTones={autoFixWarmTones}
          dismissWarmTones={dismissWarmTones}
          sidebarStyle={SIDEBAR_STYLE}
        />
      </PageLayout>
    </PushPanel>
  );
}
