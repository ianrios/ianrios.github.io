import { DSPreview } from './admin/DSPreview';
import { Heading } from '../components/atoms/Heading';
import { Stack } from '../components/atoms/Stack';
import { Text } from '../components/atoms/Text';
import { ScrollArea } from '../components/molecules/ScrollArea';
import { useDesignVars } from '../hooks/designVarsContext';

// The design push-panel (TokenSidebar included) lives in PanelLayout now
// (one shared instance) - Admin only renders what goes inside its flex-1
// content column, the live component preview tree.
function Admin() {
  const { exportText } = useDesignVars();

  return (
    <ScrollArea flex="1">
      <Stack direction="col" padding="lg">
        <Heading level={2} className="skeu-admin-section-heading">
          Design System
        </Heading>
        <Text className="skeu-admin-section-desc">
          Edits apply to the whole page instantly and persist to localStorage.
        </Text>
        <DSPreview exportText={exportText} />
      </Stack>
    </ScrollArea>
  );
}

export default Admin;
