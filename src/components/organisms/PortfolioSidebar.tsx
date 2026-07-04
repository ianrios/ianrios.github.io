import { tools } from '../../data';
import type { SkillTuple } from '../../types/data';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

const NAV_ITEMS = [
  { id: 'work', label: 'experience', requiresWork: true },
  { id: 'projects', label: 'projects' },
  { id: 'hobbies', label: 'hobbies' },
];

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
}: {
  page: string;
  setPage: (p: string) => void;
  showTools: boolean;
  setShowTools: (v: boolean) => void;
  ul: boolean;
  setUl: (v: boolean) => void;
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
        onClick={() => {
          setShowTools(!showTools);
        }}
      >
        skills{' '}
        <Icon name={showTools ? 'chevron-down' : 'chevron-up'} size={13} />
      </Button>
      {showTools && (
        <div className="skeu-sidebar-skills">
          {skills
            .sort((a, b) => a[1] - b[1])
            .map((o, i) => {
              const href = tools[o[0]];
              return href ? (
                <Badge key={i} href={href}>
                  {o[0]}
                </Badge>
              ) : (
                <Badge key={i}>{o[0]}</Badge>
              );
            })}
        </div>
      )}

      <Button
        variant="outline"
        fullWidth
        onClick={() => {
          setUl(!ul);
        }}
      >
        external <Icon name={ul ? 'chevron-down' : 'chevron-up'} size={13} />
      </Button>
      <ul
        className={['skeu-sidebar-links', ul ? 'is-open' : '']
          .filter(Boolean)
          .join(' ')}
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
