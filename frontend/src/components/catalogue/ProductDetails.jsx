import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Smartphone, Star, Package, Ruler, ShoppingCart, Box, Truck, ShieldCheck, Zap,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductDetails = ({ product, onPreview3D }) => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();

  const id = product._id || product.id;
  const {
    name, category, price, description,
    dimensions, material, color, inStock,
    rating, reviews, badge, modelUrl,
  } = product;

  const stars = Math.round(rating || 0);

  return (
    <div>
      {/* Back button */}
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
          className="badge"
          style={{ background: 'var(--tan-light, #F7F3EC)', color: 'var(--tan-dark, #9A7A52)', borderColor: 'rgba(196,165,123,0.3)' }}
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
        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
        fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text)',
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
                fill: i <= stars ? '#F59E0B' : 'var(--border)',
                color: i <= stars ? '#F59E0B' : 'var(--border)',
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)' }}>{rating || 4.8}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>({reviews || 124} customer reviews)</span>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.25rem', fontWeight: 700, color: 'var(--text)',
        }}>
          ₹{Number(price || 0).toLocaleString('en-IN')}
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>inclusive of all taxes</span>
      </div>

      {/* Primary Action Buttons (Buy Now & Add to Cart) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => buyNow(product)}
            className="btn btn-primary btn-lg"
            style={{ flex: 1, minWidth: 160, justifyContent: 'center' }}
          >
            <Zap size={16} /> Buy Now
          </button>

          <button
            onClick={() => addToCart(product, 1)}
            className="btn btn-outline btn-lg"
            style={{ flex: 1, minWidth: 160, justifyContent: 'center' }}
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>

        {/* View in AR Button */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            to={`/ar/${id}`}
            className="btn btn-tan"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Smartphone size={16} /> Project in Your Room (AR)
          </Link>

          {modelUrl && (
            <button
              onClick={onPreview3D}
              className="btn btn-outline"
              style={{ padding: '0.875rem 1.25rem' }}
              title="Inspect 3D Geometry"
            >
              <Box size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Delivery Info Banner */}
      <div style={{
        background: 'var(--surface-2)',
        borderRadius: 16,
        padding: '1.25rem',
        border: '1px solid var(--border)',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Truck size={16} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
              Free Standard Delivery available across India
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
              Estimated arrival: 3-5 business days · Tracking provided upon dispatch
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(196,165,123,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={16} style={{ color: 'var(--tan-dark, #9A7A52)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
              White-Glove In-Room Assembly Option (₹499)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
              Includes elevator transfer, room positioning, unboxing, and debris removal
            </div>
          </div>
        </div>
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
          border: '1px solid var(--border)', marginBottom: '1rem',
          display: 'flex', gap: '1rem',
        }}>
          {[['Width', dimensions.width], ['Height', dimensions.height], ['Depth', dimensions.depth]].map(([label, val], i, arr) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>{label} cm</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
