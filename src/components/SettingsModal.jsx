import React, { useState } from 'react';
import { X, Sliders, Sun, Moon, Contrast, Type, ShieldCheck, Palette, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  isNightMode,
  onToggleNightMode,
  isHighContrast,
  onToggleHighContrast,
  fontScale,
  onChangeFontScale,
  onOpenAuditModal
}) {
  const [activeSection, setActiveSection] = useState('personalize'); // 'personalize' | 'privacy'

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 150,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: 'var(--border-radius-lg)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Settings Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--bg-card-border)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sliders size={22} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
            <h2 id="settings-title" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Platform Settings
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings dialog"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.2rem'
            }}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body: Sidebar Nav & Settings Options */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: '400px' }}>
          
          {/* Settings Navigation Sidebar */}
          <div
            style={{
              width: '200px',
              background: 'var(--bg-secondary)',
              borderRight: '1px solid var(--bg-card-border)',
              padding: '1rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveSection('personalize')}
              style={{
                width: '100%',
                textAlign: 'left',
                background: activeSection === 'personalize' ? 'var(--accent-cyan-bg)' : 'transparent',
                color: activeSection === 'personalize' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: activeSection === 'personalize' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--border-radius-md)',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Palette size={18} aria-hidden="true" />
              <span>Personalize</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('privacy')}
              style={{
                width: '100%',
                textAlign: 'left',
                background: activeSection === 'privacy' ? 'var(--accent-cyan-bg)' : 'transparent',
                color: activeSection === 'privacy' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: activeSection === 'privacy' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--border-radius-md)',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Lock size={18} aria-hidden="true" />
              <span>Privacy & Compliance</span>
            </button>
          </div>

          {/* Settings Content Area */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
            
            {/* PERSONALIZE SECTION */}
            {activeSection === 'personalize' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Personalize Appearance & Accessibility
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Customize visual themes, text scaling, contrast, and screen accessibility preferences.
                  </p>
                </div>

                {/* Option 1: Day / Night Theme */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-card-border)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {isNightMode ? <Moon size={18} style={{ color: 'var(--accent-purple)' }} /> : <Sun size={18} style={{ color: 'var(--accent-amber)' }} />}
                      <span>Appearance Theme</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {isNightMode ? 'Night Mode: Dark background with white text.' : 'Day Mode: Crisp white background with black text.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isNightMode}
                    onClick={onToggleNightMode}
                    style={{
                      background: isNightMode ? 'var(--accent-purple)' : 'var(--accent-amber)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--border-radius-sm)',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  >
                    {isNightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                  </button>
                </div>

                {/* Option 2: High Contrast Mode */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-card-border)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Contrast size={18} style={{ color: 'var(--accent-amber)' }} />
                      <span>High Contrast Mode (WCAG AAA)</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Enforces maximum 7:1 contrast with deep pitch black and gold highlights.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isHighContrast}
                    onClick={onToggleHighContrast}
                    style={{
                      background: isHighContrast ? 'var(--accent-amber)' : 'var(--bg-card)',
                      color: isHighContrast ? 'var(--text-inverse)' : 'var(--text-primary)',
                      border: '1px solid var(--bg-card-border)',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--border-radius-sm)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isHighContrast ? 'High Contrast ON' : 'Turn ON'}
                  </button>
                </div>

                {/* Option 3: Text Font Scale */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-card-border)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Type size={18} style={{ color: 'var(--accent-cyan)' }} />
                      <span>Text Font Scale</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Scale system text sizes for improved readability.
                    </p>
                  </div>

                  <select
                    value={fontScale}
                    onChange={(e) => onChangeFontScale(Number(e.target.value))}
                    aria-label="Adjust text scaling"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--bg-card-border)',
                      color: 'var(--accent-cyan)',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 'var(--border-radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={1}>100% Normal</option>
                    <option value={1.15}>115% Large</option>
                    <option value={1.30}>130% Extra Large</option>
                  </select>
                </div>

                {/* Option 4: WCAG Audit Panel Trigger */}
                <div
                  style={{
                    background: 'var(--accent-cyan-bg)',
                    border: '1px solid var(--accent-cyan)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ShieldCheck size={18} />
                      <span>WCAG 2.1 Compliance Matrix</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Review automated and manual accessibility compliance status.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuditModal();
                    }}
                    style={{
                      background: 'var(--accent-cyan)',
                      color: 'var(--text-inverse)',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--border-radius-sm)',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    View Audit Matrix
                  </button>
                </div>

              </div>
            )}

            {/* PRIVACY SECTION */}
            {activeSection === 'privacy' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Bias-Free Privacy & Compliance
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    EquiScale enforces strict anonymization rules to guarantee unbiased evaluation.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', borderRadius: 'var(--border-radius-md)', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                    <CheckCircle2 size={18} />
                    <span>Automatic PII Masking</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Candidate names, ages, gender, and college institution names are automatically redacted before hiring managers initiate evaluation.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Settings Modal Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--bg-card-border)', background: 'var(--bg-secondary)', textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--accent-cyan)',
              color: 'var(--text-inverse)',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--border-radius-sm)',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
