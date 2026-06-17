export function ContactModal({ show, onHide }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        role="presentation"
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--overlay-bg)",
        }}
        onClick={onHide}
      />
      <div
        className="skeu-card"
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(var(--modal-max-width), 92vw)",
          maxHeight: "90vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-sm)",
        }}
      >
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdZuZHU8gkftr7wgn5DF2nYYG8Ds4HCDp-Vh-_OfYIE-YoBwQ/viewform?embedded=true"
          width="100%"
          height="900"
          title="contact-form"
          style={{ border: "none", display: "block", flexShrink: 0 }}
        >
          Loading…
        </iframe>
        <div style={{ textAlign: "right" }}>
          <button className="skeu-btn skeu-btn--outline" onClick={onHide}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
