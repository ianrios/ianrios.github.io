import { useState } from 'react';
import { Main } from './Home';
import { TokenSidebar } from './admin/TokenSidebar';
import { DSPreview } from './admin/DSPreview';
import { V2Preview } from './admin/V2Preview';
import { THEMES } from './admin/adminData';
import { PushPanel } from '../components/organisms/PushPanel';
import { Button } from '../components/atoms/Button';
import { Heading } from '../components/atoms/Heading';
import { Stack } from '../components/atoms/Stack';
import { Text } from '../components/atoms/Text';
import { ScrollArea } from '../components/molecules/ScrollArea';
import { useDesignVars } from '../hooks/designVarsContext';

const TABS = [
  { id: 'design', label: 'Design System' },
  { id: 'v2', label: 'Portfolio v2 Preview' },
  { id: 'home', label: 'Home (live)' },
];

function Admin() {
  const [activeView, setActiveView] = useState('design');

  const { vars, setVar, activeTheme, applyTheme, resetAll, exportText } =
    useDesignVars();

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
          defaultOpen
          width="clamp(320px, 22vw, 440px)"
          tabVariant="rotated"
        >
          <TokenSidebar {...tokenSidebarProps} />
        </PushPanel>

        <ScrollArea flex="1">
          <header className="skeu-design-system-topbar">
            <Button
              as="link"
              href="/"
              routerState={{ view: 'main' }}
              size="xs"
              color="muted"
              variant="surface"
            >
              ← Portfolio
            </Button>
            <span className="skeu-design-system-topbar__title">
              Design System
            </span>
          </header>

          <Stack direction="col" padding="lg">
            <Heading level={2} className="skeu-admin-section-heading">
              Design System
            </Heading>
            <Text className="skeu-admin-section-desc">
              Edits apply to the whole page instantly and persist to
              localStorage.
            </Text>
            <Stack direction="row" gap="xs" flex="wrap">
              {TABS.map(({ id, label }) => (
                <Button
                  key={id}
                  variant={activeView === id ? 'solid' : 'outline'}
                  onClick={() => {
                    setActiveView(id);
                  }}
                >
                  {label}
                </Button>
              ))}
            </Stack>

            {activeView === 'design' && <DSPreview exportText={exportText} />}
            {activeView === 'v2' && <V2Preview />}
            {activeView === 'home' && (
              <div className="skeu-admin-preview-wrap">
                <Main initialView="main" />
              </div>
            )}
          </Stack>
        </ScrollArea>
      </Stack>
    </Stack>
  );
}

export default Admin;
