import { Badge } from "../../components/atoms/Badge";
import { Button } from "../../components/atoms/Button";
import { Card } from "../../components/molecules/Card";
import { ExpandableCard } from "../../components/organisms/ExpandableCard";
import { SectionLabel } from "./AdminUI";
import { TIMELINE_EVENTS, V2_PROJECTS } from "./adminData";

export function V2Preview() {
  return (
    <div
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
        padding: "var(--space-lg)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid rgba(128,128,128,0.10)",
        maxWidth: 860,
        margin: "0 auto",
      }}
    >
      <h3 style={{ color: "var(--color-text)", marginTop: 0 }}>
        Portfolio v2 — Layout Exploration
      </h3>
      <p
        style={{
          fontSize: 12,
          color: "var(--color-muted)",
          marginBottom: "var(--space-lg)",
        }}
      >
        Click role cards to expand. Patterns from portfolio-overhaul.md.
      </p>

      <SectionLabel>Career timeline (organism)</SectionLabel>
      <div
        style={{
          background: "var(--color-bg)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-sm) var(--space-lg)",
          marginBottom: "var(--space-lg)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 32,
            left: "calc(var(--space-lg) + 6px)",
            right: "calc(var(--space-lg) + 6px)",
            height: 2,
            background: "rgba(128,128,128,0.18)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {TIMELINE_EVENTS.map((e, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-xxs)",
                minWidth: 60,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--color-muted)",
                }}
              >
                {e.year}
              </div>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background:
                    i === TIMELINE_EVENTS.length - 1
                      ? "var(--color-accent)"
                      : "var(--color-surface)",
                  border: "2px solid var(--color-muted)",
                  boxShadow: "var(--pop-shadow-dark)",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  color: "var(--color-text)",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {e.role}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--color-muted)",
                  textAlign: "center",
                }}
              >
                {e.company}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionLabel>
        Expandable experience (organism — molecule × N)
      </SectionLabel>
      <ExpandableCard
        title="Senior Frontend Engineer"
        company="Built Technologies"
        period="2022–now"
        tech={["TypeScript", "React", "Three.js", "Python", "MySQL"]}
        bullets={[
          "Budget versioning & change order system",
          "AI document extraction + MySQL migration",
          "Design system (this!)",
          "Unit-based pay app with autosave & rollback",
        ]}
      />
      <ExpandableCard
        title="Frontend Engineer"
        company="Previous Co"
        period="2020–2022"
        tech={["React", "Redux", "Node.js", "CSS"]}
        bullets={[
          "Internal tooling dashboard",
          "API integration layer",
          "Accessibility improvements",
        ]}
      />

      <SectionLabel>
        Mixed-density project grid — without images (organism)
      </SectionLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "var(--space-sm)",
          marginBottom: "var(--space-lg)",
        }}
      >
        <Card>
          <div
            style={{
              fontWeight: 700,
              color: "var(--color-text)",
              fontSize: 16,
              marginBottom: "var(--space-xxs)",
            }}
          >
            SpecLab
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--color-muted)",
              marginBottom: "var(--space-xs)",
            }}
          >
            3D spectroscopy visualization tool. Interactive real-time rendering
            of mass spectrometry data.
          </div>
          <div
            style={{
              display: "flex",
              gap: "var(--space-xxs)",
              flexWrap: "wrap",
              marginBottom: "var(--space-xs)",
            }}
          >
            {["Three.js", "React", "WebGL"].map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <Button variant="primary" style={{ fontSize: 12 }}>
            View project
          </Button>
        </Card>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          {V2_PROJECTS.filter((p) => !p.featured).map((p) => (
            <Card key={p.title}>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--color-text)",
                  fontSize: 13,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-muted)",
                  marginTop: "var(--space-xxs)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                {p.desc}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-xxs)",
                  flexWrap: "wrap",
                }}
              >
                {p.tools.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <SectionLabel>
        Mixed-density project grid — with images (organism)
      </SectionLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "var(--space-sm)",
        }}
      >
        <Card>
          <div
            style={{
              height: 110,
              background:
                "linear-gradient(135deg, var(--color-accent) 0%, var(--color-surface) 60%, var(--color-bg) 100%)",
              borderRadius: "var(--radius-sm)",
              marginBottom: "var(--space-xs)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(128,128,128,0.08)",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "var(--color-muted)",
                textAlign: "center",
              }}
            >
              screenshot.gif
              <br />
              <span style={{ opacity: 0.5 }}>110px hero slot</span>
            </span>
          </div>
          <div
            style={{
              fontWeight: 700,
              color: "var(--color-text)",
              fontSize: 16,
              marginBottom: "var(--space-xxs)",
            }}
          >
            SpecLab
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--color-muted)",
              marginBottom: "var(--space-xs)",
            }}
          >
            3D spectroscopy visualization tool.
          </div>
          <div
            style={{
              display: "flex",
              gap: "var(--space-xxs)",
              flexWrap: "wrap",
              marginBottom: "var(--space-xs)",
            }}
          >
            {["Three.js", "React", "WebGL"].map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <Button variant="primary" style={{ fontSize: 12 }}>
            View project
          </Button>
        </Card>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          {V2_PROJECTS.filter((p) => !p.featured).map((p) => (
            <Card key={p.title}>
              <div
                style={{
                  height: 40,
                  background:
                    "linear-gradient(90deg, var(--color-accent), var(--color-bg))",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "var(--space-xxs)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "var(--space-xs)",
                  border: "1px solid rgba(128,128,128,0.06)",
                }}
              >
                <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
                  40px thumb
                </span>
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--color-text)",
                  fontSize: 13,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-muted)",
                  marginTop: "var(--space-xxs)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                {p.desc}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-xxs)",
                  flexWrap: "wrap",
                }}
              >
                {p.tools.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
