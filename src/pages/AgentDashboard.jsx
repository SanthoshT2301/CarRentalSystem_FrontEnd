import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings, returnCar, getMaintenanceAlerts, addMaintenanceAlert, updateAlertStatus, gateCheckout, gateCheckin } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function AgentDashboard() {
  const { userId, userName, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [msg, setMsg] = useState('');
  const [gateModal, setGateModal] = useState(null); // { type, reservationId }
  const [gateForm, setGateForm] = useState({});
  const [maintModal, setMaintModal] = useState(false);
  const [maintForm, setMaintForm] = useState({ carId: '', description: '', priority: 'Medium', reportedBy: userName });

  useEffect(() => {
    getAllBookings(1, 50).then(r => setBookings(r.data || []));
    getMaintenanceAlerts().then(a => setAlerts(a || [])).catch(() => {});
  }, []);

  async function doReturn(id) {
    try {
      await returnCar(id, userId, false);
      setBookings(b => b.map(r => r.id === id ? { ...r, status: 'completed' } : r));
      setMsg('Car returned successfully.');
    } catch (e) { setMsg(e.message); }
  }

  async function doGate() {
    try {
      if (gateModal.type === 'checkout') {
        await gateCheckout(gateModal.reservationId, { driverLicense: gateForm.driverLicense, mileageOut: parseInt(gateForm.mileageOut), fuelOut: parseInt(gateForm.fuelOut), agentName: userName });
        setMsg('Checkout recorded.');
      } else {
        await gateCheckin(gateModal.reservationId, { mileageIn: parseInt(gateForm.mileageIn), fuelIn: parseInt(gateForm.fuelIn), damages: gateForm.damages, agentName: userName });
        setMsg('Check-in recorded.');
      }
      setGateModal(null); setGateForm({});
    } catch (e) { setMsg(e.message); }
  }

  async function doMaint() {
    try {
      const a = await addMaintenanceAlert({ carId: parseInt(maintForm.carId), description: maintForm.description, priority: maintForm.priority, reportedBy: userName });
      setAlerts(prev => [a, ...prev]);
      setMsg('Alert created.'); setMaintModal(false); setMaintForm({ carId: '', description: '', priority: 'Medium', reportedBy: userName });
    } catch (e) { setMsg(e.message); }
  }

  async function changeStatus(id, status) {
    try {
      const a = await updateAlertStatus(id, status);
      setAlerts(prev => prev.map(x => x.maintenanceAlertId === id ? a : x));
    } catch (e) { setMsg(e.message); }
  }

  const PRIORITY_COLOR = { High: '#dc2626', Medium: '#d97706', Low: '#16a34a' };
  const STATUS_COLOR = { confirmed: '#2563eb', completed: '#16a34a', cancelled: '#dc2626' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: '#111', display: 'flex', flexDirection: 'column', padding: '32px 0' }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: '#e85d24', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚗</div>
            <span style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, fontSize: 12 }}>ROADREADY</span>
          </div>
        </div>
        <div style={{ padding: '24px 16px', flex: 1 }}>
          <p style={{ color: '#555', fontSize: 11, fontWeight: 600, letterSpacing: 1, padding: '0 8px', marginBottom: 8 }}>AGENT</p>
          {[['bookings', '📋 All Bookings'], ['gate', '🚧 Gate Logistics'], ['maintenance', '🔧 Maintenance']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 10, marginBottom: 4, background: tab === k ? '#e85d2420' : 'none', color: tab === k ? '#e85d24' : '#888', cursor: 'pointer', fontSize: 14, fontWeight: tab === k ? 600 : 400, border: 'none' }}>{l}</button>
          ))}
        </div>
        <div style={{ padding: '0 16px 24px' }}>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 0 2px', padding: '0 16px' }}>{userName}</p>
          <p style={{ color: '#555', fontSize: 11, margin: '0 0 12px', padding: '0 16px' }}>Agent</p>
          <button onClick={() => { logout(); navigate('/'); }} style={{ width: '100%', padding: '10px', background: 'none', border: '1px solid #333', color: '#aaa', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '40px 48px', background: '#f9f9f9' }}>
        {msg && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#16a34a', fontSize: 14 }}>{msg}<button onClick={() => setMsg('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>×</button></div>}

        {tab === 'bookings' && (
          <>
            <h2 style={{ fontWeight: 900, fontSize: 28, margin: '0 0 24px' }}>All Bookings</h2>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eee', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    {['ID', 'Pickup', 'Drop-off', 'Dates', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#888', borderBottom: '1px solid #eee' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={td}>#{b.id}</td>
                      <td style={td}>{b.pickupLocation}</td>
                      <td style={td}>{b.dropoffLocation}</td>
                      <td style={td}>{b.pickupDate}</td>
                      <td style={{ ...td, fontWeight: 600, color: '#e85d24' }}>${b.totalAmount}</td>
                      <td style={td}><span style={{ background: `${STATUS_COLOR[b.status] || '#888'}20`, color: STATUS_COLOR[b.status] || '#888', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, textTransform: 'capitalize' }}>{b.status}</span></td>
                      <td style={td}>
                        {b.status === 'confirmed' && <button onClick={() => doReturn(b.id)} style={actionBtn}>Return</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'gate' && (
          <>
            <h2 style={{ fontWeight: 900, fontSize: 28, margin: '0 0 24px' }}>Gate Logistics</h2>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eee', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    {['Booking ID', 'Pickup', 'Status', 'Checkout', 'Check-in'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#888', borderBottom: '1px solid #eee' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.filter(b => b.status === 'confirmed').map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={td}>#{b.id}</td>
                      <td style={td}>{b.pickupLocation}</td>
                      <td style={td}><span style={{ background: '#eff6ff', color: '#2563eb', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Confirmed</span></td>
                      <td style={td}><button onClick={() => { setGateModal({ type: 'checkout', reservationId: b.id }); setGateForm({}); }} style={actionBtn}>Checkout →</button></td>
                      <td style={td}><button onClick={() => { setGateModal({ type: 'checkin', reservationId: b.id }); setGateForm({}); }} style={{ ...actionBtn, borderColor: '#bbf7d0', color: '#16a34a' }}>Check-in →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'maintenance' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 900, fontSize: 28, margin: 0 }}>Maintenance Alerts</h2>
              <button onClick={() => setMaintModal(true)} style={{ background: '#e85d24', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>+ Report Alert</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {alerts.map(a => (
                <div key={a.maintenanceAlertId} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>{a.carName}</p>
                      <span style={{ background: `${PRIORITY_COLOR[a.priority] || '#888'}20`, color: PRIORITY_COLOR[a.priority] || '#888', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{a.priority}</span>
                    </div>
                    <p style={{ color: '#666', fontSize: 13, margin: '0 0 4px' }}>{a.description}</p>
                    <p style={{ color: '#aaa', fontSize: 12, margin: 0 }}>Reported by {a.reportedBy} · {new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#888' }}>Status: {a.status}</span>
                    {a.status !== 'Fixed' && (
                      <select onChange={e => changeStatus(a.maintenanceAlertId, e.target.value)} defaultValue="" style={{ padding: '6px 10px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                        <option value="" disabled>Update</option>
                        {['In Progress', 'Fixed'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              ))}
              {alerts.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', padding: 40 }}>No maintenance alerts.</p>}
            </div>
          </>
        )}
      </div>

      {/* Gate modal */}
      {gateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: 420 }}>
            <h3 style={{ fontWeight: 800, margin: '0 0 20px' }}>{gateModal.type === 'checkout' ? 'Gate Checkout' : 'Gate Check-in'} — Booking #{gateModal.reservationId}</h3>
            {gateModal.type === 'checkout' ? (
              <>
                {[['driverLicense', "Driver's license"], ['mileageOut', 'Mileage out'], ['fuelOut', 'Fuel level out (%)']].map(([k, l]) => (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <label style={lbl}>{l}</label>
                    <input value={gateForm[k] || ''} onChange={e => setGateForm(f => ({ ...f, [k]: e.target.value }))} style={inp} placeholder={l} type={k === 'driverLicense' ? 'text' : 'number'} />
                  </div>
                ))}
              </>
            ) : (
              <>
                {[['mileageIn', 'Mileage in'], ['fuelIn', 'Fuel level in (%)']].map(([k, l]) => (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <label style={lbl}>{l}</label>
                    <input value={gateForm[k] || ''} onChange={e => setGateForm(f => ({ ...f, [k]: e.target.value }))} style={inp} placeholder={l} type="number" />
                  </div>
                ))}
                <label style={lbl}>Damages (or type "none")</label>
                <input value={gateForm.damages || ''} onChange={e => setGateForm(f => ({ ...f, damages: e.target.value }))} style={inp} placeholder="Describe any damages..." />
              </>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setGateModal(null)} style={{ flex: 1, padding: '12px', background: 'none', border: '1.5px solid #e0e0e0', borderRadius: 10, cursor: 'pointer' }}>Cancel</button>
              <button onClick={doGate} style={{ flex: 1, padding: '12px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance modal */}
      {maintModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: 420 }}>
            <h3 style={{ fontWeight: 800, margin: '0 0 20px' }}>Report Maintenance Alert</h3>
            {[['carId', 'Car ID'], ['description', 'Description']].map(([k, l]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label style={lbl}>{l}</label>
                <input value={maintForm[k]} onChange={e => setMaintForm(f => ({ ...f, [k]: e.target.value }))} style={inp} placeholder={l} type={k === 'carId' ? 'number' : 'text'} />
              </div>
            ))}
            <label style={lbl}>Priority</label>
            <select value={maintForm.priority} onChange={e => setMaintForm(f => ({ ...f, priority: e.target.value }))} style={{ ...inp, marginBottom: 12 }}>
              {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => setMaintModal(false)} style={{ flex: 1, padding: '12px', background: 'none', border: '1.5px solid #e0e0e0', borderRadius: 10, cursor: 'pointer' }}>Cancel</button>
              <button onClick={doMaint} style={{ flex: 1, padding: '12px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const td = { padding: '14px 16px', fontSize: 13, color: '#333' };
const actionBtn = { padding: '7px 14px', border: '1.5px solid #fecaca', color: '#dc2626', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 };
const lbl = { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 6 };
const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' };
