# Phase 5 — FunPanel removal; single full design panel; type-scale relocation

Status: ✅ DONE (2026-07-14) — `TokenSidebar.tsx` had no route-specific
chrome, confirmed by reading it directly, so it's reused verbatim on every
route with no changes of its own. `PanelLayout.tsx`'s `isDesignSystem`
branch removed entirely (along with the now-unused `useLocation` import);
`TokenSidebar` stays lazy-loaded (still the right call now that it's used
on every route, not fewer). Type-scale slider's `lerp`-into-six-font-tokens
logic moved from `FunPanel.tsx` into `TypographySection`
(`TokenSidebarExtra.tsx`), reusing its existing `vars`/`setVar` props.
`FunPanel.tsx` deleted (no demo/test files existed for it). Fixed three
stale comments elsewhere that named the deleted file
(`_atoms.scss`, `Dial.tsx`, `themeInterpolate.ts` — the latter two actually
referred to `PresetDial`, corrected to name it directly).
`DesignPanelProvider`'s open/closed/revealed state machine untouched, per
plan. `CLAUDE.md` updated (four references to `FunPanel` as a structural
fact). `npm run check`, `npm test` (128/128), and `npm run build` all
green — `TokenSidebar` confirmed still code-split into its own chunk
(7.25 kB) in the production build, not bundled into the main entry.

## Problem statement

`FunPanel` (rendered on `/`, `/about`, `/contact` via `PanelLayout.tsx`'s
`isDesignSystem` branch) exposes exactly one control — a derived "type
scale" master slider that `lerp`s six hardcoded font tokens
(`FunPanel.tsx:7-16, 34-40`) — while `/design-system`'s `TokenSidebar`
exposes the full token set (themes/presets, colors, spacing, radii, motion,
typography, layout, buttons, focus, depth, links, effects). This reads as
"truncated" exactly as described. Ian confirmed (explicit answer): portfolio
routes should show the literal same full panel as `/design-system`, not a
curated subset. The existing open/closed/revealed state machine
(`DesignPanelProvider`, including "auto-open on arrival at `/design-system`")
must be preserved exactly as-is — only what's rendered _inside_ the panel
changes, not the mechanics of showing/hiding it.

## Files to change and why

- `src/pages/PanelLayout.tsx` — remove the `isDesignSystem` ternary; always
  render the same full panel component regardless of route.
- `src/pages/admin/TokenSidebar.tsx` — audit for any `/design-system`-only
  assumptions (page-specific copy, heading, reset-scope) before reusing it
  verbatim on portfolio routes; generalize anything that assumes it's only
  ever shown on the admin page.
- `src/pages/admin/TokenSidebarExtra.tsx` — `TypographySection`: add the
  type-scale master slider here (it already receives `vars`/`setVar`, the
  same `CSSTokenMap` the font tokens live in — no new plumbing needed).
- `src/pages/FunPanel.tsx` — delete once its logic is relocated and nothing
  references it.
- Any `FunPanel` demo/test files — remove alongside it.
- `src/styles/components/_atoms.scss` (~lines 224-226) — a comment there cites
  "FunPanel.tsx" by name to justify a hardcoded `0.85-1.35`/`8px` spread
  constant; update or remove the reference once `FunPanel.tsx` no longer
  exists, so the comment doesn't point at a deleted file.

## Approach and architectural reasoning

Reuse `TokenSidebar` as-is for every route (per Ian's explicit "literally the
same full panel" answer) rather than building a second "portfolio-flavored"
variant. Move the type-scale slider's existing lerp-into-six-tokens logic
into `TypographySection`, next to the per-token font controls it's a
shortcut for — this is a straightforward relocation of working logic, not a
rewrite. `DesignPanelProvider`'s state machine is untouched.

## Risks / tradeoffs

Must confirm `TokenSidebar.tsx` has no hidden route-specific chrome before
assuming a drop-in reuse. The `demo-missing`/`token-example`/`token-unused`
drift checks may need re-verification since a control's rendering context is
changing (now shown from more routes), though no new components are being
introduced — re-run `npm run check` and read its output carefully rather than
assuming green.

## Verification checklist

- `npm run check` (drift checks especially), `npm test`
- Manual: visit `/`, `/about`, `/contact`, `/design-system` — confirm the
  full token panel appears identically on all four; confirm the type-scale
  slider now lives in the Typography section and still adjusts the six font
  tokens; confirm panel open/close/reveal-delay behavior is unchanged from
  before this phase.
