import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../api/api';
import { useAuth } from '../context/AuthContext';

const BRAND = '#e85d24';

export default function LoginRegister() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [pendingMsg, setPendingMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [roleId, setRoleId] = useState(2); // default Customer
  const { login } = useAuth();
  const navigate = useNavigate();

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError(''); setPendingMsg(''); }

  async function handleSubmit() {
    setLoading(true); setError(''); setPendingMsg('');
    try {
      let data;
      if (tab === 'login') {
        data = await apiLogin({ email: form.email, password: form.password });
        login(data);
        if (data.role === 'Admin') navigate('/dashboard/admin');
        else if (data.role === 'Agent') navigate('/dashboard/agent');
        else navigate('/dashboard/customer');
      } else {
        if (!form.firstName?.trim()) { setError('First name is required.'); setLoading(false); return; }
        if (!form.email?.trim()) { setError('Email is required.'); setLoading(false); return; }
        if (!form.password || form.password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return; }
        if (form.password !== form.confirm) { setError('Passwords do not match.'); setLoading(false); return; }

        data = await apiRegister({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          roleId,
        });

        // Handle pending approval (202) — data.pendingApproval will be true
        if (data.pendingApproval) {
          setPendingMsg(`Your ${data.role} account has been created and is awaiting admin approval. You'll receive an email once approved.`);
          setForm({});
          setLoading(false);
          return;
        }

        // Auto-approved (Customer)
        login(data);
        navigate('/dashboard/customer');
      }
    } catch (e) {
      // "pending approval" can also come as a 401 on login
      if (e.message.toLowerCase().includes('pending')) {
        setError('Your account is pending admin approval. Please wait for an administrator to activate your account.');
      } else {
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
        <Link
          to="/"
          className="position-absolute top-0 start-0 m-4 d-flex align-items-center gap-2 text-decoration-none"
        >
          <div
            className="d-flex align-items-center justify-content-center rounded"
            style={{ width: 30, height: 30, background: BRAND }}
          >
            🚗
          </div>
          <span className="text-white fw-bold" style={{ fontSize: 13, letterSpacing: 1 }}>
            ROADREADY
          </span>
        </Link>

        <p className="fw-semibold mb-3" style={{ color: BRAND, fontSize: 11, letterSpacing: 2 }}>
          YOUR JOURNEY STARTS HERE
        </p>

        <h2
          className="text-white fw-bold text-uppercase mb-1"
          style={{ fontSize: 48, lineHeight: 1.05 }}
        >
          DRIVE WITH
        </h2>
        <h2
          className="fw-bold text-uppercase mb-4"
          style={{ fontSize: 48, lineHeight: 1.05, color: BRAND }}
        >
          CONFIDENCE.
        </h2>

        <p className="text-secondary mb-5" style={{ lineHeight: 1.7, maxWidth: 420 }}>
          Book in seconds, pick up at 50+ locations across 4 US cities. Hourly or daily — your call.
        </p>

        <div className="d-flex gap-4">
          {[['500+', 'Cars'], ['4', 'Cities'], ['$6/hr', 'From'], ['4.9★', 'Rating']].map(([v, l]) => (
            <div key={l}>
              <p className="text-white fw-bold mb-0" style={{ fontSize: 18 }}>{v}</p>
              <p className="text-secondary mb-0" style={{ fontSize: 11 }}>{l}</p>
            </div>
          ))}
        </div>

        <p
          className="position-absolute bottom-0 start-0 m-4 mb-4"
          style={{ color: '#333', fontSize: 12 }}
        >
          © 2026 RoadReady. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div
        className="d-flex flex-column align-items-center justify-content-center flex-grow-1 p-4"
        style={{ background: '#f8f7f4' }}
      >
        <div className="w-100" style={{ maxWidth: 420 }}>
          <div className="d-flex justify-content-center mb-4">
            <div
              className="d-flex align-items-center gap-2 rounded px-3 py-2"
              style={{ background: '#111' }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded"
                style={{ width: 24, height: 24, background: BRAND, fontSize: 13 }}
              >
                🚗
              </div>
              <span className="text-white fw-bold" style={{ letterSpacing: 1, fontSize: 13 }}>
                ROADREADY
              </span>
            </div>
          </div>

          <Link to="/" className="d-block text-secondary text-decoration-none mb-4" style={{ fontSize: 13 }}>
            ← Back to Home
          </Link>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4 border-bottom" style={{ borderColor: '#e8e8e8' }}>
            {['login', 'register'].map(t => (
              <li className="nav-item flex-fill text-center" key={t}>
                <button
                  onClick={() => { setTab(t); setError(''); setPendingMsg(''); setForm({}); }}
                  className="nav-link w-100 text-capitalize border-0 bg-transparent"
                  style={{
                    fontSize: 15,
                    fontWeight: tab === t ? 600 : 400,
                    color: tab === t ? BRAND : '#888',
                    borderBottom: tab === t ? `2px solid ${BRAND}` : '2px solid transparent',
                    marginBottom: -2,
                  }}
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>

          {/* Pending approval success message */}
          {pendingMsg && (
            <div
              className="rounded p-3 mb-4"
              style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}
            >
              <p className="mb-0" style={{ color: '#92400e', fontSize: 13, lineHeight: 1.6 }}>
                ⏳ {pendingMsg}
              </p>
              <button
                onClick={() => { setTab('login'); setPendingMsg(''); }}
                className="btn btn-link p-0 mt-2 fw-semibold text-decoration-none"
                style={{ color: BRAND, fontSize: 13 }}
              >
                ← Back to Login
              </button>
            </div>
          )}

          {!pendingMsg && tab === 'login' && (
            <>
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
                <Link to="/forgot-password" className="text-decoration-none" style={{ color: BRAND, fontSize: 12 }}>
                  Forgot password?
                </Link>
              </div>
              <div className="position-relative">
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
            </>
          )}

          {!pendingMsg && tab === 'register' && (
            <>
              <h3 className="fw-bold text-uppercase mb-1" style={{ fontSize: 26 }}>CREATE ACCOUNT</h3>
              <p className="text-secondary mb-4" style={{ fontSize: 14 }}>Join thousands of drivers getting road-ready.</p>

              {/* Role selector */}
              <label className="form-label fw-medium" style={{ fontSize: 13 }}>Account type</label>
              <div className="d-flex gap-2 mb-3">
                {[
                  { id: 2, label: '👤 Customer', desc: 'Book cars' },
                  { id: 3, label: '🔧 Agent', desc: 'Manage fleet' },
                  { id: 1, label: '👨‍💼 Admin', desc: 'Admin Access' },
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoleId(r.id)}
                    className="btn flex-fill text-start p-2"
                    style={{
                      border: `2px solid ${roleId === r.id ? BRAND : '#e0e0e0'}`,
                      background: roleId === r.id ? '#fef3ee' : '#fff',
                      color: roleId === r.id ? BRAND : '#555',
                      fontWeight: roleId === r.id ? 600 : 400,
                      fontSize: 13,
                    }}
                  >
                    <div>{r.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{r.desc}</div>
                  </button>
                ))}
              </div>

              {roleId === 3 && (
                <div
                  className="rounded px-3 py-2 mb-3"
                  style={{ background: '#fffbeb', border: '1px solid #fcd34d', fontSize: 12, color: '#92400e' }}
                >
                  ⚠ Agent accounts require admin approval before you can log in.
                </div>
              )}

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label fw-medium" style={{ fontSize: 13 }}>First name *</label>
                  <input
                    value={form.firstName || ''}
                    onChange={e => set('firstName', e.target.value)}
                    placeholder="Alex"
                    className="form-control"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-medium" style={{ fontSize: 13 }}>Last name</label>
                  <input
                    value={form.lastName || ''}
                    onChange={e => set('lastName', e.target.value)}
                    placeholder="Rivera"
                    className="form-control"
                  />
                </div>
              </div>

              <label className="form-label fw-medium mt-3" style={{ fontSize: 13 }}>Phone number</label>
              <input
                value={form.phone || ''}
                onChange={e => set('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="form-control"
              />

              <label className="form-label fw-medium mt-3" style={{ fontSize: 13 }}>Email address *</label>
              <input
                value={form.email || ''}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                type="email"
                className="form-control"
              />

              <label className="form-label fw-medium mt-3" style={{ fontSize: 13 }}>Password * (min. 8 characters)</label>
              <div className="position-relative">
                <input
                  value={form.password || ''}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  type={showPw ? 'text' : 'password'}
                  className="form-control"
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

              <label className="form-label fw-medium mt-3" style={{ fontSize: 13 }}>Confirm password *</label>
              <input
                value={form.confirm || ''}
                onChange={e => set('confirm', e.target.value)}
                placeholder="Re-enter your password"
                type="password"
                className="form-control"
              />
            </>
          )}

          {error && (
            <div className="alert mt-3 py-2 px-3 mb-0" style={{ background: '#fef2f2', color: '#dc2626', fontSize: 13, border: 'none' }}>
              {error}
            </div>
          )}

          {!pendingMsg && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn w-100 fw-bold text-white mt-4 py-2"
              style={{ background: BRAND, fontSize: 15, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
            </button>
          )}

          {!pendingMsg && (
            <p className="text-center text-secondary mt-3 mb-0" style={{ fontSize: 13 }}>
              {tab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <span
                    onClick={() => setTab('register')}
                    className="fw-semibold"
                    style={{ color: BRAND, cursor: 'pointer' }}
                  >
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <span
                    onClick={() => setTab('login')}
                    className="fw-semibold"
                    style={{ color: BRAND, cursor: 'pointer' }}
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}