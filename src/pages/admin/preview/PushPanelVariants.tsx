import {
  PushPanel,
  type PushPanelTabVariant,
} from '../../../components/organisms/PushPanel';
import { SectionLabel } from '../AdminUI';

const DEMO_CONTENT = (
  <div className="skeu-push-demo-content">
    <div className="skeu-push-demo-content__title">Panel content</div>
    <div className="skeu-push-demo-content__desc">Token controls, sliders…</div>
  </div>
);

function VariantDemo({
  variant,
  label,
}: {
  variant: PushPanelTabVariant;
  label: string;
}) {
  return (
    <div>
      <div className="skeu-combo-page-label">{label}</div>
      <div className="skeu-push-frame">
        <PushPanel tabVariant={variant} label="design" width={140}>
          {DEMO_CONTENT}
        </PushPanel>
        <div className="skeu-push-frame__aside">← open tab to expand</div>
      </div>
    </div>
  );
}

function HeaderDemo() {
  return (
    <div>
      <div className="skeu-combo-page-label">
        With header slot (non-scrolling)
      </div>
      <div className="skeu-push-frame">
        <PushPanel
          label="panel"
          width={160}
          defaultOpen
          header={
            <div className="skeu-push-frame__header-slot">
              ← nav link / title
            </div>
          }
        >
          {DEMO_CONTENT}
        </PushPanel>
        <div className="skeu-push-frame__aside">
          header stays fixed; body scrolls
        </div>
      </div>
    </div>
  );
}

export function PushPanelVariants() {
  return (
    <>
      <SectionLabel>PushPanel: tab variant comparison (pick one)</SectionLabel>
      <div className="skeu-push-grid">
        <VariantDemo variant="stacked" label="Original: stacked letters" />
        <VariantDemo variant="rotated" label="A: rotated text + chevron" />
        <VariantDemo variant="grip" label="B: grip handle + chevron" />
        <VariantDemo variant="pill" label="C: pill, chevron only" />
      </div>

      <SectionLabel>PushPanel: header prop</SectionLabel>
      <div className="skeu-push-grid--header">
        <HeaderDemo />
        <div className="skeu-push-grid__desc">
          <code className="skeu-code-inline">header</code> renders above the
          scrollable body in a fixed zone, ideal for back links, panel titles,
          or persistent actions. The body scrolls independently beneath it.
        </div>
      </div>
    </>
  );
}
