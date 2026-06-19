export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="rr-toast">✓ {toast}</div>
  );
}