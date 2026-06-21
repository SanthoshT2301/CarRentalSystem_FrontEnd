import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById, createBooking, validatePromoCode } from '../services';
import { useAuth } from '../context/AuthContext';
const LOCATIONS = ['Chennai', 'Madurai', 'Coimbatore', 'Trichy'];

export default function BookCar() {
  const { carId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [mode, setMode] = useState('daily'); // 'daily' | 'hourly'
  const [form, setForm] = useState({
    pickupLocation: 'San Francisco', dropoffLocation: 'San Francisco',
    pickupDate: '', dropoffDate: '', pickupTime: '09:00', durationHours: 2,
    paymentMethodId: 1, cardNumber: '', expiryDate: '', cvv: '', payPalEmail: '',
    address: '',
  });
  const [promo, setPromo] = useState('');
  const [promoData, setPromoData] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { getCarById(carId).then(setCar).catch(() => navigate('/')); }, [carId]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function applyPromo() {
    setPromoError(''); setPromoData(null);
    try {
      const d = await validatePromoCode(promo);
      setPromoData(d);
    } catch { setPromoError('Invalid or expired promo code.'); }
  }

  function calcTotal() {
    if (!car) return 0;
    let base = 0;
    if (mode === 'hourly') {
     base = Math.ceil((car.pricePerDay || 1500) / 24) * (form.durationHours || 1);
    } else {
      const d1 = new Date(form.pickupDate), d2 = new Date(form.dropoffDate);
      const days = Math.max(1, Math.ceil((d2 - d1) / 86400000));
      base = (car.pricePerDay || 1500) * (isNaN(days) ? 1 : days);
    }
    if (promoData) base = base * (1 - promoData.discountPercent / 100);
    return base.toFixed(2);
  }

  async function handleBook() {
    setError(''); setLoading(true);
    try {
      const body = {
        carId: parseInt(carId),
        pickupLocation: form.pickupLocation,
        dropoffLocation: form.dropoffLocation,
        pickupDate: form.pickupDate || new Date().toISOString().split('T')[0],
        dropoffDate: mode === 'daily' ? form.dropoffDate : form.pickupDate,
        totalAmount: parseFloat(calcTotal()),
        address: form.address || '123 Rental Blvd',
        isHourly: mode === 'hourly',
        durationHours: mode === 'hourly' ? parseInt(form.durationHours) : 0,
        pickupTime: mode === 'hourly' ? form.pickupTime : null,
        paymentMethodId: form.paymentMethodId,
        cardNumber: form.paymentMethodId === 1 ? form.cardNumber : null,
        expiryDate: form.paymentMethodId === 1 ? form.expiryDate : null,
        cvv: form.paymentMethodId === 1 ? form.cvv : null,
        payPalEmail: form.paymentMethodId === 2 ? form.payPalEmail : null,
      };
      await createBooking(userId, body);
      navigate('/dashboard/customer');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  if (!car) return <div style={{ padding: 80, textAlign: 'center', color: '#aaa' }}>Loading...</div>;

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100vh', padding: '48px 40px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14, marginBottom: 24 }}>← Back</button>
        <h2 style={{ fontWeight: 900, fontSize: 28, margin: '0 0 32px' }}>Book Your Car</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Car preview */}
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #eee', display: 'flex' }}>
              <img src={car.image} alt={car.make} style={{ width: 200, height: 140, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400'; }} />
              <div style={{ padding: '20px 24px' }}>
                <p style={{ fontWeight: 700, fontSize: 20, margin: '0 0 4px' }}>{car.make} {car.model}</p>
                <p style={{ color: '#888', fontSize: 13, margin: '0 0 12px' }}>{car.year} · {car.type} · {car.location}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {car.features.slice(0, 3).map((f, i) => <span key={i} style={{ background: '#f4f4f4', fontSize: 11, padding: '3px 10px', borderRadius: 20, color: '#555' }}>{f}</span>)}
                </div>
                <p style={{ color: '#e85d24', fontWeight: 700, fontSize: 20, margin: '12px 0 0' }}>₹{car.pricePerDay}<span style={{ fontSize: 13, fontWeight: 400 }}>/day</span></p>
              </div>
            </div>

            {/* Rental mode */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #eee' }}>
              <p style={secHead}>Rental type</p>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                {['daily', 'hourly'].map(m => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    flex: 1, padding: '10px', borderRadius: 10, fontWeight: 600, fontSize: 14,
                    border: `2px solid ${mode === m ? '#e85d24' : '#e8e8e8'}`,
                    background: mode === m ? '#fef3ee' : '#fff', color: mode === m ? '#e85d24' : '#555', cursor: 'pointer',
                  }}>
                    {m === 'daily' ? '📅 Daily rental' : '⏱ Hourly rental'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={lbl}>Pickup location</label>
                  <select value={form.pickupLocation} onChange={e => set('pickupLocation', e.target.value)} style={inp}>
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Drop-off location</label>
                  <select value={form.dropoffLocation} onChange={e => set('dropoffLocation', e.target.value)} style={inp}>
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                {mode === 'daily' ? (
                  <>
                    <div>
                      <label style={lbl}>Pickup date</label>
                      <input type="date" value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)} style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Drop-off date</label>
                      <input type="date" value={form.dropoffDate} onChange={e => set('dropoffDate', e.target.value)} style={inp} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label style={lbl}>Pickup date</label>
                      <input type="date" value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)} style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Pickup time</label>
                      <input type="time" value={form.pickupTime} onChange={e => set('pickupTime', e.target.value)} style={inp} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={lbl}>Duration (hours)</label>
                      <input type="number" min={1} max={24} value={form.durationHours} onChange={e => set('durationHours', e.target.value)} style={inp} />
                    </div>
                  </>
                )}
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>Delivery address (optional)</label>
                  <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address for delivery..." style={inp} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #eee' }}>
              <p style={secHead}>Payment method</p>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {[{ id: 1, label: '💳 Credit Card' }, { id: 2, label: '🅿 PayPal' }, { id: 3, label: '🍎 Apple Pay' }].map(pm => (
                  <button key={pm.id} onClick={() => set('paymentMethodId', pm.id)} style={{
                    flex: 1, padding: '10px 8px', borderRadius: 10, border: `2px solid ${form.paymentMethodId === pm.id ? '#e85d24' : '#e8e8e8'}`,
                    background: form.paymentMethodId === pm.id ? '#fef3ee' : '#fff', color: form.paymentMethodId === pm.id ? '#e85d24' : '#555',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  }}>{pm.label}</button>
                ))}
              </div>
              {form.paymentMethodId === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={lbl}>Card number</label>
                    <input value={form.cardNumber} onChange={e => set('cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" style={inp} />
                  </div>
                  <div style={{ gridColumn: '1/3' }}>
                    <label style={lbl}>Expiry date</label>
                    <input value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} placeholder="MM/YY" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>CVV</label>
                    <input value={form.cvv} onChange={e => set('cvv', e.target.value)} placeholder="123" style={inp} type="password" maxLength={4} />
                  </div>
                </div>
              )}
              {form.paymentMethodId === 2 && (
                <>
                  <label style={lbl}>PayPal email</label>
                  <input value={form.payPalEmail} onChange={e => set('payPalEmail', e.target.value)} placeholder="paypal@email.com" type="email" style={inp} />
                </>
              )}
              {form.paymentMethodId === 3 && (
                <p style={{ color: '#888', fontSize: 14, background: '#f4f4f4', padding: '14px 18px', borderRadius: 10 }}>Apple Pay will be processed at pickup confirmation.</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #eee', position: 'sticky', top: 80 }}>
              <p style={secHead}>Booking summary</p>
              <div style={{ marginBottom: 20 }}>
                {[
                  ['Rental type', mode === 'daily' ? 'Daily' : 'Hourly'],
                  ['Pickup', form.pickupLocation],
                  ['Drop-off', form.dropoffLocation],
                  mode === 'daily'
                    ? ['Dates', form.pickupDate && form.dropoffDate ? `${form.pickupDate} → ${form.dropoffDate}` : '—']
                    : ['Duration', `${form.durationHours}h from ${form.pickupTime}`],
                  ['Rate', mode === 'daily'
  ? `₹${car.pricePerDay}/day`
  : `₹${Math.ceil((car.pricePerDay || 1500) / 24)}/hr`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: '#888', fontSize: 13 }}>{k}</span>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Promo */}
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginBottom: 16 }}>
                <label style={lbl}>Promo code</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={promo} onChange={e => { setPromo(e.target.value.toUpperCase()); setPromoError(''); setPromoData(null); }}
                    placeholder="e.g. ROADDEAL10" style={{ ...inp, flex: 1 }} />
                  <button onClick={applyPromo} style={{ padding: '10px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Apply</button>
                </div>
                {promoData && <p style={{ color: '#16a34a', fontSize: 12, marginTop: 6 }}>✓ {promoData.discountPercent}% off applied!</p>}
                {promoError && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 6 }}>{promoError}</p>}
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: 24, color: '#e85d24' }}>₹{calcTotal()}</span>
                </div>
                {promoData && <p style={{ color: '#16a34a', fontSize: 12, margin: '4px 0 0' }}>Discount applied: -{promoData.discountPercent}%</p>}
              </div>

              {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{error}</p>}

              <button onClick={handleBook} disabled={loading} style={{
                width: '100%', padding: '14px', background: '#e85d24', color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15,
                cursor: 'pointer', opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
              <p style={{ color: '#aaa', fontSize: 11, textAlign: 'center', marginTop: 12 }}>Cancel for free up to 2 hours before pickup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const secHead = { fontWeight: 700, fontSize: 15, margin: '0 0 16px' };
const lbl = { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 6 };
const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' };
