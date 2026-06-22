export default function CarFormModal({ carForm, setCarForm, carFormErr, setCarModal, setCarFormErr, handleCreateCar }) {
  return (
    <div className="rr-card p-4 mb-4">
      <div className="fw-bold mb-4" style={{ fontSize: 16 }}>Add New Car to Your Fleet</div>
      <div className="row g-3">
        {[
          ['make',         'Make (Brand)',  'text'],
          ['model',        'Model',         'text'],
          ['year',         'Year',          'number'],
          ['pricePerDay',  'Price/Day (₹)', 'number'],
          ['pricePerHour', 'Price/Hour (₹)','number'],
          ['noSeats',      'Seats',         'number'],
          ['color',        'Color',         'text'],
          ['mileage',      'Mileage',       'text'],
        ].map(([k, l, t]) => (
          <div className="col-6 col-sm-4" key={k}>
            <label className="form-label fw-medium" style={{ fontSize: 13 }}>{l}</label>
            <input
              value={carForm[k]}
              onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))}
              type={t}
              className="form-control"
              placeholder={l}
            />
          </div>
        ))}

        <div className="col-6 col-sm-4">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Type</label>
          <select value={carForm.type} onChange={e => setCarForm(f => ({ ...f, type: e.target.value }))} className="form-select">
            {['Sedan', 'SUV', 'Luxury', 'Compact', 'Hatchback'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-6 col-sm-4">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Location</label>
          <select value={carForm.location} onChange={e => setCarForm(f => ({ ...f, location: e.target.value }))} className="form-select">
            {['Chennai', 'Madurai', 'Coimbatore', 'Trichy'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="col-6 col-sm-4">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Transmission</label>
          <select value={carForm.transmission} onChange={e => setCarForm(f => ({ ...f, transmission: e.target.value }))} className="form-select">
            {['Automatic', 'Manual'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Image URL</label>
          <input value={carForm.image} onChange={e => setCarForm(f => ({ ...f, image: e.target.value }))} className="form-control" placeholder="https://..." />
        </div>
      </div>

      {carFormErr && <p style={{ color: '#dc2626', fontSize: 13 }} className="mt-2">{carFormErr}</p>}

      <div className="d-flex gap-3 mt-4 flex-wrap">
        <button onClick={() => { setCarModal(false); setCarFormErr(''); }} className="btn btn-light fw-medium">Cancel</button>
        <button onClick={handleCreateCar} className="btn rr-orange-btn">Add Car</button>
      </div>
    </div>
  );
}