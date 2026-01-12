import React, { useEffect, useState } from "react";

const DEFAULTS = {
  "--color-bg": getComputedStyle(document.documentElement).getPropertyValue("--color-bg") || "#f5f6f7",
  "--color-surface": getComputedStyle(document.documentElement).getPropertyValue("--color-surface") || "#ffffff",
  "--color-accent": getComputedStyle(document.documentElement).getPropertyValue("--color-accent") || "#eaf0f4",
  "--color-text": getComputedStyle(document.documentElement).getPropertyValue("--color-text") || "#1f2933",
  "--space-sm": getComputedStyle(document.documentElement).getPropertyValue("--space-sm") || "12px",
  "--space-md": getComputedStyle(document.documentElement).getPropertyValue("--space-md") || "16px",
  "--space-lg": getComputedStyle(document.documentElement).getPropertyValue("--space-lg") || "24px",
  "--radius-sm": getComputedStyle(document.documentElement).getPropertyValue("--radius-sm") || "4px",
  "--radius-md": getComputedStyle(document.documentElement).getPropertyValue("--radius-md") || "8px",
  "--radius-lg": getComputedStyle(document.documentElement).getPropertyValue("--radius-lg") || "12px",
  "--btn-padding-y": getComputedStyle(document.documentElement).getPropertyValue("--btn-padding-y") || "6px",
  "--btn-padding-x": getComputedStyle(document.documentElement).getPropertyValue("--btn-padding-x") || "12px",
  "--btn-gradient-start": getComputedStyle(document.documentElement).getPropertyValue("--btn-gradient-start") || "#f2f6f9",
  "--btn-gradient-end": getComputedStyle(document.documentElement).getPropertyValue("--btn-gradient-end") || "#dbe5ea",
  "--btn-text-color": getComputedStyle(document.documentElement).getPropertyValue("--btn-text-color") || "#1f2933",
  "--btn-radius": getComputedStyle(document.documentElement).getPropertyValue("--btn-radius") || "6px",
  "--btn-elevation": getComputedStyle(document.documentElement).getPropertyValue("--btn-elevation") || "0 6px 10px rgba(0,0,0,0.06)",
  "--focus-ring-color": getComputedStyle(document.documentElement).getPropertyValue("--focus-ring-color") || "rgba(60,120,180,0.10)",
};

function Admin() {
  const [vars, setVars] = useState(() => {
    try {
      const stored = window.localStorage.getItem("skeuomorph:vars");
      return stored ? JSON.parse(stored) : DEFAULTS;
    } catch (e) {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    // apply vars to :root
    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    window.localStorage.setItem("skeuomorph:vars", JSON.stringify(vars));
  }, [vars]);

  const setVar = (name, value) => setVars((prev) => ({ ...prev, [name]: value }));

  // Helper: set button elevation by choosing one of the preset shadow tokens
  const setBtnElevation = (level) => {
    const root = getComputedStyle(document.documentElement);
    const mapping = {
      low: root.getPropertyValue('--shadow-low') || '0 6px 12px rgba(0,0,0,0.08)',
      med: root.getPropertyValue('--shadow-med') || '0 12px 24px rgba(0,0,0,0.12)',
      high: root.getPropertyValue('--shadow-high') || '0 24px 48px rgba(0,0,0,0.18)',
    };
    setVar('--btn-elevation', mapping[level] || mapping.low);
  };

  // Apply the sandblasted plastic preset quickly
  const applyPlasticPreset = () => {
    const preset = {
      "--color-bg": "#f5f6f7",
      "--color-surface": "#ffffff",
      "--color-accent": "#eaf0f4",
      "--color-text": "#1f2933",
      "--btn-gradient-start": "#f2f6f9",
      "--btn-gradient-end": "#dbe5ea",
      "--btn-text-color": "#1f2933",
      "--btn-padding-y": "6px",
      "--btn-padding-x": "12px",
      "--btn-radius": "6px",
      "--btn-elevation": "0 6px 10px rgba(0,0,0,0.06)",
      "--focus-ring-color": "rgba(60,120,180,0.10)",
    };
    setVars((prev) => ({ ...prev, ...preset }));
  };

  // Color helpers for warm tone detection and auto-fix
  const hexToRgb = (hex) => {
    if (!hex) return null;
    const h = hex.replace('#', '').trim();
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return [r, g, b];
    }
    if (h.length !== 6) return null;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return [r, g, b];
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    return [h * 360, s, l];
  };

  const hslToHex = (h, s, l) => {
    h /= 360;
    let r, g, b;
    if (s === 0) { r = g = b = l; } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    const toHex = (x) => {
      const i = Math.round(x * 255).toString(16).padStart(2, '0');
      return i;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const isHexColorString = (v) => typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());

  const isWarmHex = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    const [h, s, l] = rgbToHsl(...rgb);
    // warm hues roughly between 8 and 50 degrees and reasonably saturated
    return h >= 8 && h <= 50 && s > 0.15;
  };

  const desaturateHex = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    let [h, s, l] = rgbToHsl(...rgb);
    s = Math.min(0.12, s * 0.25); // reduce saturation strongly
    l = Math.min(0.96, l + 0.12);
    return hslToHex(h, s, l);
  };

  const [warmFound, setWarmFound] = React.useState(false);
  const [warmKeys, setWarmKeys] = React.useState([]);

  useEffect(() => {
    const matches = Object.entries(vars).filter(([k, v]) => {
      if (!v || typeof v !== 'string') return false;
      const s = v.trim().toLowerCase();
      if (isHexColorString(s) && isWarmHex(s)) return true;
      return false;
    }).map(([k]) => k);
    setWarmKeys(matches);
    setWarmFound(matches.length > 0);
  }, [vars]);

  const autoFixWarmTones = () => {
    const newVars = { ...vars };
    Object.entries(vars).forEach(([k, v]) => {
      if (!v || typeof v !== 'string') return;
      const s = v.trim().toLowerCase();
      if (isHexColorString(s) && isWarmHex(s)) {
        newVars[k] = desaturateHex(s);
      }
    });
    setVars(newVars);
    setWarmFound(false);
    setWarmKeys([]);
    alert('Warm tones desaturated. Review and copy CSS if happy.');
  };

  const exportCSS = () => {
    const css = `:root {\n${Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n")}\n}`;
    navigator.clipboard.writeText(css).then(() => {
      alert("Copied CSS to clipboard");
    });
  };

  // Precompute exported :root CSS text for the textarea
  const exportText = `:root {\n${Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")}\n}`;

  return (
    <div className="container" style={{ padding: "24px 24px 48px" }}>
      <h2>/admin — Design tokens</h2>
      <p>Adjust tokens live — changes persist to localStorage and affect the site immediately.</p>

      <div className="admin-split" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <aside className="admin-controls" style={{ width: 380, maxWidth: '38%', overflow: 'auto', maxHeight: 'calc(100vh - 120px)', paddingRight: 6 }}>
          <div style={{ padding: 12, background: '#f8fbfd', border: '1px solid rgba(0,0,0,0.03)', borderRadius: 8, marginBottom: 12 }}>
            <strong>ℹ️ Design decision</strong>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              Primary (filled) button and unstyled link patterns are deprecated — we use the **Secondary / outline** style for all buttons and links. The preview and exported CSS reflect this choice.
            </div>
          </div>

          <label>
            Background
            <input
              type="color"
              value={vars["--color-bg"].trim()}
              onChange={(e) => setVar("--color-bg", e.target.value)}
              style={{ marginLeft: 12 }}
            />
            <input
              style={{ marginLeft: 8, width: 120 }}
              value={vars["--color-bg"]}
              onChange={(e) => setVar("--color-bg", e.target.value)}
            />
          </label>

        <label>
          Surface
          <input
            type="color"
            value={vars["--color-surface"].trim()}
            onChange={(e) => setVar("--color-surface", e.target.value)}
            style={{ marginLeft: 12 }}
          />
        </label>

        <label>
          Accent
          <input
            type="color"
            value={vars["--color-accent"].trim()}
            onChange={(e) => setVar("--color-accent", e.target.value)}
            style={{ marginLeft: 12 }}
          />
        </label>

        <label>
          Text
          <input
            type="color"
            value={vars["--color-text"].trim()}
            onChange={(e) => setVar("--color-text", e.target.value)}
            style={{ marginLeft: 12 }}
          />
        </label>

        <label>
          Card padding (space-md)
          <input
            type="range"
            min="4"
            max="64"
            value={parseInt(vars["--space-md"])}
            onChange={(e) => setVar("--space-md", `${e.target.value}px`)}
            style={{ width: 240, marginLeft: 12 }}
          />
          <span style={{ marginLeft: 8 }}>{vars["--space-md"]}</span>
        </label>

        <label>
          Radius (radius-md)
          <input
            type="range"
            min="0"
            max="40"
            value={parseInt(vars["--radius-md"])}
            onChange={(e) => setVar("--radius-md", `${e.target.value}px`)}
            style={{ width: 240, marginLeft: 12 }}
          />
          <span style={{ marginLeft: 8 }}>{vars["--radius-md"]}</span>
        </label>
        <label>
          Small radius (radius-sm)
          <input
            type="range"
            min="0"
            max="40"
            value={parseInt(vars["--radius-sm"])}
            onChange={(e) => setVar("--radius-sm", `${e.target.value}px`)}
            style={{ width: 240, marginLeft: 12 }}
          />
          <span style={{ marginLeft: 8 }}>{vars["--radius-sm"]}</span>
        </label> 



        <label>
          Button padding (y)
          <input
            type="range"
            min="0"
            max="24"
            value={parseInt(vars["--btn-padding-y"])}
            onChange={(e) => setVar("--btn-padding-y", `${e.target.value}px`)}
            style={{ width: 240, marginLeft: 12 }}
          />
          <span style={{ marginLeft: 8 }}>{vars["--btn-padding-y"]}</span>
        </label> 

        <label>
          Button padding (x)
          <input
            type="range"
            min="0"
            max="64"
            value={parseInt(vars["--btn-padding-x"]) }
            onChange={(e) => setVar("--btn-padding-x", `${e.target.value}px`)}
            style={{ width: 240, marginLeft: 12 }}
          />
          <span style={{ marginLeft: 8 }}>{vars["--btn-padding-x"]}</span>
        </label> 

        <label>
          Button radius
          <input
            type="range"
            min="0"
            max="40"
            value={parseInt(vars["--btn-radius"]) }
            onChange={(e) => setVar("--btn-radius", `${e.target.value}px`)}
            style={{ width: 240, marginLeft: 12 }}
          />
          <span style={{ marginLeft: 8 }}>{vars["--btn-radius"]}</span>
        </label> 

        <label>
          Button elevation
          <select
            value={vars["--btn-elevation"]}
            onChange={(e) => {
              // allow selecting low/med/high by mapping
              const val = e.target.value;
              if (val === "low" || val === "med" || val === "high") {
                setBtnElevation(val);
              } else {
                setVar("--btn-elevation", val);
              }
            }}
            style={{ marginLeft: 12 }}
          >
            <option value="low">low</option>
            <option value="med">med</option>
            <option value="high">high</option>
            <option value={vars["--shadow-low"]}>custom (shadow-low)</option>
          </select>
        </label>

        <label>
          Focus ring color
          <input
            type="color"
            value={(vars["--focus-ring-color"] || "rgba(198,124,90,0.28)").trim()}
            onChange={(e) => setVar("--focus-ring-color", e.target.value)}
            style={{ marginLeft: 12 }}
          />
        </label>
        {warmFound && (
          <div style={{ padding: 12, background: '#fff7f0', border: '1px solid #ffd8bc', borderRadius: 6, marginBottom: 12 }}>
            <strong>⚠️ Warm tones detected</strong>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              I found warm/orange colors in these tokens: <em>{warmKeys.join(', ')}</em>.
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button className="skeu-btn skeu-btn--primary" onClick={autoFixWarmTones}>Auto-fix (desaturate)</button>
              <button className="skeu-btn skeu-btn--primary" onClick={applyPlasticPreset}>Apply sandblasted preset</button>
              <button className="skeu-btn skeu-btn--outline" onClick={() => { setWarmFound(false); setWarmKeys([]); }} style={{ marginLeft: 8 }}>Ignore</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <button className="skeu-btn skeu-btn--primary" onClick={exportCSS}>
            Copy :root CSS
          </button>
          <button
            className="skeu-btn skeu-btn--outline"
            style={{ marginLeft: 12 }}
            onClick={() => {
              window.localStorage.removeItem("skeuomorph:vars");
              window.location.reload();
            }}
          >
            Reset
          </button>
          <button className="skeu-btn skeu-btn--primary" style={{ marginLeft: 12 }} onClick={applyPlasticPreset}>
            Apply sandblasted plastic preset
          </button>
        </div> 

</aside>

        <main className="admin-preview" style={{ flex: 1, overflow: 'auto', maxHeight: 'calc(100vh - 120px)', paddingLeft: 8 }}>
          <hr />

          <h3>Preview</h3>
          <div className="preview">
            <div className="skeu-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', width: '100%', marginBottom: 12 }}>
              <div style={{ fontWeight: 600 }}>MySite</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <a href="#" className="skeu-link">Home</a>
                <a href="#" className="skeu-link">Work</a>
                <button className="skeu-btn skeu-btn--outline" style={{ padding: '4px 10px' }}>Sign In</button>
              </div>
            </div>

            {/* Large button demo (matches card language) */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <button className="skeu-btn skeu-btn--outline skeu-btn--primary skeu-btn--large">Start</button>
              <button className="skeu-btn skeu-btn--outline skeu-btn--large">Reset</button>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 320 }}>
                <div className="skeu-card" style={{ marginBottom: 12 }}>
                  <h4 style={{ marginTop: 0 }}>Card title</h4>
                  <p style={{ marginBottom: 8 }}>Example card to preview tokens</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="skeu-btn skeu-btn--outline skeu-btn--primary">Primary</button>
                    <button className="skeu-btn skeu-btn--outline">Secondary</button>
                  </div>
                </div>

                <div className="skeu-card" style={{ padding: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Label</label>
                  <input className="skeu-input" placeholder="Form input" />
                </div>

                <div style={{ height: 12 }} />

                <div className="skeu-card">
                  <h4 style={{ margin: 8 }}>Hidden Card (scroll test)</h4>
                  <p style={{ margin: 8 }}>This extra content helps test vertical scrolling in the preview pane. If you can reach this, scrolling works.</p>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div className="skeu-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  <div className="skeu-card" style={{ padding: 12 }}><strong>Project 1</strong><p style={{ margin: 0 }}>Summary</p></div>
                  <div className="skeu-card" style={{ padding: 12 }}><strong>Project 2</strong><p style={{ margin: 0 }}>Summary</p></div>
                  <div className="skeu-card" style={{ padding: 12 }}><strong>Project 3</strong><p style={{ margin: 0 }}>Summary</p></div>
                </div>

                <div style={{ height: 12 }} />

                <div className="skeu-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12 }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Molecule: Card w/ actions</h4>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="skeu-btn skeu-btn--outline">Action</button>
                    <button className="skeu-btn skeu-btn--outline">Other</button>
                  </div>
                </div>

                <div style={{ height: 24 }} />

                <div className="skeu-card" style={{ padding: 12 }}>
                  <h4>Organism: List of items</h4>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>List item one</li>
                    <li>List item two</li>
                    <li>List item three</li>
                    <li>List item four</li>
                    <li>List item five</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          <hr />

          <h3>Export</h3>
          <textarea
            readOnly
            value={exportText}
            style={{ width: "100%", height: 160 }}
          />
        </main>

      </div>
    </div>
  );
}

export default Admin;
