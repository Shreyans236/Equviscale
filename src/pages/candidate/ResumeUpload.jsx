import { useState, useCallback, useEffect, useRef } from 'react';
import { analyzeResume, uploadResume } from '../../api/candidateApi';
import { getJobs } from '../../api/jobsApi';
import { useAppContext } from '../../context/AppContext';
import './ResumeUpload.css';

const ACCEPTED_TYPES = ['.pdf', '.doc', '.docx'];
const MAX_SIZE_MB = 10;

const ResumeUpload = () => {
  const { addNotification } = useAppContext();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getJobs().then((availableJobs) => {
      const activeJobs = availableJobs.filter((job) => job.status === 'Active');
      setJobs(activeJobs);
      if (activeJobs[0]) setSelectedJobId(activeJobs[0].id);
    });
  }, []);

  const validateFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      return `Invalid file type. Please upload ${ACCEPTED_TYPES.join(', ')}.`;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Max size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = (f) => {
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setFile(f);
    setUploadResult(null);
    setProgress(0);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = () => setDragActive(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadResume(file, ({ loaded, total }) => {
        setProgress(Math.round((loaded / total) * 100));
      });
      setUploadResult(result);
      setAnalysis(null);
      addNotification({
        type: 'success',
        title: 'Resume Uploaded',
        message: 'Your resume has been parsed and skills extracted.',
      });
    } catch (err) {
      setError('Upload failed. Please try again.');
      addNotification({ type: 'error', title: 'Upload Failed', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    const selectedJob = jobs.find((job) => job.id === selectedJobId);
    if (!uploadResult || !selectedJob) return;
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeResume(uploadResult, selectedJob);
      setAnalysis(result);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      addNotification({ type: 'error', title: 'Analysis Failed', message: err.message });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
    setAnalysis(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="resume-upload animate-fade-in-up">
      <div className="es-page-header">
        <h2>Resume Upload</h2>
        <p>Upload your resume and let our AI extract your skills and experience automatically.</p>
      </div>

      {!uploadResult ? (
        <div className="resume-upload__body">
          {/* Drop Zone */}
          <div
            className={`resume-upload__dropzone ${dragActive ? 'resume-upload__dropzone--active' : ''} ${file ? 'resume-upload__dropzone--has-file' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="resume-upload__file-preview">
                <div className="resume-upload__file-icon">📄</div>
                <div className="resume-upload__file-info">
                  <div className="resume-upload__file-name">{file.name}</div>
                  <div className="resume-upload__file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <button
                  className="es-btn es-btn--secondary resume-upload__remove"
                  onClick={(e) => { e.stopPropagation(); handleReset(); }}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <>
                <div className="resume-upload__icon">☁</div>
                <div className="resume-upload__title">
                  Drag & drop your resume here
                </div>
                <div className="resume-upload__subtitle">
                  or <span className="resume-upload__browse">browse files</span>
                </div>
                <div className="resume-upload__hint">
                  Supports PDF, DOC, DOCX · Max {MAX_SIZE_MB}MB
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="resume-upload__error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Progress */}
          {uploading && (
            <div className="resume-upload__progress-wrap">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Uploading & parsing...
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {progress}%
                </span>
              </div>
              <div className="es-progress">
                <div className="es-progress__bar" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="resume-upload__actions">
            <button
              className="es-btn es-btn--primary"
              disabled={!file || uploading}
              onClick={handleUpload}
            >
              {uploading ? '⏳ Uploading...' : '⬆ Upload Resume'}
            </button>
            {file && !uploading && (
              <button className="es-btn es-btn--secondary" onClick={handleReset}>
                Clear
              </button>
            )}
          </div>

          {/* Info Cards */}
          <div className="es-grid-3 resume-upload__info-grid">
            {[
              { icon: '🤖', title: 'AI Parsing', desc: 'Skills, experience, and education extracted automatically' },
              { icon: '🔒', title: 'Privacy First', desc: 'Your data is anonymized before being shared with recruiters' },
              { icon: '⚡', title: 'Instant Match', desc: 'Get matched to open roles based on your extracted profile' },
            ].map((item) => (
              <div key={item.title} className="es-card resume-upload__info-card">
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <h4>{item.title}</h4>
                <p style={{ fontSize: '0.8125rem', marginTop: 4 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Upload Success View ──────────────────────────────────────────── */
        <div className="resume-upload__result animate-fade-in-up">
          <div className="resume-upload__result-header">
            <div className="resume-upload__result-icon">✓</div>
            <div>
              <h3>Resume Parsed Successfully</h3>
              <p>Your profile has been created from <strong>{file?.name}</strong></p>
            </div>
          </div>

          <div className="resume-upload__match-panel es-card">
            <div>
              <div className="es-section-title">Compare with a target role</div>
              <p className="resume-upload__section-copy">
                See which requirements your resume already proves and what to strengthen next.
              </p>
            </div>
            <div className="resume-upload__match-controls">
              <select
                className="es-select"
                value={selectedJobId}
                onChange={(e) => { setSelectedJobId(e.target.value); setAnalysis(null); }}
                disabled={analyzing}
              >
                {jobs.length === 0 && <option value="">No active roles available</option>}
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
              <button
                className="es-btn es-btn--primary"
                onClick={handleAnalyze}
                disabled={!selectedJobId || analyzing}
              >
                {analyzing ? 'Analyzing resume...' : 'Analyze against role'}
              </button>
            </div>
          </div>

          {analysis && (
            <div className="resume-upload__analysis animate-fade-in-up">
              <div className="resume-upload__analysis-heading">
                <div>
                  <div className="es-section-title">Your improvement plan</div>
                  <p>Analysis for <strong>{analysis.jobTitle}</strong></p>
                </div>
                <div className="resume-upload__match-score">
                  <strong>{analysis.overallScore}%</strong>
                  <span>current match</span>
                </div>
              </div>
              <div className="resume-upload__score-grid">
                <div><span>Required skills</span><strong>{analysis.skillsScore}%</strong></div>
                <div><span>Experience level</span><strong>{analysis.experienceScore}%</strong></div>
                <div><span>Skills to address</span><strong>{analysis.missingSkills.length}</strong></div>
              </div>
              <div className="es-grid-3 resume-upload__recommendations">
                <div className="es-card resume-upload__recommendation-card">
                  <span className="resume-upload__recommendation-icon">✎</span>
                  <h4>Resume content</h4>
                  <p>{analysis.recommendations.content}</p>
                </div>
                <div className="es-card resume-upload__recommendation-card">
                  <span className="resume-upload__recommendation-icon">◇</span>
                  <h4>Certificates</h4>
                  <p>{analysis.recommendations.certificates}</p>
                </div>
                <div className="es-card resume-upload__recommendation-card">
                  <span className="resume-upload__recommendation-icon">↗</span>
                  <h4>Skills to polish</h4>
                  <p>{analysis.recommendations.skills}</p>
                </div>
              </div>
              <div className="resume-upload__skill-lists">
                <div>
                  <h4>Strong evidence</h4>
                  <div className="resume-upload__skill-tags">
                    {analysis.matchingSkills.length > 0
                      ? analysis.matchingSkills.map((skill) => <span key={skill} className="es-badge es-badge--success">✓ {skill}</span>)
                      : <span className="resume-upload__muted">No required skills matched yet.</span>}
                  </div>
                </div>
                <div>
                  <h4>Priority gaps</h4>
                  <div className="resume-upload__skill-tags">
                    {analysis.missingSkills.length > 0
                      ? analysis.missingSkills.map((skill) => <span key={skill} className="es-badge es-badge--warning">! {skill}</span>)
                      : <span className="resume-upload__muted">No required skill gaps found.</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="es-grid-2">
            <div className="es-card">
              <div className="es-section-title">Extracted Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {uploadResult.parsedSkills?.map((skill) => (
                  <span key={skill} className="es-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="es-card">
              <div className="es-section-title">Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Experience</span>
                  <span style={{ fontWeight: 600 }}>{uploadResult.parsedExperience} years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>File ID</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {uploadResult.fileId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="resume-upload__actions">
            <button className="es-btn es-btn--primary" onClick={handleReset}>
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
