import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Bookmark, LogOut, Edit2, Camera, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise(r => setTimeout(r, 400));
    logout();
    navigate('/');
  };

  // Saved design count from localStorage
  const savedCount = (() => {
    try { return JSON.parse(localStorage.getItem('ar_saved_designs') || '[]').length; }
    catch { return 0; }
  })();

  const joinDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Recently';

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header band */}
      <div style={{ background: 'var(--accent)', padding: '3.5rem 0 6rem' }}>
        <div className="container">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Account</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#fff' }}>My Profile</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '0 1.5rem 4rem', marginTop: '-4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}
          className="profile-grid">

          {/* Left: avatar card */}
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>

            {/* Avatar */}
            <div style={{ padding: '2.5rem 2rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#fff',
                }}>
                  {initials}
                </div>
                <button style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--gold)', border: '2px solid var(--surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <Camera size={12} style={{ color: '#fff' }} />
                </button>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.3rem' }}>{user?.name}</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>{user?.email}</p>
              <span className="badge badge-green" style={{ marginTop: '0.75rem' }}>
                {user?.role === 'admin' ? 'Administrator' : 'Member'}
              </span>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '1.25rem' }}>
              <div style={{ textAlign: 'center', padding: '0.75rem' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>{savedCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>Saved Designs</div>
              </div>
              <div style={{ textAlign: 'center', padding: '0.75rem', borderLeft: '1px solid var(--border)' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>AR</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>Ready</div>
              </div>
            </div>

            {/* Logout */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.75rem', borderRadius: 12, cursor: 'pointer',
                  background: 'rgba(220,38,38,0.07)', border: '1.5px solid rgba(220,38,38,0.2)',
                  color: '#dc2626', fontWeight: 600, fontSize: '0.875rem',
                  transition: 'all 0.15s',
                }}
              >
                <LogOut size={16} /> {loggingOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>
          </div>

          {/* Right: details + actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Account details */}
            <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>Account Details</h3>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>
                  <Edit2 size={13} /> Edit
                </button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                {[
                  { Icon: User,     label: 'Full Name',   val: user?.name },
                  { Icon: Mail,     label: 'Email',       val: user?.email },
                  { Icon: Shield,   label: 'Role',        val: user?.role === 'admin' ? 'Administrator' : 'Member' },
                  { Icon: Calendar, label: 'Member since', val: joinDate },
                ].map(({ Icon, label, val }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={16} style={{ color: 'var(--text-3)' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: '0.15rem' }}>{label}</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>Quick Links</h3>
              </div>
              {[
                { to: '/designs',   Icon: Bookmark, label: 'My Saved Designs',      sub: `${savedCount} saved` },
                { to: '/catalogue', Icon: User,     label: 'Browse Catalogue',       sub: '500+ furniture pieces' },
                { to: '/ar/p004',   Icon: Shield,   label: 'Try AR Visualizer',      sub: 'Place furniture in your room' },
              ].map(({ to, Icon, label, sub }) => (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(59,74,58,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.1rem' }}>{label}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-3)' }} />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default Profile;
