const STATUS_CLR = { confirmed: '#2563eb', completed: '#16a34a', cancelled: '#dc2626' };

export default function StatusBadge({ status }) {
  return (
    <span
      className="rr-status-badge"
      style={{
        background: `${STATUS_CLR[status] || '#888'}20`,
        color: STATUS_CLR[status] || '#888',
      }}
    >
      {status}
    </span>
  );
}