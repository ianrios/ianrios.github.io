# Phase 5 — File Conversion Plan ✅ DONE

Status: Done

## Problem statement

All source files are `.jsx`/`.js`. Phase 5 converts every one of them to `.tsx`/`.ts`, establishing strict TypeScript throughout the codebase. The baseline has one known typecheck error (`main.tsx` importing `App.jsx` as implicit `any`) which this phase resolves.

Scope expanded from spec: five `src/pages/admin/preview/` files and `TokenControls.jsx`, `MobileNavDrawer.jsx`, `WelcomeView.jsx` are new additions not listed in the original spec but are in scope per Ian's confirmation.

---

## Files to change

Conversion order: dependencies before consumers (bottom-up). `npm run check` after each logical group.

### Group 1 — src/types/ (new directory, 4 files)

- `src/types/data.ts` — `ProjectData`, `WorkExperience`, `HobbyData`, `ToolsMap` (read `data.jsx` for exact field shapes; no `skills` field present — the `SkillTuple` spec entry is unused by current data)
- `src/types/admin.ts` — `CSSTokenMap` (Record of `--${string}` → string); typed preset shapes for `COLOR_PRESETS`, `SHAPE_PRESETS`; individual types for all 13 `adminData` exports
- `src/types/design-vars.ts` — `DesignVarsReturn` explicit interface (do not infer — spec requirement)
- `src/types/css.d.ts` — module augmentation: `CSSProperties { [key: \`--${string}\`]: string | number | undefined }`

### Group 2 — atoms (10 files → .tsx)

Badge, Button, ColorPicker, Icon, IconButton, IconLink, Input, Link, Slider, ValueInput.

- ColorPicker, Slider, Input: rest-spread typed as `React.ComponentPropsWithoutRef<'input'>`
- All: inline prop types on function signatures; no `FC<>`

### Group 3 — molecules (7 files → .tsx)

Accordion, Card, CardWithDropdown, FormField, NavBar, NavVertical, NavVerticalSections.

### Group 4 — hook (1 file → .ts)

`useDesignVars.jsx` → `useDesignVars.ts`

- Fix: `useState([])` → `useState<string[]>([])`
- Annotate return type as `DesignVarsReturn` from `src/types/design-vars.ts`
- `computePopShadows` return type: `Partial<CSSTokenMap> | null`

### Group 5 — organisms (6 files → .tsx)

ContactModal, DesignSystemDrawer, ExpandableCard, PageLayout, PortfolioSidebar, PushPanel.

### Group 6 — misc components (2 files → .tsx)

`src/MetaBalls.jsx`, `src/components/masonry-card.jsx`

### Group 7 — data (1 file → .ts)

`src/data.jsx` → `src/data.ts` — typed against `src/types/data.ts`. Each export (`independentProjectsData`, `workProjectsData`, `hobbyData`, `tools`) gets an explicit `const x: Type[]` annotation.

### Group 8 — admin utilities (2 files → .ts)

- `src/pages/admin/colorUtils.jsx` → `colorUtils.ts`
  - Refactor `rgbToHsl` `switch (max)` to explicit `case` blocks with `return` statements (per spec — eliminates `noFallthroughCasesInSwitch` risk)
  - Add null-guards for `noUncheckedIndexedAccess` where array indices are accessed
- `src/pages/admin/adminData.jsx` → `adminData.ts`
  - Type all 13 exports precisely; `ELEVATION_PRESETS` typed as `Record<'low'|'med'|'high', string>` (not generic Record)

### Group 9 — admin preview subcomponents (5 files → .tsx)

`ButtonHelpers`, `AtomsSection`, `MoleculesSection`, `OrganismsSection`, `CombinationsSection`

### Group 10 — admin UI (5 files → .tsx)

`TokenControls`, `TokenSidebar`, `DSPreview`, `V2Preview`, `AdminUI`

### Group 11 — pages (4 files → .tsx)

`MobileNavDrawer`, `WelcomeView`, `Home`, `Admin`

### Group 12 — app root (1 file → .tsx)

`src/App.jsx` → `App.tsx` — resolves the baseline `main.tsx` typecheck error

### Group 13 — main.tsx (already .tsx)

Add explicit types; confirm no errors now that App.tsx exists.

### Group 14 — src/three/ rewrite

- Run: `npm install three@latest` and `npm install --save-dev @types/three` (check if already present first)
- Delete: `src/three/MarchingCubes.js`, `OrbitControls.js`, `three.module.js`, `webgl_marchingcubes.js`
- Create: `src/three/ThreeScene.tsx` — React component; `useRef` mount point; `useEffect` scene lifecycle with proper cleanup; typed npm imports from `three` and `three/examples/jsm/`
- Wire: add `/three` route to `App.tsx`

### Group 15 — post-conversion cleanup

- Update `knip.json`: entry `src/index.js` → `src/main.tsx`; glob `*.{js,jsx}` → `*.{ts,tsx}`
- Update `vite.config.ts`: remove `include: /\.[jt]sx?$/` from react plugin; revert to plain `react()`
- Update `CLAUDE.md`: remove `.jsx`/`.js` file references; update app structure section with `/three` as React route; update data/component paths

---

## Known conversion challenges

**`noUncheckedIndexedAccess`** — `obj[key]` yields `T | undefined`. Affects `adminData` preset lookups, `colorUtils` array destructuring, `useDesignVars` CSS token lookups. Add null-guards; do not cast.

**`colorUtils` refactors (Group 8):**

- Refactor `rgbToHsl` `switch (max)` to explicit `case` blocks with `return` statements.
- Type `rgbToHsl` return as `[number, number, number]` tuple — fixes `noUncheckedIndexedAccess` destructuring for all callers (`computePopShadows`, `isWarmHex`, `desaturateHex`).
- `hslToHex` mutates param `h` (`h /= 360`) and inner `hue2rgb` mutates `t` — shadow as local `const`s.

**`loadStored` return type (Group 8)** — returns `JSON.parse` result; values are `unknown`. `useDesignVars` spreads result into `CSSTokenMap`. Fix: type `loadStored` to return `Partial<CSSTokenMap> | null` with an explicit type assertion after parsing (we wrote the data; safe to assert).

**Rest-spread atoms** — ColorPicker, Slider, Input spread `...props` onto `<input>`. Type rest as `React.ComponentPropsWithoutRef<'input'>`.

**`skills` sort comparator (Group 5 — PortfolioSidebar.jsx:70)** — `.sort((a, b) => a[1] < b[1])` returns boolean. Fix: `(a, b) => (a[1] as number) - (b[1] as number)`, skills typed as `[string, number][]`.

**`CARD_COLOR_VARIANTS` null variant (Group 9)** — `adminData.jsx:494` has `variant: null`. `className` accepts `string | undefined`, not `null`. Type as `variant: string | null`; consumers add `variant ?? undefined`.

**`noUnusedParameters`** — blanket risk across Groups 3, 5, 9, 10. Props accepted but not forwarded will error. Prefix unused with `_` or remove.

**`useDesignVars` CSS token lookups** — `vars['--shadow-angle']` is `string | undefined`. The existing `|| '315'` fallbacks cover most cases; confirm TypeScript sees them after typing.

**Three.js rewrite** — scope is non-trivial. If it blocks the sweep, defer to a sub-phase: keep vendored files as-is until a clean `ThreeScene.tsx` is ready.

---

## Approach

- One git commit per group or per file for large files. Never commit a failing typecheck.
- Run `npm run check` after each group. Fix before proceeding.
- `import type` for all type-only imports throughout.
- No `// @ts-ignore`, no `any` casts, no `eslint-disable`.

---

## Risks / tradeoffs

- **Three.js rewrite is large.** The vendored files work today. If the rewrite surfaces deep issues, defer it and do the sweep first — the route can remain on the old vendored files until a clean ThreeScene.tsx is ready.
- **1,648 lines of new untracked admin/preview + TokenControls files** — these haven't been reviewed for type challenges yet. Scanning during Group 9–10 may surface surprises.
- **`ELEVATION_PRESETS` key access in `detectElevationLevel`** — `ELEVATION_PRESETS[k]` is typed `string | undefined` under noUncheckedIndexedAccess. Needs null-guard.

---

## Verification checklist

After all groups complete:

- `npm run check` — zero errors, zero warnings
- `npm run build` — clean output to `build/`
- `npm test` — all passing
- `find src -name "*.jsx" -o -name "*.js"` — must return nothing
- Manual smoke test: `/`, `/admin`, `/three` routes render correctly
