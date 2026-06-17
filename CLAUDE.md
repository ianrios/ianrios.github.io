# CLAUDE.md

## Session startup — do this first, every session

1. Read `.ai/CONTEXT.md`, `.ai/WORK.md`, `.ai/RULES.md` in that order
2. Read any specs in `.ai/specs/` that are relevant to the request
3. Scan the components in `src/components/` and `src/styles/` to understand current system state
4. Synthesize: current phase, active focus, open issues
5. Propose a plan → spawn a peer-review subagent with zero context to pressure-test it → fold in findings
6. Interview Ian if assumptions remain after steps 1-5; otherwise state your plan and begin
7. Update `.ai/WORK.md` at end of session with what changed and what's next

See `.ai/WORKFLOW.md` for the full operating model and planning convention.

## Operating model

Ian directs, reviews, and deploys. Agents own implementation, refactors, scaffolding, and documentation. Ian is the final decision-maker on architecture and visual direction. This is a live public site at ianrios.me linked from his GitHub and resume — all code is publicly inspectable. Production quality is non-negotiable.

## Toolchain

- **Bundler:** Vite 8 (replaced CRA). Config: `vite.config.ts`.
- **Language:** TypeScript — in progress (see `.ai/specs/typescript-migration.md`). All `.jsx` files are a temporary intermediate state; Phase 5 converts them to `.tsx`/`.ts`. Do not create new `.js` or `.jsx` files.
- **Tests:** Vitest 4 + `@testing-library/react` 14. Run with `npm test`.
- **Node:** `.nvmrc` pins 18.19.0 but Vitest 4 requires Node 20, 22, or ≥24. Use Node 20+ in practice.
- **Package manager:** npm.

## Dev server

Port 3000 is frequently occupied by a colima SSH mux. Always start with:

```bash
npm run dev -- --port 3001
```

## Verification

```bash
npm run typecheck              # TypeScript — zero errors required
npm run lint                   # ESLint + no-eslint-disable check + knip
npm run build                  # Vite build — outputs to build/ (not dist/)
npm test                       # Vitest
```

`eslint-disable` comments are banned — `scripts/check-no-eslint-disable.js` enforces this. Fix the underlying issue instead. Vite does not type-check during build — always run `typecheck` separately.

## App structure

React routes (`src/App.jsx` → will be `src/App.tsx` after Phase 5):
- `/` — **Home** (`src/pages/Home.jsx`) — MetaBalls splash → sidebar nav + masonry card grid
- `/admin` — **Admin** (`src/pages/Admin.jsx`) — live design-system playground, token editor
- `/three` — **ThreeScene** — planned React route (currently `src/three/` vendored files; rewrite in Phase 5)
- `/imagebox` — **ImageBox** — planned but not yet built (see `.ai/specs/imagebox-epic.md`)

## Data

All portfolio content is in `src/data.jsx` (will be `src/data.ts` after Phase 5) — no API. Edit there to add/update cards.

## Design system

Tokens live in `src/styles/_tokens.scss`. CSS custom properties exposed in `_base.scss`. Component styles in `_components.scss`. All new code must use design tokens — no hardcoded colors, spacing, or shadows. No new Bootstrap classes. Bootstrap removal is the long-term goal.

Component library at `src/components/`:
- `atoms/` — Badge, Button, ColorPicker, Icon, IconButton, IconLink, Input, Link, Slider, ValueInput
- `molecules/` — Accordion, Card, CardWithDropdown, FormField, NavBar, NavVertical, NavVerticalSections
- `organisms/` — ContactModal, DesignSystemDrawer, ExpandableCard, PageLayout, PortfolioSidebar, PushPanel

Use existing atoms before creating new ones. Audit before adding.

## Specs

See `.ai/specs/` for active design specs. Do not implement what isn't in a spec unless explicitly asked.

## Known gotchas

- **Vite 8 + JSX in `.js`:** Vite 8 (rolldown) does not transform JSX in `.js` files. All source files were renamed to `.jsx` as an intermediate state. Phase 5 converts to `.tsx`/`.ts`. Do not create `.js` files with JSX — use `.jsx` until Phase 5 converts them.
- **Build output:** Vite defaults to `dist/` but this repo uses `build/` (set in `vite.config.ts`) to match Firebase hosting config.
- **Typecheck is separate from build:** `npm run build` does not type-check. Run `npm run typecheck` explicitly.
- **Flash-prevention script in `index.html`:** The inline `<script>` in `<head>` reads `localStorage` and applies design tokens before first paint. It prevents FOUC in the Admin panel. Do not remove it — it cannot be moved to a `.ts` file as it must run before any module loads.
- **`src/three/` vendored files:** `three.module.js`, `OrbitControls.js`, `MarchingCubes.js`, `webgl_marchingcubes.js` are live vendored code used by `MetaBalls.jsx`. They will be replaced in Phase 5. Do not edit them.
