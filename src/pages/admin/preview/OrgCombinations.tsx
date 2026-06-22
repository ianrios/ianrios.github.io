import { useState } from 'react';
import { Button } from '../../../components/atoms/Button';
import { PushPanel } from '../../../components/organisms/PushPanel';
import { PortfolioSidebar } from '../../../components/organisms/PortfolioSidebar';
import { ContactModal } from '../../../components/organisms/ContactModal';
import { SectionLabel } from '../AdminUI';
import { independentProjectsData, workProjectsData } from '../../../data';
import '../preview.scss';

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
      <SectionLabel>
        PushPanel — sidebar that pushes content (stacked letter tab label)
      </SectionLabel>
      <div
        style={{
          height: 200,
          overflow: 'hidden',
          border: '1px dashed rgba(128,128,128,0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-sm)',
          display: 'flex',
        }}
      >
        <PushPanel label="design" width={200}>
          <div
            style={{
              padding: 'var(--space-sm)',
              fontSize: 11,
              color: 'var(--color-text)',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
              Panel content
            </div>
            <div style={{ color: 'var(--color-muted)', lineHeight: 1.6 }}>
              Token controls, color pickers, sliders…
            </div>
          </div>
        </PushPanel>
        <div
          style={{
            flex: 1,
            padding: 'var(--space-sm)',
            fontSize: 11,
            color: 'var(--color-muted)',
          }}
        >
          ← panel pushes content right; tab uses stacked letters + &gt; / &lt;
          caret
        </div>
      </div>
      <div className="preview-note" style={{ marginBottom: 'var(--space-lg)' }}>
        Live panel at{' '}
        <code
          style={{
            background: 'var(--color-accent)',
            borderRadius: 3,
            padding: '1px 4px',
          }}
        >
          ianrios.me/
        </code>{' '}
        — tab stacks letter-by-letter, no writing-mode rotation.
      </div>

      <SectionLabel>PortfolioSidebar — full nav organism</SectionLabel>
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-md)',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-md)',
        }}
      >
        <div
          className="skeu-card"
          style={{
            padding: 'var(--space-sm)',
            width: 'var(--sidebar-width)',
            flexShrink: 0,
          }}
        >
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
        </div>
        <div
          style={{
            flex: 1,
            fontSize: 12,
            color: 'var(--color-muted)',
            paddingTop: 'var(--space-sm)',
          }}
        >
          Active tab:{' '}
          <strong style={{ color: 'var(--color-text)' }}>{sidebarPage}</strong>
        </div>
      </div>

      <SectionLabel>ContactModal — card overlay</SectionLabel>
      <div style={{ marginBottom: 'var(--space-md)' }}>
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
