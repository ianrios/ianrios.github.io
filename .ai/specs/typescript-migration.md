# TypeScript Migration Spec

## Goal

Migrate the full repo from CRA + plain JS to Vite + TypeScript with petal-grade strictness. Motivation: agents write better code under strict types; this is the constraint that enforces production quality going forward.

## Scope

All files in `src/`. No exclusions. `src/three/` rewritten as a proper React route. Dead files deleted after knip confirms them.

---

## Phase 1 — Dead code audit (knip, run first)

Run knip against the existing JS codebase before converting anything. Delete confirmed dead files and deps before migrating them. Phase 1 knip config must use `src/index.js` as the entry point — `src/main.tsx` does not exist yet.

Expected removals:
- `src/reportWebVitals.js`
- `src/setupTests.js`
- Most or all `@react-three/*` deps — listed in `package.json` but the React app does not currently import them. Knip will confirm. Note: after the Phase 5 `src/three/` rewrite some (e.g. `@react-three/fiber`, `three`) may be reinstated — coordinate with Phase 5.
- `axios` — in `package.json`, not used in any source file

Do not delete anything knip does not flag. `src/old-three/` is listed in CLAUDE.md but does not exist on disk — ignore it.

---

## Phase 2 — CRA → Vite + React 18 + test infrastructure

Do all of the following together. React 18 and the test library upgrade must happen in the same phase — RTL 11 is React 17-only and will break as soon as `createRoot` is introduced.

**Toolchain:**
- Remove: `react-scripts`, `cross-env`, `web-vitals`
- Install: `vite`, `@vitejs/plugin-react`
- Upgrade React 17 → 18; update `src/index.js` entry to `createRoot`
- Drop `--openssl-legacy-provider` from all scripts (CRA 4 workaround, no longer needed)
- Delete `.env` — it contains only `NODE_OPTIONS=--openssl-legacy-provider`, which is the same workaround

**`vite.config.ts`:**
- Must set `build.outDir: 'build'` — Firebase hosting is configured with `"public": "build"` in `firebase.json`. Vite defaults to `dist`. Without this the deploy will push an empty directory to production.
- Single-page app: configure `server.historyApiFallback` (or equivalent) for client-side routing

**`index.html`:**
- Move `public/index.html` to project root
- Strip all `%PUBLIC_URL%` references
- Add `<script type="module" src="/src/main.tsx">`
- Remove the orphaned `<div id="three-container">` — this element exists only for the legacy standalone Three.js page, which becomes a React route in Phase 5
- The file has inline `<script>` tags loading Firebase 7.6.2 SDK from CDN with a hardcoded `apiKey` and `measurementId`. Evaluate whether these are still needed; if so, keep them but note the exposed key is intentional for a public client-side app

**Test infrastructure:**
- Upgrade `@testing-library/react` 11 → 14+
- Upgrade `@testing-library/jest-dom` 5 → 6+
- Upgrade `@testing-library/user-event` 12 → 14+
- Vite uses Vitest as the test runner by default (matches petal). Install `vitest`, `@vitest/coverage-v8`, configure in `vite.config.ts`. Replace CRA's `react-scripts test` with `vitest`
- Add `src/vitest.setup.ts` (imports `@testing-library/jest-dom`)
- Update `tsconfig.json` `types` to include `vitest/globals`

**Scripts after Phase 2:**
```
dev       → vite
build     → vite build
preview   → vite preview
typecheck → tsc --noEmit
lint      → eslint . && node scripts/check-no-eslint-disable.js && knip --no-config-hints
format    → prettier . --write
test      → vitest run
```

---

## Phase 3 — TypeScript config

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "types": ["vitest/globals"]
  },
  "include": ["src"]
}
```

Add `src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

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

`knip.json` (post-migration entry):
```json
{
  "entry": ["src/main.tsx"],
  "project": ["src/**/*.{ts,tsx}"]
}
```

---

## Phase 5 — File conversion (bottom-up)

Convert in this order so dependencies are always typed before their consumers:

1. `src/types/` — new directory with all shared interfaces (details below)
2. `src/components/atoms/` — all 10 atoms
3. `src/components/molecules/` — all 7 molecules
4. `src/hooks/useDesignVars.ts`
5. `src/components/organisms/` — all 8 organisms
6. `src/MetaBalls.tsx`, `src/components/masonry-card.tsx`
7. `src/data.ts` — typed against `src/types/`
8. `src/pages/admin/` — `adminData`, `colorUtils`, `DSPreview`, `TokenSidebar`, `V2Preview`, `AdminUI`, `Admin`
9. `src/pages/Home.tsx`, `src/App.tsx`
10. `src/main.tsx` (was `index.js`)
11. `src/three/` — rewrite (details below)

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

Do not guess the shapes — read each source file before writing its type. The following are confirmed to need explicit types:

**`src/types/data.ts`** — data model for `src/data.js`:
- `CardData`, `ProjectData`, `WorkExperience` (read `data.js` for exact shapes)
- `SkillTuple = [string, number]` — skills are two-element tuples, not flat objects

**`src/types/admin.ts`** — types for `adminData.js`, which has 13 named exports, each with a distinct shape:
- `DEFAULTS` — `CSSTokenMap` (typed `Record` of CSS custom property names to string values)
- `COLOR_PRESETS`, `SHAPE_PRESETS`, `ELEVATION_PRESETS` — preset arrays; each preset carries a `vars` sub-object with a different subset of CSS token keys. These must be individually typed, not collapsed into `Record<string, string>`
- `BUTTON_VARIANTS`, `BUTTON_SIZES`, `BADGE_SAMPLES`, `CARD_GRID_DATA`, `ACCORDION_ITEMS`, `VERTICAL_NAV_SECTIONS`, `CARD_COLOR_VARIANTS`, `TIMELINE_EVENTS`, `V2_PROJECTS` — read each export in `adminData.js` and type precisely

**`src/types/design-vars.ts`** — return type of `useDesignVars`:
- Define `DesignVarsReturn` interface explicitly; do not rely on inference
- `warmKeys` is initialized as `useState([])` with no annotation — TypeScript will infer `never[]`. Annotate as `useState<string[]>([])` at the call site, then it can be expressed correctly in `DesignVarsReturn`

**`src/types/css.d.ts`** — module augmentation for CSS custom properties in inline styles:
```ts
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
```

### Known conversion challenges

**`noUncheckedIndexedAccess` + object lookups** — any `obj[key]` access becomes `T | undefined`. Add null-guards at every call site. Do not cast.

**`skills` sort comparator** — `(a, b) => a[1] < b[1]` returns boolean, not number. This is a pre-existing bug. Fix it during conversion.

**Rest-spread atoms** — `ColorPicker`, `Slider`, and any atom that spreads `...props` onto a native DOM element must type the rest parameter as `React.ComponentPropsWithoutRef<'input'>` (or the correct element type).

**`colorUtils.js` switch fallthrough** — `noFallthroughCasesInSwitch` will reject the `switch (max)` in `rgbToHsl`. Refactor to explicit `case` blocks with returns.

### `src/three/` rewrite

The current `src/three/` contains vendored library files and a vanilla JS scene script (`webgl_marchingcubes.js`) that:
- Runs a `requestAnimationFrame` loop
- Appends `renderer.domElement` directly to `document.querySelector('#three-container')`
- Has a stub `cleanup()` function with no implementation

This is a full rewrite, not a rename. Scope accordingly.

Steps:
- Delete `three.module.js`, `OrbitControls.js`, `MarchingCubes.js`, `webgl_marchingcubes.js`
- Rewrite as `src/three/ThreeScene.tsx` — a React component using `useRef` for the mount point and `useEffect` for the scene lifecycle (setup, animation loop, and proper cleanup via the effect return function)
- Use typed npm imports:
  - `import * as THREE from 'three'`
  - `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'`
  - `import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js'`
- Upgrade `three` from `^0.134.0` to a current version; install `@types/three` if needed
- Add `/three` route to `App.tsx`
- The `#three-container` div in `index.html` is removed in Phase 2; the React component owns its own mount point via `useRef`
- `firebase.json` has no existing static route for `/three` — nothing to remove there

---

## Phase 6 — Verification gate

All must pass before the migration is done:

```bash
npm run typecheck   # zero errors
npm run lint        # zero warnings, no eslint-disable, no knip findings
npm run build       # clean output, deploys correctly to Firebase
npm test            # all passing under Vitest
```

---

## Open questions

- None. Ian has signed off on scope, toolchain, strictness level, and dead code strategy.
