import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PERKS = [
  'Save unlimited AR placements',
  'Compare designs side by side',
  'Access your designs from any device',
];

const Signup = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const userData = { id: 'mock-user-' + Date.now(), name: form.name, email: form.email, role: 'user', joinedAt: new Date().toISOString() };
    login(userData);
    setLoading(false);
    navigate('/catalogue');
  };

  return (
    <div style={{
      paddingTop: 68, minHeight: '100vh',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      background: 'linear-gradient(150deg, #F7F4EF 0%, #EDE8DF 100%)',
    }} className="signup-page">

      {/* Left: form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.4rem' }}>
              Create account
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Start visualizing furniture in your space
            </p>

            {error && <div className="error-box" style={{ marginBottom: '1.25rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.4rem' }}>Full Name</label>
                <input className="input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Arjun Sharma" required autoComplete="name" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.4rem' }}>Email address</label>
                <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required autoComplete="email" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.4rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    required
                    autoComplete="new-password"
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}
                    aria-label={showPw ? 'Hide password' : 'Show password'}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  <><ArrowRight size={16} /> Create Account</>
                )}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-2)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in →</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: perks panel */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem', background: 'var(--accent)',
      }} className="signup-right">
        <div style={{ maxWidth: 380 }}>
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Free forever</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            Visualize Before<br />You Realize
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Join thousands of homeowners who use AR to make better furniture decisions before opening their wallets.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {PERKS.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <CheckCircle2 size={20} style={{ color: '#A8D5A2', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .signup-page { grid-template-columns: 1fr !important; }
          .signup-right { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Signup;
