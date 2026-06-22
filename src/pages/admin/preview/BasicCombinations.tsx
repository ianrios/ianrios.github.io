import { Button } from '../../../components/atoms/Button';
import { Icon } from '../../../components/atoms/Icon';
import { Input } from '../../../components/atoms/Input';
import { Card } from '../../../components/molecules/Card';
import { FormField } from '../../../components/molecules/FormField';
import { SectionLabel } from '../AdminUI';
import '../preview.scss';

export function BasicCombinations() {
  return (
    <>
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
    </>
  );
}
