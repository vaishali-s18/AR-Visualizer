import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Smartphone } from 'lucide-react';
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
      <div style={{ paddingTop: 68 }}>
        <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem' }}>This product doesn't exist or has been removed.</p>
          <Link to="/catalogue" className="btn btn-primary">Back to Catalogue</Link>
        </div>
      </div>
    );
  }

  const { name, category } = product;

  // Related products in same category (excluding current)
  const related = filterProducts({ category }).filter(p => p.id !== id).slice(0, 4);

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div className="container" style={{ padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-3)' }}>
          <Link to="/"           style={{ color: 'var(--text-3)' }}>Home</Link>
          <ChevronRight size={12} />
          <Link to="/catalogue"  style={{ color: 'var(--text-3)' }}>Catalogue</Link>
          <ChevronRight size={12} />
          <Link to={`/catalogue?category=${category}`} style={{ color: 'var(--text-3)' }}>{category}</Link>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>{name}</span>
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
              marginTop: '1rem', background: 'rgba(59,74,58,0.06)',
              border: '1px solid rgba(59,74,58,0.15)',
              borderRadius: 12, padding: '0.875rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <Smartphone size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.82rem', color: 'var(--accent)', lineHeight: 1.4 }}>
                <strong>AR available on mobile.</strong> Open this page on your phone and tap "View in AR" for a real-time WebXR preview in your room.
              </p>
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
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              More in {category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
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
