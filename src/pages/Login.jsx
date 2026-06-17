import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError(''); }

  async function handleSubmit() {
    setLoading(true); setError('');
    try {
      let data;
      if (tab === 'login') {
        data = await apiLogin({ email: form.email, password: form.password });
      } else {
        if (form.password !== form.confirm) { setError('Passwords do not match.'); setLoading(false); return; }
        data = await apiRegister({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
      }
      login(data);
      if (data.role === 'Admin') navigate('/dashboard/admin');
      else if (data.role === 'Agent') navigate('/dashboard/agent');
      else navigate('/dashboard/customer');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel */}
      <div style={{
        width: '40%', background: '#111', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 50px', position: 'relative',
      }}>
        <Link to="/" style={{ position: 'absolute', top: 30, left: 30, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, background: '#e85d24', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚗</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>ROADREADY</span>
        </Link>
        <p style={{ color: '#e85d24', fontSize: 11, fontWeight: 600, letterSpacing: 2, marginBottom: 20 }}>YOUR JOURNEY STARTS HERE</p>
        <h2 style={{ color: '#fff', fontSize: 48, fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', margin: '0 0 24px' }}>
          DRIVE WITH<br />CONFIDENCE.
        </h2>
        <p style={{ color: '#777', lineHeight: 1.7, marginBottom: 48 }}>
          Book in seconds, pick up at 50+ locations across 4 US cities. Hourly or daily — your call.
        </p>
        <div style={{ display: 'flex', gap: 32 }}>
          {[['500+', 'Cars'], ['4', 'Cities'], ['$6/hr', 'From'], ['4.9★', 'Rating']].map(([v, l]) => (
            <div key={l}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>{v}</p>
              <p style={{ color: '#555', fontSize: 11, margin: 0 }}>{l}</p>
            </div>
          ))}
        </div>
        <p style={{ color: '#333', fontSize: 12, position: 'absolute', bottom: 24, left: 50 }}>© 2026 RoadReady. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: '#f8f7f4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ background: '#111', borderRadius: 10, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, background: '#e85d24', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🚗</div>
              <span style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, fontSize: 13 }}>ROADREADY</span>
            </div>
          </div>

          <Link to="/" style={{ color: '#888', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 24 }}>← Back to Home</Link>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid #e8e8e8', marginBottom: 32 }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); setForm({}); }}
                style={{
                  flex: 1, padding: '10px', background: 'none', border: 'none',
                  borderBottom: tab === t ? '2px solid #e85d24' : '2px solid transparent',
                  marginBottom: -2, color: tab === t ? '#e85d24' : '#888',
                  fontWeight: tab === t ? 600 : 400, fontSize: 15, cursor: 'pointer', textTransform: 'capitalize',
                }}
              >{t}</button>
            ))}
          </div>

          {tab === 'login' ? (
            <>
              <h3 style={{ fontWeight: 900, fontSize: 26, textTransform: 'uppercase', margin: '0 0 4px' }}>WELCOME BACK</h3>
              <p style={{ color: '#888', fontSize: 14, margin: '0 0 28px' }}>Sign in to continue your journey.</p>
              <label style={labelStyle}>Email address</label>
              <input value={form.email || ''} onChange={e => set('email', e.target.value)}
                placeholder="you@example.com" type="email" style={inputStyle} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <label style={labelStyle}>Password</label>
                <Link to="/forgot-password" style={{ color: '#e85d24', fontSize: 12, textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input value={form.password || ''} onChange={e => set('password', e.target.value)}
                  placeholder="••••••••" type={showPw ? 'text' : 'password'} style={inputStyle} />
                <button onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16 }}>{showPw ? '🙈' : '👁'}</button>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ fontWeight: 900, fontSize: 26, textTransform: 'uppercase', margin: '0 0 4px' }}>CREATE ACCOUNT</h3>
              <p style={{ color: '#888', fontSize: 14, margin: '0 0 28px' }}>Join thousands of drivers getting road-ready.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>First name</label>
                  <input value={form.firstName || ''} onChange={e => set('firstName', e.target.value)} placeholder="Alex" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input value={form.lastName || ''} onChange={e => set('lastName', e.target.value)} placeholder="Rivera" style={inputStyle} />
                </div>
              </div>
              <label style={{ ...labelStyle, marginTop: 12 }}>Phone number</label>
              <input value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" style={inputStyle} />
              <label style={{ ...labelStyle, marginTop: 12 }}>Email address</label>
              <input value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="you@example.com" type="email" style={inputStyle} />
              <label style={{ ...labelStyle, marginTop: 12 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input value={form.password || ''} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" type={showPw ? 'text' : 'password'} style={inputStyle} />
                <button onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16 }}>{showPw ? '🙈' : '👁'}</button>
              </div>
              <label style={{ ...labelStyle, marginTop: 12 }}>Confirm password</label>
              <input value={form.confirm || ''} onChange={e => set('confirm', e.target.value)} placeholder="Re-enter your password" type="password" style={inputStyle} />
            </>
          )}

          {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 10 }}>{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', marginTop: 24, padding: '13px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Register'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, color: '#888', fontSize: 13 }}>
            {tab === 'login' ? <>Don't have an account? <span style={{ color: '#e85d24', cursor: 'pointer', fontWeight: 600 }} onClick={() => setTab('register')}>Register</span></> : <>Already registered? <span style={{ color: '#e85d24', cursor: 'pointer', fontWeight: 600 }} onClick={() => setTab('login')}>Login</span></>}
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fff' };
