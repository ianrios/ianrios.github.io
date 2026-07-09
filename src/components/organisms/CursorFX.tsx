import { useEffect, useRef } from 'react';
import { useDesignVars } from '../../hooks/designVarsContext';

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
