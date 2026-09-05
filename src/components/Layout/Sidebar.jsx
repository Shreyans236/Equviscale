import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const candidateNav = [
  { path: '/candidate', label: 'Overview', icon: '⊞' },
  { path: '/candidate/resume', label: 'Resume Upload', icon: '📄' },
  { path: '/candidate/profile', label: 'Profile Builder', icon: '👤' },
  { path: '/candidate/applications', label: 'My Applications', icon: '📋' },
];

const recruiterNav = [
  { path: '/recruiter', label: 'Dashboard', icon: '⊞' },
  { path: '/recruiter/jobs/new', label: 'Post a Job', icon: '➕' },
  { path: '/recruiter/shortlist', label: 'Candidate Shortlist', icon: '👥' },
  { path: '/recruiter/match-scores', label: 'Match Scores', icon: '🎯' },
];

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navItems = role === 'recruiter' ? recruiterNav : candidateNav;

  return (
    <aside className="es-sidebar">
      <div className="es-sidebar__brand">
        <div className="es-sidebar__logo">
          <span className="es-sidebar__logo-mark">E</span>
        </div>
        <div>
          <span className="es-sidebar__brand-name">EquiScale</span>
          <span className="es-sidebar__role-tag">
            {role === 'recruiter' ? '🔍 Recruiter' : '🎓 Candidate'}
          </span>
        </div>
      </div>

      <nav className="es-sidebar__nav">
        <div className="es-sidebar__nav-label">Navigation</div>
        {navItems.map((item) => {
          const isActive =
            item.path === '/candidate' || item.path === '/recruiter'
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`es-sidebar__link ${isActive ? 'es-sidebar__link--active' : ''}`}
            >
              <span className="es-sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && <span className="es-sidebar__active-dot" />}
            </Link>
          );
        })}
      </nav>

      <div className="es-sidebar__footer">
        <Link to="/" className="es-sidebar__switch">
          ⇄ Switch Portal
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
