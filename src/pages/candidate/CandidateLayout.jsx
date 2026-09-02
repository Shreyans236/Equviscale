import { Outlet, Navigate } from 'react-router-dom';
import AppShell from '../../components/Layout/AppShell';

const CandidateLayout = () => {
  return (
    <AppShell role="candidate">
      <Outlet />
    </AppShell>
  );
};

export default CandidateLayout;
