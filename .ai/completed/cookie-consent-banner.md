# Cookie consent banner

Status: IMPLEMENTED, pending Ian's visual confirmation. Peer reviewed, gap
folded in, dismiss-semantics question resolved (dismiss = decline). One
design change beyond the original plan: `CookieConsent` ended up a
_controlled_ component (`visible`/`onAccept`/`onDecline` props, state owned
by `App.tsx` via `useCookieConsent()`) rather than self-managing — matches
this repo's existing `ContactModal` pattern, and was necessary so the admin
preview demo doesn't mount a second live instance fighting over the same
localStorage key and screen position as the real one. `npm run check` /
`build` / `test` all green.

## Confirmed by peer review

- `initAnalytics()` is called unconditionally from `src/main.tsx:19`,
  immediately post-render — genuinely lazy (dynamic `import`), genuinely
  ungated. Greenfield, no existing consent mechanism to reuse or duplicate
  (grepped `src/` for "consent": zero hits)
- Separate `cookie-consent:v1` localStorage key confirmed safe — `design:v1`
  is written only by `src/pages/admin/designStorage.ts`, no shape/naming
  overlap
- `index.html`'s inline flash script only reads `design:v1` and touches
  `document.documentElement.style` pre-hydration — no awareness of consent,
  cannot be affected by a post-hydration React-rendered banner

## Problem statement

Firebase Hosting + Analytics (`src/analytics.ts`, lazy-loaded post-hydration
per `CLAUDE.md`) collects visitor data on the free plan. No consent banner
exists. Needs a simple accept/dismiss banner that gates analytics loading
on consent, not just a cosmetic notice.

## Files to change and why

- **`src/components/organisms/CookieConsent.tsx`** (new) — banner UI:
  message, accept button (chisel/solid variant per Ian's stated preference),
  dismiss. Uses existing `Button`/`Card` atoms, no new tokens needed
- **`src/hooks/cookieConsent.ts`** (new, not `useCookieConsent.ts` — see
  below) — plain exported functions (`getCookieConsent()`,
  `setCookieConsent()`) reading/writing the `cookie-consent:v1` localStorage
  key, plus a thin `useCookieConsent()` React hook wrapper for the banner
  component. Plain functions matter because `src/analytics.ts` is invoked
  from `main.tsx` outside the React tree (peer review caught this — a
  hook-only implementation would leave `analytics.ts` unable to read
  consent). Mirrors how `designStorage.ts` is a plain module, not a hook
- **`src/analytics.ts`** — gate the lazy Firebase Analytics import behind
  `getCookieConsent()` instead of loading unconditionally post-hydration
- **`src/App.tsx`** — render `CookieConsent` at the app root, above
  `Routes`, so it persists across every page
- **`src/pages/admin/preview/OrganismsSection.tsx`** — demo entry (required
  by `demo-missing` drift check)

## Approach and architectural reasoning

Gating analytics on consent (not just showing a banner while analytics
loads regardless) is the actual point of a consent banner — a banner that
doesn't affect loading is decorative. Separate localStorage key from
`design:v1` because consent and design preferences are unrelated concerns
with different persistence lifecycles (one is a legal/privacy signal, the
other is cosmetic).

## Confirmed by Ian

Dismiss (closing without clicking accept) counts as a hard decline: no
analytics loads, banner doesn't reappear. Stored as an explicit
`'declined'` state in `cookie-consent:v1`, not just absence of `'accepted'`
— so a future visit doesn't re-show it.

## Risks / tradeoffs

- If a visitor already granted implicit consent by using the site before
  this ships, there's no migration path back to ask again — acceptable,
  not retroactively enforceable
- Banner needs to not block first paint or interfere with the existing
  `index.html` flash-script/snapshot replay — confirm it renders after
  hydration, not inline in `index.html`

## Verification checklist

- `npm run check`, `npm run build`, `npm test`
- Manual check: analytics network request does not fire before consent is
  granted (dev tools network tab, not just code review)
- Ian's visual pass: banner appearance, accept/dismiss behavior, persistence
  across reload
