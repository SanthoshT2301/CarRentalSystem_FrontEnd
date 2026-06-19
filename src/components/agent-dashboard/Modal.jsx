export default function Modal({ title, onClose, children }) {
  return (
    <div className="rr-modal-overlay d-flex align-items-center justify-content-center">
      <div className="rr-modal">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold m-0" style={{ fontSize: 17 }}>{title}</h3>
          <button onClick={onClose} className="border-0 bg-transparent" style={{ fontSize: 22, color: '#aaa', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}