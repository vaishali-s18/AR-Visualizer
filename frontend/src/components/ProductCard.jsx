import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const { id, name, category, price, rating, thumbnailUrl, badge } = product;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
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
          onError={e => { e.currentTarget.src = svgPlaceholder(name); }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Heart button */}
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
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent)';
            e.currentTarget.querySelector('svg').style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--surface)';
            e.currentTarget.querySelector('svg').style.color = 'var(--text-3)';
          }}
        >
          <Heart size={16} style={{ color: 'var(--text-3)', transition: 'color 0.2s' }} />
        </button>

        {/* Category badge */}
        <span className="badge" style={{ position: 'absolute', top: 12, left: 12 }}>
          {category}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.3,
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
            {[1, 2, 3, 4, 5].map(i => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#F59E0B' : 'none'} stroke={i <= Math.round(rating) ? '#F59E0B' : '#E5E5E5'} strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)', marginLeft: '0.375rem' }}>
              {rating}
            </span>
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <Link to={`/ar/${id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
            <Eye size={14} /> View in AR
          </Link>
        </div>
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

export default ProductCard;
