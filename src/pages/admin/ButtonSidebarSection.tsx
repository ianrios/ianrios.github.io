import { ColorControl, RangeControl } from './TokenControls';
import { BTN_COLOR_CONTROLS, BTN_SHAPE_CONTROLS } from './token-sidebar-data';
import type { CSSTokenMap } from '../../types/admin';

export function ButtonSidebarSection({
  vars,
  setVar,
}: {
  vars: CSSTokenMap;
  setVar: (name: string, value: string) => void;
}) {
  return (
    <>
      <div className="skeu-control-sublabel">Color</div>
      {BTN_COLOR_CONTROLS.map((c) => (
        <ColorControl key={c.varName} {...c} vars={vars} setVar={setVar} />
      ))}
      <div className="skeu-control-sublabel">Shape</div>
      {BTN_SHAPE_CONTROLS.map((c) => (
        <RangeControl key={c.varName} {...c} vars={vars} setVar={setVar} />
      ))}
    </>
  );
}
