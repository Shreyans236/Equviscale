import { useState, useCallback, useRef } from 'react';
import { uploadResume } from '../../api/candidateApi';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
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
  const [error, setError] = useState(null);

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

  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
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
