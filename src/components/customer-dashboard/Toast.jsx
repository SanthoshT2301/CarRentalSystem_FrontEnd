export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, background: '#1a1a1a', color: '#fff', padding: '14px 24px', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: 14, fontWeight: 500, zIndex: 9999 }}>{toast}</div>
  );
}