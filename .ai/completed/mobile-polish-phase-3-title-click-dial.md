# Phase 3 — Title-click panel-close gating + PresetDial mobile-hide verification

Status: ✅ DONE (2026-07-14) — landed in `src/pages/RouteTransitions.tsx`
(not `src/components/organisms/RouteTransitions.tsx` — plan's path was
stale, reasoning was correct). Found and fixed a real gap the plan missed:
the existing `to === from` early-exit had to be checked _after_ the new
gate, not before — clicking "title" while already on `/` is a same-path
click, so the original early-exit ordering would have silently bypassed any
gate placed after it. Gate is keyed on `navView === 'welcome'` +
`DesignPanelContext.open`, device-agnostic per plan. `PresetDial.tsx`
untouched; its mobile-hide via CSS confirmed already correct (verify-only,
no code change). `npm run check`/`npm test` (128/128) green.

## Problem statement

**(a)** On desktop, clicking the "title" nav item while the design panel is
open navigates straight back to the MetaBalls splash without first closing
the panel. `PresetDial` (only visible while the panel is open — it fades via
`.skeu-preset-dial--closed` when `panelOpenState` is false) gets swept away
with the whole page transition instead of closing as a deliberate first step.
Ian wants: first click closes the design panel (and, as a consequence,
`PresetDial` fades per its existing behavior); a second click actually
returns to the splash. Confirmed via source read: `SiteNav.tsx`'s
`NavContent.handleClick` currently only special-cases `key === 'design'`
(auto-opens the panel); it never touches `DesignPanelContext` for the
`'title'` key.

**(b)** Ian also asked that the `PresetDial` never be visible/interactive on
mobile. This already appears to be true: `_organisms.scss:263-267` sets
`.skeu-preset-dial { display: none }` under a `max-width: 991px` media query,
unconditionally (not tied to panel-open state). This is very likely a
verify-only item, not a code change — confirm on a real mobile viewport
before assuming no work is needed here.

## Files to change and why

- `src/components/organisms/RouteTransitions.tsx` — this is the actual
  interception point, not `SiteNav.tsx`. Peer review confirmed:
  `RouteTransitions.tsx` registers a **capture-phase** `document` click
  listener that reads `anchor.dataset.navView` and unconditionally calls
  `preventDefault()` + `navigate()` (inside `document.startViewTransition`)
  for any internal link click. This runs _before_ React's bubble-phase
  `onClick` on `Button`/`NavContent` ever fires — so a handler added in
  `SiteNav.tsx`'s `handleClick` calling `preventDefault()` would be a no-op;
  navigation is already underway by the time it runs. The gating must live
  in `RouteTransitions.tsx`'s capture-phase handler itself: when
  `navView === 'welcome'` (the title destination) and `DesignPanelContext`'s
  `open` is `true`, close the panel and stop there instead of calling
  `navigate()`; otherwise proceed as today.
- `src/pages/SiteNav.tsx` — no change needed for this item once the gating
  moves to `RouteTransitions.tsx`; the "title" `Button` keeps its plain
  `href`/`routerState` as-is.

## Approach and architectural reasoning

Gate the fix on the shared `DesignPanelContext.open` boolean, which is
identical state regardless of device. This means the same two-click gating
will also naturally apply if a mobile user has the (now-always-full) design
panel open and taps "title" — Ian's wording scoped the example to
desktop/`PresetDial`, but the underlying mechanism (don't yank the panel away
mid-navigation) applies equally well on mobile, and there is no reason to
special-case it out. Ship it device-agnostic; call this out explicitly when
presenting the plan in case Ian wants mobile scoped differently.

`PresetDial` itself is not modified — per Ian's confirmed answer, only the
nav-click handling changes (it turned out to live in `RouteTransitions.tsx`,
not `SiteNav.tsx` as first assumed — corrected by peer review).

## Risks / tradeoffs

`RouteTransitions.tsx` is a shared, capture-phase, app-wide click
interceptor — any change here needs care not to affect other internal link
clicks (only the `navView === 'welcome'` case should gain new behavior).

## Verification checklist

- `npm run check`, `npm test`
- Manual, desktop: open the design panel, confirm `PresetDial` is visible,
  click "title," confirm the panel closes (and `PresetDial` fades) but the
  splash does _not_ yet appear, click "title" again, confirm the splash now
  appears.
- Manual, mobile viewport (<991px): confirm `PresetDial` is never visible or
  focusable, in any panel-open state.
