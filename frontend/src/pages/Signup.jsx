import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle2, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';

const PERKS = [
  'Save unlimited 3D room configurations',
  'Compare models & textures side-by-side',
  'One-tap WebXR AR projection on mobile',
  'Curated designer furniture catalogue',
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
    try {
      const userData = await authApi.signup({ name: form.name, email: form.email, password: form.password });
      login(userData);
      navigate('/catalogue');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      paddingTop: 80, 
      minHeight: '100vh',
      display: 'grid', 
      gridTemplateColumns: '48% 52%',
      background: 'var(--bg)',
    }} className="signup-split-page">

      {/* Left: Luxury Dark Brand Panel */}
      <div style={{
        background: 'linear-gradient(145deg, #120e0a 0%, #24190f 50%, #140f0a 100%)',
        color: '#ffffff',
        padding: '4.5rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }} className="signup-left-panel">

        {/* Golden radial background glow */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '10%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,165,123,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        {/* Decorative dot grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(196,165,123,0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }} />

        {/* Brand Header */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #2b2115 0%, #4a3622 100%)',
            border: '1px solid rgba(196,165,123,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A57B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: '1.4rem',
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}>
            AR Interior
          </span>
        </div>

        {/* Main Pitch */}
        <div style={{ position: 'relative', zIndex: 1, margin: '3rem 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            borderRadius: 999,
            background: 'rgba(196,165,123,0.12)',
            border: '1px solid rgba(196,165,123,0.3)',
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={13} style={{ color: '#C4A57B' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C4A57B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Free Account Forever
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 600,
            lineHeight: 1.15,
            color: '#ffffff',
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}>
            Visualize Before<br />
            <span style={{ color: '#C4A57B' }}>You Purchase.</span>
          </h2>

          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.68)',
            lineHeight: 1.7,
            maxWidth: 420,
            marginBottom: '2.5rem',
          }}>
            Join thousands of homeowners and interior designers visualizing realistic 3D furniture in real spaces with zero guesswork.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {PERKS.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <CheckCircle2 size={18} style={{ color: '#C4A57B', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} style={{ color: '#C4A57B' }} />
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
            No credit card required · Free WebXR on all modern browsers
          </p>
        </div>
      </div>

      {/* Right: Signup Form */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2.5rem',
        background: 'var(--surface)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ marginBottom: '2.25rem' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}>
              Create Your Account
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: '0.92rem' }}>
              Start designing and placing furniture in AR within seconds.
            </p>
          </div>

          {error && <div className="error-box" style={{ marginBottom: '1.5rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.45rem' }}>
                Full Name
              </label>
              <input
                className="input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.45rem' }}>
                Email Address
              </label>
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@domain.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.45rem' }}>
                Password
              </label>
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
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-3)',
                    display: 'flex',
                  }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/>
                  </svg>
                  Creating account…
                </span>
              ) : (
                <>Create Free Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-2)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 860px) {
          .signup-split-page { grid-template-columns: 1fr !important; }
          .signup-left-panel { display: none !important; }
        }
      ` }} />
    </div>
  );
};

export default Signup;
