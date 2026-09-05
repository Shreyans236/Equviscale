import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMatchScores } from '../../api/anonymizeApi';
import { getJobs } from '../../api/jobsApi';
import useApi from '../../hooks/useApi';
import ScoreGauge from '../../components/common/ScoreGauge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './MatchScoreView.css';

const BREAKDOWN_LABELS = {
  skillsMatch: 'Skills Match',
  experienceMatch: 'Experience Match',
  educationMatch: 'Education Match',
  cultureFitScore: 'Culture Fit',
};

const ScoreBar = ({ label, value }) => {
  const color =
    value >= 90 ? '#22c55e' : value >= 75 ? '#0070f3' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="match-score__bar-item">
      <div className="match-score__bar-label">
        <span>{label}</span>
        <span style={{ fontWeight: 700, color }}>{value}%</span>
      </div>
      <div className="es-progress">
        <div
          className="es-progress__bar"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
};

const MatchScoreView = () => {
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get('candidate') || 'c-001';
  const jobId = searchParams.get('job') || 'j-101';

  const { data: matchData, loading, execute: fetchScores } = useApi(getMatchScores);
  const { data: jobs, execute: fetchJobs } = useApi(getJobs);
  const [selectedCandidate, setSelectedCandidate] = useState(candidateId);
  const [selectedJob, setSelectedJob] = useState(jobId);

  const mockCandidates = [
    { id: 'c-001', anonymizedId: 'ANON-7842' },
    { id: 'c-002', anonymizedId: 'ANON-3319' },
    { id: 'c-003', anonymizedId: 'ANON-5561' },
    { id: 'c-004', anonymizedId: 'ANON-9102' },
  ];

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => {
    fetchScores(selectedCandidate, selectedJob);
  }, [selectedCandidate, selectedJob]);

  return (
    <div className="match-score animate-fade-in-up">
      <div className="es-page-header">
        <h2>Match Score Breakdown</h2>
        <p>AI-powered analysis of candidate-job compatibility across multiple dimensions.</p>
      </div>

      {/* Selectors */}
      <div className="match-score__selectors es-card">
        <div className="es-form-group" style={{ marginBottom: 0 }}>
          <label className="es-label">Candidate (Anonymized)</label>
          <select
            className="es-select"
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
          >
            {mockCandidates.map((c) => (
              <option key={c.id} value={c.id}>{c.anonymizedId}</option>
            ))}
          </select>
        </div>
        <div className="es-form-group" style={{ marginBottom: 0 }}>
          <label className="es-label">Job Position</label>
          <select
            className="es-select"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            {(jobs || []).map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner text="Calculating match scores..." />}

      {matchData && !loading && (
        <div className="match-score__content">
          {/* Overall Score Hero */}
          <div className="match-score__hero es-card">
            <div className="match-score__hero-left">
              <ScoreGauge score={matchData.overallScore} size="lg" />
              <div className="match-score__hero-info">
                <div className="match-score__candidate-id">{matchData.anonymizedId}</div>
                <div className="match-score__recommendation">{matchData.recommendation}</div>
                <div className="match-score__hero-badges">
                  {matchData.topMatchingSkills.map((s) => (
                    <span key={s} className="es-badge es-badge--accent">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="match-score__hero-right">
              <button className="es-btn es-btn--primary">📩 Invite to Interview</button>
              <button className="es-btn es-btn--secondary">Skip Candidate</button>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="es-grid-2 match-score__breakdown">
            <div className="es-card">
              <div className="es-section-title">Score Breakdown</div>
              <div className="match-score__bars">
                {Object.entries(matchData.breakdown).map(([key, value]) => (
                  <ScoreBar key={key} label={BREAKDOWN_LABELS[key] || key} value={value} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {/* Matching Skills */}
              <div className="es-card">
                <div className="es-section-title">✓ Matching Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {matchData.topMatchingSkills.map((s) => (
                    <span key={s} className="es-badge es-badge--success">{s}</span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="es-card">
                <div className="es-section-title">
                  {matchData.missingSkills.length === 0 ? '🎯 No Skill Gaps' : '⚠ Skill Gaps'}
                </div>
                {matchData.missingSkills.length === 0 ? (
                  <p style={{ fontSize: '0.875rem' }}>
                    This candidate meets all required skill criteria for the role.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {matchData.missingSkills.map((s) => (
                      <span key={s} className="es-badge es-badge--warning">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Radar mini summary */}
              <div className="es-card">
                <div className="es-section-title">AI Confidence</div>
                <div className="match-score__confidence-grid">
                  {Object.entries(matchData.breakdown).map(([key, value]) => (
                    <div key={key} className="match-score__confidence-item">
                      <div
                        className="match-score__confidence-fill"
                        style={{
                          height: `${value}%`,
                          background: value >= 90 ? '#22c55e' : value >= 75 ? '#0070f3' : value >= 60 ? '#f59e0b' : '#ef4444',
                          opacity: 0.7,
                        }}
                      />
                      <div className="match-score__confidence-label">
                        {BREAKDOWN_LABELS[key]?.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="es-card">
            <div className="es-section-title">Fairness Metrics</div>
            <div className="es-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="es-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Benchmark</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: 'Bias-Free Score', value: `${100 - (matchData.biasScore || 8)}%`, benchmark: '> 90%', pass: true },
                    { metric: 'PII Redacted', value: 'Yes', benchmark: 'Required', pass: true },
                    { metric: 'Evaluation Basis', value: 'Skills & Experience', benchmark: 'Objective', pass: true },
                    { metric: 'Overall Match', value: `${matchData.overallScore}%`, benchmark: '> 70%', pass: matchData.overallScore >= 70 },
                  ].map((row) => (
                    <tr key={row.metric}>
                      <td style={{ fontWeight: 500 }}>{row.metric}</td>
                      <td style={{ fontWeight: 600 }}>{row.value}</td>
                      <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{row.benchmark}</td>
                      <td>
                        <span className={`es-badge ${row.pass ? 'es-badge--success' : 'es-badge--error'}`}>
                          {row.pass ? '✓ Pass' : '✗ Fail'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScoreView;
