import { Button } from '../atoms/Button';
import { useActiveNav, type NavProps } from '../../hooks/useActiveNav';

export function NavVertical({
  pages = ['home', 'work', 'about'],
  ctaLabel = 'Sign In',
  siteName = 'MySite',
  variant = 'buttons',
  active: controlledActive,
  onNavigate,
}: NavProps) {
  const { active, handleClick } = useActiveNav(
    pages,
    controlledActive,
    onNavigate,
  );

  const isLinks = variant === 'links';

  return (
    <div className="skeu-nav-vertical">
      <div className="skeu-nav-vertical__title">{siteName}</div>
      <div className="skeu-nav-vertical__links">
        {pages.map((page) =>
          isLinks ? (
            <button
              key={page}
              className={`skeu-nav-link-btn${active === page ? ' active' : ''}`}
              onClick={() => {
                handleClick(page);
              }}
            >
              {active === page ? '› ' : ''}
              {page}
            </button>
          ) : (
            <Button
              key={page}
              variant={active === page ? 'solid' : 'outline'}
              fullWidth
              onClick={() => {
                handleClick(page);
              }}
            >
              {page[0]?.toUpperCase()}
              {page.slice(1)}
            </Button>
          ),
        )}
        {ctaLabel && (
          <div className="skeu-nav-vertical__cta">
            {isLinks ? (
              <button className="skeu-nav-link-btn">{ctaLabel}</button>
            ) : (
              <Button variant="outline" fullWidth>
                {ctaLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
