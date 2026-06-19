# CLAUDE.md

## Session startup — do this first, every session

1. Read `.ai/CONTEXT.md`, `.ai/WORK.md`, `.ai/RULES.md` in that order
2. Read any specs in `.ai/specs/` that are relevant to the request
3. Scan the components in `src/components/` and `src/styles/` to understand current system state
4. Synthesize: current phase, active focus, open issues
5. For any non-trivial work: create a sub-plan in `.ai/plans/`, peer-review it with a zero-context subagent, fold in findings, present a skimmable summary to Ian, and wait for his **explicit approval** before writing a single line of code. See `.ai/WORKFLOW.md` for the full epic/sub-plan/peer-review/approval lifecycle.
6. Interview Ian only if genuine ambiguity remains after steps 1-5. One question max.
7. After Ian confirms the work is done, complete ALL doc updates (sub-plan, epic, WORK.md priorities list, CLAUDE.md) before ending the session.

## Operating model

Ian directs, reviews, and deploys. Agents own implementation, refactors, scaffolding, and documentation. Ian is the final decision-maker on architecture and visual direction. This is a live public site at ianrios.me linked from his GitHub and resume — all code is publicly inspectable. Production quality is non-negotiable.

## Toolchain

- **Bundler:** Vite 8 (replaced CRA). Config: `vite.config.ts`.
- **Language:** TypeScript. All source files are `.tsx`/`.ts`. Do not create `.js` or `.jsx` files. (`src/three/` still has vendored `.js` — deferred rewrite, see WORK.md Group 14.)
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
npm run check                  # canonical: format → typecheck → lint
npm run build                  # Vite build — outputs to build/ (not dist/)
npm test                       # Vitest
```

Always run `npm run check`, not individual scripts — Prettier must run before
ESLint or agents manually wrap lines Prettier would handle. `eslint-disable`
comments are banned. Vite does not type-check during build.

## App structure

React routes (`src/App.tsx`):

- `/` — **Home** (`src/pages/Home.tsx`) — MetaBalls splash → sidebar nav + masonry card grid
- `/admin` — **Admin** (`src/pages/Admin.tsx`) — live design-system playground, token editor
- `/three` — **ThreeScene** — planned React route (vendored files in `src/three/` pending rewrite, Group 14)
- `/imagebox` — **ImageBox** — planned but not yet built (see `.ai/specs/imagebox-epic.md`)

## Data

All portfolio content is in `src/data.ts` — no API. Edit there to add/update cards.

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

- **Build output:** Vite defaults to `dist/` but this repo uses `build/` (set in `vite.config.ts`) to match Firebase hosting config.
- **Typecheck is separate from build:** `npm run build` does not type-check. Run `npm run typecheck` explicitly.
- **Flash-prevention script in `index.html`:** The inline `<script>` in `<head>` reads `localStorage` and applies design tokens before first paint. It prevents FOUC in the Admin panel. Do not remove it — it cannot be moved to a `.ts` file as it must run before any module loads.
