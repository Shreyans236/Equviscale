import React, { useState } from 'react';
import { GraduationCap, ArrowUpRight, Award, Clock, BookOpen, CheckCircle, ExternalLink, Sparkles, X } from 'lucide-react';

export default function CandidateUpskillingDashboard({ candidate, onAnnounce }) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeModalCourse, setActiveModalCourse] = useState(null);

  if (!candidate) return null;

  const gaps = candidate.upskillingGaps || [];

  // Calculate projected match boost from enrolled courses
  const additionalBoost = enrolledCourses.reduce((acc, courseId) => {
    const gapObj = gaps.find((g) => g.id === courseId);
    if (!gapObj) return acc;
    const boostNum = parseInt(gapObj.boostProjection.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + boostNum;
  }, 0);

  const projectedMatch = Math.min(100, candidate.overallMatch + additionalBoost);

  const toggleEnrollment = (courseId, courseTitle) => {
    const isEnrolled = enrolledCourses.includes(courseId);
    if (isEnrolled) {
      setEnrolledCourses(enrolledCourses.filter((id) => id !== courseId));
      if (onAnnounce) onAnnounce(`Removed ${courseTitle} from candidate learning plan.`);
    } else {
      setEnrolledCourses([...enrolledCourses, courseId]);
      if (onAnnounce) onAnnounce(`Enrolled candidate in ${courseTitle}. Projected match score updated.`);
    }
  };

  return (
    <section
      aria-labelledby="upskilling-heading"
      className="equi-card animate-fade-in"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--bg-card-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '1.5rem',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.37)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <GraduationCap size={24} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" />
        <h2 id="upskilling-heading" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          Candidate Upskilling & SAP Learning Pathways
        </h2>
      </div>

      {/* Cards List for Skill Gaps & SAP Courses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {gaps.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            No major skill gaps identified. Candidate fully satisfies job requirements.
          </div>
        ) : (
          gaps.map((item) => {
            const isEnrolled = enrolledCourses.includes(item.id);
            const course = item.sapCourse;

            return (
              <div
                key={item.id}
                style={{
                  background: isEnrolled ? 'rgba(0, 230, 118, 0.05)' : 'var(--bg-secondary)',
                  border: isEnrolled ? '1px solid var(--accent-emerald)' : '1px solid var(--bg-card-border)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  gap: '1rem',
                  transition: 'border-color 0.2s ease, background 0.2s ease'
                }}
              >
                <div>
                  {/* Skill Gap Meta Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        background: item.priority === 'High' ? 'var(--accent-rose-bg)' : 'var(--accent-amber-bg)',
                        color: item.priority === 'High' ? 'var(--accent-rose)' : 'var(--accent-amber)',
                        border: `1px solid ${item.priority === 'High' ? 'var(--accent-rose)' : 'var(--accent-amber)'}`,
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px'
                      }}
                    >
                      {item.priority} Priority Gap
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                      {item.boostProjection}
                    </span>
                  </div>

                  {/* Skill Target */}
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    Target Gap: {item.skill}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Current Rating: <strong>{item.currentScore}%</strong> / Target: <strong>{item.requiredScore}%</strong>
                  </div>

                  {/* SAP Learning Hub Course Details Card */}
                  <div
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--bg-card-border)',
                      borderRadius: 'var(--border-radius-sm)',
                      padding: '0.875rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <BookOpen size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                        {course.code}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                      {course.title}
                    </h4>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} aria-hidden="true" /> {course.duration}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Award size={14} style={{ color: 'var(--accent-amber)' }} aria-hidden="true" /> {course.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => toggleEnrollment(item.id, course.title)}
                    aria-pressed={isEnrolled}
                    aria-label={`${isEnrolled ? 'Unenroll candidate from' : 'Enroll candidate in'} ${course.title}`}
                    style={{
                      flex: 1,
                      background: isEnrolled ? 'var(--accent-emerald)' : 'var(--accent-cyan-bg)',
                      color: isEnrolled ? 'var(--text-inverse)' : 'var(--accent-cyan)',
                      border: isEnrolled ? 'none' : '1px solid var(--accent-cyan)',
                      padding: '0.5rem',
                      borderRadius: 'var(--border-radius-sm)',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {isEnrolled ? <CheckCircle size={16} aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}
                    <span>{isEnrolled ? 'Plan Assigned' : 'Add to Plan'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModalCourse(course)}
                    aria-label={`View syllabus details for course ${course.code}`}
                    style={{
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--bg-card-border)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--border-radius-sm)',
                      fontWeight: '500',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <span>Syllabus</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Accessible Course Syllabus Modal Dialog */}
      {activeModalCourse && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-course-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setActiveModalCourse(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--border-radius-lg)',
              maxWidth: '500px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveModalCourse(null)}
              aria-label="Close syllabus dialog"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={20} aria-hidden="true" />
            </button>

            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {activeModalCourse.code} • {activeModalCourse.provider}
            </span>

            <h3 id="modal-course-title" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              {activeModalCourse.title}
            </h3>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              <span>Duration: <strong>{activeModalCourse.duration}</strong></span>
              <span>Level: <strong>{activeModalCourse.level}</strong></span>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--accent-emerald)' }}>Key Learning Modules:</h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>Architecture foundations & hands-on lab sandbox setup</li>
                <li>Enterprise integration patterns & API security controls</li>
                <li>Best practices for automated cloud deployments</li>
                <li>Official SAP Certification practice examination</li>
              </ul>
            </div>

            <a
              href={activeModalCourse.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                background: 'var(--accent-cyan)',
                color: 'var(--text-inverse)',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--border-radius-sm)',
                fontWeight: '700',
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              <span>Access on SAP Learning Hub</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
