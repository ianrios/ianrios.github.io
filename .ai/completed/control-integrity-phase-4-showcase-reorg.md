# Phase 4 — Live Example Per Token + Grouped Preview Nav

Status: ✅ COMPLETE (2026-07-03). Part of `control-integrity-epic.md`.
Depends on Phases 1–3 (final token set + variants + fixed demos).

## Problem

Real tokens with no/weak preview example: `--drawer-width` (mobile drawer only),
`--modal-max-width`, `--overlay-bg` (scrim, only when a modal/drawer is open),
`--anim-speed-slow` (push-tab hide), `--space-xl` (only pads admin chrome),
`--font-xxs` (mixed-grid desc), `--line-height-loose` (accordion content). The
preview is also one long scroll; Ian wants grouped nav sections, and a guarantee
that **every editable token is demonstrated live**.

## Changes

### A. Showcase every token

- Add a **live, always-visible example** in the preview for each currently-hidden
  token so adjusting its slider visibly changes something on screen:
  - `--drawer-width` / `--overlay-bg` — a small in-page drawer+scrim demo (open
    state rendered inline, not a real modal).
  - `--modal-max-width` — an inline modal-panel specimen at its width.
  - `--anim-speed-slow` — a looping or toggle demo of the slow transition (e.g.
    a push-tab / panel that uses it), distinct from `--anim-speed`.
  - `--font-xxs` — surface the mixed-grid item (or a caption specimen) prominently.
  - `--line-height-loose` — an expanded accordion with multi-line body.
- **`--space-xl`:** wire to a real product consumer (e.g. major section gap in a
  page composition) and show that gap live — stop it only padding admin chrome.
- Confirm the already-real-but-thin ones (sidebar/modal/etc.) each have a clearly
  labeled live specimen.

### B. Grouped preview nav (reorg) + the Clickable matrix

- `DSPreview.tsx` — turn the five `TierLabel` blocks into real **nav sections**
  (section nav / tabs, not one scroll): **Tokens, Atoms, Molecules, Organisms,
  Patterns** (Patterns = current Combinations). V2 stays a separate top-level tab.
- Keep components in their existing tiers (audit found no cross-tier leakage);
  this is mostly a nav shell + per-section anchors.
- **Replace the scattered Button/Icon/Link demo sections with ONE `<Button>`
  matrix** (per Ian): variants × sizes × states × colors × (button / link /
  icon-only) in a single comparative table, so all styles/states/variants are
  shown together rather than as disconnected components. This depends on the
  Phase-3 unified component.

### C. `[token-example]` drift check — SPECIMEN-AWARE (peer-review fix)

Naive "token name appears literally in preview source" is unworkable: specimens
render via `categoryVars('color'|'font'|...)` (`TokensSection.tsx:9-18`), so token
names do NOT appear literally — 0 of 13 sampled real tokens appear as strings.
Design the check to count a token as "exampled" if EITHER:
(a) its category is rendered in `TokensSection` via `categoryVars()` — reuse the
`[token-specimen]` mechanism (category-level coverage), OR
(b) its `cssVar` appears literally in a bespoke preview demo
(`src/pages/admin/preview/**` inline style / usage).
Every editable (`controlled`) token must satisfy (a) or (b); documented allow-list
for any intentional exception. Hard error in `DRIFT_TYPES` + unit test.

- **Honest limitation (code comment + docs):** this proves _coverage_, not a
  _visible change_. Paired with `[token-unused]` (real CSS effect) it's a strong
  guarantee; "visibly changes on screen" stays Ian's manual review (Part A).

## Risks / tradeoffs

- Inline drawer/modal/scrim demos must not hijack the page (scope them to a demo
  container; don't trap focus).
- `[token-example]` allow-list must be tight or it becomes a rubber stamp.
- Nav reorg changes admin IA — preserve scroll/anchor behavior; verify with the
  sticky topbar from the prior epic.

## Verification

- [ ] Every editable token has a live, labeled example that visibly responds to
      its control (manual pass + `[token-example]` green)
- [ ] Preview is grouped into Tokens/Atoms/Molecules/Organisms/Patterns nav
- [ ] `--space-xl` drives a real section gap shown live
- [ ] `npm run check` (9 drift checks) / `build` / `test` green; Ian sign-off
