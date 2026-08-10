import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Ruler, ShoppingBag, CheckCircle2, Star, ChevronRight } from 'lucide-react';
import { getFeatured, CATEGORIES } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';

// ─── Static data ──────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <Smartphone size={28} />,
    title: 'Browse & Choose',
    desc: 'Explore our catalogue of 500+ curated furniture pieces. Filter by category, style, or budget to find what suits your space.',
  },
  {
    step: '02',
    icon: <Ruler size={28} />,
    title: 'Visualize in AR',
    desc: 'Hit "Try in AR" on any product. Point your phone at your floor — the furniture appears true-to-scale in your real room.',
  },
  {
    step: '03',
    icon: <ShoppingBag size={28} />,
    title: 'Buy with Confidence',
    desc: 'Love how it looks? Save the design and buy from our partner retailers — no more returns because it "looked smaller online".',
  },
];

const BENEFITS = [
  'See exact dimensions in your space before buying',
  'Works on any modern smartphone — no app needed',
  'Browse 500+ curated furniture models',
  'Save and compare multiple designs',
  'Reduces expensive return rates by up to 40%',
  'Supports WebXR, Scene Viewer & Quick Look',
];

const STATS = [
  { value: '500+', label: 'Furniture Models' },
  { value: '10k+', label: 'Rooms Visualised' },
  { value: '40%',  label: 'Fewer Returns' },
  { value: '4.8★', label: 'User Rating' },
];

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const featured = getFeatured(6);
  const categories = CATEGORIES.filter(c => c !== 'All');

  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(160deg, #F7F4EF 0%, #EDE8DF 60%, #E4DDD0 100%)',
        padding: '6rem 0 5rem',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Decorative background circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 500, height: 500, borderRadius: '50%',
          background: 'rgba(59,74,58,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 380, height: 380, borderRadius: '50%',
          background: 'rgba(184,150,90,0.06)', pointerEvents: 'none',
        }} />

        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
            className="hero-grid">

            {/* Left: copy */}
            <div className="fade-in">
              <div className="section-label">B.Tech Final Year Project</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.25rem', color: 'var(--text)' }}>
                Visualize Before<br />
                <span style={{ color: 'var(--accent)' }}>You Realize</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-2)', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480 }}>
                Place true-to-scale 3D furniture in your room using augmented reality. See exactly how a sofa fits before you commit to buying it — no measuring tape required.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', marginBottom: '2.5rem' }}>
                <Link to="/ar/p004" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
                  <Smartphone size={18} /> Try AR Visualizer
                </Link>
                <Link to="/catalogue" className="btn btn-outline btn-lg">
                  Explore Furniture <ArrowRight size={16} />
                </Link>
              </div>

              {/* Mini stats */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {STATS.map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: hero visual */}
            <div style={{ position: 'relative' }} className="hero-visual">
              <div style={{
                background: 'var(--surface)', borderRadius: 24,
                overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
                aspectRatio: '4/3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* SVG room illustration placeholder */}
                <svg viewBox="0 0 600 450" style={{ width: '100%', height: '100%' }} fill="none">
                  {/* Room walls */}
                  <rect width="600" height="450" fill="#F0EDE8"/>
                  <polygon points="0,450 150,270 450,270 600,450" fill="#E8E2D8"/>
                  <rect x="0" y="0" width="150" height="270" fill="#E4DDD0"/>
                  <rect x="450" y="0" width="150" height="270" fill="#DDD5C8"/>
                  <rect x="150" y="0" width="300" height="270" fill="#EDE8DF"/>

                  {/* Floor */}
                  <polygon points="0,450 150,270 450,270 600,450" fill="#D8D0C4"/>

                  {/* Window */}
                  <rect x="220" y="30" width="160" height="100" rx="4" fill="#C5D9E0" opacity="0.8"/>
                  <line x1="300" y1="30" x2="300" y2="130" stroke="#A8B8BE" strokeWidth="2"/>
                  <line x1="220" y1="80" x2="380" y2="80" stroke="#A8B8BE" strokeWidth="2"/>

                  {/* Sofa (simple block) */}
                  <rect x="185" y="310" width="230" height="80" rx="12" fill="#8C7B6E"/>
                  <rect x="185" y="290" width="230" height="30" rx="8" fill="#7A6B60"/>
                  <rect x="185" y="310" width="30" height="80" rx="6" fill="#7A6B60"/>
                  <rect x="385" y="310" width="30" height="80" rx="6" fill="#7A6B60"/>

                  {/* Coffee table */}
                  <rect x="240" y="370" width="120" height="40" rx="6" fill="#B8965A" opacity="0.7"/>

                  {/* AR indicator dot */}
                  <circle cx="300" cy="320" r="16" fill="rgba(59,74,58,0.15)" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 2"/>
                  <circle cx="300" cy="320" r="6" fill="var(--accent)"/>

                  {/* Labels */}
                  <text x="300" y="200" textAnchor="middle" fill="#3B4A3A" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">AR Placement Mode</text>
                  <text x="300" y="218" textAnchor="middle" fill="#9B9088" fontSize="11" fontFamily="Inter, sans-serif">Tap to place furniture</text>
                </svg>

                {/* AR badge overlay */}
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(59,74,58,0.92)', color: '#fff',
                  padding: '0.4rem 0.75rem', borderRadius: 8,
                  fontSize: '0.75rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s infinite' }} />
                  Live AR Preview
                </div>
              </div>
            </div>

          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-visual { display: none; }
          }
        `}</style>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">Browse by Room</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Shop by Category</h2>
            </div>
            <Link to="/catalogue" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem',
          }}>
            {categories.map((cat, i) => (
              <Link
                key={cat}
                to={`/catalogue?category=${cat}`}
                style={{
                  background: 'var(--surface)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 16,
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: CAT_COLORS[i % CAT_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                }}>
                  {CAT_ICONS[cat]}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 5rem', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">Curated Picks</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Furniture</h2>
            </div>
            <Link to="/catalogue" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--surface-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label">Simple Process</div>
            <h2 className="section-title">How AR Visualization Works</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Three steps to furnish your space with complete confidence
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
              <div key={step} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 20, padding: '2rem',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute', top: -10, right: 16,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '5rem', fontWeight: 700, color: 'var(--border)',
                  lineHeight: 1, userSelect: 'none',
                }}>
                  {step}
                </div>

                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(59,74,58,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)', marginBottom: '1.25rem',
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
            className="benefits-grid">

            <div>
              <div className="section-label">Why AR?</div>
              <h2 className="section-title">Buy Smarter,<br />Decorate Better</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Traditional furniture shopping is a guessing game. You measure, you estimate, you hope it fits. AR changes that entirely — what you see through the camera is exactly what you'll live with.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {BENEFITS.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual: AR tech graphic */}
            <div style={{ background: 'var(--surface)', borderRadius: 24, padding: '3rem', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(59,74,58,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <Smartphone size={40} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>WebXR Powered</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                  Uses the WebXR Device API — runs directly in your mobile browser. No app download, no setup. Just point and place.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                {[
                  { label: 'iOS Support', val: 'Safari / Quick Look' },
                  { label: 'Android', val: 'Chrome / Scene Viewer' },
                  { label: 'Accuracy', val: '±2 cm real-world' },
                  { label: 'Format', val: '.GLB / .GLTF' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: 'var(--surface-2)', borderRadius: 12, padding: '0.875rem',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: '0.25rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { .benefits-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--accent)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Ready?</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Transform Your Space Today
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem', maxWidth: 480, margin: '0 auto 2.5rem' }}>
            No app download required. Works in your browser on any modern smartphone.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/ar/p004" className="btn btn-lg" style={{ background: '#fff', color: 'var(--accent)' }}>
              <Smartphone size={18} /> Launch AR Visualizer
            </Link>
            <Link to="/catalogue" className="btn btn-lg" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}>
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

const CAT_ICONS = {
  Sofas: '🛋️', Chairs: '🪑', Tables: '🪵',
  Lighting: '💡', Storage: '📦', Decor: '🪴',
};
const CAT_COLORS = [
  'rgba(59,74,58,0.08)', 'rgba(184,150,90,0.1)', 'rgba(92,82,72,0.08)',
  'rgba(184,150,90,0.12)', 'rgba(59,74,58,0.06)', 'rgba(92,82,72,0.06)',
];

export default Home;
