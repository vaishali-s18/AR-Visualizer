import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bookmark, User, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/ar/p004',   label: 'Try AR' },
  { to: '/about',     label: 'About' },
];

const Navbar = () => {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState('');
  const navigate = useNavigate();

  // Add shadow when page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? 'rgba(247,244,239,0.96)' : 'rgba(247,244,239,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', height: 68, gap: '2rem' }}>

          {/* Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.1 }}>
                AR Visualizer
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Interior Design
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.5rem' }}
            className="hidden-mobile">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  padding: '0.45rem 0.9rem',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-2)',
                  background: isActive ? 'rgba(59,74,58,0.08)' : 'transparent',
                  transition: 'all 0.15s',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>

            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  autoFocus
                  className="input"
                  style={{ width: 220, height: 38, padding: '0 0.875rem' }}
                  placeholder="Search furniture..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{ padding: '0.4rem', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{ padding: '0.45rem', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)' }}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            )}

            {/* Saved designs */}
            <Link
              to="/designs"
              style={{ padding: '0.45rem', borderRadius: 8, color: 'var(--text-2)', display: 'flex' }}
              className="hidden-mobile"
              aria-label="Saved designs"
            >
              <Bookmark size={18} />
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.75rem', borderRadius: 8,
                border: '1.5px solid var(--border)', background: 'var(--surface)',
                color: 'var(--text-2)', fontSize: '0.82rem', fontWeight: 500,
              }}
              className="hidden-mobile"
            >
              <User size={15} />
              Account
            </Link>

            {/* Mobile hamburger */}
            <button
              className="show-mobile"
              onClick={() => setMenuOpen((o) => !o)}
              style={{ padding: '0.45rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg)', borderTop: '1px solid var(--border)',
          padding: '1rem 1.5rem 1.5rem',
        }}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'block', padding: '0.75rem 0',
                borderBottom: '1px solid var(--border)',
                fontWeight: 500, fontSize: '0.95rem',
                color: isActive ? 'var(--accent)' : 'var(--text)',
              })}
            >
              {label}
            </NavLink>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Link to="/designs" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
              <Bookmark size={15} /> Saved
            </Link>
            <Link to="/profile" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
              <User size={15} /> Account
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 700px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 701px) { .show-mobile { display: none !important; } }
      `}</style>
    </header>
  );
};

export default Navbar;
