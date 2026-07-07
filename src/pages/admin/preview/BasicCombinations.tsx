import { Button } from '../../../components/atoms/Button';
import { Icon } from '../../../components/atoms/Icon';
import { Input } from '../../../components/atoms/Input';
import { Card } from '../../../components/molecules/Card';
import { FormField } from '../../../components/molecules/FormField';
import { Heading } from '../../../components/atoms/Heading';
import { SectionLabel } from '../AdminUI';
export function BasicCombinations() {
  return (
    <>
      <SectionLabel>Search bar: Input + Button inline</SectionLabel>
      <div className="skeu-combo-searchbar">
        <div className="skeu-combo-searchbar__input">
          <Input placeholder="Search projects…" fullWidth />
        </div>
        <Button variant="solid" size="xs">
          <Icon name="arrow" /> Go
        </Button>
      </div>

      <SectionLabel>Login card: Card → FormField × 2 + Button</SectionLabel>
      <div className="skeu-combo-section">
        <Card maxWidth={300}>
          <Heading level={4} className="skeu-combo-card-heading">
            Sign in
          </Heading>
          <div className="skeu-combo-form">
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
          <div className="skeu-combo-card-action-row">
            <Button variant="solid" fullWidth justify="center">
              Sign in
            </Button>
          </div>
        </Card>
      </div>

      <SectionLabel>
        Notification card: Card → Icon + text + actions
      </SectionLabel>
      <div className="skeu-combo-section">
        <Card maxWidth={340}>
          <div className="skeu-combo-notif">
            <div className="skeu-combo-notif__icon">
              <Icon name="star" size={18} />
            </div>
            <div className="skeu-combo-notif__body">
              <div className="skeu-combo-notif__title">New project starred</div>
              <div className="skeu-combo-notif__desc">
                SpecLab was starred by 3 people this week.
              </div>
              <div className="skeu-combo-notif__actions">
                <Button variant="solid" size="xs">
                  View
                </Button>
                <Button variant="outline" size="xs">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
