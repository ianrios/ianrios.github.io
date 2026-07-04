# Epic — Design System Coherence & Neumorphism Pivot

Status: **✅ COMPLETE (2026-06-30).** All phases shipped and merged green.

## Why

Eleven owner-reported issues collapse into four root causes, confirmed by a
three-agent read-only audit (token data-flow, shadow/elevation, drift/process):

1. **Three disagreeing token registries.** `:root` CSS vars (`_base.scss`), the
   `DEFAULTS` map (`adminData.ts`), and the control lists are independent and
   out of sync. A token can live in one but not the others → "editing does
   nothing" (typography, widths), orphan tokens (`--anim-speed-fast`,
   `--space-xl`), and `resetAll`/export gaps.
2. **Skeuomorphic by construction.** Shadow tokens are hardcoded black/green
   literals decoupled from `--color-surface`, so they can never blend; ~6
   controls have no depth at all; no stacking strategy on links (the hover
   z-jump). Owner wants neumorphism (full replace — approved).
3. **Presets are partial and weak.** Presets are category-scoped, several are
   near-duplicates, and the live default sits at the top of the spacing range
   so presets look like they "barely change." Owner wants complete-theme
   presets covering every token (approved).
4. **Zero codified drift detection.** None of eight cross-surface sync
   relationships is enforced; the audit already found 3 live drift cases.
   Owner wants hard-error lint, not agent memory (approved).

## Approved decisions (2026-06-26)

- Depth language **(revised 2026-06-29 after visual review)**: **Classic Windows
  3D bevel** (Win95/98/NT), NOT soft neumorphism. Ian rejected the soft
  "bubble" / Frutiger-Aero look. Hard-edged bevels (**zero blur**), low-profile
  ("keyboard key" feel), tones derived from the **backdrop the element actually
  sits on** (bg for page-level, surface for in-card) so they blend. Contract:
  **flat at rest → raised hard bevel on hover → sunken hard bevel on press.**
  Buttons flat (drop the gradient fill). No soft resting inset on fields (a
  hard sunken bevel is OK; the soft blurred inset is not). Always-raised
  exceptions (modals/dropdowns) keep a raised bevel + minimal hard float.
  NOTE: the soft-neu first pass (surface-derived blurred pairs) was implemented
  then rejected; Phase 3 was reworked to the bevel language.
- Route rename: `/admin` → **`/design-system`**.
- Presets: **complete themes** — each preset sets every category
  (color + shape + type + motion + layout).
- Drift lint: **hard errors** in `npm run check` once existing drift is fixed.

## Phases — ✅ all done (2026-06-30)

Each phase shipped as a standalone sub-plan (now alongside this file):

- Phase 1 — Token Registry Unification + Drift Lint ✅ DONE — see `design-system-coherence-phase-1-token-registry.md`
- Phase 2 — Editable-Panel Bug Fixes ✅ DONE — see `design-system-coherence-phase-2-panel-bugs.md`
- Phase 3 — Depth Conversion (soft-neu first pass reworked to Classic Windows bevel) ✅ DONE — see `design-system-coherence-phase-3-neumorphism.md`
- Phase 4 — Complete Theme Presets ✅ DONE — see `design-system-coherence-phase-4-theme-presets.md`
- Phase 5 — Admin IA Rename + Portfolio Integration ✅ DONE — see `design-system-coherence-phase-5-ia-portfolio.md`
- Phase 6 — Docs, Drift Contract & Orchestration Model ✅ DONE — see `design-system-coherence-phase-6-docs-orchestration.md`

## Cross-cutting invariant (applies to every phase)

Any phase that adds/changes/removes a token or component MUST update all
surfaces in the same PR: SCSS source → `:root` var → token registry →
control → preset coverage → `TokensSection` specimen → admin demo. After
Phase 1 the drift lint enforces this; until then, follow it by hand.

## Verification (every phase)

`npm run check` (format → typecheck → lint → validate.ts → knip) +
`npm run build` + `npm test`, then Ian's visual review. Automated green is
necessary, not sufficient — Ian signs off visually before any phase is ✅.

**Test strategy (new — the repo currently has zero tests):** add focused Vitest
unit tests for the pure-logic pieces where a regression would be silent — the
`msVal`/`pctVal` `0`-handling (Phase 2), registry derivation of `DEFAULTS`
(Phase 1), surface→shadow derivation (Phase 3), and a smoke test that the
`validate.ts` drift checks fire on a known-bad fixture (Phase 1). CSS/visual
behavior stays Ian's manual review.

## Issue → phase traceability

| Issue                                              | Phase                          |
| -------------------------------------------------- | ------------------------------ |
| 1 motion slider snap-back                          | 2                              |
| 2 boring/duplicate presets                         | 4                              |
| 3 live color preview at "Color preset\*"           | 2                              |
| 4 hover shadow z-jump                              | 3                              |
| 5 shadows don't blend (skeuo→neu)                  | 3                              |
| 6 neu audit across all components                  | 3                              |
| 7 typography edits do nothing                      | 1 (controls) + 2 (consumption) |
| 8 sidebar/drawer width does nothing                | 1 (controls) + 2 (consumption) |
| 9 partial presets / uneditable tokens / drift lint | 1 + 4                          |
| 10 rename /admin, trim card copy                   | 5                              |
| 11 sticky back-button navbar in PushPanel          | 5                              |
