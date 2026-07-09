# Phase 2.6: Quality & Tooling Improvements

**Status:** ✅ DONE (completed in two passes - see Outcome)
**Epic:** Portfolio v2 Overhaul
**Dependencies:** Phase 2.5 (Layout Primitives)

## Outcome

Bob's pass landed #6 (projectsData split), #4A (DesignSystemProps JSDoc),
and #4C (CLAUDE.md style-prop policy); #2 was rejected. The remaining
items were completed 2026-07-08 (the "completed 2.5 and 2.6" commit
message predated this):

- **#3 colocated demos (Option A)**: every component has a sibling
  `<Name>.demo.tsx` (30 files, extracted by three parallel tier
  subagents), self-contained (no `src/pages/**` imports; fixtures
  inlined). Tier sections are thin wiring (AtomsSection 250 -> 88
  lines). Enforced: `[demo-missing]` now also requires the sibling file.
  `PushPanelVariants.tsx` folded into `PushPanel.demo.tsx`; single-demo
  fixtures pruned from adminData; FormField's demo now renders the real
  component (the old one hand-rolled markup and never used it).
- **#1 dynamic layout detection**: block-level `.home-*` classes +
  `container-fluid` are discovered from the SCSS; element-level `__`
  companions stay allowed; cross-partial offenders remain an explicit
  extras list. Check moved to `component-checks.ts`.
- **#4B `[style-prop]` check**: components building props on
  HTMLAttributes must use DesignSystemProps or an explicit style Omit.
- **#5 registration**: the `driftChecks` registry object's keys ARE the
  ViolationType members - registering a check is one entry, and an
  unregistered name cannot compile. Full auto-discovery was rejected:
  check inputs are heterogeneous, magic would hide them.

## Context

Following Phase 2.5 completion, several opportunities for improving code quality checks and architectural patterns emerged. These improvements focus on scalability, automation, and enforcing design system purity.

## Goals

1. Make drift checks more maintainable and scalable
2. Solve preview file size limits architecturally (not with exemptions)
3. Enforce design system style prop purity with automated checks
4. Reduce manual maintenance burden for quality checks

## Proposed Improvements

### 1. Dynamic Layout ClassName Detection

**Current State:**

- `checkLayoutClassNames` uses hardcoded array of class names
- Adding new layout classes requires manual update to drift check

**Proposed Solution:**

- Auto-discover layout classes from `_base.scss` using pattern matching
- Regex: `/\.(home|skeu)-.*__(layout|content|sidebar|header|body|main|tabs)/`
- Benefit: Catches new layout classes automatically without code changes

**Implementation:**

- Update `checkLayoutClassNames` to parse SCSS file
- Extract class names matching layout patterns
- Compare against usage in TSX files

---

### 2. ~~Line Length Limit~~ (REJECTED)

**Decision:** Keep 80-char limit. Works well for restricting agent verbosity.

---

### 3. Preview File Size - Architectural Solution

**Current Problem:**

- Preview files naturally grow large (AtomsSection: 245 lines)
- 250-line limit forces awkward splits
- Adding 10/50/1000 components would make this worse

**Root Cause Analysis:**

- Monolithic preview files don't scale
- Each atomic tier has ONE preview file with ALL demos
- Pattern breaks down as design system grows

**Proposed Architectural Solution:**

**Option A: Component-Colocated Demos**

```
src/components/atoms/
  Button.tsx
  Button.demo.tsx  ← exports demo JSX
  Stack.tsx
  Stack.demo.tsx
```

- Each component exports its own demo
- Preview page imports and renders all `*.demo.tsx` files
- Scales to 1000+ components without file size issues
- Demos live next to components (easier maintenance)

**Option B: Demo Registry Pattern**

```typescript
// src/components/demo-registry.ts
export const DEMOS = {
  atoms: [
    { name: 'Button', component: lazy(() => import('./atoms/Button.demo')) },
    { name: 'Stack', component: lazy(() => import('./atoms/Stack.demo')) },
  ],
  molecules: [...],
  organisms: [...]
}
```

- Centralized registry with lazy loading
- Preview page iterates registry
- Auto-discovery possible via file system scan

**Recommendation:** Option A (colocated demos)

- Better DX (demos next to components)
- No central registry to maintain
- Natural file organization

---

### 4. Style Prop Purity Enforcement

**Current State:**

- Stack/ScrollArea block `style` via `Omit<HTMLAttributes, 'style'>`
- TypeScript prevents usage at compile time
- No documentation explaining why
- No drift check verifying pattern is used consistently

**Design System Purity Rules:**

1. **Internal components** (atoms/molecules/organisms) MAY accept `style` prop for flexibility
2. **Consumer-facing exports** MUST block `style` prop (forces named props only)
3. **Rationale:** Design system extraction requires zero SCSS knowledge

**Proposed Solution:**

**A. Add JSDoc Documentation:** remarks block on `DesignSystemProps` in
`src/types/design-system.ts` explaining why `style` is blocked (named
props only, so the library extracts without SCSS knowledge).

**B. Add Drift Check:** `checkStylePropBlocking` scans exported components
in atoms/molecules/organisms and flags any type that fails to
`Omit<..., 'style'>`.

**C. Document Pattern:**

- Add to CLAUDE.md under "Design System Rules"
- Explain internal vs consumer-facing distinction
- Provide examples of correct usage

---

### 5. Automated Drift Check Registration

**Current State:**
Adding a new drift check requires 4 manual steps:

1. Write check function in `drift-checks.ts`
2. Add to imports in `validate.ts`
3. Add to `ViolationType` union
4. Add to `driftChecks` array

**Proposed Solution:** Option A, convention-based auto-discovery: every
`check*` export in the check modules registers itself, with the violation
name derived from the function name. Option B (an explicit `registerCheck`
map) was considered and passed over.

**Recommendation:** Option A (auto-discovery)

- Less boilerplate
- Impossible to forget registration
- TypeScript ensures type safety

---

### 6. Fix ProjectsView Fast Refresh Warning

**Current Issue:** `ProjectsView.tsx` exports both the component and the
`skills` constant, which breaks React fast refresh.

**Proposed Solution:** move `skills` into `src/pages/home/projectsData.ts`;
`ProjectsView` and Home import it from there.

**Benefit:** Clean component exports, no warnings

---

## Implementation Plan

### Step 1: Documentation & Planning

- [ ] Review this plan with user
- [ ] Get approval on architectural decisions (especially #3)
- [ ] Clarify style prop rules (#4)

### Step 2: Quick Wins (Session 1)

- [ ] #6: Fix ProjectsView fast refresh warning
- [ ] #4A: Add JSDoc to Stack/ScrollArea explaining style prop block
- [ ] #4C: Document pattern in CLAUDE.md

### Step 3: Drift Checks (Session 2)

- [ ] #1: Implement dynamic layout className detection
- [ ] #4B: Add style prop blocking drift check
- [ ] #5: Implement automated drift check registration

### Step 4: Architecture (Session 3)

- [ ] #3: Implement chosen demo pattern (colocated or registry)
- [ ] Migrate existing preview files to new pattern
- [ ] Update CLAUDE.md with new demo conventions

### Step 5: Verification

- [ ] Run `npm run check` - all checks passing
- [ ] Verify no regressions in existing functionality
- [ ] Update this plan with completion status

---

## Success Criteria

- [ ] All 6 improvements implemented (except #2 - rejected)
- [ ] Zero manual maintenance for layout className detection
- [ ] Preview files scale to 1000+ components without size issues
- [ ] Style prop purity enforced automatically
- [ ] Drift check registration is automatic
- [ ] Fast refresh warning eliminated
- [ ] All documentation updated
- [ ] `npm run check` passing

---

## Open Questions

1. **#3 (Preview Architecture):** Colocated demos vs registry pattern?
2. **#4 (Style Prop):** Should internal components (atoms/molecules/organisms) be allowed to accept style prop, or should ALL design system components block it?
3. **#5 (Auto-Registration):** Auto-discovery vs explicit registration?

---

## Notes

- Keep 80-char line length limit (works well for agent verbosity control)
- Focus on scalability - patterns should work for 1000+ components
- Avoid one-off exemptions - solve architecturally
