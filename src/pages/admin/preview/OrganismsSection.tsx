import { Badge } from '../../../components/atoms/Badge';
import { Button } from '../../../components/atoms/Button';
import { Icon } from '../../../components/atoms/Icon';
import { Card } from '../../../components/molecules/Card';
import { NavBar } from '../../../components/molecules/NavBar';
import { NavVertical } from '../../../components/molecules/NavVertical';
import { NavVerticalSections } from '../../../components/molecules/NavVerticalSections';
import { CookieConsentDemo } from '../../../components/organisms/CookieConsent.demo';
import { CursorFXDemo } from '../../../components/organisms/CursorFX.demo';
import { ExpandableCardDemo } from '../../../components/organisms/ExpandableCard.demo';
import { FloatingNavDemo } from '../../../components/organisms/FloatingNav.demo';
import { MasonryCardDemo } from '../../../components/organisms/MasonryCard.demo';
import { PageLayoutDemo } from '../../../components/organisms/PageLayout.demo';
import { PresetDialDemo } from '../../../components/organisms/PresetDial.demo';
import { PushPanelDemo } from '../../../components/organisms/PushPanel.demo';
import { TextureOverlayDemo } from '../../../components/organisms/TextureOverlay.demo';
import { Heading } from '../../../components/atoms/Heading';
import { Text } from '../../../components/atoms/Text';
import { SectionLabel, TierLabel } from '../AdminUI';
import { CARD_GRID_DATA, VERTICAL_NAV_SECTIONS } from '../adminData';

export function OrganismsSection() {
  return (
    <>
      <TierLabel>Organisms</TierLabel>

      <SectionLabel>PushPanel: tab variants + header prop</SectionLabel>
      <PushPanelDemo />

      <SectionLabel>Effects: cursor and texture (four tokens)</SectionLabel>
      <div className="skeu-preview-note">
        Four independent effects, each 0 = off in the Effects sidebar: a custom
        cursor dot (instant, hides the native cursor), a trailing ring (eased),
        a static grain overlay, and a grain blob that eases toward the pointer.
        Static swatches below keep a visible floor at token 0.
      </div>
      <div className="skeu-preview-section">
        <CursorFXDemo />
        <TextureOverlayDemo />
      </div>

      <SectionLabel>Floating nav (draggable site remote)</SectionLabel>
      <div className="skeu-preview-note">
        Fixed bottom-left on live pages; the grip drags it anywhere (arrow keys
        nudge it). Position is session-only - it never persists, so every load
        starts at the same spot. Shown inline here.
      </div>
      <div className="skeu-preview-section">
        <FloatingNavDemo />
      </div>

      <SectionLabel>Preset dial (floating theme remote)</SectionLabel>
      <div className="skeu-preview-note">
        A separate floating remote for theme presets, docked near the open
        design panel by default but draggable anywhere - the same
        fixed-position, grip-and-clamp architecture as the floating nav, kept
        independent so its own screen position never moves when a theme change
        resizes anything else. Shown inline here.
      </div>
      <div className="skeu-preview-section">
        <PresetDialDemo />
      </div>

      <SectionLabel>Masonry card (portfolio grid item)</SectionLabel>
      <div className="skeu-preview-section">
        <MasonryCardDemo />
      </div>

      <SectionLabel>Page / Layout</SectionLabel>
      <PageLayoutDemo />

      <SectionLabel>Expandable card (disclosure)</SectionLabel>
      <div className="skeu-preview-section">
        <ExpandableCardDemo />
      </div>

      <SectionLabel>Cookie consent (fixed banner, demo state)</SectionLabel>
      <div className="skeu-preview-section">
        <CookieConsentDemo />
      </div>

      <SectionLabel>Page with nav and card</SectionLabel>
      <div className="skeu-preview-page-frame skeu-preview-section--lg">
        <NavBar />
        <div className="skeu-mt-md">
          <Card maxWidth={320}>
            <Heading level={4} className="skeu-card-demo-heading">
              Page content
            </Heading>
            <Text className="skeu-preview-body-text">
              A surface card lives inside the page bg layer.
            </Text>
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
            <Text className="skeu-card-grid__desc">{desc}</Text>
            <div className="skeu-card-grid__tags">
              {tools.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel>
        Vertical nav with section accordion: button variant
      </SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section--sm">
        <NavVerticalSections sections={VERTICAL_NAV_SECTIONS} />
        <div className="skeu-preview-sidebar-desc">
          Raised outline buttons · click headers to expand/collapse
        </div>
      </div>

      <SectionLabel>
        Vertical nav with section accordion: link variant
      </SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section--lg">
        <NavVerticalSections sections={VERTICAL_NAV_SECTIONS} variant="links" />
        <div className="skeu-preview-sidebar-desc">
          Flat link buttons, no elevation, accent bg on hover/active
        </div>
      </div>

      <SectionLabel>Sidebar layout: NavVertical (button variant)</SectionLabel>
      <div className="skeu-preview-page-frame">
        <div className="skeu-combo-page-label">Page</div>
        <div className="skeu-preview-flex">
          <NavVertical
            siteName="Ian Rios"
            pages={['about', 'portfolio', 'contact']}
            ctaLabel="Contact"
          />
          <div className="skeu-org-sidebar-content">
            <Card padding="sm">
              <Badge>Work</Badge>
              <div className="skeu-org-sidebar-card__company">
                Built Technologies
              </div>
              <div className="skeu-org-sidebar-card__role">
                Sr. Frontend Eng · 2022 to now
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
