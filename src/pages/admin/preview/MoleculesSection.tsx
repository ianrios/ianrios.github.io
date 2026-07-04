import { Badge } from '../../../components/atoms/Badge';
import { Button } from '../../../components/atoms/Button';
import { Icon } from '../../../components/atoms/Icon';
import { Input } from '../../../components/atoms/Input';
import { Card } from '../../../components/molecules/Card';
import { Accordion } from '../../../components/molecules/Accordion';
import { CardWithDropdown } from '../../../components/molecules/CardWithDropdown';
import { NavBar } from '../../../components/molecules/NavBar';
import { NavVertical } from '../../../components/molecules/NavVertical';
import { SectionLabel, TierLabel } from '../AdminUI';
import { ACCORDION_ITEMS, CARD_COLOR_VARIANTS } from '../adminData';
export function MoleculesSection() {
  return (
    <>
      <TierLabel>Molecules</TierLabel>

      <SectionLabel>Form field</SectionLabel>
      <div className="skeu-form-field-demo">
        <label htmlFor="demo-email" className="skeu-form-field-demo__label">
          Email address
        </label>
        <Input id="demo-email" placeholder="you@example.com" fullWidth />
        <div className="skeu-form-field-demo__hint">
          We&#39;ll never share your email.
        </div>
      </div>

      <SectionLabel>Card — primary actions</SectionLabel>
      <div className="skeu-preview-section">
        <Card maxWidth={320}>
          <h4 className="skeu-card-demo-heading">Card title</h4>
          <p className="skeu-preview-body-text">
            Surface container: pop shadows + token-aware padding and radius.
          </p>
          <div className="skeu-preview-tags">
            <Badge>tag-one</Badge>
            <Badge>tag-two</Badge>
          </div>
          <div className="skeu-preview-actions">
            <Button variant="solid">
              <Icon name="check" /> Save
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </Card>
      </div>

      <SectionLabel>Card — surface actions</SectionLabel>
      <div className="skeu-preview-section">
        <Card maxWidth={320}>
          <h4 className="skeu-card-demo-heading">Settings</h4>
          <p className="skeu-preview-body-text">
            Surface links blend into the card background.
          </p>
          <div className="skeu-preview-actions">
            <a href="#demo" className="skeu-link skeu-btn--xs">
              Export
            </a>
            <a href="#demo" className="skeu-link skeu-btn--xs">
              Archive
            </a>
            <a
              href="#demo"
              className="skeu-link skeu-btn--xs skeu-card-surface-link"
            >
              <Icon name="close" size={12} /> Delete
            </a>
          </div>
        </Card>
      </div>

      <SectionLabel>Card — color variants</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        {CARD_COLOR_VARIANTS.map(({ label, variant }) => (
          <Card key={label} {...(variant ? { variant } : {})}>
            <div className="skeu-card-variant-label">{label}</div>
            <div className="skeu-card-variant-title">Card title</div>
            <div className="skeu-card-variant-desc">Subtitle line</div>
            <Badge>Tag</Badge>
            <div className="skeu-card-variant-action">
              <a
                href="#demo"
                className="skeu-link skeu-btn--xs skeu-card-surface-link"
              >
                Surface link
              </a>
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel>Card with accordion</SectionLabel>
      <div className="skeu-preview-section">
        <Card maxWidth={380}>
          <h4 className="skeu-card-demo-heading--mb-sm">FAQ</h4>
          <Accordion items={ACCORDION_ITEMS} inline />
        </Card>
      </div>

      <SectionLabel>Card with dropdown</SectionLabel>
      <div className="skeu-preview-section">
        <CardWithDropdown />
      </div>

      <SectionLabel>Nav — horizontal (link-style)</SectionLabel>
      <div className="skeu-preview-section--sm">
        <NavBar variant="links" pages={['home', 'work']} />
      </div>

      <SectionLabel>Nav — horizontal (interactive active state)</SectionLabel>
      <div className="skeu-preview-section">
        <NavBar />
      </div>

      <SectionLabel>Nav — vertical (button variant)</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section--sm">
        <NavVertical />
        <div className="skeu-preview-sidebar-desc">
          Raised surface buttons · click to set active
        </div>
      </div>

      <SectionLabel>Nav — vertical (link variant)</SectionLabel>
      <div className="skeu-preview-flex skeu-preview-section">
        <NavVertical variant="links" />
        <div className="skeu-preview-sidebar-desc">
          Flat link buttons — no elevation, accent bg on hover/active
        </div>
      </div>

      <SectionLabel>Accordion — standalone</SectionLabel>
      <div className="skeu-accordion-demo">
        <Accordion items={ACCORDION_ITEMS} />
      </div>
    </>
  );
}
