import { useEffect, useState } from 'react';
import { SectionLabel } from '../AdminUI';

// Focused, always-visible specimens for tokens the generic swatch/scale views
// under-serve: component-scale widths, the modal panel, the overlay scrim, the
// slow transition, the smallest caption size and the loose line height. Each is
// wired to its live var() so dragging the matching sidebar control moves it on
// screen. Inline var() styles here are the legitimate token-live-preview
// exception (same pattern as TokensSection's specimens).

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// A slide-on-interval demo whose transition duration is --anim-speed-slow, so
// it reads as a distinct "slow motion" specimen next to the --anim-speed pulse.
function SlowAnimSpecimen() {
  const [shifted, setShifted] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setShifted((v) => !v);
    }, 900);
    return () => {
      clearInterval(id);
    };
  }, []);
  return (
    <div className="skeu-token-anim-track">
      <div
        className="skeu-token-anim-thumb"
        style={{ transform: shifted ? 'translateX(120px)' : 'translateX(0)' }}
      />
    </div>
  );
}

export function TokenShowcase() {
  return (
    <>
      <SectionLabel>Component scale</SectionLabel>
      <div className="skeu-token-layout-specimens">
        <div className="skeu-token-type-row">
          <span className="skeu-token-type-label">
            --sidebar-width · {cssVar('--sidebar-width')}
          </span>
          <div
            className="skeu-token-layout-bar"
            style={{ width: 'var(--sidebar-width)', maxWidth: '100%' }}
          />
        </div>
        <div className="skeu-token-type-row">
          <span className="skeu-token-type-label">
            --drawer-width · {cssVar('--drawer-width')}
          </span>
          <div
            className="skeu-token-layout-bar"
            style={{ width: 'var(--drawer-width)', maxWidth: '100%' }}
          />
        </div>
      </div>

      <SectionLabel>Modal panel — --modal-max-width</SectionLabel>
      <div
        className="skeu-token-modal-panel"
        style={{ width: 'min(var(--modal-max-width), 100%)' }}
      >
        modal-max-width · {cssVar('--modal-max-width')} — panel at
        min(var(--modal-max-width), 100%)
      </div>

      <SectionLabel>Overlay scrim — --overlay-bg</SectionLabel>
      <div className="skeu-token-scrim-stage">
        <div className="skeu-token-scrim-content">
          Content sitting behind the scrim
        </div>
        <div
          className="skeu-token-scrim-overlay"
          style={{ background: 'var(--overlay-bg)' }}
        />
      </div>

      <SectionLabel>Slow transition — --anim-speed-slow</SectionLabel>
      <SlowAnimSpecimen />

      <SectionLabel>Caption — --font-xxs</SectionLabel>
      <span
        className="skeu-token-caption-sample"
        style={{ fontSize: 'var(--font-xxs)' }}
      >
        Caption text — timestamps, footnotes, image credits ({' '}
        {cssVar('--font-xxs')} )
      </span>

      <SectionLabel>Loose paragraph — --line-height-loose</SectionLabel>
      <p
        className="skeu-token-lineheight-sample"
        style={{ lineHeight: 'var(--line-height-loose)' }}
      >
        The quick brown fox jumps over the lazy dog. Pack my box with five dozen
        liquor jugs. How vexingly quick daft zebras jump — a multi-line body set
        at the loose line height so leading changes are visible as you drag the
        control.
      </p>
    </>
  );
}
