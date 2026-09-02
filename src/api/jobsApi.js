import axiosInstance from './axiosInstance';

// ── Mock Data ──────────────────────────────────────────────────────────────────
const MOCK_JOBS = [
  {
    id: 'j-101',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Berlin, Germany (Hybrid)',
    type: 'Full-Time',
    salaryRange: '€70,000 – €90,000',
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    niceToHaveSkills: ['Kubernetes', 'GraphQL'],
    experienceRequired: 4,
    description:
      'We are looking for a Senior Full-Stack Engineer to join our core product team. You will architect scalable web applications and mentor junior developers.',
    biasCheckPassed: true,
    applicantCount: 34,
    status: 'Active',
    createdAt: '2024-08-01',
  },
  {
    id: 'j-102',
    title: 'Data Engineer',
    department: 'Data & Analytics',
    location: 'Munich, Germany (Remote)',
    type: 'Full-Time',
    salaryRange: '€65,000 – €85,000',
    requiredSkills: ['Python', 'Apache Spark', 'SQL', 'AWS'],
    niceToHaveSkills: ['dbt', 'Airflow'],
    experienceRequired: 3,
    description:
      'Join our data team to build and maintain data pipelines that power our AI models and analytics dashboards.',
    biasCheckPassed: true,
    applicantCount: 21,
    status: 'Active',
    createdAt: '2024-08-10',
  },
  {
    id: 'j-103',
    title: 'Cloud Solutions Architect',
    department: 'Infrastructure',
    location: 'Frankfurt, Germany (On-site)',
    type: 'Full-Time',
    salaryRange: '€85,000 – €110,000',
    requiredSkills: ['AWS', 'Azure', 'Terraform', 'Kubernetes'],
    niceToHaveSkills: ['GCP', 'Ansible'],
    experienceRequired: 6,
    description:
      'Design and oversee cloud infrastructure for enterprise clients. Collaborate with cross-functional teams to ensure scalability and security.',
    biasCheckPassed: false,
    applicantCount: 12,
    status: 'Draft',
    createdAt: '2024-08-20',
  },
];

const USE_MOCK = true;

// ── API Methods ────────────────────────────────────────────────────────────────

export const getJobs = async (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_JOBS), 500));
  }
  return axiosInstance.get('/api/v1/jobs', { params });
};

export const getJobById = async (id) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_JOBS.find((j) => j.id === id)), 400)
    );
  }
  return axiosInstance.get(`/api/v1/jobs/${id}`);
};

export const createJob = async (jobData) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            id: `j-${Date.now()}`,
            ...jobData,
            status: 'Draft',
            applicantCount: 0,
            biasCheckPassed: false,
            createdAt: new Date().toISOString().split('T')[0],
          }),
        900
      )
    );
  }
  return axiosInstance.post('/api/v1/jobs', jobData);
};

export const updateJob = async (id, jobData) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ id, ...jobData, updated: true }), 600)
    );
  }
  return axiosInstance.put(`/api/v1/jobs/${id}`, jobData);
};

export const deleteJob = async (id) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ id, deleted: true }), 400));
  }
  return axiosInstance.delete(`/api/v1/jobs/${id}`);
};

export const runBiasCheck = async (description) => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            passed: Math.random() > 0.3,
            flaggedPhrases: ['young and dynamic', 'native speaker'],
            suggestions: [
              'Replace "young and dynamic" with "motivated and results-driven"',
              'Replace "native speaker" with "proficient in English"',
            ],
            biasScore: Math.floor(Math.random() * 30) + 5,
          }),
        1200
      )
    );
  }
  return axiosInstance.post('/api/v1/jobs/bias-check', { description });
};
