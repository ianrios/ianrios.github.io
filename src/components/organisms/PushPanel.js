import React, { useState, useEffect } from "react";

const TAB_W = 28;

function TabLabel({ label, open }) {
  const word = open ? "close" : label;
  return (
    <span className="skeu-push-tab__letters">
      {word.split("").map((c, i) => <span key={i}>{c}</span>)}
      <span className="skeu-push-tab__caret">{open ? "<" : ">"}</span>
    </span>
  );
}

/**
 * PushPanel — a collapsible side panel that pushes page content rather than overlaying it.
 *
 * revealDelay (ms): tab is hidden until this many ms after mount, then slides in.
 *   Default 0 = always visible. Use e.g. 3000 to reveal after 3 seconds.
 */
export function PushPanel({ children, label = "panel", defaultOpen = false, width = 400, panelStyle, revealDelay = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  const [tabShown, setTabShown] = useState(revealDelay === 0);

  useEffect(() => {
    if (revealDelay === 0) return;
    const t = setTimeout(() => setTabShown(true), revealDelay);
    return () => clearTimeout(t);
  }, [revealDelay]);

  return (
    <div style={{ display: "flex", flexShrink: 0, height: "100%", alignSelf: "stretch" }}>

      {/* Trigger tab — slides in after revealDelay, always visible if revealDelay === 0 */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="skeu-push-tab"
        style={{
          width: TAB_W,
          transform: tabShown ? "translateX(0)" : "translateX(-100%)",
          opacity: tabShown ? 1 : 0,
          transition: "transform 0.5s ease, opacity 0.5s ease",
          pointerEvents: tabShown ? "auto" : "none",
        }}
        aria-label={open ? `Close ${label} panel` : `Open ${label} panel`}
        title={open ? `Close ${label} panel` : `Open ${label} panel`}
      >
        <TabLabel label={label} open={open} />
      </button>

      {/* Collapsible panel — width animates with the global anim-speed token */}
      <div
        style={{
          width: open ? width : 0,
          transition: "width var(--anim-speed, 0.12s) ease",
          overflow: "hidden",
          flexShrink: 0,
          height: "100%",
        }}
      >
        <div
          style={{
            width,
            height: "100%",
            overflowY: "auto",
            borderRight: "1px solid var(--border-color)",
            ...panelStyle,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
