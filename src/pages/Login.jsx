import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services';
import { useAuth } from '../context/AuthContext';

const BRAND = '#e85d24';

export default function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function set(k, v) { 
    setForm(f => ({ ...f, [k]: v }));
    setError('');
   }

  async function handleSubmit() {
    setLoading(true); setError('');
    try {

      const data = await apiLogin({ email: form.email, password: form.password });
      login(data);

      if (data.role === 'Admin') 
        navigate('/dashboard/admin');
      else if (data.role === 'Agent')
         navigate('/dashboard/agent');
      else 
        navigate('/dashboard/customer');

    } catch (e) {
      if (e.message.toLowerCase().includes('pending')) {
        setError('Your account is pending admin approval. Please wait for an administrator to activate your account.');
      }
       else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Left panel */}
      <div
        className="d-none d-md-flex flex-column justify-content-center position-relative px-5 py-5"
        style={{ width: '40%', background: '#111' }}
      >
        <Link to="/" className="position-absolute top-0 start-0 m-4 d-flex align-items-center gap-2 text-decoration-none">
          <div className="d-flex align-items-center justify-content-center rounded" style={{ width: 30, height: 30, background: BRAND }}>🚗</div>
          <span className="text-white fw-bold" style={{ fontSize: 13, letterSpacing: 1 }}>ROADREADY</span>
        </Link>

        <p className="fw-semibold mb-3" style={{ color: BRAND, fontSize: 11, letterSpacing: 2 }}>YOUR JOURNEY STARTS HERE</p>
        <h2 className="text-white fw-bold text-uppercase mb-1" style={{ fontSize: 48, lineHeight: 1.05 }}>DRIVE WITH</h2>
        <h2 className="fw-bold text-uppercase mb-4" style={{ fontSize: 48, lineHeight: 1.05, color: BRAND }}>CONFIDENCE.</h2>
        <p className="text-secondary mb-5" style={{ lineHeight: 1.7, maxWidth: 420 }}>
          Book in seconds, pick up at 50+ locations across 4 US cities. Hourly or daily — your call.
        </p>

        <div className="d-flex gap-4">
          {[['500+', 'Cars'], ['4', 'Cities'], ['₹70/hr', 'From'], ['4.9★', 'Rating']].map(([v, l]) => (
            <div key={l}>
              <p className="text-white fw-bold mb-0" style={{ fontSize: 18 }}>{v}</p>
              <p className="text-secondary mb-0" style={{ fontSize: 11 }}>{l}</p>
            </div>
          ))}
        </div>

        <p className="position-absolute bottom-0 start-0 m-4 mb-4" style={{ color: '#333', fontSize: 12 }}>
          © 2026 RoadReady. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 p-4" style={{ background: '#f8f7f4' }}>
        <div className="w-100" style={{ maxWidth: 420 }}>
          <div className="d-flex justify-content-center mb-4">
            <div className="d-flex align-items-center gap-2 rounded px-3 py-2" style={{ background: '#111' }}>
              <div className="d-flex align-items-center justify-content-center rounded" style={{ width: 24, height: 24, background: BRAND, fontSize: 13 }}>🚗</div>
              <span className="text-white fw-bold" style={{ letterSpacing: 1, fontSize: 13 }}>ROADREADY</span>
            </div>
          </div>

          <Link to="/" className="d-block text-secondary text-decoration-none mb-4" style={{ fontSize: 13 }}>← Back to Home</Link>

          <h3 className="fw-bold text-uppercase mb-1" style={{ fontSize: 26 }}>WELCOME BACK</h3>
          <p className="text-secondary mb-4" style={{ fontSize: 14 }}>Sign in to continue your journey.</p>

          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Email address</label>
          <input
            value={form.email || ''}
            onChange={e => set('email', e.target.value)}
            placeholder="you@example.com"
            type="email"
            className="form-control mb-3"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />

          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label fw-medium mb-0" style={{ fontSize: 13 }}>Password</label>
            <Link to="/forgot-password" className="text-decoration-none" style={{ color: BRAND, fontSize: 12 }}>Forgot password?</Link>
          </div>
          <div className="position-relative mb-1">
            <input
              value={form.password || ''}
              onChange={e => set('password', e.target.value)}
              placeholder="••••••••"
              type={showPw ? 'text' : 'password'}
              className="form-control"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button
              onClick={() => setShowPw(v => !v)}
              className="btn btn-link position-absolute top-50 end-0 translate-middle-y p-0 me-3 text-secondary"
              style={{ fontSize: 16, textDecoration: 'none' }}
              type="button"
            >
              {showPw ? '🙈' : '👁'}
            </button>
          </div>

          {error && (
            <div className="alert mt-3 py-2 px-3 mb-0" style={{ background: '#fef2f2', color: '#dc2626', fontSize: 13, border: 'none' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn w-100 fw-bold text-white mt-4 py-2"
            style={{ background: BRAND, fontSize: 15, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <p className="text-center text-secondary mt-3 mb-0" style={{ fontSize: 13 }}>
            Don't have an account?{' '}
            <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: BRAND }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}