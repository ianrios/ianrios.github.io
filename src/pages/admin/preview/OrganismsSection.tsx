import { Badge } from '../../../components/atoms/Badge';
import { Button } from '../../../components/atoms/Button';
import { Icon } from '../../../components/atoms/Icon';
import { Card } from '../../../components/molecules/Card';
import { NavBar } from '../../../components/molecules/NavBar';
import { NavVertical } from '../../../components/molecules/NavVertical';
import { NavVerticalSections } from '../../../components/molecules/NavVerticalSections';
import { SectionLabel, TierLabel } from '../AdminUI';
import { CARD_GRID_DATA, VERTICAL_NAV_SECTIONS } from '../adminData';
import '../preview.scss';

export function OrganismsSection() {
  return (
    <>
      <TierLabel>Organisms</TierLabel>

      <SectionLabel>Page / Layout</SectionLabel>
      <div className="preview-page-frame--dashed">
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 14,
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            color: 'var(--color-muted)',
          }}
        >
          Page
        </div>
        <div
          style={{ fontSize: 12, color: 'var(--color-muted)', paddingTop: 4 }}
        >
          background = color-bg · padding = space-lg · border-radius = radius-lg
        </div>
      </div>

      <SectionLabel>Page with nav and card</SectionLabel>
      <div
        className="preview-page-frame"
        style={{ marginBottom: 'var(--space-lg)' }}
      >
        <NavBar />
        <div style={{ marginTop: 'var(--space-md)' }}>
          <Card style={{ maxWidth: 320 }}>
            <h4 style={{ margin: 0, color: 'var(--color-text)' }}>
              Page content
            </h4>
            <p
              style={{
                fontSize: 14,
                color: 'var(--color-muted)',
                margin: 'var(--space-xs) 0',
              }}
            >
              A surface card lives inside the page bg layer.
            </p>
            <Button
              variant="primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xxs)',
              }}
            >
              <Icon name="arrow" /> Get started
            </Button>
          </Card>
        </div>
      </div>

      <SectionLabel>Card grid</SectionLabel>
      <div
        className="skeu-card-grid"
        style={{ marginBottom: 'var(--space-lg)' }}
      >
        {CARD_GRID_DATA.map(({ title, desc, tools }) => (
          <Card key={title} style={{ padding: 'var(--space-sm)' }}>
            <strong style={{ color: 'var(--color-text)' }}>{title}</strong>
            <p
              style={{
                margin: 'var(--space-xxs) 0 var(--space-xs)',
                fontSize: 12,
                color: 'var(--color-muted)',
              }}
            >
              {desc}
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-xxs)',
                flexWrap: 'wrap',
              }}
            >
              {tools.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel>
        Vertical nav with section accordion — button variant
      </SectionLabel>
      <div className="preview-flex" style={{ marginBottom: 'var(--space-sm)' }}>
        <NavVerticalSections sections={VERTICAL_NAV_SECTIONS} />
        <div
          style={{
            flex: 1,
            fontSize: 12,
            color: 'var(--color-muted)',
            paddingTop: 'var(--space-sm)',
          }}
        >
          Raised outline buttons · click headers to expand/collapse
        </div>
      </div>

      <SectionLabel>
        Vertical nav with section accordion — link variant
      </SectionLabel>
      <div className="preview-flex" style={{ marginBottom: 'var(--space-lg)' }}>
        <NavVerticalSections sections={VERTICAL_NAV_SECTIONS} variant="links" />
        <div
          style={{
            flex: 1,
            fontSize: 12,
            color: 'var(--color-muted)',
            paddingTop: 'var(--space-sm)',
          }}
        >
          Flat link buttons — no elevation, accent bg on hover/active
        </div>
      </div>

      <SectionLabel>Sidebar layout — NavVertical (button variant)</SectionLabel>
      <div className="preview-page-frame">
        <div
          style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            color: 'var(--color-muted)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          Page
        </div>
        <div className="preview-flex">
          <NavVertical
            siteName="Ian Rios"
            pages={['experience', 'projects', 'hobbies']}
            ctaLabel="Contact"
          />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
            }}
          >
            <Card style={{ padding: 'var(--space-sm)' }}>
              <Badge>Work</Badge>
              <div
                style={{
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginTop: 'var(--space-xxs)',
                }}
              >
                Built Technologies
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                Sr. Frontend Eng · 2022–now
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
