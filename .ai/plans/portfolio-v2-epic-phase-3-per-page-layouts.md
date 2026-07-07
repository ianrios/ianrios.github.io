# Phase 3 — V2 per-page layouts (experience / projects / hobbies / About)

Status: ✅ DONE — implemented, all checks green (84 tests). Ian steers
visually from the dev server per the autonomous-phase model.

## Outcome

Landed as planned plus one delta: `HobbyData` gained an optional
`kind?: 'volunteering'` field so the sub-group split is data-driven, not a
hardcoded title list. The `#masonrygrid` scroll anchor became
`#home-scroll` on the persistent scroll container (`scrollTo({top: 0})` on
tab switch). ExpandableCard's only demo is now the real `ExperienceView`
inside V2Preview - more accurate than the removed "Sample Co" fakes.

## Peer review findings folded in

- `skeu-expandable-card` styles live in `_molecules.scss:189-262` (tier
  mismatch with the organism component), not `_organisms.scss`
- `changePage` scrolls to `#masonrygrid` (`Home.tsx:74`) which moves into
  ProjectsView and stops existing on two tabs — re-home the id onto the
  persistent `home-content__scroll` container
- Remove Home.tsx's then-unused `Masonry`/`MasonryCard` imports
- V2Preview's "Sample data..." note + section label go stale once real
  data renders — rewrite both
- `.skeu-expandable-card__body.is-open` caps at `max-height: 400px`,
  tuned for short sample bullets — real entries (7 bullets at Big Ass
  Fans) will clip; raise/remove the cap as part of the card changes
- Taste calls resolved by agent per Ian's steering model (he reviews on
  the dev server): About = three unlabeled paragraphs, bio as lead;
  hobbies = main list + labeled "volunteering & mentorship" sub-group
  (KY FIRST, OSBC); hobby meta line keeps the year/active format

## Problem statement

All three Home tabs render the same masonry grid of `MasonryCard`s
(`Home.tsx` switches only the data array), which fights the Phase 1 data
model: job-based `WorkExperience` entries render as awkward masonry cards
with a `bullets` list crammed in. Concepts doc section 2 decided each page
gets its own layout: experience phase-grouped and narrative, projects
small cards with tags, hobbies a better list including volunteering,
About a real layout. `V2Preview.tsx` still shows fake "Sample Co" data.

## Files to change and why

- **New: `src/pages/home/ExperienceView.tsx`** — groups `workProjectsData`
  by `CareerPhase` in fixed order (Senior Engineer, Software Engineer II,
  Early career, Research), each group a `Section` + `Heading level={3}` +
  `Stack` of `ExpandableCard`s (descending `startYear` within a group).
  Reuses the existing `ExpandableCard` organism that V2Preview prototyped
  for exactly this — chisel-styled, expandable, company/period/bullets.
- **Changed: `src/components/organisms/ExpandableCard.tsx`** —
  - optional `companyUrl` prop rendering a small external-link Button in
    the body (concepts: links point at the company, not dead projects)
  - tags block renders only when `tech.length > 0` (experience cards have
    no tags by decision; empty div today)
  - a card with no bullets/tech/companyUrl (the Atrix stub) renders a
    non-expandable header — no caret, no aria-expanded, nothing to open
- **New: `src/pages/home/ProjectsView.tsx`** — extracts the existing
  masonry + `MasonryCard` rendering of `independentProjectsData` verbatim
  (tags/skills stay here by decision). Not a redesign; a move.
- **New: `src/pages/home/HobbiesView.tsx`** — vertical `Stack` list (no
  cards, no photos): per hobby a `Heading level={4}`, meta line, body
  `Text`, ghost icon links (instagram/url). Volunteering entries (KY FIRST
  Robotics, Open Source Breakfast Club) are already in `hobbyData`.
- **Changed: `src/pages/Home.tsx`** — the `<Masonry>` block is replaced by
  `{page === 'work' && <ExperienceView />}` etc.; masonry-related props
  (breakpoint cols) move into `ProjectsView`. `panelOpen` still needs to
  reach `ProjectsView` for its column count.
- **Changed: `src/pages/About.tsx`** — real layout: centered readable
  column (`Section` + `Stack`), `Heading level={1}`, distinct sub-sections;
  optional `aboutData.photo` (renders only if set). The interim "Back to
  portfolio" Button STAYS until Phase 4 (epic records its removal there).
- **Changed: `src/pages/admin/V2Preview.tsx`** — "Sample Co" fake
  `ExpandableCard`s replaced by rendering the real `ExperienceView`; the
  timeline + mixed-grid explorations stay (still genuine explorations).
- **Changed: `src/styles/components/_pages.scss`** — new `skeu-experience`,
  `skeu-hobbies`, `skeu-about` blocks, all token-driven (`var(--space-*)`,
  `var(--font-*)`); `skeu-about` owns the readable max-width column.
- **Changed: `src/styles/components/_organisms.scss`** (or wherever
  `skeu-expandable-card` lives) — company-link row spacing only.

## Approach and architectural reasoning

Views live under `src/pages/home/`, NOT `src/components/` — they are
single-use page compositions of existing atoms/organisms, so they carry no
`demo-missing` burden and add no speculative API surface. The only real
component change is `ExpandableCard`, which is already demoed. Mobile: the
three views inherit the existing `home-content__scroll` container, so the
hamburger/drawer flow is untouched (real mobile work is Phase 7).

## Risks / tradeoffs

- `ExpandableCard`'s non-expandable variant must not regress its a11y
  contract (aria-expanded/aria-controls only when expandable)
- `MasonryCard` keeps its union-typed `PortfolioItem` handling but only
  ever receives `ProjectData` and `HobbyData`... and after this phase only
  `ProjectData` — dead union branches are cleanup for a later phase, not
  this one (keep the diff reviewable)
- Home.tsx sits at 172 lines; extracting the three views keeps it inside
  the 250 budget as Phase 4 adds nav wiring
- Visual direction is agent-proposed per Ian's operating model — he steers
  from the dev server, so ship one coherent take, not three prototypes

## Verification checklist

- `npm run check`, `npm run build`, `npm test`
- Dev server: all three Home tabs render distinct layouts; About renders
  the column layout; V2Preview shows real data ("Sample Co" gone)
- Atrix stub renders as non-expandable header with no empty dropdown
