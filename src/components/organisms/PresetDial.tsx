import { useLayoutEffect, useRef, useState } from 'react';
import type React from 'react';
import { useDesignVars } from '../../hooks/designVarsContext';
import { useDesignPanel } from '../../hooks/designPanelContext';
import { clampPosition, type NavPosition } from './floating-nav-position';
import { SORTED_THEME_NAMES, blendThemeVars } from './presetTheme';
import { Dial } from '../atoms/Dial';
import { Heading } from '../atoms/Heading';
import { Icon } from '../atoms/Icon';

const NUDGE_PX = 16;

// A separate floating "remote" for theme presets, on the same architecture
// as FloatingNav (fixed position, draggable via a grip, session-only - see
// FloatingNav.tsx for why nothing here persists to localStorage either).
// Deliberately its own overlay rather than in-flow content inside PushPanel:
// its docked position only LOOKS like it lives in the panel; structurally
// it's independent, so dragging it clear of the panel's own box means its
// on-screen position never depends on how anything else in the document is
// laid out - the whole reason it exists is that the panel's own content
// (and the rest of the page) can resize/reflow around a theme change
// without the dial's own screen position ever moving with it.
export function PresetDial({ inline = false }: { inline?: boolean }) {
  const { setVar, activeTheme, applyTheme } = useDesignVars();
  const { open: panelOpenState } = useDesignPanel();
  const panelOpen = inline || panelOpenState;
  const panelRef = useRef<HTMLElement>(null);
  const grabOffset = useRef<{ dx: number; dy: number } | null>(null);
  const [pos, setPos] = useState<NavPosition | null>(null);
  // Suppresses the close/reopen CSS transition while actively dragging, so
  // drags snap 1:1 to the pointer like FloatingNav instead of easing.
  const [isDragging, setIsDragging] = useState(false);
  // Forgets any drag the instant the panel closes (self-terminating via the
  // pos !== null guard) - a plain "adjust state during render" reset, not
  // an effect, which would fire one frame late and trips the
  // set-state-in-effect lint rule besides.
  if (!panelOpenState && pos !== null) setPos(null);
  const [dialValue, setDialValue] = useState(() => {
    const idx = SORTED_THEME_NAMES.indexOf(activeTheme ?? '');
    return idx >= 0 ? idx : 0;
  });
  // The dial must fit inside the push panel's real width. Deliberately NOT
  // measured from the live .skeu-push-panel__clip element: its width
  // animates open via a CSS transition, so a measurement taken the instant
  // panelOpenState flips true catches it mid-transition (often ~0px) and
  // never gets a second chance to correct - which is exactly why the
  // constraint below was silently never applying and the dial stayed at
  // its full uncapped size no matter how much other padding was trimmed.
  // clamp(320px, 22vw, 440px) is computed directly instead, matching the
  // same three numbers set on the panel's own `width` prop (Home/About/
  // Contact.tsx) and --panel-open-width (_organisms.scss) - keep all three
  // in sync by hand if that clamp ever changes.
  const [maxFieldSize, setMaxFieldSize] = useState<number | undefined>();
  useLayoutEffect(() => {
    if (inline) return;
    const measure = () => {
      const panelWidth = Math.min(440, Math.max(320, window.innerWidth * 0.22));
      const style = panelRef.current && getComputedStyle(panelRef.current);
      const padX = style
        ? parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
        : 16;
      setMaxFieldSize(Math.max(80, panelWidth - padX));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
    };
  }, [inline]);

  const clampToViewport = (next: NavPosition): NavPosition => {
    if (inline) return next;
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return next;
    return clampPosition(
      next,
      { width: rect.width, height: rect.height },
      { width: window.innerWidth, height: window.innerHeight },
    );
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (inline) return;
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    grabOffset.current = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const grab = grabOffset.current;
    if (!grab) return;
    setPos(clampToViewport({ x: e.clientX - grab.dx, y: e.clientY - grab.dy }));
  };

  const onPointerUp = () => {
    grabOffset.current = null;
    setIsDragging(false);
  };

  const onGripKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (inline) return;
    const deltas: Record<string, NavPosition> = {
      ArrowLeft: { x: -NUDGE_PX, y: 0 },
      ArrowRight: { x: NUDGE_PX, y: 0 },
      ArrowUp: { x: 0, y: -NUDGE_PX },
      ArrowDown: { x: 0, y: NUDGE_PX },
    };
    const delta = deltas[e.key];
    if (!delta) return;
    e.preventDefault();
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clampToViewport({ x: rect.left + delta.x, y: rect.top + delta.y }));
  };

  // Dial reports a continuous, unwrapped rotation (can drift outside
  // [0, N) mid-drag) - wrap it here, then split into the two adjacent
  // sorted presets blendThemeVars already knows how to mix. Landing
  // exactly on a label (a click, or a drag/nudge that lines up perfectly)
  // is a real theme switch via applyTheme, not a blend: it updates
  // state.theme itself so Reset and the "Modified" indicator see it as
  // that preset, unmodified, rather than a pile of overrides against
  // whatever theme was previously active.
  const applyDial = (v: number) => {
    setDialValue(v);
    const n = SORTED_THEME_NAMES.length;
    if (n === 0) return;
    const wrapped = ((v % n) + n) % n;
    const fromIndex = Math.floor(wrapped);
    const t = wrapped - fromIndex;
    const from = SORTED_THEME_NAMES[fromIndex];
    if (from === undefined) return;
    if (t === 0) {
      applyTheme(from);
      return;
    }
    const toIndex = (fromIndex + 1) % n;
    const to = SORTED_THEME_NAMES[toIndex] ?? from;
    blendThemeVars(setVar, from, to, t * 100);
  };

  return (
    <section
      ref={panelRef}
      aria-label="Presets"
      className={[
        'skeu-preset-dial',
        inline ? 'skeu-preset-dial--inline' : '',
        panelOpen ? '' : 'skeu-preset-dial--closed',
        isDragging ? 'is-dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      {...(pos !== null && !inline
        ? {
            // transform: 'none' is load-bearing: the docked CSS position
            // centers via translate(-50%,-50%), and without clearing it
            // here, that transform keeps shifting the dragged box away
            // from left/top by half its own size - the actual bug behind
            // both "can't drag past 2/5 of the screen" and "my pointer
            // isn't where I grabbed it".
            style: {
              left: pos.x,
              top: pos.y,
              right: 'auto',
              bottom: 'auto',
              transform: 'none',
            },
          }
        : {})}
    >
      <button
        className="skeu-preset-dial__grip"
        aria-label="Move presets (drag, or focus and use arrow keys)"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onGripKeyDown}
      >
        <Icon name="menu" size={14} />
      </button>
      <Heading level={4} className="skeu-preset-dial__title">
        presets
      </Heading>
      <Dial
        labels={SORTED_THEME_NAMES}
        value={dialValue}
        onChange={applyDial}
        size="md"
        {...(!inline && maxFieldSize !== undefined ? { maxFieldSize } : {})}
      />
    </section>
  );
}
