export default function Toast({ toast }) {
  if (!toast.msg) return null;
  return (
    <div className={`rr-toast d-flex align-items-center gap-2 ${toast.type === 'error' ? 'error' : ''}`}>
      {toast.type === 'error' ? '⚠' : '✓'} {toast.msg}
    </div>
  );
}