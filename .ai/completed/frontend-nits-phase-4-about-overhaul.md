# Phase 4 — About page overhaul

Status: ✅ DONE (2026-07-09) — all checks green. `scripts/optimize-images.ts`
(new, reusable) shipped with `sharp`; the 3 source JPGs (~39MB total)
produced `public/img/ian-{1,2,3}.webp` at 139KB/45KB/66KB. Photos are
hardcoded paths in `About.tsx`, not routed through `AboutData` (left as the
plan's own open call, not revisited).

Part of `.ai/plans/frontend-nits-epic.md`. Covers frontend-nits.md items
#14, #15. Depends on Phase 1 (item #16's `HobbyData.role` field and the
Bootcamp Instructor migration land first, since this phase reworks the same
rows).

## Problem statement

Two changes to `About.tsx`, both structural rather than tuning:

1. Preload and place three existing photos (`public/img/Ian-1.jpg`,
   `Ian-2.jpg`, `Ian-3.jpg` — confirmed present) through the page: Ian-1
   large at the top, Ian-2 mid-page, Ian-3 near the end. Preload should
   start "as soon as someone lands on my website" — i.e. on any route, not
   only when `/about` mounts.
2. Restructure the page into a stacked sticky-header layout: "About" pins
   at the top, then as the reader scrolls into hobbies, "hobbies" pins
   below it; scrolling into volunteering, that heading pins below that.
   The "links" heading is removed; the links row itself becomes a
   permanently bottom-pinned bar (never scrolls out of view). Every link/
   icon button on the page uses the `chisel` variant.

## Files to change and why

- **Prerequisite, blocking**: `public/img/Ian-1.jpg` / `Ian-2.jpg` /
  `Ian-3.jpg` are 14MB / 13MB / 12MB (~39MB total) — confirmed via `ls -la`,
  15-45x larger than anything else in `public/img` (next-largest existing
  image is 835KB). Decided (Ian 2026-07-09): build a reusable image
  optimization script and commit it to the repo (Ian expects to add more
  images and re-run this regularly, not a one-off fix). Output format:
  **WebP** — universally supported in evergreen browsers (no legacy IE/
  Safari-vintage concerns on this site), good compression at high quality,
  and simpler tooling than AVIF's slower encode step for a script that'll
  run often. All three source photos share one aspect ratio per Ian, so
  the script needs one width parameter, not per-image cropping.
- New file `scripts/optimize-images.ts` (or `.mjs`) — a small CLI script
  using `sharp` (new devDependency — not currently in `package.json`) that
  takes an input path, output path, and max-width, resizes preserving
  aspect ratio, and re-encodes to WebP at a sensible quality (~80-82,
  visually lossless at typical display sizes, worth eyeballing once
  against the source). Run it as `npx tsx scripts/optimize-images.ts
public/img/Ian-1.jpg public/img/ian-1.webp 1280` for each of the three
  (1280px covers the large top placement at 2x pixel density inside
  `.skeu-about__column`'s `max-width: 40rem`/640px, per `_pages.scss:54`;
  the mid-page and end placements likely render smaller, so could reuse
  the same 1280px export or a second smaller one — worth deciding once the
  actual in-page sizing is chosen). Add an `optimize-images` entry to
  `package.json`'s `scripts` so this is a documented, repeatable command,
  not a one-off invocation Ian has to remember.
- `index.html` — item #14 (preload): add `<link rel="preload" as="image"
href="/img/ian-1.webp">` (and -2/-3, the new `.webp` outputs, not the
  original `.jpg` sources) in `<head>`, so the browser starts fetching on
  first paint of any route, before `/about` is ever visited. This is the
  standard mechanism for "preload before the user needs it" and needs no
  JS. Depends on the optimize-images step above landing first.
- `src/pages/About.tsx` — reference the new `/img/ian-*.webp` paths, not
  the original `.jpg` files.
- `src/pages/About.tsx` — item #14: place the three `<img>` tags at top/
  middle/end of the content flow, referencing `/img/Ian-*.jpg` directly
  (these are fixed structural images for this one page, not repeatable
  portfolio content, so they don't need to route through `AboutData` in
  `data.ts` — flag this call during implementation in case Ian wants them
  data-driven instead, e.g. for easy replacement later). Note `AboutData`
  already has an unused optional `photo?: string` field with a live
  conditional render in `About.tsx` today (`aboutData.photo !== undefined
&& <img>`) that's simply never populated in `data.ts` — worth
  considering whether to consolidate on that existing slot (extended to 3
  fields) rather than adding a second, parallel hardcoded-path mechanism.
- `src/pages/About.tsx` — item #15: replace the single flat `Stack` with
  three stacked sections, each an `Heading` + its content, using CSS
  `position: sticky` with cumulative `top` offsets so About's heading pins
  first, Hobbies' heading pins beneath it once reached, and Volunteering's
  heading pins beneath both. The links section drops its `Heading level={2}`
  entirely; its `Stack` becomes `position: fixed` (not sticky — it must
  never scroll, unlike the section headers) pinned to the viewport bottom,
  matching the existing fixed-chrome pattern already used by
  `CookieConsent` (`position: fixed; bottom: var(--space-md)`).
- `src/styles/components/_pages.scss` — new/updated `.skeu-about__*`
  classes for the sticky header offsets and the fixed links bar (width,
  z-index relative to `CookieConsent`'s 900 and the cursor/texture layers'
  2000-2200, backdrop so pinned headers don't show scrolling content
  bleeding through illegibly).
- `src/pages/About.tsx` — item #15 (chisel sweep): `HobbyRow`'s instagram/
  website buttons are both currently `variant="ghost"` (`About.tsx:27,36`);
  the external links bar is already `variant="chisel"` (`About.tsx:93`) —
  the inconsistency is page-wide (HobbyRow vs. links bar), not within
  HobbyRow itself. Audit every `Button` on this page and set
  `variant="chisel"`.

## Approach and architectural reasoning

`About.tsx` is not wrapped by `ScrollArea` (unlike Home's `home-scroll`
pattern) — it relies on normal document/body scroll with
`min-height: 100vh` on `.skeu-about`. Confirmed this composes cleanly with
`position: sticky`: `RouteTransitions` uses the native View Transitions API
(a one-shot snapshot on navigation), not a persistent transformed wrapper,
so there's no transformed ancestor that would break `sticky`'s containing
block during normal scrolling. This means the sticky-stack approach can be
built directly against the existing page structure — no `ScrollArea`
migration needed first.

Three independently-pinning headers is the trickiest part: each section's
sticky `top` offset must equal the total height of every section pinned
above it, and that height changes if content reflows (responsive font
sizes, mobile breakpoint). Compute offsets with CSS custom properties set
per breakpoint rather than hardcoded pixel `top` values, so the stack
doesn't silently misalign at mobile widths.

## Risks / tradeoffs

- This is the largest phase in the epic — a real layout redesign, not a
  tweak. Worth a quick prototype pass in the dev server before considering
  the SCSS final, since sticky-stack offsets are easy to get subtly wrong
  (overlap, gaps, or a header that pins too early/late).
- Fixed bottom links bar + mobile: the mobile hamburger nav already claims
  the bottom-right corner (per `CookieConsent`'s existing mobile carve-out
  comment in `_organisms.scss`) — the new fixed links bar needs its own
  mobile placement check so it doesn't collide with existing fixed chrome.
- **Confirmed, not hypothetical**: `ls -la public/img/Ian-*.jpg` shows
  14MB/13MB/12MB source files (~39MB total). Preloading these as-is on
  every route (including the splash) is a severe bandwidth problem — the
  `optimize-images` script (see file entry above) resolves this by
  shipping resized WebP output instead of the raw source files. Keep the
  original `.jpg` sources in `public/img` (or move them out of the built
  site's `public/` root if they shouldn't ship at all) once the `.webp`
  exports are wired up, so the 39MB of originals don't end up in the
  deployed build by accident.
- Adding `sharp` as a devDependency: it's a native-binding package (real
  compiled binary per platform) — confirm `npm install` picks the right
  prebuilt binary in CI/deploy environment, not just locally, before
  relying on the script in any automated step. Manual local runs (as
  planned here) sidestep this entirely.
- Removing the "links" `Heading` changes the page's heading hierarchy —
  confirm this doesn't trip the `semantic-html` drift check (it shouldn't,
  since it's a removal, not a raw `<h*>`, but worth a `npm run check` early
  in this phase rather than only at the end).

## Verification checklist

- `npm run check` (13 drift checks, including `semantic-html`)
- `npm test`, `npm run build`
- Manual: `npm run dev -- --port 3001` — confirm preload fires on `/`
  (Network tab), scroll through `/about` and confirm each header pins in
  sequence without overlap, confirm the links bar stays fixed at every
  scroll position, confirm on a mobile viewport width there's no collision
  with the hamburger nav or cookie consent banner, confirm every link/icon
  button on the page is visually `chisel`.
