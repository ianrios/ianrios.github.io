import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/molecules/Card';
import { V2_PROJECTS } from './adminData';

export function MixedProjectGrid({ showImages }: { showImages: boolean }) {
  const featured = V2_PROJECTS.find((p) => p.featured) ?? V2_PROJECTS[0];
  const rest = V2_PROJECTS.filter((p) => p !== featured);
  if (!featured) return null;
  return (
    <div className="skeu-mixed-grid">
      <Card>
        {showImages && (
          <div className="skeu-mixed-grid__feat-hero">
            <span className="skeu-mixed-grid__feat-hero-text">
              screenshot.gif
              <br />
              <span className="skeu-mixed-grid__feat-hero-sub">
                110px hero slot
              </span>
            </span>
          </div>
        )}
        <div className="skeu-mixed-grid__feat-title">{featured.title}</div>
        <div className="skeu-mixed-grid__feat-desc">{featured.desc}</div>
        <div className="skeu-mixed-grid__feat-tools">
          {featured.tools.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <Button variant="solid" size="xs">
          View project
        </Button>
      </Card>
      <div className="skeu-mixed-grid__side-col">
        {rest.map((p) => (
          <Card key={p.title}>
            {showImages && (
              <div className="skeu-mixed-grid__item-hero">
                <span className="skeu-mixed-grid__item-hero-label">
                  40px thumb
                </span>
              </div>
            )}
            <div className="skeu-mixed-grid__item-title">{p.title}</div>
            <div className="skeu-mixed-grid__item-desc">{p.desc}</div>
            <div className="skeu-mixed-grid__item-tools">
              {p.tools.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
