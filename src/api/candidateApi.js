import axiosInstance from './axiosInstance';

// ── Mock Data ──────────────────────────────────────────────────────────────────
const MOCK_CANDIDATES = [
  {
    id: 'c-001',
    anonymizedId: 'ANON-7842',
    skills: ['React', 'Node.js', 'Python', 'SQL'],
    experience: 4,
    education: "Bachelor's in Computer Science",
    matchScore: 92,
    status: 'Interview',
    appliedDate: '2024-08-15',
    jobId: 'j-101',
  },
  {
    id: 'c-002',
    anonymizedId: 'ANON-3319',
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'AWS'],
    experience: 6,
    education: "Master's in Software Engineering",
    matchScore: 87,
    status: 'Screening',
    appliedDate: '2024-08-18',
    jobId: 'j-101',
  },
  {
    id: 'c-003',
    anonymizedId: 'ANON-5561',
    skills: ['Python', 'ML', 'TensorFlow', 'Docker'],
    experience: 3,
    education: "Bachelor's in Data Science",
    matchScore: 79,
    status: 'Applied',
    appliedDate: '2024-08-20',
    jobId: 'j-102',
  },
  {
    id: 'c-004',
    anonymizedId: 'ANON-9102',
    skills: ['TypeScript', 'GraphQL', 'React', 'PostgreSQL'],
    experience: 5,
    education: "Bachelor's in Information Technology",
    matchScore: 95,
    status: 'Offer',
    appliedDate: '2024-08-10',
    jobId: 'j-101',
  },
];

const MY_APPLICATIONS = [
  {
    id: 'app-001',
    jobTitle: 'Senior Full-Stack Engineer',
    company: 'TechCorp AG',
    appliedDate: '2024-08-15',
    status: 'Interview',
    matchScore: 92,
    nextStep: 'Technical Interview on Sep 5, 2024',
  },
  {
    id: 'app-002',
    jobTitle: 'Data Engineer',
    company: 'Analytics GmbH',
    appliedDate: '2024-08-18',
    status: 'Screening',
    matchScore: 78,
    nextStep: 'Resume under review',
  },
  {
    id: 'app-003',
    jobTitle: 'Cloud Solutions Architect',
    company: 'CloudBase Ltd',
    appliedDate: '2024-08-22',
    status: 'Applied',
    matchScore: 65,
    nextStep: 'Awaiting initial review',
  },
];

const USE_MOCK = true; // Set to false to use real API

// ── API Methods ────────────────────────────────────────────────────────────────

export const getCandidates = async (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_CANDIDATES), 600));
  }
  return axiosInstance.get('/api/v1/candidates', { params });
};

export const getCandidateById = async (id) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_CANDIDATES.find((c) => c.id === id)), 400)
    );
  }
  return axiosInstance.get(`/api/v1/candidates/${id}`);
};

export const createCandidate = async (candidateData) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ id: `c-${Date.now()}`, ...candidateData, status: 'created' }), 800)
    );
  }
  return axiosInstance.post('/api/v1/candidates', candidateData);
};

export const uploadResume = async (file, onUploadProgress) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (onUploadProgress) onUploadProgress({ loaded: progress, total: 100 });
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            success: true,
            fileId: `file-${Date.now()}`,
            filename: file.name,
            parsedSkills: ['React', 'Node.js', 'Python'],
            parsedExperience: 4,
          });
        }
      }, 400);
    });
  }
  const formData = new FormData();
  formData.append('resume', file);
  return axiosInstance.post('/api/v1/candidates/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};

export const analyzeResume = async (resume, job) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const resumeSkills = resume.parsedSkills || [];
        const requiredSkills = job.requiredSkills || [];
        const niceToHaveSkills = job.niceToHaveSkills || [];
        const normalizedResumeSkills = resumeSkills.map((skill) => skill.toLowerCase());
        const matchingSkills = requiredSkills.filter((skill) =>
          normalizedResumeSkills.includes(skill.toLowerCase())
        );
        const missingSkills = requiredSkills.filter((skill) =>
          !normalizedResumeSkills.includes(skill.toLowerCase())
        );
        const bonusSkills = niceToHaveSkills.filter((skill) =>
          normalizedResumeSkills.includes(skill.toLowerCase())
        );
        const experienceScore = Math.min(
          100,
          Math.round((resume.parsedExperience / Math.max(job.experienceRequired, 1)) * 100)
        );
        const skillsScore = requiredSkills.length
          ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
          : 100;
        const overallScore = Math.round(skillsScore * 0.65 + Math.min(experienceScore, 100) * 0.35);

        resolve({
          jobId: job.id,
          jobTitle: job.title,
          overallScore,
          skillsScore,
          experienceScore: Math.min(experienceScore, 100),
          matchingSkills,
          missingSkills,
          bonusSkills,
          recommendations: {
            content: missingSkills.length
              ? `Add measurable outcomes to projects that demonstrate ${missingSkills.slice(0, 2).join(' and ')}. Mirror the role language only where it truthfully reflects your experience.`
              : 'Your experience is well aligned. Strengthen each role with measurable outcomes, scope, and the tools you used.',
            certificates: missingSkills.includes('AWS') || missingSkills.includes('Azure')
              ? 'Consider a cloud fundamentals certification that matches the platform used in this role.'
              : 'No certificate is essential for this match. Prioritize a project or portfolio example over collecting another credential.',
            skills: missingSkills.length
              ? `Build or highlight evidence for ${missingSkills.join(', ')}. ${bonusSkills.length ? `Your ${bonusSkills.join(' and ')} experience is a useful differentiator.` : ''}`
              : 'Keep your core skills prominent and add the depth of each skill in your project bullets.',
          },
        });
      }, 900);
    });
  }
  return axiosInstance.post('/api/v1/candidates/resume/analyze', { resume, job });
};

export const getMyApplications = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(MY_APPLICATIONS), 500));
  }
  return axiosInstance.get('/api/v1/candidates/applications');
};

export const updateCandidateProfile = async (id, profileData) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ id, ...profileData, updated: true }), 700)
    );
  }
  return axiosInstance.put(`/api/v1/candidates/${id}`, profileData);
};
