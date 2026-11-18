import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/catalogue', label: 'Explore Furniture' },
  { to: '/designs',   label: 'My Designs' },
  { to: '/favourites',label: 'Favourites' },
  { to: '/pricing',   label: 'Pricing' },
  { to: '/about',     label: 'About' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { totalCount, openCart } = useCart();

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
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(245,243,240,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', height: 80, gap: '2.5rem' }}>

          {/* Brand */}
          <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '9px',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C4A57B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: '1.45rem',
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}>
              AR Interior
            </h1>
          </Link>

          {/* Desktop nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}
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
                  paddingBottom: '2px',
                  borderBottom: isActive ? '2px solid var(--tan)' : '2px solid transparent',
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

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              style={{
                position: 'relative',
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: '50%',
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text)',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--tan)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="View Cart & Delivery"
            >
              <ShoppingCart size={18} />
              {totalCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--tan)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: 19,
                  height: 19,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(196,165,123,0.4)',
                }}>
                  {totalCount}
                </span>
              )}
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Link to="/profile" style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  color: 'var(--text-2)',
                  textTransform: 'capitalize'
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; }}
                >
                  Hello, {user.name}
                </Link>
                <button 
                  onClick={logout} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#ef4444',
                    padding: 0
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
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
            )}

            <Link to="/ar/p004" className="btn btn-primary btn-sm">
              Start Designing
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }} className="show-mobile">
            {/* Mobile Cart Button */}
            <button
              onClick={openCart}
              style={{
                position: 'relative',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text)',
              }}
            >
              <ShoppingCart size={17} />
              {totalCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  background: 'var(--tan)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ 
                padding: '0.5rem', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--text)',
              }}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

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
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexDirection: 'column' }}>
            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline" style={{ textAlign: 'center' }} onClick={() => setMenuOpen(false)}>
                  My Profile ({user.name})
                </Link>
                <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => { logout(); setMenuOpen(false); }}>
                  Log Out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-outline" style={{ textAlign: 'center' }} onClick={() => setMenuOpen(false)}>
                Log In
              </Link>
            )}
            <Link to="/ar/p004" className="btn btn-primary" style={{ textAlign: 'center' }} onClick={() => setMenuOpen(false)}>
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
