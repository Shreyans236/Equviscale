import { useState } from 'react';
import { updateCandidateProfile } from '../../api/candidateApi';
import { useAppContext } from '../../context/AppContext';
import useApi from '../../hooks/useApi';
import './ProfileBuilder.css';

const STEPS = ['Personal Info', 'Experience', 'Skills & Education', 'Portfolio'];

const SKILL_SUGGESTIONS = [
  'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'SQL', 'AWS', 'Docker',
  'Kubernetes', 'Machine Learning', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Spring Boot',
];

const ProfileBuilder = () => {
  const { addNotification } = useAppContext();
  const { execute: saveProfile, loading: saving } = useApi(updateCandidateProfile);

  const [step, setStep] = useState(0);
  const [skillInput, setSkillInput] = useState('');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    jobTitle: '',
    experience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    skills: [],
    education: '',
    graduationYear: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    certifications: '',
  });

  const update = (field, value) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      update('skills', [...profile.skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) =>
    update('skills', profile.skills.filter((s) => s !== skill));

  const updateExperience = (idx, field, value) => {
    const updated = profile.experience.map((exp, i) =>
      i === idx ? { ...exp, [field]: value } : exp
    );
    update('experience', updated);
  };

  const addExperience = () =>
    update('experience', [
      ...profile.experience,
      { company: '', role: '', startDate: '', endDate: '', description: '' },
    ]);

  const handleSave = async () => {
    const result = await saveProfile('candidate-local', profile);
    if (result) {
      addNotification({ type: 'success', title: 'Profile Saved', message: 'Your profile has been updated successfully.' });
    }
  };

  const isStepComplete = (s) => {
    if (s === 0) return profile.firstName && profile.lastName && profile.email;
    if (s === 1) return profile.experience[0]?.company && profile.experience[0]?.role;
    if (s === 2) return profile.skills.length > 0 && profile.education;
    return true;
  };

  return (
    <div className="profile-builder animate-fade-in-up">
      <div className="es-page-header">
        <h2>Profile Builder</h2>
        <p>Build a comprehensive, AI-ready profile to maximize your match scores.</p>
      </div>

      {/* Steps */}
      <div className="es-steps">
        {STEPS.map((label, i) => (
          <div key={label} className="es-step">
            <button
              className={`es-step__dot ${i === step ? 'es-step__dot--active' : i < step ? 'es-step__dot--done' : ''}`}
              onClick={() => i <= step && setStep(i)}
            >
              {i < step ? '✓' : i + 1}
            </button>
            <span
              className={`es-step__label ${i === step ? 'es-step__label--active' : i < step ? 'es-step__label--done' : ''}`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`es-step__line ${i < step ? 'es-step__line--done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div className="es-card profile-builder__card">
        {/* ── Step 0: Personal Info ─────────────────────────────────────────── */}
        {step === 0 && (
          <div className="profile-builder__section animate-fade-in">
            <h3>Personal Information</h3>
            <div className="es-grid-2" style={{ marginTop: 'var(--space-lg)' }}>
              <div className="es-form-group">
                <label className="es-label">First Name *</label>
                <input className="es-input" placeholder="Alex" value={profile.firstName} onChange={(e) => update('firstName', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Last Name *</label>
                <input className="es-input" placeholder="Johnson" value={profile.lastName} onChange={(e) => update('lastName', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Email Address *</label>
                <input className="es-input" type="email" placeholder="alex@example.com" value={profile.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Phone</label>
                <input className="es-input" placeholder="+1 (555) 000-0000" value={profile.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Location</label>
                <input className="es-input" placeholder="Berlin, Germany" value={profile.location} onChange={(e) => update('location', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Current / Desired Role</label>
                <input className="es-input" placeholder="Senior Full-Stack Engineer" value={profile.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} />
              </div>
            </div>
            <div className="es-form-group">
              <label className="es-label">Professional Summary</label>
              <textarea className="es-textarea" placeholder="Briefly describe your experience, skills, and career goals..." value={profile.summary} onChange={(e) => update('summary', e.target.value)} />
            </div>
          </div>
        )}

        {/* ── Step 1: Experience ────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="profile-builder__section animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <h3>Work Experience</h3>
              <button className="es-btn es-btn--secondary" onClick={addExperience}>
                + Add Position
              </button>
            </div>
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="profile-builder__exp-block">
                <div className="profile-builder__exp-number">Position {idx + 1}</div>
                <div className="es-grid-2">
                  <div className="es-form-group">
                    <label className="es-label">Company *</label>
                    <input className="es-input" placeholder="Company Name" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} />
                  </div>
                  <div className="es-form-group">
                    <label className="es-label">Role *</label>
                    <input className="es-input" placeholder="Software Engineer" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} />
                  </div>
                  <div className="es-form-group">
                    <label className="es-label">Start Date</label>
                    <input className="es-input" type="month" value={exp.startDate} onChange={(e) => updateExperience(idx, 'startDate', e.target.value)} />
                  </div>
                  <div className="es-form-group">
                    <label className="es-label">End Date</label>
                    <input className="es-input" type="month" placeholder="Present" value={exp.endDate} onChange={(e) => updateExperience(idx, 'endDate', e.target.value)} />
                  </div>
                </div>
                <div className="es-form-group">
                  <label className="es-label">Key Responsibilities</label>
                  <textarea className="es-textarea" style={{ minHeight: 80 }} placeholder="Describe your key responsibilities and achievements..." value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Step 2: Skills & Education ────────────────────────────────────── */}
        {step === 2 && (
          <div className="profile-builder__section animate-fade-in">
            <h3>Skills & Education</h3>
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <div className="es-form-group">
                <label className="es-label">Add Skills *</label>
                <div className="profile-builder__skill-input-row">
                  <input
                    className="es-input"
                    placeholder="Type a skill and press Enter or comma"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                  />
                  <button className="es-btn es-btn--secondary" onClick={() => addSkill(skillInput)}>Add</button>
                </div>
                <div className="profile-builder__suggestions">
                  {SKILL_SUGGESTIONS.filter((s) => !profile.skills.includes(s)).slice(0, 8).map((s) => (
                    <button key={s} className="profile-builder__suggestion-chip" onClick={() => addSkill(s)}>
                      + {s}
                    </button>
                  ))}
                </div>
                {profile.skills.length > 0 && (
                  <div className="profile-builder__skills-list">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="profile-builder__skill-tag">
                        {skill}
                        <button onClick={() => removeSkill(skill)}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="es-grid-2">
                <div className="es-form-group">
                  <label className="es-label">Highest Education *</label>
                  <select className="es-select" value={profile.education} onChange={(e) => update('education', e.target.value)}>
                    <option value="">Select...</option>
                    <option>High School Diploma</option>
                    <option>Associate's Degree</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>PhD / Doctorate</option>
                    <option>Professional Certification</option>
                    <option>Self-Taught / Bootcamp</option>
                  </select>
                </div>
                <div className="es-form-group">
                  <label className="es-label">Graduation Year</label>
                  <input className="es-input" type="number" placeholder="2022" min="1970" max="2030" value={profile.graduationYear} onChange={(e) => update('graduationYear', e.target.value)} />
                </div>
              </div>
              <div className="es-form-group">
                <label className="es-label">Certifications</label>
                <input className="es-input" placeholder="AWS Certified Solutions Architect, Google Cloud Professional..." value={profile.certifications} onChange={(e) => update('certifications', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Portfolio ─────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="profile-builder__section animate-fade-in">
            <h3>Portfolio & Links</h3>
            <div style={{ marginTop: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div className="es-form-group">
                <label className="es-label">LinkedIn Profile</label>
                <input className="es-input" type="url" placeholder="https://linkedin.com/in/yourname" value={profile.linkedIn} onChange={(e) => update('linkedIn', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">GitHub Profile</label>
                <input className="es-input" type="url" placeholder="https://github.com/yourname" value={profile.github} onChange={(e) => update('github', e.target.value)} />
              </div>
              <div className="es-form-group">
                <label className="es-label">Portfolio Website</label>
                <input className="es-input" type="url" placeholder="https://yourportfolio.com" value={profile.portfolio} onChange={(e) => update('portfolio', e.target.value)} />
              </div>
            </div>

            {/* Preview Card */}
            <div className="profile-builder__preview">
              <div className="es-section-title">Profile Preview</div>
              <div className="profile-builder__preview-card es-card">
                <div className="profile-builder__preview-header">
                  <div className="profile-builder__avatar">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                      {profile.firstName || 'First'} {profile.lastName || 'Last'}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                      {profile.jobTitle || 'Your Role'}
                    </div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                      {profile.location || 'Location'}
                    </div>
                  </div>
                </div>
                {profile.skills.length > 0 && (
                  <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {profile.skills.slice(0, 8).map((s) => (
                      <span key={s} className="es-tag">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="profile-builder__nav">
          {step > 0 && (
            <button className="es-btn es-btn--secondary" onClick={() => setStep((s) => s - 1)}>
              ← Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <button
              className="es-btn es-btn--primary"
              disabled={!isStepComplete(step)}
              onClick={() => setStep((s) => s + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="es-btn es-btn--accent"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '⏳ Saving...' : '✓ Save Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileBuilder;
