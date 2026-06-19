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
import '../preview.scss';

export function MoleculesSection() {
  return (
    <>
      <TierLabel>Molecules</TierLabel>

      <SectionLabel>Form field</SectionLabel>
      <div style={{ maxWidth: 300, marginBottom: 'var(--space-md)' }}>
        <label
          htmlFor="demo-email"
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: 'var(--space-xxs)',
          }}
        >
          Email address
        </label>
        <Input
          id="demo-email"
          placeholder="you@example.com"
          style={{ width: '100%' }}
        />
        <div
          style={{
            fontSize: 11,
            color: 'var(--color-muted)',
            marginTop: 'var(--space-xxs)',
          }}
        >
          We&#39;ll never share your email.
        </div>
      </div>

      <SectionLabel>Card — primary actions</SectionLabel>
      <Card style={{ maxWidth: 320, marginBottom: 'var(--space-md)' }}>
        <h4 style={{ margin: 0, color: 'var(--color-text)' }}>Card title</h4>
        <p
          style={{
            fontSize: 14,
            margin: 'var(--space-xs) 0',
            color: 'var(--color-muted)',
          }}
        >
          Surface container: pop shadows + token-aware padding and radius.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-xxs)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-xs)',
          }}
        >
          <Badge>tag-one</Badge>
          <Badge>tag-two</Badge>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <Button
            variant="primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-xxs)',
            }}
          >
            <Icon name="check" /> Save
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </Card>

      <SectionLabel>Card — surface actions</SectionLabel>
      <Card style={{ maxWidth: 320, marginBottom: 'var(--space-md)' }}>
        <h4 style={{ margin: 0, color: 'var(--color-text)' }}>Settings</h4>
        <p
          style={{
            fontSize: 14,
            margin: 'var(--space-xs) 0',
            color: 'var(--color-muted)',
          }}
        >
          Surface links blend into the card background.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <a href="#demo" className="skeu-link skeu-btn--xs">
            Export
          </a>
          <a href="#demo" className="skeu-link skeu-btn--xs">
            Archive
          </a>
          <a
            href="#demo"
            className="skeu-link skeu-btn--xs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-xxs)',
            }}
          >
            <Icon name="close" size={12} /> Delete
          </a>
        </div>
      </Card>

      <SectionLabel>Card — color variants</SectionLabel>
      <div className="preview-flex" style={{ marginBottom: 'var(--space-md)' }}>
        {CARD_COLOR_VARIANTS.map(({ label, variant, text }) => (
          <Card
            key={label}
            className={variant ?? undefined}
            style={{ color: text, minWidth: 140 }}
          >
            <div
              style={{
                fontSize: 9,
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 'var(--space-xxs)',
              }}
            >
              {label}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
              Card title
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--color-muted)',
                marginTop: 'var(--space-xxs)',
                marginBottom: 'var(--space-xs)',
              }}
            >
              Subtitle line
            </div>
            <Badge>Tag</Badge>
            <div style={{ marginTop: 'var(--space-xs)' }}>
              <a
                href="#demo"
                className="skeu-link skeu-btn--xs"
                style={{ fontSize: 12 }}
              >
                Surface link
              </a>
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel>Card with accordion</SectionLabel>
      <Card style={{ maxWidth: 380, marginBottom: 'var(--space-md)' }}>
        <h4
          style={{
            margin: 0,
            marginBottom: 'var(--space-sm)',
            color: 'var(--color-text)',
          }}
        >
          FAQ
        </h4>
        <Accordion items={ACCORDION_ITEMS} inline />
      </Card>

      <SectionLabel>Card with dropdown</SectionLabel>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <CardWithDropdown />
      </div>

      <SectionLabel>Nav — horizontal (link-style)</SectionLabel>
      <div style={{ marginBottom: 'var(--space-sm)' }}>
        <NavBar variant="links" pages={['home', 'work']} />
      </div>

      <SectionLabel>Nav — horizontal (interactive active state)</SectionLabel>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <NavBar />
      </div>

      <SectionLabel>Nav — vertical (button variant)</SectionLabel>
      <div className="preview-flex" style={{ marginBottom: 'var(--space-sm)' }}>
        <NavVertical />
        <div
          style={{
            flex: 1,
            fontSize: 12,
            color: 'var(--color-muted)',
            paddingTop: 'var(--space-sm)',
          }}
        >
          Raised surface buttons · click to set active
        </div>
      </div>

      <SectionLabel>Nav — vertical (link variant)</SectionLabel>
      <div className="preview-flex" style={{ marginBottom: 'var(--space-md)' }}>
        <NavVertical variant="links" />
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

      <SectionLabel>Accordion — standalone</SectionLabel>
      <div style={{ maxWidth: 380, marginBottom: 'var(--space-lg)' }}>
        <Accordion items={ACCORDION_ITEMS} />
      </div>
    </>
  );
}
