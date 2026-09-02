const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizeMap = { sm: 24, md: 40, lg: 64 };
  const px = sizeMap[size] || 40;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '3rem',
        color: 'var(--color-text-secondary)',
        fontSize: '0.875rem',
      }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 50 50"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="rgba(0,112,243,0.15)"
          strokeWidth="4"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeDasharray="80 40"
          strokeLinecap="round"
        />
      </svg>
      {text && <span>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
