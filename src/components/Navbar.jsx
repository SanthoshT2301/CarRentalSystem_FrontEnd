import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, role, userName, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  function scrollTo(id) {
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
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#1a1a1a', borderBottom: '1px solid #2a2a2a',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: 64,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 34, height: 34, background: '#e85d24', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>🚗</div>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>ROADREADY</span>
      </Link>

      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {isHome && (
          <>
            <button onClick={() => scrollTo('services')} style={navBtn}>Services</button>
            <button onClick={() => scrollTo('cities')} style={navBtn}>Cities</button>
            <button onClick={() => scrollTo('fleet')} style={navBtn}>Fleet</button>
            <button onClick={() => scrollTo('about')} style={navBtn}>About</button>
          </>
        )}
        {!isHome && (
          <>
            <Link to="/" style={navLink}>Home</Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
    </nav>
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
