import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import CandidateLayout from './pages/candidate/CandidateLayout';
import ResumeUpload from './pages/candidate/ResumeUpload';
import ProfileBuilder from './pages/candidate/ProfileBuilder';
import ApplicationTracker from './pages/candidate/ApplicationTracker';
import RecruiterLayout from './pages/recruiter/RecruiterLayout';
import JobCreator from './pages/recruiter/JobCreator';
import CandidateShortlist from './pages/recruiter/CandidateShortlist';
import MatchScoreView from './pages/recruiter/MatchScoreView';
import CandidateOverview from './pages/candidate/CandidateOverview';
import RecruiterOverview from './pages/recruiter/RecruiterOverview';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Home / Role Selection */}
          <Route path="/" element={<Home />} />

          {/* ── Candidate Portal ──────────────────────────────────────── */}
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<CandidateOverview />} />
            <Route path="resume" element={<ResumeUpload />} />
            <Route path="profile" element={<ProfileBuilder />} />
            <Route path="applications" element={<ApplicationTracker />} />
          </Route>

          {/* ── Recruiter Dashboard ──────────────────────────────────── */}
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route index element={<RecruiterOverview />} />
            <Route path="jobs/new" element={<JobCreator />} />
            <Route path="shortlist" element={<CandidateShortlist />} />
            <Route path="match-scores" element={<MatchScoreView />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
