# Phase 4 — Floating draggable nav

Status: ✅ DONE — implemented, all checks green (92 tests). Ian steers
visually from the dev server.

## Outcome

Implemented as planned, with one interruption: Bob's Phase 2.5 commit
deleted the in-flight FloatingNav/SiteNav files; they were restored from
git history and re-wired after 2.5/2.6 landed. Deltas from the plan:

- Helper module renamed `floatingNav.ts` -> `floating-nav-position.ts`:
  on the case-insensitive macOS filesystem, the `./FloatingNav` component
  import resolved to the helper first (TS resolves `.ts` before `.tsx`)
- Ian's in-code TODOs actioned alongside: `/admin` alias removed
  entirely, `/three` renamed `/metaballs` (SiteNav + data.ts updated)
- Home tabs and About back-button removal landed pre-interruption and
  survived; Bob's 2.5 migrated the header/tab markup to Stack primitives
- FloatingNav takes no `style` prop (2.6 purity policy); its dynamic
  left/top position is internal state, same pattern as Stack's
  height/overflow/flex

## Peer review findings folded in

- `useActiveNav` is a local tab-state helper, not route-aware — SiteNav
  reads `useLocation().pathname` and marks the active destination with
  `aria-current="page"`; new token-driven `[aria-current='page']` style
  (sunken/pressed per the design language) added to the button partial
- PushPanel + its tab sit on the LEFT edge (with CookieConsent bottom
  left) — bottom-right default stands, reasoning corrected
- Skills contradiction resolved: aggregation moves to `ProjectsView`
  (exported); Home imports it for the mobile drawer's `sidebarProps`.
  Mobile drawer keeps its skills cloud until Phase 7 touches mobile
- `NavChromeProvider` must enclose BOTH `<Routes>` and `<SiteNav>` or the
  setter (Home) and reader (SiteNav) get different contexts
- Splash flash: provider state lazily initializes hidden when
  `location.pathname === '/'` — the nav can never paint over the splash;
  Home's effect reveals it once `view === 'main'`. The nav's own home
  link navigates with `state: {view: 'main'}` so it skips the splash
- Heading hierarchy: h1 "Ian Rios" moves into the content header with the
  tab Button row; the h2 page title is dropped on desktop (tabs carry the
  state), mobile keeps its h2 title until Phase 7
- Drag helpers (parse/clamp/persist) live in a separate
  `floatingNav.ts` module — keeps the component under the 250-line cap
  and gives tests a pure surface (jsdom has no pointer-capture APIs)

## Problem statement

Concepts doc section 1: a floating grip-handle panel, draggable with ONE
global position persisted across routes, is the sole top-level
page-to-page navigation UI ("remote control" of destinations). It replaces
the desktop `PortfolioSidebar` wiring in `Home.tsx`; mobile keeps the
existing hamburger + `MobileNavDrawer`. Today no cross-route nav exists at
all except scattered back-links.

## Decisions this plan makes (Ian steers on the dev server)

- **Mount at App root**, not per-page: Phase 5's papers-on-a-table
  transition will transform the page container, and `position: fixed`
  breaks inside transformed ancestors — the nav must live outside the
  transition wrapper to stay put while pages pan under it.
- **Splash visibility**: the nav must not float over the MetaBalls splash.
  Home's `view` state is component-local, so a tiny `NavChromeProvider`
  context (`src/hooks/navChrome.tsx`) exposes `setHidden`; Home hides the
  nav while `view === 'welcome'`.
- **Sidebar dissolution**: desktop sidebar dies. Its contents relocate:
  - page tabs (experience/projects/hobbies) → horizontal Button row in
    Home's content header next to the "Ian Rios" h1 (they are
    content-local tabs, not site navigation)
  - skills badge cloud → a disclosure at the top of `ProjectsView` (it
    derives from `independentProjectsData` only, since Phase 1)
  - external links → collapsed "external" disclosure inside the floating
    nav; contact → button in the floating nav
  - `PortfolioSidebar` organism STAYS — `MobileNavDrawer` still renders it
    on mobile (concepts: keep hamburger + drawer)
- **Contact modal**: the floating nav's contact button opens a
  `ContactModal` owned by the nav wrapper at App root. Home keeps its own
  instance for the mobile drawer (renders null when closed; no conflict).
- **About's "Back to portfolio" button is removed** (epic mandate).
  ThreeScene/Admin back-links stay as contextual escape hatches until
  Phase 8 decides their fate.
- **A11y for drag**: grip is a real focusable button; arrow keys nudge the
  panel (persisted), pointer drag via pointer events. Panel is
  `<nav aria-label="Site">`.

## Files to change and why

- **New: `src/components/organisms/FloatingNav.tsx`** — presentational
  draggable panel: grip handle, `children`, pointer-event drag, arrow-key
  nudge, viewport clamping on load/resize/drag, position persisted as
  localStorage `nav:v1` `{x, y}`. Exported pure helper for parse/clamp so
  it is unit-testable. `inline` prop renders it unpositioned for the admin
  demo. Hidden below 992px via CSS (mobile keeps the drawer).
- **New: `src/pages/SiteNav.tsx`** — wires FloatingNav content: Button
  links for Home / About / Design System / Metaballs (active route marked
  via `useActiveNav`), "external" disclosure with `externalLinks`, contact
  button + its ContactModal. Lives in pages/ (route-aware chrome), so no
  demo burden; FloatingNav itself gets the demo.
- **New: `src/hooks/navChrome.tsx`** — provider + `useNavChrome()`
  (hidden/setHidden), following the existing hooks patterns.
- **`src/App.tsx`** — wrap routes in `NavChromeProvider`, mount `SiteNav`
  beside `CookieConsent`.
- **`src/pages/Home.tsx`** — remove desktop sidebar branch (h1 moves to
  the content header + tab Button row), hide nav during splash via
  `useNavChrome`, drop the `skills` aggregation (moves to ProjectsView),
  keep hamburger/MobileNavDrawer/ContactModal for mobile.
- **`src/pages/home/ProjectsView.tsx`** — skills badge-cloud disclosure at
  top (aggregation logic moves here from Home).
- **`src/pages/About.tsx`** — delete the interim back Button.
- **`src/styles/components/_organisms.scss`** — `skeu-floating-nav` block:
  fixed, z-index 850 (below cookie consent's 900), bevel surface, grip
  affordance, `display: none` under 992px; all token-driven.
- **`src/styles/_base.scss`** — home header row adjusts (title + tabs).
- **`src/pages/admin/preview/OrganismsSection.tsx`** — FloatingNav demo
  (`inline`), noting drag/persistence behavior.
- **New test: `src/components/organisms/FloatingNav.test.tsx`** — position
  parse/clamp helper cases + renders children/grip.

## Risks / tradeoffs

- Two ContactModal instances in the tree (App-root + Home's mobile one) —
  accepted over a modal context; only one can open at a time
- Dropping the sidebar removes the skills cloud from the experience tab;
  that is by design (experience cards have no tags, projects keep them)
- Drag + fixed positioning over the ThreeScene canvas is fine (canvas does
  not capture pointer events aggressively), but verify by hand
- Default position must not overlap the cookie consent banner
  (bottom-left) or the design PushPanel tab (right edge) — default to
  bottom-right with a safe inset

## Verification checklist

- `npm run check`, `npm run build`, `npm test`
- Dev server: nav floats on Home main view / About / Design System /
  Three; hidden on splash and under 992px; drag position survives route
  changes and reload; tabs switch pages from the header; skills disclosure
  works on projects; About has no back button; contact opens from the nav
