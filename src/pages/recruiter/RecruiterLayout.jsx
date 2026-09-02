import { Outlet } from 'react-router-dom';
import AppShell from '../../components/Layout/AppShell';

const RecruiterLayout = () => {
  return (
    <AppShell role="recruiter">
      <Outlet />
    </AppShell>
  );
};

export default RecruiterLayout;
