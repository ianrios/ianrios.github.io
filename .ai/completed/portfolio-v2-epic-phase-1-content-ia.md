# Phase 1 — Content & IA

Status: ✅ DONE 2026-07-07. Peer reviewed, gaps resolved with Ian directly
(Built Technologies coverage, WorkExperience restructure, Jamboxx/My Music
Machines/RPI CCCC attribution). Ian confirmed the live result looked right
in the browser at localhost:3001.

## Outcome

`WorkExperience` restructured to job-based (`company`/`title`/`phase`/
`startYear`/`endYear`/`bullets`/`companyUrl`), 9 real entries replacing the
old 16 project-shaped ones. `independentProjectsData` and `hobbyData`
updated per the confirmed list. New `aboutData` export and a minimal
`/about` route (`src/pages/About.tsx`) — plain markup on purpose, real
layout is Phase 3. `MasonryCard.tsx`, `Home.tsx`, and
`OrgCombinations.tsx` needed matching type-safety fixes since the
breaking `WorkExperience` change didn't compile otherwise, despite this
being nominally a data-only phase (see Risks section below, this was
anticipated). `npm run check` / `build` / `test` all green.

## Problem statement

`src/data.ts` reflects the old portfolio: `WorkExperience` is shaped like a
project card (one entry per internal project, `company` bolted on), which is
why Big Ass Fans alone has 7 separate cards — exactly the noise problem
flagged in the original spec's first item. Personal projects data is stale.
No About page content exists. This phase fixes the data layer so phases 2+
(layout, primitives, page design) build against real content.

## Files to change and why

- **`src/types/data.ts`**
  - Add `CareerPhase` union: `'Senior Engineer' | 'Software Engineer II' | 'Early career' | 'Research'`
  - Restructure `WorkExperience` (breaking change, not additive):
    `{ company: string; title: string; phase: CareerPhase; startYear: number; endYear: number | null; bullets: string[]; companyUrl?: string }`.
    Drops `year`, `tools`, `activelyMaintained`, `img_src_arr`, `body`,
    `href`, `live` — none of these are job-appropriate at this granularity
    (see `.ai/plans/portfolio-v2-concepts.md` section 3 for the full
    reasoning and confirmed job list)
  - Add `AboutData`: `{ bio: string; personal: string; closing: string; photo?: string }`

- **`src/data.ts`**
  - Replace all of `workProjectsData` (currently 16 project-shaped entries)
    with 9 job-shaped entries per the confirmed list in concepts doc section
    3: Atrix (stub), Built Technologies, Big Ass Fans, Luxury Garage Sale,
    Apax Software, Awesome Inc, Conversant Media, My Music Machines, RPI
    CCCC. Bullets mirror `resume-temp.txt` verbatim where the job is on the
    resume (all except Atrix); `companyUrl` per the URLs Ian supplied.
  - `independentProjectsData`: remove Twitterbot, Borilliant, Portfolio,
    Barely Enough Ingredients, "WHY? Record Company Website" (WRC stays
    hobby-only). Add Petal (bare stub) and Cortex (agent-steering system
    used across this repo, Petal, and WRC — real one-line body, tools TBD)
  - `hobbyData`: add KY FIRST Robotics (Jan 2025–Aug 2025, `activelyMaintained: false`,
    `url: 'https://www.kyfirstrobotics.org/'`) and Open Source Breakfast Club
    (Feb 2019–Apr 2020, `activelyMaintained: false`, `url: ''`) — both pulled
    from `resume-temp.txt`'s Leadership Activities section, currently unused
    anywhere in `data.ts`. `img_src_arr: []`, `instagram: ''` on both (no
    assets/socials for either)
  - Add `aboutData: AboutData` export with the three paragraphs approved in
    concepts doc section 6. `photo` left `undefined` (no image asset supplied)
  - `externalLinks`: unchanged — new links not yet supplied by Ian

- **`src/components/organisms/MasonryCard.tsx`** (minimal, not a redesign)
  - `item.img_src_arr`, `item.activelyMaintained`/`item.year`, `item.body`
    are currently accessed unconditionally on the `PortfolioItem` union —
    this only compiled because every union member had those fields. The
    restructured `WorkExperience` doesn't, so this file needs the same
    `'x' in item` guard pattern already used for `tools`/`href`/`live`:
    - Date display: branch on `'startYear' in item` (job) vs `'year' in item`
      (project/hobby) to render "Jan 2024 to present" / "Jan 2024 to May 2026"
      style vs the existing "started in Y - active" / "built in Y" style
    - Body: render `bullets` as a list when present, `body` as a paragraph
      otherwise
    - Link row: render `companyUrl` as a plain external link when present,
      alongside the existing href/info/live/instagram/url buttons (mutually
      exclusive per item type in practice)
  - Explicitly out of scope here: new card layout, phase grouping headers,
    chisel-button styling, removing photos from the visual design — all real
    Phase 3 work. This is only what's required for the app to typecheck and
    render sensibly against the new data shape, using the existing card look.

## Approach and architectural reasoning

`phase` and the date fields are typed, not free strings, so a typo can't
silently break Phase 3's grouping logic. `WorkExperience` is restructured
now rather than patched twice (once here, once "for real" in Phase 3)
because the type has to be correct before bullets/companyUrl can exist at
all — patching it additively first and breaking it again in Phase 3 would
be pure churn.

## Risks / tradeoffs

- Atrix is a genuine stub (no bullets, no companyUrl) — expected, blocked on
  Ian supplying details, not a defect
- This phase necessarily touches `MasonryCard.tsx` despite being named
  "content & IA" — unavoidable given the breaking type change; kept
  deliberately minimal so Phase 3 isn't pre-empted
- Bullet text is adapted from resume prose to standalone sentences (resume
  bullets sometimes rely on the job header for subject/verb context) —
  meaning preserved, wording not always verbatim

## Verification checklist

- `npm run check` (format, typecheck, lint, drift checks)
- `npm run build`
- `npm test`
- `grep -rn "Twitterbot\|Borilliant\|Barely Enough Ingredients" src` returns
  nothing outside `data.ts`
- Manual diff of every bullet against `resume-temp.txt` for factual accuracy
