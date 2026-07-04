import { PortfolioSidebar } from '../components/organisms/PortfolioSidebar';
import { Button } from '../components/atoms/Button';
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
    <div className="skeu-mobile-drawer">
      <div
        role="presentation"
        className="skeu-mobile-drawer__overlay"
        onClick={() => {
          setMobileNavOpen(false);
        }}
      />
      <div className="skeu-mobile-drawer__panel">
        <div className="skeu-mobile-drawer__header">
          <h1 className="skeu-mobile-drawer__heading">Ian Rios</h1>
          <Button
            icon="close"
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
