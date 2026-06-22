import { SectionLabel } from '../AdminUI';
import { ButtonStateRow } from './ButtonHelpers';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../adminData';
import '../preview.scss';

export function ButtonAtoms() {
  return (
    <>
      <SectionLabel>Button — style (gradient / primary / outline)</SectionLabel>
      <div
        className="preview-flex preview-flex--end"
        style={{ marginBottom: 'var(--space-md)' }}
      >
        {BUTTON_VARIANTS.map(({ label, cls, desc }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-xxs)',
            }}
          >
            <button className={`skeu-btn ${cls}`}>{label}</button>
            <span
              style={{
                fontSize: 10,
                color: 'var(--color-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {desc}
            </span>
          </div>
        ))}
      </div>

      <SectionLabel>
        Button — size (xs / sm / md / lg / xl) — orthogonal to style
      </SectionLabel>
      {BUTTON_VARIANTS.map(({ label: varLabel, cls: varCls }) => (
        <div key={varLabel} style={{ marginBottom: 'var(--space-sm)' }}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--color-muted)',
              marginBottom: 'var(--space-xs)',
            }}
          >
            {varLabel || 'gradient'}
          </div>
          <div className="preview-flex preview-flex--end">
            {BUTTON_SIZES.map(({ label: sizeLabel, cls: sizeCls }) => (
              <div key={sizeLabel} style={{ textAlign: 'center' }}>
                <button className={`skeu-btn ${varCls} ${sizeCls}`.trim()}>
                  {sizeLabel}
                </button>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--color-muted)',
                    marginTop: 2,
                  }}
                >
                  {sizeLabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <SectionLabel>Button — states (default / hover / active)</SectionLabel>
      {BUTTON_VARIANTS.map(({ label, cls }) => (
        <ButtonStateRow key={label} label={label} cls={cls} />
      ))}
    </>
  );
}
