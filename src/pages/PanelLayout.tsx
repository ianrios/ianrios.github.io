import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PushPanel } from '../components/organisms/PushPanel';
import { Stack } from '../components/atoms/Stack';
import { THEMES } from './admin/adminData';
import { useDesignPanel } from '../hooks/designPanelContext';
import { useDesignVars } from '../hooks/designVarsContext';
import { useNavChrome } from '../hooks/navChromeContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Stays lazy - the full per-token sidebar (colors, spacing, motion, etc.)
// has no business in the main entry bundle just because it's now the one
// panel shown on every route; the closed/placeholder panel renders
// instantly, this chunk loads in behind it.
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
// TokenSidebar renders identically on every route that has this panel -
// portfolio pages used to show a truncated FunPanel with just one control;
// Ian asked for the literal same full panel everywhere, not a curated
// subset, so there is no longer a route branch here at all.
export function PanelLayout() {
  const { hidden } = useNavChrome();
  const { open, setOpen, revealed, setRevealed } = useDesignPanel();
  const { vars, setVar, activeTheme, applyTheme, resetAll } = useDesignVars();
  const onMobile = useMediaQuery('(max-width: 991px)');

  // Desktop's clamp(320px, 22vw, 440px) has a 320px floor that dominates a
  // narrow phone viewport - opening the panel there claimed ~80-85% of the
  // screen and could even overflow (320px floor + 28px tab already exceeds
  // some 320px-wide phones). min(320px, 82vw) keeps the same 320px ceiling
  // (continuous with the desktop clamp's floor right at the breakpoint) but
  // scales down on anything narrower, always leaving positive space for the
  // content column. Desktop's own clamp is untouched - PresetDial.tsx and
  // --panel-open-width (_organisms.scss) both hand-sync that value and are
  // unaffected since PresetDial is hidden under 991px anyway.

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
    <Stack
      direction="row"
      height="100vh"
      overflow="hidden"
      className="skeu-panel-row"
    >
      {hidden ? (
        // Matches whatever width the real tab currently has (see
        // .skeu-push-panel-placeholder, _organisms.scss) - reserves the
        // identical flex space the real PushPanel below will occupy once
        // mounted, so appearing/hiding between the splash and main views
        // never changes the row's width. The tab itself now claims 0 width
        // until `revealed` (see .skeu-push-tab.is-hidden) instead of always
        // reserving 28px behind an invisible tab, so this placeholder must
        // track the same boolean - a first-ever visit (revealed still
        // false) needs a 0-width placeholder too, or entering the site
        // would jump content over by 28px the instant the real panel
        // mounts, well before the tab is actually revealed.
        <div
          className={[
            'skeu-push-panel-placeholder',
            revealed ? '' : 'skeu-push-panel-placeholder--collapsed',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
        />
      ) : (
        <PushPanel
          className="skeu-push-panel--main"
          label="design"
          width={onMobile ? 'min(320px, 82vw)' : 'clamp(320px, 22vw, 440px)'}
          revealDelay={3000}
          tabVariant="rotated"
          open={open}
          onOpenChange={setOpen}
          revealed={revealed}
          onRevealed={() => {
            setRevealed(true);
          }}
        >
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
        </PushPanel>
      )}

      <Stack
        direction="col"
        flex="1"
        overflow="hidden"
        className="skeu-panel-content"
      >
        <Outlet />
      </Stack>
    </Stack>
  );
}
