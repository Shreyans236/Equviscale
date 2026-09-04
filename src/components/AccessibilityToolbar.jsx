import React, { useState, useRef, useEffect } from 'react';
import { Settings, Sun, Moon, Contrast, Type, ShieldCheck, X, User, CheckCircle, Building, Mail, BadgeCheck } from 'lucide-react';

export default function AccessibilityToolbar({
  isNightMode,
  onToggleNightMode,
  isHighContrast,
  onToggleHighContrast,
  fontScale,
  onChangeFontScale,
  announcement,
  onOpenAuditModal
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const settingsContainerRef = useRef(null);
  const accountContainerRef = useRef(null);

  // Close popovers when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsContainerRef.current && !settingsContainerRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
      if (accountContainerRef.current && !accountContainerRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header
      role="banner"
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--bg-card-border)',
        padding: '0.5rem 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}
    >
      {/* Live Region for Screen Readers - WCAG 4.1.3 */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', position: 'relative' }}>
        
        {/* Compact Logo & Brand Icon in a small space */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isNightMode
                ? 'linear-gradient(135deg, #38BDF8, #C084FC)'
                : 'linear-gradient(135deg, #0284C7, #7E22CE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: '900',
              fontSize: '0.95rem',
              boxShadow: '0 2px 6px rgba(2,132,199,0.25)'
            }}
          >
            EQ
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            EquiScale
          </span>
        </div>

        {/* Top Header Actions: Settings & Account Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* 1. SETTINGS BUTTON & POPOVER */}
          <div ref={settingsContainerRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
                setIsAccountOpen(false);
              }}
              aria-expanded={isSettingsOpen}
              aria-label="Open Personalization and Settings Menu"
              style={{
                background: isSettingsOpen ? 'var(--accent-cyan-bg)' : 'var(--bg-card)',
                color: isSettingsOpen ? 'var(--accent-cyan)' : 'var(--text-primary)',
                border: isSettingsOpen ? '2px solid var(--accent-cyan)' : '1px solid var(--bg-card-border)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease'
              }}
            >
              <Settings size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
              <span>Settings</span>
            </button>

            {/* Compact Settings Popover Card */}
            {isSettingsOpen && (
              <div
                role="dialog"
                aria-label="Personalization & Settings"
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  width: '310px',
                  background: 'var(--bg-card)',
                  border: '2px solid var(--bg-card-border)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: '1.15rem',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
                  zIndex: 200,
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--bg-card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Settings size={15} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
                    <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Personalize Options
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    aria-label="Close Settings menu"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '0.1rem'
                    }}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {/* Theme Option */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {isNightMode ? <Moon size={15} style={{ color: 'var(--accent-purple)' }} /> : <Sun size={15} style={{ color: 'var(--accent-amber)' }} />}
                      <span>Theme: {isNightMode ? 'Night Mode' : 'Day Mode'}</span>
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
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontWeight: '800',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {isNightMode ? 'Day Mode' : 'Night Mode'}
                    </button>
                  </div>

                  {/* High Contrast Option */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      <Contrast size={15} style={{ color: 'var(--accent-amber)' }} />
                      <span>High Contrast</span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isHighContrast}
                      onClick={onToggleHighContrast}
                      style={{
                        background: isHighContrast ? 'var(--accent-amber)' : 'var(--bg-secondary)',
                        color: isHighContrast ? 'var(--text-inverse)' : 'var(--text-primary)',
                        border: '1px solid var(--bg-card-border)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontWeight: '800',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {isHighContrast ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Text Scale Option */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      <Type size={15} style={{ color: 'var(--accent-cyan)' }} />
                      <span>Text Scale</span>
                    </div>
                    <select
                      value={fontScale}
                      onChange={(e) => onChangeFontScale(Number(e.target.value))}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--bg-card-border)',
                        color: 'var(--accent-cyan)',
                        fontWeight: '800',
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value={1}>100% Normal</option>
                      <option value={1.15}>115% Large</option>
                      <option value={1.30}>130% Extra Large</option>
                    </select>
                  </div>

                  {/* WCAG Audit Trigger */}
                  <div style={{ paddingTop: '0.4rem', borderTop: '1px solid var(--bg-card-border)', marginTop: '0.2rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        onOpenAuditModal();
                      }}
                      style={{
                        width: '100%',
                        background: 'var(--accent-cyan-bg)',
                        color: 'var(--accent-cyan)',
                        border: '1px solid var(--accent-cyan)',
                        padding: '0.4rem',
                        borderRadius: '6px',
                        fontWeight: '800',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <ShieldCheck size={15} aria-hidden="true" />
                      <span>Open WCAG 2.1 Audit Matrix</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. ACCOUNT BUTTON & POPOVER CARD */}
          <div ref={accountContainerRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setIsAccountOpen(!isAccountOpen);
                setIsSettingsOpen(false);
              }}
              aria-expanded={isAccountOpen}
              aria-label="Open Account Profile Details"
              style={{
                background: isAccountOpen ? 'var(--accent-purple-bg)' : 'var(--bg-card)',
                color: isAccountOpen ? 'var(--accent-purple)' : 'var(--text-primary)',
                border: isAccountOpen ? '2px solid var(--accent-purple)' : '1px solid var(--bg-card-border)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={18} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
            </button>

            {/* SMALL SQUARE ACCOUNT PROFILE POPOVER CARD */}
            {isAccountOpen && (
              <div
                role="dialog"
                aria-label="User Account Details"
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  width: '270px',
                  background: 'var(--bg-card)',
                  border: '2px solid var(--bg-card-border)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.15rem',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
                  zIndex: 200,
                  backdropFilter: 'blur(16px)'
                }}
              >
                {/* Topmost Right Section Cross Mark (X) */}
                <button
                  type="button"
                  onClick={() => setIsAccountOpen(false)}
                  aria-label="Close Account Details"
                  style={{
                    position: 'absolute',
                    top: '0.65rem',
                    right: '0.65rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-card-border)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <X size={14} aria-hidden="true" />
                </button>

                {/* Account Details Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--bg-card-border)' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: '800',
                      fontSize: '1rem'
                    }}
                  >
                    AM
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      Alex Morgan <BadgeCheck size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                      @alex.morgan
                    </span>
                  </div>
                </div>

                {/* Account Details List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Mail size={14} style={{ color: 'var(--accent-purple)' }} aria-hidden="true" />
                    <span>alex.morgan@equiscale.ai</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Building size={14} style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
                    <span>EquiScale Enterprise HR</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontWeight: '700', marginTop: '0.2rem' }}>
                    <CheckCircle size={14} aria-hidden="true" />
                    <span>Verified Hiring Evaluator</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
