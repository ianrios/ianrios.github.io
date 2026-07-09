# WORK.md

Current phase, priorities, and open questions ONLY. Completed work is
recorded by git history, `.ai/completed/`, and epic files — never here.
If a section here could be summarized, replace it with the summary.

## Current phase

Portfolio V2 epic + Ian's review-follow-ups round both COMPLETE and
reviewed-good 2026-07-08/09 (`.ai/completed/portfolio-v2-followups.md`
lists every change and the 3 deferred items). Ian is now testing the live
dev build and will fold new findings into a FRESH session. Epics proceed
autonomously (Ian, 2026-07-07): bring genuine decision gaps, not approval
check-ins.

## Priorities (Ian's order)

1. **Deploy** — everything green (13 drift checks, 106 tests, build);
   first paint is High Contrast. Ian reviews, then `npm run deploy`. Not
   redeployed since the platform remediation.
2. **Deferred V2 follow-ups** (Ian to confirm before building): FunPanel
   on About; theme interpolation dial (`.ai/specs/theme-ideas.md`);
   master-scale UI inside the FULL design-system panel. See the followups
   file's DEFERRED note.
3. **Pending Ian, not yet spec'd:** Atrix bullets/companyUrl, Petal +
   Cortex project write-ups (stubs live in `data.ts`).
4. **ImageBox** — not started. `.ai/specs/imagebox-epic.md`.
5. **Backlog specs** (unscheduled): theme-ideas, resume-page, font-picker,
   design-library-extraction, metaballs-overhaul, webgl-effects — in
   `.ai/specs/`.

## Not in scope

- Playwright / e2e tests
- Backend or API of any kind
- Paid services

## Open questions

- Pan-direction map: About = up, Contact = down (below home). Ian may
  re-map after feeling it out (`src/pages/navDirection.ts`).
- "title" nav item returns to the MetaBalls splash (agent proposal) —
  confirm this reads well vs. a plain /metaballs destination.
- FunPanel concept lives on portfolio only; extend to About once Ian
  confirms it feels right.
