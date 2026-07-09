# Phase 5 — Page transitions (papers-on-a-table)

Status: ✅ DONE — implemented, all checks green (98 tests). Ian steers the
feel (speed, 200vw double-hop) from the dev server.

## Outcome

Landed per the reviewed design: `RouteTransitions` (router-level capture
interceptor) + `navDirection.ts` (position map, pure delta, DOM writer) +
one parametric keyframe pair in `_base.scss`; FloatingNav (non-inline
only) and CookieConsent carry `view-transition-name` so fixed chrome
holds still. Internal links to `/` now always pass `{view: 'main'}` —
back-to-portfolio links no longer replay the splash.

## Peer review findings folded in

- Hooks in Button's top level would break four Button tests that render
  without a Router, and site route data inside an atom poisons the
  design-library extraction. REDESIGN: Button is untouched. A single
  `RouteTransitions` component (src/pages/, mounted in App) owns a native
  capture-phase click listener on internal anchors; RouterLink's own
  handler skips when `defaultPrevented`, so interception is clean
- Because the native interceptor cannot see RouterLink's React-side
  `state`, internal navigations to `/` always pass `{view: 'main'}` -
  which also FIXES the existing quirk where every "back to portfolio"
  link dumped visitors onto the splash instead of the main view
- `view-transition-name` must not ride the `.skeu-floating-nav` class:
  the admin demo renders an inline duplicate and two same-named elements
  void the transition exactly on design-system pans. Scoped with
  `:not(--inline)`; CookieConsent gets a name too (both are fixed chrome
  that must hold still while pages pan)
- Lazy destinations (design-system, metaballs) snapshot the Suspense
  "Loading" fallback on first visit under flushSync — mitigated with
  pointerover chunk preloading in RouteTransitions (hover usually beats
  the click; ThreeScene's 553 kB chunk may still lose the race once)
- Reduced motion: skip interception entirely in JS (media query check) so
  reduced-motion users get an instant swap, not a crossfade
- `flushSync(() => navigate(...))` (callback form); startViewTransition's
  return is not a thenable, so no-floating-promises stays quiet
- Full-delta pan confirmed (design-system to metaballs = 200vw at
  `--anim-speed-slow`); Ian steers the feel from the dev server

## Problem statement

Route changes are instant swaps. Concepts doc section 8 decided: the ONLY
V2 transition metaphor is papers-on-a-table — pages sit at fixed spots on
a virtual table and navigation pans from one to the other. Direction is a
data concern (per-route position map), the floating nav is the trigger,
and every internal link already funnels through the `Button.tsx`
RouterLink chokepoint, so no call sites change.

## Decisions this plan makes

- **View Transitions API, hand-rolled at the chokepoint.** The installed
  react-router-dom 6.30.3 has a `viewTransition` Link prop, but in v6 it
  only functions under `RouterProvider` (data router); this app mounts
  plain `<BrowserRouter>` (`src/main.tsx`). Migrating the router root for
  one flag is more risk than intercepting the click in Button's link arm:
  `document.startViewTransition(() => flushSync(navigate(...)))`, exactly
  what react-router does internally. Browsers without the API (or users
  with `prefers-reduced-motion`) get today's instant swap.
- **Route positions on the table** (x right, y down, in viewport units):
  Home `(0,0)` center, Design System `(1,0)` right, Metaballs `(-1,0)`
  left, About `(0,-1)` up (About's direction was the one unpicked call —
  agent default, Ian steers). Unknown routes (404) have no position:
  navigation to/from them falls back to the browser-default crossfade.
- **Direction as CSS custom properties, one keyframe pair.** The pan
  vector is written to `--nav-dx`/`--nav-dy` on `<html>` before the
  transition starts; `::view-transition-old/new(root)` keyframes translate
  by `calc(var(--nav-dx) * 100vw)` etc. Eight hardcoded directional
  classes collapse into one parametric animation, matching the parametric
  design system. Duration rides the existing `--anim-speed-slow` token —
  no new registry token, no THEMES cascade.
- **Only unmodified left-clicks on internal RouterLinks intercept.**
  Cmd/ctrl/shift/alt-clicks and non-primary buttons pass through untouched
  (new-tab behavior preserved). Back/forward buttons stay instant swaps —
  popstate is not intercepted in this phase.

## Files to change and why

- **New: `src/pages/navDirection.ts`** — `ROUTE_POSITIONS` map, pure
  `computeNavDelta(fromPath, toPath)` (unit-testable), and
  `applyNavDirection(from, to)` writing the two custom properties to
  `document.documentElement`. Returns false when either route is unmapped
  so the caller can skip direction (crossfade fallback).
- **New: `src/pages/navDirection.test.ts`** — delta cases: center→right,
  right→left (dx -2 clamped to unit vector? NO — full delta, the pan
  distance stays 100vw per table cell is wrong; see reasoning), unmapped
  routes, same route.
- **`src/components/atoms/Button.tsx`** — link arm: `useLocation` at top
  level; RouterLink `onClick` wraps the user handler: guard modified
  clicks, then `applyNavDirection` + `startViewTransition` wrapping a
  `flushSync`ed `navigate(href, {state})` and `preventDefault`. Falls back
  to default RouterLink behavior when `document.startViewTransition` is
  missing.
- **`src/styles/_base.scss`** — `::view-transition-old/new(root)`
  keyframes gated behind `@media (prefers-reduced-motion: no-preference)`;
  `--nav-dx`/`--nav-dy` are transient JS-written state, NOT registry
  tokens (they have no control/example semantics — same class as the
  bevel tones computed in JS).
- **`.ai/WORK.md`** — the pan-direction open question resolves (About =
  up, agent default).

## Approach and architectural reasoning

Delta, not unit direction: design-system → metaballs is `(-2,0)` — two
cells across the table — and the pan SHOULD travel further for that hop;
it is what makes the metaphor spatial rather than a generic slide. The
keyframes multiply by 100vw/100vh per cell.

The interception lives in Button because concepts section 8 confirmed
every internal navigation renders through it (SiteNav, project card live
links, ThreeScene/Admin back buttons, NotFound). The `skeu-btn--active`
press styling, `routerState` (splash skip), and aria behavior are
untouched — only the click's commit path changes.

## Risks / tradeoffs

- `flushSync` inside `startViewTransition` is the documented pattern but
  forces a synchronous render of the destination page; lazy routes
  (Admin, ThreeScene) resolve their chunk AFTER the transition, so the
  snapshot may pan to the Suspense fallback on first visit. Accepted:
  second visits are cached; fixing it needs route preloading (backlogged
  if Ian dislikes it).
- jsdom lacks `startViewTransition` — the fallback path is what existing
  Button tests exercise; new tests cover the pure delta math only.
- Fixed chrome (FloatingNav, CookieConsent) is INSIDE the root snapshot,
  so it pans with the page by default. Give the nav its own
  `view-transition-name` so it stays put while pages pan under it — the
  papers metaphor requires the "hand" (remote) to stay still.

## Verification checklist

- `npm run check`, `npm run build`, `npm test`
- Dev server (Chrome): nav pans right to design-system, left to
  metaballs, up to about, reverse on the way back; two-cell hop
  design-system→metaballs pans a double distance; floating nav stays
  fixed during pans; cmd-click still opens a new tab; reduced-motion OS
  setting kills the animation
