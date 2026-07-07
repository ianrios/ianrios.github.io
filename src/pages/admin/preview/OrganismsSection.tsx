import { Badge } from '../../../components/atoms/Badge';
import { Button } from '../../../components/atoms/Button';
import { Icon } from '../../../components/atoms/Icon';
import { Card } from '../../../components/molecules/Card';
import { NavBar } from '../../../components/molecules/NavBar';
import { NavVertical } from '../../../components/molecules/NavVertical';
import { NavVerticalSections } from '../../../components/molecules/NavVerticalSections';
import { PageLayout } from '../../../components/organisms/PageLayout';
import { MasonryCard } from '../../../components/organisms/MasonryCard';
import { SectionLabel, TierLabel } from '../AdminUI';
import {
  CARD_GRID_DATA,
  MASONRY_DEMO_ITEM,
  VERTICAL_NAV_SECTIONS,
} from '../adminData';
import { PushPanelVariants } from './PushPanelVariants';
export function OrganismsSection() {
  return (
    <>
      <TierLabel>Organisms</TierLabel>

      <PushPanelVariants />

      <SectionLabel>Masonry card (portfolio grid item)</SectionLabel>
      <div className="skeu-preview-section">
        <MasonryCard item={MASONRY_DEMO_ITEM} index={0} />
      </div>

      <SectionLabel>Page / Layout</SectionLabel>
      <PageLayout>
        <div className="skeu-preview-note">
          background = color-bg · padding = space-lg · border-radius = radius-lg
        </div>
      </PageLayout>

      <SectionLabel>Page with nav and card</SectionLabel>
      <div className="skeu-preview-page-frame skeu-preview-section--lg">
        <NavBar />
        <div className="skeu-mt-md">
          <Card maxWidth={320}>
            <h4 className="skeu-card-demo-heading">Page content</h4>
            <p className="skeu-preview-body-text">
              A surface card lives inside the page bg layer.
            </p>
            <Button variant="solid">
              <Icon name="arrow" /> Get started
            </Button>
          </Card>
        </div>
      </div>

      <SectionLabel>Card grid</SectionLabel>
      <div className="skeu-card-grid">
        {CARD_GRID_DATA.map(({ title, desc, tools }) => (
          <Card key={title} padding="sm">
            <strong className="skeu-preview-strong">{title}</strong>
            <p className="skeu-card-grid__desc">{desc}</p>
            <div className="skeu-card-grid__tags">
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
      <div className="skeu-preview-flex skeu-preview-section--sm">
        <NavVerticalSections sections={VERTICAL_NAV_SECTIONS} />
        <div className="skeu-preview-sidebar-desc">
          Raised outline buttons · click headers to expand/collapse
        </div>
      </div>

      <SectionLabel>
        Vertical nav with section accordion — link variant
      </SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section--lg">
        <NavVerticalSections sections={VERTICAL_NAV_SECTIONS} variant="links" />
        <div className="skeu-preview-sidebar-desc">
          Flat link buttons — no elevation, accent bg on hover/active
        </div>
      </div>

      <SectionLabel>Sidebar layout — NavVertical (button variant)</SectionLabel>
      <div className="skeu-preview-page-frame">
        <div className="skeu-combo-page-label">Page</div>
        <div className="skeu-preview-flex">
          <NavVertical
            siteName="Ian Rios"
            pages={['experience', 'projects', 'hobbies']}
            ctaLabel="Contact"
          />
          <div className="skeu-org-sidebar-content">
            <Card padding="sm">
              <Badge>Work</Badge>
              <div className="skeu-org-sidebar-card__company">
                Built Technologies
              </div>
              <div className="skeu-org-sidebar-card__role">
                Sr. Frontend Eng · 2022–now
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
