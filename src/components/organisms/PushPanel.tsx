import { useState, useEffect } from 'react';
import type React from 'react';

const TAB_W = 28;

function TabLabel({ label, open }: { label: string; open: boolean }) {
  const word = open ? 'close' : label;
  return (
    <span className="skeu-push-tab__letters">
      {word.split('').map((c, i) => (
        <span key={i}>{c}</span>
      ))}
      <span className="skeu-push-tab__caret">{open ? '<' : '>'}</span>
    </span>
  );
}

/**
 * PushPanel — collapsible side panel that pushes content.
 *
 * revealDelay (ms): tab hidden until this many ms after mount.
 * Default 0 = always visible. e.g. 3000 reveals after 3 s.
 */
export function PushPanel({
  children,
  label = 'panel',
  defaultOpen = false,
  width = 400,
  panelStyle,
  revealDelay = 0,
}: {
  children?: React.ReactNode;
  label?: string;
  defaultOpen?: boolean;
  width?: number;
  panelStyle?: React.CSSProperties;
  revealDelay?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [tabShown, setTabShown] = useState(revealDelay === 0);

  useEffect(() => {
    if (revealDelay === 0) return;
    const t = setTimeout(() => {
      setTabShown(true);
    }, revealDelay);
    return () => {
      clearTimeout(t);
    };
  }, [revealDelay]);

  return (
    <div
      style={{
        display: 'flex',
        flexShrink: 0,
        height: '100%',
        alignSelf: 'stretch',
      }}
    >
      {/* Trigger tab */}
      <button
        onClick={() => {
          setOpen((o) => !o);
        }}
        className="skeu-push-tab"
        style={{
          width: TAB_W,
          transform: tabShown ? 'translateX(0)' : 'translateX(-100%)',
          opacity: tabShown ? 1 : 0,
          transition: 'transform 0.5s ease, opacity 0.5s ease',
          pointerEvents: tabShown ? 'auto' : 'none',
        }}
        aria-label={open ? `Close ${label} panel` : `Open ${label} panel`}
        title={open ? `Close ${label} panel` : `Open ${label} panel`}
      >
        <TabLabel label={label} open={open} />
      </button>

      {/* Collapsible panel */}
      <div
        style={{
          width: open ? width : 0,
          transition: 'width var(--anim-speed, 0.12s) ease',
          overflow: 'hidden',
          flexShrink: 0,
          height: '100%',
        }}
      >
        <div
          style={{
            width,
            height: '100%',
            overflowY: 'auto',
            borderRight: '1px solid var(--border-color)',
            ...panelStyle,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
