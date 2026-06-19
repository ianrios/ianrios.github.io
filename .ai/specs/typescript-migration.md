# TypeScript Migration Spec

## Goal

Migrate the full repo from CRA + plain JS to Vite + TypeScript with petal-grade strictness. Motivation: agents write better code under strict types; this is the constraint that enforces production quality going forward.

## Scope

All files in `src/`. No exclusions. `src/three/` rewritten as a proper React route. Dead files deleted after knip confirms them.

---

## Phase 1 — Dead code audit (knip) ✅ DONE

## Phase 2 — CRA → Vite + React 18 + test infrastructure ✅ DONE

## Phase 3 — TypeScript config ✅ DONE — see `.ai/plans/typescript-migration-phase-3-tsconfig.md`

---

## Phase 4 — ESLint + Prettier + enforcement scripts ✅ DONE — see `.ai/plans/typescript-migration-phase-4-eslint-prettier.md`

---

## Phase 5 — File conversion (bottom-up) ✅ DONE

All `.jsx` files from Phase 2 converted to `.tsx` or `.ts`. No `.jsx` files remain outside `src/three/` (vendored, deferred to Group 14). All TypeScript errors resolved, `npm run check` passes clean.

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
