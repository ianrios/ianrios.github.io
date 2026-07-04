# Phase 1 — Dead-Token Purge + `[token-unused]` Lint

Status: ✅ COMPLETE (2026-07-03). Part of `control-integrity-epic.md`.

## Problem (verified file:line)

Five editable tokens have **0** `var()` consumers — their controls do nothing:
`--btn-gradient-end`, `--btn-overlay-opacity`, `--btn-top-highlight`,
`--btn-elevation`, `--btn-radius-lg`. Two more are mis-wired:
`--btn-text-color` ("Fill text") only colors the base button (`_components.scss:43`);
`--btn-gradient-start` is actually the primary-**link** gradient-text color
(`_components.scss:402`), mislabeled in the Button section.

## Changes

- **Delete the 5 dead tokens** everywhere: `src/styles/token-registry.ts` (entries
  - their controls — incl. the controls the prior parity fix added for
    overlay-opacity/top-highlight/radius-lg), `_tokens.scss` (`$`-defs),
    `_base.scss` (`:root` mirror), `src/pages/admin/adminData.ts` (`ThemeSpec` fields
  - `theme()` expander + all 9 themes), and any control wiring in
    `ButtonSidebarSection.tsx` / `token-sidebar-data.ts`.
- **Remove the Elevation picker** — keyed off the now-deleted `--btn-elevation`.
  Full surface list (peer-review — don't miss any, or the tree won't compile):
  `ButtonSidebarSection.tsx` (buttons/swatches/`customElevation`),
  `useDesignVars.ts` (`applyElevation`/`elevationPresets`/`customElevation`),
  `src/types/design-vars.ts` (`elevationLevel`/`setElevationLevel`/`customElevation`
  /`setCustomElevation`/`applyElevation`), `src/types/admin.ts` (`ElevationLevel`),
  `src/pages/admin/TokenSidebar.tsx` (props threading), **`src/hooks/useHomeDesignPanel.ts`
  (the Home design panel also consumes these — easy to miss)**, `Admin.tsx` props,
  and `ELEVATION_PRESETS`/`detectElevationLevel` in `adminData.ts`.
- **Relocate `--btn-gradient-start`** → rename to a link token (e.g.
  `--link-primary-color`) in the **Links** control group; update its one consumer
  (`_components.scss:402`) and `:root`/registry/themes. Drop the dead
  `--btn-gradient-end` (no rename — no consumer).
- **`--btn-text-color`** stays (its `:43` consumer keeps `[token-unused]` happy).
  Leave its label honest as-is in Phase 1 — do NOT relabel "Primary text" yet
  (Primary doesn't consume it until Phase 2). NOTE (peer-review): it's effectively
  inert today (no call site renders a bare `.skeu-btn`), so Phase 1 alone doesn't
  fully achieve "zero controls without a visible effect" — **Phase 2 repurposes it
  as Primary's text color**, which closes that. Acceptable within the epic.
- **New `[token-unused]` check** in `scripts/drift-checks.ts` + `validate.ts`:
  scope to the **`controlledVars`** set (the same set `[theme-control]` uses) —
  NOT all registry tokens, else it fires on derived no-control tones like
  `--bevel-light`. Require ≥1 `var(--<cssVar>` across `_base.scss`,
  **`_components.scss` (add it to `validate.ts`'s read set — currently unread)**,
  and `_tokens.scss` mixins. `#{$fallback}` inside `var(--x, #{$x})` is safe to
  count. **Allow-list `--depth-contrast`** — it is editable but JS-only (drives
  `computeBevelTones`, no `var()` consumer); after the 5 removals it is the sole
  legitimate exception. Hard error in `DRIFT_TYPES` + unit test (fires on a known
  dead token, passes on the real set). Land the check + the 5 removals + the
  allow-list in one change so the tree never goes red. This would've caught all 5.

## Approach / reasoning

`[token-unused]` is the inverse of `[theme-control]`: together they guarantee
every editable token both _has a control_ and _does something_. Removing tokens
must touch every surface at once or the existing checks (control-sync,
defaults-sync, preset-token, theme-control) will fail — which is the safety net.

## Risks

- `theme()` uses a typed required-field `ThemeSpec`; removing fields is a compile-
  time safety check (good) but touches all 9 themes — do it in one pass.
- Elevation picker removal changes `useDesignVars` return shape + `Admin.tsx`
  props — thread carefully.

## Verification

- [ ] `npm run check` green with `[token-unused]` active as error
- [ ] grep confirms the 5 tokens gone from registry/:root/themes/controls
- [ ] `--btn-gradient-start` consumer still works (primary link gradient text)
- [ ] `build` + `test` green; Ian visual: no controls removed that had an effect
