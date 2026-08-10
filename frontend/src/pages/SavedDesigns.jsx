import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Smartphone, Eye, Clock } from 'lucide-react';

// ─── SavedDesigns ─────────────────────────────────────────────────────────────
// Reads saved designs from localStorage (mock mode).
// When backend is connected, swap the load / delete helpers below.
const SavedDesigns = () => {
  const [designs, setDesigns] = useState([]);

  const load = () => {
    try {
      const raw = localStorage.getItem('ar_saved_designs');
      setDesigns(raw ? JSON.parse(raw) : []);
    } catch {
      setDesigns([]);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    const next = designs.filter(d => d.id !== id);
    localStorage.setItem('ar_saved_designs', JSON.stringify(next));
    setDesigns(next);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <div className="section-label">Your Collection</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Saved Designs
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '1rem' }}>
            Your AR furniture placements, saved for later.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>

        {designs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '6rem 2rem',
            background: 'var(--surface)', borderRadius: 20,
            border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(59,74,58,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <Bookmark size={32} style={{ color: 'var(--accent)' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem' }}>No saved designs yet</h3>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '2rem', maxWidth: 360, margin: '0 auto 2rem' }}>
              Go to any product page, click "View in AR" to visualize it in your space, then save your favourite placement.
            </p>
            <Link to="/catalogue" className="btn btn-primary btn-lg">Browse Furniture Catalogue</Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginBottom: '1.5rem' }}>
              {designs.length} saved {designs.length === 1 ? 'design' : 'designs'}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}>
              {designs.map(design => (
                <div key={design.id} className="card" style={{ overflow: 'hidden' }}>

                  {/* Thumbnail placeholder */}
                  <div style={{
                    background: 'var(--surface-2)', aspectRatio: '16/9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', borderBottom: '1px solid var(--border)',
                  }}>
                    <svg viewBox="0 0 400 225" style={{ width: '100%', height: '100%' }} fill="none">
                      <rect width="400" height="225" fill="#EDEAE4"/>
                      <rect x="0" y="0" width="80" height="150" fill="#E0DAD0"/>
                      <rect x="320" y="0" width="80" height="150" fill="#D8D0C4"/>
                      <rect x="80" y="0" width="240" height="150" fill="#EBE6DE"/>
                      <polygon points="0,225 80,150 320,150 400,225" fill="#CFC8BC"/>
                      <text x="200" y="120" textAnchor="middle" fill="#9B9088" fontSize="11" fontFamily="Inter,sans-serif">{design.productName}</text>
                      {/* Small furniture silhouette */}
                      <rect x="150" y="155" width="100" height="45" rx="6" fill="#8C7B6E" opacity="0.6"/>
                    </svg>

                    {/* AR badge */}
                    <div style={{
                      position: 'absolute', top: 10, left: 10,
                      background: 'rgba(59,74,58,0.88)', color: '#fff',
                      padding: '0.25rem 0.6rem', borderRadius: 6,
                      fontSize: '0.68rem', fontWeight: 700,
                    }}>
                      AR Placed
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '1.125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{design.productName}</p>
                        <span className="badge">{design.category}</span>
                      </div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                        ₹{design.price?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', margin: '0.6rem 0 1rem' }}>
                      <Clock size={12} style={{ color: 'var(--text-3)' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Saved {formatDate(design.savedAt)}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/products/${design.productId}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                        <Eye size={13} /> View
                      </Link>
                      <Link to={`/ar/${design.productId}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                        <Smartphone size={13} /> AR
                      </Link>
                      <button
                        onClick={() => handleDelete(design.id)}
                        style={{
                          padding: '0.45rem 0.7rem', borderRadius: 8, cursor: 'pointer',
                          background: 'rgba(220,38,38,0.07)', border: '1.5px solid rgba(220,38,38,0.2)',
                          color: '#dc2626', display: 'flex', alignItems: 'center',
                        }}
                        aria-label="Delete design"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedDesigns;
