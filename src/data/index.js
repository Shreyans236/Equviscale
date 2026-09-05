import coursesData from './courses.json';
import mockData from './mock_data.json';

export { coursesData, mockData };

/**
 * Find recommended SAP Learning Hub courses for a given missing skill.
 * Supports exact match and alias/keyword lookup.
 * @param {string} skillName
 * @returns {Array} Array of course objects
 */
export function getCoursesForSkill(skillName) {
  if (!skillName) return [];
  const normalized = skillName.trim().toLowerCase();

  for (const [key, val] of Object.entries(coursesData.skills)) {
    if (
      key.toLowerCase() === normalized ||
      val.aliases?.some((alias) => alias.toLowerCase() === normalized) ||
      normalized.includes(key.toLowerCase())
    ) {
      return val.courses;
    }
  }
  return [];
}

/**
 * Get all available mock jobs.
 */
export function getMockJobs() {
  return mockData.jobs;
}

/**
 * Get all anonymized mock candidate profiles.
 */
export function getMockCandidates() {
  return mockData.candidates;
}

export default {
  coursesData,
  mockData,
  getCoursesForSkill,
  getMockJobs,
  getMockCandidates,
};
