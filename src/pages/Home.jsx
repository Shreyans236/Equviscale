import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const enter = (role) => {
    login({ name: role === 'recruiter' ? 'Demo Recruiter' : 'Demo Candidate' }, role);
    navigate(`/${role}`);
  };

  return (
    <div className="home">
      {/* Background */}
      <div className="home__bg">
        <div className="home__bg-orb home__bg-orb--1" />
        <div className="home__bg-orb home__bg-orb--2" />
        <div className="home__bg-orb home__bg-orb--3" />
      </div>

      {/* Nav */}
      <nav className="home__nav">
        <div className="home__nav-brand">
          <div className="home__nav-logo">E</div>
          <span className="home__nav-name">EquiScale</span>
        </div>
        <div className="home__nav-badge">
          <span>🏆</span> SAP Hackfest 2024
        </div>
      </nav>

      {/* Hero */}
      <main className="home__hero">
        <div className="home__hero-tag animate-fade-in-up">
          <span className="home__ai-dot" />
          AI-Powered Inclusive Recruitment
        </div>

        <h1 className="home__title animate-fade-in-up">
          Hire Without
          <br />
          <span className="home__title-gradient">Bias. Hire for</span>
          <br />
          <span className="home__title-gradient">Potential.</span>
        </h1>

        <p className="home__subtitle animate-fade-in-up">
          EquiScale removes unconscious bias from hiring by anonymizing candidates
          and matching talent purely on skills, experience, and potential — not background.
        </p>

        <div className="home__portals animate-fade-in-up">
          {/* Candidate Card */}
          <div className="home__portal-card home__portal-card--candidate" onClick={() => enter('candidate')}>
            <div className="home__portal-icon">🎓</div>
            <h2>I'm a Candidate</h2>
            <p>Upload your resume, build a profile, and get matched to roles that value your skills.</p>
            <div className="home__portal-features">
              <span>✓ Resume AI parsing</span>
              <span>✓ Anonymous profile</span>
              <span>✓ Real-time tracking</span>
            </div>
            <button className="home__portal-btn">Enter Candidate Portal →</button>
          </div>

          {/* Divider */}
          <div className="home__portal-divider">
            <div className="home__portal-divider-line" />
            <span>or</span>
            <div className="home__portal-divider-line" />
          </div>

          {/* Recruiter Card */}
          <div className="home__portal-card home__portal-card--recruiter" onClick={() => enter('recruiter')}>
            <div className="home__portal-icon">🔍</div>
            <h2>I'm a Recruiter</h2>
            <p>Post inclusive job listings, shortlist anonymized candidates, and make fair, data-driven decisions.</p>
            <div className="home__portal-features">
              <span>✓ Bias-free job posts</span>
              <span>✓ Blind shortlisting</span>
              <span>✓ AI match scores</span>
            </div>
            <button className="home__portal-btn">Enter Recruiter Dashboard →</button>
          </div>
        </div>

        {/* Stats */}
        <div className="home__stats animate-fade-in-up">
          {[
            { value: '94%', label: 'Reduction in Hiring Bias' },
            { value: '3×', label: 'More Diverse Shortlists' },
            { value: '40%', label: 'Faster Time-to-Hire' },
            { value: '100%', label: 'Candidate Anonymization' },
          ].map((s) => (
            <div key={s.label} className="home__stat">
              <div className="home__stat-value">{s.value}</div>
              <div className="home__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="home__footer">
        <span>Built for SAP Hackfest 2024 · EquiScale Team</span>
        <span style={{ color: 'var(--color-text-muted)' }}>Powered by AI & SAP Fiori Design</span>
      </footer>
    </div>
  );
};

export default Home;
