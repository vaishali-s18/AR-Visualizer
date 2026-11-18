import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getFeatured } from '../data/mockProducts';
import { getProducts } from '../api/products';
import FeatureCards from '../components/FeatureCards';
import ProductCard from '../components/ProductCard';

// ─── Static data ──────────────────────────────────────────────────────────────
const STATS = [
  { num: 2400, suffix: '+', label: 'Furniture pieces' },
  { num: 94,   suffix: '%', label: 'Happy customers' },
  { num: 48,   suffix: 'h', label: 'AR sessions daily' },
];

const PROCESS = [
  { num: '01', title: 'Choose Furniture', desc: 'Browse our curated collection' },
  { num: '02', title: 'Open AR',          desc: 'Launch AR mode on your device' },
  { num: '03', title: 'Place In Your Room', desc: 'See it in your real space'   },
  { num: '04', title: 'Create Your Space', desc: 'Save and share your design'   },
];

// ─── useScrollReveal ──────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── AnimatedHeading ──────────────────────────────────────────────────────────
const AnimatedHeading = ({ text, style = {} }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const lines = text.split('\n');
  let charIdx = 0;

  return (
    <h1 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 600,
      lineHeight: 1.1,
      marginBottom: '1.5rem',
      color: 'var(--text)',
      ...style,
    }}>
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {line.split('').map((char) => {
            const delay = charIdx++ * 22;
            return (
              <span
                key={delay}
                style={{
                  display: 'inline-block',
                  opacity: animated ? 1 : 0,
                  transform: animated ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 480ms ease ${delay}ms, transform 480ms ease ${delay}ms`,
                  whiteSpace: 'pre',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
};

// ─── CountUp ──────────────────────────────────────────────────────────────────
const CountUp = ({ num, suffix, duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal(0.4);

  useEffect(() => {
    if (!visible) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * num));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, num, duration]);

  const display = num >= 1000 ? count.toLocaleString() : count;
  return <span ref={ref}>{display}{suffix}</span>;
};

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [processRef, processVisible] = useScrollReveal(0.1);
  const [featuredRef, featuredVisible] = useScrollReveal(0.1);

  useEffect(() => {
    getProducts()
      .then(data => setFeatured(data.slice(0, 6)))
      .catch(() => setFeatured(getFeatured(6)));
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0 3.5rem', overflow: 'hidden', position: 'relative' }}>

        {/* Warm radial glow behind the left copy */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '55%', height: '100%',
          background: 'radial-gradient(ellipse at 20% 50%, rgba(196,165,123,0.14) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '45% 55%', gap: '3rem', alignItems: 'center' }} className="hero-grid">

            {/* ── Left: copy ── */}
            <div className="fade-in">

              {/* Badge pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '999px', marginBottom: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#10b981',
                  animation: 'pulseGreen 2s ease-in-out infinite',
                }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-2)' }}>
                  Augmented Reality Design
                </span>
              </div>

              {/* Animated heading */}
              <AnimatedHeading text={"Design Your Space\nBefore You Buy."} />

              {/* Subheading */}
              <p style={{
                fontSize: '1.05rem', color: 'var(--text-2)', lineHeight: 1.7,
                marginBottom: '2.5rem', maxWidth: 480,
                opacity: 0, animation: 'fadeSlideUp 0.6s ease 0.9s forwards',
              }}>
                Visualize furniture in your real environment with augmented reality and create a room that feels truly yours.
              </p>

              {/* CTA buttons */}
              <div style={{
                display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem',
                opacity: 0, animation: 'fadeSlideUp 0.6s ease 1.1s forwards',
              }}>
                <Link to="/ar/p004" className="btn btn-primary btn-lg">Start Designing</Link>
                <Link to="/catalogue" className="btn btn-outline btn-lg">Explore Furniture</Link>
              </div>

              {/* Stats with count-up */}
              <div style={{
                display: 'flex', gap: '3rem', flexWrap: 'wrap',
                opacity: 0, animation: 'fadeSlideUp 0.6s ease 1.3s forwards',
              }}>
                {STATS.map(s => (
                  <div key={s.label}>
                    <div style={{
                      fontFamily: "'Playfair Display', serif", fontSize: '2rem',
                      fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem',
                    }}>
                      <CountUp num={s.num} suffix={s.suffix} />
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 500 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: hero visual ── */}
            <div style={{ position: 'relative' }} className="hero-visual">

              {/* Warm glow behind image */}
              <div style={{
                position: 'absolute', inset: '-28px',
                borderRadius: '36px',
                background: 'radial-gradient(ellipse at center, rgba(196,165,123,0.25) 0%, transparent 68%)',
                filter: 'blur(28px)', zIndex: 0,
              }} />

              {/* Image card — floats */}
              <div style={{
                position: 'relative', zIndex: 1,
                borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 28px 64px rgba(0,0,0,0.13)',
                background: 'var(--surface)',
                animation: 'heroFloat 6s ease-in-out infinite',
              }}>
                <img
                  src="/hero_room.png"
                  alt="Modern living room with AR furniture placement"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  onError={e => {
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
                  <rect x="240" y="420" width="320" height="100" rx="16" fill="#9B8B7E"/>
                  <rect x="240" y="400" width="320" height="40" rx="12" fill="#8A7A6E"/>
                  <rect x="320" y="500" width="160" height="60" rx="8" fill="#C4A57B" opacity="0.6"/>
                </svg>

                {/* Floating badge — AR Mode (bottom-left) */}
                <div style={{
                  position: 'absolute', bottom: 18, left: 18,
                  background: 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px', padding: '0.6rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  animation: 'floatA 4s ease-in-out infinite',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 7px rgba(16,185,129,0.8)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1a1a1a' }}>AR Mode Active</span>
                </div>

                {/* Floating badge — Items placed (top-right) */}
                <div style={{
                  position: 'absolute', top: 18, right: 18,
                  background: 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px', padding: '0.6rem 1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  animation: 'floatB 5s ease-in-out infinite',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.68rem', color: '#6b6b6b', fontWeight: 500, marginBottom: '0.1rem' }}>Items placed</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', fontFamily: "'Playfair Display', serif" }}>12 pieces</div>
                </div>
              </div>
            </div>

          </div>

          {/* Scroll down indicator */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '3.5rem',
            animation: 'bounceSoft 2.5s ease-in-out infinite',
            cursor: 'pointer',
            userSelect: 'none',
          }} onClick={() => window.scrollBy({ top: 450, behavior: 'smooth' })}>
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.14em', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 600 }}>
              Scroll to explore
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--tan-dark, #9A7A52)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>

        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '3rem 0', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.4rem' }}>
                  <CountUp num={s.num} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-3)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY AR INTERIOR ───────────────────────────────────────────────── */}
      <FeatureCards />

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ margin: '0 auto 0.75rem' }}>Process</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600 }}>
              Four steps to your perfect room.
            </h2>
          </div>

          <div ref={processRef} className="process-grid">
            {PROCESS.map(({ num, title, desc }, i) => (
              <article
                key={num}
                className="process-card"
                style={{
                  opacity: processVisible ? 1 : 0,
                  transform: processVisible ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.5s ease ${i * 110}ms, transform 0.5s ease ${i * 110}ms`,
                }}
              >
                <span className="process-number">{num}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED FURNITURE ────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">Curated Collection</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 600, marginTop: '0.25rem' }}>
                Find pieces that fit your space.
              </h2>
            </div>
            <Link to="/catalogue" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {['All', 'Sofas', 'Chairs', 'Tables', 'Beds', 'Storage', 'Lighting', 'Decor'].map((cat, i) => (
              <Link key={cat} to={cat === 'All' ? '/catalogue' : `/catalogue?category=${cat}`} className={i === 0 ? 'chip chip-active' : 'chip'} style={{ textDecoration: 'none' }}>
                {cat}
              </Link>
            ))}
          </div>

          <div ref={featuredRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {featured.map((p, i) => (
              <div
                key={p._id || p.id}
                style={{
                  opacity: featuredVisible ? 1 : 0,
                  transform: featuredVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
                }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section style={{ overflow: 'hidden' }}>
        <div style={{ borderRadius: '32px', overflow: 'hidden', margin: '0 auto 4rem', maxWidth: 1280, padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 480, borderRadius: '32px', overflow: 'hidden' }} className="cta-grid">

            {/* Left: dark panel with dot-grid */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1209 0%, #2c1e0f 50%, #1a1209 100%)',
              color: '#fff', padding: '4rem 3.5rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Decorative dot grid */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle, rgba(196,161,100,0.18) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                pointerEvents: 'none',
              }} />

              <div style={{
                position: 'relative',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 0.9rem',
                background: 'rgba(196,165,123,0.15)', border: '1px solid rgba(196,165,123,0.3)',
                borderRadius: '999px', marginBottom: '2rem', width: 'fit-content',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c4a164' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c4a164' }}>
                  AR Experience
                </span>
              </div>

              <h2 style={{
                position: 'relative',
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 600,
                lineHeight: 1.1, marginBottom: '1.5rem', color: '#ffffff', letterSpacing: '-0.01em',
              }}>
                See It.<br />
                Place It.<br />
                <span style={{ color: '#c4a164' }}>Love It.</span>
              </h2>

              <p style={{
                position: 'relative',
                fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 380,
              }}>
                Bring your room to life before making a purchase. Place furniture in your real space with AR.
              </p>

              <div style={{ position: 'relative' }}>
                <Link to="/ar/p004" className="btn btn-tan btn-lg">Start Designing</Link>
              </div>
            </div>

            {/* Right: room photo */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src="/cta_room.png"
                alt="Luxury room with AR furniture visualization"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 100%)' }} />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          50%       { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-10px); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { order: -1; }
          .cta-grid   { grid-template-columns: 1fr !important; }
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.25rem;
        }
        .process-card {
          min-height: 180px;
          padding: 1.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface-2);
          text-align: left;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .process-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow);
          border-color: rgba(196,165,123,0.4);
        }
        .process-number {
          display: inline-flex;
          width: 2.5rem; height: 2.5rem;
          align-items: center; justify-content: center;
          margin-bottom: 1.25rem;
          border-radius: 50%;
          background: rgba(196,165,123,0.16);
          color: #94754d;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.04em;
        }
        .process-card h3 {
          margin-bottom: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem; font-weight: 600;
        }
        .process-card p { color: var(--text-2); font-size: 0.875rem; line-height: 1.6; }

        @media (max-width: 900px) { .process-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (max-width: 520px) {
          .process-grid { grid-template-columns: 1fr; gap: 0.875rem; }
          .process-card { min-height: auto; padding: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;
