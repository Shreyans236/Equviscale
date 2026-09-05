import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../api/jobsApi';
import useApi from '../../hooks/useApi';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RecruiterOverview = () => {
  const { data: jobs, loading, execute: fetchJobs } = useApi(getJobs);

  useEffect(() => { fetchJobs(); }, []);

  const totalApplicants = (jobs || []).reduce((sum, j) => sum + j.applicantCount, 0);
  const activeJobs = (jobs || []).filter((j) => j.status === 'Active').length;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 1100 }}>
      <div className="es-page-header">
        <h2>Recruiter Dashboard</h2>
        <p>Manage your job listings and review anonymized candidates.</p>
      </div>

      {/* Quick Actions */}
      <div className="es-grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { to: '/recruiter/jobs/new', icon: '➕', label: 'Post a Job', desc: 'Create an inclusive listing' },
          { to: '/recruiter/shortlist', icon: '👥', label: 'Blind Shortlist', desc: 'Review anonymized candidates' },
          { to: '/recruiter/match-scores', icon: '🎯', label: 'Match Scores', desc: 'AI compatibility breakdown' },
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
      <div className="es-grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="es-stat-card">
          <div className="es-stat-card__value">{jobs?.length ?? '—'}</div>
          <div className="es-stat-card__label">Total Job Posts</div>
        </div>
        <div className="es-stat-card">
          <div className="es-stat-card__value">{activeJobs}</div>
          <div className="es-stat-card__label">Active Listings</div>
        </div>
        <div className="es-stat-card">
          <div className="es-stat-card__value">{totalApplicants}</div>
          <div className="es-stat-card__label">Total Applicants</div>
        </div>
        <div className="es-stat-card">
          <div className="es-stat-card__value">100%</div>
          <div className="es-stat-card__label">PII Anonymized</div>
        </div>
      </div>

      {/* Job Listings Table */}
      <div className="es-section-title">Active Job Postings</div>
      {loading && <LoadingSpinner text="Loading jobs..." />}
      {jobs && (
        <div className="es-table-wrapper">
          <table className="es-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Applicants</th>
                <th>Bias Check</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600 }}>{job.title}</td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{job.department}</td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{job.location}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{job.applicantCount}</span>
                  </td>
                  <td>
                    <span className={`es-badge ${job.biasCheckPassed ? 'es-badge--success' : 'es-badge--warning'}`}>
                      {job.biasCheckPassed ? '✓ Passed' : '⚠ Pending'}
                    </span>
                  </td>
                  <td><StatusBadge status={job.status} /></td>
                  <td>
                    <Link
                      to={`/recruiter/shortlist?job=${job.id}`}
                      className="es-btn es-btn--secondary"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                    >
                      View Candidates →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecruiterOverview;
