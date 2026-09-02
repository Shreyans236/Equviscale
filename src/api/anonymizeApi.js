import axiosInstance from './axiosInstance';

// ── Mock Data ──────────────────────────────────────────────────────────────────
const MOCK_MATCH_SCORES = {
  'c-001': {
    candidateId: 'c-001',
    anonymizedId: 'ANON-7842',
    jobId: 'j-101',
    overallScore: 92,
    breakdown: {
      skillsMatch: 95,
      experienceMatch: 88,
      educationMatch: 90,
      cultureFitScore: 85,
    },
    topMatchingSkills: ['React', 'Node.js', 'PostgreSQL'],
    missingSkills: ['Kubernetes'],
    recommendation: 'Strong Match — Highly recommended for interview.',
  },
  'c-004': {
    candidateId: 'c-004',
    anonymizedId: 'ANON-9102',
    jobId: 'j-101',
    overallScore: 95,
    breakdown: {
      skillsMatch: 98,
      experienceMatch: 92,
      educationMatch: 88,
      cultureFitScore: 94,
    },
    topMatchingSkills: ['React', 'TypeScript', 'GraphQL', 'PostgreSQL'],
    missingSkills: [],
    recommendation: 'Exceptional Match — Top candidate for this role.',
  },
};

const USE_MOCK = true;

// ── API Methods ────────────────────────────────────────────────────────────────

export const anonymizeCandidate = async (candidateId) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            candidateId,
            anonymizedId: `ANON-${Math.floor(Math.random() * 9000) + 1000}`,
            anonymizedFields: ['name', 'email', 'phone', 'photo', 'address', 'age', 'gender'],
            status: 'anonymized',
          }),
        700
      )
    );
  }
  return axiosInstance.post('/api/v1/anonymize', { candidateId });
};

export const getAnonymizedList = async (jobId) => {
  if (USE_MOCK) {
    // Return a list of anonymized candidate objects (no PII)
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            {
              anonymizedId: 'ANON-7842',
              skills: ['React', 'Node.js', 'Python', 'SQL'],
              experience: 4,
              education: "Bachelor's",
              matchScore: 92,
              jobId,
            },
            {
              anonymizedId: 'ANON-3319',
              skills: ['Java', 'Spring Boot', 'Kubernetes', 'AWS'],
              experience: 6,
              education: "Master's",
              matchScore: 87,
              jobId,
            },
            {
              anonymizedId: 'ANON-5561',
              skills: ['Python', 'ML', 'TensorFlow', 'Docker'],
              experience: 3,
              education: "Bachelor's",
              matchScore: 79,
              jobId,
            },
            {
              anonymizedId: 'ANON-9102',
              skills: ['TypeScript', 'GraphQL', 'React', 'PostgreSQL'],
              experience: 5,
              education: "Bachelor's",
              matchScore: 95,
              jobId,
            },
          ]),
        600
      )
    );
  }
  return axiosInstance.get(`/api/v1/anonymize/list`, { params: { jobId } });
};

export const getMatchScores = async (candidateId, jobId) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => {
        const data = MOCK_MATCH_SCORES[candidateId] || {
          candidateId,
          anonymizedId: 'ANON-0000',
          jobId,
          overallScore: Math.floor(Math.random() * 40) + 60,
          breakdown: {
            skillsMatch: Math.floor(Math.random() * 40) + 60,
            experienceMatch: Math.floor(Math.random() * 40) + 60,
            educationMatch: Math.floor(Math.random() * 40) + 60,
            cultureFitScore: Math.floor(Math.random() * 40) + 60,
          },
          topMatchingSkills: ['JavaScript', 'SQL'],
          missingSkills: ['Docker'],
          recommendation: 'Moderate Match — Consider for second review.',
        };
        resolve(data);
      }, 500)
    );
  }
  return axiosInstance.get(`/api/v1/anonymize/match-scores`, {
    params: { candidateId, jobId },
  });
};

export const bulkAnonymize = async (jobId) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            jobId,
            processed: 4,
            status: 'completed',
            message: 'All candidates anonymized successfully.',
          }),
        1500
      )
    );
  }
  return axiosInstance.post('/api/v1/anonymize/bulk', { jobId });
};
