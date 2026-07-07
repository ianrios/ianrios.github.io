# Phase 2.5 — Layout Primitive Migration

Status: READY FOR IMPLEMENTATION (peer review: Ian approved Option A approach)

## Problem statement

Phase 2 created `Heading`, `Text`, `Stack`, and `Section` components and successfully replaced all semantic HTML tags (`<h1>`-`<h6>`, `<p>`) with wrapped components. However, it did NOT complete the layout primitive migration. Evidence:

- `Home.tsx` still uses raw layout classNames: `"home-layout"`, `"home-content"`, `"home-content__header"`, `"home-content__tabs"`, etc.
- These are defined in `_base.scss` (lines 312-363) with hardcoded flexbox/grid logic
- 91 layout-related className instances across 19 files in `src/pages/`
- 265 total `skeu-*` className instances across 28 files

**Impact on design system extraction:** If we extract the design system to its own repo today, consumers would need to:

1. Import SCSS files
2. Remember className strings like `"home-content__header--bar"`
3. Understand the SCSS implementation to build new pages

This violates the stated goal: "a catalog of components that are the building blocks we can use to create anything we want, like a personalized version of bootstrap with no need to remember classnames or create additional styles on top of."

## Revised approach (Option A)

**Key insight:** `Stack` already handles flex direction, gap, align, justify (token-driven). Most layout classNames are just Stack with different props:

- `home-content__tabs` = `Stack direction="row" gap="xs"`
- `home-content__header--bar` = `Stack direction="row" justify="between" align="center"`
- `home-layout` ≈ `Stack direction="row"` + height/overflow

**Strategy:** Extend `Stack` with layout-specific props instead of creating 5 new components.

## Decisions this plan makes

- **Extend Stack, not create new components:** Add `height`, `overflow`, and `flex` props to Stack
- **Create only 1 specialized component:** `ScrollArea` for the hide-scrollbars + overflow pattern
- **Scope:** Replace ALL layout-related classNames in `src/pages/` with Stack/ScrollArea. Admin preview pages (`src/pages/admin/preview/`) are exempt.
- **Migration order:** Extend Stack first, migrate one page at a time (starting with simplest), add drift check last.
- **Drift check:** New `[layout-classnames]` check scans `src/pages/` (excluding `admin/preview/`) for layout-related className patterns, fails if found.

## Files to change and why

### Extend existing component

**`src/components/atoms/Stack.tsx`** — add three new optional props:

- `height?: string` — for full-viewport layouts (e.g., `"100vh"`)
- `overflow?: 'hidden' | 'auto' | 'scroll'` — for scroll containers
- `flex?: string` — for flex-grow/shrink/basis (e.g., `"1"` for flex: 1)

Implementation: apply these as inline styles (not className modifiers) since they're dynamic values, not token-driven variants.

### New specialized component

**`src/components/molecules/ScrollArea.tsx`** — handles the hide-scrollbars pattern

- Props: `hideScrollbars?: boolean`, `height?: string`, `children`, `className?`
- Renders: `<div className="home-content__scroll {hideScrollbars ? 'hide-scrollbars' : ''}" style={{height}}>`
- Why molecules? Composes overflow + scrollbar-hiding + height, more complex than Stack

### Migration mapping

**Before → After:**

- `<div className="home-layout">` → `<Stack direction="row" height="100vh" overflow="hidden">`
- `<div className="home-content">` → `<Stack direction="col" flex="1" overflow="hidden">`
- `<div className="home-content__header--bar">` → `<Stack direction="row" justify="between" align="center" gap="sm">`
- `<div className="home-content__tabs">` → `<Stack direction="row" gap="xs">`
- `<div className="home-content__scroll">` → `<ScrollArea height="calc(100vh - 80px)">`
- `<div className="container">` → `<Stack direction="col" className="container">` (keep container for max-width)

### Files to migrate

**Phase 1: Core pages (simplest first)**

- `src/pages/Home.tsx` — primary consumer, uses all patterns
- `src/pages/NotFound.tsx` — uses `.container`
- `src/pages/About.tsx` — uses layout classes

**Phase 2: Admin pages**

- `src/pages/Admin.tsx`
- `src/pages/admin/DSPreview.tsx`
- `src/pages/admin/V2Preview.tsx`
- `src/pages/admin/TokenControls.tsx`
- `src/pages/admin/TokenSidebar.tsx`
- `src/pages/admin/TokenPresets.tsx`
- `src/pages/admin/MixedProjectGrid.tsx`

**Phase 3: Home sub-views**

- `src/pages/home/ProjectsView.tsx`

**Exempt (admin preview demos):**

- All files in `src/pages/admin/preview/` — these demonstrate raw component usage

### Drift check

- **`scripts/component-checks.ts`** — add `checkLayoutClassNames()` function
  - Scans `src/pages/**/*.tsx` (excluding `admin/preview/`)
  - Fails if it finds: `home-layout`, `home-content`, `home-sidebar`, `container-fluid`, or other layout-specific patterns (`.container` is allowed since it provides max-width utility)
  - Exemption list: `ScrollArea.tsx`

- **`scripts/validate.ts`** — register `['layout-classnames', ...]` in `driftChecks` array, add to `ViolationType` union

### Documentation

- **`src/pages/admin/preview/AtomsSection.tsx`** — update Stack demo to show new height/overflow/flex props
- **`src/pages/admin/preview/MoleculesSection.tsx`** — add ScrollArea demo
- **`CLAUDE.md`** — update drift check count (11 → 12)

## Approach and architectural reasoning

**Why extend Stack instead of creating 5 new components?**

- Stack already handles 80% of layout needs (flex, gap, align, justify)
- Adding height/overflow/flex props is simpler than maintaining 5 separate components
- Reduces component proliferation and API surface area
- Easier to learn: one component with more props vs. five components to remember

**Why create ScrollArea?**

- The hide-scrollbars pattern is complex enough to warrant its own component
- Combines overflow + scrollbar-hiding + height in a way that's not just "Stack with props"
- Molecules are appropriate for this level of composition

**Why inline styles for height/overflow/flex?**

- These are dynamic values (e.g., `"100vh"`, `"calc(100vh - 80px)"`), not token-driven variants
- Creating className modifiers for every possible height value is impractical
- Inline styles are the React-idiomatic way to handle dynamic CSS values

**Migration strategy:**

1. Extend Stack with new props
2. Create ScrollArea
3. Update Stack demo in AtomsSection
4. Add ScrollArea demo in MoleculesSection
5. Migrate `Home.tsx` as proof-of-concept (uses all patterns)
6. Migrate remaining pages in batches (non-overlapping files)
7. Add drift check last (once migration is complete)

## Risks / tradeoffs

- **Inline styles:** Adding inline styles to Stack breaks the "all styling via classNames" pattern. Accepted because these are dynamic values, not token-driven variants.
- **Stack API growth:** Stack now has 7 props (direction, gap, align, justify, height, overflow, flex). Still manageable, but approaching the complexity threshold.
- **Visual regression risk:** Layout changes are subtle; automated tests won't catch spacing/alignment issues. Ian's visual review is critical.
- **SCSS still required:** This phase makes components easier to use but doesn't eliminate SCSS from the repo. Full extraction (design system as its own package) is a separate epic.

## Verification checklist

- `npm run check` (includes new `[layout-classnames]` check passing)
- `npm run build`
- `npm run test`
- Grep confirms no layout classNames in pages (excluding admin/preview):
  ```bash
  grep -rn "className=.*\(home-layout\|home-content\|home-sidebar\|container-fluid\)" src/pages --include="*.tsx" | grep -v "admin/preview"
  ```
- Ian's visual pass: Home (all tabs), About, Admin, Design System — confirms no layout regressions
