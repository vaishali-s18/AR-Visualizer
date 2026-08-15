import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Smartphone, ShoppingCart, ExternalLink, Shield, RotateCcw } from 'lucide-react';
import { getProductById, filterProducts } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';

// Phase 2 components
import ModelPreview      from '../components/catalogue/ModelPreview';
import ModelPreviewModal from '../components/catalogue/ModelPreviewModal';
import ProductDetails    from '../components/catalogue/ProductDetails';

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id);
  const [modalOpen, setModalOpen] = useState(false);

  if (!product) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.25rem', opacity: 0.4 }}>🔍</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2rem', fontSize: '0.9rem' }}>This product doesn't exist or has been removed.</p>
          <Link to="/catalogue" className="btn btn-primary">Back to Catalogue</Link>
        </div>
      </div>
    );
  }

  const { name, category } = product;

  // Related products in same category (excluding current)
  const related = filterProducts({ category }).filter(p => p.id !== id).slice(0, 4);

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="container" style={{ padding: '0.875rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-3)' }}>
          <Link to="/" style={{ color: 'var(--text-3)', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color='var(--accent)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}>Home</Link>
          <ChevronRight size={11} />
          <Link to="/catalogue" style={{ color: 'var(--text-3)', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color='var(--accent)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}>Catalogue</Link>
          <ChevronRight size={11} />
          <Link to={`/catalogue?category=${category}`} style={{ color: 'var(--text-3)', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color='var(--accent)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}>{category}</Link>
          <ChevronRight size={11} />
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{name}</span>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>

        {/* ── Two-column layout ──────────────────────────────────────── */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', marginBottom: '5rem' }}
          className="detail-grid"
        >
          {/* ── Left: 3D model preview (Phase 2) ────────────────────── */}
          <div>
            {/* R3F interactive preview */}
            <div style={{
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <ModelPreview
                modelUrl={product.modelUrl}
                productName={name}
                height={440}
              />
            </div>

            {/* AR tip */}
            <div style={{
              marginTop: '1rem', background: 'var(--accent-dim)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 12, padding: '0.875rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <Smartphone size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.82rem', color: 'var(--accent)', lineHeight: 1.4 }}>
                <strong>AR available on mobile.</strong> Open this page on your phone and tap "View in AR" for a real-time WebXR preview in your room.
              </p>
            </div>

            {/* Buy CTA below model on mobile */}
            {product.affiliateUrl && product.inStock && (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', fontSize: '0.925rem' }}
              >
                <ShoppingCart size={17} /> Buy on {product.affiliateLabel === 'amazon' ? 'Amazon' : 'Flipkart'}
                <ExternalLink size={13} style={{ opacity: 0.7 }} />
              </a>
            )}

            {/* Trust signals */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
              {[
                { icon: <Shield size={13} />, text: 'Secure Checkout' },
                { icon: <RotateCcw size={13} />, text: 'Easy Returns' },
              ].map(t => (
                <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                  {t.icon} {t.text}
                </div>
              ))}
            </div>

            {/* Mobile-AR fallback: model-viewer hidden visually but present for WebXR */}
            <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
              <model-viewer
                src={product.modelUrl}
                alt={`3D model of ${name}`}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
              />
            </div>
          </div>

          {/* ── Right: Product details panel ──────────────────────── */}
          <ProductDetails
            product={product}
            onPreview3D={() => setModalOpen(true)}
          />
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                More in {category}
              </h2>
              <Link to={`/catalogue?category=${category}`} style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>

      {/* 3D Preview Modal */}
      {modalOpen && (
        <ModelPreviewModal
          product={product}
          onClose={() => setModalOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
