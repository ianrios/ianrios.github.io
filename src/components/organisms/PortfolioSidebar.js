import { tools } from "../../data";
import { Icon } from "../atoms/Icon";
import { Badge } from "../atoms/Badge";

const NAV_ITEMS = [
  { id: "work", label: "experience", requiresWork: true },
  { id: "projects", label: "projects" },
  { id: "hobbies", label: "hobbies" },
];

const navBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-xs)",
  width: "100%",
  textAlign: "left",
  marginBottom: "var(--space-xs)",
  padding: "var(--space-xs) var(--space-sm)",
};

export function PortfolioSidebar({
  page,
  setPage,
  showTools,
  setShowTools,
  ul,
  setUl,
  setModalShow,
  skills,
  workVisible,
  onClose,
}) {
  return (
    <>
      <h3 style={{ marginBottom: "var(--space-sm)" }}>Portfolio</h3>

      {NAV_ITEMS.filter((n) => !n.requiresWork || workVisible).map((nav) => (
        <button
          key={nav.id}
          className="skeu-btn skeu-btn--outline"
          style={navBtnStyle}
          onClick={() => {
            setPage(nav.id);
            onClose?.();
          }}
        >
          <Icon name={page === nav.id ? "circle-fill" : "circle"} size={14} />
          {nav.label}
        </button>
      ))}

      <button
        className="skeu-btn skeu-btn--outline"
        style={navBtnStyle}
        onClick={() => setShowTools(!showTools)}
      >
        skills{" "}
        <Icon name={showTools ? "chevron-down" : "chevron-up"} size={13} />
      </button>
      {showTools && (
        <div
          style={{
            display: "flex",
            gap: "var(--space-xxs)",
            flexWrap: "wrap",
            marginBottom: "var(--space-xs)",
          }}
        >
          {skills
            .sort((a, b) => a[1] < b[1])
            .map((o, i) => (
              <Badge key={i} href={tools[o[0]] || undefined}>
                {o[0]}
              </Badge>
            ))}
        </div>
      )}

      <button
        className="skeu-btn skeu-btn--outline"
        style={navBtnStyle}
        onClick={() => setUl(!ul)}
      >
        external <Icon name={ul ? "chevron-down" : "chevron-up"} size={13} />
      </button>
      <ul
        style={{
          display: ul ? "flex" : "none",
          flexDirection: "column",
          gap: "var(--space-xxs)",
          fontSize: "var(--font-sm)",
          marginBottom: "var(--space-xs)",
        }}
      >
        <li>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://github.com/ianrios/"
          >
            personal github
          </a>
        </li>
        <li>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://github.com/ianriosbaf/"
          >
            work github
          </a>
        </li>
        <li>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/ian-rios/"
          >
            linkedin
          </a>
        </li>
        <li>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.codewars.com/users/ianrios"
          >
            codewars
          </a>
        </li>
        <li>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.instagram.com/ian___rios"
          >
            instagram
          </a>
        </li>
      </ul>

      <button
        className="skeu-btn skeu-btn--outline"
        style={navBtnStyle}
        onClick={() => setModalShow(true)}
      >
        contact <Icon name="send" size={13} />
      </button>
    </>
  );
}
