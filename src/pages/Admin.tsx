import { useState } from 'react';
import { Main } from './Home';
import { TokenSidebar } from './admin/TokenSidebar';
import { DSPreview } from './admin/DSPreview';
import { V2Preview } from './admin/V2Preview';
import { THEMES } from './admin/adminData';
import { PushPanel } from '../components/organisms/PushPanel';
import { Button } from '../components/atoms/Button';
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
    <div className="skeu-admin-page">
      {/* Main row: controls panel (own region) + scrolling content column */}
      <div className="skeu-admin-main">
        <PushPanel
          label="controls"
          defaultOpen
          width="clamp(320px, 22vw, 440px)"
          tabVariant="rotated"
        >
          <TokenSidebar {...tokenSidebarProps} />
        </PushPanel>

        <div className="skeu-admin-content">
          {/* Sticky header on the content side — content scrolls behind it */}
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

          <div className="skeu-admin-content__body">
            <h2 className="skeu-admin-section-heading">Design System</h2>
            <p className="skeu-admin-section-desc">
              Edits apply to the whole page instantly and persist to
              localStorage.
            </p>
            <div className="skeu-admin-tabs">
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
            </div>

            {activeView === 'design' && <DSPreview exportText={exportText} />}
            {activeView === 'v2' && <V2Preview />}
            {activeView === 'home' && (
              <div className="skeu-admin-preview-wrap">
                <Main initialView="main" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
