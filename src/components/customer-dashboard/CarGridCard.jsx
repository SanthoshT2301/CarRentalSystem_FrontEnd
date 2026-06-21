import { useState } from 'react';

export default function CarGridCard({ car, onBook }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: hover
          ? '0 8px 28px rgba(0,0,0,0.13)'
          : '0 1px 6px rgba(0,0,0,0.07)',
        border: '1px solid #eee',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: 160,
          overflow: 'hidden',
        }}
      >
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s',
            transform: hover ? 'scale(1.04)' : 'scale(1)',
          }}
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600';
          }}
        />

        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: car.available ? '#16a34a' : '#dc2626',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 20,
          }}
        >
          {car.available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div style={{ padding: '14px 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 4,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            {car.make} {car.model}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                color: '#e85d24',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              ₹{car.pricePerDay}
              <span
                style={{
                  fontSize: 11,
                  color: '#aaa',
                  fontWeight: 400,
                }}
              >
                /day
              </span>
            </div>

            <div
              style={{
                color: '#aaa',
                fontSize: 11,
              }}
            >
              ₹{Math.ceil((car.pricePerDay || 1500) / 24)}/hr
            </div>
          </div>
        </div>

        <div
          style={{
            color: '#888',
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          {car.type} · {car.location} · {car.features?.[0] || ''}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                style={{
                  color:
                    s <= Math.round(car.rating || 4)
                      ? '#f59e0b'
                      : '#e0e0e0',
                  fontSize: 13,
                }}
              >
                ★
              </span>
            ))}
          </div>

          <span
            style={{
              color: '#aaa',
              fontSize: 12,
            }}
          >
            ({car.reviewsCount || 54})
          </span>
        </div>

        <button
          onClick={onBook}
          disabled={!car.available}
          style={{
            width: '100%',
            padding: '9px 0',
            background: car.available ? '#e85d24' : '#e5e7eb',
            color: car.available ? '#fff' : '#9ca3af',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            cursor: car.available ? 'pointer' : 'not-allowed',
            transition: 'opacity 0.2s',
          }}
        >
          Reserve Now
        </button>
      </div>
    </div>
  );
}