# Phase 4 — Content layout architecture (centering, scaling, padding)

Status: ✅ DONE (2026-07-14) — implemented narrower and lower-risk than
originally scoped below, after reading `ExperienceView.tsx`/`Contact.tsx`
directly during implementation. Padding fix landed one layer up from
`ExperienceView`'s own padding (`src/pages/Home.tsx`'s shared `ScrollArea`,
new `.home-content__views` rule in `_base.scss`), not as a wrapper around
the whole `<Outlet/>` — that broader version would have doubled `Contact`'s
own existing `Stack padding="lg"`. Verified algebraically this needs zero
changes to `ProjectsView.tsx`/the masonry gutter CSS: the grid's existing
negative left margin cancels the new ambient left padding, then the
column's own left padding reinstates it, landing the first column at the
new inset; the untouched right edge inherits the same ambient padding
directly — both sides land at `var(--space-md)`, matching. Caught a doubling
bug mid-implementation: `.skeu-experience` had to stay a full `padding`
shorthand (not a `padding-bottom` longhand), since `ExperienceView.tsx`'s
`Stack` also carries its own `padding="md"` prop that a longhand-only
override would have left in effect on the left/right. `About.tsx`/
`Contact.tsx` deliberately left untouched — not part of Ian's specific
padding complaint, each already has its own working scheme. Mobile panel
width: `PanelLayout.tsx` now passes `onMobile ? 'min(320px, 82vw)' :
'clamp(320px, 22vw, 440px)'` to `PushPanel`, via the same `useMediaQuery`
hook `SiteNav.tsx` uses; desktop's clamp, `PresetDial.tsx`'s hand-synced
copy, and `--panel-open-width` are all untouched. `npm run check`/`npm test`
(128/128) green; visual confirmation across viewport widths is Ian's to do
directly.

## Problem statement

Two related layout problems, both rooted in how `PanelLayout.tsx` and its
children handle horizontal space:

**(a) Content isn't reliably centered / doesn't scale sanely, most obvious on
mobile.** `PanelLayout.tsx`'s content column is a bare `flex: 1` Stack
wrapping `<Outlet/>` — no centering or width logic of its own. Centering is
instead reimplemented per page (`.skeu-experience`, `.skeu-about__column`,
`.skeu-contact__column`, each independently declaring their own `max-width`

- `margin: 0 auto`). Separately, `PushPanel`'s open width
  (`clamp(320px, 22vw, 440px)`, set in `PanelLayout.tsx`) has **no mobile-aware
  override** — the same clamp applies at every viewport width. On a
  ~375-414px-wide phone, opening the panel claims the 320px floor (roughly
  80-85% of the viewport), squeezing the remaining content column to a sliver
  (and on very narrow phones, close to or below the 320px floor plus the 28px
  tab width, risking overflow). Even while closed, the tab's fixed 28px width
  offsets the content column's start point by an amount that's imperceptible
  on a 1440px desktop screen but proportionally large on a 375px phone screen.
  This reads as "content not centered in the viewport" and is why it was "very
  obvious on mobile" specifically.

Because the panel's width changes via a real animated CSS `width` transition
on a true flex sibling (`.skeu-push-panel__clip`, `_organisms.scss:73-79`),
the content column already reflows continuously, frame-by-frame, via
ordinary flexbox as that width animates — there is no missing
synchronization logic to build. The fix is making the _widths themselves_
sane at every viewport, not adding new sync machinery.

**(b) Experience and Projects pages have mismatched padding.**
`.skeu-experience` (`_pages.scss:11-15`) uses symmetric
`padding: 0 var(--space-md) var(--space-lg)`. `ProjectsView`'s masonry grid
has no page-level padding wrapper at all — its left "gutter" comes from the
standard masonry negative-margin/column-padding technique
(`_atoms-button.scss:348-360`), which only compensates the _left_ edge; there
is no matching right-side padding, so the last column sits flush against the
container's right edge. Ian asked that this be fixed at a shared layer rather
than patched per page, since it will recur for any future page.

## Files to change and why

- `src/pages/PanelLayout.tsx` — give the panel a mobile-aware open width
  (e.g. via the same `useMediaQuery('(max-width: 991px)')` hook `SiteNav.tsx`
  already uses at the same breakpoint); introduce one shared
  padding/centering layer around `<Outlet/>` for every route it renders.
- `src/styles/components/_pages.scss` — `.skeu-experience`,
  `.skeu-about__column`, `.skeu-contact__column`: remove the padding/centering
  now owned by the shared layer; each page keeps only its own `max-width`
  (54rem / 40rem / `--modal-max-width` respectively — these legitimately
  differ per page and stay page-owned).
- `src/pages/home/ProjectsView.tsx` — once page-level padding is owned by the
  shared layer, confirm the masonry grid's existing left-gutter technique
  doesn't double up with it (may need the grid's own negative margin
  adjusted, since it will now sit inside a padded parent instead of a
  flush one).

Peer review turned up two more hand-synced copies of the panel-open-width
clamp not in the original file list, plus one page-local rule that must
survive the padding consolidation intact:

- `src/components/organisms/PresetDial.tsx` (~line 57) independently
  recomputes `Math.min(440, Math.max(320, window.innerWidth * 0.22))` for its
  own field sizing, and `src/styles/components/_organisms.scss:113` defines
  `--panel-open-width: clamp(320px, 22vw, 440px)` (consumed by
  `.skeu-preset-dial`'s `left` offset). `PresetDial.tsx`'s own comment notes
  all three copies must be kept in sync by hand. Since `PresetDial` is
  unconditionally hidden under 991px, a **mobile-only** override to the open
  width is safe without touching these two — but do not change the shared
  desktop clamp value without updating both.
- `.skeu-about__column` (`_pages.scss:70-75`) also carries
  `padding-bottom: calc(var(--about-header-h) + var(--space-lg))`, which
  clears a fixed links bar and is unrelated to centering/horizontal padding.
  The consolidation must remove only the horizontal
  padding/`margin: 0 auto`/`max-width` trio, not this vertical clearance.

## Approach and architectural reasoning

Two separable fixes landing in the same phase because they touch the same
layer:

1. Mobile-aware panel open width, following the `SiteNav.tsx` precedent for
   how this codebase already branches at 991px.
2. One shared content wrapper (in `PanelLayout.tsx`, around `<Outlet/>`) that
   owns horizontal padding and centering for every page — each page supplies
   only its own `max-width`. This directly fixes Projects' missing right
   padding (it inherits the shared padding instead of relying on the
   masonry technique's incomplete gutter) and satisfies "extract it one layer
   up" instead of duplicating the fix per page.

The exact mobile open-width value and the exact shape of the shared wrapper
(a prop on `PanelLayout`'s existing Stack vs. a small new component) are
implementation-level judgment calls, deliberately left open here rather than
dictated — flag for the peer reviewer and confirm with a dev-server check
before calling this phase done.

## Risks / tradeoffs

Highest blast radius of the six phases — touches shared layout used by every
route rendered through `PanelLayout`. Get the peer review to specifically
stress-test this phase's plan before implementation, and check the dev server
at multiple widths (not just one) before considering it done.

## Verification checklist

- `npm run check`, `npm test`, `npm run build`
- Manual, desktop and at least two mobile widths (e.g. 375px, 414px) in
  devtools device toolbar:
  - Content is centered before the panel is revealed.
  - Content visibly scales/reflows in sync with the panel's reveal animation
    (no jump-cut).
  - Content visibly scales/reflows in sync with opening/closing the panel
    (no jump-cut), and remains usable (not crushed to near-zero width) at
    common mobile widths.
  - Experience and Projects have matching left/right padding.
