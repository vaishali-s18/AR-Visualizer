import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Smartphone, Monitor, ZoomIn, ZoomOut,
  RotateCcw, Save, ShoppingBag, Info, X,
} from 'lucide-react';
import { getProductById } from '../data/mockProducts';
import { useAuth } from '../context/AuthContext';

const ARPlacement = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const product  = getProductById(id);

  const containerRef   = useRef(null);
  const modelViewerRef = useRef(null);
  const isDragging     = useRef(false);
  const dragOffset     = useRef({ x: 0, y: 0 });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const [modelPos,   setModelPos]   = useState({ x: 200, y: 140 });
  const [modelScale, setModelScale] = useState(1);
  const [saved,      setSaved]      = useState(false);
  const [roomPhoto,  setRoomPhoto]  = useState(null);
  const [showInfo,   setShowInfo]   = useState(true);

  // Global drag listeners (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const r  = containerRef.current.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
      setModelPos({
        x: Math.max(0, Math.min(r.width  - 260, cx - dragOffset.current.x)),
        y: Math.max(0, Math.min(r.height - 260, cy - dragOffset.current.y)),
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
    <div style={{ paddingTop: 68 }}>
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
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
      { id: Date.now(), productId: product.id, productName: product.name, category: product.category, price: product.price, savedAt: new Date().toISOString() },
      ...existing,
    ]));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRoomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setRoomPhoto(URL.createObjectURL(file));
  };

  const modelSize = Math.round(260 * modelScale);

  /* ── MOBILE: Real WebXR AR ─────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div style={{ height: '100vh', background: '#000', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <model-viewer
          ref={modelViewerRef}
          src={product.modelUrl}
          alt={product.name}
          camera-controls auto-rotate shadow-intensity="1.5"
          ar ar-modes="webxr scene-viewer quick-look" ar-scale="fixed"
          loading="eager" reveal="auto" crossorigin="anonymous"
          style={{ width: '100%', flex: 1 }}
        />

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: 'rgba(28,25,22,0.72)', backdropFilter: 'blur(10px)',
          padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{product.name}</span>
          <span />
        </div>

        {/* Bottom panel */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(28,25,22,0.88)', backdropFilter: 'blur(14px)',
          padding: '1.5rem', borderRadius: '20px 20px 0 0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', lineHeight: 1.2, marginBottom: '0.25rem' }}>{product.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>₹{product.price.toLocaleString('en-IN')}</p>
            </div>
            <button onClick={() => modelViewerRef.current?.activateAR()} className="btn btn-primary">
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
            <Link to={product.affiliateUrl} target="_blank" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 10, padding: '0.7rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600,
            }}>
              <ShoppingBag size={14} /> Buy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── DESKTOP: Simulated placement ──────────────────────────────────────── */
  return (
    <div style={{ paddingTop: 68, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0,
      }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: '0.875rem', fontWeight: 500 }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
        <Monitor size={15} style={{ color: 'var(--text-3)' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>Desktop Placement — {product.name}</span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontSize: '0.75rem', color: 'var(--text-3)',
          background: 'rgba(59,74,58,0.07)', padding: '0.3rem 0.75rem',
          borderRadius: 8, border: '1px solid rgba(59,74,58,0.15)',
        }}>
          📱 Open on mobile for real WebXR AR
        </span>
      </div>

      {/* Main area: room canvas + right panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Room canvas */}
        <div
          ref={containerRef}
          style={{
            flex: 1, position: 'relative', overflow: 'hidden', cursor: 'default',
            background: roomPhoto
              ? `url(${roomPhoto}) center/cover no-repeat`
              : 'var(--surface-2)',
          }}
        >
          {/* Default room illustration */}
          {!roomPhoto && (
            <svg viewBox="0 0 900 600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.9 }} fill="none" preserveAspectRatio="xMidYMid slice">
              <rect width="900" height="600" fill="#EDEAE4"/>
              {/* Ceiling */}
              <rect x="0" y="0" width="900" height="8" fill="#D8D2C8"/>
              {/* Left wall */}
              <rect x="0" y="0" width="180" height="360" fill="#DDD6CC"/>
              {/* Right wall */}
              <rect x="720" y="0" width="180" height="360" fill="#D8D0C6"/>
              {/* Back wall */}
              <rect x="180" y="0" width="540" height="360" fill="#EBE6DE"/>
              {/* Floor */}
              <polygon points="0,600 180,360 720,360 900,600" fill="#CFC8BC"/>
              {/* Floor boards */}
              {[0.2,0.35,0.5,0.65,0.8].map((t, i) => (
                <polygon key={i} points={`0,600 ${180*t},${360+240*t} ${720+180*t},${360+240*t} 900,600`} fill="none" stroke="#BDB6AA" strokeWidth="1" opacity="0.4"/>
              ))}
              {/* Window */}
              <rect x="330" y="40" width="240" height="160" rx="4" fill="#B8D4DC" opacity="0.65"/>
              <rect x="330" y="40" width="240" height="8"   rx="2" fill="#A0B8BE"/>
              <rect x="330" y="192" width="240" height="8"  rx="2" fill="#A0B8BE"/>
              <line x1="450" y1="40" x2="450" y2="200" stroke="#A0B8BE" strokeWidth="3"/>
              <line x1="330" y1="120" x2="570" y2="120" stroke="#A0B8BE" strokeWidth="3"/>
              {/* Skirting board */}
              <rect x="180" y="352" width="540" height="8" fill="#C8C0B4"/>
              {/* Instruction text */}
              <text x="450" y="320" textAnchor="middle" fill="#9B9088" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="500">
                Drag the furniture model to place it anywhere in the room
              </text>
            </svg>
          )}

          {/* Dismissable info banner */}
          {showInfo && (
            <div style={{
              position: 'absolute', top: 16, left: 16, right: 16,
              background: 'rgba(59,74,58,0.92)', color: '#fff',
              borderRadius: 12, padding: '0.875rem 1rem 0.875rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              backdropFilter: 'blur(8px)', maxWidth: 520,
            }}>
              <Info size={16} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.82rem', lineHeight: 1.45, flex: 1 }}>
                <strong>How to use:</strong> Drag the 3D model to position it. Use the Scale slider to resize. Upload your own room photo for a realistic preview.
              </p>
              <button onClick={() => setShowInfo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 0, display: 'flex' }}>
                <X size={15} />
              </button>
            </div>
          )}

          {/* Draggable model-viewer */}
          <div
            style={{
              position: 'absolute',
              left: modelPos.x, top: modelPos.y,
              width: modelSize, height: modelSize,
              cursor: isDragging.current ? 'grabbing' : 'grab',
              touchAction: 'none', zIndex: 10,
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.22))',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              isDragging.current = true;
              dragOffset.current = { x: e.clientX - modelPos.x, y: e.clientY - modelPos.y };
            }}
            onTouchStart={(e) => {
              const t = e.touches[0];
              isDragging.current = true;
              dragOffset.current = { x: t.clientX - modelPos.x, y: t.clientY - modelPos.y };
            }}
          >
            <model-viewer
              ref={modelViewerRef}
              src={product.modelUrl}
              alt={product.name}
              camera-controls
              disable-zoom
              loading="eager"
              reveal="auto"
              crossorigin="anonymous"
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent', '--poster-color': 'transparent', borderRadius: 8 }}
            />
            <div style={{
              position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(28,25,22,0.68)', color: '#fff',
              borderRadius: 6, padding: '0.2rem 0.6rem',
              fontSize: '0.68rem', fontWeight: 600, pointerEvents: 'none',
              backdropFilter: 'blur(4px)', whiteSpace: 'nowrap',
            }}>
              ⠿ Drag to move
            </div>
          </div>
        </div>

        {/* Right control panel */}
        <div style={{
          width: 280, background: 'var(--surface)', borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto',
        }}>

          {/* Product info */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)' }}>{product.category}</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, margin: '0.25rem 0 0.4rem', lineHeight: 1.3 }}>{product.name}</h3>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent)' }}>₹{product.price.toLocaleString('en-IN')}</p>
            {product.dimensions && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.35rem' }}>
                {product.dimensions.width}W × {product.dimensions.height}H × {product.dimensions.depth}D cm
              </p>
            )}
          </div>

          {/* Scale */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)' }}>Scale</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)' }}>{Math.round(modelScale * 100)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button onClick={() => setModelScale(s => Math.max(0.4, parseFloat((s - 0.1).toFixed(2))))}
                style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ZoomOut size={13} />
              </button>
              <input type="range" min="0.4" max="2.5" step="0.05" value={modelScale}
                onChange={e => setModelScale(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <button onClick={() => setModelScale(s => Math.min(2.5, parseFloat((s + 0.1).toFixed(2))))}
                style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ZoomIn size={13} />
              </button>
            </div>
            <button onClick={() => setModelScale(1)}
              style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '0.75rem', padding: 0 }}>
              <RotateCcw size={11} /> Reset
            </button>
          </div>

          {/* Room photo */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.6rem' }}>Room Background</p>
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              background: 'var(--surface-2)', border: '1.5px dashed var(--border)',
              borderRadius: 10, padding: '0.8rem', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-2)',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              📷 Upload Photo
              <input type="file" accept="image/*" onChange={handleRoomUpload} style={{ display: 'none' }} />
            </label>
            {roomPhoto && (
              <button onClick={() => setRoomPhoto(null)}
                style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                ✕ Remove photo
              </button>
            )}
          </div>

          {/* Actions */}
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: 'auto' }}>
            <button onClick={handleSave} disabled={saved} className="btn btn-primary" style={{ width: '100%' }}>
              <Save size={14} /> {saved ? '✓ Saved to Designs' : 'Save Design'}
            </button>
            <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
              <ShoppingBag size={14} /> Buy Similar
            </a>
            <Link to={`/products/${product.id}`} className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
              View Full Details
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ARPlacement;
