const STATUS_CONFIG = {
  Applied: { label: 'Applied', color: 'info', dot: '#3b82f6' },
  Screening: { label: 'Screening', color: 'warning', dot: '#f59e0b' },
  Interview: { label: 'Interview', color: 'purple', dot: '#a855f7' },
  Offer: { label: 'Offer Extended', color: 'success', dot: '#22c55e' },
  Rejected: { label: 'Rejected', color: 'error', dot: '#ef4444' },
  Active: { label: 'Active', color: 'success', dot: '#22c55e' },
  Draft: { label: 'Draft', color: 'warning', dot: '#f59e0b' },
  Closed: { label: 'Closed', color: 'error', dot: '#ef4444' },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: 'info', dot: '#3b82f6' };
  return (
    <span className={`es-badge es-badge--${config.color}`}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: config.dot,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;
