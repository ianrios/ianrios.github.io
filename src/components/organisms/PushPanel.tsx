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
  className,
  label = 'panel',
  defaultOpen = false,
  width = 400,
  header,
  revealDelay = 0,
  tabVariant = 'stacked',
  onOpenChange,
  open: controlledOpen,
  revealed: controlledRevealed,
  onRevealed,
}: {
  children?: React.ReactNode;
  /** Extra class on the root element - e.g. the one persistent instance in
   * PanelLayout uses this to opt into view-transition-name, which the
   * component demo (five simultaneous instances) must never do. */
  className?: string;
  label?: string;
  defaultOpen?: boolean;
  /** Pixel number or any CSS length e.g. '25vw', 'clamp(320px, 22vw, 440px)' */
  width?: number | string;
  /** Non-scrolling zone above the body. Use for back links or panel titles. */
  header?: React.ReactNode;
  revealDelay?: number;
  tabVariant?: PushPanelTabVariant;
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state (shared across routes). Omit for internal state. */
  open?: boolean;
  /** Controlled reveal state, so a remount does not replay the delay. */
  revealed?: boolean;
  onRevealed?: () => void;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const [internalTabShown, setInternalTabShown] = useState(revealDelay === 0);
  const tabShown = (controlledRevealed ?? false) || internalTabShown;
  const tabW = TAB_W[tabVariant];
  const openWidth = typeof width === 'number' ? `${width}px` : width;

  useEffect(() => {
    if (revealDelay === 0 || (controlledRevealed ?? false)) return;
    const t = setTimeout(() => {
      setInternalTabShown(true);
      onRevealed?.();
    }, revealDelay);
    return () => {
      clearTimeout(t);
    };
  }, [revealDelay, controlledRevealed, onRevealed]);

  const variantClass =
    tabVariant !== 'stacked' ? `skeu-push-tab--${tabVariant}` : '';
  const widthClass = `skeu-push-tab--width-${tabW}`;

  return (
    <div className={['skeu-push-panel', className].filter(Boolean).join(' ')}>
      {/* Trigger tab */}
      <button
        onClick={() => {
          const next = !open;
          if (controlledOpen === undefined) setInternalOpen(next);
          onOpenChange?.(next);
        }}
        className={[
          'skeu-push-tab',
          variantClass,
          widthClass,
          tabShown ? '' : 'is-hidden',
        ]
          .filter(Boolean)
          .join(' ')}
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
