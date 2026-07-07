import { hobbyData } from '../../data';
import type { HobbyData } from '../../types/data';
import { Button } from '../../components/atoms/Button';
import { Heading } from '../../components/atoms/Heading';
import { Stack } from '../../components/atoms/Stack';
import { Text } from '../../components/atoms/Text';

function HobbyRow({ hobby }: { hobby: HobbyData }) {
  const meta = hobby.activelyMaintained
    ? `since ${hobby.year}`
    : `${hobby.year}`;
  return (
    <Stack direction="col" gap="xxs">
      <Stack direction="row" gap="xs" align="center">
        <Heading level={4} className="skeu-hobby__title">
          {hobby.title}
        </Heading>
        <Text as="span" size="xs" className="skeu-hobby__meta">
          {meta}
        </Text>
        {hobby.instagram !== '' && (
          <Button
            as="link"
            icon="instagram"
            href={hobby.instagram}
            aria-label={`${hobby.title} on Instagram`}
            variant="ghost"
          />
        )}
        {hobby.url !== '' && (
          <Button
            as="link"
            icon="external"
            href={hobby.url}
            aria-label={`${hobby.title} website`}
            variant="ghost"
          />
        )}
      </Stack>
      <Text size="sm" className="skeu-hobby__body">
        {hobby.body}
      </Text>
    </Stack>
  );
}

export function HobbiesView() {
  const personal = hobbyData.filter((h) => h.kind !== 'volunteering');
  const volunteering = hobbyData.filter((h) => h.kind === 'volunteering');

  return (
    <Stack direction="col" padding="md" className="skeu-hobbies">
      <Stack direction="col" gap="md">
        {personal.map((h) => (
          <HobbyRow key={h.title} hobby={h} />
        ))}
      </Stack>
      {volunteering.length > 0 && (
        <>
          <Heading level={3} className="skeu-hobbies__sublabel">
            volunteering & mentorship
          </Heading>
          <Stack direction="col" gap="md">
            {volunteering.map((h) => (
              <HobbyRow key={h.title} hobby={h} />
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
}
