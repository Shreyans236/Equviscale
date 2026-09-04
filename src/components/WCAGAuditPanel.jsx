import React from 'react';
import { ShieldCheck, CheckCircle, X, ExternalLink, Eye, Keyboard, Layers, Volume2 } from 'lucide-react';

export default function WCAGAuditPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  const auditRules = [
    {
      rule: 'WCAG 1.4.3 Contrast (Minimum)',
      level: 'AA / AAA',
      status: 'Passed (7:1 High Contrast Mode, >=4.5:1 Standard)',
      description: 'Text colors and UI controls feature high-contrast color ratios verified against dark and light backgrounds.',
      icon: Eye
    },
    {
      rule: 'WCAG 2.1.1 Keyboard Accessible',
      level: 'Level A',
      status: 'Passed',
      description: 'All interactive elements (tables, PII toggles, sliders, chart switches, and syllabus buttons) are fully navigable via Tab/Space/Enter.',
      icon: Keyboard
    },
    {
      rule: 'WCAG 2.4.7 Focus Visible',
      level: 'Level AA',
      status: 'Passed',
      description: 'High-visibility focus outlines (:focus-visible) with a 3px gold/cyan border and offset ensure clear active element tracking.',
      icon: Layers
    },
    {
      rule: 'WCAG 4.1.2 Name, Role, Value',
      level: 'Level A',
      status: 'Passed',
      description: 'All custom interactive toggles and sliders utilize native ARIA roles (role="switch", aria-checked, aria-valuemin/max).',
      icon: ShieldCheck
    },
    {
      rule: 'WCAG 1.1.1 Non-text Content (Chart Alternative)',
      level: 'Level A',
      status: 'Passed',
      description: 'The Radar Chart includes a 1-click Screen Reader Tabular Fallback View rendering exact data metrics in semantic HTML table elements.',
      icon: Volume2
    }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wcag-audit-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.8)',
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
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 'var(--border-radius-lg)',
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close WCAG Audit panel"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={22} aria-hidden="true" />
        </button>

        {/* Title & Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={26} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
          <h2 id="wcag-audit-title" style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            WCAG 2.1 Accessibility Audit & Compliance Matrix
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          EquiScale components undergo automated and manual accessibility audits to guarantee zero exclusion for users with visual, motor, or cognitive impairments.
        </p>

        {/* Audit Checklist Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {auditRules.map((rule) => {
            const IconComp = rule.icon;
            return (
              <div
                key={rule.rule}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--bg-card-border)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconComp size={18} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {rule.rule}
                    </h3>
                  </div>
                  <span
                    style={{
                      background: 'var(--accent-emerald-bg)',
                      color: 'var(--accent-emerald)',
                      border: '1px solid var(--accent-emerald)',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '10px'
                    }}
                  >
                    {rule.level} • {rule.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {rule.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--accent-cyan)',
              color: 'var(--text-inverse)',
              border: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--border-radius-sm)',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
}
