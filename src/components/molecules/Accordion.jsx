import React, { useState } from "react";

export function Accordion({ items, inline = false }) {
  const [open, setOpen] = useState(null);

  const wrapStyle = inline
    ? { borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--color-accent)" }
    : { borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--color-surface)", boxShadow: "var(--pop-shadow-light), var(--pop-shadow-dark), var(--shadow-ambient)" };

  return (
    <div style={wrapStyle}>
      {items.map((item, idx) => (
        <div key={item.id} style={{ borderTop: idx > 0 ? "1px solid var(--border-color)" : "none" }}>
          <button
            onClick={() => setOpen(open === item.id ? null : item.id)}
            className="skeu-accordion-btn"
          >
            <span>{item.title}</span>
            <span style={{ fontSize: "var(--font-xs)", opacity: 0.55, display: "inline-block", transform: open === item.id ? "rotate(90deg)" : "none", transition: "transform var(--anim-speed) ease" }}>›</span>
          </button>
          <div style={{ overflow: "hidden", maxHeight: open === item.id ? 400 : 0, opacity: open === item.id ? 1 : 0, transition: "max-height var(--anim-speed) ease, opacity var(--anim-speed) ease" }}>
            <div style={{ padding: "var(--space-sm) var(--space-md)", fontSize: "var(--font-sm)", color: "var(--color-text)", opacity: 0.8, lineHeight: 1.6, borderTop: "1px solid var(--border-color)" }}>{item.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
