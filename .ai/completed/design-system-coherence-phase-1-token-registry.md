# Phase 1 — Token Registry Unification + Drift Lint

Status: ✅ COMPLETE (2026-06-30). Part of `design-system-coherence-epic.md`.

## Problem statement

Three independent registries disagree: `:root` CSS vars (`_base.scss`), the
`DEFAULTS` map (`adminData.ts:361`), and the control lists
(`token-sidebar-data.ts`, `TokenSidebarExtra.tsx`, `ButtonSidebarSection.tsx`).
Consequences proven by audit: `--anim-speed-slow`, `--line-height-*`,
`--sidebar-width`, `--drawer-width`, `--space-xl`, all `--font-*`, and the four
static `--shadow-*` are missing from `DEFAULTS` (so `resetAll`/export drop
them). Tokens with **no control at all**: `--space-xl` (`--space-xxs`/`--space-xs`
DO have controls — `token-sidebar-data.ts:10-11` — do not re-add), all `--font-*`,
`--anim-speed-fast`, `--modal-max-width`, `--border-color`, `--overlay-bg`. Note
`--anim-speed-fast` and `--space-xl` ARE consumed in `_components.scss` — they are
not dead, they are registry-drift (live var, no `DEFAULTS`/control entry). Nothing
enforces any of this. This phase makes one source of truth and codifies the
sync as a hard-error lint, so "all tokens editable" becomes true and stays true.

## Files to change and why

- **NEW `src/styles/token-registry.ts`** — single canonical manifest: one entry
  per token (`cssVar`, `category`, `default`, `control` descriptor or
  `fixed: true`, `min/max/step/unit` for ranges). `DEFAULTS`, the control
  lists, and `TokensSection` categories all derive FROM this. Eliminates the
  three-registry problem at the root.
- `src/pages/admin/adminData.ts` — replace the hand-maintained `DEFAULTS`
  literal with a derivation from the registry; keep presets here (Phase 4
  rewrites them).
- `src/pages/admin/token-sidebar-data.ts`, `TokenSidebarExtra.tsx`,
  `ButtonSidebarSection.tsx` — build control sections by reading the registry
  instead of hardcoded arrays; add only the genuinely-missing controls
  (font sizes, `--space-xl`, `--anim-speed-fast`, `--modal-max-width`,
  `--border-color`, `--overlay-bg`). Per-control min/max/step come from registry.
- `src/pages/admin/preview/TokensSection.tsx` — derive specimen rows from the
  registry; add the missing **shadow specimens** (audit gap #2) and use
  `--anim-speed-fast` for the motion specimen.
- `src/styles/_base.scss` / `_tokens.scss` — reconcile default mismatches the
  audit found (sidebar `220` vs slider placeholder `240`; ensure every `$token`
  is mirrored to a `:root` var). No visual change intended here.
- `scripts/validate.ts` — add the drift checks below as new typed violations.
- **NEW `scripts/design-tokens.allowlist.ts`** (or a const in validate) —
  explicit allow-list of intentionally fixed/derived vars
  (`--anim-speed-fast` derived, `--pop-shadow-*` derived, etc.) so checks don't
  false-positive.

## Drift checks added to `scripts/validate.ts`

Regex-parse (SCSS `:root` and the TS data files are flat and regular):

- **`[token-sync]`** every `$token` in `_tokens.scss` is exposed as a `:root`
  `--var` in `_base.scss` (or allow-listed).
- **`[control-sync]`** every `:root --var` has a control in the registry OR is
  in `FIXED_TOKENS`.
- **`[defaults-sync]`** `DEFAULTS` key set == `:root` var set (now automatic via
  registry derivation, but assert it to catch manual drift).
- **`[preset-token]`** every `--key` written by any preset in `adminData.ts` is
  a real `:root` var.
- **`[token-specimen]`** every token in a displayed category appears in
  `TokensSection` (or allow-listed).
- **`[demo-missing]`** every component in `src/components/**` is imported by the
  preview tree of its tier (`AtomsSection`/`MoleculesSection`/`OrganismsSection`
  and their transitively-imported children). Follow imports recursively. **Scope
  carefully:** only `atoms/`, `molecules/`, `organisms/` `*.tsx` are subject to
  the rule; allow-list root-level `masonry-card.tsx` and exclude non-component
  files (`icon-map.ts` and other helper `.ts`) or the check false-positives.

### Land-green sequence (split to avoid a red tree)

Phase 1 is large; land it in three commits, each green:

- **1a** — create `token-registry.ts`; derive `DEFAULTS` + control lists +
  `TokensSection` from it with **no behavior change** and **no checks** yet.
- **1b** — add the six checks as **warnings**; fix every existing drift case
  (missing `DEFAULTS` keys, missing controls, stale specimens) and tune the
  `FIXED_TOKENS` allow-list until warnings reach zero.
- **1c** — flip the checks to **hard errors** in `npm run check`.
  This mirrors the audit's own "warn-then-error" suggestion for `[demo-missing]`.

## Approach / reasoning

The registry is the architectural fix for issue 9's stated cause ("agents lack
context to update all surfaces"): collapse N surfaces into 1 source + derived
views, then lint the few couplings that remain (SCSS↔registry, registry↔presets,
component↔demo). Regex parsing is sufficient and adds no dependency; `validate.ts`
already walks files and emits typed violations.

## Risks / tradeoffs

- Registry-driven controls are a refactor of the admin sidebar; risk of
  reordering/relabeling controls. Mitigate: preserve current section order and
  labels; snapshot the sidebar visually before/after.
- `[demo-missing]` import-following can false-negative on indirection; start it
  as the one check that may warn-then-error if tuning is needed (Phase 6 review).
- Adding many controls enlarges the sidebar; Phase 5 owns IA polish.

## Verification checklist

- [ ] `npm run check` green with all six new checks active as errors
- [ ] `npm run build`, `npm test` green
- [ ] Manually: every `:root` var now has a control or is allow-listed
- [ ] `resetAll` restores every token (no silent drops); export includes all
- [ ] Sidebar visual parity confirmed by Ian (order/labels unchanged)
