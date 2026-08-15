import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical } from 'lucide-react';

// ─── SavedDesigns (My Designs workspace view) ────────────────────────────────
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

  const formatDate = (iso) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffDays === 0) return 'Edited today';
    if (diffDays === 1) return 'Edited 1 day ago';
    if (diffDays < 7) return `Edited ${diffDays} days ago`;
    if (diffWeeks === 1) return 'Edited 1 week ago';
    return `Edited ${diffWeeks} weeks ago`;
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)' }}>

      <div className="container" style={{ padding: '3rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.5rem' }}>
              Workspace
            </p>
            <h1 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              fontWeight: 600,
            }}>
              My Designs
            </h1>
          </div>

          <Link to="/ar/p004" className="btn btn-primary">
            <Plus size={18} /> New Design
          </Link>
        </div>

        {designs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '6rem 2rem',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>No saved designs yet</h3>
            <p style={{ color: 'var(--text-2)', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: 420, margin: '0 auto 2.5rem' }}>
              Create your first AR room design and start visualizing furniture in your space.
            </p>
            <Link to="/ar/p004" className="btn btn-primary btn-lg">
              <Plus size={18} /> Create Your First Design
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
          }}>
            {designs.map(design => (
              <DesignCard
                key={design.id}
                design={design}
                onDelete={handleDelete}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

// ─── Design Card ──────────────────────────────────────────────────────────────
const DesignCard = ({ design, onDelete, formatDate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'all 0.2s',
      position: 'relative',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail */}
      <Link to={`/ar/${design.productId}`} style={{ display: 'block' }}>
        <div style={{
          aspectRatio: '16/9',
          background: 'var(--bg)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Room illustration */}
          <svg viewBox="0 0 640 360" style={{ width: '100%', height: '100%' }} fill="none">
            <rect width="640" height="360" fill="#F5F0E8"/>
            <rect x="0" y="0" width="120" height="240" fill="#EDE8E0"/>
            <rect x="520" y="0" width="120" height="240" fill="#E8E0D8"/>
            <rect x="120" y="0" width="400" height="240" fill="#F5F0E8"/>
            <polygon points="0,360 120,240 520,240 640,360" fill="#E0D8CC"/>
            <rect x="220" y="40" width="200" height="120" rx="4" fill="#C8D8E0" opacity="0.5"/>
            <line x1="320" y1="40" x2="320" y2="160" stroke="#B0C0C8" strokeWidth="2"/>
            <line x1="220" y1="100" x2="420" y2="100" stroke="#B0C0C8" strokeWidth="2"/>
            <rect x="200" y="270" width="240" height="60" rx="8" fill="#9B8B7E" opacity="0.7"/>
            <rect x="200" y="260" width="240" height="20" rx="6" fill="#8A7A6E" opacity="0.7"/>
            <ellipse cx="320" cy="300" rx="8" ry="8" fill="var(--accent)" opacity="0.3"/>
            <text x="320" y="300" textAnchor="middle" dominantBaseline="middle" fill="var(--accent)" fontSize="8" fontWeight="600">AR</text>
          </svg>

          {/* Piece count badge */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 8,
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            {Math.floor(Math.random() * 8) + 3} pieces
          </div>

          {/* Menu button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.95)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: 48,
              right: 12,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              boxShadow: 'var(--shadow)',
              minWidth: 140,
              zIndex: 10,
            }}
              onClick={(e) => e.preventDefault()}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(design.id);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#dc2626',
                  fontWeight: 500,
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.25rem',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {design.roomName || design.productName}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
              {formatDate(design.savedAt)}
            </p>
          </div>
          <Link
            to={`/ar/${design.productId}`}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem' }}
          >
            Open
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavedDesigns;
