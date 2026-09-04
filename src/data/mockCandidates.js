export const MOCK_CANDIDATES = [
  {
    id: "EQ-8942",
    pii: {
      name: "Dr. Elena Rostova",
      age: 34,
      gender: "Female",
      college: "Stanford University",
      email: "elena.rostova@stanford.edu",
      location: "San Francisco, CA"
    },
    redacted: {
      name: "[ Name Redacted ]",
      age: "[ Age Redacted ]",
      gender: "[ Gender Redacted ]",
      college: "[ College Redacted ]",
      email: "[ Email Redacted ]",
      location: "[ Location Redacted ]"
    },
    role: "Senior SAP Cloud Architect",
    experienceYears: 9,
    overallMatch: 92,
    techScore: 95,
    biasRiskScore: "0.4%", // Ultra low bias signal
    coreSkills: ["SAP S/4HANA", "SAP BTP", "Cloud Architecture", "REST APIs", "Node.js"],
    radarData: [
      { skill: "SAP BTP Architecture", required: 90, verified: 95, inferred: 92 },
      { skill: "S/4HANA Extension", required: 85, verified: 90, inferred: 88 },
      { skill: "ABAP / CAP Node", required: 80, verified: 85, inferred: 90 },
      { skill: "UI5 / Fiori UX", required: 75, verified: 82, inferred: 78 },
      { skill: "Security & Governance", required: 85, verified: 88, inferred: 85 },
      { skill: "DevOps & CI/CD", required: 80, verified: 70, inferred: 75 }
    ],
    upskillingGaps: [
      {
        id: "gap-101",
        skill: "DevOps & CI/CD Pipelines for BTP",
        currentScore: 70,
        requiredScore: 80,
        priority: "High",
        boostProjection: "+6% Match Score",
        sapCourse: {
          code: "CLD200_EN",
          title: "SAP BTP DevOps & Automated Continuous Delivery",
          provider: "SAP Learning Hub",
          duration: "14 hours",
          badge: "SAP Certified Citizen Developer",
          level: "Intermediate",
          link: "https://learning.sap.com/courses/btp-devops"
        }
      },
      {
        id: "gap-102",
        skill: "SAP Fiori Elements & Flexibility",
        currentScore: 78,
        requiredScore: 88,
        priority: "Medium",
        boostProjection: "+4% Match Score",
        sapCourse: {
          code: "UX403_EN",
          title: "Building User Interfaces with SAP Fiori Elements",
          provider: "SAP Learning Hub",
          duration: "10 hours",
          badge: "SAP Certified UX Associate",
          level: "Advanced",
          link: "https://learning.sap.com/courses/fiori-elements"
        }
      }
    ]
  },
  {
    id: "EQ-7319",
    pii: {
      name: "Marcus Vance",
      age: 29,
      gender: "Male",
      college: "MIT",
      email: "m.vance@mit.edu",
      location: "Boston, MA"
    },
    redacted: {
      name: "[ Name Redacted ]",
      age: "[ Age Redacted ]",
      gender: "[ Gender Redacted ]",
      college: "[ College Redacted ]",
      email: "[ Email Redacted ]",
      location: "[ Location Redacted ]"
    },
    role: "Lead Full-Stack SAP Engineer",
    experienceYears: 6,
    overallMatch: 78,
    techScore: 84,
    biasRiskScore: "0.2%",
    coreSkills: ["React", "TypeScript", "SAP CAP Framework", "OData v4", "PostgreSQL"],
    radarData: [
      { skill: "SAP BTP Architecture", required: 90, verified: 72, inferred: 78 },
      { skill: "S/4HANA Extension", required: 85, verified: 68, inferred: 75 },
      { skill: "ABAP / CAP Node", required: 80, verified: 92, inferred: 95 },
      { skill: "UI5 / Fiori UX", required: 75, verified: 88, inferred: 90 },
      { skill: "Security & Governance", required: 85, verified: 75, inferred: 80 },
      { skill: "DevOps & CI/CD", required: 80, verified: 85, inferred: 88 }
    ],
    upskillingGaps: [
      {
        id: "gap-201",
        skill: "S/4HANA Cloud Extension Suite",
        currentScore: 68,
        requiredScore: 85,
        priority: "High",
        boostProjection: "+11% Match Score",
        sapCourse: {
          code: "DEV204_EN",
          title: "SAP S/4HANA Cloud Extensions with SAP BTP",
          provider: "SAP Learning Hub",
          duration: "18 hours",
          badge: "SAP Certified Extension Architect",
          level: "Advanced",
          link: "https://learning.sap.com/courses/s4-extensions"
        }
      },
      {
        id: "gap-202",
        skill: "SAP BTP Enterprise Security",
        currentScore: 75,
        requiredScore: 85,
        priority: "High",
        boostProjection: "+7% Match Score",
        sapCourse: {
          code: "SEC101_EN",
          title: "Identity & Access Management in SAP BTP",
          provider: "SAP Learning Hub",
          duration: "8 hours",
          badge: "SAP Security Specialist",
          level: "Intermediate",
          link: "https://learning.sap.com/courses/btp-security"
        }
      }
    ]
  },
  {
    id: "EQ-9154",
    pii: {
      name: "Aisha Patel",
      age: 41,
      gender: "Female",
      college: "Indian Institute of Technology (IIT) Bombay",
      email: "aisha.patel@iitb.ac.in",
      location: "Chicago, IL"
    },
    redacted: {
      name: "[ Name Redacted ]",
      age: "[ Age Redacted ]",
      gender: "[ Gender Redacted ]",
      college: "[ College Redacted ]",
      email: "[ Email Redacted ]",
      location: "[ Location Redacted ]"
    },
    role: "SAP AI & Integration Specialist",
    experienceYears: 12,
    overallMatch: 88,
    techScore: 91,
    biasRiskScore: "0.1%",
    coreSkills: ["SAP Integration Suite", "AI Core", "Python", "Enterprise Integration", "Event Mesh"],
    radarData: [
      { skill: "SAP BTP Architecture", required: 90, verified: 88, inferred: 91 },
      { skill: "S/4HANA Extension", required: 85, verified: 82, inferred: 86 },
      { skill: "ABAP / CAP Node", required: 80, verified: 78, inferred: 84 },
      { skill: "UI5 / Fiori UX", required: 75, verified: 70, inferred: 74 },
      { skill: "Security & Governance", required: 85, verified: 95, inferred: 96 },
      { skill: "DevOps & CI/CD", required: 80, verified: 80, inferred: 82 }
    ],
    upskillingGaps: [
      {
        id: "gap-301",
        skill: "SAP Fiori Advanced Custom Controllers",
        currentScore: 70,
        requiredScore: 75,
        priority: "Low",
        boostProjection: "+4% Match Score",
        sapCourse: {
          code: "UX200_EN",
          title: "SAPUI5 Development Experience with SAP Business Application Studio",
          provider: "SAP Learning Hub",
          duration: "12 hours",
          badge: "SAP UI Developer Specialist",
          level: "Intermediate",
          link: "https://learning.sap.com/courses/sapui5-bas"
        }
      }
    ]
  }
];
