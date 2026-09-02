import './ScoreGauge.css';

const getScoreColor = (score) => {
  if (score >= 90) return '#22c55e';
  if (score >= 75) return '#0070f3';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const getScoreLabel = (score) => {
  if (score >= 90) return 'Exceptional';
  if (score >= 75) return 'Strong';
  if (score >= 60) return 'Moderate';
  return 'Low';
};

const ScoreGauge = ({ score, size = 'md', showLabel = true }) => {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  const sizes = {
    sm: { outer: 64, r: 26, cx: 32, stroke: 4, fontSize: '0.875rem' },
    md: { outer: 96, r: 36, cx: 48, stroke: 5, fontSize: '1.25rem' },
    lg: { outer: 140, r: 56, cx: 70, stroke: 7, fontSize: '1.75rem' },
  };
  const s = sizes[size] || sizes.md;
  const circ = 2 * Math.PI * s.r;
  const off = circ - (score / 100) * circ;

  return (
    <div className={`es-score-gauge es-score-gauge--${size}`}>
      <svg width={s.outer} height={s.outer} viewBox={`0 0 ${s.outer * 2} ${s.outer * 2}`}>
        <circle
          cx={s.outer}
          cy={s.outer}
          r={s.r * 2}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={s.stroke * 2}
        />
        <circle
          cx={s.outer}
          cy={s.outer}
          r={s.r * 2}
          fill="none"
          stroke={color}
          strokeWidth={s.stroke * 2}
          strokeDasharray={circ * 2}
          strokeDashoffset={off * 2}
          strokeLinecap="round"
          transform={`rotate(-90 ${s.outer} ${s.outer})`}
          style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dashoffset 1s ease' }}
        />
        <text
          x={s.outer}
          y={s.outer + 6}
          textAnchor="middle"
          fill={color}
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize={s.fontSize}
        >
          {score}
        </text>
      </svg>
      {showLabel && (
        <span className="es-score-gauge__label" style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default ScoreGauge;
