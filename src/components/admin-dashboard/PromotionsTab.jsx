export default function PromotionsTab({
  promos, showPromoForm, setShowPromoForm, promoForm, setPromoForm,
  handleAddPromo, handleTogglePromo, handleDeletePromo,
}) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="fw-bold" style={{ fontSize: 22 }}>Promotions</div>
        <button onClick={() => setShowPromoForm(true)} className="border-0 fw-semibold text-white" style={{ background: '#7c3aed', padding: '10px 22px', borderRadius: 10, fontSize: 14 }}>
          + Create Promo
        </button>
      </div>

      {showPromoForm && (
        <div className="rr-card mb-4" style={{ padding: 28 }}>
          <div className="fw-bold mb-4" style={{ fontSize: 16 }}>New Promotion</div>
          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <label className="rr-label">Promo Code</label>
              <input value={promoForm.code} onChange={e => setPromoForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="rr-input" placeholder="e.g. SUMMER25" />
            </div>
            <div className="col-12 col-sm-6">
              <label className="rr-label">Discount (%)</label>
              <input type="number" min={1} max={100} value={promoForm.discountPercent} onChange={e => setPromoForm(f => ({ ...f, discountPercent: +e.target.value }))} className="rr-input" />
            </div>
            <div className="col-12">
              <label className="rr-label">Description</label>
              <input value={promoForm.description} onChange={e => setPromoForm(f => ({ ...f, description: e.target.value }))} className="rr-input" placeholder="Short description..." />
            </div>
            <div className="col-12">
              <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#444' }}>
                <input type="checkbox" checked={promoForm.active} onChange={e => setPromoForm(f => ({ ...f, active: e.target.checked }))} style={{ width: 15, height: 15, accentColor: '#7c3aed' }} />
                Active immediately
              </label>
            </div>
          </div>
          <div className="d-flex gap-2 mt-4 flex-wrap">
            <button onClick={() => setShowPromoForm(false)} className="border-0 fw-medium" style={{ padding: '10px 24px', background: '#f5f5f5', borderRadius: 10 }}>Cancel</button>
            <button onClick={handleAddPromo} className="border-0 fw-bold text-white" style={{ padding: '10px 24px', background: '#7c3aed', borderRadius: 10 }}>Create</button>
          </div>
        </div>
      )}

      <div className="d-flex flex-column gap-2">
        {promos.map(p => (
          <div key={p.promotionId} className="rr-card rr-promo-card d-flex align-items-center gap-3" style={{ padding: '20px 24px', flexWrap: 'wrap' }}>
            <div className="rr-promo-icon d-flex align-items-center justify-content-center flex-shrink-0" style={{ background: p.active ? '#f3e8ff' : '#f5f5f5' }}>🎟</div>
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span className="fw-bold" style={{ fontSize: 15, letterSpacing: 1 }}>{p.code}</span>
                <span className="rr-badge-pill" style={{ background: '#f3e8ff', color: '#7c3aed' }}>{p.discountPercent}% OFF</span>
                <span className="rr-badge-pill" style={{ background: p.active ? '#dcfce7' : '#f5f5f5', color: p.active ? '#16a34a' : '#888' }}>{p.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="text-secondary" style={{ fontSize: 13 }}>{p.description}</div>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleTogglePromo(p.promotionId)}
                className="fw-medium"
                style={{ padding: '7px 16px', border: `1.5px solid ${p.active ? '#fca5a5' : '#bbf7d0'}`, color: p.active ? '#dc2626' : '#16a34a', background: '#fff', borderRadius: 8, fontSize: 13 }}
              >
                {p.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDeletePromo(p.promotionId)} style={{ padding: '7px 12px', border: '1.5px solid #fca5a5', color: '#dc2626', background: '#fff', borderRadius: 8, fontSize: 13 }}>🗑</button>
            </div>
          </div>
        ))}
        {promos.length === 0 && <div className="text-center text-secondary py-5">No promotions yet.</div>}
      </div>
    </div>
  );
}