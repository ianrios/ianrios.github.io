import { TokenSidebar } from './admin/TokenSidebar';
import { DSPreview } from './admin/DSPreview';
import { THEMES } from './admin/adminData';
import { PushPanel } from '../components/organisms/PushPanel';
import { Heading } from '../components/atoms/Heading';
import { Stack } from '../components/atoms/Stack';
import { Text } from '../components/atoms/Text';
import { ScrollArea } from '../components/molecules/ScrollArea';
import { useDesignVars } from '../hooks/designVarsContext';
import { useDesignPanel } from '../hooks/designPanelContext';

function Admin() {
  const { vars, setVar, activeTheme, applyTheme, resetAll, exportText } =
    useDesignVars();
  const { open, setOpen } = useDesignPanel();

  const tokenSidebarProps = {
    vars,
    setVar,
    themes: THEMES,
    activeTheme,
    applyTheme,
    resetAll,
  };

  return (
    <Stack
      direction="col"
      height="100vh"
      overflow="hidden"
      className="skeu-admin-page"
    >
      <Stack direction="row" flex="1" overflow="hidden">
        <PushPanel
          label="controls"
          width="clamp(320px, 22vw, 440px)"
          tabVariant="rotated"
          open={open}
          onOpenChange={setOpen}
        >
          <TokenSidebar {...tokenSidebarProps} />
        </PushPanel>

        <ScrollArea flex="1">
          <Stack direction="col" padding="lg">
            <Heading level={2} className="skeu-admin-section-heading">
              Design System
            </Heading>
            <Text className="skeu-admin-section-desc">
              Edits apply to the whole page instantly and persist to
              localStorage.
            </Text>
            <DSPreview exportText={exportText} />
          </Stack>
        </ScrollArea>
      </Stack>
    </Stack>
  );
}

export default Admin;
