import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { token, role, userName, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  function scrollTo(id) {
    setMobileOpen(false);
    if (!isHome) {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function getDashboardPath() {
    if (role === 'Admin') return '/dashboard/admin';
    if (role === 'Agent') return '/dashboard/agent';
    return '/dashboard/customer';
  }

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#1a1a1a', borderBottom: '1px solid #2a2a2a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 40px)', height: 64,
      }}>
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
        >
          <div style={{
            width: 34, height: 34, background: '#e85d24', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🚗</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>ROADREADY</span>
        </Link>

        {/* Desktop nav links — hidden on mobile via CSS */}
        <div className="rr-navbar-links" style={{ gap: 28 }}>
          {isHome && (
            <>
              <button onClick={() => scrollTo('services')} style={navBtn}>Services</button>
              <button onClick={() => scrollTo('cities')} style={navBtn}>Cities</button>
              <button onClick={() => scrollTo('fleet')} style={navBtn}>Fleet</button>
              <button onClick={() => scrollTo('about')} style={navBtn}>About</button>
            </>
          )}
          {!isHome && (
            <Link to="/" style={navLink}>Home</Link>
          )}
        </div>

        {/* Desktop auth links — hidden on mobile via CSS */}
        <div className="rr-navbar-auth-desktop" style={{ gap: 12 }}>
          {!token ? (
            <>
              <Link to="/login" style={{
                color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500,
                padding: '8px 18px', border: '1px solid #444', borderRadius: 8,
              }}>Login</Link>
              <Link to="/register" style={{
                color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                padding: '8px 18px', background: '#e85d24', borderRadius: 8,
              }}>Register</Link>
            </>
          ) : (
            <>
              <Link to={getDashboardPath()} style={{
                color: '#e85d24', textDecoration: 'none', fontSize: 14, fontWeight: 500,
              }}>
                👋 {userName?.split(' ')[0]}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} style={{
                color: '#aaa', background: 'none', border: '1px solid #333',
                padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
              }}>Logout</button>
            </>
          )}
        </div>

        {/* Hamburger — only visible on mobile via CSS */}
        <button
          className="rr-navbar-toggle"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown panel */}
      <div className={`rr-navbar-mobile-panel ${mobileOpen ? 'open' : ''}`}>
        {isHome && (
          <>
            <button onClick={() => scrollTo('services')} className="rr-navbar-mobile-link">Services</button>
            <button onClick={() => scrollTo('cities')} className="rr-navbar-mobile-link">Cities</button>
            <button onClick={() => scrollTo('fleet')} className="rr-navbar-mobile-link">Fleet</button>
            <button onClick={() => scrollTo('about')} className="rr-navbar-mobile-link">About</button>
          </>
        )}
        {!isHome && (
          <Link to="/" onClick={() => setMobileOpen(false)} className="rr-navbar-mobile-link" style={{ textDecoration: 'none' }}>
            Home
          </Link>
        )}

        <div className="rr-navbar-mobile-auth">
          {!token ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{
                flex: 1, textAlign: 'center', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500,
                padding: '10px 0', border: '1px solid #444', borderRadius: 8,
              }}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} style={{
                flex: 1, textAlign: 'center', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                padding: '10px 0', background: '#e85d24', borderRadius: 8,
              }}>Register</Link>
            </>
          ) : (
            <>
              <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} style={{
                flex: 1, textAlign: 'center', color: '#e85d24', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                padding: '10px 0', border: '1px solid #e85d2450', borderRadius: 8,
              }}>
                👋 {userName?.split(' ')[0]}
              </Link>
              <button onClick={() => { setMobileOpen(false); logout(); navigate('/'); }} style={{
                flex: 1, color: '#aaa', background: 'none', border: '1px solid #333',
                padding: '10px 0', borderRadius: 8, cursor: 'pointer', fontSize: 13,
              }}>Logout</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const navBtn = {
  background: 'none', border: 'none', color: '#ccc',
  fontSize: 14, cursor: 'pointer', fontWeight: 500,
  transition: 'color 0.2s',
};
const navLink = {
  color: '#ccc', textDecoration: 'none', fontSize: 14, fontWeight: 500,
};