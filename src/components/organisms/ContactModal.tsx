import { Button } from '../atoms/Button';

export function ContactModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  if (!show) return null;
  return (
    <div className="skeu-modal-backdrop">
      <div
        role="presentation"
        className="skeu-modal-overlay"
        onClick={onHide}
      />
      <div className="skeu-modal">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdZuZHU8gkftr7wgn5DF2nYYG8Ds4HCDp-Vh-_OfYIE-YoBwQ/viewform?embedded=true"
          width="100%"
          height="900"
          title="contact-form"
          className="skeu-modal__iframe"
        >
          Loading…
        </iframe>
        <div className="skeu-modal__footer">
          <Button variant="outline" onClick={onHide}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
