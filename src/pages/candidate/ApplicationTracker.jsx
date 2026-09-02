import { useEffect } from 'react';
import { getMyApplications } from '../../api/candidateApi';
import useApi from '../../hooks/useApi';
import StatusBadge from '../../components/common/StatusBadge';
import ScoreGauge from '../../components/common/ScoreGauge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ApplicationTracker.css';

const PIPELINE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer'];

const stageIndex = (status) => {
  const idx = PIPELINE_STAGES.indexOf(status);
  return idx >= 0 ? idx : -1;
};

const ApplicationTracker = () => {
  const { data: applications, loading, error, execute: fetchApps } = useApi(getMyApplications);

  useEffect(() => { fetchApps(); }, []);

  const statCounts = applications
    ? PIPELINE_STAGES.reduce((acc, stage) => {
        acc[stage] = applications.filter((a) => a.status === stage).length;
        return acc;
      }, {})
    : {};

  return (
    <div className="app-tracker animate-fade-in-up">
      <div className="es-page-header">
        <h2>My Applications</h2>
        <p>Track every application through the hiring pipeline in real-time.</p>
      </div>

      {/* Stats Row */}
      <div className="es-grid-4 app-tracker__stats">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage} className="es-stat-card">
            <div className="es-stat-card__value">{statCounts[stage] ?? '—'}</div>
            <div className="es-stat-card__label">{stage}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Visual */}
      {applications && applications.length > 0 && (
        <div className="app-tracker__pipeline">
          <div className="es-section-title">Active Pipeline</div>
          {applications.filter((a) => a.status !== 'Rejected').map((app) => (
            <div key={app.id} className="app-tracker__pipeline-card es-card es-card--glow">
              <div className="app-tracker__pipeline-top">
                <div>
                  <div className="app-tracker__job-title">{app.jobTitle}</div>
                  <div className="app-tracker__company">{app.company}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <ScoreGauge score={app.matchScore} size="sm" showLabel={false} />
                  <StatusBadge status={app.status} />
                </div>
              </div>

              {/* Stage Progress Bar */}
              <div className="app-tracker__stages">
                {PIPELINE_STAGES.map((stage, i) => {
                  const idx = stageIndex(app.status);
                  const isActive = i === idx;
                  const isDone = i < idx;
                  return (
                    <div key={stage} className="app-tracker__stage-item">
                      <div
                        className={`app-tracker__stage-dot ${isActive ? 'app-tracker__stage-dot--active' : isDone ? 'app-tracker__stage-dot--done' : ''}`}
                      >
                        {isDone ? '✓' : i + 1}
                      </div>
                      <span
                        className={`app-tracker__stage-label ${isActive ? 'app-tracker__stage-label--active' : isDone ? 'app-tracker__stage-label--done' : ''}`}
                      >
                        {stage}
                      </span>
                      {i < PIPELINE_STAGES.length - 1 && (
                        <div className={`app-tracker__stage-line ${isDone ? 'app-tracker__stage-line--done' : ''}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {app.nextStep && (
                <div className="app-tracker__next-step">
                  <span style={{ color: 'var(--color-accent)' }}>→</span>
                  <span>{app.nextStep}</span>
                </div>
              )}

              <div className="app-tracker__meta">
                <span>Applied: {app.appliedDate}</span>
                <span>Match Score: <strong style={{ color: 'var(--color-primary)' }}>{app.matchScore}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Table */}
      <div className="app-tracker__table-section">
        <div className="es-section-title">All Applications</div>
        {loading && <LoadingSpinner text="Loading your applications..." />}
        {error && (
          <div className="app-tracker__error">
            Failed to load applications. <button onClick={fetchApps}>Retry</button>
          </div>
        )}
        {applications && !loading && (
          <div className="es-table-wrapper">
            <table className="es-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Match Score</th>
                  <th>Next Step</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>{app.jobTitle}</td>
                    <td>{app.company}</td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                      {app.appliedDate}
                    </td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, maxWidth: 80 }}>
                          <div className="es-progress">
                            <div
                              className="es-progress__bar"
                              style={{ width: `${app.matchScore}%` }}
                            />
                          </div>
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                          {app.matchScore}%
                        </span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                      {app.nextStep}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;
