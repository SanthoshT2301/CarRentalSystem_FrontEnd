export default function StatusBadge({ status }) {
  const map = { confirmed:{ bg:'#dbeafe', color:'#2563eb' }, completed:{ bg:'#dcfce7', color:'#16a34a' }, cancelled:{ bg:'#fee2e2', color:'#dc2626' } };
  const s = map[status] || { bg:'#f5f5f5', color:'#888' };
  return <span className="rr-badge-pill text-capitalize" style={{ background:s.bg, color:s.color }}>{status}</span>;
}