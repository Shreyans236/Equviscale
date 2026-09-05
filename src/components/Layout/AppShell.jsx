import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAppContext } from '../../context/AppContext';
import './AppShell.css';

const AppShell = ({ role, children }) => {
  const { notifications } = useAppContext();

  return (
    <div className="es-shell">
      <Sidebar role={role} />
      <div className="es-shell__main">
        <Navbar role={role} />
        <main className="es-shell__content">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="es-toast-container">
        {notifications.map((n) => (
          <div key={n.id} className={`es-toast es-toast--${n.type || 'info'}`}>
            <span className="es-toast__icon">
              {n.type === 'success' ? '✓' : n.type === 'error' ? '✗' : 'ℹ'}
            </span>
            <div>
              {n.title && <div className="es-toast__title">{n.title}</div>}
              <div className="es-toast__message">{n.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppShell;
