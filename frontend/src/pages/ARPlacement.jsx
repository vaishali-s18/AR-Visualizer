import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, RotateCw, Maximize2, Trash2, Save, 
  ChevronLeft, ChevronRight, Eye, Smartphone,
} from 'lucide-react';
import { getProductById, CATEGORIES, filterProducts } from '../data/mockProducts';

const ARPlacement = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const product  = getProductById(id);

  const containerRef   = useRef(null);
  const isDragging     = useRef(false);
  const dragOffset     = useRef({ x: 0, y: 0 });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const [modelPos,   setModelPos]   = useState({ x: 400, y: 250 });
  const [modelScale, setModelScale] = useState(1);
  const [modelRotation, setModelRotation] = useState(0);
  const [saved,      setSaved]      = useState(false);
  const [roomPhoto,  setRoomPhoto]  = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Sofas');
  const [roomName, setRoomName] = useState('Living Room — Summer');

  // Get products by category for sidebar
  const categoryProducts = filterProducts({ category: selectedCategory }).slice(0, 6);

  // Global drag listeners (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const r  = containerRef.current.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
      setModelPos({
        x: Math.max(0, Math.min(r.width  - 200, cx - dragOffset.current.x)),
        y: Math.max(0, Math.min(r.height - 200, cy - dragOffset.current.y)),
      });
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchmove',  onMove, { passive: false });
    window.addEventListener('touchend',   onUp);
    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchmove',  onMove);
      window.removeEventListener('touchend',   onUp);
    };
  }, [isMobile]);

  if (!product) return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ marginBottom: '1rem' }}>Product not found</h2>
        <Link to="/catalogue" className="btn btn-primary">Back to Catalogue</Link>
      </div>
    </div>
  );

  const handleSave = () => {
    const key      = 'ar_saved_designs';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([
      { id: Date.now(), productId: product.id, productName: product.name, category: product.category, price: product.price, savedAt: new Date().toISOString(), roomName },
      ...existing,
    ]));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const modelSize = Math.round(200 * modelScale);

  /* ── MOBILE: Real WebXR AR ─────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div style={{ height: '100vh', background: '#000', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <model-viewer
          src={product.modelUrl}
          alt={product.name}
          camera-controls auto-rotate shadow-intensity="1.5"
          ar ar-modes="webxr scene-viewer quick-look" ar-scale="fixed"
          loading="eager" reveal="auto" crossorigin="anonymous"
          style={{ width: '100%', flex: 1 }}
        />

        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(10px)',
          padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{roomName}</span>
          <span />
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(26,26,26,0.92)', backdropFilter: 'blur(14px)',
          padding: '1.5rem', borderRadius: '20px 20px 0 0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', lineHeight: 1.2, marginBottom: '0.25rem' }}>{product.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>${product.price.toLocaleString()}</p>
            </div>
            <button className="btn btn-primary">
              <Smartphone size={15} /> Launch AR
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={saved} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 10, padding: '0.7rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            }}>
              <Save size={14} /> {saved ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── DESKTOP: Full AR Workspace ────────────────────────────────────────── */
  return (
    <div style={{ paddingTop: 80, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* Top bar */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/designs')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: '0.9rem', fontWeight: 500 }}>
            <ArrowLeft size={18} /> {roomName}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button style={{ padding: '0.5rem', borderRadius: 8, background: 'none', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20"/>
            </svg>
          </button>
          <button style={{ padding: '0.5rem 1rem', borderRadius: 8, background: 'none', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>
            <Eye size={16} /> Preview
          </button>
          <button style={{ padding: '0.5rem 1rem', borderRadius: 8, background: 'none', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>
            <Smartphone size={16} /> AR
          </button>
          <button onClick={handleSave} disabled={saved} className="btn btn-primary btn-sm">
            <Save size={14} /> {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left sidebar - Categories & Products */}
        <div style={{
          width: 160,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}>
          <div style={{ padding: '1.5rem 1rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.875rem' }}>
              Categories
            </p>
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.25rem',
                  borderRadius: 8,
                  border: 'none',
                  background: selectedCategory === cat ? 'var(--bg)' : 'transparent',
                  color: selectedCategory === cat ? 'var(--text)' : 'var(--text-2)',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === cat ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (selectedCategory !== cat) e.currentTarget.style.background = 'var(--bg)'; }}
                onMouseLeave={e => { if (selectedCategory !== cat) e.currentTarget.style.background = 'transparent'; }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product thumbnails */}
          <div style={{ padding: '0 1rem 1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            {categoryProducts.map(p => (
              <div
                key={p.id}
                style={{
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <div style={{
                  aspectRatio: '1/1',
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <img
                    src={p.thumbnailUrl || svgPlaceholder(p.name)}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', fontWeight: 500, marginTop: '0.4rem', color: 'var(--text)' }}>
                  {p.name.length > 20 ? p.name.slice(0, 18) + '...' : p.name}
                </p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-2)' }}>
                  ${p.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default',
            background: roomPhoto ? `url(${roomPhoto}) center/cover no-repeat` : 'var(--bg)',
          }}
        >
          {/* Instruction hint */}
          {!roomPhoto && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-3)', fontWeight: 500 }}>
                Click furniture to select · Drag to move
              </p>
            </div>
          )}

          {/* Default room illustration */}
          {!roomPhoto && (
            <svg viewBox="0 0 1200 800" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }} fill="none" preserveAspectRatio="xMidYMid slice">
              <rect width="1200" height="800" fill="#FAFAF9"/>
              <rect x="0" y="0" width="240" height="480" fill="#EDE8E0"/>
              <rect x="960" y="0" width="240" height="480" fill="#E8E0D8"/>
              <rect x="240" y="0" width="720" height="480" fill="#F5F0E8"/>
              <polygon points="0,800 240,480 960,480 1200,800" fill="#E0D8CC"/>
              <rect x="420" y="80" width="360" height="240" rx="8" fill="#C8D8E0" opacity="0.6"/>
              <line x1="600" y1="80" x2="600" y2="320" stroke="#B0C0C8" strokeWidth="4"/>
              <line x1="420" y1="200" x2="780" y2="200" stroke="#B0C0C8" strokeWidth="4"/>
              <rect x="240" y="472" width="720" height="8" fill="#D0C8BC"/>
            </svg>
          )}

          {/* Draggable furniture model */}
          <div
            style={{
              position: 'absolute',
              left: modelPos.x,
              top: modelPos.y,
              width: modelSize,
              height: modelSize,
              cursor: isDragging.current ? 'grabbing' : 'grab',
              touchAction: 'none',
              zIndex: 10,
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
              transform: `rotate(${modelRotation}deg)`,
              transition: 'transform 0.3s ease',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              isDragging.current = true;
              const rect = e.currentTarget.getBoundingClientRect();
              dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            }}
            onTouchStart={(e) => {
              const t = e.touches[0];
              isDragging.current = true;
              const rect = e.currentTarget.getBoundingClientRect();
              dragOffset.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
            }}
          >
            <model-viewer
              src={product.modelUrl}
              alt={product.name}
              disable-zoom
              loading="eager"
              reveal="auto"
              crossorigin="anonymous"
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent', '--poster-color': 'transparent', borderRadius: 8 }}
            />
          </div>

          {/* Bottom control bar */}
          <div style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--accent)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <button
              onClick={() => setModelPos({ x: 400, y: 250 })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
              </svg>
              <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Move</span>
            </button>

            <button
              onClick={() => setModelRotation(r => r + 45)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
              }}
            >
              <RotateCw size={20} />
              <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Rotate</span>
            </button>

            <button
              onClick={() => setModelScale(s => Math.min(2, s + 0.2))}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
              }}
            >
              <Maximize2 size={20} />
              <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Scale</span>
            </button>

            <button
              onClick={() => {
                setModelPos({ x: 400, y: 250 });
                setModelScale(1);
                setModelRotation(0);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
              }}
            >
              <Trash2 size={20} />
              <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Delete</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const svgPlaceholder = (name) => {
  const s = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
      <rect width='100%' height='100%' fill='#FAFAF9'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        fill='#9B9B9B' font-size='14' font-weight='500' font-family='DM Sans, sans-serif'>${name}</text>
    </svg>`);
  return `data:image/svg+xml;utf8,${s}`;
};

export default ARPlacement;
