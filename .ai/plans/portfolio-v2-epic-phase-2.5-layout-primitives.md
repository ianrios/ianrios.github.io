# Phase 2.5 — Layout Primitive Migration

Status: READY FOR PEER REVIEW

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

## Decisions this plan makes

- **Scope:** Replace ALL layout-related classNames in `src/pages/` with proper React components. Admin preview pages (`src/pages/admin/preview/`) are exempt (they demonstrate raw component usage patterns).
- **Component strategy:** Create layout components that wrap the existing SCSS patterns, don't rewrite the CSS. E.g., `PageLayout` renders a div with `className="home-layout"` internally, exposing only props.
- **Migration order:** Create components first, migrate one page at a time (starting with simplest), add drift check last.
- **Drift check:** New `[layout-classnames]` check scans `src/pages/` (excluding `admin/preview/`) for layout-related className patterns, fails if found.

## Files to change and why

### New layout components (src/components/molecules/)

**Why molecules, not atoms?** These compose multiple layout concerns (flex direction + gap + padding + overflow) and are page-structure-specific, not primitive building blocks.

1. **`PageLayout.tsx`** — replaces `"home-layout"` (flex container, full viewport height)
   - Props: `children`, `className?`
   - Renders: `<div className="home-layout {className}">`

2. **`ContentArea.tsx`** — replaces `"home-content"` and `"home-content--mobile"`
   - Props: `mobile?: boolean`, `children`, `className?`
   - Renders: `<div className="home-content {mobile ? 'home-content--mobile' : ''} {className}">`

3. **`ContentHeader.tsx`** — replaces `"home-content__header"` and `"home-content__header--bar"`
   - Props: `variant?: 'centered' | 'bar'`, `children`, `className?`
   - Renders: `<div className="home-content__header {variant === 'bar' ? 'home-content__header--bar' : ''} {className}">`

4. **`TabBar.tsx`** — replaces `"home-content__tabs"`
   - Props: `children`, `className?`
   - Renders: `<div className="home-content__tabs {className}">`

5. **`ScrollArea.tsx`** — replaces `"home-content__scroll"` and `"hide-scrollbars"`
   - Props: `hideScrollbars?: boolean`, `height?: string`, `children`, `className?`
   - Renders: `<div className="home-content__scroll {hideScrollbars ? 'hide-scrollbars' : ''} {className}" style={{height}}>`

### Files to migrate

**Phase 1: Core pages (simplest first)**
- `src/pages/Home.tsx` — primary consumer of all new components
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
  - Fails if it finds: `home-layout`, `home-content`, `home-sidebar`, `container`, `container-fluid`, or other layout-specific patterns
  - Exemption list: the new layout component files themselves

- **`scripts/validate.ts`** — register `['layout-classnames', ...]` in `driftChecks` array, add to `ViolationType` union

### Documentation

- **`src/pages/admin/preview/MoleculesSection.tsx`** — add demos for all 5 new layout components
- **`CLAUDE.md`** — update drift check count (11 → 12)

## Approach and architectural reasoning

**Why wrap existing SCSS instead of rewriting?**
- The existing layout CSS works and is token-driven
- Rewriting risks visual regressions
- Wrapping preserves behavior while improving DX
- Future refactoring can happen inside the components without touching call sites

**Why molecules, not organisms?**
- These are structural primitives (like `Stack`), not feature-complete UI blocks
- They compose layout concerns but don't own business logic
- Organisms are things like `ContactModal`, `FloatingNav` — these are simpler

**Migration strategy:**
1. Build all 5 components first (with demos)
2. Migrate `Home.tsx` as the proof-of-concept (it uses all 5)
3. Migrate remaining pages in batches (non-overlapping files)
4. Add drift check last (once migration is complete)

## Risks / tradeoffs

- **Largest surface area since Phase 2:** Touches 10+ page files, not just new code
- **Visual regression risk:** Layout changes are subtle; automated tests won't catch spacing/alignment issues. Ian's visual review is critical.
- **Component naming:** `ContentArea`, `ContentHeader`, `TabBar` are generic names that might conflict with future needs. Accepted for now; can rename later if needed.
- **SCSS still required:** This phase makes the components easier to use but doesn't eliminate SCSS from the repo. Full extraction (design system as its own package) is a separate epic.

## Verification checklist

- `npm run check` (includes new `[layout-classnames]` check passing)
- `npm run build`
- `npm run test`
- Grep confirms no layout classNames in pages (excluding admin/preview):
  ```bash
  grep -rn "className=.*\(home-layout\|home-content\|home-sidebar\|container\)" src/pages --include="*.tsx" | grep -v "admin/preview"
  ```
- Ian's visual pass: Home (all tabs), About, Admin, Design System — confirms no layout regressions
