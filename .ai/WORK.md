# WORK.md

## Current phase

Platform review remediation — **complete as of 2026-07-07.** The full-repo
audit (`.ai/specs/platform-review-findings.md`, all findings RESOLVED) was
fixed via three epics: Design System Integrity and Component Quality (both in
`.ai/completed/`) and Platform Hygiene (`.ai/plans/platform-hygiene-epic.md`).
What's next is Ian's call (see Pending). Site not yet redeployed after the
remediation: `npm run deploy` (now gated) publishes it.

## Active priorities (in order)

### Pending (Ian's call)

1. **Deploy** — everything green; first paint is now the High Contrast theme.
   Ian reviews visually, then `npm run deploy`.
2. **Portfolio content** — add latest work experience and projects to
   `src/data.ts` (requires Ian to supply content).
3. **V2 design exploration** — `.ai/specs/portfolio-overhaul.md`; the
   "Sample Co" card in V2Preview is placeholder until this happens.
4. **ImageBox** — not started. See `.ai/specs/imagebox-epic.md`.
5. **Theme ideas backlog** — `.ai/specs/theme-ideas.md` (random theme per
   visitor, scroll-driven swap, interpolation dial).

## Recently completed (2026-07-06 / 07)

- **Platform review** — audit register with 46 findings + direct answers to
  Ian's review questions; all resolved.
- **Design System Integrity epic (7 phases)** — semantic persistence
  (`design:v1` theme + overrides + snapshot; clean visits persist nothing;
  legacy migration), programmatic `DEFAULT_THEME` = High Contrast with the
  tenth drift check `[default-value-sync]`, three-state link model
  (`--link-primary-color` dropped; primary axis uses `--btn-primary-bg`),
  warm-tone detector removed, single `DesignVarsProvider`, one
  registry-driven `TokenControl` engine, font-family tokens + hardcoded-style
  sweep with a written exemption policy.
- **Component Quality epic (5 phases)** — render purity fixes,
  `useDisclosureGroup` + Accordion `autoClose`/`defaultOpen`, a11y pass
  (aria-expanded everywhere, real button headers, label wiring, Escape
  close), MasonryCard into organisms with demo + typed union, nav dedup via
  `useActiveNav`, typed icon names, lazy routes (entry 820 kB -> ~230 kB),
  404 + error boundary, ThreeScene disposal, component test baseline
  (80 tests, `npm run coverage`).
- **Platform Hygiene epic** — deploy gated on check+test, configs
  type-checked, validate.ts scaffold removed plus explicit data-file
  allowlist, Firebase compat CDN replaced by lazy modular SDK, no-dash copy
  rule swept and written into RULES.md, README rewritten, CONTEXT.md
  corrected, superseded specs archived, settings.json allowlist expanded,
  SCSS split into tier partials with `@use` and its own size budget.

## Not in scope right now

- Playwright / e2e tests
- Backend or API of any kind
- Paid services

## Open questions

- Animations: what should animate on the splash page vs main page?
- Mobile drawer: should it use the design system's `PushPanel` organism or
  stay as-is?
- V2: which spec direction wins? (see `.ai/specs/portfolio-overhaul.md`)
