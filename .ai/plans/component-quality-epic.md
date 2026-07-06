# Epic: Component Quality & React Correctness

Status: APPROVED 2026-07-06 (decisions: skills sort most-used first; Accordion
props `autoClose` default true + `defaultOpen`). Findings referenced as F# from
`.ai/specs/platform-review-findings.md`.

Problem: a handful of real React defects (side effects in render, prop
mutation, impure updaters), a11y gaps, WET structure (duplicate navs,
hand-rolled disclosure state in 5+ places), content logic baked into
components, and zero component tests (F16–F27, F14, F33, F29's BUGS.md items).

Phases are independent of the design-system epic except where noted; each gets
a sub-plan + peer review + approval.

## Phase 1 — Render purity + dead code

Resolves F16–F20 (small, high-confidence fixes).

- Home: replace `titleSelector()` with a pure heading lookup; move
  `scrollIntoView` into the `setPage` handler; delete the dead
  `#three-container` effect.
- PortfolioSidebar: sort a copy of `skills` (`toSorted`), direction per Ian
  (open question 7).
- PushPanel: move `onOpenChange` out of the state updater.
- Delete `MetaBalls.tsx`; WelcomeView renders `ThreeScene` directly and drops
  the redundant Enter `onKeyDown`.

Files: `Home.tsx`, `PortfolioSidebar.tsx`, `PushPanel.tsx`, `WelcomeView.tsx`,
`MetaBalls.tsx` (delete).

## Phase 2 — Disclosure hook + Accordion API + a11y

Resolves F14, F22. Gated on open question 9 (prop names).

- New `useDisclosure`/`useDisclosureGroup` hook (mechanism); `Accordion` gains
  `autoClose?: boolean` (default true) + `defaultOpen?: string[]` (policy);
  adopt in `SidebarSection`, `NavVerticalSections`, `ExpandableCard`,
  masonry tools toggle, and PortfolioSidebar's external-links toggle (renaming
  the `ul` state while there).
- A11y in the same pass (same files): `aria-expanded`/`aria-controls` on all
  disclosure triggers; ExpandableCard becomes a real `<button>` header (no
  nested-interactive, Space handled natively); FormField `htmlFor`/`id`
  (generated via `useId`); fix `alt={item.body}`; ContactModal Escape-to-close.

Files: new hook, `Accordion.tsx`, `TokenControls.tsx`,
`NavVerticalSections.tsx`, `ExpandableCard.tsx`, `masonry-card.tsx`,
`FormField.tsx`, `ContactModal.tsx`, `PortfolioSidebar.tsx`, `Home.tsx`,
`_components.scss` (header button styles).

## Phase 3 — Structure, dedup, data-driven content

Resolves F23–F26 (component halves), F11's blind spot.

- `mv masonry-card.tsx` → `organisms/MasonryCard.tsx`; named export; type it
  with the `types/data.ts` union; add its OrganismsSection demo (closing the
  `demo-missing` blind spot); `[demo-missing]` also scans `components/` root so
  strays can't hide again.
- Data-driven card links: `info?: string` field in `data.ts` replaces the
  `item.title === 'Meta Spheres'` special case; PortfolioSidebar external links
  move to `data.ts`.
- Merge `NavBar`/`NavVertical` shared logic (one nav core, two layouts — not a
  god component); kill `href="#demo"`; demo fixture defaults move from
  `CardWithDropdown` into `adminData.ts`; delete `MixedProjectGrid`'s inline
  fallback copy duplicating `V2_PROJECTS` (F46).
- Type `Icon` names as a union of the two maps' keys; stable keys instead of
  index keys in Home/masonry-card.
- Preview links `/admin` → `/design-system`; `view`/`page` become unions.

Files: `masonry-card.tsx` (move), `data.ts`, `types/data.ts`,
`PortfolioSidebar.tsx`, `NavBar.tsx`, `NavVertical.tsx`,
`CardWithDropdown.tsx`, `MixedProjectGrid.tsx`, `adminData.ts`, `Icon.tsx`,
`icon-map.ts`, `Home.tsx`, preview sections, `validate.ts`.

## Phase 4 — Route splitting, ThreeScene disposal, resilience

Resolves F21, F29 + BUGS.md's error-boundary/404 items.

- `React.lazy` for `/three` and `/design-system` (three.js and the admin tree
  leave the 820 kB entry chunk); Suspense fallback styled with tokens.
- ThreeScene cleanup disposes MarchingCubes geometry + material.
- Catch-all 404 route; top-level error boundary.
- Update BUGS.md.

Files: `App.tsx`, `ThreeScene.tsx`, new `NotFound`/`ErrorBoundary`,
`.ai/BUGS.md`.

## Phase 5 — Component test baseline

Resolves F33. Depends on Phases 1–4 AND design-system epic Phases 1+5 landing
(the provider and stored-key filtering are what these tests exercise) — this is
the last phase across all three epics.

- Testing Library specs for: Button (both arms, disabled, icon-only a11y),
  Accordion (autoClose/defaultOpen), useDesignVars via provider (stored-key
  filtering, theme apply, reset), detectMatchingPreset, PushPanel
  (onOpenChange single-fire).
- `npm run coverage` script (tooling already installed); no threshold gate yet —
  Ian decides after seeing the first report.

Files: new `*.test.tsx` colocated per existing convention, `package.json`.

## Risks

- Phase 2/3 change public-page markup — visual review required.
- Nav merge risks over-abstraction; sub-plan must show the merged API before
  code (rule: two layouts, zero behavior flags beyond `variant`).

## Verification (every phase)

`npm run check` + `npm run build` + `npm test`; manual keyboard-only pass on
`/` and `/design-system` for Phase 2; bundle sizes in build output for Phase 4.
