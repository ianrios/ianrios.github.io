# Phase 2 — Editable-Panel Bug Fixes

Status: ✅ COMPLETE (2026-06-30). Part of `design-system-coherence-epic.md`.
Depends on Phase 1 (registry) only for the slider min/step-on-grid sub-fix; the
`msVal`/`pctVal` snap-back logic fix is independent and can ship earliest.
Parallelizable with Phase 5 route/copy work. **Overlap warning:** Phase 4
rewrites `TokenPresets.tsx`/`useDesignVars.ts` (collapses presets into
`applyTheme`), so the `ColorSwatches` fix here may be partly reworked — keep that
fix minimal, or sequence Phase 2 swatch work right before Phase 4.

## Problem statement (issues 1, 3, 7, 8)

Four "the panel lies" bugs where a control exists but the edit is lost or
invisible:

1. **Motion sliders snap back** to 120ms / 500ms when dragged toward the low
   end. Root cause: `msVal`/`pctVal` in `TokenSidebarExtra.tsx:6,10` use
   `parseFloat(...) || fallback`, so a value parsing to `0` is treated falsy and
   reverts to default. Secondary: `--anim-speed` default 120ms is off the
   slider's `step=25` grid (`TokenSidebarExtra.tsx:26`), so 120 is unreachable
   and the thumb snaps to 125.
2. **Color edits don't preview** at the "Color preset\*" swatch row. `ColorSwatches`
   (`TokenPresets.tsx:4-28`, used line 73) reads `preset.vars` (static) not the
   live `vars` map; it also only renders when a preset is `active`.
3. **Typography edits do nothing.** `--line-height-base` is consumed nowhere;
   `--line-height-loose` only in `.skeu-accordion__content`
   (`_components.scss:1016`); there are no font-size controls (added in Phase 1).
4. **Width edits do nothing.** `--sidebar-width` binds only to Home classes
   (`_base.scss:303`, `_components.scss:905,2182`), not the admin sidebar
   `.skeu-admin-sidebar`; `--drawer-width` binds only to the mobile drawer
   (`_components.scss:1741`). Neither moves anything visible in `/admin`.

## Files to change and why

- `src/pages/admin/TokenSidebarExtra.tsx` — fix `msVal`/`pctVal` to use
  `Number.isFinite(parseFloat(raw))` instead of `|| fallback`; set slider
  `min`/`step` so the default value lands on the grid (registry-driven after
  Phase 1). Allow true `0`/low values to persist.
- `src/pages/admin/TokenPresets.tsx` — `ColorSwatches` derives swatches from the
  live `vars` for the keys in `preset.vars`; render the live palette even when
  no preset is `active` (dirty/custom state).
- `src/styles/_components.scss` — consume typography tokens where users expect
  type to change: apply `--font-*` / `--line-height-base` to body/admin text
  surfaces so the Typography section visibly drives type. Bind the admin
  sidebar width to `--sidebar-width` (or introduce a clearly-labeled
  admin-preview element that demonstrates `--sidebar-width`/`--drawer-width`
  live), so issue 8 edits are visible on the page being edited.
- `src/pages/admin/preview/TokensSection.tsx` / a small live demo — ensure the
  Typography and Layout sections have an on-screen specimen that reflects edits
  immediately (closes the "I edit but see nothing" gap even for tokens whose
  real consumers are off-screen).

## Approach / reasoning

Bugs 1 and 3 are localized logic fixes. Bugs 7 and 8 are "the token has no
visible consumer in the admin view" — fix by (a) wiring the tokens into real
surfaces that the admin renders, and (b) guaranteeing each editable category has
at least one always-visible live specimen, so no control is a no-op. This also
satisfies issue 9's "editable panel vs visual change" expectation generally.

## Risks / tradeoffs

- Wiring `--font-*` broadly can shift existing layout; scope to text surfaces
  and verify against the masonry/home pages.
- Binding `--sidebar-width` to the admin sidebar changes admin layout live;
  confirm it reads well at min/max.

## Verification checklist

- [ ] Motion sliders reach and hold low values; default sits on the grid
- [ ] Color swatch row updates live as colors are edited (asterisk + swatches)
- [ ] Typography section visibly changes type on screen
- [ ] Sidebar/drawer width sliders visibly move something in `/design-system`
- [ ] `npm run check`, `build`, `test` green; Ian visual sign-off
