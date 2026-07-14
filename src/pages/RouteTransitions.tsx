import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { applyNavDirection } from './navDirection';
import { useDesignPanel } from '../hooks/designPanelContext';

// Route chunk preloaders: hovering an internal link warms the lazy chunk
// so the view-transition snapshot pans to the page, not the Suspense
// fallback. Paths must mirror the lazy imports in App.tsx.
const ROUTE_PRELOADS: Record<string, () => Promise<unknown>> = {
  '/design-system': () => import('./Admin'),
  '/metaballs': () => import('../three/ThreeScene'),
};

function internalAnchorOf(
  target: EventTarget | null,
): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest('a');
  if (!anchor || anchor.target === '_blank') return null;
  const href = anchor.getAttribute('href');
  return href?.startsWith('/') ? anchor : null;
}

// Papers-on-a-table page transitions, intercepted at the router level so
// every internal RouterLink inherits them with zero call-site changes.
// The capture-phase preventDefault makes RouterLink's own handler bail
// (it checks defaultPrevented), leaving this navigate as the only one.
export function RouteTransitions() {
  const navigate = useNavigate();
  const { open: panelOpen, setOpen: setPanelOpen } = useDesignPanel();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = internalAnchorOf(e.target);
      const to = anchor?.getAttribute('href') ?? null;
      if (to === null) return;
      const navView = anchor?.dataset.navView;

      // This intercept replaces <Link>'s own navigate() entirely (that's
      // why RouterLink's state prop alone doesn't work), so the intended
      // view has to be read back off the DOM via data-nav-view (set by
      // Button for any link with a routerState). Internal links to '/'
      // with no view of their own still default to 'main' - returning
      // "home" via the remote must never replay the splash.
      const options =
        navView !== undefined
          ? { state: { view: navView } }
          : to === '/'
            ? { state: { view: 'main' } }
            : undefined;

      // Cross-page navigate: the papers-on-a-table pan under motion, a
      // plain instant navigate under reduced motion or if unsupported.
      const navigateAcrossPages = () => {
        if (
          reducedMotion.matches ||
          typeof document.startViewTransition !== 'function'
        ) {
          navigate(to, options);
          return;
        }
        applyNavDirection(window.location.pathname, to);
        document.startViewTransition(() => {
          flushSync(() => {
            navigate(to, options);
          });
        });
      };

      // "title" normally returns to the MetaBalls splash. While the design
      // panel is open, close it first and let its own close transition
      // finish before panning away - firing both at once was the exact
      // collision Ian's original ask ("close the design system tab first
      // ... before closing the site") was trying to avoid. Still ONE
      // click, not two: closing the panel doesn't stop the navigation, it
      // just staggers it a beat behind the panel's own close animation.
      if (navView === 'welcome' && panelOpen) {
        e.preventDefault();
        setPanelOpen(false);
        const goNow = () => {
          // Same-path (title clicked from '/' itself): no page to pan
          // between, just a view swap via router state - matches how this
          // always worked before the gating above existed.
          if (to === window.location.pathname) navigate(to, options);
          else navigateAcrossPages();
        };
        if (reducedMotion.matches) {
          goNow();
        } else {
          const closeMs =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                '--anim-speed',
              ),
            ) * 1000 || 120;
          window.setTimeout(goNow, closeMs);
        }
        return;
      }

      // Default path: only intercept an actual page change. A same-path
      // click (to === from) is left to RouterLink's own bubble-phase
      // handler, unprevented.
      if (to === window.location.pathname) return;
      e.preventDefault();
      navigateAcrossPages();
    };

    const onPointerOver = (e: PointerEvent) => {
      const to = internalAnchorOf(e.target)?.getAttribute('href') ?? null;
      if (to === null) return;
      void ROUTE_PRELOADS[to]?.();
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerover', onPointerOver);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerover', onPointerOver);
    };
  }, [navigate, panelOpen, setPanelOpen]);

  return null;
}
