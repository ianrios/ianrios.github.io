import React, { useState } from "react";
import { Button } from "../atoms/Button";

export function NavBar({ pages = ["home", "work", "about"], ctaLabel = "Sign In", siteName = "MySite", variant = "buttons", active: controlledActive, onNavigate }) {
  const [localActive, setLocalActive] = useState(controlledActive ?? pages[0]);
  const active = controlledActive !== undefined ? controlledActive : localActive;

  const handleClick = (page) => {
    setLocalActive(page);
    onNavigate?.(page);
  };

  return (
    <div className="skeu-nav">
      <div style={{ fontWeight: 600, color: "var(--color-text)" }}>{siteName}</div>
      <div style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center" }}>
        {pages.map((page) =>
          variant === "links" ? (
            <a key={page} href="#demo" className="skeu-link" style={{ textTransform: "capitalize" }}>{page}</a>
          ) : (
            <Button key={page} variant={active === page ? "primary" : "outline"} onClick={() => handleClick(page)} style={{ textTransform: "capitalize" }}>
              {page}
            </Button>
          )
        )}
        {ctaLabel && <Button variant="outline">{ctaLabel}</Button>}
      </div>
    </div>
  );
}
