import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCars } from '../api/api';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';

const BRAND = '#e85d24';

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
    <div className="bg-white" style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div
        className="d-flex align-items-center position-relative"
        style={{
          background: '#111',
          minHeight: '100vh',
          backgroundImage: 'url(https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.72)' }} />
        <div className="position-relative px-4 px-md-5" style={{ maxWidth: 700 }}>
          <div
            className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 mb-4"
            style={{ background: 'rgba(232,93,36,0.2)', border: '1px solid rgba(232,93,36,0.4)' }}
          >
            <span className="rounded-circle d-inline-block" style={{ width: 6, height: 6, background: BRAND }} />
            <span className="fw-semibold" style={{ color: BRAND, fontSize: 11, letterSpacing: 1 }}>
              AFFORDABLE CAR RENTALS
            </span>
          </div>

          <h1 className="text-white fw-bold text-uppercase mb-1" style={{ fontSize: 72, lineHeight: 1.05 }}>
            RENT A CAR.
          </h1>
          <h1 className="fw-bold text-uppercase mb-4" style={{ fontSize: 72, lineHeight: 1.05, color: BRAND }}>
            YOUR WAY.
          </h1>
          <p className="mb-5" style={{ color: '#ccc', fontSize: 16, lineHeight: 1.7, maxWidth: 480 }}>
            Hourly or daily — choose from our modern fleet at unbeatable prices. Pickup and drop in major cities across the US.
          </p>

          {/* Search box */}
          <div
            className="d-flex align-items-end gap-3 rounded-3 p-3 p-md-4"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
              maxWidth: 680,
            }}
          >
            <div className="flex-grow-1">
              <label className="d-block fw-semibold mb-2" style={{ color: '#aaa', fontSize: 11, letterSpacing: 0.5 }}>
                SEARCH CARS
              </label>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Brand, model, or location..."
                className="form-control"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                }}
              />
            </div>
            <button
              onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn fw-bold text-white text-nowrap"
              style={{ background: BRAND, fontSize: 14 }}
            >
              Search Cars →
            </button>
          </div>

          {/* Stats */}
          <div className="d-flex gap-5 mt-5">
            {[['500+', 'Cars Available'], ['4', 'Cities'], ['$6/hr', 'Starting From'], ['4.9★', 'User Rating']].map(([v, l]) => (
              <div key={l}>
                <p className="text-white fw-bold mb-0" style={{ fontSize: 22 }}>{v}</p>
                <p className="mb-0" style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div id="services" className="px-4 px-md-5" style={{ padding: '100px 60px', background: '#fafafa' }}>
        <div className="text-center mb-5">
          <p className="fw-semibold mb-3" style={{ color: BRAND, fontSize: 12, letterSpacing: 2 }}>OUR SERVICES</p>
          <h2 className="fw-bold text-uppercase mb-0" style={{ fontSize: 42 }}>RENTALS BUILT AROUND YOU</h2>
          <p className="mx-auto mt-3" style={{ color: '#666', maxWidth: 500 }}>
            Whether you need a car for an hour or a week, RoadReady has a plan that fits your budget and schedule.
          </p>
        </div>
        <div className="row g-4 mx-auto" style={{ maxWidth: 1000 }}>
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
            <div key={s.title} className="col-md-4">
              <div
                className="d-flex flex-column h-100 rounded-4 p-4"
                style={{
                  background: s.highlight ? '#1a1a1a' : '#fff',
                  border: `1px solid ${s.highlight ? '#333' : '#e8e8e8'}`,
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 mb-4"
                  style={{ width: 48, height: 48, background: s.highlight ? '#333' : '#fef3ee', fontSize: 22 }}
                >
                  {s.icon}
                </div>
                <p className="fw-semibold mb-2" style={{ color: BRAND, fontSize: 11, letterSpacing: 1 }}>{s.tag}</p>
                <h3 className="fw-bold mb-1" style={{ color: s.highlight ? '#fff' : '#111', fontSize: 22 }}>{s.title}</h3>
                <p className="fw-semibold mb-3" style={{ color: BRAND, fontSize: 13 }}>{s.sub}</p>
                <p className="mb-4" style={{ color: s.highlight ? '#aaa' : '#666', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                <div className="flex-grow-1">
                  {s.features.map(f => (
                    <div key={f} className="d-flex align-items-center gap-2 mb-2">
                      <span className="fw-semibold" style={{ color: BRAND }}>✓</span>
                      <span style={{ color: s.highlight ? '#ccc' : '#555', fontSize: 13 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn fw-bold mt-4"
                  style={{
                    padding: '12px',
                    fontSize: 14,
                    background: s.highlight ? BRAND : 'transparent',
                    color: s.highlight ? '#fff' : '#111',
                    border: s.highlight ? 'none' : '1.5px solid #ddd',
                  }}
                >
                  {s.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cities */}
      <div id="cities" className="px-4 px-md-5" style={{ padding: '100px 60px', background: '#111' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="d-flex justify-content-between align-items-start mb-5 flex-wrap gap-4">
            <div>
              <p className="fw-semibold mb-3" style={{ color: BRAND, fontSize: 11, letterSpacing: 2 }}>AVAILABLE LOCATIONS</p>
              <h2 className="text-white fw-bold text-uppercase mb-0" style={{ fontSize: 48, lineHeight: 1.1 }}>
                PICKUP & DROP<br />ACROSS 4 CITIES
              </h2>
            </div>
            <p className="mt-4" style={{ color: '#666', maxWidth: 280, lineHeight: 1.7 }}>
              Rent in one city, return in another. All stations are near airports, transit hubs, and downtown centers.
            </p>
          </div>
          <div className="row g-3 mx-auto" style={{ maxWidth: 900 }}>
            {[
              { code: 'SFO', name: 'San Francisco', points: 5, img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=600' },
              { code: 'NYC', name: 'New York', points: 8, img: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&q=80&w=600' },
              { code: 'DEN', name: 'Denver', points: 4, img: 'https://images.unsplash.com/photo-1617220221116-a4e13c4db4cd?auto=format&fit=crop&q=80&w=600' },
              { code: 'LAX', name: 'Los Angeles', points: 7, img: 'https://images.unsplash.com/photo-1580655653885-65763b2597d1?auto=format&fit=crop&q=80&w=600' },
            ].map(c => (
              <div key={c.name} className="col-6">
                <div className="position-relative rounded-4 overflow-hidden" style={{ height: 220, cursor: 'pointer' }}>
                  <img src={c.img} alt={c.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))' }}
                  />
                  <div className="position-absolute" style={{ bottom: 20, left: 20 }}>
                    <span
                      className="d-inline-block fw-bold text-white rounded mb-2"
                      style={{ background: BRAND, fontSize: 10, padding: '3px 8px' }}
                    >
                      {c.code}
                    </span>
                    <p className="text-white fw-bold mb-1" style={{ fontSize: 18 }}>{c.name}</p>
                    <p className="mb-0" style={{ color: '#ccc', fontSize: 12 }}>{c.points} pickup points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About / Why RoadReady */}
      <div id="about" className="px-4 px-md-5" style={{ padding: '100px 60px', background: '#fff' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="text-center mb-5">
            <p className="fw-semibold mb-0" style={{ color: BRAND, fontSize: 11, letterSpacing: 2 }}>WHY ROADREADY</p>
            <h2 className="fw-bold text-uppercase mt-3 mb-0" style={{ fontSize: 42 }}>DESIGNED TO BE<br />USER-FRIENDLY</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: '⏱', title: 'Book in 60 Seconds', desc: 'Choose your car, pick your time, confirm — it\'s that fast. No paperwork, no waiting at counters.' },
              { icon: '🛡', title: 'Fully Insured Fleet', desc: 'Every car comes with comprehensive insurance. Drive with total peace of mind wherever you go.' },
              { icon: '📍', title: '50+ Pickup Locations', desc: 'Find a RoadReady station near airports, train stations, and city centers across 4 major cities.' },
              { icon: '$', title: 'Lowest Price Guarantee', desc: 'Hourly rates from $6/hr and daily from $32/day. We\'ll match any lower price you find.' },
              { icon: '📞', title: '24/7 Support', desc: 'Our team is always on standby. Call, chat, or email anytime — we\'ve got you covered.' },
              { icon: '↩', title: 'Free Cancellation', desc: 'Plans change — we get it. Cancel up to 2 hours before pickup for a full refund, no questions asked.' },
            ].map(f => (
              <div key={f.title} className="col-md-4">
                <div className="h-100 rounded-4 p-4" style={{ background: '#fafafa', border: '1px solid #eee' }}>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{ width: 44, height: 44, background: '#fef3ee', fontSize: 20 }}
                  >
                    {f.icon}
                  </div>
                  <h4 className="fw-bold mb-2" style={{ color: BRAND, fontSize: 16 }}>{f.title}</h4>
                  <p className="mb-0" style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet */}
      <div id="fleet" className="px-4 px-md-5" style={{ padding: '80px 60px', background: '#f9f9f9' }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
            <div>
              <p className="fw-semibold mb-2" style={{ color: BRAND, fontSize: 11, letterSpacing: 2 }}>OUR FLEET</p>
              <h2 className="fw-bold text-uppercase mb-0" style={{ fontSize: 36 }}>BROWSE AVAILABLE CARS</h2>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by brand, model, city..."
              className="form-control"
              style={{ width: 280 }}
            />
          </div>

          {loading ? (
            <div className="text-center py-5" style={{ color: '#aaa' }}>Loading fleet...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5" style={{ color: '#aaa' }}>No cars found.</div>
          ) : (
            <div className="row g-4">
              {filtered.map(car => (
                <div key={car.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          )}

          {!search && totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-5 flex-wrap">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn"
                style={pageBtn(page !== 1)}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="btn"
                  style={{ ...pageBtn(true), background: p === page ? BRAND : 'transparent', color: p === page ? '#fff' : '#333' }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn"
                style={pageBtn(page !== totalPages)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center px-4 px-md-5" style={{ background: '#111', padding: '100px 60px' }}>
        <p className="fw-semibold mb-3" style={{ color: BRAND, fontSize: 11, letterSpacing: 2 }}>GET STARTED TODAY</p>
        <h2 className="text-white fw-bold text-uppercase mb-4" style={{ fontSize: 56, lineHeight: 1.1 }}>
          YOUR NEXT ADVENTURE<br />IS ONE CLICK AWAY.
        </h2>
        <p className="mx-auto mb-5" style={{ color: '#666', fontSize: 16, maxWidth: 500 }}>
          Join thousands of happy drivers who trust RoadReady for every trip. Create your free account in seconds.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/register')}
            className="btn fw-bold text-white"
            style={{ background: BRAND, padding: '14px 32px', borderRadius: 10, fontSize: 15 }}
          >
            Create Free Account →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn fw-bold text-white"
            style={{ background: 'transparent', border: '1.5px solid #333', padding: '14px 32px', borderRadius: 10, fontSize: 15 }}
          >
            Sign In
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const pageBtn = (active) => ({
  padding: '8px 14px',
  borderRadius: 8,
  border: '1.5px solid #e0e0e0',
  cursor: active ? 'pointer' : 'not-allowed',
  background: 'transparent',
  opacity: active ? 1 : 0.4,
  fontSize: 13,
  fontWeight: 500,
});