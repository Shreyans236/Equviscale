import { useState } from 'react';
import { createJob, runBiasCheck } from '../../api/jobsApi';
import { useAppContext } from '../../context/AppContext';
import useApi from '../../hooks/useApi';
import './JobCreator.css';

const SKILL_OPTIONS = [
  'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'SQL', 'AWS', 'Docker',
  'Kubernetes', 'Machine Learning', 'GraphQL', 'PostgreSQL', 'Spring Boot', 'Terraform', 'Go',
];

const JobCreator = () => {
  const { addNotification } = useAppContext();
  const { execute: submitJob, loading: submitting } = useApi(createJob);
  const { execute: checkBias, loading: checkingBias, data: biasResult, reset: resetBias } = useApi(runBiasCheck);

  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-Time',
    salaryMin: '',
    salaryMax: '',
    currency: '€',
    experienceRequired: '',
    description: '',
    requiredSkills: [],
    niceToHaveSkills: [],
  });
  const [skillInput, setSkillInput] = useState({ required: '', nice: '' });
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'description') resetBias?.();
  };

  const addSkill = (type, skill) => {
    const key = type === 'required' ? 'requiredSkills' : 'niceToHaveSkills';
    const trimmed = skill.trim();
    if (trimmed && !form[key].includes(trimmed)) {
      setForm((prev) => ({ ...prev, [key]: [...prev[key], trimmed] }));
    }
    setSkillInput((prev) => ({ ...prev, [type]: '' }));
  };

  const removeSkill = (type, skill) => {
    const key = type === 'required' ? 'requiredSkills' : 'niceToHaveSkills';
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((s) => s !== skill) }));
  };

  const handleBiasCheck = async () => {
    if (!form.description.trim()) {
      addNotification({ type: 'warning', message: 'Please enter a job description first.' });
      return;
    }
    await checkBias(form.description);
  };

  const [createdJob, setCreatedJob] = useState(null);

  const handleSubmit = async (publishStatus = 'Active') => {
    const minSal = form.salaryMin ? `${form.currency}${form.salaryMin}` : '';
    const maxSal = form.salaryMax ? `${form.currency}${form.salaryMax}` : '';
    const salaryRange = minSal && maxSal ? `${minSal} – ${maxSal}` : minSal || maxSal || 'Competitive';

    const jobData = {
      ...form,
      status: publishStatus,
      biasCheckPassed: biasResult ? biasResult.passed : true,
      salaryRange,
      experienceRequired: parseInt(form.experienceRequired) || 0,
    };

    const result = await submitJob(jobData);
    if (result) {
      setCreatedJob(result);
      setSubmitted(true);
      addNotification({
        type: 'success',
        title: publishStatus === 'Active' ? 'Job Published!' : 'Draft Saved!',
        message: `"${form.title}" is now ${publishStatus === 'Active' ? 'live on your dashboard' : 'saved as a draft'}.`,
      });
    }
  };

  const handleReset = () => {
    setForm({
      title: '',
      department: '',
      location: '',
      type: 'Full-Time',
      salaryMin: '',
      salaryMax: '',
      currency: '€',
      experienceRequired: '',
      description: '',
      requiredSkills: [],
      niceToHaveSkills: [],
    });
    setSkillInput({ required: '', nice: '' });
    resetBias?.();
    setCreatedJob(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="job-creator animate-fade-in-up">
        <div className="es-page-header"><h2>Post a Job</h2></div>
        <div className="job-creator__success es-card" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div className="job-creator__success-icon" style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎉</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>Job Created Successfully!</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
            <strong>{createdJob?.title}</strong> ({createdJob?.status}) has been added and saved to your active listings.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/recruiter" className="es-btn es-btn--primary">
              📋 Go to Dashboard
            </a>
            <a href={`/recruiter/shortlist?job=${createdJob?.id || ''}`} className="es-btn es-btn--secondary">
              👥 View Candidates
            </a>
            <button className="es-btn es-btn--secondary" onClick={handleReset}>
              ➕ Post Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-creator animate-fade-in-up">
      <div className="es-page-header">
        <h2>Post a Job</h2>
        <p>Create an inclusive, bias-free job listing powered by AI analysis.</p>
      </div>

      <div className="job-creator__layout">
        {/* Main Form */}
        <div className="job-creator__form">
          <div className="es-card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>Basic Information</h4>
            <div className="es-grid-2">
              <div className="es-form-group">
                <label className="es-label">Job Title *</label>
                <input className="es-input" placeholder="Senior Full-Stack Engineer" value={form.title} onChange={(e) => update('title', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Department</label>
                <input className="es-input" placeholder="Engineering" value={form.department} onChange={(e) => update('department', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Location</label>
                <input className="es-input" placeholder="Berlin, Germany (Hybrid)" value={form.location} onChange={(e) => update('location', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Employment Type</label>
                <select className="es-select" value={form.type} onChange={(e) => update('type', e.target.value)}>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Freelance</option>
                </select>
              </div>
              <div className="es-form-group">
                <label className="es-label">Min Salary</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <select className="es-select" style={{ width: 64, flexShrink: 0 }} value={form.currency} onChange={(e) => update('currency', e.target.value)}>
                    <option>€</option><option>$</option><option>£</option><option>₹</option>
                  </select>
                  <input className="es-input" type="number" placeholder="60,000" value={form.salaryMin} onChange={(e) => update('salaryMin', e.target.value)} />
                </div>
              </div>
              <div className="es-form-group">
                <label className="es-label">Max Salary</label>
                <input className="es-input" type="number" placeholder="85,000" value={form.salaryMax} onChange={(e) => update('salaryMax', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Years of Experience Required</label>
                <input className="es-input" type="number" placeholder="4" min="0" max="30" value={form.experienceRequired} onChange={(e) => update('experienceRequired', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="es-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <h4>Job Description</h4>
              <button
                className={`es-btn ${biasResult ? 'es-btn--secondary' : 'es-btn--accent'} job-creator__bias-btn`}
                onClick={handleBiasCheck}
                disabled={checkingBias}
              >
                {checkingBias ? '⏳ Checking...' : '🤖 AI Bias Check'}
              </button>
            </div>
            <div className="es-form-group" style={{ marginBottom: 0 }}>
              <textarea
                className="es-textarea"
                style={{ minHeight: 200 }}
                placeholder="Describe the role, responsibilities, qualifications, and what makes this role unique. Our AI will flag any potentially biased language..."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
              />
            </div>

            {/* Bias Check Result */}
            {biasResult && (
              <div className={`job-creator__bias-result ${biasResult.passed ? 'job-creator__bias-result--pass' : 'job-creator__bias-result--fail'}`}>
                <div className="job-creator__bias-header">
                  <span style={{ fontSize: '1.25rem' }}>{biasResult.passed ? '✅' : '⚠️'}</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {biasResult.passed ? 'Bias Check Passed' : 'Potential Bias Detected'}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      Bias Score: {biasResult.biasScore}/100 (lower is better)
                    </div>
                  </div>
                </div>
                {!biasResult.passed && (
                  <div className="job-creator__bias-suggestions">
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', marginBottom: 8 }}>Suggestions:</div>
                    {biasResult.suggestions.map((s, i) => (
                      <div key={i} className="job-creator__bias-suggestion">
                        → {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="es-card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>Skills</h4>
            {['required', 'nice'].map((type) => {
              const label = type === 'required' ? 'Required Skills *' : 'Nice-to-Have Skills';
              const key = type === 'required' ? 'requiredSkills' : 'niceToHaveSkills';
              return (
                <div key={type} className="es-form-group">
                  <label className="es-label">{label}</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      className="es-input"
                      placeholder="Add a skill..."
                      value={skillInput[type]}
                      onChange={(e) => setSkillInput((prev) => ({ ...prev, [type]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(type, skillInput[type]); } }}
                    />
                    <button className="es-btn es-btn--secondary" onClick={() => addSkill(type, skillInput[type])}>Add</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {SKILL_OPTIONS.filter((s) => !form[key].includes(s)).slice(0, 6).map((s) => (
                      <button key={s} className="profile-builder__suggestion-chip" onClick={() => addSkill(type, s)}>+ {s}</button>
                    ))}
                  </div>
                  {form[key].length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                      {form[key].map((skill) => (
                        <span
                          key={skill}
                          className={`profile-builder__skill-tag ${type === 'nice' ? 'job-creator__nice-skill' : ''}`}
                        >
                          {skill}
                          <button onClick={() => removeSkill(type, skill)}>✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <button
              className="es-btn es-btn--primary"
              disabled={!form.title || !form.description || submitting}
              onClick={() => handleSubmit('Active')}
            >
              {submitting ? '⏳ Saving...' : '🚀 Post Job'}
            </button>
            <button
              className="es-btn es-btn--secondary"
              disabled={!form.title || !form.description || submitting}
              onClick={() => handleSubmit('Draft')}
            >
              💾 Save Draft
            </button>
          </div>
        </div>

        {/* Sidebar Tips */}
        <div className="job-creator__tips">
          <div className="es-card">
            <div className="es-section-title">Inclusive Hiring Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { icon: '🎯', tip: 'Focus on skills over credentials — list required vs. nice-to-have skills separately.' },
                { icon: '🌍', tip: 'Avoid gendered language like "rockstar" or "ninja". Use neutral terms.' },
                { icon: '♿', tip: 'Include accessibility accommodations and flexible work options.' },
                { icon: '💰', tip: 'Transparency in salary ranges attracts 30% more applicants.' },
                { icon: '🤖', tip: 'Use our AI Bias Check before publishing to ensure equitable listings.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                  <p style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCreator;
