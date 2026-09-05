import { useAppContext } from '../../context/AppContext';
import './Navbar.css';

const Navbar = ({ role }) => {
  const { logout } = useAppContext();

  return (
    <header className="es-navbar">
      <div className="es-navbar__left">
        <div className="es-navbar__breadcrumb">
          <span className="es-navbar__breadcrumb-root">EquiScale</span>
          <span className="es-navbar__breadcrumb-sep">/</span>
          <span className="es-navbar__breadcrumb-current">
            {role === 'recruiter' ? 'Recruiter Dashboard' : 'Candidate Portal'}
          </span>
        </div>
      </div>
      <div className="es-navbar__right">
        <div className="es-navbar__ai-badge">
          <span className="es-navbar__ai-dot" />
          AI Bias Guard Active
        </div>
        <button className="es-navbar__avatar" title="Profile">
          {role === 'recruiter' ? '🔍' : '🎓'}
        </button>
        <button className="es-btn es-btn--secondary es-navbar__logout" onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
