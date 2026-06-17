import React, { useState } from "react";
import { tools } from "../data";
import { IconLink } from "./atoms/IconLink";
import { Icon } from "./atoms/Icon";
import { Badge } from "./atoms/Badge";

const MasonryCard = ({ index, item }) => {
  const [panelOpened, setPanelOpened] = useState(false);

  const isAccent = (index % 2 !== 0 || index % 7 === 0) && index !== 0;
  const isInfo   = index % 5 === 0 && index !== 0 && index < 10;
  const variantClass = isInfo ? "skeu-card--muted" : isAccent ? "skeu-card--accent" : "";

  return (
    <div className={["skeu-card", variantClass].filter(Boolean).join(" ")}>
      {item.title && (
        <h4 style={{ marginBottom: "var(--space-xs)", fontWeight: 700 }}>{item.title}</h4>
      )}
      {item.img_src_arr && (
        <>
          {item.img_src_arr.length > 0 && (
            <img src={item.img_src_arr[0]} alt={item.title} style={{ borderRadius: "var(--radius-sm)", marginBottom: "var(--space-xs)" }} />
          )}
          {item.img_src_arr.length > 1 && (
            <img src={item.img_src_arr[1]} alt={item.body} style={{ borderRadius: "var(--radius-sm)", marginBottom: "var(--space-xs)" }} />
          )}
        </>
      )}
      {item.activelyMaintained && (
        <p style={{ fontSize: "var(--font-sm)", color: "var(--color-muted)", margin: "var(--space-xxs) 0" }}>
          <em>{item.activelyMaintained ? `started in ${item.year} - active` : `built in ${item.year}`}</em>
        </p>
      )}
      {item.body && (
        <p style={{ marginTop: "var(--space-xs)" }}>{item.body}</p>
      )}
      {item.tools && (
        <>
          <hr style={{ borderColor: "var(--border-color)", borderStyle: "solid", borderWidth: "1px 0 0 0", margin: "var(--space-xs) 0" }} />
          <button
            onClick={() => setPanelOpened(!panelOpened)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--space-xxs)", color: "var(--color-text)", fontWeight: 600, fontSize: "var(--font-sm)", padding: 0 }}
          >
            tools used <Icon name={panelOpened ? "chevron-down" : "chevron-up"} size={14} />
          </button>
          {panelOpened && (
            <div style={{ display: "flex", gap: "var(--space-xxs)", flexWrap: "wrap", marginTop: "var(--space-xxs)" }}>
              {item.tools.map((t, i) => (
                <Badge key={i} href={tools[t] || undefined}>{t}</Badge>
              ))}
            </div>
          )}
        </>
      )}
      <div style={{ display: "flex", gap: "var(--space-xs)", marginTop: "var(--space-sm)", flexWrap: "wrap", alignItems: "center" }}>
        {item.href?.length > 0 && <IconLink name="github" href={item.href} aria-label="GitHub" />}
        {item.title === "Meta Spheres" && (
          <IconLink name="info" href="https://en.wikipedia.org/wiki/Metaballs" aria-label="Info" />
        )}
        {item.live?.length > 0 && (
          <a href={item.live} rel="noreferrer" target="_blank" className="skeu-link skeu-btn--xs">Visit Live Demo</a>
        )}
        {item.instagram?.length > 0 && <IconLink name="instagram" href={item.instagram} aria-label="Instagram" />}
        {item.url?.length > 0 && <IconLink name="external" href={item.url} aria-label="Open" />}
      </div>
    </div>
  );
};

export default MasonryCard;
