import React, { useState } from "react";
import { Button } from "../../components/atoms/Button";
import { Badge } from "../../components/atoms/Badge";
import { Icon, ICON_MAP } from "../../components/atoms/Icon";
import { IconButton } from "../../components/atoms/IconButton";
import { IconLink } from "../../components/atoms/IconLink";
import { Input } from "../../components/atoms/Input";
import { Link } from "../../components/atoms/Link";
import { Slider } from "../../components/atoms/Slider";
import { ValueInput } from "../../components/atoms/ValueInput";
import { ColorPicker } from "../../components/atoms/ColorPicker";
import { Card } from "../../components/molecules/Card";
import { Accordion } from "../../components/molecules/Accordion";
import { CardWithDropdown } from "../../components/molecules/CardWithDropdown";
import { NavBar } from "../../components/molecules/NavBar";
import { NavVertical } from "../../components/molecules/NavVertical";
import { NavVerticalSections } from "../../components/molecules/NavVerticalSections";
import { FormField } from "../../components/molecules/FormField";
import { PushPanel } from "../../components/organisms/PushPanel";
import { PortfolioSidebar } from "../../components/organisms/PortfolioSidebar";
import { ContactModal } from "../../components/organisms/ContactModal";
import { SectionLabel, TierLabel } from "./AdminUI";
import {
  BUTTON_VARIANTS, BUTTON_SIZES,
  BADGE_SAMPLES, CARD_GRID_DATA, ACCORDION_ITEMS,
  VERTICAL_NAV_SECTIONS, CARD_COLOR_VARIANTS,
} from "./adminData";
import { independentProjectsData, workProjectsData } from "../../data";

const DEMO_SKILLS = Object.entries(
  [...workProjectsData, ...independentProjectsData].reduce((a, c) => {
    c.tools.forEach((t) => { a[t] = (a[t] || 0) + 1; });
    return a;
  }, {})
);

// Static snapshots of hover / active states for state-row demos
const hoverStyle  = { transform: "translateY(1px) scale(0.997)", filter: "brightness(0.997)", boxShadow: "var(--pop-shadow-light), var(--pop-shadow-dark), var(--btn-elevation)" };
const activeStyle = { transform: "translateY(4px) scale(0.995)", boxShadow: "inset var(--inset-shadow-light, 6px 6px 10px rgba(0,0,0,0.04)), inset var(--inset-shadow-highlight, -4px -4px 8px rgba(255,255,255,0.85))" };

function ButtonStateRow({ label, cls }) {
  return (
    <div style={{ marginBottom: "var(--space-md)" }}>
      <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: "var(--space-xs)" }}>{label}</div>
      <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", alignItems: "flex-end" }}>
        {[["default", {}], ["hover", hoverStyle], ["active", activeStyle]].map(([state, extra]) => (
          <div key={state} style={{ textAlign: "center" }}>
            <button className={`skeu-btn ${cls}`} style={{ pointerEvents: "none", ...extra }}>{state}</button>
            <div style={{ fontSize: 10, color: "var(--color-muted)", marginTop: "var(--space-xxs)" }}>{state}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Link matrix row: one style variant × all color modifiers
const LINK_STYLES = [
  { label: "surface",           variantClass: "",                 desc: "default surface/button" },
  { label: "surface + underline", variantClass: "skeu-link--underline", desc: "surface + forced underline" },
  { label: "text",              variantClass: "skeu-link--text",  desc: "plain underlined text" },
  { label: "ghost",             variantClass: "skeu-link--ghost", desc: "color only, no decoration" },
];
const LINK_COLORS = [
  { label: "default", colorClass: "" },
  { label: "muted",   colorClass: "skeu-link--muted" },
  { label: "accent",  colorClass: "skeu-link--accent" },
  { label: "primary", colorClass: "skeu-link--primary" },
];

export function DSPreview({ exportText }) {
  const [sidebarPage, setSidebarPage]           = useState("work");
  const [sidebarShowTools, setSidebarShowTools] = useState(false);
  const [sidebarUl, setSidebarUl]               = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [sliderVal, setSliderVal]               = useState(40);
  const [inputVal, setInputVal]                 = useState("#39ff14");

  return (
    <>
      <div style={{ background: "var(--color-bg)", color: "var(--color-text)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(128,128,128,0.10)" }}>
        <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "var(--space-sm)" }}>
          Page — padding = space-lg · border-radius = radius-lg · bg = color-bg
        </div>

        {/* ── ATOMS ────────────────────────────────────────────────── */}
        <TierLabel>Atoms</TierLabel>

        {/* BUTTON — STYLE */}
        <SectionLabel>Button — style (gradient / primary / outline)</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "var(--space-md)" }}>
          {BUTTON_VARIANTS.map(({ label, cls, desc }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-xxs)" }}>
              <button className={`skeu-btn ${cls}`}>{label}</button>
              <span style={{ fontSize: 10, color: "var(--color-muted)", whiteSpace: "nowrap" }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* BUTTON — SIZE */}
        <SectionLabel>Button — size (xs / sm / md / lg / xl) — orthogonal to style</SectionLabel>
        {BUTTON_VARIANTS.map(({ label: varLabel, cls: varCls }) => (
          <div key={varLabel} style={{ marginBottom: "var(--space-sm)" }}>
            <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: "var(--space-xs)" }}>{varLabel || "gradient"}</div>
            <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", alignItems: "flex-end" }}>
              {BUTTON_SIZES.map(({ label: sizeLabel, cls: sizeCls }) => (
                <div key={sizeLabel} style={{ textAlign: "center" }}>
                  <button className={`skeu-btn ${varCls} ${sizeCls}`.trim()}>{sizeLabel}</button>
                  <div style={{ fontSize: 10, color: "var(--color-muted)", marginTop: 2 }}>{sizeLabel}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* BUTTON — STATES */}
        <SectionLabel>Button — states (default / hover / active)</SectionLabel>
        {BUTTON_VARIANTS.map(({ label, cls }) => (
          <ButtonStateRow key={label} label={label} cls={cls} />
        ))}

        {/* BADGE */}
        <SectionLabel>Badge</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-xs)", flexWrap: "wrap", alignItems: "center", marginBottom: "var(--space-md)" }}>
          {BADGE_SAMPLES.map((b) => <Badge key={b}>{b}</Badge>)}
          <Badge href="https://github.com/ianrios">linked badge</Badge>
        </div>

        {/* ICON (unicode) */}
        <SectionLabel>Icon — Unicode (inline / decorative)</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "var(--space-sm)" }}>
          {Object.entries(ICON_MAP).map(([name]) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Icon name={name} size={18} />
              <span style={{ fontSize: 9, color: "var(--color-muted)" }}>{name}</span>
            </div>
          ))}
        </div>

        {/* ICON (SVG) */}
        <SectionLabel>Icon — SVG repo icons</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "var(--space-md)" }}>
          {["github", "instagram", "info", "external", "send", "chevron-down", "chevron-up", "menu", "close"].map((name) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Icon name={name} size={18} />
              <span style={{ fontSize: 9, color: "var(--color-muted)" }}>{name}</span>
            </div>
          ))}
        </div>

        {/* ICONBUTTON */}
        <SectionLabel>IconButton — square icon-only button</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", alignItems: "center", marginBottom: "var(--space-md)" }}>
          <IconButton name="close" aria-label="Close" />
          <IconButton name="edit" aria-label="Edit" />
          <IconButton name="plus" variant="primary" aria-label="Add" />
          <IconButton name="send" aria-label="Send" />
          <IconButton name="menu" aria-label="Menu" />
        </div>

        {/* ICONLINK */}
        <SectionLabel>IconLink — square icon-only anchor</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", alignItems: "center", marginBottom: "var(--space-md)" }}>
          <IconLink name="github"    href="https://github.com/ianrios"            aria-label="GitHub" />
          <IconLink name="instagram" href="https://www.instagram.com/ian___rios"  aria-label="Instagram" />
          <IconLink name="external"  href="https://ianrios.me"                    aria-label="Open site" />
          <IconLink name="info"      href="#demo"                                 aria-label="Info" />
        </div>

        {/* LINK — full combination matrix */}
        <SectionLabel>Link — all combinations (style × color)</SectionLabel>
        <div style={{ marginBottom: "var(--space-md)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px repeat(4, 1fr)", gap: "var(--space-xs)", marginBottom: "var(--space-xs)" }}>
            <div style={{ fontSize: 10, color: "var(--color-muted)" }} />
            {LINK_COLORS.map(({ label }) => (
              <div key={label} style={{ fontSize: 10, color: "var(--color-muted)", fontWeight: 600, textAlign: "center" }}>{label}</div>
            ))}
          </div>
          {LINK_STYLES.map(({ label, variantClass, desc }) => (
            <div key={label} style={{ display: "grid", gridTemplateColumns: "110px repeat(4, 1fr)", gap: "var(--space-xs)", alignItems: "center", marginBottom: "var(--space-xs)" }}>
              <div style={{ fontSize: 10, color: "var(--color-muted)" }}>{label}</div>
              {LINK_COLORS.map(({ label: colorLabel, colorClass }) => {
                const cls = ["skeu-link", variantClass, colorClass].filter(Boolean).join(" ");
                return (
                  <div key={colorLabel} style={{ display: "flex", justifyContent: "center" }}>
                    <a href="#demo" className={cls} style={{ fontSize: 12 }}>link</a>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ fontSize: 10, color: "var(--color-muted)", marginTop: "var(--space-xs)", lineHeight: 1.6 }}>
            Style: surface = button-look · text = plain underline · ghost = color only<br />
            Color: default = <code>--link-color</code> (plain {'<a>'} default; surface links use <code>--color-text</code> by default) · muted · accent · primary<br />
            Hover/active state on all variants = <code>--link-hover</code> / <code>--link-active</code>
          </div>
        </div>

        {/* INPUT */}
        <SectionLabel>Input</SectionLabel>
        <div style={{ marginBottom: "var(--space-md)" }}>
          <Input placeholder="Text input (tab to see focus ring)" style={{ width: 300 }} />
        </div>

        {/* VALUE INPUT */}
        <SectionLabel>ValueInput — compact token editor input</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", marginBottom: "var(--space-md)", maxWidth: 340 }}>
          <ValueInput label="Hex color" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
          <ValueInput label="Elevation" value="0 8px 20px rgba(0,0,0,0.14)" onChange={() => {}} />
          <ValueInput label="Duration" value="0.12" suffix="s" onChange={() => {}} />
        </div>

        {/* SLIDER */}
        <SectionLabel>Slider — custom range input atom</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginBottom: "var(--space-md)", maxWidth: 340 }}>
          <Slider label="Opacity" min={0} max={100} value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} unit="%" />
          <Slider label="Radius" min={0} max={48} value={12} onChange={() => {}} unit="px" />
          <Slider label="Speed" min={0} max={800} step={25} value={120} onChange={() => {}} unit="ms" />
        </div>

        {/* COLOR PICKER */}
        <SectionLabel>ColorPicker — styled color input atom</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", alignItems: "center", marginBottom: "var(--space-md)" }}>
          <ColorPicker value="#39ff14" onChange={() => {}} title="Green" />
          <ColorPicker value="#4da6ff" onChange={() => {}} title="Blue" />
          <ColorPicker value="#ff4444" onChange={() => {}} title="Red" />
          <ColorPicker value="#ffdd00" onChange={() => {}} title="Yellow" />
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>border = --border-color · radius = --radius-sm · hover/active = link tokens</span>
        </div>

        {/* ── MOLECULES ────────────────────────────────────────────── */}
        <TierLabel>Molecules</TierLabel>

        <SectionLabel>Form field</SectionLabel>
        <div style={{ maxWidth: 300, marginBottom: "var(--space-md)" }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text)", marginBottom: "var(--space-xxs)" }}>Email address</label>
          <Input placeholder="you@example.com" style={{ width: "100%" }} />
          <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: "var(--space-xxs)" }}>We'll never share your email.</div>
        </div>

        <SectionLabel>Card — primary actions</SectionLabel>
        <Card style={{ maxWidth: 320, marginBottom: "var(--space-md)" }}>
          <h4 style={{ margin: 0, color: "var(--color-text)" }}>Card title</h4>
          <p style={{ fontSize: 14, margin: "var(--space-xs) 0", color: "var(--color-muted)" }}>Surface container: pop shadows + token-aware padding and radius.</p>
          <div style={{ display: "flex", gap: "var(--space-xxs)", flexWrap: "wrap", marginBottom: "var(--space-xs)" }}>
            <Badge>tag-one</Badge>
            <Badge>tag-two</Badge>
          </div>
          <div style={{ display: "flex", gap: "var(--space-xs)" }}>
            <Button variant="primary" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xxs)" }}><Icon name="check" /> Save</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </Card>

        <SectionLabel>Card — surface actions</SectionLabel>
        <Card style={{ maxWidth: 320, marginBottom: "var(--space-md)" }}>
          <h4 style={{ margin: 0, color: "var(--color-text)" }}>Settings</h4>
          <p style={{ fontSize: 14, margin: "var(--space-xs) 0", color: "var(--color-muted)" }}>Surface links blend into the card background.</p>
          <div style={{ display: "flex", gap: "var(--space-xs)" }}>
            <a href="#demo" className="skeu-link skeu-btn--xs">Export</a>
            <a href="#demo" className="skeu-link skeu-btn--xs">Archive</a>
            <a href="#demo" className="skeu-link skeu-btn--xs" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xxs)" }}><Icon name="close" size={12} /> Delete</a>
          </div>
        </Card>

        <SectionLabel>Card — color variants</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", marginBottom: "var(--space-md)" }}>
          {CARD_COLOR_VARIANTS.map(({ label, variant, text }) => (
            <Card key={label} className={variant} style={{ color: text, minWidth: 140 }}>
              <div style={{ fontSize: 9, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--space-xxs)" }}>{label}</div>
              <div style={{ fontWeight: 700, color: "var(--color-text)" }}>Card title</div>
              <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: "var(--space-xxs)", marginBottom: "var(--space-xs)" }}>Subtitle line</div>
              <Badge>Tag</Badge>
              <div style={{ marginTop: "var(--space-xs)" }}>
                <a href="#demo" className="skeu-link skeu-btn--xs" style={{ fontSize: 12 }}>Surface link</a>
              </div>
            </Card>
          ))}
        </div>

        <SectionLabel>Card with accordion</SectionLabel>
        <Card style={{ maxWidth: 380, marginBottom: "var(--space-md)" }}>
          <h4 style={{ margin: 0, marginBottom: "var(--space-sm)", color: "var(--color-text)" }}>FAQ</h4>
          <Accordion items={ACCORDION_ITEMS} inline />
        </Card>

        <SectionLabel>Card with dropdown</SectionLabel>
        <div style={{ marginBottom: "var(--space-md)" }}>
          <CardWithDropdown />
        </div>

        <SectionLabel>Nav — horizontal (link-style)</SectionLabel>
        <div style={{ marginBottom: "var(--space-sm)" }}>
          <NavBar variant="links" pages={["home", "work"]} />
        </div>

        <SectionLabel>Nav — horizontal (interactive active state)</SectionLabel>
        <div style={{ marginBottom: "var(--space-md)" }}>
          <NavBar />
        </div>

        <SectionLabel>Nav — vertical (button variant)</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", marginBottom: "var(--space-sm)" }}>
          <NavVertical />
          <div style={{ flex: 1, fontSize: 12, color: "var(--color-muted)", paddingTop: "var(--space-sm)" }}>Raised surface buttons · click to set active</div>
        </div>

        <SectionLabel>Nav — vertical (link variant)</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
          <NavVertical variant="links" />
          <div style={{ flex: 1, fontSize: 12, color: "var(--color-muted)", paddingTop: "var(--space-sm)" }}>Flat link buttons — no elevation, accent bg on hover/active</div>
        </div>

        <SectionLabel>Accordion — standalone</SectionLabel>
        <div style={{ maxWidth: 380, marginBottom: "var(--space-lg)" }}>
          <Accordion items={ACCORDION_ITEMS} />
        </div>

        {/* ── ORGANISMS ────────────────────────────────────────────── */}
        <TierLabel>Organisms</TierLabel>

        <SectionLabel>Page / Layout</SectionLabel>
        <div style={{ background: "var(--color-bg)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "2px dashed rgba(128,128,128,0.18)", marginBottom: "var(--space-md)", position: "relative" }}>
          <div style={{ position: "absolute", top: 8, left: 14, fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--color-muted)" }}>Page</div>
          <div style={{ fontSize: 12, color: "var(--color-muted)", paddingTop: 4 }}>background = color-bg · padding = space-lg · border-radius = radius-lg</div>
        </div>

        <SectionLabel>Page with nav and card</SectionLabel>
        <div style={{ background: "var(--color-bg)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(128,128,128,0.10)", marginBottom: "var(--space-lg)" }}>
          <NavBar />
          <div style={{ marginTop: "var(--space-md)" }}>
            <Card style={{ maxWidth: 320 }}>
              <h4 style={{ margin: 0, color: "var(--color-text)" }}>Page content</h4>
              <p style={{ fontSize: 14, color: "var(--color-muted)", margin: "var(--space-xs) 0" }}>A surface card lives inside the page bg layer.</p>
              <Button variant="primary" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xxs)" }}><Icon name="arrow" /> Get started</Button>
            </Card>
          </div>
        </div>

        <SectionLabel>Card grid</SectionLabel>
        <div className="skeu-card-grid" style={{ marginBottom: "var(--space-lg)" }}>
          {CARD_GRID_DATA.map(({ title, desc, tools }) => (
            <Card key={title} style={{ padding: "var(--space-sm)" }}>
              <strong style={{ color: "var(--color-text)" }}>{title}</strong>
              <p style={{ margin: "var(--space-xxs) 0 var(--space-xs)", fontSize: 12, color: "var(--color-muted)" }}>{desc}</p>
              <div style={{ display: "flex", gap: "var(--space-xxs)", flexWrap: "wrap" }}>
                {tools.map((t) => <Badge key={t}>{t}</Badge>)}
              </div>
            </Card>
          ))}
        </div>

        <SectionLabel>Vertical nav with section accordion — button variant</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", marginBottom: "var(--space-sm)" }}>
          <NavVerticalSections sections={VERTICAL_NAV_SECTIONS} />
          <div style={{ flex: 1, fontSize: 12, color: "var(--color-muted)", paddingTop: "var(--space-sm)" }}>Raised outline buttons · click headers to expand/collapse</div>
        </div>

        <SectionLabel>Vertical nav with section accordion — link variant</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", marginBottom: "var(--space-lg)" }}>
          <NavVerticalSections sections={VERTICAL_NAV_SECTIONS} variant="links" />
          <div style={{ flex: 1, fontSize: 12, color: "var(--color-muted)", paddingTop: "var(--space-sm)" }}>Flat link buttons — no elevation, accent bg on hover/active</div>
        </div>

        {/* ── COMBINATIONS ─────────────────────────────────────────── */}
        <TierLabel>Combinations</TierLabel>
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: "var(--space-md)", lineHeight: 1.6 }}>
          Real compositions — Page wraps content with color-bg + space-lg. Cards are surfaces inside it.
        </div>

        <SectionLabel>Search bar — Input + Button inline</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center", maxWidth: 380, marginBottom: "var(--space-md)" }}>
          <Input placeholder="Search projects…" style={{ flex: 1 }} />
          <Button variant="primary" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xxs)", flexShrink: 0 }}><Icon name="arrow" /> Go</Button>
        </div>

        <SectionLabel>Login card — Card → FormField × 2 + Button</SectionLabel>
        <Card style={{ maxWidth: 300, marginBottom: "var(--space-md)" }}>
          <h4 style={{ margin: 0, marginBottom: "var(--space-md)", color: "var(--color-text)" }}>Sign in</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            <FormField label="Email" inputProps={{ placeholder: "you@example.com", type: "email" }} />
            <FormField label="Password" inputProps={{ placeholder: "••••••••", type: "password" }} hint="Forgot password?" />
          </div>
          <Button variant="primary" style={{ width: "100%", marginTop: "var(--space-md)", display: "flex", justifyContent: "center" }}>Sign in</Button>
        </Card>

        <SectionLabel>Notification card — Card → Icon + text + actions</SectionLabel>
        <Card style={{ maxWidth: 340, marginBottom: "var(--space-md)" }}>
          <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="star" size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "var(--color-text)", fontSize: 14 }}>New project starred</div>
              <div style={{ fontSize: 12, color: "var(--color-muted)", margin: "var(--space-xxs) 0 var(--space-sm)" }}>SpecLab was starred by 3 people this week.</div>
              <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                <Button variant="primary" style={{ fontSize: 12 }}>View</Button>
                <Button variant="outline" style={{ fontSize: 12 }}>Dismiss</Button>
              </div>
            </div>
          </div>
        </Card>

        <SectionLabel>Settings panel — Card → nested item rows</SectionLabel>
        <Card style={{ maxWidth: 360, marginBottom: "var(--space-md)" }}>
          <h4 style={{ margin: 0, marginBottom: "var(--space-sm)", color: "var(--color-text)" }}>Preferences</h4>
          {[{ icon: "edit", label: "Display name", value: "Ian Rios" }, { icon: "link", label: "Public URL", value: "ianrios.me" }, { icon: "star", label: "Featured project", value: "SpecLab" }].map(({ icon, label, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-xs) var(--space-sm)", background: "var(--color-bg)", borderRadius: "var(--radius-sm)", marginBottom: "var(--space-xxs)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                <Icon name={icon} size={13} />
                <span style={{ fontSize: 13, color: "var(--color-text)" }}>{label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{value}</span>
                <Button variant="outline" size="xs">Edit</Button>
              </div>
            </div>
          ))}
        </Card>

        <SectionLabel>Sidebar layout — NavVertical (button variant)</SectionLabel>
        <div style={{ background: "var(--color-bg)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(128,128,128,0.10)", marginBottom: "var(--space-sm)" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--color-muted)", marginBottom: "var(--space-sm)" }}>Page</div>
          <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start" }}>
            <NavVertical siteName="Ian Rios" pages={["experience", "projects", "hobbies"]} ctaLabel="Contact" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <Card style={{ padding: "var(--space-sm)" }}>
                <Badge>Work</Badge>
                <div style={{ fontWeight: 700, color: "var(--color-text)", marginTop: "var(--space-xxs)" }}>Built Technologies</div>
                <div style={{ fontSize: 12, color: "var(--color-muted)" }}>Sr. Frontend Eng · 2022–now</div>
              </Card>
            </div>
          </div>
        </div>

        <SectionLabel>Inset panel with link actions — Card + IconLink + skeu-link</SectionLabel>
        <Card style={{ maxWidth: 420, marginBottom: "var(--space-md)" }}>
          <h4 style={{ margin: 0, marginBottom: "var(--space-sm)", color: "var(--color-text)" }}>Open source</h4>
          <div style={{ background: "var(--color-bg)", borderRadius: "var(--radius-sm)", padding: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
            <div style={{ display: "flex", gap: "var(--space-xxs)", flexWrap: "wrap" }}>
              <Badge>React</Badge><Badge>Three.js</Badge><Badge>WebGL</Badge>
            </div>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: "var(--space-xs)" }}>A public project living in the repo.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="https://ianrios.me" external size="xs">Visit site</Link>
            <div style={{ display: "flex", gap: "var(--space-xxs)" }}>
              <IconLink name="github"   href="https://github.com/ianrios" aria-label="GitHub repo" />
              <IconLink name="external" href="https://ianrios.me"         aria-label="Open in new tab" />
            </div>
          </div>
        </Card>

        <SectionLabel>Modal — Card floating over dimmed Page</SectionLabel>
        <div style={{ position: "relative", background: "var(--color-bg)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(128,128,128,0.10)", marginBottom: "var(--space-lg)", minHeight: 180, overflow: "hidden" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--color-muted)", marginBottom: "var(--space-sm)" }}>Page</div>
          <div style={{ display: "flex", gap: "var(--space-sm)", opacity: 0.25, pointerEvents: "none" }}>
            <Card style={{ flex: 1, padding: "var(--space-sm)" }}><div style={{ fontSize: 12, color: "var(--color-muted)" }}>Background content</div></Card>
            <Card style={{ flex: 1, padding: "var(--space-sm)" }}><div style={{ fontSize: 12, color: "var(--color-muted)" }}>Background content</div></Card>
          </div>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Card style={{ width: 240, margin: 0 }}>
              <h4 style={{ margin: 0, marginBottom: "var(--space-xs)", color: "var(--color-text)" }}>Confirm delete</h4>
              <p style={{ fontSize: 13, color: "var(--color-muted)", margin: "0 0 var(--space-sm)" }}>This action cannot be undone.</p>
              <div style={{ display: "flex", gap: "var(--space-xs)", justifyContent: "flex-end" }}>
                <Button variant="outline" style={{ fontSize: 12 }}>Cancel</Button>
                <Button variant="primary" style={{ fontSize: 12 }}>Delete</Button>
              </div>
            </Card>
          </div>
        </div>

        <SectionLabel>PushPanel — sidebar that pushes content (stacked letter tab label)</SectionLabel>
        <div style={{ height: 200, overflow: "hidden", border: "1px dashed rgba(128,128,128,0.2)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-sm)", display: "flex" }}>
          <PushPanel label="design" width={200}>
            <div style={{ padding: "var(--space-sm)", fontSize: 11, color: "var(--color-text)" }}>
              <div style={{ fontWeight: 600, marginBottom: "var(--space-xs)" }}>Panel content</div>
              <div style={{ color: "var(--color-muted)", lineHeight: 1.6 }}>Token controls, color pickers, sliders…</div>
            </div>
          </PushPanel>
          <div style={{ flex: 1, padding: "var(--space-sm)", fontSize: 11, color: "var(--color-muted)" }}>
            ← panel pushes content right; tab uses stacked letters + &gt; / &lt; caret
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: "var(--space-lg)" }}>
          Live panel at <code style={{ background: "var(--color-accent)", borderRadius: 3, padding: "1px 4px" }}>ianrios.me/</code> — tab stacks letter-by-letter, no writing-mode rotation.
        </div>

        <SectionLabel>PortfolioSidebar — full nav organism</SectionLabel>
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
          <div className="skeu-card" style={{ padding: "var(--space-sm)", width: "var(--sidebar-width)", flexShrink: 0 }}>
            <PortfolioSidebar
              page={sidebarPage}
              setPage={setSidebarPage}
              showTools={sidebarShowTools}
              setShowTools={setSidebarShowTools}
              ul={sidebarUl}
              setUl={setSidebarUl}
              setModalShow={() => setContactModalOpen(true)}
              skills={DEMO_SKILLS}
              workVisible
            />
          </div>
          <div style={{ flex: 1, fontSize: 12, color: "var(--color-muted)", paddingTop: "var(--space-sm)" }}>
            Active tab: <strong style={{ color: "var(--color-text)" }}>{sidebarPage}</strong>
          </div>
        </div>

        <SectionLabel>ContactModal — card overlay</SectionLabel>
        <div style={{ marginBottom: "var(--space-md)" }}>
          <Button variant="outline" onClick={() => setContactModalOpen(true)}>Open contact modal</Button>
          <ContactModal show={contactModalOpen} onHide={() => setContactModalOpen(false)} />
        </div>

      </div>
      <hr />
      <h3 style={{ color: "var(--color-text)" }}>Export</h3>
      <textarea
        readOnly
        value={exportText}
        style={{ width: "100%", height: 180, fontSize: 11, fontFamily: "monospace", background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid rgba(128,128,128,0.2)" }}
      />
    </>
  );
}
