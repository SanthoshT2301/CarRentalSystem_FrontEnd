import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCars } from '../api/api';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getCars(page, 8).then(r => {
      setCars(r.data || []);
      setTotalPages(r.totalPages || 1);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page]);

  const filtered = cars.filter(c =>
    !search || `${c.make} ${c.model} ${c.location} ${c.type}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: '#111', minHeight: '100vh', display: 'flex', alignItems: 'center',
        backgroundImage: 'url(https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1600)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)' }} />
        <div style={{ position: 'relative', padding: '0 60px', maxWidth: 700 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,93,36,0.2)',
            border: '1px solid rgba(232,93,36,0.4)', padding: '6px 14px', borderRadius: 20, marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, background: '#e85d24', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>AFFORDABLE CAR RENTALS</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 72, fontWeight: 900, lineHeight: 1.05, margin: '0 0 8px', textTransform: 'uppercase' }}>
            RENT A CAR.
          </h1>
          <h1 style={{ color: '#e85d24', fontSize: 72, fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px', textTransform: 'uppercase' }}>
            YOUR WAY.
          </h1>
          <p style={{ color: '#ccc', fontSize: 16, lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
            Hourly or daily — choose from our modern fleet at unbeatable prices. Pickup and drop in major cities across the US.
          </p>

          {/* Search box */}
          <div style={{
            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '20px 24px',
            display: 'flex', alignItems: 'flex-end', gap: 16, maxWidth: 680,
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#aaa', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>SEARCH CARS</label>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Brand, model, or location..."
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                  padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: '#e85d24', color: '#fff', border: 'none', fontWeight: 700,
                padding: '11px 24px', borderRadius: 8, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Search Cars →
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
            {[['500+', 'Cars Available'], ['4', 'Cities'], ['$6/hr', 'Starting From'], ['4.9★', 'User Rating']].map(([v, l]) => (
              <div key={l}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: 0 }}>{v}</p>
                <p style={{ color: '#888', fontSize: 12, margin: '2px 0 0' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div id="services" style={{ padding: '100px 60px', background: '#fafafa' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ color: '#e85d24', fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>OUR SERVICES</p>
          <h2 style={{ fontSize: 42, fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>RENTALS BUILT AROUND YOU</h2>
          <p style={{ color: '#666', marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
            Whether you need a car for an hour or a week, RoadReady has a plan that fits your budget and schedule.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {[
            {
              tag: 'FLEXIBLE', title: 'Hourly Rental', sub: 'From $6 / hr', icon: '⏱',
              desc: 'Perfect for quick errands, airport runs, or half-day trips. Pay only for the hours you use — no hidden fees.',
              features: ['No minimum hours', 'Free 15-min grace period', 'Instant booking', 'Cancel up to 2hr before'],
              highlight: false, cta: 'Learn More',
            },
            {
              tag: 'MOST POPULAR', title: 'Daily Rental', sub: 'From $32 / day', icon: '📅',
              desc: 'Ideal for road trips, business travel, or weekend getaways. Unlock our best rates with multi-day bookings.',
              features: ['Unlimited mileage', 'Full insurance included', 'Free roadside assistance', 'Multi-day discounts up to 30%'],
              highlight: true, cta: 'Book Now →',
            },
            {
              tag: 'ENTERPRISE', title: 'Corporate Plans', sub: 'Custom pricing', icon: '👥',
              desc: 'Managed fleet solutions for businesses. Dedicated account manager, priority booking, and monthly billing.',
              features: ['Fleet of 5–100+ cars', 'Priority support line', 'Monthly invoicing', 'Custom driver profiles'],
              highlight: false, cta: 'Learn More',
            },
          ].map(s => (
            <div key={s.title} style={{
              background: s.highlight ? '#1a1a1a' : '#fff',
              border: `1px solid ${s.highlight ? '#333' : '#e8e8e8'}`,
              borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                width: 48, height: 48, background: s.highlight ? '#333' : '#fef3ee',
                borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 20,
              }}>{s.icon}</div>
              <p style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 1, margin: '0 0 8px' }}>{s.tag}</p>
              <h3 style={{ color: s.highlight ? '#fff' : '#111', fontWeight: 800, fontSize: 22, margin: '0 0 4px' }}>{s.title}</h3>
              <p style={{ color: '#e85d24', fontSize: 13, fontWeight: 600, margin: '0 0 16px' }}>{s.sub}</p>
              <p style={{ color: s.highlight ? '#aaa' : '#666', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>{s.desc}</p>
              <div style={{ flex: 1 }}>
                {s.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: '#e85d24', fontWeight: 600 }}>✓</span>
                    <span style={{ color: s.highlight ? '#ccc' : '#555', fontSize: 13 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  marginTop: 24, padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', background: s.highlight ? '#e85d24' : 'transparent',
                  color: s.highlight ? '#fff' : '#111', border: s.highlight ? 'none' : '1.5px solid #ddd',
                  transition: 'all 0.2s',
                }}
              >{s.cta}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Cities */}
      <div id="cities" style={{ padding: '100px 60px', background: '#111' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 60 }}>
            <div>
              <p style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>AVAILABLE LOCATIONS</p>
              <h2 style={{ color: '#fff', fontSize: 48, fontWeight: 900, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
                PICKUP & DROP<br />ACROSS 4 CITIES
              </h2>
            </div>
            <p style={{ color: '#666', maxWidth: 280, lineHeight: 1.7, marginTop: 40 }}>
              Rent in one city, return in another. All stations are near airports, transit hubs, and downtown centers.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 900, margin: '0 auto' }}>
            {[
              { code: 'SFO', name: 'San Francisco', points: 5, img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=600' },
              { code: 'NYC', name: 'New York', points: 8, img: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&q=80&w=600' },
              { code: 'DEN', name: 'Denver', points: 4, img: 'https://images.unsplash.com/photo-1617220221116-a4e13c4db4cd?auto=format&fit=crop&q=80&w=600' },
              { code: 'LAX', name: 'Los Angeles', points: 7, img: 'https://images.unsplash.com/photo-1580655653885-65763b2597d1?auto=format&fit=crop&q=80&w=600' },
            ].map(c => (
              <div key={c.name} style={{
                position: 'relative', height: 220, borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
              }}>
                <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))' }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                  <span style={{ background: '#e85d24', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, marginBottom: 6, display: 'inline-block' }}>{c.code}</span>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: '4px 0 2px' }}>{c.name}</p>
                  <p style={{ color: '#ccc', fontSize: 12, margin: 0 }}>{c.points} pickup points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About / Why RoadReady */}
      <div id="about" style={{ padding: '100px 60px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 2 }}>WHY ROADREADY</p>
            <h2 style={{ fontSize: 42, fontWeight: 900, textTransform: 'uppercase', margin: '12px 0 0' }}>DESIGNED TO BE<br />USER-FRIENDLY</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: '⏱', title: 'Book in 60 Seconds', desc: 'Choose your car, pick your time, confirm — it\'s that fast. No paperwork, no waiting at counters.' },
              { icon: '🛡', title: 'Fully Insured Fleet', desc: 'Every car comes with comprehensive insurance. Drive with total peace of mind wherever you go.' },
              { icon: '📍', title: '50+ Pickup Locations', desc: 'Find a RoadReady station near airports, train stations, and city centers across 4 major cities.' },
              { icon: '$', title: 'Lowest Price Guarantee', desc: 'Hourly rates from $6/hr and daily from $32/day. We\'ll match any lower price you find.' },
              { icon: '📞', title: '24/7 Support', desc: 'Our team is always on standby. Call, chat, or email anytime — we\'ve got you covered.' },
              { icon: '↩', title: 'Free Cancellation', desc: 'Plans change — we get it. Cancel up to 2 hours before pickup for a full refund, no questions asked.' },
            ].map(f => (
              <div key={f.title} style={{ background: '#fafafa', borderRadius: 16, padding: 28, border: '1px solid #eee' }}>
                <div style={{ width: 44, height: 44, background: '#fef3ee', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>{f.icon}</div>
                <h4 style={{ color: '#e85d24', fontWeight: 700, fontSize: 16, margin: '0 0 8px' }}>{f.title}</h4>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet */}
      <div id="fleet" style={{ padding: '80px 60px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <p style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 2, margin: '0 0 8px' }}>OUR FLEET</p>
              <h2 style={{ fontSize: 36, fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>BROWSE AVAILABLE CARS</h2>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by brand, model, city..."
              style={{
                padding: '10px 18px', borderRadius: 10, border: '1.5px solid #e0e0e0',
                fontSize: 14, outline: 'none', width: 280,
              }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>Loading fleet...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>No cars found.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {filtered.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          )}

          {!search && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={pageBtn(page !== 1)}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ ...pageBtn(true), background: p === page ? '#e85d24' : 'transparent', color: p === page ? '#fff' : '#333' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={pageBtn(page !== totalPages)}>Next →</button>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#111', padding: '100px 60px', textAlign: 'center' }}>
        <p style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 2, marginBottom: 20 }}>GET STARTED TODAY</p>
        <h2 style={{ color: '#fff', fontSize: 56, fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, margin: '0 0 24px' }}>
          YOUR NEXT ADVENTURE<br />IS ONE CLICK AWAY.
        </h2>
        <p style={{ color: '#666', fontSize: 16, maxWidth: 500, margin: '0 auto 40px' }}>
          Join thousands of happy drivers who trust RoadReady for every trip. Create your free account in seconds.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={() => navigate('/register')}
            style={{ background: '#e85d24', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Create Free Account →
          </button>
          <button onClick={() => navigate('/login')}
            style={{ background: 'transparent', color: '#fff', border: '1.5px solid #333', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Sign In
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const pageBtn = (active) => ({
  padding: '8px 14px', borderRadius: 8, border: '1.5px solid #e0e0e0',
  cursor: active ? 'pointer' : 'not-allowed', background: 'transparent',
  opacity: active ? 1 : 0.4, fontSize: 13, fontWeight: 500,
});
