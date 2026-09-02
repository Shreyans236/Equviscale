import { useState, useEffect } from 'react';
import { getAnonymizedList } from '../../api/anonymizeApi';
import { getJobs } from '../../api/jobsApi';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import ScoreGauge from '../../components/common/ScoreGauge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './CandidateShortlist.css';

const CandidateShortlist = () => {
  const navigate = useNavigate();
  const { setSelectedJob } = useAppContext();
  const { data: jobs, execute: fetchJobs } = useApi(getJobs);
  const { data: candidates, loading, execute: fetchCandidates } = useApi(getAnonymizedList);

  const [selectedJobId, setSelectedJobId] = useState('');
  const [sortBy, setSortBy] = useState('matchScore');
  const [sortDir, setSortDir] = useState('desc');
  const [filterMin, setFilterMin] = useState(0);
  const [searchSkill, setSearchSkill] = useState('');
  const [shortlisted, setShortlisted] = useState(new Set());

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => {
    if (selectedJobId) fetchCandidates(selectedJobId);
  }, [selectedJobId]);

  const toggleShortlist = (id) => {
    setShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('desc'); }
  };

  const sorted = (candidates || [])
    .filter((c) => c.matchScore >= filterMin)
    .filter((c) => !searchSkill || c.skills.some((s) => s.toLowerCase().includes(searchSkill.toLowerCase())))
    .sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const SortIcon = ({ col }) =>
    sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ⇅';

  return (
    <div className="shortlist animate-fade-in-up">
      <div className="es-page-header">
        <h2>Blind Candidate Shortlist</h2>
        <p>All candidates are anonymized — evaluate purely on skills and experience.</p>
      </div>

      {/* Controls */}
      <div className="shortlist__controls es-card">
        <div className="es-form-group" style={{ marginBottom: 0 }}>
          <label className="es-label">Select Job Posting</label>
          <select
            className="es-select"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="">— Choose a job —</option>
            {(jobs || []).map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.applicantCount} applicants)
              </option>
            ))}
          </select>
        </div>
        <div className="es-form-group" style={{ marginBottom: 0 }}>
          <label className="es-label">Filter by Skill</label>
          <input
            className="es-input"
            placeholder="e.g. React, Python..."
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
          />
        </div>
        <div className="es-form-group" style={{ marginBottom: 0 }}>
          <label className="es-label">Min Match Score: <strong style={{ color: 'var(--color-primary)' }}>{filterMin}%</strong></label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filterMin}
            onChange={(e) => setFilterMin(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
          />
        </div>
        {shortlisted.size > 0 && (
          <button className="es-btn es-btn--accent shortlist__proceed-btn">
            ✓ Proceed with {shortlisted.size} Candidate{shortlisted.size > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="shortlist__privacy-notice">
        <span>🛡</span>
        <span>
          <strong>Blind Hiring Mode Active:</strong> Candidate names, photos, age, gender, and contact details are hidden.
          Shortlisting is based exclusively on skills, experience, and AI match scores.
        </span>
      </div>

      {/* Table */}
      {!selectedJobId && !loading && (
        <div className="shortlist__empty">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>👥</div>
          <h3>Select a job to view candidates</h3>
          <p>Choose a job posting above to load the blind shortlist for that role.</p>
        </div>
      )}

      {loading && <LoadingSpinner text="Loading anonymized candidates..." />}

      {selectedJobId && !loading && sorted.length > 0 && (
        <div className="es-table-wrapper">
          <table className="es-table">
            <thead>
              <tr>
                <th style={{ width: 48 }}></th>
                <th>
                  <button className="shortlist__sort-btn" onClick={() => handleSort('anonymizedId')}>
                    Candidate ID <SortIcon col="anonymizedId" />
                  </button>
                </th>
                <th>Top Skills</th>
                <th>
                  <button className="shortlist__sort-btn" onClick={() => handleSort('experience')}>
                    Experience <SortIcon col="experience" />
                  </button>
                </th>
                <th>Education</th>
                <th>
                  <button className="shortlist__sort-btn" onClick={() => handleSort('matchScore')}>
                    Match Score <SortIcon col="matchScore" />
                  </button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr
                  key={c.anonymizedId}
                  className={shortlisted.has(c.anonymizedId) ? 'shortlist__row--selected' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={shortlisted.has(c.anonymizedId)}
                      onChange={() => toggleShortlist(c.anonymizedId)}
                      style={{ accentColor: 'var(--color-primary)', width: 16, height: 16, cursor: 'pointer' }}
                    />
                  </td>
                  <td>
                    <span className="shortlist__anon-id">{c.anonymizedId}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {c.skills.slice(0, 3).map((s) => (
                        <span key={s} className="es-tag" style={{ fontSize: '0.7rem' }}>{s}</span>
                      ))}
                      {c.skills.length > 3 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          +{c.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{c.experience}</span>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}> yrs</span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {c.education}
                  </td>
                  <td>
                    <ScoreGauge score={c.matchScore} size="sm" />
                  </td>
                  <td>
                    <button
                      className="es-btn es-btn--secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => navigate(`/recruiter/match-scores?candidate=${c.anonymizedId}&job=${selectedJobId}`)}
                    >
                      View Breakdown →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedJobId && !loading && sorted.length === 0 && (
        <div className="shortlist__empty">
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>🔍</div>
          <h3>No candidates match your filters</h3>
          <p>Try lowering the minimum match score or clearing the skill filter.</p>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="shortlist__footer">
          Showing <strong>{sorted.length}</strong> candidate{sorted.length !== 1 ? 's' : ''}
          {filterMin > 0 && ` with ≥ ${filterMin}% match score`}
        </div>
      )}
    </div>
  );
};

export default CandidateShortlist;
