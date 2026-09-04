import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { Target, CheckCircle2, Cpu, Table, BarChart2, Info } from 'lucide-react';

export default function SkillRadarChart({ candidate }) {
  const [showTableView, setShowTableView] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  if (!candidate) return null;

  const data = candidate.radarData;

  // Custom Accessible Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-card-border)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--border-radius-sm)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            fontSize: '0.85rem'
          }}
        >
          <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', color: entry.color }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
              <span>{entry.name}: <strong>{entry.value}%</strong></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section
      aria-labelledby="radar-chart-heading"
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
        <BarChart2 size={22} style={{ color: 'var(--accent-purple)' }} aria-hidden="true" />
        <h2 id="radar-chart-heading" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          Interactive Skill Radar Analysis
        </h2>
      </div>

      {/* Quick Indicator Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)', marginBottom: '1.25rem', border: '1px solid var(--bg-card-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Target size={16} style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
          <span>Required Job Benchmark (Gold)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
          <span>Verified Actual Skills (Cyan)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Cpu size={16} style={{ color: 'var(--accent-purple)' }} aria-hidden="true" />
          <span>AI-Inferred Capabilities (Purple)</span>
        </div>
      </div>

      {/* Main View: Radar Chart OR Accessible Semantic Data Table */}
      {!showTableView ? (
        <div style={{ width: '100%', height: 380, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="var(--bg-card-border)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-muted)" fontSize={10} />
              
              {/* Benchmark Target Layer */}
              <Radar
                name="Job Requirement"
                dataKey="required"
                stroke="var(--accent-amber)"
                fill="var(--accent-amber)"
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray="4 4"
              />

              {/* Verified Actual Layer */}
              <Radar
                name="Verified Actual"
                dataKey="verified"
                stroke="var(--accent-cyan)"
                fill="var(--accent-cyan)"
                fillOpacity={0.35}
                strokeWidth={3}
              />

              {/* AI Inferred Capability Layer */}
              <Radar
                name="AI Inferred Capability"
                dataKey="inferred"
                stroke="var(--accent-purple)"
                fill="var(--accent-purple)"
                fillOpacity={0.25}
                strokeWidth={2}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: 'var(--text-primary)', fontSize: '0.85rem', paddingTop: '10px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Accessible Table Fallback (WCAG 1.1.1 / 1.4.3) */
        <div id="radar-accessible-table" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <caption className="sr-only">
              Tabular representation of candidate skill ratings comparing required job benchmark, verified skills, and inferred capabilities.
            </caption>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--bg-card-border)' }}>
                <th scope="col" style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Skill Metric</th>
                <th scope="col" style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--accent-amber)' }}>Required Benchmark</th>
                <th scope="col" style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '0.95rem' }}>Verified Score (Bold)</th>
                <th scope="col" style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--accent-purple)' }}>AI-Inferred Score</th>
                <th scope="col" style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Gap Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const gap = item.verified - item.required;
                return (
                  <tr key={item.skill} style={{ borderBottom: '1px solid var(--bg-card-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{item.skill}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '700', color: 'var(--accent-amber)' }}>{item.required}%</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '900', color: 'var(--accent-cyan)', fontSize: '1rem' }}>{item.verified}%</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '700', color: 'var(--accent-purple)' }}>{item.inferred}%</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      {gap >= 0 ? (
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: '600', fontSize: '0.8rem' }}>Exceeds (+{gap}%)</span>
                      ) : (
                        <span style={{ color: 'var(--accent-rose)', fontWeight: '600', fontSize: '0.8rem' }}>Gap ({gap}%)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
