export const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
export const VERTICES_NUM = 64 * (IS_MOBILE ? 1 : 2);

export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
