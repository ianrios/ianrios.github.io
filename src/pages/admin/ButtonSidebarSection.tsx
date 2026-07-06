import { TokenControlList } from './TokenControls';
import { controlList } from '../../styles/token-registry';
import type { CSSTokenMap } from '../../types/admin';

const BTN_COLOR_VARS = controlList('button', 'color').map((c) => c.varName);
const BTN_SHAPE_VARS = controlList('button', 'range').map((c) => c.varName);

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
      <TokenControlList varNames={BTN_COLOR_VARS} vars={vars} setVar={setVar} />
      <div className="skeu-control-sublabel">Shape</div>
      <TokenControlList varNames={BTN_SHAPE_VARS} vars={vars} setVar={setVar} />
    </>
  );
}
