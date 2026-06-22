import type React from 'react';
import { hoverStyle, activeStyle } from './button-helpers-data';

export function ButtonStateRow({ label, cls }: { label: string; cls: string }) {
  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <div
        style={{
          fontSize: 11,
          color: 'var(--color-muted)',
          marginBottom: 'var(--space-xs)',
        }}
      >
        {label}
      </div>
      <div className="preview-flex preview-flex--end">
        {(
          [
            ['default', {}],
            ['hover', hoverStyle],
            ['active', activeStyle],
          ] as [string, React.CSSProperties][]
        ).map(([state, extra]) => (
          <div key={state} style={{ textAlign: 'center' }}>
            <button
              className={`skeu-btn ${cls}`}
              style={{ pointerEvents: 'none', ...extra }}
            >
              {state}
            </button>
            <div
              style={{
                fontSize: 10,
                color: 'var(--color-muted)',
                marginTop: 'var(--space-xxs)',
              }}
            >
              {state}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
