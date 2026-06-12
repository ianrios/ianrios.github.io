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

## Dev server

Port 3000 is frequently occupied by a colima SSH mux. Always start with `PORT=3001`.

## Verification

```bash
npm test -- --watchAll=false   # test suite (no Playwright — Ian does browser QA)
npm run build                  # catches JS errors + ESLint (react-app preset)
```

No separate TypeScript check — codebase is plain JS.

## App structure

React routes (`src/App.js`):
- `/` — **Home** (`src/pages/Home.js`) — MetaBalls splash → sidebar nav + masonry card grid
- `/admin` — **Admin** (`src/pages/Admin.js`) — live design-system playground, token editor
- `/imagebox` — **ImageBox** — planned but not yet built (see `.ai/specs/imagebox-epic.md`)

`/three` is a standalone static Three.js page (`src/three/`) served by Firebase hosting. Not a React route. Do not add it to the router.

## Data

All portfolio content is in `src/data.js` — no API. Edit there to add/update cards.

## Design system

Tokens live in `src/styles/_tokens.scss`. CSS custom properties exposed in `_base.scss`. Component styles in `_components.scss`. All new code must use design tokens — no hardcoded colors, spacing, or shadows. No new Bootstrap classes. Bootstrap removal is the long-term goal.

Component library at `src/components/`:
- `atoms/` — Badge, Button, Icon, IconButton, IconLink, Input
- `molecules/` — Accordion, Card, CardWithDropdown, FormField, NavBar, NavVertical, NavVerticalSections
- `organisms/` — CardGrid, ContactModal, DesignSystemDrawer, ExpandableCard, PageLayout, PortfolioSidebar, PushPanel

Use existing atoms before creating new ones. Audit before adding.

## Specs

See `.ai/specs/` for active design specs. Do not implement what isn't in a spec unless explicitly asked.
