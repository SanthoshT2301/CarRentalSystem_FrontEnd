import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const { token } = useAuth();

  function handleBook() {
    if (!token) { navigate('/login'); return; }
    navigate(`/book/${car.id}`);
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)'; }}
    >
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={car.image} alt={`${car.make} ${car.model}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'; }}
        />
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: car.available ? '#16a34a' : '#dc2626',
          color: '#fff', fontSize: 11, fontWeight: 600,
          padding: '4px 10px', borderRadius: 20,
        }}>
          {car.available ? 'Available' : 'Unavailable'}
        </div>
      </div>
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#111', margin: 0 }}>{car.make} {car.model}</p>
            <p style={{ color: '#888', fontSize: 12, margin: '2px 0 0' }}>{car.year} · {car.type}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#e85d24', fontWeight: 700, fontSize: 18, margin: 0 }}>${car.pricePerDay}<span style={{ fontSize: 12, fontWeight: 400 }}>/day</span></p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0 14px' }}>
          {car.features.slice(0, 3).map((f, i) => (
            <span key={i} style={{
              background: '#f4f4f4', color: '#555', fontSize: 11,
              padding: '3px 10px', borderRadius: 20, fontWeight: 500,
            }}>{f}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: '#777', fontSize: 12, margin: 0 }}>📍 {car.location}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#f59e0b', fontSize: 13 }}>★</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{car.rating || '4.8'}</span>
            <span style={{ color: '#aaa', fontSize: 12 }}>({car.reviewsCount || 0})</span>
          </div>
        </div>
        <button
          onClick={handleBook}
          disabled={!car.available}
          style={{
            width: '100%', marginTop: 14, padding: '10px 0',
            background: car.available ? '#e85d24' : '#e5e7eb',
            color: car.available ? '#fff' : '#9ca3af',
            border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14,
            cursor: car.available ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          {car.available ? 'Book Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
}
