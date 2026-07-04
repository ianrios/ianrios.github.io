import { SectionLabel, TierLabel } from '../AdminUI';
import {
  categoryVars,
  SPECIMEN_ALLOWLIST,
} from '../../../styles/token-registry';
import { TokenShowcase } from './TokenShowcase';

// Specimen token lists derive from the canonical registry; [token-specimen]
// asserts every displayed-category token is rendered here.
const COLOR_TOKENS = [...categoryVars('color'), ...categoryVars('link')];
const FONT_TOKENS = categoryVars('font');
const SPACE_TOKENS = categoryVars('spacing');
const RADIUS_TOKENS = categoryVars('radii');
const MOTION_TOKENS = categoryVars('motion');
const BEVEL_TOKENS = categoryVars('bevel').filter(
  (v) => !SPECIMEN_ALLOWLIST.includes(v),
);
const LINE_HEIGHT_TOKENS = categoryVars('line-height');

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function label(name: string): string {
  return name.replace('--', '');
}

export function TokensSection() {
  return (
    <>
      <TierLabel>Design Tokens</TierLabel>

      <SectionLabel>Colors</SectionLabel>
      <div className="skeu-token-swatches">
        {COLOR_TOKENS.map((name) => {
          const val = cssVar(name);
          return (
            <div key={name} className="skeu-token-swatch-entry">
              <div
                className="skeu-token-swatch"
                style={{ background: val }}
                title={val}
              />
              <div className="skeu-token-swatch-label">
                {label(name)}
                <br />
                {val}
              </div>
            </div>
          );
        })}
      </div>

      <SectionLabel>Typography</SectionLabel>
      <div>
        {FONT_TOKENS.map((name) => {
          const val = cssVar(name);
          return (
            <div key={name} className="skeu-token-type-row">
              <span className="skeu-token-type-label">
                {label(name).replace('font-', '')} · {val}
              </span>
              <span style={{ fontSize: val }}>The quick brown fox</span>
            </div>
          );
        })}
      </div>

      <SectionLabel>Line height</SectionLabel>
      <div>
        {LINE_HEIGHT_TOKENS.map((name) => {
          const val = cssVar(name);
          return (
            <div key={name} className="skeu-token-type-row">
              <span className="skeu-token-type-label">
                {label(name).replace('line-height-', '')} · {val}
              </span>
              <p
                className="skeu-token-lineheight-sample"
                style={{ lineHeight: val }}
              >
                The quick brown fox jumps over the lazy dog. Pack my box with
                five dozen liquor jugs.
              </p>
            </div>
          );
        })}
      </div>

      <SectionLabel>Spacing</SectionLabel>
      <div>
        {SPACE_TOKENS.map((name) => {
          const val = cssVar(name);
          return (
            <div key={name} className="skeu-token-type-row">
              <span className="skeu-token-type-label">
                {label(name)} · {val}
              </span>
              <div className="skeu-token-spacing-bar" style={{ width: val }} />
            </div>
          );
        })}
      </div>

      <SectionLabel>Radii</SectionLabel>
      <div className="skeu-token-swatches">
        {RADIUS_TOKENS.map((name) => {
          const val = cssVar(name);
          return (
            <div key={name} className="skeu-token-swatch-entry">
              <div
                className="skeu-token-radius-swatch"
                style={{ borderRadius: val }}
                title={val}
              />
              <div className="skeu-token-swatch-label">
                {label(name)}
                <br />
                {val}
              </div>
            </div>
          );
        })}
      </div>

      <SectionLabel>Bevel tones</SectionLabel>
      <div className="skeu-token-swatches">
        {BEVEL_TOKENS.map((name) => {
          const val = cssVar(name);
          return (
            <div key={name} className="skeu-token-swatch-entry">
              <div
                className="skeu-token-swatch"
                style={{ background: val }}
                title={val}
              />
              <div className="skeu-token-swatch-label">
                {label(name)}
                <br />
                {val}
              </div>
            </div>
          );
        })}
      </div>

      <SectionLabel>Motion</SectionLabel>
      <div className="skeu-token-swatches">
        {MOTION_TOKENS.map((name) => {
          const val = cssVar(name);
          return (
            <div key={name} className="skeu-token-swatch-entry">
              <div
                className="skeu-token-motion-demo"
                style={{ '--demo-speed': val }}
                title={val}
              />
              <div className="skeu-token-swatch-label">
                {label(name)}
                <br />
                {val}
              </div>
            </div>
          );
        })}
      </div>

      <TokenShowcase />
    </>
  );
}
