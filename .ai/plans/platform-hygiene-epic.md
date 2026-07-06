# Epic: Platform, Deploy & Docs Hygiene

Status: APPROVED 2026-07-06 (decisions: analytics kept → modular SDK; no
dashes in copy, absolute; SCSS restructured into tier-scoped partials;
"Previous Co" labeled sample data; README describes the real repo). Findings
referenced as F# from `.ai/specs/platform-review-findings.md`.

Problem: deploy skips the quality gates (F28), config files escape typecheck
(F30), the SCSS monolith and `*Data.ts` files escape size budgets (F34), the
site ships a 2019 Firebase CDN SDK (F32), Sass `@import` is deprecated (F31),
and the context docs contain one actively wrong file plus superseded specs and
copy nits (F36–F40).

All phases independent (see the findings register's cross-epic sequencing
note); each gets a sub-plan + peer review + approval.

## Phase 1 — Verification gates + budget policy

Resolves F28, F30, F34, F43.

- `deploy` becomes `npm run check && npm test && npm run build && firebase deploy`.
- Type-check configs: add them to the tsconfig surface (project or a
  `tsconfig.node.json` reference) so `vite.config.ts`/`eslint.config.js` compile.
- validate.ts: remove the stale `DRIFT.asError` scaffold; tighten `isDataFile`
  so files with function bodies don't ride the data exemption (move `theme()`/
  `loadStored`/`detectMatchingPreset` out of `adminData.ts` if simpler);
  add SCSS to `[code-size]` with its own budget.
- `git rm --cached public/.DS_Store`.

Files: `package.json`, `tsconfig.json`, `validate.ts`, `adminData.ts`.

## Phase 1b — SCSS modernization + split

Resolves F31 + the split half of F34 (own sub-plan — too coupled to ride with
Phase 1, too risky to mix with the design epic's SCSS phases).

- Migrate `main.scss`/partials from `@import` to `@use`/`@forward`.
- Split `_components.scss` (2,285 lines) by tier
  (base/atoms/molecules/organisms/admin) per open question 8 — content moves
  only, no rule changes; verify by diffing the built CSS byte-for-byte.

Files: `main.scss`, `_components.scss` (split into partials), `_tokens.scss`,
`_base.scss` (namespace updates).

## Phase 2 — index.html modernization

Resolves F32. Gated on open question 5 (keep vs drop analytics).

- Drop the compat 7.6.2 CDN scripts. If analytics stays: `firebase` npm modular
  SDK, initialized lazily post-hydration; config to a module (it is public by
  design, no secret). If it goes: delete outright.
- Flash-prevention script stays untouched (per CLAUDE.md).

Files: `index.html`, possibly new `src/analytics.ts`, `package.json`.

## Phase 3 — Copy + content sweep

Resolves F38, F39, F42, F44. Gated on open questions 6 (dash policy),
11 ("Previous Co"), 12 (README voice).

- Replace em/en dashes in user-facing strings (`TokenSidebar`, `TokenPresets`,
  preview `SectionLabel`s, `V2Preview`, `DSPreview` annotation) per the decided
  style; add the rule to RULES.md so agents stop introducing them.
- `data.ts`: "neumorphic" → current design language, fix "An reverse-entropy",
  delete commented-out dead blocks.
- Rewrite `README.md` (stock CRA today) — draft for Ian's review.
- Resolve the fabricated "Previous Co" card per Ian's answer (real content /
  sample label / delete).

Files: admin/preview components with copy, `data.ts`, `README.md`,
`V2Preview.tsx`, `adminData.ts`, `.ai/RULES.md`.

## Phase 4 — Context docs + agent ergonomics

Resolves F36, F37, F40, F41.

- Rewrite `.ai/CONTEXT.md` for this repo (pointer-style: what it is, where
  facts live — no prose duplicating package.json/CLAUDE.md).
- `mv` superseded specs (`skeuomorphism-*.md`, `metaballs-update.md` if Ian
  confirms it's done) to `.ai/completed/`.
- Expand `.claude/settings.json` allowlist from a `/fewer-permission-prompts`
  run, reviewed line-by-line before commit.
- WORKFLOW.md: one short subsection on delegating scoped implementation to
  lower-power-model subagents (orchestrator picks the model per task).

Files: `.ai/CONTEXT.md`, `.ai/specs/*` (moves), `.claude/settings.json`,
`.ai/WORKFLOW.md`, `.ai/WORK.md`.

## Risks

- Phase 1's SCSS split touches every style import — pure moves, verified by
  identical build CSS output (diff the built `.css`).
- Phase 2 changes what loads before first paint — verify FOUC prevention still
  holds with devtools throttling.

## Verification (every phase)

`npm run check` + `npm run build` + `npm test`. Phase 1: `npm run deploy`
dry-run path (stop before `firebase deploy`). Phase 2: Lighthouse/network pass
confirming no render-blocking regression.
