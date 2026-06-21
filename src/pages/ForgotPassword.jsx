import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOtp, resetPassword } from '../services';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new pw
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function sendOtp() {
    setLoading(true); setError('');
    try {
      const r = await forgotPassword({ email });
      setMsg(r.message); setStep(2);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function verify() {
    setLoading(true);
    setError('');
    try {
      await verifyOtp({ email, otp });
      setStep(3);
    }
     catch (e) { 
      setError(e.message);
     }
    finally { setLoading(false); }
  }

  async function reset() {
    setLoading(true);
    setError('');
    try {
      await resetPassword({ email, otp, newPassword: newPw, confirmPassword: confirm });
      setMsg('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 48, width: 420, boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ background: '#111', borderRadius: 10, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, background: '#e85d24', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚗</div>
            <span style={{ color: '#fff', fontWeight: 700, letterSpacing: 1, fontSize: 13 }}>ROADREADY</span>
          </div>
        </div>
        <Link to="/login" style={{ color: '#888', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 28 }}>← Back to login</Link>

        <h3 style={{ fontWeight: 900, fontSize: 24, margin: '0 0 8px' }}>
          {step === 1 ? 'FORGOT PASSWORD' : step === 2 ? 'ENTER OTP' : 'NEW PASSWORD'}
        </h3>
        <p style={{ color: '#888', fontSize: 13, margin: '0 0 28px' }}>
          {step === 1 ? "We'll send a 6-digit OTP to your email." : step === 2 ? `Code sent to ${email}` : 'Choose a strong new password.'}
        </p>

        {step === 1 && (
          <>
            <label style={lbl}>Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" style={inp} />
            <button onClick={sendOtp} disabled={loading} style={btn}>{loading ? 'Sending...' : 'Send OTP'}</button>
          </>
        )}
        {step === 2 && (
          <>
            <label style={lbl}>OTP Code</label>
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code" style={{ ...inp, letterSpacing: 8, fontSize: 20, textAlign: 'center' }} />
            <button onClick={verify} disabled={loading} style={btn}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginTop: 16 }}>
              Didn't get it? <span onClick={sendOtp} style={{ color: '#e85d24', cursor: 'pointer' }}>Resend</span>
            </p>
          </>
        )}
        {step === 3 && (
          <>
            <label style={lbl}>New password</label>
            <input value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" type="password" style={inp} />
            <label style={{ ...lbl, marginTop: 12 }}>Confirm password</label>
            <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" type="password" style={inp} />
            <button onClick={reset} disabled={loading} style={btn}>{loading ? 'Resetting...' : 'Reset Password'}</button>
          </>
        )}

        {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 12 }}>{error}</p>}
        {msg && <p style={{ color: '#16a34a', fontSize: 13, marginTop: 12 }}>{msg}</p>}
      </div>
    </div>
  );
}

const lbl = { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 6 };
const inp = { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const btn = { width: '100%', marginTop: 20, padding: '13px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' };
