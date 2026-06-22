import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/molecules/Card';
import { V2_PROJECTS } from './adminData';

export function MixedProjectGrid({ showImages }: { showImages: boolean }) {
  const featured = V2_PROJECTS.find((p) => p.featured);
  const rest = V2_PROJECTS.filter((p) => !p.featured);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-lg)',
      }}
    >
      <Card>
        {showImages && (
          <div
            style={{
              height: 110,
              background:
                'linear-gradient(135deg, var(--color-accent) 0%, var(--color-surface) 60%, var(--color-bg) 100%)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(128,128,128,0.08)',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: 'var(--color-muted)',
                textAlign: 'center',
              }}
            >
              screenshot.gif
              <br />
              <span style={{ opacity: 0.5 }}>110px hero slot</span>
            </span>
          </div>
        )}
        <div
          style={{
            fontWeight: 700,
            color: 'var(--color-text)',
            fontSize: 16,
            marginBottom: 'var(--space-xxs)',
          }}
        >
          {featured?.title ?? 'SpecLab'}
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'var(--color-muted)',
            marginBottom: 'var(--space-xs)',
          }}
        >
          {featured?.desc ??
            '3D spectroscopy visualization tool. Interactive real-time rendering of mass spectrometry data.'}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-xxs)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-xs)',
          }}
        >
          {(featured?.tools ?? ['Three.js', 'React', 'WebGL']).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <Button variant="primary" style={{ fontSize: 12 }}>
          View project
        </Button>
      </Card>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}
      >
        {rest.map((p) => (
          <Card key={p.title}>
            {showImages && (
              <div
                style={{
                  height: 40,
                  background:
                    'linear-gradient(90deg, var(--color-accent), var(--color-bg))',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--space-xxs)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 'var(--space-xs)',
                  border: '1px solid rgba(128,128,128,0.06)',
                }}
              >
                <span style={{ fontSize: 10, color: 'var(--color-muted)' }}>
                  40px thumb
                </span>
              </div>
            )}
            <div
              style={{
                fontWeight: 700,
                color: 'var(--color-text)',
                fontSize: 13,
              }}
            >
              {p.title}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--color-muted)',
                marginTop: 'var(--space-xxs)',
                marginBottom: 'var(--space-xs)',
              }}
            >
              {p.desc}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-xxs)',
                flexWrap: 'wrap',
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
  );
}
