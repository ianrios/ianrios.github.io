import niceColors from "nice-color-palettes/1000";

const COLORS = niceColors[642];

export const BLOB = COLORS[0];
export const CUBES = BLOB;
export const BACK = COLORS[4];
export const LIGHTS = [
  {
    id: 0,
    color: 0xff0000
  },
  {
    id: 1,
    color: 0x00ff00
  },
  {
    id: 2,
    color: 0x0000ff
  }
];

export const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
export const VERTICES_NUM = 64 * (IS_MOBILE ? 1 : 2);

export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
