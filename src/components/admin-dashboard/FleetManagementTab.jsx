export default function FleetManagementTab({
  cars, showCarForm, setShowCarForm, carForm, setCarForm, carFormErr, setCarFormErr,
  handleCreateCar, handleDeleteCar,
}) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="fw-bold" style={{ fontSize:22 }}>Fleet Management</div>
        <button onClick={() => setShowCarForm(true)} className="rr-bg-orange fw-semibold" style={{ padding:'10px 22px', borderRadius:10, fontSize:14 }}>+ Add Car</button>
      </div>

      {showCarForm && (
        <div className="rr-card mb-4" style={{ padding:28 }}>
          <div className="fw-bold mb-4" style={{ fontSize:16 }}>Add New Car</div>
          <div className="row row-cols-3 g-3">
            {[['make','Make (Brand)'],['model','Model'],['year','Year'],['type','Type'],['location','Location'],['pricePerDay','Price/Day (₹)'],['noSeats','Seats'],['transmission','Transmission'],['color','Color'],['mileage','Mileage']].map(([k, l]) => (
              <div key={k} className="col">
                <label className="rr-label">{l}</label>
                {k === 'type' ? (
                  <select value={carForm[k]} onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))} className="rr-input">
                    {['Sedan','SUV','Luxury','Compact','Hatchback'].map(t => <option key={t}>{t}</option>)}
                  </select>
                ) : k === 'location' ? (
                  <select value={carForm[k]} onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))} className="rr-input">
                    {['Chennai','Madurai','Coimbatore','Trichy'].map(t => <option key={t}>{t}</option>)}
                  </select>
                ) : k === 'transmission' ? (
                  <select value={carForm[k]} onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))} className="rr-input">
                    {['Automatic','Manual'].map(t => <option key={t}>{t}</option>)}
                  </select>
                ) : (
                  <input value={carForm[k]} onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))} type={['year','pricePerDay','noSeats'].includes(k) ? 'number' : 'text'} className="rr-input" placeholder={l} />
                )}
              </div>
            ))}
            <div className="col-12">
              <label className="rr-label">Image URL</label>
              <input value={carForm.image} onChange={e => setCarForm(f => ({ ...f, image: e.target.value }))} className="rr-input" placeholder="https://..." />
            </div>
          </div>
          {carFormErr && <p className="text-danger mt-2" style={{ fontSize:13 }}>{carFormErr}</p>}
          <div className="d-flex gap-2 mt-4">
            <button onClick={() => { setShowCarForm(false); setCarFormErr(''); }} className="border-0 fw-medium" style={{ padding:'10px 24px', background:'#f5f5f5', borderRadius:10 }}>Cancel</button>
            <button onClick={handleCreateCar} className="rr-bg-orange fw-bold" style={{ padding:'10px 24px', borderRadius:10 }}>Add Car</button>
          </div>
        </div>
      )}

      <div className="row row-cols-3 g-3">
        {cars.map(car => (
          <div key={car.id} className="col">
            <div className="rr-card overflow-hidden">
              <div className="rr-fleet-img-wrap">
                <img src={car.image} alt={car.make} className="w-100 h-100" style={{ objectFit:'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600'; }} />
                <span className="rr-badge-pill position-absolute" style={{ top:10, left:10, background: car.available ? '#16a34a' : '#dc2626', color:'#fff' }}>{car.available ? 'Available' : 'Unavailable'}</span>
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div className="d-flex justify-content-between mb-1">
                  <div className="fw-bold">{car.make} {car.model}</div>
                  <div className="rr-orange fw-bold">₹{car.pricePerDay}/day</div>
                </div>
                <div className="text-secondary mb-3" style={{ fontSize:12 }}>{car.type} · {car.location} · {car.year}</div>
                <button onClick={() => handleDeleteCar(car.id)} className="w-100 border-0 fw-semibold" style={{ padding:8, background:'#fee2e2', color:'#dc2626', borderRadius:8, fontSize:13 }}>🗑 Delete Car</button>
              </div>
            </div>
          </div>
        ))}
        {cars.length === 0 && <div className="col-12 text-center text-secondary py-5">No cars in fleet.</div>}
      </div>
    </div>
  );
}