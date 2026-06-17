import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAgentBookings,   // bookings for THIS agent's cars only
  getAgentCars,       // cars added by THIS agent
  createCar,
  deleteCar,
  returnCar,
  getMaintenanceAlerts,
  addMaintenanceAlert,
  updateAlertStatus,
  gateCheckout,
  gateCheckin,
} from '../api/api';
import { useAuth } from '../context/AuthContext';

// ── shared micro-style tokens ──────────────────────────────────────────────
const S = {
  card: {
    background: '#fff', borderRadius: 14,
    boxShadow: '0 1px 6px rgba(0,0,0,0.07)', border: '1px solid #eee',
  },
  th: {
    padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
    color: '#888', borderBottom: '1px solid #eee', letterSpacing: 0.4,
    whiteSpace: 'nowrap', background: '#f9f9f9',
  },
  td: { padding: '12px 14px', fontSize: 13, color: '#333', borderBottom: '1px solid #f5f5f5' },
  inp: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0',
    borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  },
  lbl: { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 6 },
};

const PRIORITY_CLR = { High: '#dc2626', Medium: '#d97706', Low: '#16a34a' };
const STATUS_CLR   = { confirmed: '#2563eb', completed: '#16a34a', cancelled: '#dc2626' };

const CAR_FORM_DEFAULTS = {
  make: '', model: '', year: 2024, type: 'Sedan',
  location: 'San Francisco', pricePerDay: 60, image: '',
  noSeats: 5, transmission: 'Automatic', color: 'White', mileage: 'Brand New',
};

export default function AgentDashboard() {
  const { userId, userName, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [toast, setToast] = useState('');

  // ── data ─────────────────────────────────────────────────────────────────
  const [bookings,  setBookings]  = useState([]);
  const [myCars,    setMyCars]    = useState([]);
  const [alerts,    setAlerts]    = useState([]);

  // ── modals ────────────────────────────────────────────────────────────────
  const [gateModal,  setGateModal]  = useState(null); // {type, reservationId}
  const [gateForm,   setGateForm]   = useState({});
  const [maintModal, setMaintModal] = useState(false);
  const [maintForm,  setMaintForm]  = useState({ carId: '', description: '', priority: 'Medium' });
  const [carModal,   setCarModal]   = useState(false);
  const [carForm,    setCarForm]    = useState(CAR_FORM_DEFAULTS);
  const [carFormErr, setCarFormErr] = useState('');

  function flash(msg) { setToast(msg); setTimeout(() => setToast(''), 3500); }

  // ── initial loads ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Only load bookings for cars that THIS agent added
    getAgentBookings(userId, 1, 100)
      .then(r => setBookings(r.data || []))
      .catch(() => {});

    getAgentCars(userId, 1, 100)
      .then(r => setMyCars(r.data || []))
      .catch(() => {});

    getMaintenanceAlerts()
      .then(a => setAlerts(a || []))
      .catch(() => {});
  }, [userId]);

  // ── car management ────────────────────────────────────────────────────────
  async function handleCreateCar() {
    setCarFormErr('');
    try {
      const payload = {
        ...carForm,
        features: [carForm.transmission, 'GPS', carForm.color],
      };
      // Pass agentId so the backend tags this car to the agent
      const car = await createCar(payload, userId);
      setMyCars(prev => [car, ...prev]);
      setCarModal(false);
      setCarForm(CAR_FORM_DEFAULTS);
      flash('Car added to your fleet!');
    } catch (e) {
      setCarFormErr(e.message);
    }
  }

  async function handleDeleteCar(id) {
    if (!window.confirm('Remove this car from your fleet?')) return;
    try {
      await deleteCar(id);
      setMyCars(prev => prev.filter(c => c.id !== id));
      flash('Car removed.');
    } catch (e) {
      flash(e.message);
    }
  }

  // ── return car ────────────────────────────────────────────────────────────
  async function doReturn(id) {
    try {
      await returnCar(id, userId, false);
      setBookings(b => b.map(r => r.id === id ? { ...r, status: 'completed' } : r));
      flash('Car returned successfully.');
    } catch (e) {
      flash(e.message);
    }
  }

  // ── gate logistics ────────────────────────────────────────────────────────
  async function doGate() {
    try {
      if (gateModal.type === 'checkout') {
        await gateCheckout(gateModal.reservationId, {
          driverLicense: gateForm.driverLicense,
          mileageOut:    parseInt(gateForm.mileageOut),
          fuelOut:       parseInt(gateForm.fuelOut),
          agentName:     userName,
        });
        flash('Checkout recorded.');
      } else {
        await gateCheckin(gateModal.reservationId, {
          mileageIn: parseInt(gateForm.mileageIn),
          fuelIn:    parseInt(gateForm.fuelIn),
          damages:   gateForm.damages,
          agentName: userName,
        });
        flash('Check-in recorded.');
      }
      setGateModal(null);
      setGateForm({});
    } catch (e) {
      flash(e.message);
    }
  }

  // ── maintenance ───────────────────────────────────────────────────────────
  async function doMaint() {
    try {
      const a = await addMaintenanceAlert({
        carId:       parseInt(maintForm.carId),
        description: maintForm.description,
        priority:    maintForm.priority,
        reportedBy:  userName,
      });
      setAlerts(prev => [a, ...prev]);
      flash('Alert created.');
      setMaintModal(false);
      setMaintForm({ carId: '', description: '', priority: 'Medium' });
    } catch (e) {
      flash(e.message);
    }
  }

  async function changeStatus(id, status) {
    try {
      const a = await updateAlertStatus(id, status);
      setAlerts(prev => prev.map(x => x.maintenanceAlertId === id ? a : x));
    } catch (e) {
      flash(e.message);
    }
  }

  // ── convenience filters ───────────────────────────────────────────────────
  // Gate ops only makes sense for confirmed bookings
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  const MENU = [
    { key: 'bookings',    icon: '📋', label: 'My Bookings' },
    { key: 'gate',        icon: '🚧', label: 'Gate Logistics' },
    { key: 'fleet',       icon: '🚗', label: 'My Fleet' },
    { key: 'maintenance', icon: '🔧', label: 'Maintenance' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 220, background: '#111', display: 'flex', flexDirection: 'column', padding: '0' }}>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#e85d24', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚗</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>ROADREADY</span>
        </div>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #222' }}>
          <div style={{ width: 38, height: 38, background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>
            {(userName || 'A').charAt(0).toUpperCase()}
          </div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{userName}</div>
          <div style={{ color: '#2563eb', fontSize: 11, fontWeight: 600 }}>Agent</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {MENU.map(m => (
            <button key={m.key} onClick={() => setTab(m.key)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === m.key ? '#e85d2430' : 'transparent',
              color: tab === m.key ? '#e85d24' : '#aaa',
              fontWeight: tab === m.key ? 600 : 400, fontSize: 13, textAlign: 'left', marginBottom: 2,
            }}>
              <span style={{ fontSize: 15 }}>{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid #222' }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#e85d24', fontSize: 13,
          }}>🚪 Logout</button>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, background: '#f1f0ea', minHeight: '100vh' }}>

        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{MENU.find(m => m.key === tab)?.label}</div>
            <div style={{ color: '#888', fontSize: 13 }}>Welcome back, {userName}</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
              {myCars.length} cars in your fleet
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* ══════════ MY BOOKINGS (scoped to agent's cars) ══════════ */}
          {tab === 'bookings' && (
            <div>
              <div style={{ marginBottom: 20, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 18px', fontSize: 13, color: '#1e40af', display: 'flex', gap: 10 }}>
                <span>ℹ️</span>
                <span>You can only see customers who booked <strong>your cars</strong>. Cars added by other agents or admins are not shown here.</span>
              </div>

              <div style={{ ...S.card, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Booking ID', 'Car ID', 'Pickup', 'Drop-off', 'Dates', 'Amount', 'Status', 'Actions'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td style={S.td}>#{b.id}</td>
                        <td style={S.td}>Car #{b.carId}</td>
                        <td style={S.td}>{b.pickupLocation}</td>
                        <td style={S.td}>{b.dropoffLocation}</td>
                        <td style={S.td}>{b.pickupDate} → {b.dropoffDate}</td>
                        <td style={{ ...S.td, fontWeight: 600, color: '#e85d24' }}>${b.totalAmount}</td>
                        <td style={S.td}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                            textTransform: 'capitalize',
                            background: `${STATUS_CLR[b.status] || '#888'}20`,
                            color: STATUS_CLR[b.status] || '#888',
                          }}>{b.status}</span>
                        </td>
                        <td style={S.td}>
                          {b.status === 'confirmed' && (
                            <button onClick={() => doReturn(b.id)} style={actionBtn('#dc2626', '#fca5a5')}>Return</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#aaa' }}>
                        No bookings for your cars yet.
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════ GATE LOGISTICS (confirmed bookings of agent's cars) ══════════ */}
          {tab === 'gate' && (
            <div>
              <div style={{ marginBottom: 20, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 18px', fontSize: 13, color: '#1e40af', display: 'flex', gap: 10 }}>
                <span>ℹ️</span>
                <span>Gate logistics is limited to <strong>confirmed</strong> bookings for your cars. Completed or cancelled bookings are handled automatically.</span>
              </div>

              <div style={{ ...S.card, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Booking ID', 'Car ID', 'Pickup Location', 'Status', 'Checkout', 'Check-in'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedBookings.map(b => (
                      <tr key={b.id}>
                        <td style={S.td}>#{b.id}</td>
                        <td style={S.td}>Car #{b.carId}</td>
                        <td style={S.td}>{b.pickupLocation}</td>
                        <td style={S.td}>
                          <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                            Confirmed
                          </span>
                        </td>
                        <td style={S.td}>
                          <button
                            onClick={() => { setGateModal({ type: 'checkout', reservationId: b.id }); setGateForm({}); }}
                            style={actionBtn('#d97706', '#fde68a')}>
                            Checkout →
                          </button>
                        </td>
                        <td style={S.td}>
                          <button
                            onClick={() => { setGateModal({ type: 'checkin', reservationId: b.id }); setGateForm({}); }}
                            style={actionBtn('#16a34a', '#bbf7d0')}>
                            Check-in →
                          </button>
                        </td>
                      </tr>
                    ))}
                    {confirmedBookings.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: '#aaa' }}>
                        No confirmed bookings pending gate operations.
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════ MY FLEET (cars added by this agent) ══════════ */}
          {tab === 'fleet' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 22 }}>My Fleet</div>
                  <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Cars you've added to the system</div>
                </div>
                <button
                  onClick={() => { setCarModal(true); setCarForm(CAR_FORM_DEFAULTS); setCarFormErr(''); }}
                  style={{ background: '#e85d24', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                  + Add Car
                </button>
              </div>

              {/* Car form */}
              {carModal && (
                <div style={{ ...S.card, padding: 28, marginBottom: 24 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Add New Car to Your Fleet</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                    {[
                      ['make',        'Make (Brand)', 'text'],
                      ['model',       'Model',        'text'],
                      ['year',        'Year',         'number'],
                      ['pricePerDay', 'Price/Day ($)', 'number'],
                      ['noSeats',     'Seats',        'number'],
                      ['color',       'Color',        'text'],
                      ['mileage',     'Mileage',      'text'],
                    ].map(([k, l, t]) => (
                      <div key={k}>
                        <label style={S.lbl}>{l}</label>
                        <input
                          value={carForm[k]}
                          onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))}
                          type={t} style={S.inp} placeholder={l}
                        />
                      </div>
                    ))}

                    {/* selects */}
                    <div>
                      <label style={S.lbl}>Type</label>
                      <select value={carForm.type} onChange={e => setCarForm(f => ({ ...f, type: e.target.value }))} style={S.inp}>
                        {['Sedan', 'SUV', 'Luxury', 'Compact', 'Hatchback'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={S.lbl}>Location</label>
                      <select value={carForm.location} onChange={e => setCarForm(f => ({ ...f, location: e.target.value }))} style={S.inp}>
                        {['San Francisco', 'New York', 'Denver', 'Los Angeles'].map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={S.lbl}>Transmission</label>
                      <select value={carForm.transmission} onChange={e => setCarForm(f => ({ ...f, transmission: e.target.value }))} style={S.inp}>
                        {['Automatic', 'Manual'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>

                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={S.lbl}>Image URL</label>
                      <input value={carForm.image} onChange={e => setCarForm(f => ({ ...f, image: e.target.value }))} style={S.inp} placeholder="https://..." />
                    </div>
                  </div>

                  {carFormErr && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 10 }}>{carFormErr}</p>}

                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button onClick={() => { setCarModal(false); setCarFormErr(''); }} style={{ padding: '10px 24px', background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    <button onClick={handleCreateCar} style={{ padding: '10px 24px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Add Car</button>
                  </div>
                </div>
              )}

              {/* Car grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {myCars.map(car => (
                  <div key={car.id} style={{ ...S.card, overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: 150 }}>
                      <img
                        src={car.image}
                        alt={car.make}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600'; }}
                      />
                      <span style={{
                        position: 'absolute', top: 10, left: 10,
                        background: car.available ? '#16a34a' : '#dc2626',
                        color: '#fff', fontSize: 11, fontWeight: 600,
                        padding: '3px 10px', borderRadius: 20,
                      }}>
                        {car.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ fontWeight: 700 }}>{car.make} {car.model}</div>
                        <div style={{ color: '#e85d24', fontWeight: 700 }}>${car.pricePerDay}/day</div>
                      </div>
                      <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>
                        {car.type} · {car.location} · {car.year}
                      </div>

                      {/* Bookings count for this car */}
                      <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: '#16a34a', fontWeight: 500, marginBottom: 10 }}>
                        📋 {bookings.filter(b => b.carId === car.id).length} booking{bookings.filter(b => b.carId === car.id).length !== 1 ? 's' : ''} on this car
                      </div>

                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        style={{ width: '100%', padding: '8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        🗑 Remove from Fleet
                      </button>
                    </div>
                  </div>
                ))}
                {myCars.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#aaa' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🚗</div>
                    <div>You haven't added any cars yet.</div>
                    <button onClick={() => { setCarModal(true); setCarFormErr(''); }} style={{ marginTop: 16, padding: '10px 24px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
                      Add Your First Car
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════ MAINTENANCE ══════════ */}
          {tab === 'maintenance' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 22 }}>Maintenance Alerts</div>
                <button onClick={() => setMaintModal(true)} style={{ background: '#e85d24', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
                  + Report Alert
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {alerts.map(a => (
                  <div key={a.maintenanceAlertId} style={{ ...S.card, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                        <p style={{ fontWeight: 700, margin: 0 }}>{a.carName}</p>
                        <span style={{
                          background: `${PRIORITY_CLR[a.priority] || '#888'}20`,
                          color: PRIORITY_CLR[a.priority] || '#888',
                          fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                        }}>{a.priority}</span>
                      </div>
                      <p style={{ color: '#666', fontSize: 13, margin: '0 0 4px' }}>{a.description}</p>
                      <p style={{ color: '#aaa', fontSize: 12, margin: 0 }}>
                        Reported by {a.reportedBy} · {new Date(a.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#888' }}>Status: {a.status}</span>
                      {a.status !== 'Fixed' && (
                        <select
                          onChange={e => changeStatus(a.maintenanceAlertId, e.target.value)}
                          defaultValue=""
                          style={{ padding: '6px 10px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                          <option value="" disabled>Update</option>
                          {['In Progress', 'Fixed'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>No maintenance alerts.</div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Gate modal ── */}
      {gateModal && (
        <Modal title={`${gateModal.type === 'checkout' ? 'Gate Checkout' : 'Gate Check-in'} — Booking #${gateModal.reservationId}`}
          onClose={() => setGateModal(null)}>
          {gateModal.type === 'checkout' ? (
            <>
              {[['driverLicense', "Driver's license", 'text'], ['mileageOut', 'Mileage out', 'number'], ['fuelOut', 'Fuel level out (%)', 'number']].map(([k, l, t]) => (
                <div key={k} style={{ marginBottom: 12 }}>
                  <label style={S.lbl}>{l}</label>
                  <input value={gateForm[k] || ''} onChange={e => setGateForm(f => ({ ...f, [k]: e.target.value }))} style={S.inp} placeholder={l} type={t} />
                </div>
              ))}
            </>
          ) : (
            <>
              {[['mileageIn', 'Mileage in', 'number'], ['fuelIn', 'Fuel level in (%)', 'number']].map(([k, l, t]) => (
                <div key={k} style={{ marginBottom: 12 }}>
                  <label style={S.lbl}>{l}</label>
                  <input value={gateForm[k] || ''} onChange={e => setGateForm(f => ({ ...f, [k]: e.target.value }))} style={S.inp} placeholder={l} type={t} />
                </div>
              ))}
              <label style={S.lbl}>Damages (or type "none")</label>
              <input value={gateForm.damages || ''} onChange={e => setGateForm(f => ({ ...f, damages: e.target.value }))} style={S.inp} placeholder="Describe any damages..." />
            </>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={() => setGateModal(null)} style={{ flex: 1, padding: '12px', background: 'none', border: '1.5px solid #e0e0e0', borderRadius: 10, cursor: 'pointer' }}>Cancel</button>
            <button onClick={doGate} style={{ flex: 1, padding: '12px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Confirm</button>
          </div>
        </Modal>
      )}

      {/* ── Maintenance modal ── */}
      {maintModal && (
        <Modal title="Report Maintenance Alert" onClose={() => setMaintModal(false)}>
          {[['carId', 'Car ID', 'number'], ['description', 'Description', 'text']].map(([k, l, t]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <label style={S.lbl}>{l}</label>
              <input value={maintForm[k]} onChange={e => setMaintForm(f => ({ ...f, [k]: e.target.value }))} style={S.inp} placeholder={l} type={t} />
            </div>
          ))}
          <label style={S.lbl}>Priority</label>
          <select value={maintForm.priority} onChange={e => setMaintForm(f => ({ ...f, priority: e.target.value }))} style={{ ...S.inp, marginBottom: 12 }}>
            {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={() => setMaintModal(false)} style={{ flex: 1, padding: '12px', background: 'none', border: '1.5px solid #e0e0e0', borderRadius: 10, cursor: 'pointer' }}>Cancel</button>
            <button onClick={doMaint} style={{ flex: 1, padding: '12px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Submit</button>
          </div>
        </Modal>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, background: '#1a1a1a', color: '#fff', padding: '13px 22px', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: 14, fontWeight: 500, zIndex: 9999 }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

// ── Shared modal shell ─────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, margin: 0, fontSize: 17 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#aaa', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Tiny styled button helper ──────────────────────────────────────────────
function actionBtn(color, borderColor) {
  return {
    padding: '7px 14px', border: `1.5px solid ${borderColor}`,
    color, background: '#fff', borderRadius: 8, cursor: 'pointer',
    fontSize: 12, fontWeight: 500,
  };
}