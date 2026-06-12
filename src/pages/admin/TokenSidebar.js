import React, { useState } from "react";
import { Button } from "../../components/atoms/Button";
import { Badge } from "../../components/atoms/Badge";
import { Icon } from "../../components/atoms/Icon";
import { Slider } from "../../components/atoms/Slider";
import { ValueInput } from "../../components/atoms/ValueInput";
import { ColorPicker } from "../../components/atoms/ColorPicker";
import { isHexColor, hexToRgb } from "./colorUtils";

function SidebarSection({ title, badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 6, borderRadius: "var(--radius-sm)", border: "1px solid rgba(128,128,128,0.14)", overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} className="skeu-accordion-btn">
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Badge style={{ flexShrink: 0, fontSize: 9, padding: "1px 6px" }}>{badge}</Badge>
          <span style={{ fontWeight: 600 }}>{title}</span>
        </span>
        <Icon name={open ? "chevron-down" : "chevron-up"} size={11} />
      </button>
      {open && (
        <div style={{ padding: "10px 12px 14px", borderTop: "1px solid rgba(128,128,128,0.10)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ColorControl({ label, varName, vars, setVar }) {
  const raw = vars[varName] || "";
  const isHex = isHexColor(raw.trim());
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <span style={{ width: 120, flexShrink: 0, fontSize: 12, color: "var(--color-text)" }}>{label}</span>
      <ColorPicker
        value={isHex ? raw.trim() : "#000000"}
        onChange={(e) => setVar(varName, e.target.value)}
        title={varName}
      />
      <ValueInput
        value={raw}
        onChange={(e) => setVar(varName, e.target.value)}
        spellCheck={false}
        style={{ flex: 1 }}
      />
    </div>
  );
}

function RangeControl({ label, varName, vars, setVar, min = 0, max }) {
  const val = parseInt(vars[varName]) || 0;
  return (
    <Slider
      label={label}
      min={min}
      max={max}
      value={val}
      onChange={(e) => setVar(varName, `${e.target.value}px`)}
      unit="px"
      style={{ marginBottom: 8 }}
    />
  );
}

function ShadowControl({ label, varName, vars, setVar }) {
  const val = vars[varName] || "";
  const rgbMatch = val.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  const hexColor = rgbMatch
    ? `#${parseInt(rgbMatch[1]).toString(16).padStart(2,"0")}${parseInt(rgbMatch[2]).toString(16).padStart(2,"0")}${parseInt(rgbMatch[3]).toString(16).padStart(2,"0")}`
    : "#888888";
  const handleColorPick = (newHex) => {
    const rgb = hexToRgb(newHex);
    if (!rgb) return;
    const updated = val.replace(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/i, `rgba(${rgb.join(",")}`);
    setVar(varName, updated || val);
  };
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ width: 120, flexShrink: 0, fontSize: 12, color: "var(--color-text)" }}>{label}</span>
        <ColorPicker value={hexColor} onChange={(e) => handleColorPick(e.target.value)} title="Pick color (preserves alpha & offsets)" />
        <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--color-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{hexColor}</span>
      </div>
      <ValueInput
        value={val}
        onChange={(e) => setVar(varName, e.target.value)}
        spellCheck={false}
        style={{ width: "100%" }}
      />
    </div>
  );
}

function ColorSwatches({ presetName, presets }) {
  const preset = presets.find((p) => p.name === presetName);
  if (!preset) return null;
  const hexColors = Object.values(preset.vars).filter((v) => isHexColor((v || "").trim()));
  return (
    <div style={{ display: "flex", gap: 3, marginTop: 4, marginBottom: 4 }}>
      {hexColors.map((c, i) => (
        <div key={i} title={c} style={{ width: 14, height: 14, borderRadius: 3, background: c, border: "1px solid rgba(0,0,0,0.15)", flexShrink: 0 }} />
      ))}
    </div>
  );
}

function PresetSelect({ label, presets, active, vars, onSelect }) {
  const preset = presets.find((p) => p.name === active);
  const isDirty = preset != null && Object.entries(preset.vars).some(([k, v]) => vars[k] !== v);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ width: 120, flexShrink: 0, fontSize: 12, color: "var(--color-text)" }}>
          {label}{isDirty && <span title="Modified" style={{ marginLeft: 5, color: "#e07b2a", fontWeight: 700, fontSize: 14 }}>*</span>}
        </span>
        <select
          style={{ flex: 1, fontSize: 13, padding: "4px 6px", background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid rgba(128,128,128,0.25)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
          value={active || ""}
          onChange={(e) => onSelect(e.target.value || null)}
        >
          <option value="">— choose —</option>
          {presets.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
      </div>
      <ColorSwatches presetName={active} presets={presets} />
    </div>
  );
}

export function TokenSidebar({
  vars, setVar, colorPresets, shapePresets, elevationPresets,
  activeColorPreset, applyColorPreset, activeShapePreset, applyShapePreset,
  elevationLevel, applyElevation, customElevation, setCustomElevation,
  recomputeDepthShadows, autoPopShadows,
  warmFound, warmKeys, autoFixWarmTones, setWarmFound, setWarmKeys,
  sidebarStyle,
}) {
  return (
    <aside style={{ width: 360, flexShrink: 0, overflow: "auto", maxHeight: "calc(100vh - 180px)", paddingRight: 6, ...sidebarStyle }}>

      <SidebarSection title="Presets" badge="preset">
        <PresetSelect label="Color preset" presets={colorPresets} active={activeColorPreset} vars={vars} onSelect={applyColorPreset} />
        <PresetSelect label="Shape preset" presets={shapePresets} active={activeShapePreset} vars={vars} onSelect={applyShapePreset} />
      </SidebarSection>

      <SidebarSection title="Colors" badge="global">
        <ColorControl label="Background"  varName="--color-bg"      vars={vars} setVar={setVar} />
        <ColorControl label="Surface"     varName="--color-surface" vars={vars} setVar={setVar} />
        <ColorControl label="Accent"      varName="--color-accent"  vars={vars} setVar={setVar} />
        <ColorControl label="Muted"       varName="--color-muted"   vars={vars} setVar={setVar} />
        <ColorControl label="Text"        varName="--color-text"    vars={vars} setVar={setVar} />
      </SidebarSection>

      <SidebarSection title="Spacing" badge="global" defaultOpen={false}>
        <RangeControl label="XXS — badge, tiny"    varName="--space-xxs" vars={vars} setVar={setVar} min={1}  max={12} />
        <RangeControl label="XS — gaps, icons"     varName="--space-xs"  vars={vars} setVar={setVar} min={2}  max={20} />
        <RangeControl label="SM — input, nav"      varName="--space-sm"  vars={vars} setVar={setVar} min={4}  max={48} />
        <RangeControl label="MD — card pad, gap"   varName="--space-md"  vars={vars} setVar={setVar} min={4}  max={64} />
        <RangeControl label="LG — page, btn-lg"    varName="--space-lg"  vars={vars} setVar={setVar} min={8}  max={80} />
      </SidebarSection>

      <SidebarSection title="Radii" badge="global" defaultOpen={false}>
        <RangeControl label="Radius SM" varName="--radius-sm" vars={vars} setVar={setVar} min={0} max={24} />
        <RangeControl label="Radius MD" varName="--radius-md" vars={vars} setVar={setVar} min={0} max={40} />
        <RangeControl label="Radius LG" varName="--radius-lg" vars={vars} setVar={setVar} min={0} max={48} />
      </SidebarSection>

      <SidebarSection title="Motion" badge="global">
        <Slider
          label="Anim speed"
          min={0}
          max={800}
          step={25}
          value={Math.round((parseFloat(vars["--anim-speed"]) || 0.12) * 1000)}
          onChange={(e) => setVar("--anim-speed", `${(parseInt(e.target.value) / 1000).toFixed(2)}s`)}
          unit="ms"
          style={{ marginBottom: 8 }}
        />
      </SidebarSection>

      <SidebarSection title="Button" badge="atom">
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Color</div>
        <ColorControl label="Fill text"      varName="--btn-text-color"      vars={vars} setVar={setVar} />
        <ColorControl label="Gradient start" varName="--btn-gradient-start"  vars={vars} setVar={setVar} />
        <ColorControl label="Gradient end"   varName="--btn-gradient-end"    vars={vars} setVar={setVar} />

        <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 14, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Shape</div>
        <RangeControl label="Radius"    varName="--btn-radius"    vars={vars} setVar={setVar} min={0} max={50} />
        <RangeControl label="Padding Y" varName="--btn-padding-y" vars={vars} setVar={setVar} min={0} max={24} />
        <RangeControl label="Padding X" varName="--btn-padding-x" vars={vars} setVar={setVar} min={0} max={64} />

        <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 14, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Elevation</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {["low", "med", "high", "custom"].map((level) => (
            <Button key={level} variant={elevationLevel === level ? "primary" : "outline"} size="xs" onClick={() => applyElevation(level)}>{level}</Button>
          ))}
        </div>
        {elevationLevel === "custom" && (
          <ValueInput
            value={customElevation}
            onChange={(e) => { setCustomElevation(e.target.value); setVar("--btn-elevation", e.target.value); }}
            placeholder="e.g. 0 12px 24px rgba(0,0,0,0.15)"
            spellCheck={false}
            style={{ width: "100%", marginBottom: 6 }}
          />
        )}
        <div style={{ fontSize: 10, fontFamily: "monospace", marginBottom: 8, wordBreak: "break-all", color: "var(--color-muted)" }}>{vars["--btn-elevation"]}</div>
        <div style={{ display: "flex", gap: "var(--space-sm)", padding: "var(--space-sm) var(--space-xs) var(--space-lg)", background: "var(--color-bg)", borderRadius: "var(--radius-md)", border: "1px solid rgba(128,128,128,0.10)" }}>
          {Object.entries(elevationPresets).map(([lvl, shadow]) => (
            <div key={lvl} style={{ flex: 1, padding: "var(--space-sm)", background: "var(--color-surface)", borderRadius: "var(--radius-md)", boxShadow: shadow, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)" }}>{lvl}</div>
            </div>
          ))}
        </div>
      </SidebarSection>

      <SidebarSection title="Focus" badge="atom" defaultOpen={false}>
        <ColorControl label="Focus ring" varName="--focus-ring-color" vars={vars} setVar={setVar} />
        <RangeControl label="Ring width" varName="--focus-ring-width" vars={vars} setVar={setVar} min={0} max={12} />
      </SidebarSection>

      <SidebarSection title="Depth & Shadows" badge="global" defaultOpen={false}>
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 8, lineHeight: 1.4 }}>
          Color picker changes rgba() color only; offsets come from the angle. "Auto" derives both from the surface token.
        </div>
        <Slider
          label="Light angle"
          min={0}
          max={359}
          value={parseInt(vars["--shadow-angle"] || "315")}
          onChange={(e) => recomputeDepthShadows(parseInt(e.target.value))}
          unit="°"
          style={{ marginBottom: 8 }}
        />
        <ShadowControl label="Pop highlight"     varName="--pop-shadow-light"        vars={vars} setVar={setVar} />
        <ShadowControl label="Pop shadow"        varName="--pop-shadow-dark"         vars={vars} setVar={setVar} />
        <ShadowControl label="Active highlight"  varName="--inset-shadow-highlight"  vars={vars} setVar={setVar} />
        <Button variant="outline" size="sm" style={{ marginTop: 4 }} onClick={autoPopShadows}>Auto from surface</Button>
      </SidebarSection>

      <SidebarSection title="Links" badge="atom">
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 8, lineHeight: 1.4 }}>
          <strong style={{ color: "var(--color-text)" }}>Default</strong> — plain {'<a>'} tag text color only.<br />
          <strong style={{ color: "var(--color-text)" }}>Hover / Active</strong> — all interactive elements: plain anchors, surface links, nav buttons.
        </div>
        <ColorControl label="Default (anchors)" varName="--link-color"  vars={vars} setVar={setVar} />
        <ColorControl label="Hover"             varName="--link-hover"  vars={vars} setVar={setVar} />
        <ColorControl label="Active"            varName="--link-active" vars={vars} setVar={setVar} />
      </SidebarSection>

      {warmFound && (
        <div style={{ padding: 12, background: "var(--color-surface)", border: "2px solid #e07b2a", borderRadius: "var(--radius-md)", marginTop: 12, marginBottom: 12 }}>
          <strong style={{ color: "var(--color-text)" }}>Warm tones detected</strong>
          <div style={{ fontSize: 12, marginTop: 4, color: "var(--color-muted)" }}>{warmKeys.join(", ")}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <Button variant="primary" size="sm" onClick={autoFixWarmTones}>Auto-fix</Button>
            <Button variant="outline" size="sm" onClick={() => { setWarmFound(false); setWarmKeys([]); }}>Ignore</Button>
          </div>
        </div>
      )}
    </aside>
  );
}
