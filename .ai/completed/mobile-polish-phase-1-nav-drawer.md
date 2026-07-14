# Phase 1 — Mobile nav drawer persistence bug

Status: ✅ DONE (2026-07-14) — `SiteNavDrawer.tsx`'s closing effect now tracks
the previous `pathname` in a ref and only calls `onClose` when it actually
differs, decoupling the close-decision from `onClose`'s identity.
`SiteNav.tsx`'s `onClose`/`onNavigate` callbacks wrapped in `useCallback` as
a secondary safety measure. `npm run check`/`npm test` (128/128) green.

## Problem statement

On mobile, tapping the hamburger icon opens the drawer, but it doesn't stay
open — it reads as "does not persist its open state."

Root cause, confirmed by reading the source: `SiteNavDrawer.tsx:22-27` closes
itself via `useEffect(() => { onClose(); }, [pathname, onClose])`. The intent
(per its own comment) is "close on route change, as a backstop." But `onClose`
is passed from `SiteNav.tsx:90-92` as an inline arrow function
(`onClose={() => setDrawerOpen(false)}`), recreated on every `SiteNav` render.
Tapping the hamburger calls `setDrawerOpen(true)`, which re-renders `SiteNav`,
which creates a _new_ `onClose` closure — and because the effect's dependency
array includes `onClose`, the identity change alone re-triggers the effect,
which immediately calls the new `onClose()` and sets `drawerOpen` back to
`false`. The drawer opens and self-closes on the very next render, regardless
of whether the route actually changed.

## Files to change and why

- `src/pages/SiteNavDrawer.tsx` — the closing effect should not depend on
  `onClose`'s identity at all; it should fire only when `pathname` truly
  changes.
- `src/pages/SiteNav.tsx` — the `onClose`/`onNavigate` closures passed down
  are cheap to stabilize and should not be a source of the same bug class
  again elsewhere.

## Approach and architectural reasoning

Make `SiteNavDrawer` robust on its own rather than relying on caller-side
memoization discipline: track the previous `pathname` in a `ref`, and only
call `onClose` when the ref's value differs from the current `pathname`,
then update the ref. This removes the accidental dependency on `onClose`'s
identity entirely — the effect can still legitimately list `onClose` as a
dependency (for the linter), but the actual close-decision is driven by a
real pathname comparison, not by effect re-firing.

As a secondary, cheap improvement, memoize the callbacks `SiteNav.tsx` passes
into `SiteNavDrawer` (`useCallback`) so this class of bug is less likely to
recur if the component is refactored later.

## Risks / tradeoffs

Low risk, isolated to two small files. No architectural change.

## Verification checklist

- `npm run check`, `npm test`
- Manual, mobile viewport (devtools device toolbar or window <991px): tap
  hamburger, confirm drawer stays open; tap a nav link, confirm it closes and
  navigates; reopen, tap overlay, confirm it closes; reopen, press Escape,
  confirm it closes.
