# Phase 2.6: Quality & Tooling Improvements

**Status:** Planning  
**Epic:** Portfolio v2 Overhaul  
**Dependencies:** Phase 2.5 (Layout Primitives)  
**Estimated Effort:** Medium (2-3 sessions)

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

**A. Add JSDoc Documentation:**
```typescript
/**
 * Stack layout primitive.
 * 
 * @remarks
 * This component blocks the `style` prop to enforce design system purity.
 * Consumers must use named props (padding, height, etc.) instead of inline styles.
 * This ensures the design system can be extracted as a pure React library
 * without requiring SCSS knowledge.
 */
export function Stack({ ... }: StackProps) { ... }
```

**B. Add Drift Check:**
```typescript
// checkStylePropBlocking(componentFiles: string[]): string[]
// Scans all exported components in atoms/molecules/organisms
// Verifies each uses Omit<..., 'style'> in type definition
// Flags any component that allows style prop
```

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

**Proposed Solution:**

**Option A: Convention-Based Auto-Discovery**
```typescript
// drift-checks.ts exports all checks with prefix
export function checkTokenSync(...) { ... }
export function checkLayoutClassNames(...) { ... }

// validate.ts auto-discovers
const checks = Object.entries(driftChecks)
  .filter(([name]) => name.startsWith('check'))
  .map(([name, fn]) => [name.replace('check', '').toLowerCase(), fn]);
```

**Option B: Explicit Registration**
```typescript
// drift-checks.ts
const CHECKS = new Map<string, CheckFunction>();
export function registerCheck(name: string, fn: CheckFunction) {
  CHECKS.set(name, fn);
}

registerCheck('token-sync', checkTokenSync);
registerCheck('layout-classnames', checkLayoutClassNames);
```

**Recommendation:** Option A (auto-discovery)
- Less boilerplate
- Impossible to forget registration
- TypeScript ensures type safety

---

### 6. Fix ProjectsView Fast Refresh Warning

**Current Issue:**
```typescript
// ProjectsView.tsx exports both component AND constant
export const skills: SkillTuple[] = ...;  // ← triggers warning
export function ProjectsView() { ... }
```

**Proposed Solution:**
Move `skills` to separate file:
```typescript
// src/pages/home/projectsData.ts
export const skills: SkillTuple[] = ...;

// ProjectsView.tsx
import { skills } from './projectsData';
export function ProjectsView() { ... }

// Home.tsx
export { skills } from './home/projectsData';
```

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
