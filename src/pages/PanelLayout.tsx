import { lazy, Suspense } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { PushPanel } from '../components/organisms/PushPanel';
import { Stack } from '../components/atoms/Stack';
import { FunPanel } from './FunPanel';
import { THEMES } from './admin/adminData';
import { useDesignPanel } from '../hooks/designPanelContext';
import { useDesignVars } from '../hooks/designVarsContext';
import { useNavChrome } from '../hooks/navChromeContext';

// Stays lazy (same chunk boundary as the rest of /design-system) - the
// full per-token sidebar has no business in the main entry bundle just
// because this layout now decides which panel content to show.
const TokenSidebar = lazy(() =>
  import('./admin/TokenSidebar').then((m) => ({ default: m.TokenSidebar })),
);

// ONE PushPanel instance shared by every route that has one (/, /about,
// /contact, /design-system), mounted here instead of once per page. Each
// page used to render its own <PushPanel>, so navigating between them
// unmounted and remounted a brand new instance every time - the panel had
// no stable identity across routes, which is what made it visibly slide/
// jump during page transitions and replay its reveal delay on every page
// (the shared `revealed` flag was already true by the time a fresh
// instance mounted, so it just appeared instead of transitioning).
// Content inside swaps between FunPanel (portfolio pages) and the full
// TokenSidebar (/design-system) - literally the same component Ian asked
// for, not four different ones.
export function PanelLayout() {
  const location = useLocation();
  const { hidden } = useNavChrome();
  const { open, setOpen, revealed, setRevealed } = useDesignPanel();
  const { vars, setVar, activeTheme, applyTheme, resetAll } = useDesignVars();

  const isDesignSystem = location.pathname === '/design-system';

  // <Outlet/> (and everything it renders, including Home's own view state)
  // must stay in the exact same tree position regardless of `hidden` -
  // conditionally returning a DIFFERENT tree shape here (e.g. bailing out
  // to a bare <Outlet/> when hidden) makes React treat it as a totally
  // different tree and remount everything under it, including Main. A
  // fresh Main mount re-reads its view state from scratch and lands back
  // on the splash - which is exactly the "click Enter, get redirected
  // back to the splash, have to click Enter again" bug: clicking Enter
  // sets view='main', which flips `hidden` to false one render later,
  // which used to swap tree shapes and blow the freshly-set state away.
  // Only the PushPanel sibling toggles now; Outlet's position never moves.
  return (
    <Stack direction="row" height="100vh" overflow="hidden">
      {hidden ? (
        // Same width as the real closed tab (see .skeu-push-panel-placeholder,
        // _organisms.scss) - reserves the identical flex space the real
        // PushPanel below will occupy once mounted, so appearing/hiding
        // between the splash and main views never changes the row's width.
        <div className="skeu-push-panel-placeholder" aria-hidden="true" />
      ) : (
        <PushPanel
          className="skeu-push-panel--main"
          label="design"
          width="clamp(320px, 22vw, 440px)"
          revealDelay={3000}
          tabVariant="rotated"
          open={open}
          onOpenChange={setOpen}
          revealed={revealed}
          onRevealed={() => {
            setRevealed(true);
          }}
        >
          {isDesignSystem ? (
            <Suspense fallback={null}>
              <TokenSidebar
                vars={vars}
                setVar={setVar}
                themes={THEMES}
                activeTheme={activeTheme}
                applyTheme={applyTheme}
                resetAll={resetAll}
              />
            </Suspense>
          ) : (
            <FunPanel />
          )}
        </PushPanel>
      )}

      <Stack direction="col" flex="1" overflow="hidden">
        <Outlet />
      </Stack>
    </Stack>
  );
}
