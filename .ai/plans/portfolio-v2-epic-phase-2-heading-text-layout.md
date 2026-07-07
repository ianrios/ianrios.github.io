# Phase 2 — Heading/Text sweep + layout primitives

Status: ✅ DONE — implemented, all checks green (84 tests), visually
verified by Ian 2026-07-07.

## Outcome

Landed as planned, with these deltas discovered during implementation:

- All four atoms gained a `className` prop (merged after the BEM classes) —
  sweep sites like `home-content__title` need their layout classes attached
  to the same element, which the plan hadn't anticipated
- `scripts/drift-checks.ts` blew the 250-line budget with `checkSemanticHtml`
  added; component/markup checks (`checkSemanticHtml`, `checkDemoMissing`,
  `reachableFrom`, `resolveImport`) split into `scripts/component-checks.ts`
- `[semantic-html]` scans all `src/**/*.tsx` via validate.ts (not just
  components/pages), exempting `Heading.tsx`, `Text.tsx`,
  `AppErrorBoundary.tsx`; unit tests cover pass/fire/exempt/inline-marks
- Weight controls render under a "Weight" sublabel in the Typography
  sidebar section; `font-weight` is a component-demonstrated category for
  `[token-example]` (Heading/Text demos show it live)
- `AtomsSection.tsx` demos compressed with `HEADING_LEVELS`/`TEXT_SIZES`
  const arrays to stay inside the 250-line code budget

## Peer review findings folded in

- File list was wrong in both directions (phantom files named, real ones
  missed). Corrected by direct grep, see Files section
- `ViolationType` in `scripts/validate.ts` needs `'semantic-html'` added —
  this is load-bearing, not optional
- Original verification grep (`<p ` with trailing space) missed bare `<p>`
  — fixed below
- Zero `--font-weight-*` tokens exist; only 5 `--font-*` size tokens for 6
  heading levels. Both are real token-registry additions with cascade cost
  (every `THEMES` entry must set every controlled token) — Ian decided: add
  a real editable weight category, add one more size token (`--font-xl`)
- `CLAUDE.md`'s "ten hard-error drift checks" line becomes stale (eleven
  after this phase) — added to this plan's doc-update step
- `AppErrorBoundary.tsx` deliberately exempted from the sweep and the
  check: an error boundary fallback must render even if the design system
  itself is what crashed, so it stays dependency-free raw HTML on purpose,
  not an oversight

## Problem statement

No `Heading`/`Text`/`Stack`/`Section` components exist. Every page and most
components use raw `<h1>`-`<h6>`/`<p>` and hand-styled `<div>`s for layout
(confirmed in `.ai/plans/portfolio-v2-concepts.md` section 0 — `Home.tsx`'s
`home-sidebar`/`home-content` divs never touch the token registry;
`LayoutCombinations.tsx` documents compositions of existing atoms, not
actual layout components). Ian decided (session 2) to wrap everything, zero
raw semantic tags anywhere. Phases 3 and 4 both require these primitives to
exist before they can be built — this phase is a hard prerequisite, not
parallelizable with them.

## Files to change and why

- **New atoms** (`src/components/atoms/`):
  - `Heading.tsx` — `level: 1-6` prop mapped to `h1`-`h6`. Size maps 1:1 onto
    the six `--font-*` tokens once `--font-xl` exists (h1=`--font-xl`,
    h2=`--font-lg`, h3=`--font-base`, h4=`--font-sm`, h5=`--font-xs`,
    h6=`--font-xxs`), weight from the new `--font-weight-heading` token,
    family from `--font-family-display`, `children`
  - `Text.tsx` — `as?: 'p' | 'span' | 'em' | 'strong'` (default `p`), `size?`
    tied to the existing `--font-*` scale, weight from `--font-weight-base`,
    family from `--font-family-base`, `children`
  - `Stack.tsx` — `direction: 'row' | 'col'`, `gap` tied to `--space-*`
    tokens, `align`/`justify` passthrough to flexbox
  - `Section.tsx` — page-level content region, `padding` tied to
    `--space-*` tokens. Replaces ad hoc divs like `home-content`
  - No `Grid` in this phase — concepts doc section 0 flags it as "possibly
    needed," and building it without a concrete consumer is exactly the
    premature abstraction `CLAUDE.md` warns against. Phase 3 adds it only
    if the projects page genuinely needs it over `react-masonry-css`

- **`src/styles/token-registry.ts`** — two real additions, both with full
  cascade cost (control + specimen + example + every `THEMES` entry):
  - `--font-xl` in the existing `font` category (extends 5 sizes to 6, one
    per heading level)
  - New `font-weight` category: `--font-weight-base` (body/normal),
    `--font-weight-heading` (headings/bold) — mirrors the existing
    `font-family` category's base/display split

- **`src/pages/admin/adminData.ts`** (or wherever `THEMES` lives) — every
  theme preset must set `--font-xl`, `--font-weight-base`, and
  `--font-weight-heading`, or `preset-token`/`theme-control`/
  `default-value-sync` fail

- **`src/pages/admin/preview/AtomsSection.tsx`** and **`TokensSection.tsx`**
  — demo/specimen entries for the four new atoms and three new tokens
  (required by `demo-missing`, `token-specimen`, `token-example`)

- **`scripts/drift-checks.ts`** — new `checkSemanticHtml` function, scanning
  for raw `<h1>`-`<h6>` and block-level `<p>` only (inline marks `<span>`/
  `<em>`/`<strong>`/`<a>` stay allowed raw — they're typically nested inside
  a `Heading`/`Text`'s children, and `Text`'s own `as` union already covers
  `em`/`strong`). Exemption list: the four new atom files themselves,
  `*.test.tsx`, and `AppErrorBoundary.tsx` (see above)

- **`scripts/validate.ts`** — register the check in the `driftChecks` array
  as `['semantic-html', ...]`, and add `'semantic-html'` to the
  `ViolationType` union (validate.ts:44) — easy to do the first and forget
  the second

- **`CLAUDE.md`** — "ten hard-error drift checks" becomes eleven, list the
  new one

- **The sweep** — confirmed by direct grep, these 16 files (not the
  original guess) have raw `<h1>`-`<h6>`/`<p>`: `src/pages/Admin.tsx`,
  `src/pages/admin/DSPreview.tsx`, `src/pages/admin/preview/BasicCombinations.tsx`,
  `src/pages/admin/preview/LayoutCombinations.tsx`,
  `src/pages/admin/preview/MoleculesSection.tsx`,
  `src/pages/admin/preview/OrganismsSection.tsx`, `src/pages/admin/V2Preview.tsx`,
  `src/pages/Home.tsx`, `src/pages/MobileNavDrawer.tsx`, `src/pages/NotFound.tsx`,
  `src/pages/WelcomeView.tsx`, `src/pages/About.tsx`,
  `src/components/molecules/CardWithDropdown.tsx`,
  `src/components/organisms/MasonryCard.tsx`,
  `src/components/organisms/PortfolioSidebar.tsx`. `src/AppErrorBoundary.tsx`
  is the 16th — deliberately excluded, see above.

## Approach and architectural reasoning

Build the four atoms and demonstrate the replacement pattern on 1-2 files
first (`About.tsx`, `NotFound.tsx` — smallest, clearest). Only then does the
mechanical sweep across the remaining ~20 files become genuinely low-risk
to delegate in parallel batches, since the pattern is proven and each batch
is a non-overlapping file set (no shared-file conflicts). The drift check
goes in last, once the sweep is complete, so it fails loudly if anything
regresses later rather than blocking mid-sweep.

## Risks / tradeoffs

- Largest-surface-area phase so far — touches nearly every existing file,
  not just new code. Higher chance of a missed raw tag; the new drift check
  is what catches stragglers, not manual review alone
- The two new token categories cascade into every `THEMES` entry (adminData.ts)
  — more files touched than the component work alone suggests, and a missed
  theme entry fails `npm run check` loudly (by design)
- `Heading`/`Text` props need to cover every current usage (e.g. any place
  currently relying on inline heading styles) — a gap here shows up as a
  visual regression, not a compile error, so Ian's visual check matters
  more on this phase than most
- Parallel Haiku-tier sweep batches carry some risk of inconsistent
  replacement patterns between batches; mitigated by demonstrating the
  pattern first and giving every batch the same precise brief

## Verification checklist

- `npm run check` (includes the new `[semantic-html]` check passing)
- `npm run build`
- `npm test`
- `grep -rln "<h[1-6][ >]\|<p[ >]" src --include="*.tsx" | grep -v ".test.tsx"`
  returns only the four new atom files and `AppErrorBoundary.tsx`
- Ian's visual pass across Home (all three tabs), `/about`, `/design-system`,
  `/three`, `/imagebox` 404 — confirms no regression from the sweep
