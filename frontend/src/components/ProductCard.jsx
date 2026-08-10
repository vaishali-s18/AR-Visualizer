import { Link } from 'react-router-dom';
import { Eye, Smartphone, Star } from 'lucide-react';

// ─── ProductCard ──────────────────────────────────────────────────────────────
// Reusable card used in Catalogue, Home (featured section), and any other
// place that needs to display a furniture product.
const ProductCard = ({ product }) => {
  const { id, name, category, price, dimensions, rating, reviews, badge, inStock, color } = product;

  // Generate a deterministic SVG placeholder using the product name
  const placeholder = svgPlaceholder(name, category);

  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Thumbnail */}
      <div style={{ position: 'relative', background: 'var(--surface-2)', aspectRatio: '4/3', overflow: 'hidden' }}>
        <img
          src={product.thumbnailUrl || placeholder}
          alt={name}
          onError={e => { e.currentTarget.src = placeholder; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        />

        {/* Badge (Bestseller, New, etc.) */}
        {badge && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: 'var(--accent)', color: '#fff',
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', padding: '0.3rem 0.65rem',
            borderRadius: 6,
          }}>
            {badge}
          </span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(247,244,239,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick AR button overlay */}
        <Link
          to={`/ar/${id}`}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(28,25,22,0.8)', color: '#fff',
            backdropFilter: 'blur(8px)', borderRadius: 8,
            padding: '0.35rem 0.65rem', fontSize: '0.72rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.3rem',
          }}
        >
          <Smartphone size={12} /> Try AR
        </Link>
      </div>

      {/* Info */}
      <div style={{ padding: '1rem 1.125rem 1.125rem', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Category + Color */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {category}
          </span>
          {color && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{color}</span>
          )}
        </div>

        {/* Name */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem', lineHeight: 1.3 }}>
          {name}
        </h3>

        {/* Rating */}
        {rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
            <Star size={12} style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)' }}>{rating}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>({reviews})</span>
          </div>
        )}

        {/* Dimensions */}
        {dimensions && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '0.75rem' }}>
            {dimensions.width}W × {dimensions.height}H × {dimensions.depth}D cm
          </p>
        )}

        {/* Price + Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
            ₹{price.toLocaleString('en-IN')}
          </span>
          <Link
            to={`/products/${id}`}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Eye size={13} /> View Details
          </Link>
        </div>

      </div>
    </div>
  );
};

// ─── SVG placeholder generator ────────────────────────────────────────────────
// Creates a clean, minimal SVG with the product name and category
const svgPlaceholder = (name = '', category = '') => {
  const s = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <rect width='100%' height='100%' fill='#F0EDE8'/>
      <text x='50%' y='44%' dominant-baseline='middle' text-anchor='middle'
        fill='#2B241E' font-size='26' font-weight='600' font-family='Georgia, serif'>${name}</text>
      <text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle'
        fill='#9B9088' font-size='14' font-family='Arial, sans-serif'>${category}</text>
    </svg>`);
  return `data:image/svg+xml;utf8,${s}`;
};

export default ProductCard;
