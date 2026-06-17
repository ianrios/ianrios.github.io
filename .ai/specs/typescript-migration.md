# TypeScript Migration Spec

## Goal

Migrate the full repo from CRA + plain JS to Vite + TypeScript with petal-grade strictness. Motivation: agents write better code under strict types; this is the constraint that enforces production quality going forward.

## Scope

All files in `src/`. No exclusions. `src/three/` rewritten as a proper React route. Dead files deleted after knip confirms them.

---

## Phase 1 — Dead code audit (knip) ✅ DONE

Ran knip against `src/index.js`. Results and actions:

**Files deleted:**
- `src/old-three/` (5 files: `example.js`, `main.js`, `threetutorial.js`, `utils.js`, `three.css`)
- `src/setupTests.js`
- `src/components/organisms/CardGrid.js` — not imported anywhere (surprise finding)
- `src/reportWebVitals.js` — imported in `index.js` but called with no callback (no-op); import and call removed from `index.js`

**Packages uninstalled (13):**
All `@react-three/*` (11 packages), `axios`, `nice-color-palettes`, `web-vitals`

**Intentionally kept despite knip flags:**
- `@testing-library/*` — flagged unused because `setupTests.js` was the entry point; upgraded in Phase 2
- `sass` — false positive; knip does not trace SCSS imports; actively used
- `three` — vendored copy lives in `src/three/`; replaced with npm import in Phase 5

**`react-three-paper` correction:** Initially uninstalled by mistake. `MetaBalls.jsx` actively imports `Paper` from it. Reinstalled.

**`src/three/` vendored files:** Live code — not dead. Knip flagged 442 unused *exports* from the vendor bundle (the full Three.js API). Stay until Phase 5 rewrites them.

**Remaining knip findings after Phase 1** (all intentional):
- 4 unused deps (`@testing-library/*` ×3, `three`) — intentionally kept
- 1 unused devDep (`sass`) — false positive
- 442 unused exports — vendored `src/three/` files, gone in Phase 5
- 1 unlisted binary (`firebase`) — global CLI, expected

### Phase 1 — Doc update

No CLAUDE.md or `.ai/` changes needed here — dead code removal is self-evident from git history.

---

## Phase 2 — CRA → Vite + React 18 + test infrastructure ✅ DONE

**Toolchain changes made:**
- `react-scripts`, `cross-env`, `web-vitals` removed
- `vite`, `@vitejs/plugin-react` installed
- React upgraded 17 → 18
- `src/index.js` renamed to `src/main.tsx`; rewritten with `createRoot`; old `ReactDOM.render` removed
- `.env` deleted (contained only `NODE_OPTIONS=--openssl-legacy-provider`)
- `public/index.html` moved to project root, cleaned up (stripped `%PUBLIC_URL%`, removed orphaned `#three-container` div, preserved flash-prevention script, removed CRA template comments)
- `@testing-library/react` 11→14, `jest-dom` 5→6, `user-event` 12→14
- `vitest`, `@vitest/coverage-v8` installed; `src/vitest.setup.ts` added
- `@types/react@18`, `@types/react-dom@18` installed
- `vite.config.ts` created; `src/vite-env.d.ts` created
- All non-`src/three/` `.js` files renamed to `.jsx` (see Stubbed toe below)
- `knip.json` entry point remains `src/index.js` — update to `src/main.tsx` after Phase 5 renames are complete

**Scripts (current):**
```
dev       → vite
build     → vite build
preview   → vite preview
typecheck → tsc --noEmit
lint      → eslint . && node scripts/check-no-eslint-disable.js && knip --no-config-hints
format    → prettier . --write
test      → vitest run
deploy    → npm run build && firebase deploy
```

**Build status:** `✓ built in 1.41s` — clean build, no errors. SCSS `@import` deprecation warnings are cosmetic (Dart Sass 3.0 prep) and do not break the build.

**Node / tooling:** `.nvmrc` pins Node 18.19.0. Vite 8 requires Node 18+. Node 18, 20, 22, or 23 all work — no `nvm use` required as long as Node 18+ is active. No additional `.rc` files needed (no `.npmrc`, no `.yarnrc`). npm is the package manager for this repo.

### Stubbed toe: Vite 8 does not transform JSX in `.js` files

Vite 8 (uses rolldown for production builds) does not process JSX syntax in `.js` files. The `@vitejs/plugin-react` `include` option does not propagate to rolldown's built-in transform. The workaround: all non-`src/three/` `.js` files were renamed to `.jsx`. This is an intermediate state — Phase 5 will rename `.jsx` → `.tsx` or `.ts`. No `.jsx` files should remain after Phase 5 completes.

`vite.config.ts` currently has `react({ include: /\.[jt]sx?$/ })` — this can be simplified back to `react()` after Phase 5 since Vite natively handles `.tsx`.

### Phase 2 — Doc update

Update `CLAUDE.md` dev server section: replace `react-scripts start` with `vite` and `PORT=3001` with `npm run dev -- --port 3001`. Update build/test commands. Note that `.jsx` files are a temporary migration state.

---

## Phase 3 — TypeScript config ✅ DONE — see `.ai/plans/typescript-migration-phase-3-tsconfig.md`

---

## Phase 4 — ESLint + Prettier + enforcement scripts

### ESLint

`eslint.config.js` matching petal exactly:
- `tseslint.configs.strictTypeChecked` + `stylisticTypeChecked` (scoped to `*.{ts,tsx}`)
- Plugins: `jsx-a11y`, `react-hooks`, `react-refresh`
- Rules:
  - `@typescript-eslint/consistent-type-imports: error` (inline style)
  - `@typescript-eslint/no-floating-promises: error`
  - `@typescript-eslint/no-non-null-assertion: error`
  - `@typescript-eslint/no-explicit-any: error`
  - `max-len: [error, { code: 80, ignoreUrls: true, ignoreStrings: true }]`
  - `no-console: [warn, { allow: ['warn', 'error'] }]`
  - `react-refresh/only-export-components: warn`

### Prettier

`.prettierrc.json`:
```json
{
  "printWidth": 80,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all"
}
```

### Enforcement scripts

`scripts/check-no-eslint-disable.js` — walks all `.ts`/`.tsx` files, exits 1 if any `eslint-disable` comment is found. Zero exceptions.

### knip

`knip.json` post-Phase-5 entry:
```json
{
  "entry": ["src/main.tsx"],
  "project": ["src/**/*.{ts,tsx}"]
}
```

### Phase 4 — Doc update

Update `CLAUDE.md` verification section: add `npm run lint` to the standard check sequence. Add note: `eslint-disable` comments are banned by `scripts/check-no-eslint-disable.js` — fix the underlying issue instead.

---

## Phase 5 — File conversion (bottom-up)

All `.jsx` files from Phase 2 get converted to `.tsx` or `.ts` here. No `.jsx` files should remain after this phase. Files that contain JSX become `.tsx`; pure logic files (no JSX) become `.ts`.

Convert in this order so dependencies are always typed before their consumers:

1. `src/types/` — new directory with all shared interfaces (details below)
2. `src/components/atoms/` — all 10 atoms (`.jsx` → `.tsx`)
3. `src/components/molecules/` — all 7 molecules (`.jsx` → `.tsx`)
4. `src/hooks/useDesignVars.jsx` → `useDesignVars.ts`
5. `src/components/organisms/` — all 8 organisms (`.jsx` → `.tsx`)
6. `src/MetaBalls.jsx` → `MetaBalls.tsx`, `src/components/masonry-card.jsx` → `masonry-card.tsx`
7. `src/data.jsx` → `src/data.ts` — typed against `src/types/`
8. `src/pages/admin/` — `adminData`, `colorUtils` → `.ts`; `DSPreview`, `TokenSidebar`, `V2Preview`, `AdminUI`, `Admin` → `.tsx`
9. `src/pages/Home.jsx` → `Home.tsx`, `src/App.jsx` → `App.tsx`
10. `src/main.tsx` — already `.tsx`; add types
11. `src/three/` — full rewrite (details below)

After all conversions: update `knip.json` entry from `src/index.js` to `src/main.tsx` and project glob from `*.{js,jsx}` to `*.{ts,tsx}`. Remove `react({ include: /\.[jt]sx?$/ })` from `vite.config.ts` — revert to plain `react()`.

### Prop pattern

Inline prop types on function signatures. No `FC<>` wrapper. Match petal:

```tsx
export function Button({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) { ... }
```

### Type imports

Always `import type` for type-only imports:

```ts
import type { CardData } from '../types/data';
```

### `src/types/` — full inventory

Do not guess the shapes — read each source file before writing its type.

**`src/types/data.ts`** — data model for `src/data.jsx`:
- `CardData`, `ProjectData`, `WorkExperience` (read `data.jsx` for exact shapes)
- `SkillTuple = [string, number]` — skills are two-element tuples, not flat objects

**`src/types/admin.ts`** — types for `adminData.jsx`, which has 13 named exports, each with a distinct shape:
- `DEFAULTS` — `CSSTokenMap` (typed `Record` of CSS custom property names to string values)
- `COLOR_PRESETS`, `SHAPE_PRESETS`, `ELEVATION_PRESETS` — preset arrays; each preset carries a `vars` sub-object with a different subset of CSS token keys — type individually, not as `Record<string, string>`
- `BUTTON_VARIANTS`, `BUTTON_SIZES`, `BADGE_SAMPLES`, `CARD_GRID_DATA`, `ACCORDION_ITEMS`, `VERTICAL_NAV_SECTIONS`, `CARD_COLOR_VARIANTS`, `TIMELINE_EVENTS`, `V2_PROJECTS` — read each and type precisely

**`src/types/design-vars.ts`** — return type of `useDesignVars`:
- Define `DesignVarsReturn` interface explicitly; do not rely on inference
- `warmKeys` is initialized as `useState([])` — TypeScript infers `never[]`. Fix: `useState<string[]>([])`

**`src/types/css.d.ts`** — module augmentation for CSS custom properties in inline styles:
```ts
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
```

### Known conversion challenges

**`noUncheckedIndexedAccess` + object lookups** — any `obj[key]` access becomes `T | undefined`. Add null-guards. Do not cast.

**`skills` sort comparator** — `(a, b) => a[1] < b[1]` returns boolean, not number. Pre-existing bug — fix during conversion.

**Rest-spread atoms** — `ColorPicker`, `Slider`, and any atom spreading `...props` onto a DOM element must type the rest as `React.ComponentPropsWithoutRef<'input'>`.

**`colorUtils.jsx` switch fallthrough** — `noFallthroughCasesInSwitch` will reject `switch (max)` in `rgbToHsl`. Refactor to explicit `case` blocks with returns.

### `src/three/` rewrite

Full rewrite — not a rename. The current files use direct DOM queries and a stub `cleanup()` function.

- Delete `three.module.js`, `OrbitControls.js`, `MarchingCubes.js`, `webgl_marchingcubes.js`
- Rewrite as `src/three/ThreeScene.tsx` — React component, `useRef` mount point, `useEffect` scene lifecycle with proper cleanup
- Typed npm imports: `three`, `three/examples/jsm/controls/OrbitControls.js`, `three/examples/jsm/objects/MarchingCubes.js`
- Upgrade `three` from `^0.134.0` to current; install `@types/three` if needed
- Add `/three` route to `App.tsx`
- `firebase.json` catch-all rewrite already handles `/three` — no changes needed there

### Phase 5 — Doc update

Update `CLAUDE.md`: remove all `.js`/`.jsx` file references, replace with `.ts`/`.tsx`. Update app structure section — add `/three` as a React route. Update component library paths. Update data section: `src/data.ts` not `src/data.js`.

---

## Phase 6 — Post-migration `.jsx` cleanup verification

After Phase 5, no `.jsx` files should remain anywhere in `src/`. Run:

```bash
find src -name "*.jsx" # must return nothing
find src -name "*.js"  # must return nothing (src/three/ vendored files are gone)
```

Also clean up `vite.config.ts`: remove the `include: /\.[jt]sx?$/` override from the react plugin — it was only needed to handle JSX in `.js` files during the intermediate state. Revert to `react()`.

### Phase 6 — Doc update

Update `.ai/specs/typescript-migration.md` Phase 2 stubbed-toe note: confirm resolved. Update CLAUDE.md to remove any remaining references to `.jsx`.

---

## Phase 7 — Verification gate

All must pass before the migration is done:

```bash
npm run typecheck   # zero errors
npm run lint        # zero warnings, no eslint-disable, no knip findings
npm run build       # clean output, deploys correctly to Firebase
npm test            # all passing under Vitest
find src -name "*.jsx" -o -name "*.js" # must return nothing
```

### Phase 7 — Doc update

Update `CLAUDE.md` fully to reflect the completed migration: TypeScript throughout, Vite, Vitest, strict ESLint. Update `.ai/WORK.md` with migration complete. Archive or close this spec.
