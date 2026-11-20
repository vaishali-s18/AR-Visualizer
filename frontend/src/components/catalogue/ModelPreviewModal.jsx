import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, Smartphone, Package, Ruler, Box } from 'lucide-react';
import ModelPreview from './ModelPreview';
import ARViewer from '../ARViewer';

// ─── ModelPreviewModal ────────────────────────────────────────────────────────
// Full-screen overlay that lets the user rotate/inspect a GLB model
// before committing to AR. Renders via a React portal into document.body.
// Props: product (object), onClose (fn)
const ModelPreviewModal = ({ product, onClose }) => {
  const backdropRef = useRef();
  const [modalMode, setModalMode] = useState('3d'); // '3d' | 'ar'

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden'; // lock scroll
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Close on backdrop click (but not on content click)
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  if (!product) return null;

  const id = product._id || product.id;
  const { name, category, material, color, dimensions, modelUrl, imageUrl, thumbnailUrl, price } = product;

  const modal = (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`3D preview of ${name}`}
    >
      <div className="modal-panel">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
              {modalMode === 'ar' ? 'Augmented Reality' : '3D Preview'}
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>
              {name}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', background: 'var(--surface-2)', padding: 3, borderRadius: 99, border: '1px solid var(--border)' }}>
              <button
                onClick={() => setModalMode('3d')}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 99,
                  border: 'none',
                  background: modalMode === '3d' ? 'var(--accent)' : 'transparent',
                  color: modalMode === '3d' ? '#fff' : 'var(--text-2)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Box size={13} /> 3D
              </button>
              <button
                onClick={() => setModalMode('ar')}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 99,
                  border: 'none',
                  background: modalMode === 'ar' ? 'var(--accent)' : 'transparent',
                  color: modalMode === 'ar' ? '#fff' : 'var(--text-2)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Smartphone size={13} /> AR
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Close preview"
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '50%', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }} className="modal-body">

          {/* 3D canvas / AR Viewer — takes most space */}
          <div style={{ flex: 1, minWidth: 0, background: 'var(--bg)', position: 'relative' }}>
            {modalMode === 'ar' ? (
              <ARViewer glbUrl={modelUrl} name={name} height="100%" productId={id} />
            ) : (
              <ModelPreview modelUrl={modelUrl} productName={name} imageUrl={imageUrl || thumbnailUrl} height="100%" />
            )}
          </div>

          {/* Sidebar */}
          <div style={{
            width: 220, flexShrink: 0,
            borderLeft: '1px solid var(--border)',
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '1rem',
          }} className="modal-sidebar">

            {/* Price */}
            <div>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Price</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
                ₹{price.toLocaleString('en-IN')}
              </p>
            </div>

            <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />

            {/* Category */}
            <InfoRow icon={<span>🏷️</span>} label="Category" value={category} />

            {/* Material */}
            {material && <InfoRow icon={<Package size={13}/>} label="Material" value={material} />}

            {/* Color */}
            {color && <InfoRow icon={<span>🎨</span>} label="Color" value={color} />}

            {/* Dimensions */}
            {dimensions && (
              <div>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Ruler size={11} /> Dimensions
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                  {[['W', dimensions.width], ['H', dimensions.height], ['D', dimensions.depth]].map(([l, v]) => (
                    <div key={l} style={{ background: 'var(--surface-2)', borderRadius: 6, padding: '0.4rem', textAlign: 'center', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>{v}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-3)', textTransform: 'uppercase' }}>{l} cm</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto' }} />

            {/* CTA */}
            <Link
              to={`/ar/${id}`}
              className="btn btn-primary"
              onClick={onClose}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Smartphone size={15} /> View in AR
            </Link>
            <Link
              to={`/products/${id}`}
              className="btn btn-outline btn-sm"
              onClick={onClose}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

// ─── Small info row ───────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div>
    <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
      {icon} {label}
    </p>
    <p style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 }}>{value}</p>
  </div>
);

export default ModelPreviewModal;
