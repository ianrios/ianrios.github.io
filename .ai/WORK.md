# WORK.md

## Current phase

Control-Integrity epic — **complete as of 2026-07-03.** Nine drift checks now gate `npm run check` (added `token-unused` + `token-example`), enforcing control↔effect↔example on every editable token; dead button tokens + the Elevation picker + gradient/ghost variants purged; Link/IconButton/IconLink unified into one polymorphic `<Button as>`; preview reorganized into grouped nav sections. What's next is Ian's call (see Pending).

## Active priorities (in order)

### Control-Integrity (epic: `.ai/completed/control-integrity-epic.md`)

1. ✅ **Phase 1 — Dead-token purge + `[token-unused]`** — removed 5 dead button tokens + Elevation picker; fixed `btn-text-color`/`gradient-start` wiring+labels.
2. ✅ **Phase 2 — Button variants** — Primary filled + Outline real border; dropped Gradient; ghost needs met by link variants.
3. ✅ **Phase 3 — Unified clickable** — Link/IconButton/IconLink folded into one polymorphic `<Button as="button" | "link">` with orthogonal variant/color/size/icon axes; fixes the state + demo bugs by construction.
4. ✅ **Phase 4 — Live example per token + grouped nav** — grouped preview sections (Tokens/Atoms/Molecules/Organisms/Patterns); `[token-example]` check.
5. ✅ **Phase 5 — Docs + close-out** — CLAUDE nine-check contract, ANTI-PATTERNS, WORK; epic + sub-plans moved to `.ai/completed/`.

### Design System Coherence (epic: `.ai/completed/design-system-coherence-epic.md`)

1. ✅ **Phase 1 — Token registry + drift lint** — single `token-registry.ts`; seven hard-error drift checks in `scripts/drift-checks.ts`.
2. ✅ **Phase 2 — Editable-panel bug fixes** — slider snap-back, typography/width consumption, live color preview.
3. ✅ **Phase 3 — Depth conversion** — soft-neu first pass reworked to Classic Windows parametric bevel; link hover wired structurally.
4. ✅ **Phase 4 — Complete theme presets** — one `THEMES` list, one "Themes" selector; each sets every category incl. depth.
5. ✅ **Phase 5 — Admin IA rename + portfolio** — `/admin`→`/design-system` (permanent redirect), card copy, sticky PushPanel header.
6. ✅ **Phase 6 — Docs + orchestration model** — this doc set; epic + sub-plans moved to `.ai/completed/`.

### Design token inline style migration (epic: `.ai/plans/design-token-inline-style-migration.md`)

1. ✅ **Phase 1 — Token system** — font scale updated (8→10…17→18px), line-height and anim-speed-slow tokens added, 16 `.color-*` splash classes deleted from `_base.scss`.
2. ✅ **Phase 2 — Atom strictness** — all atoms use `Omit<..., 'className' | 'style'>` enforcement; adminData.ts migrated to typed prop values.
3. ✅ **Phase 3 — Molecule/organism SCSS** — BEM classes for all 16 component files; `.is-open`/`.is-hidden` state patterns; `masonry-card` uses `<Card>`; `preview.scss` deleted.
4. ✅ **Phase 4 — Admin className leaks** — `preview.scss` deleted, classes migrated to `_components.scss`, Admin.tsx / TokenSidebar.tsx cleaned up.
5. ✅ **Phase 5 — Admin token controls** — Typography (line-height), Layout (sidebar-width, drawer-width), Motion (anim-speed-slow) sliders added via `TokenSidebarExtra.tsx`.
6. ✅ **Phase 6 — Admin full cleanup** — All 12 admin preview files cleaned (AtomsSection, ButtonAtoms, ButtonHelpers, CombinationsSection, IconAtoms, MoleculesSection, OrganismsSection, OrgCombinations, PushPanelVariants, TokenControls, TokenPresets, V2Preview). 8 remaining `style=` are all legitimate dynamic runtime values.
7. ✅ **TokensSection.tsx** — Design Tokens read-only view (colors, typography, spacing, radii, motion) built and wired into DSPreview above AtomsSection.

### TypeScript migration (epic: `.ai/specs/typescript-migration.md`)

1. ✅ **Phase 1 — Dead code audit (knip)** — old-three/, setupTests.js, CardGrid.js, reportWebVitals.js deleted; 13 packages uninstalled.
2. ✅ **Phase 2 — CRA → Vite + React 18 + test infrastructure** — Vite 8, React 18, Vitest, all .js renamed to .jsx.
3. ✅ **Phase 3 — TypeScript config** — `typescript` installed, `tsconfig.json` added with full strict config.
4. ✅ **Phase 4 — ESLint + Prettier + enforcement scripts** — `eslint.config.js`, `.prettierrc.json`, `scripts/`, `npm run check` canonical.
5. ✅ **Phase 5 — File conversion + Group 14** — all `.jsx`→`.tsx`/`.ts`; `src/three/` vendored files deleted, `ThreeScene.tsx` written using npm `three`; `npm run check` green.
6. ✅ **Phase 6 — Post-migration cleanup** — `find src -name "*.jsx"` returns nothing; `vite.config.ts` reverted to plain `react()`; CLAUDE.md stale references removed.
7. ✅ **Phase 7 — Verification gate** — build clean, deployed to Firebase, ianrios.me live.

### Pending (lower priority, unblocked by migration)

8. **Portfolio content** — Add latest work experience and projects to `src/data.ts` (requires Ian to supply content/details).
9. **V2 design exploration** — Read `.ai/specs/portfolio-overhaul.md`; implement items 6 (new job experience view), 7 (/resume path), 11/12 (animations, minimal/esoteric design).
10. **ImageBox** — Not started. See `.ai/specs/imagebox-epic.md`.

## Recently completed (2026-07-03)

- Control-Integrity epic (5 phases) — dead-token purge (5 button tokens + Elevation picker + gradient/ghost variants) with new `[token-unused]` drift check; Link/IconButton/IconLink unified into one polymorphic `<Button as>` (orthogonal variant/color/size/icon); `[token-example]` drift check; grouped-nav preview reorg (Tokens/Atoms/Molecules/Organisms/Patterns). `npm run check` now gates nine drift checks enforcing control↔effect↔example.

## Recently completed (2026-06-30)

- Design System Coherence epic (6 phases) — `/admin`→`/design-system` rename + permanent redirect; single `token-registry.ts` source of truth with seven drift checks wired into `npm run check`; Classic Windows parametric bevel depth language (supersedes skeuomorphism); presets unified into complete `THEMES`; new `Switch` atom with admin demo; theme/control parity fix.

## Recently completed (2026-06-23 – 06-25)

- Design token / inline-style migration (Phases 1–6): product code free of `style=` except 3 legitimate CSS custom properties; `preview.scss` deleted → `_components.scss` `skeu-` BEM classes; Typography/Layout/Motion sliders added.
- Scripts code review: merged the two validators into `scripts/validate.ts` (single tree walk, typed `[md-count]`/`[doc-size]`/`[code-size]`/`[eslint-disable]` categories); `package.json` `type: module` + `engines`, `.npmrc` engine-strict; `CLAUDE.md` Node version → `.nvmrc`.

## Not in scope right now

- Playwright / e2e tests
- Backend or API of any kind
- Paid services

## Open questions

- Animations: what should animate on the splash page vs main page?
- Mobile drawer: should it use the design system's `PushPanel` organism or stay as-is?
- V2: which spec direction wins? (see `.ai/specs/portfolio-overhaul.md`)
