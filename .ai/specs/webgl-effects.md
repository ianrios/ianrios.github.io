# Spec: WebGL hover + shader effects (backlog)

The unbuilt remainder of original overhaul item 5 ("textures and filters
leveraging webgl and three.js... hover effects, moving background and
foreground textures"). V2 Phase 6 shipped the CSS-budget slice: cursor
trail ring + film-grain overlay with pointer parallax, both as editable
`effects` registry tokens.

## Why deferred

three.js is lazy-loaded per route on purpose (entry chunk went 820 kB to
~230 kB in the Component epic). Site-wide WebGL hover effects would pull
it (or a shader runtime) into the entry path, or require a second
lightweight GL pipeline. That tradeoff needs its own design, not a rider
on a phase.

## Candidate scope (when picked up)

- Shader-displacement hover on masonry card images (classic WebGL
  image-hover distortion)
- Pointer-reactive background field on the splash beyond MetaBalls (see
  `.ai/specs/metaballs-overhaul.md` for the pixel-morph idea; keep the
  two specs coordinated)
- A tiny standalone WebGL canvas layer (no three.js) for foreground
  texture motion, tokenized like the Phase 6 effects
- Every effect must be an `effects`-category registry token with a
  control + live demo, and must respect reduced motion

## Constraints

- Entry chunk must not grow materially; measure with `npm run build`
- Effects are progressive enhancement only: no content or nav may depend
  on WebGL availability
