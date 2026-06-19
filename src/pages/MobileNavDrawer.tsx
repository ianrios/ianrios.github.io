import { PortfolioSidebar } from '../components/organisms/PortfolioSidebar';
import { IconButton } from '../components/atoms/IconButton';
import type { SkillTuple } from '../types/data';

interface SidebarProps {
  page: string;
  setPage: (p: string) => void;
  showTools: boolean;
  setShowTools: (v: boolean) => void;
  ul: boolean;
  setUl: (v: boolean) => void;
  setModalShow: (v: boolean) => void;
  skills: SkillTuple[];
  workVisible: boolean;
}

export function MobileNavDrawer({
  mobileNavOpen,
  setMobileNavOpen,
  sidebarProps,
}: {
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
  sidebarProps: SidebarProps;
}) {
  if (!mobileNavOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div
        role="presentation"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--overlay-bg)',
        }}
        onClick={() => {
          setMobileNavOpen(false);
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 'var(--drawer-width)',
          background: 'var(--color-surface)',
          padding: 'var(--space-md)',
          overflowY: 'auto',
          zIndex: 201,
          boxShadow: 'var(--pop-shadow-dark)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
          }}
        >
          <h1 style={{ margin: 0 }}>Ian Rios</h1>
          <IconButton
            name="close"
            aria-label="Close navigation"
            onClick={() => {
              setMobileNavOpen(false);
            }}
          />
        </div>
        <PortfolioSidebar
          {...sidebarProps}
          onClose={() => {
            setMobileNavOpen(false);
          }}
        />
      </div>
    </div>
  );
}
