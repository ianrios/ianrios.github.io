# ImageBox — Pixel Experiment Ideas

A running list of all pixel manipulation experiments Ian wants to build. Add to this freely — it's a reference, not a spec.

---

## Experiments

### 1. Transparency Checkerboard / Layer Blending
Turn every 3rd pixel in a 2×2 pixel group transparent (as PNG), then overlap this image with another image so that background colors "leak through" the transparent holes. Downloadable result.

### 2. Pixel Averaging / Pixelation Slider
A slider that groups pixels together by average color — NOT a blur. More like a mosaic: progressively larger blocks where each block becomes its average color. More aggressive = more blocky/abstract.

### 3. Equation-Based Pixel Manipulation
Allow a math expression (x, y coordinates) to drive pixel transformations: e.g., remove or multiply pixel color values, shift hue, or apply channel math. Goal is to watch patterns emerge from the image as math is applied across the pixel grid.

### 4. Repeating Pixel Strips
Every N pixels, duplicate the previous N pixels — left to right, top to bottom. Creates a tiling/stutter effect across the image.

### 5. Nearest Color Quantization (per-pixel range)
For each pixel, shift it to the nearest matching color within a defined radius of neighboring pixels. Reduces color variety in a mathematically controlled way.

### 6. Grid Section Averaging
Divide the image into X×Y grid cells. Replace every pixel in each cell with that cell's average color. Creates a mosaic/tile abstraction effect.

### 7. Grid Section Extremes
Same X×Y grid division, but instead of average color, keep only:
- The brightest pixel in the cell
- The darkest pixel in the cell
- The highest-contrast pixel in the cell
All other pixels in that cell are removed/transparent.

### 8. Color Selection / Deletion in Grid Ranges
Allow the user to select a range area, then keep or delete all but one pixel/color/selection within that range. Interactive selection tool.

---

## Canvas & Viewport Tools

### MVP (ship in Phase 1)
1. **Undo / redo** — full edit history
2. **Checkerboard background** — transparency indicator (toggleable)
3. **Status bar** — cursor XY, pixel color under cursor (hex + rgb), zoom %
4. **Rotation snap** — hold shift to snap to 45° increments
5. **Fit to window / 1:1 zoom** — keyboard shortcuts to reset the view

### Deferred (implement after MVP is stable)
6. Magic wand / select by color (with tolerance slider)
7. Eyedropper / color sampler
8. Rulers + drag guides from ruler edges
9. History panel — visual list of states to click into
10. Snap to grid — optional grid overlay with snap

### Canvas interaction tools
- Zoom, pan, rotate, skew, crop
- Flip horizontal / flip vertical
- Set image dimensions (per layer)
- Set canvas dimensions (independent of image)
- Selection tools (rect, lasso) — deferred; apply-to-whole-layer is MVP

---

## Core Features (referenced across experiments)

- **Presets** — saved configurations of any experiment's parameters
- **Knobs / sliders / toggles** — editable in real time
- **Image viewer** — see the result as you adjust
- **Multi-image upload** — stack more than one image
- **Layer selector** — manage stacked images
- **Download button** — export the processed image (PNG)
- **Primary user is Ian**, but the tool should be publicly usable by anyone visiting ianrios.me

---

*Last updated: 2026-06-09. Ask Ian before deleting or reorganizing.*
