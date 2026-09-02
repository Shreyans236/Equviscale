import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'candidate' | 'recruiter'
  const [notifications, setNotifications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const login = useCallback((userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    localStorage.setItem('equiscale_role', userRole);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('equiscale_token');
    localStorage.removeItem('equiscale_role');
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, ...notification }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        notifications,
        selectedJob,
        setSelectedJob,
        login,
        logout,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};

export default AppContext;
