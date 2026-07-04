# Phase 5 — Admin IA Rename + Portfolio Integration

Status: ✅ COMPLETE (2026-06-30). Part of `design-system-coherence-epic.md`.
Depends on Phase 1. Route/copy/sticky-header parts can start early in parallel.

## Problem statement (issues 10, 11)

The design playground is cohesively part of the portfolio but presents as a bolt-
on `/admin`. Ian wants: rename the route to `/design-system`; the masonry card
body (`data.ts:13`) is verbose AI-slop and should be cut by half-plus; the
"← Portfolio" back button (`Admin.tsx:70-74`) floats and should live in a
sticky header that the content scrolls behind, clearly bounding the PushPanel's
side of the app.

## Files to change and why

- `src/App.tsx:10` — route `path="/admin"` → `path="/design-system"`. Add a
  redirect from `/admin` (firebase.json SPA rewrite confirms client routing
  works). **Owner decision:** is `/admin` a permanent alias (resume/GitHub links
  may exist) or temporary? Keep it permanent unless Ian says otherwise.
- `src/data.ts:13` — rewrite the "Live Design System" body succinct (≤ ~2 short
  sentences, no buzzword pile-up). `data.ts:14` `live: '/admin'` →
  `/design-system`. `data.ts:15` github `href` (`…/tree/main/src/pages/admin`)
  is VALID — verified the live remote default branch is `main` (not `master`;
  the `origin/HEAD -> origin/master` symref is stale) and the folder exists. Only
  update this href if the `src/pages/admin` folder is later renamed.
- `src/pages/Admin.tsx` — heading `:88` "/admin — Design tokens" →
  "Design System"; description copy `:89-92` tightened. Rename component/file
  `Admin.tsx` → a name matching the route is optional (keep churn low; decide in
  review).
- `src/pages/Admin.tsx` + `_components.scss` — move the `← Portfolio` Link
  (`:70-74`) into a **sticky top header** (`position: sticky; top: 0`) styled as
  a neu raised navbar bar, full-width across the content side, so content scrolls
  behind it. Ensure it sits on the content side (right of the PushPanel), making
  clear the PushPanel is its own region. Use the `NavBar` molecule if it fits;
  otherwise a `.skeu-design-system-topbar` class. Replaces `.skeu-admin-topbar`.
- Update any admin demo / preview labels that say "admin" to "design system"
  for consistency.

## Approach / reasoning

Low-risk, mostly mechanical, but high cohesion payoff. The sticky header reframes
the page as "the design system app" rather than a panel under the portfolio.
Keeping a redirect honors the live public URL contract.

## Risks / tradeoffs

- Renaming the `src/pages/admin/` folder touches many imports and the github deep
  link; recommend NOT renaming the folder this phase (route + copy only) to keep
  the diff reviewable. Revisit folder rename as a separate cleanup if desired.
- Sticky header must not overlap the PushPanel tab or clip the rotated tab;
  verify open/close states.

## Verification checklist

- [ ] `/design-system` loads; `/admin` redirects (no 404)
- [ ] Masonry card body cut ≥ half, reads cleanly; card link points to new route
- [ ] Back button is a sticky header; content scrolls behind it; PushPanel region
      is visually distinct on open/close
- [ ] No remaining user-facing "admin" labels on the page
- [ ] `npm run check`/`build`/`test` green; Ian visual sign-off
