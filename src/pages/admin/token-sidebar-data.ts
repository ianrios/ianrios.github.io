// Sidebar control lists — derived from the canonical token registry so they can
// never drift from :root / DEFAULTS. Order and labels come from the registry.
import { controlList } from '../../styles/token-registry';

export const COLOR_CONTROLS = controlList('color');
export const CHROME_CONTROLS = controlList('chrome');
export const SPACING_CONTROLS = controlList('spacing');
export const RADII_CONTROLS = controlList('radii');
export const FONT_CONTROLS = controlList('font');
export const BTN_COLOR_CONTROLS = controlList('button', 'color');
export const BTN_SHAPE_CONTROLS = controlList('button', 'range');
export const LINK_COLOR_CONTROLS = controlList('link');
