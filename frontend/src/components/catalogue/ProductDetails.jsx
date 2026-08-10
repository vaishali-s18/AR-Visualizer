import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Smartphone, Star, Package, Ruler, ShoppingBag, Box,
} from 'lucide-react';

// ─── ProductDetails ───────────────────────────────────────────────────────────
// Right-column info panel for the ProductDetail page.
// Extracted as a reusable component for clarity and testability.
const ProductDetails = ({ product, onPreview3D }) => {
  const navigate = useNavigate();
  const {
    id, name, category, price, description,
    dimensions, material, color, inStock,
    rating, reviews, badge, affiliateUrl, modelUrl,
  } = product;

  const stars = Math.round(rating || 0);

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-3)', fontSize: '0.82rem', marginBottom: '1.25rem', padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Category + badge */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <Link
          to={`/catalogue?category=${category}`}
          className="badge badge-green"
        >
          {category}
        </Link>
        {badge && (
          <span className="badge" style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}>
            {badge}
          </span>
        )}
        {!inStock && (
          <span className="badge" style={{ background: '#fee2e2', color: '#b91c1c', borderColor: '#fecaca' }}>
            Out of Stock
          </span>
        )}
      </div>

      {/* Name */}
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)',
      }}>
        {name}
      </h1>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[1,2,3,4,5].map(i => (
            <Star
              key={i}
              size={14}
              style={{
                fill: i <= stars ? 'var(--gold)' : 'var(--border)',
                color: i <= stars ? 'var(--gold)' : 'var(--border)',
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)' }}>{rating}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>({reviews} reviews)</span>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', fontWeight: 700, color: 'var(--text)',
        }}>
          ₹{price.toLocaleString('en-IN')}
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>incl. taxes</span>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.75,
        marginBottom: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem',
      }}>
        {description}
      </p>

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { icon: <Package size={15}/>, label: 'Material', val: material },
          { icon: <span style={{ fontSize: '0.9rem' }}>🎨</span>, label: 'Color', val: color },
          dimensions && { icon: <Ruler size={15}/>, label: 'Width', val: `${dimensions.width} cm` },
          dimensions && { icon: <Ruler size={15}/>, label: 'Height', val: `${dimensions.height} cm` },
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{
            background: 'var(--surface-2)', borderRadius: 10, padding: '0.75rem',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: '0.25rem',
            }}>
              {item.icon} {item.label}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
              {item.val}
            </div>
          </div>
        ))}
      </div>

      {/* Full dimensions row */}
      {dimensions && (
        <div style={{
          background: 'var(--surface-2)', borderRadius: 12, padding: '1rem',
          border: '1px solid var(--border)', marginBottom: '2rem',
          display: 'flex', gap: '2rem',
        }}>
          {[['Width', dimensions.width], ['Height', dimensions.height], ['Depth', dimensions.depth]].map(([label, val], i, arr) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>{label} cm</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />}
            </div>
          ))}
        </div>
      )}

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
        <Link to={`/ar/${id}`} className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: 160 }}>
          <Smartphone size={17} /> View in AR
        </Link>
        {modelUrl && (
          <button
            onClick={onPreview3D}
            className="btn btn-outline btn-lg"
            style={{ flex: 1, minWidth: 140, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Box size={16} /> Preview 3D
          </button>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ flex: 1, minWidth: 140, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ShoppingBag size={15} /> Buy Similar
        </a>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.875rem', lineHeight: 1.5 }}>
        "Buy Similar" links to a partner retailer. We may earn a commission at no extra cost to you.
      </p>
    </div>
  );
};

export default ProductDetails;
