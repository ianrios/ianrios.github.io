import React, { useState, useEffect } from "react";
import { independentProjectsData, hobbyData, workProjectsData } from "../data";
import Masonry from "react-masonry-css";
import MetaBalls from "../MetaBalls";
import MasonryCard from "../components/masonry-card";
import { PortfolioSidebar } from "../components/organisms/PortfolioSidebar";
import { ContactModal } from "../components/organisms/ContactModal";
import { PushPanel } from "../components/organisms/PushPanel";
import { Icon } from "../components/atoms/Icon";
import { IconButton } from "../components/atoms/IconButton";
import { TokenSidebar } from "./admin/TokenSidebar";
import { useDesignVars } from "../hooks/useDesignVars";
import { COLOR_PRESETS, SHAPE_PRESETS, ELEVATION_PRESETS } from "./admin/adminData";

const breakpointColumnsObj = { default: 3, 992: 3, 991: 1 };
const MOBILE_BREAKPOINT = 992;

const colors = ["74A57F","D30C7B","57E2E5","A50104","EBF8B8","7FB069","EFCA08","A14DA0","D11149","A9FFF7","97CC04","31E981","F0C808","2EC4B6","6320EE","00D9C0"];

const skills = Object.entries(
  [...workProjectsData, ...independentProjectsData].reduce((a, c) => {
    c.tools.forEach((t) => { a[t] = (a[t] || 0) + 1; });
    return a;
  }, {})
);

const DESIGN_SIDEBAR_STYLE = {
  width: "100%",
  maxHeight: "100vh",
  overflow: "auto",
  paddingRight: 0,
  boxSizing: "border-box",
  flexShrink: 1,
  minWidth: 0,
  padding: "var(--space-sm)",
};

export function Main({ initialView = "welcome" }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [view, setView]               = useState(initialView);
  const [page, setPage]               = useState("work");
  const [onMobile, setOnMobile]       = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [ul, setUl]                   = useState(true);
  const [modalShow, setModalShow]     = useState(false);
  const [showTools, setShowTools]     = useState(false);

  const workVisible = true;

  // Apply stored design tokens and provide live-editing controls for the design panel
  const {
    vars, setVar,
    elevationLevel, customElevation, setCustomElevation,
    activeColorPreset, applyColorPreset,
    activeShapePreset, applyShapePreset,
    applyElevation,
    warmFound, warmKeys, setWarmFound, setWarmKeys,
    autoFixWarmTones, recomputeDepthShadows, autoPopShadows,
    exportText,
  } = useDesignVars();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { setOnMobile(windowWidth < MOBILE_BREAKPOINT); }, [windowWidth]);

  useEffect(() => {
    if (view === "main") {
      const el = document.getElementById("three-container");
      if (el) while (el.firstChild) el.removeChild(el.firstChild);
    }
  }, [view]);

  const titleSelector = () => {
    document.getElementById("masonrygrid")?.scrollIntoView();
    return { work: "experience", projects: "projects", hobbies: "hobbies" }[page] || "Not Found";
  };

  const sidebarProps = { page, setPage, showTools, setShowTools, ul, setUl, setModalShow, skills, workVisible };

  const designPanelProps = {
    vars, setVar,
    colorPresets: COLOR_PRESETS, shapePresets: SHAPE_PRESETS, elevationPresets: ELEVATION_PRESETS,
    activeColorPreset, applyColorPreset,
    activeShapePreset, applyShapePreset,
    elevationLevel, applyElevation,
    customElevation, setCustomElevation,
    recomputeDepthShadows, autoPopShadows,
    warmFound, warmKeys, autoFixWarmTones, setWarmFound, setWarmKeys,
    exportText,
    sidebarStyle: DESIGN_SIDEBAR_STYLE,
  };

  return (
    <>
      {view === "welcome" && (
        <div className="view-1">
          <MetaBalls />
          {/* role="button" so this decorative text is still keyboard-reachable as a secondary entry point */}
          <p
            className={`name montserrat special-p color-${colors[(colors.length * Math.random()) | 0]}`}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onClick={() => setView("main")}
            onKeyDown={(e) => e.key === "Enter" && setView("main")}
          >
            Ian Rios
          </p>
          <p className="special-b" style={{ textAlign: "center" }}>
            <button className="open-link montserrat" onClick={() => setView("main")}>enter</button>
          </p>
        </div>
      )}

      {view === "main" && (
        <div className="view-2" style={{ display: "flex", minHeight: "100vh" }}>

          {/* Design system panel — slides in after 3s, lets visitors tweak the live design tokens */}
          <PushPanel label="design" width={360} revealDelay={3000} panelStyle={{ padding: 0, overflowY: "auto" }}>
            <TokenSidebar {...designPanelProps} />
          </PushPanel>

          {onMobile ? (
            <>
              <button
                onClick={() => setMobileNavOpen(true)}
                style={{ position: "fixed", top: "var(--space-xs)", left: "var(--space-xs)", zIndex: 50, background: "none", border: "none", cursor: "pointer", color: "var(--color-text)", padding: "var(--space-xxs)", lineHeight: 1 }}
                aria-label="Open navigation"
              >
                <Icon name="menu" size={28} />
              </button>

              {mobileNavOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
                  <div
                    role="presentation"
                    style={{ position: "absolute", inset: 0, background: "var(--overlay-bg)" }}
                    onClick={() => setMobileNavOpen(false)}
                  />
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "var(--drawer-width)", background: "var(--color-surface)", padding: "var(--space-md)", overflowY: "auto", zIndex: 201, boxShadow: "var(--pop-shadow-dark)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-sm)" }}>
                      <h1 style={{ margin: 0 }}>Ian Rios</h1>
                      <IconButton name="close" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />
                    </div>
                    <PortfolioSidebar {...sidebarProps} onClose={() => setMobileNavOpen(false)} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ width: "var(--sidebar-width)", flexShrink: 0, padding: "var(--space-md)", overflowY: "auto", maxHeight: "100vh", position: "sticky", top: 0 }}>
              <h1 style={{ marginBottom: "var(--space-md)" }}>Ian Rios</h1>
              <PortfolioSidebar {...sidebarProps} />
            </div>
          )}

          <div style={{ flex: 1, overflow: "hidden", minWidth: 0, paddingTop: onMobile ? "60px" : 0 }}>
            <div style={{ textAlign: "center", padding: "var(--space-sm) 0" }}>
              <h2 style={{ cursor: "default", margin: 0 }}>{titleSelector()}</h2>
            </div>
            <div className="hide-scrollbars" style={{ height: "calc(100vh - 80px)", overflowY: "auto" }}>
              <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" id="masonrygrid" columnClassName="my-masonry-grid_column">
                {page === "work"     && workProjectsData.map((item, i) => <MasonryCard key={i} item={item} index={i} />)}
                {page === "projects" && independentProjectsData.map((item, i) => <MasonryCard key={i} item={item} index={i} />)}
                {page === "hobbies"  && hobbyData.map((item, i) => <MasonryCard key={i} item={item} index={i} />)}
              </Masonry>
            </div>
          </div>

          <ContactModal show={modalShow} onHide={() => setModalShow(false)} />
        </div>
      )}
    </>
  );
}
