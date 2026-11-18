import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Smartphone, Star, Box } from 'lucide-react';
import { loadModelViewer } from '../../utils/loadModelViewer';

// ─── FurnitureCard ────────────────────────────────────────────────────────────
// Richer card used in the Phase 2 catalogue grid.
// Shows: inline model-viewer (real GLB), badge, out-of-stock overlay, name,
// category, rating, material, dimensions and price.
const FurnitureCard = ({ product, onPreview3D }) => {
  const [hovered, setHovered] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const viewerRef = useRef(null);
  const {
    id, name, category, price, dimensions,
    rating, reviews, badge, inStock,
    material, modelUrl, arAvailable,
  } = product;

  useEffect(() => {
    let active = true;
    const viewer = viewerRef.current;
    const handleLoad = () => {
      if (!active) return;
      setModelLoaded(true);
      setModelError(false);
    };
    const handleError = () => {
      if (!active) return;
      setModelError(true);
      setModelLoaded(true);
    };

    setModelLoaded(false);
    setModelError(false);
    viewer?.addEventListener('load', handleLoad);
    viewer?.addEventListener('error', handleError);
    if (viewer?.loaded) handleLoad();

    if (!modelUrl) {
      handleError();
    } else {
      loadModelViewer().catch((err) => {
        console.warn('[FurnitureCard] Failed to load model-viewer:', err);
        handleError();
      });
    }

    return () => {
      active = false;
      viewer?.removeEventListener('load', handleLoad);
      viewer?.removeEventListener('error', handleError);
    };
  }, [modelUrl]);

  return (
    <div
      className="card furniture-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* ── 3D Model Preview ────────────────────────────────────────── */}
      <div style={{ position: 'relative', background: 'var(--surface-2)', aspectRatio: '4/3', overflow: 'hidden' }}>

        {/* Loading skeleton */}
        {!modelLoaded && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            background: 'var(--surface-2)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="var(--text-3)" strokeWidth="1.5"
              style={{ animation: 'mv-spin 1.2s linear infinite', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10" opacity="0.2"/>
              <path d="M12 2a10 10 0 0 1 10 10"/>
            </svg>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>Loading 3D…</span>
          </div>
        )}

        {/* Real GLB model */}
        {modelUrl && (
          <model-viewer
            ref={viewerRef}
            src={modelUrl}
            alt={name}
            auto-rotate
            auto-rotate-delay="600"
            rotation-per-second="18deg"
            camera-controls
            camera-orbit="45deg 75deg 105%"
            field-of-view="30deg"
            shadow-intensity="0.7"
            shadow-softness="1"
            exposure="1.1"
            loading="lazy"
            reveal="auto"
            style={{
              width: '100%', height: '100%', display: 'block',
              '--poster-color': 'var(--surface-2)',
              opacity: modelLoaded && !modelError ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        )}

        {modelError && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: 'var(--surface-2)',
          }}>
            <span style={{ fontSize: '2rem' }}>🪑</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', textAlign: 'center', padding: '0 1rem' }}>
              {name}
            </span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span style={{
            position: 'absolute', top: 10, left: 10, zIndex: 2,
            background: 'var(--accent)', color: '#fff',
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', padding: '0.28rem 0.6rem', borderRadius: 6,
          }}>
            {badge}
          </span>
        )}

        {/* 3D badge */}
        {modelLoaded && !modelError && (
          <span style={{
            position: 'absolute', top: 10, right: 10, zIndex: 2,
            background: 'rgba(28,25,22,0.65)', color: '#fff',
            backdropFilter: 'blur(6px)',
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '0.24rem 0.55rem', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Box size={10} /> 3D
          </span>
        )}

        {/* Out-of-stock */}
        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(247,244,239,0.72)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover action strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(28,25,22,0.75))',
          padding: '1.5rem 0.75rem 0.75rem',
          display: 'flex', gap: '0.5rem',
          transform: hovered ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 0.3s ease',
        }}>
          {/* Preview 3D — only shown when a model is available */}
          {arAvailable !== false && modelUrl && (
            <button
              onClick={(e) => { e.preventDefault(); onPreview3D && onPreview3D(product); }}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.15)', color: '#fff',
                backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8, padding: '0.42rem 0.6rem', fontSize: '0.72rem', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <Box size={12} /> Preview 3D
            </button>
          )}

          {/* Try AR / View Details */}
          {arAvailable !== false ? (
            <Link
              to={`/ar/${id}`}
              onClick={e => e.stopPropagation()}
              style={{
                flex: 1, background: 'var(--accent)', color: '#fff',
                borderRadius: 8, padding: '0.42rem 0.6rem', fontSize: '0.72rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                border: 'none', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-light)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              <Smartphone size={12} /> Try AR
            </Link>
          ) : (
            <Link
              to={`/products/${id}`}
              onClick={e => e.stopPropagation()}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.15)', color: '#fff',
                backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8, padding: '0.42rem 0.6rem', fontSize: '0.72rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <Eye size={12} /> View Details
            </Link>
          )}
        </div>
      </div>

      {/* ── Info ────────────────────────────────────────────────────── */}
      <div style={{ padding: '0.9rem 1rem 1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Category */}
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)',
          textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.3rem',
          display: 'block',
        }}>
          {category}
        </span>

        {/* Name */}
        <Link to={`/products/${id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '0.98rem', fontWeight: 600, color: 'var(--text)',
            marginBottom: '0.3rem', lineHeight: 1.3,
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
          >
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
            <Star size={11} style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)' }}>{rating}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>({reviews})</span>
          </div>
        )}

        {/* Material */}
        {material && (
          <p style={{ fontSize: '0.73rem', color: 'var(--text-3)', marginBottom: '0.25rem' }}>
            {material}
          </p>
        )}

        {/* Dimensions */}
        {dimensions && (
          <p style={{ fontSize: '0.71rem', color: 'var(--text-3)', marginBottom: '0.65rem' }}>
            {dimensions.width}W × {dimensions.height}H × {dimensions.depth}D cm
          </p>
        )}

        {/* Price + View Details */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)',
          }}>
            ₹{price.toLocaleString('en-IN')}
          </span>
          <Link
            to={`/products/${id}`}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
          >
            <Eye size={12} /> Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FurnitureCard;
