import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Smartphone, Star, Box } from 'lucide-react';

// ─── FurnitureCard ────────────────────────────────────────────────────────────
// Richer card used in the Phase 2 catalogue grid.
// Shows: thumbnail, badge, out-of-stock overlay, name, category, rating,
// material, dimensions and price. Hover reveals action buttons.
const FurnitureCard = ({ product, onPreview3D }) => {
  const [hovered, setHovered] = useState(false);
  const {
    id, name, category, price, dimensions,
    rating, reviews, badge, inStock, color,
    material, modelUrl,
  } = product;

  const placeholder = svgPlaceholder(name, category, color);
  const imgSrc = product.image || product.thumbnailUrl || placeholder;

  return (
    <div
      className="card furniture-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* ── Thumbnail ───────────────────────────────────────────────── */}
      <div style={{ position: 'relative', background: 'var(--surface-2)', aspectRatio: '4/3', overflow: 'hidden' }}>
        <img
          src={imgSrc}
          alt={name}
          onError={e => { e.currentTarget.src = placeholder; }}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.45s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        {/* Badge */}
        {badge && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'var(--accent)', color: '#fff',
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', padding: '0.28rem 0.6rem', borderRadius: 6,
          }}>
            {badge}
          </span>
        )}

        {/* Model format badge */}
        {modelUrl && (
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(28,25,22,0.65)', color: '#fff',
            backdropFilter: 'blur(6px)',
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '0.24rem 0.55rem', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Box size={10} /> GLB
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
          {/* Preview 3D */}
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

          {/* Try AR */}
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

// ─── SVG placeholder ──────────────────────────────────────────────────────────
const svgPlaceholder = (name = '', category = '', color = '') => {
  // Pick a subtle bg tint per category
  const palettes = {
    Chairs:   ['#EEE9E2', '#6B5E4E'],
    Sofas:    ['#E8EDE8', '#3B4A3A'],
    Tables:   ['#EDE8E0', '#7A6C5A'],
    Beds:     ['#EAE8ED', '#524A66'],
    Cabinets: ['#E8EAE5', '#4A5540'],
    Lamps:    ['#EDE9DC', '#7A6A30'],
    Decor:    ['#EDE2DC', '#7A4A3A'],
  };
  const [bg, fg] = palettes[category] || ['#F0EDE8', '#5C5248'];
  const s = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <rect width='100%' height='100%' fill='${bg}'/>
      <text x='50%' y='42%' dominant-baseline='middle' text-anchor='middle'
        fill='${fg}' font-size='24' font-weight='600' font-family='Georgia, serif'>${name}</text>
      <text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle'
        fill='${fg}99' font-size='13' font-family='Arial, sans-serif'>${category}${color ? ' · ' + color : ''}</text>
    </svg>`);
  return `data:image/svg+xml;utf8,${s}`;
};

export default FurnitureCard;
