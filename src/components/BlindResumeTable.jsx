import React, { useState, useId } from 'react';
import { Eye, EyeOff, ShieldCheck, Search, Filter, Sparkles, ChevronRight } from 'lucide-react';

export default function BlindResumeTable({ candidates, selectedCandidateId, onSelectCandidate, onAnnounce }) {
  const [showPII, setShowPII] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [minMatch, setMinMatch] = useState(70);

  const searchInputId = useId();
  const roleSelectId = useId();
  const matchSliderId = useId();
  const piiToggleId = useId();

  // Toggle PII visibility with WCAG screen reader notification
  const handlePIIToggle = () => {
    const nextState = !showPII;
    setShowPII(nextState);
    const message = nextState
      ? 'PII Unblinded. Candidate names, ages, gender, and colleges are now revealed for demonstration mode.'
      : 'PII Redacted. All sensitive personal identifying information is masked for unbiased evaluation.';
    if (onAnnounce) onAnnounce(message);
  };

  // Filter logic
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.coreSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (showPII && c.pii.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || c.role === roleFilter;
    const matchesScore = c.overallMatch >= minMatch;

    return matchesSearch && matchesRole && matchesScore;
  });

  const uniqueRoles = Array.from(new Set(candidates.map((c) => c.role)));

  return (
    <section
      aria-labelledby="blind-table-heading"
      className="equi-card animate-fade-in"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--bg-card-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '1.5rem',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
      }}
    >
      {/* Header section with WCAG compliant live toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={24} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
          <h2 id="blind-table-heading" style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Blind Candidate Evaluation Table
          </h2>
        </div>

        {/* Accessible PII Redaction Toggle Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--bg-card-border)' }}>
          <label htmlFor={piiToggleId} style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {showPII ? <Eye size={18} style={{ color: 'var(--accent-amber)' }} aria-hidden="true" /> : <EyeOff size={18} style={{ color: 'var(--accent-rose)' }} aria-hidden="true" />}
            <span>{showPII ? 'PII Unmasked (Demo)' : 'PII Redacted (Active)'}</span>
          </label>

          <button
            id={piiToggleId}
            role="switch"
            aria-checked={showPII}
            aria-label="Toggle PII visibility for candidates"
            onClick={handlePIIToggle}
            style={{
              width: '46px',
              height: '24px',
              borderRadius: '12px',
              background: showPII ? 'var(--accent-amber)' : 'var(--accent-rose)',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              padding: '2px'
            }}
          >
            <span
              style={{
                display: 'block',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#FFFFFF',
                transform: showPII ? 'translateX(22px)' : 'translateX(0px)',
                transition: 'transform 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          background: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: 'var(--border-radius-md)',
          marginBottom: '1.25rem',
          border: '1px solid var(--bg-card-border)'
        }}
      >
        {/* Search Input */}
        <div>
          <label htmlFor={searchInputId} style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Search Candidates / Skills
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} aria-hidden="true" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Search by ID, role, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--bg-card-border)',
                borderRadius: 'var(--border-radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            />
          </div>
        </div>

        {/* Role Select Filter */}
        <div>
          <label htmlFor={roleSelectId} style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            Target Role Filter
          </label>
          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} aria-hidden="true" />
            <select
              id={roleSelectId}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--bg-card-border)',
                borderRadius: 'var(--border-radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Enterprise Roles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Match Threshold Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <label htmlFor={matchSliderId} style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              Min Match Score: <strong style={{ color: 'var(--accent-cyan)' }}>{minMatch}%</strong>
            </label>
          </div>
          <input
            id={matchSliderId}
            type="range"
            min="60"
            max="95"
            step="5"
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
            aria-valuemin={60}
            aria-valuemax={95}
            aria-valuenow={minMatch}
            aria-label="Filter candidates by minimum match score percentage"
            style={{
              width: '100%',
              accentColor: 'var(--accent-cyan)',
              cursor: 'pointer',
              marginTop: '0.4rem'
            }}
          />
        </div>
      </div>

      {/* Accessible Responsive Candidate Data Table */}
      <div style={{ overflowX: 'auto', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--bg-card-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <caption className="sr-only">
            Candidate evaluation data table showing anonymized IDs, experience, PII status, skills, and match scores.
          </caption>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '2px solid var(--bg-card-border)' }}>
              <th scope="col" style={{ padding: '0.875rem 1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Candidate ID</th>
              <th scope="col" style={{ padding: '0.875rem 1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Candidate Name / Redaction</th>
              <th scope="col" style={{ padding: '0.875rem 1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Role & Exp</th>
              <th scope="col" style={{ padding: '0.875rem 1rem', fontWeight: '800', color: 'var(--text-primary)' }}>College / Gender</th>
              <th scope="col" style={{ padding: '0.875rem 1rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>Verified Skills</th>
              <th scope="col" style={{ padding: '0.875rem 1rem', fontWeight: '800', color: 'var(--text-primary)', textAlign: 'right' }}>Overall Match</th>
              <th scope="col" style={{ padding: '0.875rem 1rem', fontWeight: '800', color: 'var(--text-primary)', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No candidate profiles match your current search and score filters.
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => {
                const isSelected = selectedCandidateId === candidate.id;
                return (
                  <tr
                    key={candidate.id}
                    onClick={() => onSelectCandidate(candidate.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    aria-label={`Select candidate ${candidate.id}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectCandidate(candidate.id);
                      }
                    }}
                    style={{
                      background: isSelected ? 'var(--accent-cyan-bg)' : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--accent-cyan)' : '4px solid transparent',
                      borderBottom: '1px solid var(--bg-card-border)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease, border-left 0.15s ease'
                    }}
                  >
                    {/* Anonymized Candidate ID */}
                    <td style={{ padding: '1rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
                      {candidate.id}
                    </td>

                    {/* Redacted / Unmasked Name & Age */}
                    <td style={{ padding: '1rem' }}>
                      {showPII ? (
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{candidate.pii.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Age: {candidate.pii.age}</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--redact-color)', fontSize: '0.85rem' }}>{candidate.redacted.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{candidate.redacted.age}</div>
                        </div>
                      )}
                    </td>

                    {/* Role & Experience */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{candidate.role}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{candidate.experienceYears} Years Exp.</div>
                    </td>

                    {/* College & Gender Redaction */}
                    <td style={{ padding: '1rem' }}>
                      {showPII ? (
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600' }}>{candidate.pii.college}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{candidate.pii.gender}</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--redact-color)', fontSize: '0.85rem' }}>{candidate.redacted.college}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{candidate.redacted.gender}</div>
                        </div>
                      )}
                    </td>

                    {/* Core Verified Skills Badges - Pale Yellow Box, Black Text, Bold 2px Black Outline */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxWidth: '280px' }}>
                        {candidate.coreSkills.map((skill) => (
                          <span
                            key={skill}
                            style={{
                              background: '#FEF9C3', /* Very pale yellow */
                              border: '2px solid #000000', /* Bold outline in black color */
                              color: '#000000', /* Black text */
                              fontSize: '0.75rem',
                              fontWeight: '800', /* Bold text */
                              padding: '0.25rem 0.55rem',
                              borderRadius: '6px',
                              letterSpacing: '0.01em',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Overall Match Score */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: candidate.overallMatch >= 90 ? 'var(--accent-emerald)' : 'var(--accent-cyan)' }}>
                        {candidate.overallMatch}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Tech: {candidate.techScore}%</div>
                    </td>

                    {/* Action Button */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(candidate.id);
                        }}
                        style={{
                          background: isSelected ? 'var(--accent-cyan)' : 'var(--bg-elevated)',
                          color: isSelected ? 'var(--text-inverse)' : 'var(--accent-cyan)',
                          border: isSelected ? 'none' : '1.5px solid var(--accent-cyan)',
                          padding: '0.4rem 0.75rem',
                          borderRadius: 'var(--border-radius-sm)',
                          fontWeight: '800',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <span>{isSelected ? 'Active Profile' : 'Inspect Analytics'}</span>
                        <ChevronRight size={14} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
