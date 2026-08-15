import { Link } from 'react-router-dom';
import { Eye, Move, Layers, Bookmark, Save, ChevronRight, Heart } from 'lucide-react';
import { getFeatured } from '../data/mockProducts';

// ─── Static data ──────────────────────────────────────────────────────────────
const STATS = [
  { value: '2,400+', label: 'Furniture pieces' },
  { value: '94%',   label: 'Happy customers' },
  { value: '48h',   label: 'AR sessions daily' },
];

const FEATURES = [
  {
    icon: <Eye size={24} />,
    title: 'View in AR',
    desc: 'See furniture at true scale inside your room before purchasing.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
    title: 'Realistic 3D Furniture',
    desc: 'High-fidelity models that show texture, material, and light response.',
  },
  {
    icon: <Move size={24} />,
    title: 'Move & Resize',
    desc: 'Drag, rotate, and scale any piece to find the perfect placement.',
  },
  {
    icon: <Layers size={24} />,
    title: 'Explore Furniture',
    desc: 'Browse 2,400+ pieces from independent designers and premium brands.',
  },
  {
    icon: <Save size={24} />,
    title: 'Save Your Designs',
    desc: 'Save multiple room configurations and revisit or share them anytime.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    title: 'Design Your Space',
    desc: 'Layer furniture, lighting, and decor to create a complete room story.',
  },
];

const PROCESS = [
  { num: '01', title: 'Choose Furniture', desc: 'Browse our curated collection' },
  { num: '02', title: 'Open AR', desc: 'Launch AR mode on your device' },
  { num: '03', title: 'Place It In Your Room', desc: 'See it in your real space' },
  { num: '04', title: 'Create Your Space', desc: 'Save and share your design' },
];

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const featured = getFeatured(6);

  return (
    <div style={{ paddingTop: 80 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0 4rem', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '45% 55%', 
            gap: '3rem', 
            alignItems: 'center',
          }} className="hero-grid">

            {/* Left: copy */}
            <div className="fade-in">
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                marginBottom: '2rem',
              }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: 'var(--accent)',
                }} />
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase',
                  color: 'var(--text-2)',
                }}>
                  Augmented Reality Design
                </span>
              </div>

              <h1 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                fontWeight: 600, 
                lineHeight: 1.1, 
                marginBottom: '1.5rem', 
                color: 'var(--text)',
              }}>
                Design Your Space Before You Buy.
              </h1>
              <p style={{ 
                fontSize: '1.05rem', 
                color: 'var(--text-2)', 
                lineHeight: 1.7, 
                marginBottom: '2.5rem', 
                maxWidth: 480,
              }}>
                Visualize furniture in your real environment with augmented reality and create a room that feels truly yours.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                <Link to="/ar/p004" className="btn btn-primary btn-lg">
                  Start Designing
                </Link>
                <Link to="/catalogue" className="btn btn-outline btn-lg">
                  Explore Furniture
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                {STATS.map(s => (
                  <div key={s.label}>
                    <div style={{ 
                      fontFamily: "'Playfair Display', serif", 
                      fontSize: '2rem', 
                      fontWeight: 600, 
                      color: 'var(--text)',
                      marginBottom: '0.25rem',
                    }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 500 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: hero visual */}
            <div style={{ position: 'relative' }} className="hero-visual">
              <div style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                background: 'var(--surface)',
              }}>
                {/* Actual room photo */}
                <img 
                  src="/default_room.png" 
                  alt="Modern living room with AR furniture placement"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  onError={(e) => {
                    // Fallback to SVG if image not found
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                {/* SVG fallback */}
                <svg viewBox="0 0 800 600" style={{ width: '100%', height: 'auto', display: 'none' }} fill="none">
                  <rect width="800" height="600" fill="#FAFAF9"/>
                  <rect x="0" y="0" width="200" height="400" fill="#E8E4DF"/>
                  <rect x="600" y="0" width="200" height="400" fill="#E0DBD4"/>
                  <rect x="200" y="0" width="400" height="400" fill="#F0EDE8"/>
                  <polygon points="0,600 200,400 600,400 800,600" fill="#D8D2C8"/>
                  <rect x="280" y="60" width="240" height="160" rx="8" fill="#C5D9E0" opacity="0.7"/>
                  <line x1="400" y1="60" x2="400" y2="220" stroke="#A8B8BE" strokeWidth="3"/>
                  <line x1="280" y1="140" x2="520" y2="140" stroke="#A8B8BE" strokeWidth="3"/>
                  <rect x="240" y="420" width="320" height="100" rx="16" fill="#9B8B7E"/>
                  <rect x="240" y="400" width="320" height="40" rx="12" fill="#8A7A6E"/>
                  <rect x="320" y="500" width="160" height="60" rx="8" fill="#C4A57B" opacity="0.6"/>
                </svg>

                {/* AR badge overlay */}
                <div style={{
                  position: 'absolute', 
                  top: 24, 
                  right: 24,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '0.875rem 1.25rem',
                  boxShadow: 'var(--shadow)',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-3)', marginBottom: '0.25rem' }}>
                    Starting from
                  </div>
                  <div style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: '1.5rem', 
                    fontWeight: 600, 
                    color: 'var(--text)',
                  }}>
                    $420
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section style={{ 
        padding: '3rem 0', 
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem',
          }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: '2.25rem', 
                  fontWeight: 600, 
                  color: 'var(--text)',
                  marginBottom: '0.4rem',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-3)', fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY AR INTERIOR ───────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div className="section-label">Why AR Interior</div>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}>
              Design with confidence.
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2rem',
            marginTop: '3.5rem',
          }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 2rem',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text)',
                  marginBottom: '1.5rem',
                }}>
                  {icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  marginBottom: '0.75rem',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label">Process</div>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              fontWeight: 600,
            }}>
              Four steps to your perfect room.
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '2rem',
          }}>
            {PROCESS.map(({ num, title, desc }) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: 'var(--text-3)', 
                  marginBottom: '1rem',
                  letterSpacing: '0.1em',
                }}>
                  {num}
                </div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  marginBottom: '0.5rem',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED FURNITURE ────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', 
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}>
                Find pieces that fit your space.
              </h2>
            </div>
            <Link to="/catalogue" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontSize: '0.9rem', 
              fontWeight: 500, 
              color: 'var(--text)',
            }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {['All', 'Chairs', 'Sofas', 'Tables', 'Beds', 'Lamps', 'Decor'].map((cat, i) => (
              <button key={cat} className={i === 0 ? 'chip chip-active' : 'chip'}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2rem',
          }}>
            {featured.map(p => (
              <ProductCardHome key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section style={{ overflow: 'hidden' }}>
        <div style={{ 
          borderRadius: '32px',
          overflow: 'hidden',
          margin: '0 2rem 4rem',
          maxWidth: 1280,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            minHeight: 480,
          }} className="cta-grid">
            {/* Left: dark panel */}
            <div style={{ 
              background: 'var(--accent)', 
              color: '#fff',
              padding: '4rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <h2 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
                fontWeight: 600,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}>
                See It.<br />
                Place It.<br />
                Love It.
              </h2>
              <p style={{ 
                fontSize: '1rem', 
                color: 'rgba(255,255,255,0.7)', 
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: 400,
              }}>
                Bring your room to life before making a purchase.
              </p>
              <div>
                <Link to="/ar/p004" className="btn btn-tan btn-lg">
                  Start Designing
                </Link>
              </div>
            </div>

            {/* Right: room photo */}
            <div style={{ 
              background: '#6B6B6B',
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              {/* Room photo would go here */}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { 
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { order: -1; }
          .cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

// ─── Product Card (Home page variant) ────────────────────────────────────────
const ProductCardHome = ({ product }) => {
  const { id, name, category, price, rating, thumbnailUrl } = product;

  return (
    <div style={{ 
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg)', overflow: 'hidden' }}>
        <img
          src={thumbnailUrl || svgPlaceholder(name)}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <Heart size={16} style={{ color: 'var(--text-3)' }} />
        </button>
        <span className="badge" style={{ position: 'absolute', top: 12, left: 12 }}>
          {category}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {name}
          </h3>
          <div style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '1.1rem', 
            fontWeight: 600,
            whiteSpace: 'nowrap',
            marginLeft: '1rem',
          }}>
            ${price.toLocaleString()}
          </div>
        </div>

        {rating && (
          <div className="rating-stars" style={{ marginBottom: '1rem' }}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#F59E0B' : 'none'} stroke={i <= Math.round(rating) ? '#F59E0B' : '#E5E5E5'} strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)', marginLeft: '0.375rem' }}>
              {rating}
            </span>
          </div>
        )}

        <Link to={`/ar/${id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
          <Eye size={14} /> View in AR
        </Link>
      </div>
    </div>
  );
};

const svgPlaceholder = (name) => {
  const s = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <rect width='100%' height='100%' fill='#FAFAF9'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        fill='#9B9B9B' font-size='20' font-weight='500' font-family='DM Sans, sans-serif'>${name}</text>
    </svg>`);
  return `data:image/svg+xml;utf8,${s}`;
};

export default Home;
