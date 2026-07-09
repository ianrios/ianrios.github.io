import { Card } from '../molecules/Card';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

export function CookieConsent({
  visible,
  onAccept,
  onDecline,
}: {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  if (!visible) return null;

  return (
    <div className="skeu-cookie-consent">
      <Card maxWidth={420}>
        <Text className="skeu-cookie-consent__text">
          This site uses Firebase Analytics to understand visitor traffic. You
          can accept or decline - declining means no analytics load.
        </Text>
        <div className="skeu-cookie-consent__actions">
          <Button variant="chisel" size="sm" onClick={onDecline}>
            Decline
          </Button>
          <Button variant="outline" size="sm" onClick={onAccept}>
            Accept
          </Button>
        </div>
      </Card>
    </div>
  );
}
