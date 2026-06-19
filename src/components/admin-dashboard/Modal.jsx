export default function Modal({ title, onClose, children }) {
  return (
    <div className="rr-modal-overlay d-flex align-items-center justify-content-center">
      <div className="rr-modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold m-0 fs-5">{title}</h3>
          <button onClick={onClose} className="btn-close-custom border-0 bg-transparent" style={{ fontSize:22, color:'#aaa', lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}