import { Button } from '../atoms/Button';
import { useActiveNav, type NavProps } from '../../hooks/useActiveNav';

export function NavBar({
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

  return (
    <div className="skeu-nav">
      <div className="skeu-nav__title">{siteName}</div>
      <div className="skeu-nav__links">
        {pages.map((page) =>
          variant === 'links' ? (
            <button
              key={page}
              className={`skeu-nav-link-btn${active === page ? ' active' : ''}`}
              onClick={() => {
                handleClick(page);
              }}
            >
              {page}
            </button>
          ) : (
            <Button
              key={page}
              variant={active === page ? 'solid' : 'outline'}
              onClick={() => {
                handleClick(page);
              }}
            >
              {page[0]?.toUpperCase()}
              {page.slice(1)}
            </Button>
          ),
        )}
        {ctaLabel && <Button variant="outline">{ctaLabel}</Button>}
      </div>
    </div>
  );
}
