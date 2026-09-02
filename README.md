# EquiScale — AI-Powered Inclusive Recruitment Platform

> **SAP Hackfest 2024** | Built by Team EquiScale

EquiScale is a dual-sided AI-powered recruitment platform that removes unconscious bias from hiring by anonymizing candidates and matching talent purely on skills, experience, and potential.

---

## 🚀 Features

### 🎓 Candidate Portal (`/candidate`)
| Feature | Description |
|---|---|
| **Resume Upload** | Drag-and-drop resume upload with AI skill parsing and progress tracking |
| **Profile Builder** | 4-step guided builder for personal info, experience, skills, and portfolio |
| **Application Tracker** | Real-time pipeline view (Applied → Screening → Interview → Offer) with match scores |

### 🔍 Recruiter Dashboard (`/recruiter`)
| Feature | Description |
|---|---|
| **Job Creator** | Rich job form with AI bias detection on job descriptions |
| **Blind Shortlist** | Anonymized candidate table — no names, photos, or PII; sortable by match score |
| **Match Score View** | AI breakdown of candidate-job compatibility: skills, experience, education, culture fit |

### 🔌 API Integration Layer
| Endpoint | File | Mock | 
|---|---|---|
| `/api/v1/candidates` | `src/api/candidateApi.js` | ✅ |
| `/api/v1/jobs` | `src/api/jobsApi.js` | ✅ |
| `/api/v1/anonymize` | `src/api/anonymizeApi.js` | ✅ |

---

## 🗂 Project Structure

```
src/
├── api/                    # API integration layer (mock + real)
│   ├── axiosInstance.js    # Configured axios client
│   ├── candidateApi.js     # Candidate endpoints
│   ├── jobsApi.js          # Job endpoints
│   └── anonymizeApi.js     # Anonymization & match score endpoints
├── components/
│   ├── Layout/             # AppShell, Navbar, Sidebar
│   └── common/             # StatusBadge, ScoreGauge, LoadingSpinner
├── context/
│   └── AppContext.jsx      # Global state (user, role, notifications)
├── hooks/
│   └── useApi.js           # Generic async API hook
├── pages/
│   ├── Home.jsx            # Landing / role selection
│   ├── candidate/          # Candidate portal pages
│   └── recruiter/          # Recruiter dashboard pages
├── styles/
│   └── globals.css         # Design tokens, utilities, components
└── App.jsx                 # Root router
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18 + Vite** | Core framework & build tool |
| **React Router v6** | File-based nested routing |
| **Axios** | HTTP client with interceptors |
| **@ui5/webcomponents-react** | SAP Fiori design system |
| **Custom CSS** | Premium dark mode design system |

---

## ⚡ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs at **http://localhost:5173**

---

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> **Note:** The app ships with full mock data. Set `USE_MOCK = false` in each API file to connect to your real backend.

---

## 🏗 API Endpoints (Backend Contract)

### Candidates
```
GET    /api/v1/candidates          — List all candidates
GET    /api/v1/candidates/:id      — Get candidate by ID
POST   /api/v1/candidates          — Create candidate profile
POST   /api/v1/candidates/resume   — Upload & parse resume
PUT    /api/v1/candidates/:id      — Update profile
GET    /api/v1/candidates/applications — Get my applications
```

### Jobs
```
GET    /api/v1/jobs               — List all jobs
GET    /api/v1/jobs/:id           — Get job by ID
POST   /api/v1/jobs               — Create a job listing
PUT    /api/v1/jobs/:id           — Update a job
DELETE /api/v1/jobs/:id           — Delete a job
POST   /api/v1/jobs/bias-check    — Run AI bias check on description
```

### Anonymization & Matching
```
POST   /api/v1/anonymize          — Anonymize a candidate
GET    /api/v1/anonymize/list     — Get anonymized candidate list for a job
GET    /api/v1/anonymize/match-scores — Get AI match score breakdown
POST   /api/v1/anonymize/bulk     — Bulk anonymize all candidates for a job
```

---

## 🎨 Design System

The app uses a custom dark-mode design system with:
- **CSS Custom Properties** for all tokens
- **Inter + Plus Jakarta Sans** typography
- **SAP Fiori** color alignment
- Glassmorphism cards, animated orbs, SVG score gauges
- Fully responsive grid system

---

## 👥 Team

Built for **SAP Hackfest 2024** by Team EquiScale.

> *"Inclusive hiring isn't just ethical — it's smart business."*
