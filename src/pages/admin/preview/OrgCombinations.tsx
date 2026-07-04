import { useState } from 'react';
import { Button } from '../../../components/atoms/Button';
import { Card } from '../../../components/molecules/Card';
import { PortfolioSidebar } from '../../../components/organisms/PortfolioSidebar';
import { ContactModal } from '../../../components/organisms/ContactModal';
import { SectionLabel } from '../AdminUI';
import { independentProjectsData, workProjectsData } from '../../../data';

const DEMO_SKILLS = Object.entries(
  [...workProjectsData, ...independentProjectsData].reduce<
    Record<string, number>
  >((a, c) => {
    c.tools.forEach((t) => {
      a[t] = (a[t] ?? 0) + 1;
    });
    return a;
  }, {}),
);

export function OrgCombinations() {
  const [sidebarPage, setSidebarPage] = useState('work');
  const [sidebarShowTools, setSidebarShowTools] = useState(false);
  const [sidebarUl, setSidebarUl] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <>
      <SectionLabel>PortfolioSidebar — full nav organism</SectionLabel>
      <div className="skeu-org-sidebar-demo">
        <div className="skeu-org-sidebar-demo__nav">
          <Card padding="sm">
            <PortfolioSidebar
              page={sidebarPage}
              setPage={setSidebarPage}
              showTools={sidebarShowTools}
              setShowTools={setSidebarShowTools}
              ul={sidebarUl}
              setUl={setSidebarUl}
              setModalShow={() => {
                setContactModalOpen(true);
              }}
              skills={DEMO_SKILLS}
              workVisible
            />
          </Card>
        </div>
        <div className="skeu-org-sidebar-demo__info">
          Active tab:{' '}
          <strong className="skeu-preview-strong">{sidebarPage}</strong>
        </div>
      </div>

      <SectionLabel>ContactModal — card overlay</SectionLabel>
      <div className="skeu-preview-section">
        <Button
          variant="outline"
          onClick={() => {
            setContactModalOpen(true);
          }}
        >
          Open contact modal
        </Button>
        <ContactModal
          show={contactModalOpen}
          onHide={() => {
            setContactModalOpen(false);
          }}
        />
      </div>
    </>
  );
}
