# Phase 4 — ESLint + Prettier + Enforcement Scripts ✅ DONE

Epic: `.ai/specs/typescript-migration.md`
Status: Done — tooling wired, file-size violations remain

---

## Problem

Tooling (ESLint, Prettier, validation scripts) is wired and running.
`npm run lint` now fails on legitimate file-size violations. Three issues
remain before Phase 4 closes:

1. Scripts copied from petal contain petal-specific paths/ignores
2. Doc files (`WORKFLOW.md`, `imagebox-epic.md`) exceed limits
3. Source files (`DSPreview.jsx`, `TokenSidebar.jsx`, `Home.jsx`,
   `V2Preview.jsx`) exceed the 250-line code limit after Prettier expansion

---

## A — Script fixes

**`scripts/check-no-eslint-disable.js`**

`ignorePatterns` contains `'dist'`, `'coverage'`, `'.next'` — none exist
in this repo. Replace with: `['node_modules', '.git', 'build']`

**`scripts/validate-doc-lines.js`**

- JSDoc comment (line 11–14) still says `stories/notes/completed` —
  update to match actual code: `.ai/plans`, `.ai/specs`, `.ai/completed`
- `excludeDirs` Set is re-created on every recursive `walkDir` call — move
  it outside the function

---

## B — Doc trimming

**`.ai/WORKFLOW.md` (213 lines → target ≤80)**

"Operating model" and "Session startup protocol" sections duplicate
`CLAUDE.md`. "Anti-patterns" (67 lines) moves to new `.ai/ANTI-PATTERNS.md`.
Remaining sections are rewritten ultra-tersely to fit ≤80 lines total.

WORKFLOW.md after: progressive disclosure, planning convention, epics/sub-plans,
peer review, approval gate, verification, doc-update checklist, pointer to
ANTI-PATTERNS.md.

**`.ai/ANTI-PATTERNS.md` (new, ~70 lines)**

Contains the anti-patterns section verbatim from current WORKFLOW.md.
Gets the 280-line exception from `.ai/plans/` — wait, it's in `.ai/` root
so it's subject to 80-line limit. Actually at ~70 lines it should pass.

Wait — ANTI-PATTERNS.md would be at `.ai/ANTI-PATTERNS.md`, not in
`.ai/plans/`. 80-line limit applies. Anti-patterns section is 67 lines
of body + headers = ~70 lines. Passes. ✅

**`.ai/specs/imagebox-epic.md` (316 lines → target ≤280)**

Trim 36+ lines from phase task descriptions: remove redundant "Agent notes"
paragraphs that restate what the task list already says.

---

## C — Home.jsx (327 lines → target ≤250)

Extract two focused components:

**`src/pages/WelcomeView.jsx`** (~25 lines)
The welcome screen JSX (lines 159–182) plus the `colors` array (lines 22–39)
that is only used by welcome screen. Receives `setView` prop.

**`src/pages/MobileNavDrawer.jsx`** (~55 lines)
The mobile navigation overlay (lines 196–264). Receives `mobileNavOpen`,
`setMobileNavOpen`, `sidebarProps` props.

`Home.jsx` after: ~245 lines ✅

---

## D — DSPreview.jsx (1491 lines → target ≤250 per file)

Prettier expanded inline style objects ~3x. Root anti-patterns:

- No section split at all
- Repeated `<div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 2 }}>` pattern for icon entries (8+ instances)
- Repeated flex-wrapper pattern for demo groups
- All state at top of monolith

**New file: `src/pages/admin/preview.scss`**

Utility classes that replace the repeated inline style blocks:

- `.preview-icon-entry` — flex column, center, gap 2px
- `.preview-icon-label` — font-size 9, color muted
- `.preview-flex` — display flex, gap space-sm, flex-wrap wrap, align center
- `.preview-note` — font-size 11, color muted, line-height 1.6
- `.preview-page-frame` — color-bg bg, space-lg padding, radius-lg, border

**New helper: `src/pages/admin/preview/ButtonHelpers.jsx`** (~35 lines)
`ButtonStateRow` component + `LINK_STYLES` + `LINK_COLORS` constants.

**New files under `src/pages/admin/preview/`:**

| File                      | Content                                              | Own state                                                                         | Target |
| ------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- | ------ |
| `AtomsSection.jsx`        | Buttons, Badges, Icons, Inputs, Sliders, ColorPicker | `sliderVal`, `inputVal`                                                           | ≤250   |
| `MoleculesSection.jsx`    | FormField, Cards, Nav, Accordion                     | none                                                                              | ≤200   |
| `OrganismsSection.jsx`    | Page frames, Card grid, NavVerticalSections          | none                                                                              | ≤200   |
| `CombinationsSection.jsx` | Combos, PushPanel, PortfolioSidebar, ContactModal    | `sidebarPage`, `sidebarShowTools`, `sidebarUl`, `contactModalOpen`, `DEMO_SKILLS` | ≤250   |

Each section file is **self-contained** — it carries its own imports and
local state. `DSPreview.jsx` only imports the 4 section components.

**`DSPreview.jsx` after:** 4 section imports + wrapper fragment + Export
textarea (uses `exportText` prop). Target ~25 lines. ✅

Risk: AtomsSection may still exceed 250 if Button matrix is large after
Prettier. Mitigation: if it exceeds, extract `ButtonSection.jsx` for the
button style/size/state demos separately.

---

## E — TokenSidebar.jsx (718 lines → target ≤250)

**`src/pages/admin/TokenControls.jsx`** (~240 lines)
Extract: `SidebarSection`, `ColorControl`, `RangeControl`, `ShadowControl`,
`PresetSelect`, `ColorSwatches` (currently lines 10–244).

**`TokenSidebar.jsx` after extraction:** ~478 lines — still over.

Fix: use config-driven rendering for control groups. Replace explicit
`<ColorControl label="X" varName="Y" vars={vars} setVar={setVar} />` ×25
with data arrays mapped to controls. Collapses ~220 lines to ~25 lines.

Example pattern:

```
const COLOR_CONTROLS = [
  { label: 'Background', varName: '--color-bg' },
  ...
];
// In JSX:
{COLOR_CONTROLS.map(c => <ColorControl key={c.varName} {...c} vars={vars} setVar={setVar} />)}
```

Control config arrays defined at module scope in `TokenSidebar.jsx`.
Button section (150 lines) stays as JSX — it has elevation logic + presets
that don't fit the simple config pattern. Extract `ButtonTokenSection.jsx`
if needed to stay under 250.

`TokenSidebar.jsx` target: ≤250 lines ✅

Note: `Admin.jsx` passes `setVars`, `copySuccess`, `exportCSS`, `exportText`,
`resetAll` to `<TokenSidebar>` — these are unimplemented features from
`useDesignVars` that the current TokenSidebar silently drops. Do not wire
them during this refactor; leave Admin.jsx props unchanged.

---

## F — V2Preview.jsx (372 lines → target ≤250)

The two "mixed-density project grid" sections (with/without images) are
structurally identical — extract `MixedProjectGrid` component taking
`showImages` prop. Both grids collapse from ~90 lines each to ~5 lines.

`V2Preview.jsx` target: ~200 lines ✅

---

## Approach order

1. Fix scripts (A)
2. Trim docs (B)
3. Home.jsx split (C)
4. Create `preview.scss` + `ButtonHelpers.jsx` + 4 section files (D)
5. Create `TokenControls.jsx`, config-driven `TokenSidebar.jsx` (E)
6. Extract `MixedProjectGrid` from V2Preview (F)
7. Run `node scripts/validate-doc-lines.js` after each section
8. Final: `npm run check && npm run build && npm test`

---

## Verification

```
node scripts/validate-doc-lines.js   # zero errors
npm run check                        # format → typecheck → lint
npm run build                        # clean build/ output
npm test                             # all passing
```

Known permanent failures: `src/three/` vendored files (Phase 5 replacement).
