# Platform Review — Findings Register (2026-07-06)

Status: RESOLVED — every finding below was fixed on 2026-07-06/07 via the
three epics (now in `.ai/completed/`); file:line references describe the
pre-fix code and are kept as the audit record.

Audit-only pass answering `.ai/specs/repo-platform-review.md`. No code changed.
Every item is either CONFIRMED (verified by reading code or running checks) or
OPEN (needs Ian's decision). Fix plans: `.ai/plans/design-system-integrity-epic.md`,
`.ai/plans/component-quality-epic.md`, `.ai/plans/platform-hygiene-epic.md`.

Verification state at audit time: `npm run check`, `npm run build`, `npm test`
(48 tests) all green.

## Direct answers to the review doc's questions

- **TS compile checked?** Yes — `npm run check` runs `tsc --noEmit`. Gap: `tsconfig.json`
  includes only `src`+`scripts`, so `vite.config.ts`/`eslint.config.js` are never
  type-checked (F30).
- **`--btn-gradient-end` still used?** Gone from all source. It survives in visitors'
  localStorage because stored vars are applied and re-persisted unfiltered (F1) —
  that is why "Warm tones detected --btn-gradient-end" appears.
- **Why four Link colors?** `--link-color/hover/active` are the three anchor states;
  `--link-primary-color` is a stale gradient-era token ("gradient-text color",
  `_tokens.scss:181`) now misused as text color (F3). The sidebar help text also
  contradicts the real wiring (F4).
- **Accordion auto-close?** Confirmed: single-open hardcoded, no props (F14).
- **Theme swatches vs Design Tokens colors?** Confirmed mismatch: swatches render only
  the 5 core color tokens, from live vars, hex-only (F6).
- **Deploy today?** Yes — all gates green. But `npm run deploy` skips check/test (F28).
- **Default design on deploy?** Terminal (registry defaults == Terminal theme; SCSS
  first paint matches except F2).
- **Barrel files?** None exist. Nothing to remove.
- **Overly verbose comments?** Broadly healthy — comments state constraints, not
  restatements. Exceptions: the stale `validate.ts` scaffold comment (F34) and
  gradient-era comments contradicting reality (`_tokens.scss:181`, F3).
- **Config settings organized sensibly?** Mostly. Two real problems are F9
  (five slider wrappers) and F4 (Links help text); section ordering (Motion
  before Typography, Links last) is taste — flag only, Ian's call.

## A. Design system / tokens

- **F1 CONFIRMED — stale localStorage keys applied + re-persisted forever.**
  `loadStored()` (`adminData.ts:455`) does not filter keys against the registry;
  `useDesignVars` merges them over DEFAULTS, writes every key to `:root`, and
  re-saves the merged map (`useDesignVars.ts:30-57`). Purged tokens
  (`--btn-gradient-end`) are immortal; derived `--bevel-*` are also persisted.
- **F2 CONFIRMED — registry↔SCSS value drift is unchecked.** All nine drift checks
  compare key _sets_, never values (`drift-checks.ts`). Live instance:
  `--link-primary-color` = `#39ff14` in registry vs `#1a3a1a` in `_tokens.scss:181`
  → first paint differs from post-JS state.
- **F3 CONFIRMED — `color="primary"` buttons illegible in most themes.**
  `.skeu-btn--color-primary` renders `--link-primary-color` as plain text
  (`_components.scss:360`); theme values are gradient-era near-background pales
  (Classic Bevel `#e8ebee` on `#c3c7cb`, Soft Neu `#eef2f8` on `#e0e5ec`, Paper,
  Pillow…). This is the root of "wrong colors in style × color combinations".
- **F4 CONFIRMED — Links sidebar help contradicts wiring.** Says Default = "plain
  `<a>` text only" (`TokenSidebar.tsx:135`) but `--link-color` drives every
  non-solid Button's default color (`_components.scss:333`).
- **F5 CONFIRMED — first visit persists DEFAULTS immediately.** `useDesignVars`
  runs on Home too; its effect writes localStorage on mount. Future default-theme
  changes will never reach returning visitors. Blocks the High Contrast request.
- **F6 CONFIRMED — theme swatches wrong.** `TokenPresets.tsx:7-26`: 5 core colors
  only, read from live vars (not the preset's own palette), rgba chrome filtered out.
- **F7 CONFIRMED — warm-tone detector flags built-in themes.** `isWarmHex` (hue
  8–50, sat>0.15) matches Paper's whole palette, Brutalist `#ff5500`, Maximal —
  applying a shipped theme triggers the warning. Detector also scans derived
  bevel tones and (per F1) stale keys.
- **F8 CONFIRMED — dual `useDesignVars` instances on `/design-system`.** Admin's
  "Home (live)" tab renders `<Main>` (`Admin.tsx:99`), which mounts its own
  instance + a second TokenSidebar in a nested PushPanel — two states, two `:root`
  writers, two localStorage writers; panels diverge until remount.
- **F9 CONFIRMED — five slider wrappers, one job.** `RangeControl` +
  `PxSlider`/`RawSlider`/`MsSlider`/`PctSlider` (`TokenControls.tsx`,
  `TokenSidebarExtra.tsx`) are variants of one registry-driven control.
  `RangeControl` accepts only min/max — registry `step`/`unit` are silently
  dropped (spread props ignored); it hardcodes the `px` suffix. Registry
  `ControlType` values `'shadow'`/`'angle'` are used nowhere.
- **F10 CONFIRMED — Button ignores the font scale.** `.skeu-btn` base 15px and
  size-axis 11/13/17/20px + icon-only paddings 4–12px are literals
  (`_components.scss:220,369-408`) — `--font-*` tokens never affect buttons.
  ~39 hardcoded `font-size` literals across `_components.scss` overall.
- **F11 CONFIRMED — `demo-missing` blind spot.** The check scans only
  `atoms/molecules/organisms` dirs (`validate.ts:207`); `masonry-card.tsx` sits at
  `src/components/` root and escapes the demo requirement (and the atomic tiers).
- **F12 CONFIRMED — stray hardcoded chrome.** e.g. `rgba(128,128,128,0.08)` border
  in `.skeu-mixed-grid__feat-hero` (`_components.scss:~1559`) instead of
  `--border-color`. Needs a one-pass sweep with an explicit exemption list.
- **F13 OPEN — High Contrast as default for new users.** Today Terminal is default
  at every layer (SCSS + registry + detect). Making High Contrast the default
  requires registry defaults + `_tokens.scss` + bevel-tone first-paint parity,
  and only works for returning visitors if F1/F5 persistence changes land first.
- **F14 CONFIRMED — Accordion single-open hardcoded** (`Accordion.tsx:11`), no
  `autoClose`/`defaultOpen` props. Same disclosure state hand-rolled in
  `SidebarSection`, `NavVerticalSections`, `ExpandableCard`, masonry tools toggle,
  `CardWithDropdown`, and PortfolioSidebar's external-links toggle — whose state
  is named `ul` (`Home.tsx:36`), the naming anti-pattern from Ian's notes.
- **F15 NOTE — demo _accuracy_ is not machine-checkable.** `demo-missing` proves
  reachability, not that a demo shows real states. Manual review found demos
  broadly accurate; preview Buttons link to deprecated `/admin` (F24).

## B. React / components

- **F16 CONFIRMED — side effect in render.** `titleSelector()` calls
  `scrollIntoView()` during every Home render (`Home.tsx:62-70`); also misnamed
  (returns a heading string).
- **F17 CONFIRMED — props/module-state mutation in render.** `skills.sort()`
  mutates the module-level array (`PortfolioSidebar.tsx`; built `Home.tsx:18`).
  OPEN: sort is ascending by count — least-used skill first. Intended?
- **F18 CONFIRMED — impure state updater.** `PushPanel` calls `onOpenChange`
  inside the `setOpen` updater (`PushPanel.tsx:103-109`); double-fires under
  StrictMode (which `main.tsx` enables).
- **F19 CONFIRMED — dead effect.** `#three-container` exists nowhere;
  `Home.tsx:56-60` is a no-op vestige.
- **F20 CONFIRMED — pointless wrapper.** `MetaBalls.tsx` is a 5-line pass-through
  to `ThreeScene`.
- **F21 CONFIRMED — WebGL resource leak.** `ThreeScene` cleanup disposes
  renderer/controls but not the MarchingCubes geometry/material (splash → main →
  splash remounts accumulate GPU memory).
- **F22 CONFIRMED — a11y defects.** `ExpandableCard`: `role="button"` div wraps
  interactive Badges (nested-interactive), Space doesn't `preventDefault` (page
  scrolls), no `aria-expanded` (Accordion lacks it too). `FormField` label has no
  `htmlFor`/id. masonry-card's 2nd image uses `alt={item.body}` (paragraph as alt
  text). ContactModal: no Escape close, no focus trap, iframe `height="900"`.
- **F23 CONFIRMED — near-duplicate molecules.** `NavBar` and `NavVertical` share
  props + active-state logic verbatim; NavBar's links variant hardcodes
  `href="#demo"`. Demo fixture copy (Report settings etc.) baked into
  `CardWithDropdown` defaults.
- **F24 CONFIRMED — content logic in components.** masonry-card hardcodes
  `item.title === 'Meta Spheres'` for the wiki link; redefines its own item type
  instead of the `types/data.ts` union; index keys (also `key={i}` in Home);
  the repo's only default-exported component besides pages. PortfolioSidebar
  hardcodes the 5 external links (belongs in `data.ts`). Preview demos link to
  `/admin` instead of `/design-system`.
- **F25 CONFIRMED — untyped icon names, two icon systems.** `Icon name: string`
  falls back to `'·'` on typo silently; SVG paths + unicode glyphs render at
  different visual weights. Name should be a union of the two maps' keys.
- **F26 CONFIRMED — prop drilling / state shape.** 9-prop `sidebarProps` bag
  threads Home → MobileNavDrawer → PortfolioSidebar; `view`/`page` are raw
  strings (should be unions); F8's dual-instance problem is the same root cause —
  design vars want a context provider.
- **F27 CONFIRMED — unvalidated JSON.parse casts.** `loadStored`
  (`adminData.ts:459`), `WelcomeView.tsx:27`, and `location.state`
  (`Home.tsx:31`) cast unvalidated external data; the repo standard Ian wants
  (schema-validated config) doesn't exist yet. Otherwise clean: no `any`, no
  other concerning `as` casts; strict flags incl. `noUncheckedIndexedAccess`
  and `exactOptionalPropertyTypes` are on.

## C. Build / deploy / tooling

- **F28 CONFIRMED — deploy skips gates.** `deploy: npm run build && firebase deploy`.
  No check, no test.
- **F29 CONFIRMED — 820 kB single JS chunk** (222 kB gzip): three.js is in the
  entry bundle; Vite warns at build. `/three` + `/design-system` are lazy-load
  candidates. BUGS.md already lists code splitting, error boundaries, 404 — none
  scheduled.
- **F30 CONFIRMED — config files not type-checked** (see direct answers).
- **F31 CONFIRMED — Sass `@import` deprecation warning** at every build
  (`main.scss:3`); Sass 1.x will remove it. Migrate to `@use`/`@forward`.
- **F32 CONFIRMED — ancient Firebase CDN SDK.** `index.html` loads compat 7.6.2
  (2019) scripts (end of `<body>` — they delay `load`, not first paint) for
  analytics only, config inline. The actually render-blocking external request
  is the Google Fonts stylesheet in `<head>`. OPEN: keep analytics (→ modular
  npm SDK) or drop it?
- **F33 CONFIRMED — zero component tests.** 4 test files, all pure logic.
  Testing Library installed but unused; `useDesignVars`/`loadStored`
  (the buggiest surface, F1/F5/F8) untested. Coverage pkg installed, no script.
- **F34 CONFIRMED — size-budget blind spots.** `[code-size]` covers only
  ts/js: `_components.scss` (2,285 lines) is unbudgeted. `isDataFile`
  (`validate.ts:85`) exempts any `*[Dd]ata.*` — `adminData.ts` (583 lines)
  contains functions (`theme()`, `loadStored`, `detectMatchingPreset`) that ride
  the exemption. `validate.ts` still carries the stale "Flip asError in step 1c"
  scaffold (`DRIFT` const is now pointless).
- **F35 NOTE — local Node v23 ≠ `.nvmrc` 20.19** (engines pass; worth an `nvm use`
  habit note, not a code change).

## D. Docs / context engineering

- **F36 CONFIRMED — CONTEXT.md describes a different project** ("Record label
  website, EPK", `npm run start`). Actively misleading; rewrite as pointers.
- **F37 CONFIRMED — superseded specs still active.** `skeuomorphism-design-overhaul.md`
  - `skeuomorphism-tokens.md` (CLAUDE.md: "Supersedes the old skeuomorphism
    specs") and likely `metaballs-update.md` still sit in `.ai/specs/` → move to
    `.ai/completed/`.
- **F38 CONFIRMED — em/en dashes in production copy.** `TokenSidebar` help,
  `— choose —` option, preview `SectionLabel`s ("Card — primary actions"),
  V2Preview "2022–now", DSPreview annotation. `data.ts` is clean. OPEN: rule
  scope (does it cover design-system UI labels?) and replacement style.
- **F39 CONFIRMED — stale/erroneous portfolio copy.** `data.ts`: "A neumorphic
  design system" (pivot was to Classic Windows bevel), "An reverse-entropy"
  typo, commented-out dead project blocks.
- **F40 OPEN — `.claude/settings.json` allowlist is minimal.** Read-only basics
  only; `ls`, `find`, `mv`, `mkdir`, `git` read ops, `npx tsx`, `npm run dev`
  all prompt. Proposal: run `/fewer-permission-prompts` and review its diff.
- **F41 NOTE — doc structure is otherwise healthy.** 16/25 active .md files;
  progressive disclosure largely respected (one list of nine checks, pointers
  elsewhere). No barrels, no `eslint-disable`, knip green. Gaps worth writing
  down, not restructuring: WORKFLOW has no guidance on delegating to lower-power
  models for scoped implementation, and no `.claude/agents/` or skills exist yet.
  Claude repo memories + MEMORY.md are in active use and current — no action.

## E. Peer-review additions (zero-context review, verified)

- **F42 CONFIRMED — README.md is the stock CRA README.** Documents `npm start`,
  port 3000, `eject` on a public resume-linked repo. Worse than F36 because it
  is the repo's front page.
- **F43 CONFIRMED — `public/.DS_Store` is tracked in git** (committed before the
  ignore rule; `git ls-files` shows it). Needs `git rm --cached`.
- **F44 CONFIRMED/OPEN — fabricated work history on the live site.**
  `V2Preview.tsx:57-67` ships an ExpandableCard "Frontend Engineer, Previous Co,
  2020–2022" with invented bullets (fixture twin at `adminData.ts` TIMELINE/V2
  data). On a resume-linked domain this is a content-integrity problem; only
  Ian can supply the real content or the labeling.
- **F45 CONFIRMED — font family untokenized.** `'Montserrat', sans-serif`
  literals (`_base.scss:222`, `_components.scss:524`) + render-blocking Google
  Fonts `<link>` in `<head>`. Extends F10: the font _family_ axis has no token
  at all. OPEN whether it should be theme-editable.
- **F46 CONFIRMED — MixedProjectGrid hardcodes fallback copy** duplicating
  `V2_PROJECTS` ('SpecLab', desc, tools) inline (`MixedProjectGrid.tsx:24-31`).

## Cross-epic sequencing

Epics are approvable independently, but three touchpoints impose order:

1. `adminData.ts` is rewritten by design P1 (loadStored), reorganized by
   hygiene P1 (logic out of data files), and appended by component P3
   (fixture defaults in). Land in that order, or re-peer-review the later
   sub-plan against the newer file.
2. Component P5 (tests) also depends on design P1+P5 (provider + filtering are
   what it tests) — schedule it last overall.
3. Hygiene's SCSS work (Sass `@use` + monolith split) must not interleave with
   design P3/P6 SCSS edits — whichever lands second rebases trivially, but not
   simultaneously.

## Decisions (Ian, 2026-07-06) — all questions below are RESOLVED

1. Persistence: store `{ version, theme, overrides, snapshot }` — theme name +
   user-edited diffs (simplest long-term; enables future theme ideas, see
   `.ai/specs/theme-ideas.md`). Snapshot of resolved vars is regenerated on
   every persist so the flash script stays dumb and stale keys cannot survive.
2. Default theme: programmatic via a `DEFAULT_THEME` constant (High Contrast).
   SCSS/registry first-paint values must equal `THEMES[DEFAULT_THEME]` —
   enforced by the new value-sync check, so changing the default later is
   "edit one constant, the check lists every literal to update".
3. Link colors: three states only. Drop `--link-primary-color`; the Button
   `primary` color axis uses `--btn-primary-bg`.
4. Warm-tone detector: remove.
5. Firebase analytics: keep, migrate to modular npm SDK.
6. Dashes: none allowed in production copy, period. Goes in RULES.md.
7. Skills sort: agent's call → most-used first.
8. SCSS: full restructure — tier-scoped partials (tokens/base/atoms/molecules/
   organisms/admin/pages) + SCSS added to size budgets.
9. Accordion props: agent's call → `autoClose` (default true) + `defaultOpen`.
10. Package extraction: keep colocated; keep types clean for later.
11. "Previous Co": label clearly as sample data (v2 build comes later per
    `portfolio-overhaul.md`).
12. README: describe what this repo actually is.
13. Schema validation: hand-rolled typed guards, no zod.
14. Font: tokenize family (fixed token, no control yet); don't build multi-font
    theming until more fonts exist.
