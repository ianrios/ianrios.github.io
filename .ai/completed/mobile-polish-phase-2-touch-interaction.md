# Phase 2 — Touch interaction fixes (slider drag + cursor hide)

Status: ✅ DONE (2026-07-14) — `.skeu-slider` got `touch-action: none`
matching the `Dial`/`FloatingNav`/`PresetDial` precedent. `CursorFX.tsx`
gained a reactive `useMediaQuery('(hover: hover) and (pointer: fine)')`
check (`canHover`), replacing the three non-reactive inline `matchMedia`
checks; the component now returns `null` (no DOM/listeners) on touch/coarse
devices unless `inline` (demo mode, unaffected). `npm run check`/`npm test`
(128/128) green.

## Problem statement

Two separate mobile touch issues:

**(a) Sliders can't be dragged on touch.** Tapping a slider to set a value
works, but dragging with a finger does not. `Slider.tsx:35-45` renders a plain
native `<input type="range">` with only an `onChange` handler — no custom
pointer/touch handling, and critically, `.skeu-slider`'s CSS
(`_atoms.scss:117-147`) never sets `touch-action`. Every other custom-drag
control in this codebase (`Dial`, `FloatingNav`, `PresetDial`) pairs its
pointer handlers with an explicit `touch-action: none`. Sliders live inside
the scrollable `.skeu-push-panel__body` (`overflow-y: auto`); without
`touch-action` isolation, a touch-drag gesture starting on the thumb is very
likely captured by the ancestor's default pan/scroll behavior instead of
moving the thumb — consistent with "click-to-set works, drag doesn't."

**(b) The custom cursor + trail should not render at all on mobile.**
`CursorFX.tsx` mounts unconditionally on every route (`App.tsx:53`, outside
`<Routes>`). Its only device gating is a `window.matchMedia('(hover: hover)')`
check done inline inside each effect body — evaluated once per effect run,
not reactive to media-query changes, and not a deliberate "skip touch
devices" gate the way `SiteNav.tsx` uses the reactive `useMediaQuery` hook for
its own mobile/desktop branch.

## Files to change and why

- `src/styles/components/_atoms.scss` — `.skeu-slider` rule: add
  `touch-action: none` (or the narrowest value that still allows the thumb to
  be dragged without the container stealing the gesture), matching the
  `Dial`/`FloatingNav`/`PresetDial` precedent.
- `src/components/organisms/CursorFX.tsx` — add a reactive gate using the
  existing `useMediaQuery` hook (`(hover: hover) and (pointer: fine)`) and
  skip rendering/mounting listeners entirely when it doesn't match.

## Approach and architectural reasoning

(a) CSS-only fix, no JS changes — the native range input already handles
touch dragging correctly once the container can't intercept the gesture.

(b) Reuse the same `useMediaQuery` hook already used elsewhere in this
codebase rather than inventing a second device-detection mechanism. The hook
must be called unconditionally (rules of hooks) — the early return for
non-hover devices goes after all hooks are declared, replacing/supplementing
the existing non-reactive inline `matchMedia` checks.

## Risks / tradeoffs

`touch-action: none` on the slider disables page-scroll-through-slider,
which is the intended tradeoff (matches `Dial`'s existing precedent) — verify
mouse/trackpad dragging on desktop is unaffected.

CursorFX gating must preserve hook-call order; verify no console warnings
about conditional hooks.

## Verification checklist

- `npm run check`, `npm test`
- Manual, touch-capable viewport: drag a slider inside the open design panel
  and confirm the value updates continuously while dragging, not just on
  release/tap.
- Manual: confirm no cursor ring/trail renders at any point on a touch
  viewport; confirm cursor still works normally on desktop (mouse).
