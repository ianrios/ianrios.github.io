# ImageBox — Epic Spec

**Route:** `/imagebox`  
**Status:** Planning  
**Last updated:** 2026-06-09  
**Entry point:** Project card in the masonry grid on the main portfolio (alongside MetaSpheres and The Algorithm Knows Best)  
**Primary user:** Ian, but publicly accessible to anyone visiting ianrios.me  
**Rendering engine:** PixiJS / WebGL  
**Session persistence:** None — fresh slate on every page load  
**Input formats:** JPG, PNG  
**Output format:** PNG (always)

---

## What It Is

A novel in-browser photo editor where images are manipulated mathematically at the pixel level. Not a filter app — a pixel laboratory. The user uploads images, stacks them in layers, applies mathematical experiments per layer or globally, and downloads the result as a flattened PNG composite.

See `.ai/specs/imagebox-experiments.md` for the full running list of experiments to implement.

---

## Layer System

### Capacity
- 8 layers maximum per session

### Layer stack panel
The layer stack panel is intentionally **wider than a typical photo editor** — all common controls are exposed directly in the panel with no menu diving:

| Control | Type |
|---|---|
| Visibility toggle | Eye open / eye closed icon |
| Opacity | Slider |
| Reorder | Drag handle |
| Black & White | Toggle |
| Invert Colors | Toggle |
| Saturation | Slider |
| Experiment assigned | Label / badge (opens experiment config) |

### How layers interact
- Each layer **only affects the immediately visible layer beneath it** — not all layers below.
- If a layer's eye is closed, it is skipped as both a source and a target.
- "Merge layers" (also called "freeze and flatten") collapses a layer and its target-below into a single rasterized layer, freeing one layer bank slot.

### Export behavior
- **Default export:** Flattened composite PNG of all visible (eye-open) layers in stack order.
- **Export all layers individually:** Option to export each layer as its own PNG file.
- **No visible layers:** Exports a transparent PNG.
- No single-layer export UI needed — the user can solo a layer by toggling all others off.

---

## Experiments

Experiments are mathematical pixel transformations. They can be applied:
- **Per-layer** — each layer has its own experiment (and its own parameter set)
- **Globally** — a global experiment applied to the final composite before export

### MVP Experiments (implement first)
1. **Transparency Checkerboard / Layer Blending** — make every 3rd pixel in a 2×2 group transparent so the layer beneath leaks through
2. **Pixelation Slider (Mosaic)** — group pixels by average color into progressively larger blocks (NOT a blur)

### Full Experiment List
All listed in `.ai/specs/imagebox-experiments.md`. Each will eventually have its own sub-spec when it reaches implementation phase.

### Experiment UI pattern
- Presets (saved parameter configurations)
- Real-time sliders, knobs, and toggles
- All controls update the canvas live with no "apply" button

---

## Canvas & Viewport

### Interaction tools
- Zoom in / out
- Pan
- Rotate
- Skew
- Crop
- Flip horizontal / flip vertical
- Set image dimensions (width × height)
- Set canvas dimensions (independent of image)

### MVP canvas features (ship with Phase 1)
1. **Undo / redo** — full edit history, step backward/forward
2. **Checkerboard background** — standard transparency indicator (toggleable)
3. **Status bar** — shows cursor XY, pixel color under cursor (hex + rgb), zoom %
4. **Rotation snap** — hold shift to snap rotation to 45° increments
5. **Fit to window / 1:1 zoom** — keyboard shortcuts to reset the view

### Deferred canvas features (document, implement later)
- Magic wand / select by color
- Eyedropper / color sampler
- Rulers + drag guides
- History panel (visual list of states)
- Snap to grid

### Selection tool
- **Not in MVP.** All experiments apply to the whole layer.
- When added later: rect/lasso selection to constrain where an experiment applies.

---

## Design System

- Use the existing atomic design library in `/admin` (tokens, atoms, molecules)
- Add new design tokens, atoms, and molecules as needed for ImageBox-specific UI
- Components built for ImageBox should be designed for reuse across the app:
  - The **layer selector** component may be repurposed on the portfolio page to show/hide work categories (experience, projects, hobbies)
  - Knobs, sliders, and toggles should be atomic components reusable anywhere
- Follow the skeuomorphism spec (`src/styles/_tokens.scss`, `src/styles/_components.scss`)
- Do not introduce Bootstrap classes — use SCSS tokens only

---

## Architecture Notes

- New React route: add `/imagebox` to `src/App.js` alongside `/` and `/admin`
- New page file: `src/pages/ImageBox.js` (or `src/pages/Imagebox/index.js` if it grows large)
- PixiJS handles all canvas rendering — raw `ImageData` pixel manipulation runs in PixiJS filters or custom WebGL shaders
- No backend, no API, no auth
- All state is local React state / refs — nothing persists across sessions

---

## Epic Phases

This is an epic. Each phase below is agent-executable and produces a working increment. Phases may spawn their own sub-specs.

---

### Phase 0 — Route & Entry Point
**Goal:** `/imagebox` exists and is reachable. Project card appears in the masonry grid.

Tasks:
- Add `/imagebox` route to `src/App.js`
- Create `src/pages/ImageBox.js` with a placeholder layout (header + empty canvas area + empty layer panel)
- Add ImageBox project card to `src/data.js` (title, description, image, live link pointing to `/imagebox`)
- Verify the card renders in the masonry grid and the route loads

**Agent notes:** No PixiJS yet. Just routing, a stub page, and a data entry. This is the smallest safe starting point.

---

### Phase 1 — Canvas Foundation
**Goal:** User can upload an image and see it rendered on a PixiJS canvas with basic viewport controls.

Tasks:
- Install and configure PixiJS
- Render a PixiJS canvas in the ImageBox page
- Image upload (JPG/PNG only, single image for now)
- Display uploaded image on canvas
- Implement: zoom, pan, checkerboard background, status bar (XY + hex + zoom %), fit-to-window shortcut
- Implement: undo/redo infrastructure (history stack)

**Agent notes:** Do not implement layer system yet. One image, one canvas. Validate that PixiJS renders correctly and pixel data is accessible (needed for experiments in Phase 4+).

---

### Phase 2 — Layer System (Structure)
**Goal:** Layer stack UI exists. User can upload up to 8 images and manage them as layers.

Tasks:
- Build the layer stack panel component (wide panel, all controls visible inline)
- Support up to 8 layers
- Per-layer controls: visibility toggle (eye icon), opacity slider, drag to reorder
- Composite rendering: flatten visible layers in stack order on the PixiJS canvas
- "No visible layers" → render transparent checkerboard only
- Wire export button: flatten visible layers → download as PNG

**Agent notes:** B&W, invert, saturation controls come in Phase 3. Per-layer experiments come in Phase 4. Keep Phase 2 focused on structure and compositing.

---

### Phase 3 — Layer Controls
**Goal:** Each layer has its full set of native controls (no menu diving).

Tasks:
- Add to layer panel per layer: B&W toggle, invert color toggle, saturation slider
- All controls update canvas in real time
- Implement rotation snap (shift key) for canvas rotate tool
- Implement flip horizontal / flip vertical per layer

**Agent notes:** These are all PixiJS filter-level operations. B&W = desaturate filter, invert = invert filter, saturation = color matrix. Rotation snap is a canvas viewport concern, not per-layer.

---

### Phase 4 — First Experiments
**Goal:** Two experiments are fully implemented with real-time controls and presets.

Experiments:
1. **Transparency Checkerboard / Layer Blending** — slider for which pixel in the 2×2 group goes transparent, affects compositing of layer below
2. **Pixelation Mosaic Slider** — groups pixels by average color into blocks; range slider controls block size

Tasks:
- Design experiment UI pattern: preset picker + parameter controls panel
- Implement both experiments as PixiJS filters or custom shader logic
- Wire per-layer experiment assignment (each layer can have one experiment)
- Layer interaction model: experiment on Layer N affects only the nearest visible layer below N
- Implement "Merge layers" / "freeze and flatten" action

**Agent notes:** This phase establishes the experiment architecture that all future experiments plug into. Get the pattern right here — subsequent experiments should slot in with minimal boilerplate. A sub-spec may be needed before implementation.

---

### Phase 5 — Additional Experiments (batch 1)
**Goal:** Implement the next set of experiments from the list.

Experiments (from `.ai/specs/imagebox-experiments.md`):
3. Repeating Pixel Strips (stutter/tile effect — every N pixels duplicates the previous N)
4. Nearest Color Quantization (shift each pixel to nearest color within a pixel radius)
5. Grid Section Averaging (X×Y grid → each cell becomes its average color)

**Agent notes:** Each experiment needs its own sub-spec before implementation begins. Reference the experiment architecture established in Phase 4.

---

### Phase 6 — Additional Experiments (batch 2) + Global Experiment
**Goal:** Remaining experiments implemented. Global experiment layer added.

Experiments:
6. Equation-Based Pixel Manipulation (math expression input drives pixel transforms)
7. Grid Section Extremes (keep only brightest / darkest / highest-contrast pixel per cell)
8. Color Selection/Deletion in Grid Ranges

Global experiment:
- A single experiment applied to the final composite after all layer compositing
- Same experiment UI pattern as per-layer, applied post-flatten

**Agent notes:** The equation-based experiment (6) will likely need its own sub-spec — it requires a safe expression parser (e.g., `math.js`) and real-time evaluation against pixel x/y/r/g/b/a values.

---

### Phase 7 — Export & Upload Polish
**Goal:** Full export options and multi-image upload flow.

Tasks:
- Export all layers individually (zip download or sequential downloads)
- Upload multiple images at once → auto-populate layer stack
- Drag-and-drop upload
- Canvas dimensions control (set width/height independently of image)
- Image dimensions control per layer

---

### Phase 8 — Deferred Canvas Tools
**Goal:** Fill in the canvas features deferred from MVP.

Tasks:
- Eyedropper / color sampler
- Magic wand / select by color (with tolerance slider)
- Rect + lasso selection tools
- Apply experiment to selection only (not whole layer)
- Rulers + drag guides
- Snap to grid
- History panel (visual list of undoable states)

---

### Phase 9 — Polish & Presets
**Goal:** Production-ready feel.

Tasks:
- Keyboard shortcuts map (document and implement)
- Presets system: save and load named parameter configurations per experiment
- Performance audit (large images, 8 layers, real-time filters)
- Mobile consideration (at minimum: renders correctly, controls usable on tablet)
- Add ImageBox to portfolio metadata / update project card with screenshot

---

## Open Questions

- Should the equation-based experiment (Phase 6) use a text input with `math.js` eval, or a visual node graph? Text input is simpler; node graph is more powerful.
- Should presets be stored in localStorage (survives refresh) or session-only? Currently leaning localStorage for presets only since they're not image data.
- What should the ImageBox project card image look like? A screenshot of the tool in use, or a generated example of one of the pixel experiments?

---

## Related Files

- `.ai/specs/imagebox-experiments.md` — full running list of pixel experiments
- `src/App.js` — add route here
- `src/data.js` — add project card here
- `src/pages/Admin.js` — design system reference
- `src/styles/_tokens.scss` — SCSS tokens to use and extend
- `src/styles/_components.scss` — existing component patterns
