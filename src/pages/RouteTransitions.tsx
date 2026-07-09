import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { applyNavDirection } from './navDirection';

// Route chunk preloaders: hovering an internal link warms the lazy chunk
// so the view-transition snapshot pans to the page, not the Suspense
// fallback. Paths must mirror the lazy imports in App.tsx.
const ROUTE_PRELOADS: Record<string, () => Promise<unknown>> = {
  '/design-system': () => import('./Admin'),
  '/metaballs': () => import('../three/ThreeScene'),
};

function internalHrefOf(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest('a');
  if (!anchor || anchor.target === '_blank') return null;
  const href = anchor.getAttribute('href');
  return href?.startsWith('/') ? href : null;
}

// Papers-on-a-table page transitions, intercepted at the router level so
// every internal RouterLink inherits them with zero call-site changes.
// The capture-phase preventDefault makes RouterLink's own handler bail
// (it checks defaultPrevented), leaving this navigate as the only one.
export function RouteTransitions() {
  const navigate = useNavigate();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (reducedMotion.matches) return;
      if (typeof document.startViewTransition !== 'function') return;
      const to = internalHrefOf(e.target);
      const from = window.location.pathname;
      if (to === null || to === from) return;
      e.preventDefault();
      applyNavDirection(from, to);
      // Internal links to '/' always land on the main view - returning
      // "home" via the remote must never replay the splash.
      const options = to === '/' ? { state: { view: 'main' } } : undefined;
      document.startViewTransition(() => {
        flushSync(() => {
          navigate(to, options);
        });
      });
    };

    const onPointerOver = (e: PointerEvent) => {
      const to = internalHrefOf(e.target);
      if (to === null) return;
      void ROUTE_PRELOADS[to]?.();
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerover', onPointerOver);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerover', onPointerOver);
    };
  }, [navigate]);

  return null;
}
