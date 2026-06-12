import { useState, useLayoutEffect, useEffect } from "react";
import {
  COLOR_PRESETS, SHAPE_PRESETS, ELEVATION_PRESETS, DEFAULTS,
  loadStored, detectElevationLevel, detectMatchingPreset,
} from "../pages/admin/adminData";
import { hexToRgb, rgbToHsl, hslToHex, isHexColor, isWarmHex, desaturateHex } from "../pages/admin/colorUtils";

// Derives neumorphic pop-shadow values from a surface hex color + light angle.
// Called automatically whenever a color preset is applied so shadows always match the surface.
function computePopShadows(surfaceHex, angleDeg) {
  const rgb = hexToRgb(surfaceHex);
  if (!rgb) return null;
  const [h, s, l] = rgbToHsl(...rgb);
  const rad = angleDeg * Math.PI / 180;
  const lx = Math.round(Math.sin(rad) * 8);
  const ly = Math.round(-Math.cos(rad) * 8);
  const dx = Math.round(-Math.sin(rad) * 10);
  const dy = Math.round(Math.cos(rad) * 10);
  // Highlight: lighter hue-matched tint on light themes, barely-lighter on dark
  const lightL    = Math.min(l + 0.35, 1);
  const lightRgb  = hexToRgb(hslToHex(h, s * 0.2, lightL)) || rgb;
  const lightA    = l > 0.5 ? 0.80 : 0.22;
  // Depth shadow: darker hue-matched tint; more opaque on dark themes
  const darkL     = Math.max(l - 0.18, 0);
  const darkRgb   = hexToRgb(hslToHex(h, Math.min(s * 1.3, 1), darkL)) || rgb;
  const darkA     = l > 0.5 ? 0.10 : 0.48;
  const lc = `rgba(${lightRgb.join(",")},${lightA})`;
  const dc = `rgba(${darkRgb.join(",")},${darkA})`;
  return {
    "--pop-shadow-light":       `${lx}px ${ly}px 18px ${lc}`,
    "--pop-shadow-dark":        `${dx}px ${dy}px 22px ${dc}`,
    "--inset-shadow-highlight": `-4px -4px 8px ${lc}`,
  };
}

export function useDesignVars() {
  const initialVars = (() => {
    const s = loadStored();
    return s ? { ...DEFAULTS, ...s } : { ...DEFAULTS };
  })();

  const [vars, setVars]                       = useState(initialVars);
  const [elevationLevel, setElevationLevel]   = useState(() => detectElevationLevel(initialVars["--btn-elevation"]));
  const [customElevation, setCustomElevation] = useState(() => {
    const lv = detectElevationLevel(initialVars["--btn-elevation"]);
    return lv === "custom" ? initialVars["--btn-elevation"] || "" : "";
  });
  const [activeColorPreset, setActiveColorPreset] = useState(() => detectMatchingPreset(COLOR_PRESETS, initialVars));
  const [activeShapePreset, setActiveShapePreset] = useState(() => detectMatchingPreset(SHAPE_PRESETS, initialVars));
  const [copySuccess, setCopySuccess]   = useState(false);
  const [warmFound, setWarmFound]       = useState(false);
  const [warmKeys, setWarmKeys]         = useState([]);

  useLayoutEffect(() => {
    Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    const fastS = ((parseFloat(vars["--anim-speed"]) || 0.12) * 0.5).toFixed(3);
    document.documentElement.style.setProperty("--anim-speed-fast", `${fastS}s`);
    window.localStorage.setItem("skeuomorph:vars", JSON.stringify(vars));
  }, [vars]);

  useEffect(() => {
    const matches = Object.entries(vars)
      .filter(([, v]) => isHexColor((v || "").trim()) && isWarmHex((v || "").trim()))
      .map(([k]) => k);
    setWarmKeys(matches);
    setWarmFound(matches.length > 0);
  }, [vars]);

  const setVar = (name, value) => setVars((prev) => ({ ...prev, [name]: value }));

  // Applies a color preset and immediately re-derives pop shadows from the new surface color
  const applyColorPreset = (name) => {
    setActiveColorPreset(name);
    if (!name) return;
    const preset = COLOR_PRESETS.find((p) => p.name === name);
    if (!preset) return;
    setVars((prev) => {
      const next = { ...prev, ...preset.vars };
      const angleDeg  = parseInt(next["--shadow-angle"] || "315");
      const surfaceHex = (next["--color-surface"] || "#ffffff").trim();
      const shadows = computePopShadows(surfaceHex, angleDeg);
      return shadows ? { ...next, ...shadows } : next;
    });
  };

  const applyShapePreset = (name) => {
    setActiveShapePreset(name);
    if (!name) return;
    const preset = SHAPE_PRESETS.find((p) => p.name === name);
    if (!preset) return;
    setVars((prev) => ({ ...prev, ...preset.vars }));
    if (preset.vars["--btn-elevation"] !== undefined) {
      const level = detectElevationLevel(preset.vars["--btn-elevation"]);
      setElevationLevel(level);
      if (level === "custom") setCustomElevation(preset.vars["--btn-elevation"]);
    }
  };

  const applyElevation = (level) => {
    setElevationLevel(level);
    if (level !== "custom") setVar("--btn-elevation", ELEVATION_PRESETS[level]);
  };

  const resetAll = () => {
    window.localStorage.removeItem("skeuomorph:vars");
    setVars({ ...DEFAULTS });
    setElevationLevel(detectElevationLevel(DEFAULTS["--btn-elevation"]));
    setCustomElevation("");
    setActiveColorPreset(detectMatchingPreset(COLOR_PRESETS, DEFAULTS));
    setActiveShapePreset(detectMatchingPreset(SHAPE_PRESETS, DEFAULTS));
  };

  const autoFixWarmTones = () => {
    const next = { ...vars };
    Object.entries(vars).forEach(([k, v]) => {
      const t = (v || "").trim();
      if (isHexColor(t) && isWarmHex(t)) next[k] = desaturateHex(t);
    });
    setVars(next);
  };

  const recomputeDepthShadows = (angleDeg) => {
    const extractRgba = (s) => { const m = (s || "").match(/rgba?\([^)]+\)/i); return m ? m[0] : null; };
    const rad = angleDeg * Math.PI / 180;
    const lx = Math.round(Math.sin(rad) * 8);
    const ly = Math.round(-Math.cos(rad) * 8);
    const dx = Math.round(-Math.sin(rad) * 10);
    const dy = Math.round(Math.cos(rad) * 10);
    const lc = extractRgba(vars["--pop-shadow-light"]) || "rgba(255,255,255,0.9)";
    const dc = extractRgba(vars["--pop-shadow-dark"])  || "rgba(0,0,0,0.08)";
    setVars((prev) => ({
      ...prev,
      "--shadow-angle":   String(angleDeg),
      "--pop-shadow-light": `${lx}px ${ly}px 18px ${lc}`,
      "--pop-shadow-dark":  `${dx}px ${dy}px 22px ${dc}`,
    }));
  };

  // Manual "Auto from surface" — same logic as computePopShadows but triggered by user action
  const autoPopShadows = () => {
    const surfaceHex = (vars["--color-surface"] || "#ffffff").trim();
    const angleDeg   = parseInt(vars["--shadow-angle"] || "315");
    const shadows = computePopShadows(surfaceHex, angleDeg);
    if (shadows) setVars((prev) => ({ ...prev, ...shadows }));
  };

  const exportCSS = () => {
    const css = `:root {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`;
    const onSuccess = () => { setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); };
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = css;
      ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand("copy"); onSuccess(); } catch { /* silent */ }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(css).then(onSuccess).catch(fallback);
    } else {
      fallback();
    }
  };

  const exportText = `:root {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`;

  return {
    vars, setVar, setVars,
    elevationLevel, setElevationLevel,
    customElevation, setCustomElevation,
    activeColorPreset, applyColorPreset,
    activeShapePreset, applyShapePreset,
    applyElevation,
    resetAll,
    warmFound, setWarmFound,
    warmKeys, setWarmKeys,
    autoFixWarmTones,
    recomputeDepthShadows,
    autoPopShadows,
    copySuccess, exportCSS, exportText,
  };
}
