import { Card } from "../molecules/Card";
import { Badge } from "../atoms/Badge";

export function CardGrid({ items, style }) {
  return (
    <div className="skeu-card-grid" style={style}>
      {items.map(({ title, desc, tools = [] }) => (
        <Card key={title} style={{ padding: "var(--space-sm)" }}>
          <strong style={{ color: "var(--color-text)" }}>{title}</strong>
          <p
            style={{
              margin: "var(--space-xxs) 0 var(--space-xs)",
              fontSize: 12,
              color: "var(--color-muted)",
            }}
          >
            {desc}
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--space-xxs)",
              flexWrap: "wrap",
            }}
          >
            {tools.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
