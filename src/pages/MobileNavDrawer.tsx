import { PortfolioSidebar } from '../components/organisms/PortfolioSidebar';
import { Button } from '../components/atoms/Button';
import { Heading } from '../components/atoms/Heading';
import type { PageId, SkillTuple } from '../types/data';

interface SidebarProps {
  page: PageId;
  setPage: (p: PageId) => void;
  showTools: boolean;
  setShowTools: (v: boolean) => void;
  linksOpen: boolean;
  setLinksOpen: (v: boolean) => void;
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
          <Heading level={1} className="skeu-mobile-drawer__heading">
            Ian Rios
          </Heading>
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
