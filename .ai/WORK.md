# WORK.md

Current phase, priorities, and open questions ONLY. Completed work is
recorded by git history, `.ai/completed/`, and epic files — never here.
If a section here could be summarized, replace it with the summary.

## Current phase

Portfolio V2 epic — ALL PHASES CODE-COMPLETE 2026-07-08 (statuses:
`.ai/plans/portfolio-v2-epic.md`). Awaiting Ian's visual pass (desktop +
mobile) and deploy. Epics proceed autonomously (Ian, 2026-07-07): bring
him genuine decision gaps, not approval check-ins.

## Priorities (Ian's order)

1. **Deploy** — everything green; first paint is High Contrast. Ian
   reviews visually, then `npm run deploy`. Not redeployed since the
   platform remediation.
2. **Portfolio V2 epic** — active. Next phase: see the epic file.
3. **Pending Ian, not yet spec'd:** Atrix bullets/companyUrl, Petal +
   Cortex project write-ups (stubs live in `data.ts`).
4. **ImageBox** — not started. `.ai/specs/imagebox-epic.md`.
5. **Backlog specs** (unscheduled): theme-ideas, resume-page, font-picker,
   design-library-extraction, metaballs-overhaul — all in `.ai/specs/`.

## Not in scope

- Playwright / e2e tests
- Backend or API of any kind
- Paid services

## Open questions

- Pan-direction map shipped with About = up (agent default,
  `src/pages/navDirection.ts`) — Ian may re-map after feeling it out.
- `PortfolioSidebar` has no live consumer since the mobile rebuild
  (library organism with demo only) — keep in the library or retire?
