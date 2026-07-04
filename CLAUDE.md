# CLAUDE.md

## Session startup — do this first, every session

1. Read `.ai/CONTEXT.md`, `.ai/WORK.md`, `.ai/RULES.md` in that order
2. Read any specs in `.ai/specs/` relevant to the request
3. Scan `src/components/` and `src/styles/` for current system state
4. Synthesize: current phase, active focus, open issues
5. For any non-trivial work: create a sub-plan in `.ai/plans/`, peer-review it with a zero-context subagent, fold in findings, present a skimmable summary to Ian, and wait for his **explicit approval** before writing code. See `.ai/WORKFLOW.md` for the full lifecycle.
6. Interview Ian only if genuine ambiguity remains after steps 1-5. One question max.
7. After Ian confirms done, complete ALL doc updates (sub-plan, epic, WORK.md priorities, CLAUDE.md) before ending the session.

## Operating model

Ian directs, reviews, and deploys. Agents own implementation, refactors, scaffolding, and documentation. Ian is the final decision-maker on architecture and visual direction. This is a live public site at ianrios.me linked from his GitHub and resume — all code is publicly inspectable. Production quality is non-negotiable.

## Toolchain

- **Stack:** Vite 8 (replaced CRA, `vite.config.ts`) · TypeScript only — `.tsx`/`.ts`, never `.js`/`.jsx` · Vitest 4 + `@testing-library/react` 14 (`npm test`).
- **Node:** `.nvmrc` (20+ in practice). **Package manager:** npm.

## Dev server

Port 3000 is often taken by a colima SSH mux — always start with `npm run dev -- --port 3001`.

## Verification

```bash
npm run check    # canonical: format → typecheck → lint
npm run build    # Vite build → build/ (not dist/)
npm test         # Vitest
```

Always run `npm run check`, not individual scripts (Prettier must precede ESLint, else agents hand-wrap lines Prettier owns). `eslint-disable` is banned. Build does not type-check — run `npm run typecheck` explicitly.

## App structure

Routes in `src/App.tsx`; all portfolio content in `src/data.ts` (no API — edit there to add/update cards):

- `/` — **Home** (`src/pages/Home.tsx`) — MetaBalls splash → sidebar nav + masonry card grid
- `/design-system` — **Admin** (`src/pages/Admin.tsx`) — live playground + token editor. `/admin` permanently redirects here (old resume/GitHub links).
- `/three` — **ThreeScene** (`src/three/ThreeScene.tsx`) — MarchingCubes metaballs, live route
- `/imagebox` — **ImageBox** — planned, not yet built (see `.ai/specs/imagebox-epic.md`)

## Design system

Tokens in `src/styles/_tokens.scss`, exposed as CSS custom properties in `_base.scss`, consumed in `_components.scss`. All new code uses tokens — no hardcoded colors/spacing/shadows, no new Bootstrap classes (removal is the long-term goal).

**Token registry is the single source of truth.** `src/styles/token-registry.ts` is the canonical manifest: `DEFAULTS`, admin control lists, and `TokensSection` specimens all derive from it. Add/change a token there, never in a parallel array.

**Integrity rule** — every editable token must have a control (`theme-control`/`control-sync`), a real CSS effect (`token-unused`), AND a live preview example (`token-example`). `npm run check` runs **nine** hard-error drift checks (`scripts/drift-checks.ts`):

- `token-sync` — every `$token` is exposed as a `:root` var
- `control-sync` — `:root` vars and registry entries are the same set
- `defaults-sync` — `DEFAULTS` keys == `:root` var set
- `preset-token` — every var a THEME writes is a real `:root` var
- `theme-control` — every token a THEME writes has an editable control
- `token-specimen` — every displayed-category token renders in `TokensSection`
- `demo-missing` — every component is reachable from the preview tree
- `token-unused` — every editable token has a real `var()` CSS consumer
- `token-example` — every editable token has a live preview example (specimen, component demo, or literal ref)

**Design language: Classic Windows 3D bevel, parametric.** Hard-edged Win95/98 bevels (not soft neumorphism — that pass was rejected). Bevel tones derive from the backdrop (`--color-bg`/`--color-surface`) so they blend; geometry tunes via `--depth-distance`/`--depth-blur`/`--depth-intensity`/`--depth-contrast` (blur 0 = hard). Flat at rest → raised on hover → sunken on press. Supersedes the old skeuomorphism specs. Presets are **complete themes** — one `THEMES` list, one "Themes" selector; each sets every editable category including depth geometry.

Components in `src/components/` — audit for an existing atom before adding one:

- `atoms/` — Badge, Button, ColorPicker, Icon, Input, Slider, Switch, ValueInput
- `molecules/` — Accordion, Card, CardWithDropdown, FormField, NavBar, NavVertical, NavVerticalSections
- `organisms/` — ContactModal, ExpandableCard, PageLayout, PortfolioSidebar, PushPanel

**Button** is one polymorphic `<Button as="button" | "link">` (replaces the former Link/IconButton/IconLink): orthogonal `variant` (solid/outline/surface/chisel/ghost), semantic `color` (default/muted/accent/primary), `size`, `icon` (icon-only when no text), `underline`. Every component needs an accurate demo in the grouped preview nav (Tokens, Atoms, Molecules, Organisms, Patterns) under `src/pages/admin/preview/` — enforced by `demo-missing`. See `.ai/WORKFLOW.md`.

## Known gotchas

- **Specs:** see `.ai/specs/` for active design specs. Do not implement what isn't in a spec unless explicitly asked.
- **Build output:** Vite defaults to `dist/`; this repo uses `build/` (`vite.config.ts`) to match Firebase hosting.
- **Flash-prevention script in `index.html`:** the inline `<head>` `<script>` reads `localStorage` and applies design tokens before first paint, preventing Admin FOUC. Don't remove it — it must run before any module loads, so it can't move to a `.ts` file.
