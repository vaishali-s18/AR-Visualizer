import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/catalogue', label: 'Explore Furniture' },
  { to: '/designs',   label: 'My Designs' },
  { to: '/about',     label: 'About' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(245,243,240,0.95)' : 'rgba(245,243,240,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', height: 80, gap: '3rem' }}>

          {/* Brand */}
          <Link to="/" style={{ flexShrink: 0 }}>
            <h1 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontWeight: 600, 
              fontSize: '1.5rem', 
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}>
              AR Interior
            </h1>
          </Link>

          {/* Desktop nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flex: 1 }}
            className="hidden-mobile">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text)' : 'var(--text-2)',
                  transition: 'color 0.2s',
                  position: 'relative',
                })}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { 
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.color = 'var(--text-2)'; 
                  }
                }}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
            className="hidden-mobile">
            <Link to="/login" style={{ 
              fontSize: '0.9rem', 
              fontWeight: 500, 
              color: 'var(--text-2)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; }}
            >
              Log In
            </Link>
            <Link to="/ar/p004" className="btn btn-primary btn-sm">
              Start Designing
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(o => !o)}
            style={{ 
              padding: '0.5rem', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text)',
              marginLeft: 'auto',
            }}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--surface)', 
          borderTop: '1px solid var(--border)',
          padding: '1.5rem',
        }}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'block', 
                padding: '0.875rem 0',
                borderBottom: '1px solid var(--border)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem',
                color: isActive ? 'var(--text)' : 'var(--text-2)',
              })}
            >
              {label}
            </NavLink>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Link to="/login" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
              Log In
            </Link>
            <Link to="/ar/p004" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
              Start Designing
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 901px) { .show-mobile { display: none !important; } }
      `}</style>
    </header>
  );
};

export default Navbar;
