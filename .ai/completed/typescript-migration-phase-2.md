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
