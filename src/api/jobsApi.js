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

const STORAGE_KEY = 'equiscale_jobs';

const getStoredJobs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read jobs from localStorage', e);
  }
  // Initialize with MOCK_JOBS
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_JOBS));
  } catch (e) {}
  return [...MOCK_JOBS];
};

const saveStoredJobs = (jobs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save jobs to localStorage', e);
  }
};

const USE_MOCK = true;

// ── API Methods ────────────────────────────────────────────────────────────────

export const getJobs = async (params = {}) => {
  if (USE_MOCK) {
    const jobs = getStoredJobs();
    return new Promise((resolve) => setTimeout(() => resolve(jobs), 300));
  }
  return axiosInstance.get('/api/v1/jobs', { params });
};

export const getJobById = async (id) => {
  if (USE_MOCK) {
    const jobs = getStoredJobs();
    return new Promise((resolve) =>
      setTimeout(() => resolve(jobs.find((j) => j.id === id) || null), 200)
    );
  }
  return axiosInstance.get(`/api/v1/jobs/${id}`);
};

export const createJob = async (jobData) => {
  if (USE_MOCK) {
    const jobs = getStoredJobs();
    const newJob = {
      id: `j-${Date.now()}`,
      title: jobData.title,
      department: jobData.department || 'General',
      location: jobData.location || 'Remote',
      type: jobData.type || 'Full-Time',
      salaryRange: jobData.salaryRange || 'Competitive',
      requiredSkills: jobData.requiredSkills || [],
      niceToHaveSkills: jobData.niceToHaveSkills || [],
      experienceRequired: Number(jobData.experienceRequired) || 0,
      description: jobData.description || '',
      biasCheckPassed: jobData.biasCheckPassed !== undefined ? jobData.biasCheckPassed : true,
      applicantCount: 0,
      status: jobData.status || 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      ...jobData,
    };
    const updated = [newJob, ...jobs];
    saveStoredJobs(updated);
    return new Promise((resolve) => setTimeout(() => resolve(newJob), 400));
  }
  return axiosInstance.post('/api/v1/jobs', jobData);
};

export const updateJob = async (id, jobData) => {
  if (USE_MOCK) {
    const jobs = getStoredJobs();
    let updatedJob = null;
    const updated = jobs.map((j) => {
      if (j.id === id) {
        updatedJob = { ...j, ...jobData, updated: true };
        return updatedJob;
      }
      return j;
    });
    if (updatedJob) saveStoredJobs(updated);
    return new Promise((resolve) => setTimeout(() => resolve(updatedJob || { id, ...jobData }), 300));
  }
  return axiosInstance.put(`/api/v1/jobs/${id}`, jobData);
};

export const deleteJob = async (id) => {
  if (USE_MOCK) {
    const jobs = getStoredJobs();
    const updated = jobs.filter((j) => j.id !== id);
    saveStoredJobs(updated);
    return new Promise((resolve) => setTimeout(() => resolve({ id, deleted: true }), 300));
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
