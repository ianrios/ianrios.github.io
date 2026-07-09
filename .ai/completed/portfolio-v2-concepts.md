# Portfolio V2 — concept discussion (pre-plan)

Not a phased plan yet. Working doc to align on direction before anything
gets peer-reviewed or built. Supersedes the old `portfolio-overhaul.md`
brainstorm list — see sections 7-10 below for where every numbered item
from that file landed (today's scope, open forks, dropped, or backlog).

## 0. Design system gap — layout primitives

Confirmed real: `Button`, `Badge`, `Card`, `Icon`, `Slider`, `Switch`,
`Input`, `Accordion`, `NavBar`/`NavVertical`, `PushPanel`, `ExpandableCard`,
`MasonryCard`, `PortfolioSidebar`, `ContactModal` are genuine token-driven
components with drift-check coverage. But there is no layout layer —
`Home.tsx` positions everything with hand-styled divs
(`home-sidebar`, `home-content`, `home-content__header`) that never touch
the token registry. `LayoutCombinations.tsx` in the admin preview shows
compositions of existing atoms, not actual layout components — mislabeled.

**Proposal:** don't build layout primitives speculatively. Derive them from
what V2's three distinct page layouts (experience / projects / hobbies)
plus About actually need, as phase 0 of the V2 epic, then generalize only
what repeats across pages. Candidates that will likely fall out of this:

- `Stack` — flex row/col with a token-driven `gap`
- `Section` — a page-level content region (replaces ad hoc `home-content`-style divs)
- Possibly `Grid` if the projects page needs a real grid instead of the
  `react-masonry-css` library currently in use
- `Heading` and `Text` — **decided:** wrap everything, zero raw semantic
  tags anywhere in pages/components. `h1`-`h6` become `Heading` instances
  (level as a prop), `p`/generic text becomes `Text`. This is a real sweep
  across every existing page and component, not just new V2 code — needs
  its own phase and its own drift check (analogous to `token-unused`) so it
  doesn't silently regress the moment someone reaches for `<p>` again.

## 1. Navigation — floating draggable contextual nav

Replaces `PortfolioSidebar`/`NavVertical` as currently wired into `Home.tsx`.
New organism, concept: a small floating panel with a grip handle (top or
left edge), draggable to reposition, content swaps per route/page rather
than being a fixed set of links — closer to a condensed command panel than
a traditional nav.

**Decided:** one global drag position persisted across all pages/routes;
only the panel's _content_ (links/actions) swaps per page. Simpler
persistence model — a single `{x, y}` in storage, not per-route state.

**Also decided (session 2):** this panel is the sole top-level page-to-page
navigation UI — a "remote control" listing destinations (Home, Design
System, ThreeScene, About, Contact, etc.), not a spatial D-pad. No fixed
edge arrow buttons (see section 8). It carries the transition trigger, but
doesn't own the transition logic itself — see section 8 for why existing
content links (project card live links, back-to-portfolio links) don't need
to change.

Mobile: keep the existing hamburger + drawer pattern (`MobileNavDrawer`
already exists) rather than trying to make a draggable panel work on touch.

## 2. Per-page looks

Each of experience / projects / hobbies gets its own layout, not one
shared card grid:

- **Experience** — phase-grouped (see below), no skill/tool tags on cards
  (per your #12 decision), chisel-forward buttons. Cards likely need more
  narrative weight (company, period, bullets) since tags and (probably)
  photos are gone.
- **Projects** — small cards, tags/skills retained here (useful signal for
  side projects specifically, per your note).
- **Hobbies** — "listed better" (your words) + folds in volunteer/leadership
  items currently sitting unused in the resume (KY FIRST Robotics, Open
  Source Breakfast Club).
- **About** — new page. **Decided:** the SE II resume blurb as the bio, plus
  1-2 personal paragraphs (hobbies, projects, volunteering) and a closing
  note on how this site gets built. Draft copy in section 6.

## 3. Career-phase grouping + WorkExperience restructure (data model) — CONFIRMED

**Session 3 decision:** `WorkExperience` is no longer project-shaped. It's
genuinely job-based — one entry per position, resume-mirrored bullets
instead of a single `body`, one `companyUrl` instead of per-project
`href`/`live`/`tools`/`img_src_arr`/`activelyMaintained`. This is what
finally resolves the "too noisy, one card per internal project" problem
from the very first spec item.

```
interface WorkExperience {
  company: string;
  title: string;
  phase: CareerPhase;       // 'Senior Engineer' | 'Software Engineer II' | 'Early career' | 'Research'
  startYear: number;
  endYear: number | null;   // null = present
  bullets: string[];        // resume-mirrored, replaces `body`
  companyUrl?: string;
}
```

Final job list (phase, dates, companyUrl all confirmed by Ian):

1. **Atrix** — Senior Engineer — 2026–present — stub, no bullets/companyUrl yet
2. **Built Technologies** — Software Engineer II — Jan 2024–May 2026 — `getbuilt.com`
3. **Big Ass Fans** — Software Engineer II — Jan 2022–Dec 2023 — `bigassfans.com`
4. **Luxury Garage Sale** — Early career — Jun 2020–Nov 2020 — `instagram.com/luxurygaragesale`
5. **Apax Software** — Early career — May 2019–Aug 2019 — `apaxsoftware.com`
6. **Awesome Inc** — Early career — Jan 2019–Dec 2021 — `awesomeinc.org`
7. **Conversant Media** — Early career — Jul 2018–Jan 2019 — `epsilon.com/us` (Conversant is now Epsilon)
8. **My Music Machines** (Albany Medical Center, built the Jamboxx product) — Early career — Jun 2017–Aug 2017 — `sites.google.com/view/jamboxx/home` — bullets include Score Reader + Falling Notes (both Jamboxx Max for Live patches)
9. **RPI CCCC** (Center for Cognition, Communication & Culture) — Research — Apr 2017–Oct 2017 — RPI catalog URL — bullets include MIDI Receive/Send UDP (built for RPI CCCC, concurrent with but separate from My Music Machines that same summer)

Leadership activities (KY FIRST Robotics — `kyfirstrobotics.org`, Open Source
Breakfast Club) move to the hobbies page per section 2, not into this list.

**Known consequence:** `MasonryCard.tsx` currently accesses `img_src_arr`,
`activelyMaintained`, `year`, and `body` unconditionally on the
`PortfolioItem` union (no per-field guards) — removing those from
`WorkExperience` doesn't compile without touching that file too, even though
this is nominally a "data-only" phase. Phase 1 does the minimal
type-safe fix (date-range display, bullets as a list, `companyUrl` as a
link) using existing card styling — not the real Phase 3 redesign.

## 4. Photos — decided

No photos on experience/project/hobby cards. One photo allowed on the About
page only. Images stay in the repo/data (`img_src_arr`), just unused by V2
card rendering — easy to reverse later without a content migration.

## 5. Content changes confirmed (no further discussion needed)

- Remove from `independentProjectsData`: Twitterbot, Borilliant, Portfolio,
  Barely Enough Ingredients
- Remove "WHY? Record Company Website" project entry (WRC stays hobby-only
  via existing "WRC Label Manager" entry)
- Add Petal, Cortex as stub project entries (details TBD, you'll fill in)
- Add Atrix as a stub work entry (new senior role, full spec once you have
  details)
- New external links (you'll supply)
- No per-job/project skill tag lists on experience cards
- No auto-open/close accordion behavior — dropped

## 6. About page copy (draft — edit freely)

**Bio** (adapted from the resume summary in `.ai/plans/resume-temp.txt`):

> I'm a software engineer with 8 years of experience building web
> platforms, AI-assisted engineering workflows, and developer productivity
> systems. My work spans component architecture, full-stack SaaS
> infrastructure, frontend design systems, testing reliability, and
> operational AI systems. I like designing systems from the ground up,
> setting architectural standards that hold up years later, and building
> tooling that measurably improves how fast and how well a team can ship.

**Personal** (hobbies, projects, volunteering, drawn from resume +
memory context):

> Outside of work I run WRC, an independently owned record label I built
> the artist portal and store for, and I produce and DJ electronic music
> under a rotating cast of aliases. I've also worked as a personal chef,
> cooking and delivering meals for coworkers as a small side business,
> because I like feeding people almost as much as I like building things
> for them. I studied Electronic Arts and Computer Music alongside computer
> science at RPI, and that mix of engineering and craft still shows up in
> how I approach this site. I mentor engineers when I can, whether that's
> leading standups for the KY FIRST Robotics summer program or running
> workshops through the Open Source Breakfast Club.

**Closing note** (the meta detail, ties to your #12 reasoning about an
AI-first world):

> This site, like most of what I build these days, is put together in
> collaboration with AI coding agents: I set direction and review, they
> write the code. It felt right to say that plainly here rather than
> pretend otherwise.

## 7. Today's session scope (nothing here gets silently dropped)

In dependency order:

1. Content/IA: `data.ts` changes from section 5, `phase` field, About page copy above
2. Heading/Text component sweep + layout primitives (`Stack`/`Section`/maybe `Grid`) + new drift check
3. V2 per-page layouts: experience, projects, hobbies, About
4. Floating draggable nav (global position, per-page content)
5. Page-to-page transitions — papers-on-a-table metaphor, triggered via the
   floating nav (no edge arrows, no gestures), see section 8
6. Cursor system (admin-configurable)
7. Texture filter system (admin-configurable)
8. WebGL hover effects (admin-configurable)
9. Mobile pass (once 3-5 are real, not against a moving target)
10. Cookie consent banner — independent, can slot in anytime
11. Padding/width bug audit + fix — independent, can slot in anytime

## 8. Transition metaphor and controls — resolved

- **Transition metaphor — decided.** Today's V2 epic uses only the papers
  on a table metaphor (items 11/22) for page-to-page navigation. Pixel-morph
  (item 18) moved to `.ai/specs/metaballs-overhaul.md` — it's an entry/
  splash-specific idea, not part of V2 page transitions.
- **Transition controls — decided.** No fixed edge arrow buttons (rejected —
  Ian doesn't like controls pinned to the page). The floating grip nav from
  section 1 is the sole navigation UI: a "remote control" listing
  destinations, not a spatial D-pad. Gesture navigation (swipe/drag) is a
  good idea but explicitly out of scope for today; noted in section 10.
- **Existing hard links — no changes needed.** Every internal link in the
  app already funnels through one chokepoint: `Button.tsx:150-178`
  resolves any `Button as="link" href="/..."` to a react-router `RouterLink`,
  not a raw `<a>`. That's what currently renders the "Live Design System"
  and "Meta Spheres" project cards' live links (`data.ts:15,27` →
  `MasonryCard.tsx:113-117`) and the "back to portfolio" links on
  `ThreeScene.tsx:130` and `Admin.tsx:50`. Wiring the transition into that
  one chokepoint (or a shared `navigate()` wrapper at the router level)
  means every existing internal link — project cards, back-links, the
  floating nav — inherits the animated transition automatically. No
  `data.ts` changes, no call-site rewrites, nothing to remove.
- **Direction is a data concern, not a UI concern.** Dropping edge arrows
  removes the physical "this is the right-edge button" cue for pan
  direction. Keep a small per-route direction map (Design System = right,
  ThreeScene = left, etc.) used only to drive the pan animation, decoupled
  from any on-screen arrow — so the papers-on-a-table feel survives even
  though the trigger is the floating remote, not a directional button.

## 9. Explicitly dropped (decided against, not backlogged)

- Public long-term-vision doc (item 9) — "I don't think I need this at all"
- Auto-open/close accordion sections on scroll (item 2 detail) — "not a good idea"

## 10. Backlog — wanted eventually, not part of today's session

Tracked as their own spec files so they don't get lost:

- `.ai/specs/resume-page.md` — `/resume` download + visualization (item 7)
- `.ai/specs/font-picker.md` — configurable Google Fonts picker (item 17)
- `.ai/specs/design-library-extraction.md` — design system as its own
  package/repo, reused by Petal and WRC
- `.ai/specs/metaballs-overhaul.md` — pixel-morph splash/route transition
- Gesture navigation (swipe/drag between pages) — good idea, not part of
  today's edge-arrow-buttons implementation. No dedicated file; whoever
  builds the transitions phase should treat arrows and gestures as separate
  input methods for the same underlying transition, gestures addable later
  without changing the transition system itself

Not backlog specs, just tracked open items pending you:

- **Atrix** — new senior role, full work-experience entry once you supply
  details (stub only for today)
- **Petal, Cortex** — full project write-ups once you supply details (stub
  entries only for today; Cortex is the agent-steering system used across
  this repo, Petal, and WRC)
- **Item 24** (remove [Design System]/[Portfolio v2 Preview]/[Home (live)]
  buttons) — tracked as the closing task of the V2 epic, done once V2 fully
  replaces V1, not before
