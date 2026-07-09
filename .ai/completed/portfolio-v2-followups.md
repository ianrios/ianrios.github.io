# V2 follow-ups — Ian's full review findings (2026-07-08, pre-deploy)

Status: ✅ COMPLETE — reviewed good by Ian 2026-07-08/09 (13 drift checks,
106 tests, build all green). Three W3 items deferred (see W3 line + the
`.ai/WORK.md` priorities). Ian folds new test findings into a fresh
session. Summary of what shipped:

- W1 (IA/nav/content) DONE: hobbies folded into About; nav renamed
  portfolio/about/contact/design-system/title (title returns to splash);
  Contact is a page at /contact (below home); external links + confident
  closing on About; codewars->ianriosbuilt; Meta Spheres->Marching Cubes;
  PortfolioSidebar + ContactModal + OrgCombinations deleted; chisel nav.
- W2 (experience/projects) DONE: phase-grouped Accordion (Senior open,
  single-disclosure JobEntry with bullets shown); BulletList molecule
  extracted + demoed; projects tools-dropdown + skills-cloud removed;
  MasonryCard narrowed to ProjectData; tools ToolsMap + dead types purged.
- W5 (effects) DONE: 4 tokens - --cursor-size (instant custom cursor,
  hides native), --cursor-trail (eased), --texture-opacity (static grain),
  --texture-reactivity (grain blob eases to pointer); all 9 themes set;
  reworked CursorFX/TextureOverlay.
- W6 DONE: chisel nav buttons (folded into W1); TODO sweep was already clean.
- W4 (library repair) IN PROGRESS: root cause found - Bob's ffe106c cull
  deleted ~637 lines of working control/preset/specimen/pushpanel SCSS
  from \_admin-preview.scss (restoring from e0c0677 via subagent). DONE
  inline: Select atom (item 14, replaces raw theme <select>); Bevel empty
  section folded into Depth (16); font-weight tokens now drive h1-h6 +
  titles (18); component dedup (20, via OrgCombinations deletion in W1).
- W3 (design panel) PARTIAL. DONE: shared DesignPanel context (open +
  revealed) fixes the "panel disappears/reappears on nav" bug and
  persists open state across routes; design-system opens by default (via
  provider init + the design nav link); PushPanel gained controlled
  open/revealed props. FunPanel (theme picker + Depth/Roundness/Tempo/
  Type-scale master dials, each driving several tokens) is live on the
  portfolio push-panel; the full per-token TokenSidebar stays on
  /design-system. DEFERRED (documented, Ian to confirm concept first):
  FunPanel on About (needs About's layout wrapped in the 100vh flex +
  ScrollArea pattern like Home); theme interpolation dial (now in
  `.ai/specs/theme-ideas.md`); item 13 master-scale UI inside the FULL
  panel (the FunPanel masters already prove the pattern).

Deploy after Ian's final pass. Site verdict: "looking AMAZING".

## W1 - IA / navigation / content

1. Merge Hobbies INTO About: hobbies leave the Home tabs (experience +
   projects remain); About gains the hobbies list. Nav item stays
   "about".
2. Rename nav "home" -> "portfolio".
3. "metaballs" nav item + "Meta Spheres" project title are lame. AGENT
   PROPOSAL (Ian steers): nav item becomes "title screen" and navigates
   to `/` with `{view: 'welcome'}` (the "close back out to the title
   page" idea - game-menu vibe fits the Win95 language); the project
   card renames to "Marching Cubes" and keeps linking to `/metaballs`
   (route path unchanged - Ian picked it himself).
4. Remove the "external" dropdown from the floating nav; external links
   render as a links section at the bottom of About. Remove codewars;
   add https://github.com/ianriosbuilt (label "built github").
5. Contact becomes a PAGE at `/contact`, positioned BELOW home on the
   papers table (`{x: 0, y: 1}` - matches the original spatial notes).
   No more modal from the nav: nav item links to /contact. ContactModal
   organism: retire from the library (page owns an iframe/form section).
6. DELETE PortfolioSidebar (component, demo, styles, its OrgCombinations
   usage - rework that combo).
7. About closing copy is APOLOGETIC - rewrite confident. Ian's framing:
   his job IS orchestrating agents - minimal tokens, fresh context, no
   compaction; he builds the tools and workflows to do it smartly.
   Nobody is pretending anything.

## W2 - Experience + projects presentation

8. Experience: phase GROUPS become the accordions - Senior Engineer
   expanded by default; SE II / Early career / Research collapsed.
   Jobs inside a group stay expandable cards. (Today each job is its own
   accordion with no grouping behavior - wrong grain.)
9. The ExpandableCard bullet treatment (left accent bar) is not a
   library primitive - extract a demoed molecule (BulletList) so the
   pattern is reusable/showcased. Ian is open to a better real-world
   pattern for resume content inside the card - propose in the library.
10. Projects: remove the per-card "tools used" disclosure AND the "all
    skills" cloud at the top. Tools stay in data.

## W3 - Design panel behavior + fun controls

11. The design PushPanel's open state must persist across route changes
    (portfolio/about/design-system all mount it; today About has none
    and Home replays its reveal animation every mount). Landing on
    /design-system opens it by default; elsewhere it defaults closed
    but remembers the user's choice. One shared persisted open state.
12. Two-tier controls: FULL control set only on /design-system. On
    portfolio/about, a minimal FUN panel of dramatic master toggles for
    non-designers. AGENT PROPOSAL: theme picker; THEME INTERPOLATION
    DIAL (from theme-ideas spec - blend numerics+colors between two
    themes); "depth" master (flat <-> deep bevel: distance/blur/
    intensity together); "roundness" master (all radii); "tempo" master
    (both anim speeds); "type scale" master (all font sizes by ratio);
    grain + cursor effect toggles.
13. Full DS panel: add master-scale affordances for typography AND
    spacing (scale-all-by-ratio UI controls driving the individual
    tokens - not new registry tokens).

## W4 - Design library repair (regressions + gaps)

14. Theme selector is raw HTML <select> - needs a design-system Select
    (new atom or styled control) that blends with the system.
15. Color controls "used to look good, now broken / not inline" -
    investigate TokenControls/ColorPicker row layout regression.
16. Bevel sidebar section has no controls (just prose) - remove or fold
    the note into Depth.
17. TokensSection shows text only - color swatches must show the actual
    color next to the hex; radii and bevel need visual examples; the
    animation-speed examples disappeared; layout tokens (component
    scale, overlay scrim, etc.) need examples. Something was lost in a
    refactor - rebuild specimens.
18. --font-weight-base / --font-weight-heading appear to do NOTHING -
    suspect `_base.scss` h1-h6 { font-weight: 600 } and missing body
    weight wiring override the vars. Fix consumers.
19. DSPreview tier-nav buttons (Tokens/Atoms/...) gap is not adjustable
    by any control - find the hardcoded gap.
20. Components double-appear across tabs (CookieConsent, ContactModal
    in Organisms AND patterns/combinations) - audit all tabs, dedupe.
21. PushPanel demos lack a minimum height - render broken/ugly.
22. Controls pushpanel overall "feels very broken" - general layout QA
    pass on the sidebar.

## W5 - Effects overhaul (cursor + texture in tandem)

23. Cursor ring is TOO SLOW and the native cursor still shows - the
    ring should move at real mouse speed and the native cursor hides
    while a custom cursor is active (only one visible).
24. Texture too subtle + should react to the pointer: intensify/morph
    the grain in a pixel radius around the cursor, relaxing a few
    moments after it leaves. The CURRENT slow cursor-follow speed is
    exactly right for the texture's reaction lag.
25. Goal state: custom cursor + cursor trail + page texture + pointer
    texture-morph can ALL be on at once (each its own effects token).

## W6 - Repo hygiene

26. Sweep ALL TODO comments in code and fix them. DONE/N-A: no TODO/FIXME
    in src or scripts (the two in App.tsx were removed in the Phase 8
    route refactor). Only false positive is a package-lock integrity
    hash.
27. FloatingNav buttons -> chisel variant.

## Notes

- About panning up: confirmed good.
- Deploy AFTER Ian's final pass (he wants to check mobile on the live
  site).
