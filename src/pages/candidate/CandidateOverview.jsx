import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../api/candidateApi';
import useApi from '../../hooks/useApi';
import StatusBadge from '../../components/common/StatusBadge';
import ScoreGauge from '../../components/common/ScoreGauge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CandidateOverview = () => {
  const { data: applications, loading, execute: fetchApps } = useApi(getMyApplications);

  useEffect(() => { fetchApps(); }, []);

  const statuses = ['Applied', 'Screening', 'Interview', 'Offer'];

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 1100 }}>
      <div className="es-page-header">
        <h2>Welcome back 👋</h2>
        <p>Here's a summary of your job search activity on EquiScale.</p>
      </div>

      {/* Quick Actions */}
      <div className="es-grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { to: '/candidate/resume', icon: '📄', label: 'Upload Resume', desc: 'Let AI parse your skills', color: 'var(--color-primary)' },
          { to: '/candidate/profile', icon: '👤', label: 'Build Profile', desc: 'Complete your portfolio', color: 'var(--color-secondary)' },
          { to: '/candidate/applications', icon: '📋', label: 'Track Applications', desc: 'See your hiring pipeline', color: 'var(--color-accent)' },
        ].map((action) => (
          <Link key={action.to} to={action.to} style={{ textDecoration: 'none' }}>
            <div className="es-card es-card--glow" style={{ textAlign: 'center', padding: '1.75rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>{action.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--color-text-primary)' }}>{action.label}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      {applications && (
        <div className="es-grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="es-stat-card">
            <div className="es-stat-card__value">{applications.length}</div>
            <div className="es-stat-card__label">Total Applications</div>
          </div>
          {statuses.map((s) => (
            <div key={s} className="es-stat-card">
              <div className="es-stat-card__value">{applications.filter((a) => a.status === s).length}</div>
              <div className="es-stat-card__label">{s}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Applications */}
      <div className="es-section-title">Recent Applications</div>
      {loading && <LoadingSpinner text="Loading..." />}
      {applications && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {applications.slice(0, 3).map((app) => (
            <div key={app.id} className="es-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
              <ScoreGauge score={app.matchScore} size="sm" showLabel={false} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{app.jobTitle}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{app.company}</div>
              </div>
              <StatusBadge status={app.status} />
              <Link to="/candidate/applications" className="es-btn es-btn--secondary" style={{ fontSize: '0.8125rem', padding: '0.4rem 0.875rem' }}>
                Track →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateOverview;
