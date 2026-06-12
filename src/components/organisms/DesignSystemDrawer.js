import { PushPanel } from "./PushPanel";
import { TokenSidebar } from "../../pages/admin/TokenSidebar";
import { PageLayout } from "./PageLayout";
import {
  COLOR_PRESETS,
  SHAPE_PRESETS,
  ELEVATION_PRESETS,
} from "../../pages/admin/adminData";
import { useDesignVars } from "../../hooks/useDesignVars";

// Panel width in px — fixed so the CSS width transition can animate cleanly.
// Content is 400 - (space-sm × 2) ≈ 360px, which fits TokenSidebar's natural width.
const PANEL_PX = 400;

const SIDEBAR_STYLE = {
  maxHeight: "none",
  overflow: "visible",
  width: "100%",
  paddingRight: 0,
  flexShrink: 1,
  minWidth: 0,
  boxSizing: "border-box",
};

export function DesignSystemDrawer() {
  const {
    vars,
    setVar,
    setVars,
    elevationLevel,
    customElevation,
    setCustomElevation,
    activeColorPreset,
    applyColorPreset,
    activeShapePreset,
    applyShapePreset,
    applyElevation,
    resetAll,
    warmFound,
    warmKeys,
    setWarmFound,
    setWarmKeys,
    autoFixWarmTones,
    recomputeDepthShadows,
    autoPopShadows,
    copySuccess,
    exportCSS,
    exportText,
  } = useDesignVars();

  return (
    <PushPanel label="design" width={PANEL_PX}>
      <PageLayout
        style={{
          borderRadius: 0,
          padding: "var(--space-sm)",
          minHeight: "100%",
        }}
      >
        <TokenSidebar
          vars={vars}
          setVar={setVar}
          setVars={setVars}
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
          setWarmFound={setWarmFound}
          setWarmKeys={setWarmKeys}
          copySuccess={copySuccess}
          exportCSS={exportCSS}
          exportText={exportText}
          resetAll={resetAll}
          sidebarStyle={SIDEBAR_STYLE}
        />
      </PageLayout>
    </PushPanel>
  );
}
