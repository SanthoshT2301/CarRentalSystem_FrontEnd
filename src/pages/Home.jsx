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
      <div style={{ background: '#111', padding: '120px 24px 90px' }}>
        <div className="mx-auto text-center" style={{ maxWidth: 680 }}>
          <span
            className="d-inline-block fw-semibold mb-3"
            style={{ color: BRAND, fontSize: 12, letterSpacing: 2 }}
          >
            AFFORDABLE CAR RENTALS
          </span>

          <h1 className="text-white fw-bold mb-3" style={{ fontSize: 52, lineHeight: 1.15 }}>
            Rent a car, your way.
          </h1>

          <p className="mb-5 mx-auto" style={{ color: '#999', fontSize: 16, lineHeight: 1.7, maxWidth: 480 }}>
            Hourly or daily — choose from our modern fleet at unbeatable prices,
            with pickup and drop in major cities across the US.
          </p>

          {/* Search box */}
          <div className="d-flex gap-2 mx-auto" style={{ maxWidth: 480 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by brand, model, or city"
              className="form-control"
              style={{
                background: '#1c1c1c',
                border: '1px solid #2c2c2c',
                color: '#fff',
                padding: '12px 16px',
                fontSize: 14,
              }}
            />
            <button
              onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn fw-semibold text-white text-nowrap"
              style={{ background: BRAND, fontSize: 14, padding: '0 24px' }}
            >
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="d-flex justify-content-center gap-5 mt-5 pt-2">
            {[['500+', 'Cars'], ['4', 'Cities'], ['₹70/hr', 'From'], ['4.9★', 'Rating']].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-white fw-bold mb-0" style={{ fontSize: 20 }}>{v}</p>
                <p className="mb-0" style={{ color: '#777', fontSize: 12, marginTop: 2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div id="services" style={{ padding: '90px 24px', background: '#fff' }}>
        <div className="mx-auto" style={{ maxWidth: 1040 }}>
          <div className="text-center mb-5">
            <p className="fw-semibold mb-2" style={{ color: BRAND, fontSize: 12, letterSpacing: 2 }}>OUR SERVICES</p>
            <h2 className="fw-bold mb-0" style={{ fontSize: 32, color: '#111' }}>Rentals built around you</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'Hourly Rental', sub: 'From ₹70 / hr', icon: '⏱', desc: 'Quick errands, airport runs, or half-day trips. Pay only for the hours you use.' },
              { title: 'Daily Rental', sub: 'From ₹1000 / day', icon: '📅', desc: 'Road trips, business travel, or weekend getaways with unlimited mileage.' },
              { title: 'Corporate Plans', sub: 'Custom pricing', icon: '👥', desc: 'Managed fleet solutions for businesses with priority support and billing.' },
            ].map(s => (
              <div key={s.title} className="col-md-4">
                <div className="h-100 rounded-3 p-4" style={{ border: '1px solid #eee' }}>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{ width: 44, height: 44, background: '#fef3ee', fontSize: 20 }}
                  >
                    {s.icon}
                  </div>
                  <h3 className="fw-bold mb-1" style={{ fontSize: 18, color: '#111' }}>{s.title}</h3>
                  <p className="fw-semibold mb-2" style={{ color: BRAND, fontSize: 13 }}>{s.sub}</p>
                  <p className="mb-0" style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cities */}
      <div id="cities" style={{ padding: '90px 24px', background: '#fafafa' }}>
        <div className="mx-auto" style={{ maxWidth: 1040 }}>
          <div className="text-center mb-5">
            <p className="fw-semibold mb-2" style={{ color: BRAND, fontSize: 12, letterSpacing: 2 }}>AVAILABLE LOCATIONS</p>
            <h2 className="fw-bold mb-0" style={{ fontSize: 32, color: '#111' }}>Pickup &amp; drop across 4 cities</h2>
          </div>
          <div className="row g-3">
            {[
              { code: 'CHE', name: 'Chennai', points: 5 },
              { code: 'MDU', name: 'Madurai', points: 8 },
              { code: 'CBE', name: 'Coimbatore', points: 4 },
              { code: 'TPJ', name: 'Trichy', points: 7 },
            ].map(c => (
              <div key={c.name} className="col-6 col-md-3">
                <div className="rounded-3 p-4 bg-white h-100" style={{ border: '1px solid #eee' }}>
                  <span
                    className="d-inline-block fw-bold text-white rounded mb-3"
                    style={{ background: BRAND, fontSize: 10, padding: '3px 8px' }}
                  >
                    {c.code}
                  </span>
                  <p className="fw-bold mb-1" style={{ fontSize: 16, color: '#111' }}>{c.name}</p>
                  <p className="mb-0" style={{ color: '#888', fontSize: 13 }}>{c.points} pickup points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About / Why RoadReady */}
      <div id="about" style={{ padding: '90px 24px', background: '#fff' }}>
        <div className="mx-auto" style={{ maxWidth: 1040 }}>
          <div className="text-center mb-5">
            <p className="fw-semibold mb-2" style={{ color: BRAND, fontSize: 12, letterSpacing: 2 }}>WHY ROADREADY</p>
            <h2 className="fw-bold mb-0" style={{ fontSize: 32, color: '#111' }}>Designed to be user-friendly</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: '⏱', title: 'Book in 60 Seconds', desc: 'Choose your car, pick your time, confirm — no paperwork, no waiting.' },
              { icon: '🛡', title: 'Fully Insured Fleet', desc: 'Every car comes with comprehensive insurance for peace of mind.' },
              { icon: '📍', title: '50+ Pickup Locations', desc: 'Stations near airports, train stations, and city centers.' },
              { icon: '💲', title: 'Lowest Price Guarantee', desc: 'Hourly from ₹70/hr and daily from ₹1000/day. We match any lower price.' },
              { icon: '📞', title: '24/7 Support', desc: 'Our team is always on standby — call, chat, or email anytime.' },
              { icon: '↩', title: 'Free Cancellation', desc: 'Cancel up to 2 hours before pickup for a full refund.' },
            ].map(f => (
              <div key={f.title} className="col-md-4">
                <div className="d-flex gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{ width: 40, height: 40, background: '#fef3ee', fontSize: 18 }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-1" style={{ fontSize: 15, color: '#111' }}>{f.title}</h4>
                    <p className="mb-0" style={{ color: '#666', fontSize: 13.5, lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet */}
      <div id="fleet" style={{ padding: '90px 24px', background: '#fafafa' }}>
        <div className="mx-auto" style={{ maxWidth: 1180 }}>
          <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
            <div>
              <p className="fw-semibold mb-2" style={{ color: BRAND, fontSize: 12, letterSpacing: 2 }}>OUR FLEET</p>
              <h2 className="fw-bold mb-0" style={{ fontSize: 28, color: '#111' }}>Browse available cars</h2>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by brand, model, city..."
              className="form-control"
              style={{ width: 260, border: '1px solid #ddd' }}
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
                  style={{ ...pageBtn(true), background: p === page ? BRAND : 'transparent', color: p === page ? '#fff' : '#333', borderColor: p === page ? BRAND : '#ddd' }}
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
      <div className="text-center" style={{ background: '#111', padding: '90px 24px' }}>
        <p className="fw-semibold mb-3" style={{ color: BRAND, fontSize: 12, letterSpacing: 2 }}>GET STARTED TODAY</p>
        <h2 className="text-white fw-bold mb-3" style={{ fontSize: 36, lineHeight: 1.2 }}>
          Your next adventure is one click away
        </h2>
        <p className="mx-auto mb-5" style={{ color: '#888', fontSize: 15, maxWidth: 440 }}>
          Join thousands of happy drivers who trust RoadReady for every trip.
          Create your free account in seconds.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/register')}
            className="btn fw-semibold text-white"
            style={{ background: BRAND, padding: '12px 28px', borderRadius: 8, fontSize: 14 }}
          >
            Create Free Account
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn fw-semibold text-white"
            style={{ background: 'transparent', border: '1px solid #333', padding: '12px 28px', borderRadius: 8, fontSize: 14 }}
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
  border: '1px solid #ddd',
  cursor: active ? 'pointer' : 'not-allowed',
  background: 'transparent',
  opacity: active ? 1 : 0.4,
  fontSize: 13,
  fontWeight: 500,
});