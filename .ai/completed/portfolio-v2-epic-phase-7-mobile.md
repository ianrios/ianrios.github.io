# Phase 7 — Mobile pass

Status: ✅ DONE — implemented, all gates green. Ian's device/responsive
review is the real acceptance gate.

## Outcome

As reviewed: SiteNav owns both shells (desktop FloatingNav, mobile fixed
bottom-right hamburger at z 950 + right-side drawer at z 960/961 with
Escape/overlay/route-change close) sharing one NavContent; new generic
`useMediaQuery` hook (useSyncExternalStore - the lint forbids setState
in effects); Home lost its entire mobile branch (drawer, hamburger,
resize listener, sidebarProps, its ContactModal) and renders one unified
brand+tabs header; MobileNavDrawer deleted; drawer/hamburger styles
relocated `_admin.scss`/`_base.scss` -> `_organisms.scss`; cookie banner
narrows on mobile to keep the hamburger corner free. PortfolioSidebar
survives as a demoed library organism with no live consumer (Phase 8+
decides its fate).

## Peer review findings folded in

- CookieConsent DOES overlap a bottom-right hamburger (near-full-width
  banner, z 900) — resolved: hamburger z 950, drawer overlay/panel
  960/961 (cookie banner slides under chrome; modals at 1000 stay top),
  and the banner's mobile max-width leaves the bottom-right corner free
- Style locations corrected: `.skeu-hamburger` lives in `_base.scss`,
  `.skeu-mobile-drawer*` in `_admin.scss` at z 200/201 — both RELOCATE
  to `_organisms.scss` as site chrome with the new z-order (the old
  z 200 drawer would render under the cookie banner)
- Home cleanup is bigger than listed: `Icon`, `MobileNavDrawer`,
  `skills`, `ContactModal` imports, `modalShow`/`showTools`/`linksOpen`/
  `mobileNavOpen`/`windowWidth` state, the resize listener, and
  `MOBILE_BREAKPOINT` all go — with a unified header there is no
  remaining mobile branch in Home at all. `skills` keeps its ProjectsView
  consumer (no knip fallout)
- No breakpoint hook exists — new generic `src/hooks/useMediaQuery.ts`
  (matchMedia + change listener); SiteNav is its first consumer
- Escape handling copied from ContactModal's keydown pattern; drawer
  also closes on navigation (Button onClick still fires under the
  RouteTransitions interceptor, plus a useLocation effect as backstop)
- The stale `skeu-mobile-drawer__header` extra in component-checks.ts is
  removed with the old drawer; the new drawer header stays a Stack
- Mobile hamburger reuses the `site-nav` view-transition-name (safe:
  breakpoint-exclusive with FloatingNav)

## Problem statement

Original item 10: "IMPORTANT! it needs to look good on mobile!!!" —
deliberately last, against the now-stable layout/nav/transition system.
The audit found one structural hole plus polish items:

- **Mobile has no site navigation.** `FloatingNav` is `display: none`
  under 992px; the hamburger + `MobileNavDrawer` exist only inside Home.
  On mobile, `/about`, `/design-system`, `/metaballs` are reachable only
  by URL and offer no way back. Item 23 decided the mobile pattern: "a
  small menu hamburger... bottom right floating but not movable."
- Home mobile duplicates chrome: its own top-left hamburger + drawer
  (page tabs, skills, external, contact) — which would clash with any
  global hamburger.
- Home mobile shows an h2 page title but no h1/brand and no page tabs
  without opening the drawer.

## Decisions this plan makes

- **One global mobile nav, owned by SiteNav** (already App-root, already
  splash-aware): under 992px render a fixed bottom-right hamburger
  (item 23) opening a drawer with the same content as the desktop remote
  — destinations, external links, contact. Desktop keeps FloatingNav.
  One nav model, two form factors, one source of content.
- **Home's own hamburger + MobileNavDrawer are removed.** Home mobile
  gets the same header as desktop (brand + page-tab Buttons, wrapping) —
  page tabs are content-local and belong on the page, not in a drawer.
  Skills already live in ProjectsView; external/contact live in the
  global drawer. `MobileNavDrawer.tsx` is deleted (knip would flag it as
  unused; git history is the record). `PortfolioSidebar` loses its last
  live consumer but STAYS as a demoed organism in the library.
- The existing `skeu-mobile-drawer` styles are reused by the new global
  drawer (overlay + panel slide pattern already exists).
- `.home-content--mobile`'s 60px padding-top (clearance for the removed
  top-left hamburger) goes away; the bottom-right hamburger needs no
  header clearance.

## Files to change and why

- **`src/pages/SiteNav.tsx`** — render by breakpoint (the existing
  `MOBILE_BREAKPOINT = 992` resize-listener pattern from Home, or a
  `matchMedia` hook): desktop FloatingNav (unchanged) vs mobile fixed
  hamburger + drawer sharing the DESTINATIONS/external/contact content.
  Extract the shared inner content so the two shells cannot drift.
- **New: `src/pages/SiteNavDrawer.tsx`** (if SiteNav nears the 250-line
  budget) — overlay + panel using `skeu-mobile-drawer` classes, close on
  overlay/Escape/navigation.
- **`src/pages/Home.tsx`** — remove hamburger/MobileNavDrawer/
  `sidebarProps`/`showTools`/`linksOpen`/`modalShow` mobile-only state
  (ContactModal stays only if still consumed; the global nav owns
  contact now); unify the header branch (brand + tabs on all widths).
- **Delete `src/pages/MobileNavDrawer.tssx`** (git rm; history is the
  record).
- **`src/styles/_base.scss`** — drop `.home-content--mobile` padding
  rule; let the unified header wrap on narrow widths.
- **`src/styles/components/_organisms.scss`** (or wherever
  `skeu-mobile-drawer`/`skeu-hamburger` live) — hamburger moves to fixed
  bottom-right (item 23), sized as a proper touch target (min 44px),
  z-index alongside chrome (850 family), `view-transition-name` so it
  holds during pans.
- **`CLAUDE.md`** — Home route line (no more drawer), organisms note if
  needed.

## Risks / tradeoffs

- Removing Home's drawer deletes the mobile skills cloud entry point —
  acceptable: skills live on the projects tab (where the tags are)
- PortfolioSidebar becomes demo-only; deleting it outright is Phase 8
  material if Ian agrees (flagged, not done here)
- Bottom-right hamburger vs CookieConsent (bottom-left) — no overlap;
  vs FloatingNav — never coexist (breakpoint-gated)
- Cannot verify visuals here: the deliverable is a code-correct pass;
  Ian's device/responsive-mode review is the real gate

## Verification checklist

- `npm run check`, `npm run build`, `npm test`
- Responsive mode: hamburger bottom-right on every route under 992px;
  drawer opens/closes (overlay tap, Escape, after navigating); About and
  metaballs reachable and returnable; Home shows brand + tabs on mobile;
  no dead 60px gap; desktop unchanged; splash hides mobile nav too
