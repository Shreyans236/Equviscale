import React, { useState, useEffect } from 'react';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import BlindResumeTable from './components/BlindResumeTable';
import SkillRadarChart from './components/SkillRadarChart';
import CandidateUpskillingDashboard from './components/CandidateUpskillingDashboard';
import WCAGAuditPanel from './components/WCAGAuditPanel';
import { MOCK_CANDIDATES } from './data/mockCandidates';
import { Users, BarChart2, GraduationCap, Sparkles, LayoutGrid } from 'lucide-react';
import './App.css';

export default function App() {
  const [candidates] = useState(MOCK_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState(MOCK_CANDIDATES[0].id);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'TABLE', 'RADAR', 'UPSKILL'
  
  // Theme & Accessibility states
  const [isNightMode, setIsNightMode] = useState(false); // Default: Day Mode (White Background, Black Text)
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [announcement, setAnnouncement] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Apply data-theme attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isNightMode ? 'dark' : 'light');
  }, [isNightMode]);

  // Apply high-contrast data attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', isHighContrast ? 'true' : 'false');
  }, [isHighContrast]);

  // Apply font scaling CSS variable to <html> root
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [fontScale]);

  // Screen reader announcer helper
  const handleAnnounce = (msg) => {
    setAnnouncement(msg);
  };

  const handleSelectCandidate = (id) => {
    setSelectedCandidateId(id);
    handleAnnounce(`Selected candidate ${id} for visual analytics and skill evaluation.`);
  };

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const navigationTabs = [
    { id: 'ALL', label: 'Complete Dashboard', icon: LayoutGrid },
    { id: 'TABLE', label: 'Blind Table View', icon: Users },
    { id: 'RADAR', label: 'Skill Radar', icon: BarChart2 },
    { id: 'UPSKILL', label: 'Upskilling Pathway', icon: GraduationCap }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'background 0.25s ease, color 0.25s ease', position: 'relative' }}>
      
      {/* WCAG 2.1 Accessibility Header Toolbar */}
      <AccessibilityToolbar
        isNightMode={isNightMode}
        onToggleNightMode={() => {
          const next = !isNightMode;
          setIsNightMode(next);
          handleAnnounce(next ? 'Night Mode activated. Black background with white text.' : 'Day Mode activated. Pure white background with high-contrast black text.');
        }}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => {
          const next = !isHighContrast;
          setIsHighContrast(next);
          handleAnnounce(next ? 'WCAG AAA High Contrast Mode activated.' : 'Standard Theme restored.');
        }}
        fontScale={fontScale}
        onChangeFontScale={(scale) => {
          setFontScale(scale);
          handleAnnounce(`Font scale adjusted to ${Math.round(scale * 100)}%.`);
        }}
        announcement={announcement}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      {/* Main Dashboard Workspace (With bottom padding for bottom navigation bar) */}
      <main id="main-content" style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem 6.5rem' }}>
        


        {/* View Layout Rendering */}
        {activeTab === 'ALL' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Component 1: Blind Resume Table */}
            <BlindResumeTable
              candidates={candidates}
              selectedCandidateId={selectedCandidateId}
              onSelectCandidate={handleSelectCandidate}
              onAnnounce={handleAnnounce}
            />

            {/* Split Grid for Radar Chart & Upskilling Pathway */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
              {/* Component 2: Skill Radar Chart */}
              <SkillRadarChart candidate={selectedCandidate} />

              {/* Component 3: Candidate Upskilling Dashboard */}
              <CandidateUpskillingDashboard candidate={selectedCandidate} onAnnounce={handleAnnounce} />
            </div>
          </div>
        )}

        {activeTab === 'TABLE' && (
          <div id="tabpanel-TABLE" role="tabpanel">
            <BlindResumeTable
              candidates={candidates}
              selectedCandidateId={selectedCandidateId}
              onSelectCandidate={handleSelectCandidate}
              onAnnounce={handleAnnounce}
            />
          </div>
        )}

        {activeTab === 'RADAR' && (
          <div id="tabpanel-RADAR" role="tabpanel">
            <SkillRadarChart candidate={selectedCandidate} />
          </div>
        )}

        {activeTab === 'UPSKILL' && (
          <div id="tabpanel-UPSKILL" role="tabpanel">
            <CandidateUpskillingDashboard candidate={selectedCandidate} onAnnounce={handleAnnounce} />
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* FIXED BOTTOM NAVIGATION BAR                               */}
      {/* Click an option to immediately switch and open the view   */}
      {/* ========================================================= */}
      <nav
        aria-label="Component Navigation Bar"
        style={{
          position: 'fixed',
          bottom: '0.4rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          width: 'calc(100% - 2rem)',
          maxWidth: '850px'
        }}
      >
        <div
          role="tablist"
          aria-label="EquiScale Component Views"
          style={{
            background: 'var(--bg-secondary)',
            border: '2px solid var(--bg-card-border)',
            borderRadius: '24px',
            padding: '0.4rem 0.5rem',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(16px)'
          }}
        >
          {navigationTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  handleAnnounce(`Opened ${tab.label} component.`);
                  // Smooth scroll to top of main workspace if needed
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  flex: 1,
                  background: isActive ? 'var(--accent-cyan)' : 'transparent',
                  color: isActive ? 'var(--text-inverse)' : 'var(--text-primary)',
                  border: isActive ? '2px solid var(--text-inverse)' : 'none',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '18px',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 4px 14px rgba(2, 132, 199, 0.35)' : 'none'
                }}
              >
                <TabIcon size={18} aria-hidden="true" />
                <span style={{ whiteSpace: 'nowrap' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* WCAG Compliance Modal */}
      <WCAGAuditPanel isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />

      {/* Footer */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-card-border)', padding: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        EquiScale Enterprise hiring platform • Compliant with WCAG 2.1 AA/AAA Guidelines • Zero Cognitive Bias Evaluation
      </footer>
    </div>
  );
}
