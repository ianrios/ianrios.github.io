import { useEffect, useRef } from 'react';
import { useDesignVars } from '../../hooks/designVarsContext';

// Elements the cursor treats as "interactive" for hover/active state.
// Scoped to a fixed selector list (not a computed `cursor: pointer` check,
// which would be expensive to evaluate on every pointerover).
const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, [role="button"]';

// Two independent pointer effects, each its own editable token:
//  --cursor-size  = a custom cursor dot that tracks the pointer INSTANTLY
//                   (and hides the native cursor, so only one shows).
//  --cursor-trail = a ring that EASES toward the pointer (the lag lives in
//                   the CSS transition). Both can be on at once.
// `inline` renders static swatches for the admin demo.
export function CursorFX({ inline = false }: { inline?: boolean }) {
  const { vars } = useDesignVars();
  const size = Number.parseInt(vars['--cursor-size'] ?? '0', 10);
  const trail = Number.parseInt(vars['--cursor-trail'] ?? '0', 10);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const active = size > 0 || trail > 0;

  useEffect(() => {
    if (inline || !active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    const onMove = (e: PointerEvent) => {
      const t = `translate(${e.clientX}px, ${e.clientY}px)`;
      dotRef.current?.style.setProperty('transform', t);
      trailRef.current?.style.setProperty('transform', t);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
    };
  }, [inline, active]);

  // Hover state: delegated at window, filtered to interactive targets only.
  // Click/active state: any pointerdown, regardless of target (matches the
  // native cursor's press feedback, which doesn't care what's under it).
  useEffect(() => {
    if (inline || !active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    const setHover = (on: boolean) => {
      dotRef.current?.classList.toggle('skeu-cursor-dot--hover', on);
      trailRef.current?.classList.toggle('skeu-cursor-trail--hover', on);
    };
    const setActive = (on: boolean) => {
      dotRef.current?.classList.toggle('skeu-cursor-dot--active', on);
      trailRef.current?.classList.toggle('skeu-cursor-trail--active', on);
    };
    const onPointerOver = (e: PointerEvent) => {
      const target = e.target;
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) {
        setHover(true);
      }
    };
    const onPointerOut = (e: PointerEvent) => {
      const target = e.target;
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) {
        setHover(false);
      }
    };
    const onPointerDown = () => {
      setActive(true);
    };
    const onPointerUp = () => {
      setActive(false);
    };
    window.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('pointerout', onPointerOut, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    // Also clear active state on cancel so a drag ending outside the
    // window (or an interrupted gesture) can't leave the dot stuck shrunk.
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [inline, active]);

  // Hide the native cursor only while the custom dot is shown.
  useEffect(() => {
    if (inline) return;
    const on =
      size > 0 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(hover: hover)').matches;
    const root = document.documentElement;
    root.classList.toggle('has-custom-cursor', on);
    return () => {
      root.classList.remove('has-custom-cursor');
    };
  }, [inline, size]);

  if (!inline && !active) return null;

  return (
    <>
      {(inline || trail > 0) && (
        <div
          ref={trailRef}
          aria-hidden="true"
          className={[
            'skeu-cursor-trail',
            inline ? 'skeu-cursor-trail--inline' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      )}
      {(inline || size > 0) && (
        <div
          ref={dotRef}
          aria-hidden="true"
          className={[
            'skeu-cursor-dot',
            inline ? 'skeu-cursor-dot--inline' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      )}
    </>
  );
}
