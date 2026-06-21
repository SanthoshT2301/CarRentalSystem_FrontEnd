export default function FleetManagementTab({
  myCars, bookings, setCarModal, setCarForm, CAR_FORM_DEFAULTS, setCarFormErr,
  openEditModal, handlePutInMaintenance, handleDeleteCar,
}) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="fw-bold" style={{ fontSize: 22 }}>My Fleet</div>
          <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Cars you've added to the system</div>
        </div>
        <button
          onClick={() => { setCarModal(true); setCarForm(CAR_FORM_DEFAULTS); setCarFormErr(''); }}
          className="btn rr-orange-btn">
          + Add Car
        </button>
      </div>

      <div className="d-grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', display: 'grid' }}>
        {myCars.map(car => {
          const carBookingsCount = bookings.filter(b => b.carId === car.id).length;
          return (
            <div key={car.id} className="rr-card rr-fleet-card">
              <div className="rr-fleet-img-wrap">
                <img
                  src={car.image}
                  alt={car.make}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600'; }}
                />
                <span
                  className="rr-fleet-availability-badge"
                  style={{ background: car.available ? '#16a34a' : '#dc2626' }}>
                  {car.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="p-3">
                <div className="d-flex justify-content-between mb-1">
                  <div className="fw-bold">{car.make} {car.model}</div>
                  <div className="fw-bold" style={{ color: '#e85d24' }}>₹{car.pricePerDay}/day</div>
                </div>
                <div className="mb-3" style={{ color: '#888', fontSize: 12 }}>
                  {car.type} · {car.location} · {car.year}
                </div>

                <div className="rr-booking-count-pill mb-2">
                  📋 {carBookingsCount} booking{carBookingsCount !== 1 ? 's' : ''} on this car
                </div>

                <div className="d-flex gap-2 mb-2">
                  <button onClick={() => openEditModal(car)} className="btn btn-sm btn-outline-primary w-50">
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => handlePutInMaintenance(car)}
                    disabled={!car.available}
                    className="btn btn-sm btn-outline-warning w-50">
                    🛠 {car.available ? 'Maintenance' : 'In Maintenance'}
                  </button>
                </div>

                <button onClick={() => handleDeleteCar(car.id)} className="btn btn-sm btn-outline-danger w-100">
                  🗑 Remove from Fleet
                </button>
              </div>
            </div>
          );
        })}
        {myCars.length === 0 && (
          <div className="text-center text-secondary" style={{ gridColumn: '1/-1', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚗</div>
            <div>You haven't added any cars yet.</div>
            <button onClick={() => { setCarModal(true); setCarFormErr(''); }} className="btn rr-orange-btn mt-3">
              Add Your First Car
            </button>
          </div>
        )}
      </div>
    </div>
  );
}