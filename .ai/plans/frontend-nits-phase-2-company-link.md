# Phase 2 — Company-link icon button

Part of `.ai/plans/frontend-nits-epic.md`. Covers frontend-nits.md item #6.
Independent of every other phase.

## Problem statement

Each job's "company site" link currently renders as a full-width text
`Button` (`variant="surface"`, label "company site") below the bullet list.
Item #6 wants it as a chisel icon button living inline, to the right of the
company/period meta line, for every job that has a `companyUrl`.

## Files to change and why

- `src/pages/home/ExperienceView.tsx` — `JobEntry`'s `Stack direction="col"`
  currently renders `Heading` (title) → `Text` (company · period) →
  `BulletList` → `Button` (company site) in sequence. Restructure the
  company/period line into a `Stack direction="row" justify="between"
align="center"` containing the existing `Text` meta on the left and the
  new icon button on the right when `job.companyUrl` is defined. Icon
  button: `as="link"`, `href={job.companyUrl}`, `external`, `variant=
"chisel"`, `icon="external"` (same icon already used for links in
  `About.tsx`), `aria-label` naming the company (e.g. `${job.company}
website`) since an icon-only button needs an accessible name.

## Approach and architectural reasoning

No new component or token — this reuses the existing `Button` atom's
`chisel` variant and `icon` prop, which already exist in the design system
(`CLAUDE.md`'s Button description lists `chisel` among the variants). Purely
a JobEntry markup change.

## Risks / tradeoffs

- Atrix's `companyUrl` is not yet populated (`.ai/WORK.md` "Pending Ian, not
  yet spec'd"), so that job simply renders without the icon button until
  that data lands — expected, not a blocker.
- Icon-only buttons need `aria-label`; omitting it would be an accessibility
  regression against the current (labeled) text button.

## Verification checklist

- `npm run check`, `npm test`, `npm run build`
- Manual: confirm every job with a `companyUrl` shows the chisel icon
  button beside its company/period line, and it opens in a new tab.
