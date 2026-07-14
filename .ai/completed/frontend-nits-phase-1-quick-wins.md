# Phase 1 — Home/nav/data quick wins

Status: ✅ DONE (2026-07-09) — all checks green. Deviation from plan: the
"swap corners" resolution shipped as written, then Ian asked for the
floating nav to sit ~50% closer to the left edge on top of that
(`left: calc(var(--space-md) / 2)`).

Part of `.ai/plans/frontend-nits-epic.md`. Covers frontend-nits.md items
#1, #11, #12, #13, #16.

## Problem statement

Five small, independent corrections to the Home page header, the experience
accordion's default-open state, the projects grid, the floating nav's
default screen position, and the volunteering data set. None require new
architecture; all are edits to existing components/data.

## Files to change and why

- `src/pages/Home.tsx` — item #1: the `home-content__header` `Stack` (row,
  justify between) has no horizontal padding of its own, so the projects/
  experience button group sits flush against the viewport edge. Add
  spacing via the `Stack` `padding` prop or a small dedicated class using
  `var(--space-md)`. Note: `src/styles/_base.scss:345-353` already defines
  an unreferenced `.home-content__header--bar` rule (`justify-content:
space-between` + horizontal `var(--space-md)` padding, comment "brand
  left, page tabs right") that appears to be dead CSS from a prior layout
  pass and does almost exactly what this item wants — check whether to
  wire that class up instead of adding a third padding mechanism, or
  delete it if it's truly superseded.
- `src/pages/home/ExperienceView.tsx` — item #11: `defaultOpen={['Senior
Engineer']}` (line 77) does not match any `PHASE_ORDER` id (the real id
  is `'Senior Software Engineer'`), so today NOTHING opens by default —
  this is a pre-existing bug, not just a preference change. Fix by passing
  the full `PHASE_ORDER` array (or the actual ids present in `items`) so
  every phase group renders open on arrival.
- `src/pages/home/ProjectsView.tsx` — item #12: `breakpointCols` goes from
  `{ default: 3, 992: 3, 991: 1 }` / condensed `{ default: 2, 992: 2, 991:
1 }` to `{ default: 4, ... }` / condensed `{ default: 3, ... }`.
- `src/data.ts` — item #12: remove the `Live Design System` and `Marching
Cubes` entries from `independentProjectsData` (both link to routes
  already reachable from `SiteNav`, so no content is lost, just the
  redundant project-grid cards).
- `src/data.ts` + `src/types/data.ts` — item #16: `HobbyData` gains an
  optional `role?: string` for a job-title-like label distinct from the
  existing `title` (which is the org/program name, e.g. `'KY FIRST
Robotics'`). Set `role: 'Internship Project Manager'` on the KY FIRST
  Robotics entry and `role: 'Lead Organizer (2019 to 2023)'` on Open
  Source Breakfast Club (spelled out "to", not a dash, per the no-en/em-dash
  copy rule in `.ai/RULES.md`). Move the `Bootcamp Instructor` job (lines
  ~171-183, currently under `workProjectsData` / `Early Career` phase) into
  `hobbyData` as a new `kind: 'volunteering'` entry: `title: 'Awesome Inc'`,
  `role: 'Bootcamp Instructor'`, `url: 'https://awesomeinc.org/'`, `year:
2019`, with its 3 existing bullets condensed into one `body` paragraph
  (HobbyData has no `bullets` field).
- `src/pages/About.tsx` — item #16 (render side): `HobbyRow` needs to show
  `hobby.role` when present, in the same slot pattern `JobEntry` already
  uses for `job.title` above the company/period line. Minimal addition
  only — the full visual treatment of this row is Phase 4's job.
- `src/styles/components/_organisms.scss` — item #13, **decided (Ian
  2026-07-09): swap the two corners.** `.skeu-floating-nav`'s default
  position (lines ~90-92) goes from `right: var(--space-md)` to `left:
var(--space-md)`. `CookieConsent`'s position (lines ~302-306) goes from
  `left: var(--space-md)` to `right: var(--space-md)`. Check the mobile
  media query just below the `CookieConsent` rule too (existing comment:
  "Leave the bottom-right corner free for the mobile hamburger") — that
  carve-out was written for the old corner assignment and needs re-checking
  against the new one so the mobile hamburger still has clear space.

## Approach and architectural reasoning

All five items are scoped edits to files/rows that already exist; no new
components, tokens, or drift-check surface. The `role` field addition is
the only schema change, and it is additive/optional so existing entries
without it (`We're Eating Good Tonight`, `WRC Label Manager`, `Music
Production`) are unaffected.

Bootcamp Instructor's bullets need to become prose for `body` — draft a
paragraph from the existing 3 bullets during implementation and flag it in
the PR/handoff for Ian's copy read, since compressing bullets to prose is a
content judgment call, not a mechanical transform.

## Risks / tradeoffs

- Item #13's corner swap (nav → bottom-left, cookie consent → bottom-right)
  needs the mobile hamburger carve-out re-verified at the new corner
  (currently written for the old assignment) so the swap doesn't introduce
  a new mobile collision.
- Removing two project cards changes `independentProjectsData`'s length,
  which shifts the Masonry column layout — verify visually with `npm run
dev` that the remaining cards still balance across 4/3 columns.
  (verified: this is `npm run dev -- --port 3001` per `.ai/RULES.md`.)
- The `HobbyData.role` addition touches a type consumed elsewhere (none
  currently besides `About.tsx`) — grep for other `HobbyData` consumers
  before assuming this is additive-only.
- Item #1's fix (padding on the header Stack) may shift the brand heading
  left edge too if `padding` is applied uniformly rather than right-only —
  confirm visually against the `home-content__brand` alignment.

## Verification checklist

- `npm run check` (format, typecheck, lint, all 13 drift checks)
- `npm test`
- `npm run build`
- Manual: `npm run dev -- --port 3001`, confirm accordion opens all phases
  on arrival, projects grid renders 4 cols (3 when design panel open),
  floating nav starts bottom-left on a clean localStorage, About page shows
  role labels under KY FIRST Robotics / Open Source Breakfast Club /
  Awesome Inc.
