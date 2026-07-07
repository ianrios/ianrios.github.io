import { tools, externalLinks } from '../../data';
import type { PageId, SkillTuple } from '../../types/data';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

const NAV_ITEMS: { id: PageId; label: string; requiresWork?: boolean }[] = [
  { id: 'work', label: 'experience', requiresWork: true },
  { id: 'projects', label: 'projects' },
  { id: 'hobbies', label: 'hobbies' },
];

export function PortfolioSidebar({
  page,
  setPage,
  showTools,
  setShowTools,
  linksOpen,
  setLinksOpen,
  setModalShow,
  skills,
  workVisible,
  onClose,
}: {
  page: PageId;
  setPage: (p: PageId) => void;
  showTools: boolean;
  setShowTools: (v: boolean) => void;
  linksOpen: boolean;
  setLinksOpen: (v: boolean) => void;
  setModalShow: (v: boolean) => void;
  skills: SkillTuple[];
  workVisible: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      <h3 className="skeu-sidebar__heading">Portfolio</h3>

      {NAV_ITEMS.filter((n) => !n.requiresWork || workVisible).map((nav) => (
        <Button
          key={nav.id}
          variant="outline"
          fullWidth
          onClick={() => {
            setPage(nav.id);
            onClose?.();
          }}
        >
          <Icon name={page === nav.id ? 'circle-fill' : 'circle'} size={14} />
          {nav.label}
        </Button>
      ))}

      <Button
        variant="outline"
        fullWidth
        aria-expanded={showTools}
        onClick={() => {
          setShowTools(!showTools);
        }}
      >
        skills{' '}
        <Icon name={showTools ? 'chevron-down' : 'chevron-up'} size={13} />
      </Button>
      {showTools && (
        <div className="skeu-sidebar-skills">
          {skills.map(([name]) => {
            const href = tools[name];
            return href ? (
              <Badge key={name} href={href}>
                {name}
              </Badge>
            ) : (
              <Badge key={name}>{name}</Badge>
            );
          })}
        </div>
      )}

      <Button
        variant="outline"
        fullWidth
        aria-expanded={linksOpen}
        onClick={() => {
          setLinksOpen(!linksOpen);
        }}
      >
        external{' '}
        <Icon name={linksOpen ? 'chevron-down' : 'chevron-up'} size={13} />
      </Button>
      <ul
        className={['skeu-sidebar-links', linksOpen ? 'is-open' : '']
          .filter(Boolean)
          .join(' ')}
      >
        {externalLinks.map((link) => (
          <li key={link.href}>
            <a rel="noreferrer" target="_blank" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <Button
        variant="outline"
        fullWidth
        onClick={() => {
          setModalShow(true);
        }}
      >
        contact <Icon name="send" size={13} />
      </Button>
    </>
  );
}
