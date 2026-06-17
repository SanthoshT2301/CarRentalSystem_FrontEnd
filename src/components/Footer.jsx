import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/');
  }

  return (
    <footer style={{ background: '#111', padding: '60px 40px 30px', borderTop: '1px solid #222' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, background: '#e85d24', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚗</div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>ROADREADY</span>
            </div>
            <p style={{ color: '#666', fontSize: 13, lineHeight: 1.7 }}>
              Affordable, flexible car rentals across the US. Book in seconds.
            </p>
          </div>
          <div>
            <p style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 14 }}>SERVICES</p>
            {['Hourly Rental', 'Daily Rental', 'Corporate Plans', 'One-Way Trips'].map(s => (
              <p key={s} style={{ color: '#666', fontSize: 13, marginBottom: 8, cursor: 'pointer' }}
                onClick={() => scrollTo('services')}>{s}</p>
            ))}
          </div>
          <div>
            <p style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 14 }}>CITIES</p>
            {['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle'].map(c => (
              <p key={c} style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>{c}</p>
            ))}
          </div>
          <div>
            <p style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 14 }}>COMPANY</p>
            {['About Us', 'Careers', 'Blog', 'Contact'].map(c => (
              <p key={c} style={{ color: '#666', fontSize: 13, marginBottom: 8, cursor: 'pointer' }}>{c}</p>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #222', paddingTop: 24, textAlign: 'center' }}>
          <p style={{ color: '#444', fontSize: 12 }}>© 2026 RoadReady. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
