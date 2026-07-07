import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { Icon } from '../atoms/Icon';
import {
  NAV_POSITION_KEY,
  clampPosition,
  parseStoredPosition,
  type NavPosition,
} from './floatingNav';

const NUDGE_PX = 16;

function loadStored(): NavPosition | null {
  try {
    return parseStoredPosition(localStorage.getItem(NAV_POSITION_KEY));
  } catch {
    return null;
  }
}

function persist(pos: NavPosition): void {
  try {
    localStorage.setItem(NAV_POSITION_KEY, JSON.stringify(pos));
  } catch {
    // localStorage unavailable (private mode) - position just won't stick
  }
}

// Draggable "remote control" panel. One global position shared across all
// routes (single {x,y}, per the concepts doc); null means the CSS default
// (bottom-right inset). `inline` renders it unpositioned for the admin demo.
export function FloatingNav({
  inline = false,
  children,
}: {
  inline?: boolean;
  children?: React.ReactNode;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const grabOffset = useRef<{ dx: number; dy: number } | null>(null);
  const [pos, setPos] = useState<NavPosition | null>(loadStored);

  const clampToViewport = useCallback((next: NavPosition): NavPosition => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return next;
    return clampPosition(
      next,
      { width: rect.width, height: rect.height },
      { width: window.innerWidth, height: window.innerHeight },
    );
  }, []);

  useEffect(() => {
    if (inline) return;
    const onResize = () => {
      setPos((p) => (p === null ? null : clampToViewport(p)));
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [inline, clampToViewport]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (inline) return;
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    grabOffset.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const grab = grabOffset.current;
    if (!grab) return;
    setPos(clampToViewport({ x: e.clientX - grab.dx, y: e.clientY - grab.dy }));
  };

  const onPointerUp = () => {
    if (!grabOffset.current) return;
    grabOffset.current = null;
    setPos((p) => {
      if (p !== null) persist(p);
      return p;
    });
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
    const next = clampToViewport({
      x: rect.left + delta.x,
      y: rect.top + delta.y,
    });
    setPos(next);
    persist(next);
  };

  return (
    <nav
      ref={panelRef}
      aria-label="Site"
      className={['skeu-floating-nav', inline ? 'skeu-floating-nav--inline' : '']
        .filter(Boolean)
        .join(' ')}
      {...(pos !== null && !inline
        ? { style: { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } }
        : {})}
    >
      <button
        className="skeu-floating-nav__grip"
        aria-label="Move navigation (drag, or focus and use arrow keys)"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onGripKeyDown}
      >
        <Icon name="menu" size={14} />
      </button>
      <div className="skeu-floating-nav__body">{children}</div>
    </nav>
  );
}
