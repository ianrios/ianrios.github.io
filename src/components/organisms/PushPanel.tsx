import { useState, useEffect } from 'react';
import type React from 'react';
import { Icon } from '../atoms/Icon';

export type PushPanelTabVariant = 'stacked' | 'rotated' | 'grip' | 'pill';

const TAB_W: Record<PushPanelTabVariant, number> = {
  stacked: 28,
  rotated: 28,
  grip: 28,
  pill: 40,
};

function StackedLabel({ label, open }: { label: string; open: boolean }) {
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

function RotatedLabel({ label, open }: { label: string; open: boolean }) {
  return (
    <span className="skeu-push-tab__rotated">
      <Icon name={open ? 'chevron-left' : 'chevron-right'} size={10} />
      <span>{open ? 'close' : label}</span>
    </span>
  );
}

function GripLabel({ open }: { open: boolean }) {
  return (
    <span className="skeu-push-tab__grip">
      <Icon name="grip-vertical" size={14} />
      <Icon name={open ? 'chevron-left' : 'chevron-right'} size={8} />
    </span>
  );
}

function PillLabel({ open }: { open: boolean }) {
  return <Icon name={open ? 'chevron-left' : 'chevron-right'} size={14} />;
}

/**
 * PushPanel — collapsible side panel that pushes content.
 *
 * revealDelay (ms): tab hidden until this many ms after mount.
 * Default 0 = always visible. e.g. 3000 reveals after 3 s.
 *
 * tabVariant: controls the tab affordance design.
 *   'stacked' (default) — per-character vertical label + < / > caret
 *   'rotated'           — CSS writing-mode vertical text + chevron icon
 *   'grip'              — drag-handle dots + small directional chevron
 *   'pill'              — wide rounded tab, chevron only
 */
export function PushPanel({
  children,
  label = 'panel',
  defaultOpen = false,
  width = 400,
  header,
  revealDelay = 0,
  tabVariant = 'stacked',
  onOpenChange,
}: {
  children?: React.ReactNode;
  label?: string;
  defaultOpen?: boolean;
  /** Pixel number or any CSS length e.g. '25vw', 'clamp(320px, 22vw, 440px)' */
  width?: number | string;
  /** Non-scrolling zone above the body. Use for back links or panel titles. */
  header?: React.ReactNode;
  revealDelay?: number;
  tabVariant?: PushPanelTabVariant;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [tabShown, setTabShown] = useState(revealDelay === 0);
  const tabW = TAB_W[tabVariant];
  const openWidth = typeof width === 'number' ? `${width}px` : width;

  useEffect(() => {
    if (revealDelay === 0) return;
    const t = setTimeout(() => {
      setTabShown(true);
    }, revealDelay);
    return () => {
      clearTimeout(t);
    };
  }, [revealDelay]);

  const variantClass =
    tabVariant !== 'stacked' ? `skeu-push-tab--${tabVariant}` : '';

  return (
    <div className="skeu-push-panel">
      {/* Trigger tab */}
      <button
        onClick={() => {
          const next = !open;
          setOpen(next);
          onOpenChange?.(next);
        }}
        className={['skeu-push-tab', variantClass, tabShown ? '' : 'is-hidden']
          .filter(Boolean)
          .join(' ')}
        style={{ width: tabW }}
        aria-label={open ? `Close ${label} panel` : `Open ${label} panel`}
        title={open ? `Close ${label} panel` : `Open ${label} panel`}
      >
        {tabVariant === 'stacked' && <StackedLabel label={label} open={open} />}
        {tabVariant === 'rotated' && <RotatedLabel label={label} open={open} />}
        {tabVariant === 'grip' && <GripLabel open={open} />}
        {tabVariant === 'pill' && <PillLabel open={open} />}
      </button>

      {/* Collapsible panel */}
      <div
        className="skeu-push-panel__clip"
        style={{
          '--panel-width': open ? openWidth : '0px',
        }}
      >
        <div className="skeu-push-panel__inner">
          {header && <div className="skeu-push-panel__header">{header}</div>}
          <div className="skeu-push-panel__body">{children}</div>
        </div>
      </div>
    </div>
  );
}
