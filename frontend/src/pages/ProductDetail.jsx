import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Smartphone, ShoppingCart, ExternalLink, Shield, RotateCcw, Box } from 'lucide-react';
import { getProductById, getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

import ModelPreview      from '../components/catalogue/ModelPreview';
import ModelPreviewModal from '../components/catalogue/ModelPreviewModal';
import ProductDetails    from '../components/catalogue/ProductDetails';
import ARViewer          from '../components/ARViewer';

const ProductDetail = () => {
  const { id } = useParams();
  const [product,     setProduct]     = useState(null);
  const [related,     setRelated]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [previewMode, setPreviewMode] = useState('3d'); // '3d' | 'ar'

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const prod = await getProductById(id);
        if (cancelled) return;
        setProduct(prod);
        // Fetch related products in the same category (exclude current)
        const all = await getProducts({ category: prod.category });
        if (cancelled) return;
        setRelated(all.filter(p => (p._id || p.id) !== id).slice(0, 4));
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [id]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }}>
            <circle cx="12" cy="12" r="10" opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Loading product…</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { to { transform: rotate(360deg); } }' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.25rem', opacity: 0.4 }}>🔍</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2rem', fontSize: '0.9rem' }}>This product doesn't exist or has been removed.</p>
          <Link to="/catalogue" className="btn btn-primary">Back to Catalogue</Link>
        </div>
      </div>
    );
  }

  const { name, category } = product;
  const productId = product._id || product.id;

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

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', marginBottom: '5rem' }} className="detail-grid">

          {/* Left: 3D model preview + AR Room Viewer */}
          <div>
            {/* View Mode Switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                onClick={() => setPreviewMode('3d')}
                className={previewMode === '3d' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                style={{ borderRadius: 99, fontSize: '0.78rem', padding: '0.35rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Box size={14} /> 3D Studio
              </button>
              <button
                onClick={() => setPreviewMode('ar')}
                className={previewMode === 'ar' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                style={{ borderRadius: 99, fontSize: '0.78rem', padding: '0.35rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Smartphone size={14} /> AR Room View
              </button>
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
              {previewMode === 'ar' ? (
                <ARViewer glbUrl={product.modelUrl} name={name} height={440} productId={id} />
              ) : (
                <ModelPreview modelUrl={product.modelUrl} productName={name} imageUrl={product.imageUrl || product.thumbnailUrl} height={440} />
              )}
            </div>

            {/* AR tip */}
            <div style={{ marginTop: '1rem', background: 'var(--accent-dim)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 12, padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Smartphone size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.82rem', color: 'var(--accent)', lineHeight: 1.4, margin: 0 }}>
                <strong>True-to-Scale AR:</strong> Switch to "AR Room View" above or open on mobile to project this furniture piece directly onto your floor at actual physical size.
              </p>
            </div>

            {/* Buy CTA */}
            {product.affiliateUrl && product.inStock && (
              <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', fontSize: '0.925rem' }}>
                <ShoppingCart size={17} /> Buy Now
                <ExternalLink size={13} style={{ opacity: 0.7 }} />
              </a>
            )}

            {/* Trust signals */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
              {[{ icon: <Shield size={13} />, text: 'Secure Checkout' }, { icon: <RotateCcw size={13} />, text: 'Easy Returns' }].map(t => (
                <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                  {t.icon} {t.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: product details */}
          <ProductDetails product={product} onPreview3D={() => setModalOpen(true)} />
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>More in {category}</h2>
              <Link to={`/catalogue?category=${category}`} style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
              {related.map(p => <ProductCard key={p._id || p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* 3D Preview Modal */}
      {modalOpen && <ModelPreviewModal product={product} onClose={() => setModalOpen(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }
      ` }} />
    </div>
  );
};

export default ProductDetail;
