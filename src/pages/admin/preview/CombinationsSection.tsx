import { useState } from 'react';
import { Badge } from '../../../components/atoms/Badge';
import { Button } from '../../../components/atoms/Button';
import { Icon } from '../../../components/atoms/Icon';
import { IconLink } from '../../../components/atoms/IconLink';
import { Input } from '../../../components/atoms/Input';
import { Link } from '../../../components/atoms/Link';
import { Card } from '../../../components/molecules/Card';
import { FormField } from '../../../components/molecules/FormField';
import { PushPanel } from '../../../components/organisms/PushPanel';
import { PortfolioSidebar } from '../../../components/organisms/PortfolioSidebar';
import { ContactModal } from '../../../components/organisms/ContactModal';
import { SectionLabel, TierLabel } from '../AdminUI';
import { independentProjectsData, workProjectsData } from '../../../data';
import '../preview.scss';

const DEMO_SKILLS = Object.entries(
  [...workProjectsData, ...independentProjectsData].reduce<
    Record<string, number>
  >((a, c) => {
    c.tools.forEach((t) => {
      a[t] = (a[t] ?? 0) + 1;
    });
    return a;
  }, {}),
);

export function CombinationsSection() {
  const [sidebarPage, setSidebarPage] = useState('work');
  const [sidebarShowTools, setSidebarShowTools] = useState(false);
  const [sidebarUl, setSidebarUl] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <>
      <TierLabel>Combinations</TierLabel>
      <div className="preview-note" style={{ marginBottom: 'var(--space-md)' }}>
        Real compositions — Page wraps content with color-bg + space-lg. Cards
        are surfaces inside it.
      </div>

      <SectionLabel>Search bar — Input + Button inline</SectionLabel>
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-xs)',
          alignItems: 'center',
          maxWidth: 380,
          marginBottom: 'var(--space-md)',
        }}
      >
        <Input placeholder="Search projects…" style={{ flex: 1 }} />
        <Button
          variant="primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-xxs)',
            flexShrink: 0,
          }}
        >
          <Icon name="arrow" /> Go
        </Button>
      </div>

      <SectionLabel>Login card — Card → FormField × 2 + Button</SectionLabel>
      <Card style={{ maxWidth: 300, marginBottom: 'var(--space-md)' }}>
        <h4
          style={{
            margin: 0,
            marginBottom: 'var(--space-md)',
            color: 'var(--color-text)',
          }}
        >
          Sign in
        </h4>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
          }}
        >
          <FormField
            label="Email"
            inputProps={{ placeholder: 'you@example.com', type: 'email' }}
          />
          <FormField
            label="Password"
            inputProps={{ placeholder: '••••••••', type: 'password' }}
            hint="Forgot password?"
          />
        </div>
        <Button
          variant="primary"
          style={{
            width: '100%',
            marginTop: 'var(--space-md)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Sign in
        </Button>
      </Card>

      <SectionLabel>
        Notification card — Card → Icon + text + actions
      </SectionLabel>
      <Card style={{ maxWidth: 340, marginBottom: 'var(--space-md)' }}>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name="star" size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                color: 'var(--color-text)',
                fontSize: 14,
              }}
            >
              New project starred
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--color-muted)',
                margin: 'var(--space-xxs) 0 var(--space-sm)',
              }}
            >
              SpecLab was starred by 3 people this week.
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              <Button variant="primary" style={{ fontSize: 12 }}>
                View
              </Button>
              <Button variant="outline" style={{ fontSize: 12 }}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </Card>

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

      <SectionLabel>
        PushPanel — sidebar that pushes content (stacked letter tab label)
      </SectionLabel>
      <div
        style={{
          height: 200,
          overflow: 'hidden',
          border: '1px dashed rgba(128,128,128,0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-sm)',
          display: 'flex',
        }}
      >
        <PushPanel label="design" width={200}>
          <div
            style={{
              padding: 'var(--space-sm)',
              fontSize: 11,
              color: 'var(--color-text)',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
              Panel content
            </div>
            <div style={{ color: 'var(--color-muted)', lineHeight: 1.6 }}>
              Token controls, color pickers, sliders…
            </div>
          </div>
        </PushPanel>
        <div
          style={{
            flex: 1,
            padding: 'var(--space-sm)',
            fontSize: 11,
            color: 'var(--color-muted)',
          }}
        >
          ← panel pushes content right; tab uses stacked letters + &gt; / &lt;
          caret
        </div>
      </div>
      <div className="preview-note" style={{ marginBottom: 'var(--space-lg)' }}>
        Live panel at{' '}
        <code
          style={{
            background: 'var(--color-accent)',
            borderRadius: 3,
            padding: '1px 4px',
          }}
        >
          ianrios.me/
        </code>{' '}
        — tab stacks letter-by-letter, no writing-mode rotation.
      </div>

      <SectionLabel>PortfolioSidebar — full nav organism</SectionLabel>
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-md)',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-md)',
        }}
      >
        <div
          className="skeu-card"
          style={{
            padding: 'var(--space-sm)',
            width: 'var(--sidebar-width)',
            flexShrink: 0,
          }}
        >
          <PortfolioSidebar
            page={sidebarPage}
            setPage={setSidebarPage}
            showTools={sidebarShowTools}
            setShowTools={setSidebarShowTools}
            ul={sidebarUl}
            setUl={setSidebarUl}
            setModalShow={() => {
              setContactModalOpen(true);
            }}
            skills={DEMO_SKILLS}
            workVisible
          />
        </div>
        <div
          style={{
            flex: 1,
            fontSize: 12,
            color: 'var(--color-muted)',
            paddingTop: 'var(--space-sm)',
          }}
        >
          Active tab:{' '}
          <strong style={{ color: 'var(--color-text)' }}>{sidebarPage}</strong>
        </div>
      </div>

      <SectionLabel>ContactModal — card overlay</SectionLabel>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <Button
          variant="outline"
          onClick={() => {
            setContactModalOpen(true);
          }}
        >
          Open contact modal
        </Button>
        <ContactModal
          show={contactModalOpen}
          onHide={() => {
            setContactModalOpen(false);
          }}
        />
      </div>
    </>
  );
}
