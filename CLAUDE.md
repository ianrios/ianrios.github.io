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

- **Stack:** Vite 8 (`vite.config.ts`, type-checked) · TypeScript only — `.tsx`/`.ts`, never `.js`/`.jsx` · Vitest 4 + `@testing-library/react` 14 (`npm test`, `npm run coverage`).
- **Node:** `.nvmrc` (20.19.x — `nvm use` first; the firebase package rejects odd Node majors). **Package manager:** npm.

## Verification

```bash
npm run check    # canonical: format → typecheck → lint (incl. drift checks)
npm run build    # Vite build → build/ (not dist/)
npm test         # Vitest (80+ tests)
npm run deploy   # gated: check + test + build + firebase deploy
```

Always run `npm run check`, not individual scripts (Prettier must precede ESLint, else agents hand-wrap lines Prettier owns). `eslint-disable` is banned. Build does not type-check — run `npm run typecheck` explicitly. No em/en dashes in production copy (`.ai/RULES.md`).

## App structure

Routes in `src/App.tsx` (lazy-loaded: three.js and Admin live in their own chunks; there is a 404 catch-all and a top-level error boundary); all portfolio content in `src/data.ts` (no API — edit there to add/update cards):

- `/` — **Home** (`src/pages/Home.tsx`) — MetaBalls splash → sidebar nav + masonry card grid
- `/design-system` — **Admin** (`src/pages/Admin.tsx`) — live playground + token editor. `/admin` permanently redirects here (old resume/GitHub links).
- `/three` — **ThreeScene** (`src/three/ThreeScene.tsx`) — MarchingCubes metaballs, live route
- `/imagebox` — **ImageBox** — planned, not yet built (see `.ai/specs/imagebox-epic.md`)

## Design system

Tokens in `src/styles/_tokens.scss`, exposed as CSS custom properties in `_base.scss`, consumed by tier partials under `src/styles/components/`. All new code uses tokens — no hardcoded colors/spacing/shadows (micro-chrome exemptions are documented at the top of the first components partial), no Bootstrap classes.

**Token registry is the single source of truth.** `src/styles/token-registry.ts` is the canonical manifest: `DEFAULTS`, the sidebar control lists, and `TokensSection` specimens all derive from it. Add/change a token there, never in a parallel array. One generic `TokenControl` engine (`src/pages/admin/TokenControls.tsx`) renders every control from the registry descriptor.

**Default theme is programmatic.** `DEFAULT_THEME` in `adminData.ts` (High Contrast) is what every new visitor sees; registry defaults and the SCSS first paint must equal it. Visitor state persists as localStorage `design:v1` `{version, theme, overrides, snapshot}` — theme + edited diffs only; clean visits persist nothing, so default changes reach returning visitors. The inline `index.html` flash script replays `snapshot` before any module loads — never remove it or move it to a `.ts` file. Future theme ideas: `.ai/specs/theme-ideas.md`.

**Integrity rule** — every editable token must have a control, a real CSS effect, AND a live preview example. `npm run check` runs **ten** hard-error drift checks (`scripts/drift-checks.ts` + `scripts/value-sync-check.ts`):

- `token-sync` — every `$token` is exposed as a `:root` var
- `control-sync` — `:root` vars and registry entries are the same set
- `defaults-sync` — `DEFAULTS` keys == `:root` var set
- `default-value-sync` — registry default VALUES == SCSS first-paint literals == `THEMES[DEFAULT_THEME]` (changing the default theme = edit the constant, the check lists every literal to follow)
- `preset-token` — every var a THEME writes is a real `:root` var
- `theme-control` — every token a THEME writes has an editable control
- `token-specimen` — every displayed-category token renders in `TokensSection`
- `demo-missing` — every component (incl. the components root) is reachable from the preview tree
- `token-unused` — every editable token has a real `var()` CSS consumer
- `token-example` — every editable token has a live preview example

**Design language: Classic Windows 3D bevel, parametric.** Hard-edged Win95/98 bevels (not soft neumorphism — that pass was rejected). Bevel tones derive from the backdrop (`--color-bg`/`--color-surface`) scaled by `--depth-contrast`; geometry tunes via `--depth-distance`/`--depth-blur`/`--depth-intensity` (blur 0 = hard). Flat at rest → raised on hover → sunken on press. Links are three-state (`--link-color`/`--link-hover`/`--link-active`); the Button `primary` color axis uses `--btn-primary-bg`. Presets are **complete themes** — one `THEMES` list; each sets every editable token except `--clickable-border-width`.

Components in `src/components/` — audit for an existing atom before adding one:

- `atoms/` — Badge, Button, ColorPicker, Icon (typed name union), Input, Slider, Switch, ValueInput
- `molecules/` — Accordion (`autoClose`/`defaultOpen`), Card, CardWithDropdown, FormField, NavBar, NavVertical, NavVerticalSections
- `organisms/` — ContactModal, ExpandableCard, MasonryCard, PageLayout, PortfolioSidebar, PushPanel

Shared hooks in `src/hooks/`: `DesignVarsProvider` (ONE app-level design-vars state — never instantiate a second), `useDisclosureGroup`, `useActiveNav`.

**Button** is one polymorphic `<Button as="button" | "link">`: orthogonal `variant` (solid/outline/surface/chisel/ghost), semantic `color` (default/muted/accent/primary), `size` (rides the `--font-*` scale), `icon` (icon-only when no text), `underline`. Every component needs an accurate demo in the grouped preview nav (Tokens, Atoms, Molecules, Organisms, Patterns) under `src/pages/admin/preview/` — enforced by `demo-missing`. See `.ai/WORKFLOW.md`.

## Known gotchas

- **Dev server:** port 3000 is often taken by a colima SSH mux — always `npm run dev -- --port 3001` (protocol in `.ai/RULES.md`).
- **Specs:** see `.ai/specs/` for active design specs. Do not implement what isn't in a spec unless explicitly asked.
- **Build output:** Vite defaults to `dist/`; this repo uses `build/` (`vite.config.ts`) to match Firebase hosting.
- **Analytics:** Firebase modular SDK, dynamically imported post-hydration from `src/analytics.ts` — never add render-blocking SDK scripts to `index.html`.
