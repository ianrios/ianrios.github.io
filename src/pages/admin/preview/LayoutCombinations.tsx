import { Badge } from '../../../components/atoms/Badge';
import { Button } from '../../../components/atoms/Button';
import { Icon } from '../../../components/atoms/Icon';
import { IconLink } from '../../../components/atoms/IconLink';
import { Link } from '../../../components/atoms/Link';
import { Card } from '../../../components/molecules/Card';
import { SectionLabel } from '../AdminUI';
import '../preview.scss';

export function LayoutCombinations() {
  return (
    <>
      <SectionLabel>Settings panel — Card → nested item rows</SectionLabel>
      <Card style={{ maxWidth: 360, marginBottom: 'var(--space-md)' }}>
        <h4
          style={{
            margin: 0,
            marginBottom: 'var(--space-sm)',
            color: 'var(--color-text)',
          }}
        >
          Preferences
        </h4>
        {[
          { icon: 'edit', label: 'Display name', value: 'Ian Rios' },
          { icon: 'link', label: 'Public URL', value: 'ianrios.me' },
          { icon: 'star', label: 'Featured project', value: 'SpecLab' },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-xs) var(--space-sm)',
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-xxs)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
              }}
            >
              <Icon name={icon} size={13} />
              <span style={{ fontSize: 13, color: 'var(--color-text)' }}>
                {label}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                {value}
              </span>
              <Button variant="outline" size="xs">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </Card>

      <SectionLabel>
        Inset panel with link actions — Card + IconLink + skeu-link
      </SectionLabel>
      <Card style={{ maxWidth: 420, marginBottom: 'var(--space-md)' }}>
        <h4
          style={{
            margin: 0,
            marginBottom: 'var(--space-sm)',
            color: 'var(--color-text)',
          }}
        >
          Open source
        </h4>
        <div
          style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-sm)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-xxs)',
              flexWrap: 'wrap',
            }}
          >
            <Badge>React</Badge>
            <Badge>Three.js</Badge>
            <Badge>WebGL</Badge>
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--color-muted)',
              marginTop: 'var(--space-xs)',
            }}
          >
            A public project living in the repo.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="https://ianrios.me" external size="xs">
            Visit site
          </Link>
          <div style={{ display: 'flex', gap: 'var(--space-xxs)' }}>
            <IconLink
              name="github"
              href="https://github.com/ianrios"
              aria-label="GitHub repo"
            />
            <IconLink
              name="external"
              href="https://ianrios.me"
              aria-label="Open in new tab"
            />
          </div>
        </div>
      </Card>

      <SectionLabel>Modal — Card floating over dimmed Page</SectionLabel>
      <div
        className="preview-page-frame"
        style={{ minHeight: 180, overflow: 'hidden', position: 'relative' }}
      >
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
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        >
          <Card style={{ flex: 1, padding: 'var(--space-sm)' }}>
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              Background content
            </div>
          </Card>
          <Card style={{ flex: 1, padding: 'var(--space-sm)' }}>
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              Background content
            </div>
          </Card>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card style={{ width: 240, margin: 0 }}>
            <h4
              style={{
                margin: 0,
                marginBottom: 'var(--space-xs)',
                color: 'var(--color-text)',
              }}
            >
              Confirm delete
            </h4>
            <p
              style={{
                fontSize: 13,
                color: 'var(--color-muted)',
                margin: '0 0 var(--space-sm)',
              }}
            >
              This action cannot be undone.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-xs)',
                justifyContent: 'flex-end',
              }}
            >
              <Button variant="outline" style={{ fontSize: 12 }}>
                Cancel
              </Button>
              <Button variant="primary" style={{ fontSize: 12 }}>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
