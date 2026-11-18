import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, RefreshCw, Scale } from 'lucide-react';
import { getMyDesigns, deleteDesign as deleteDesignApi } from '../api/designs';

// ─── SavedDesigns ─────────────────────────────────────────────────────────────
const SavedDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // ── Comparison State ───────────────────────────────────────────────────────
  const [compareMode, setCompareMode] = useState(false);
  const [selectedDesigns, setSelectedDesigns] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyDesigns();
      setDesigns(data);
    } catch {
      setError('Failed to load your designs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    try {
      await deleteDesignApi(id);
      setDesigns(prev => prev.filter(d => d._id !== id));
      setSelectedDesigns(prev => prev.filter(selectedId => selectedId !== id));
    } catch {
      // Silently ignore — user can try again
    }
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    const now   = new Date();
    const days  = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    if (days === 0) return 'Edited today';
    if (days === 1) return 'Edited 1 day ago';
    if (days < 7)  return `Edited ${days} days ago`;
    if (weeks === 1) return 'Edited 1 week ago';
    return `Edited ${weeks} weeks ago`;
  };

  const handleToggleSelect = (designId) => {
    setSelectedDesigns(prev => {
      if (prev.includes(designId)) {
        return prev.filter(id => id !== designId);
      }
      if (prev.length < 2) {
        return [...prev, designId];
      }
      // If 2 are already selected, displace the first one
      return [prev[1], designId];
    });
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container" style={{ padding: '3rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.5rem' }}>
              Workspace
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600 }}>
              My Designs
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {designs.length >= 2 && (
              <button
                onClick={() => {
                  setCompareMode(!compareMode);
                  setSelectedDesigns([]);
                }}
                className={compareMode ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 999 }}
              >
                <Scale size={16} /> {compareMode ? 'Cancel Compare' : 'Compare Designs'}
              </button>
            )}
            <Link to="/catalogue" className="btn btn-primary">
              <Plus size={18} /> New Design
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ aspectRatio: '16/9', background: 'var(--bg)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ height: 16, background: 'var(--bg)', borderRadius: 6, width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ height: 12, background: 'var(--bg)', borderRadius: 6, width: '35%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem' }}>{error}</p>
            <button className="btn btn-outline" onClick={load} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={14} /> Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && designs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
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
            <Link to="/catalogue" className="btn btn-primary btn-lg">
              <Plus size={18} /> Create Your First Design
            </Link>
          </div>
        )}

        {/* Designs grid */}
        {!loading && !error && designs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            {designs.map(design => (
              <DesignCard
                key={design._id}
                design={design}
                onDelete={handleDelete}
                formatDate={formatDate}
                compareMode={compareMode}
                isSelected={selectedDesigns.includes(design._id)}
                onToggleSelect={() => handleToggleSelect(design._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Comparison Action Bar */}
      {compareMode && selectedDesigns.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          boxShadow: 'var(--shadow-lg)',
          padding: '1.125rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          zIndex: 100,
          animation: 'fadeIn 0.25s ease-out forwards',
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)' }}>
            Selected <strong style={{ color: 'var(--text)' }}>{selectedDesigns.length}</strong> / 2 layouts
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setSelectedDesigns([])}
              className="btn btn-outline btn-sm"
              style={{ borderRadius: 999 }}
            >
              Clear
            </button>
            <Link
              to={`/compare?a=${selectedDesigns[0] || ''}&b=${selectedDesigns[1] || ''}`}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: 999,
                pointerEvents: selectedDesigns.length === 2 ? 'auto' : 'none',
                opacity: selectedDesigns.length === 2 ? 1 : 0.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Scale size={14} /> Compare Side-by-Side
            </Link>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, 15px); } to { opacity: 1; transform: translate(-50%, 0); } }
      ` }} />
    </div>
  );
};

// ─── Design Card ──────────────────────────────────────────────────────────────
const DesignCard = ({ design, onDelete, formatDate, compareMode, isSelected, onToggleSelect }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // items inside design layout
  const items = design.items || [];
  const itemCount = items.length;

  // First item modelUrl is used as the cover preview
  const firstModelUrl = items.length > 0 && items[0].productId ? items[0].productId.modelUrl : null;
  const productName = design.roomName || 'Untitled Design';

  const handleClick = (e) => {
    if (compareMode) {
      e.preventDefault();
      onToggleSelect();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'var(--surface)',
        border: `1.5px solid ${compareMode && isSelected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'all 0.2s',
        position: 'relative',
        cursor: compareMode ? 'pointer' : 'default',
        boxShadow: compareMode && isSelected ? 'var(--shadow)' : 'none'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = compareMode && isSelected ? 'var(--shadow)' : 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Compare Checkbox Indicator */}
      {compareMode && (
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.9)',
          border: `2.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.15s'
        }}>
          {isSelected && <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>✓</span>}
        </div>
      )}

      {/* Thumbnail */}
      <Link
        to={compareMode ? "#" : `/ar/design/${design._id}`}
        style={{ display: 'block' }}
        onClick={compareMode ? (e) => e.preventDefault() : undefined}
      >
        <div style={{ aspectRatio: '16/9', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
          {firstModelUrl ? (
            <model-viewer
              src={firstModelUrl}
              alt={productName}
              auto-rotate
              rotation-per-second="12deg"
              camera-orbit="45deg 75deg 105%"
              field-of-view="30deg"
              shadow-intensity="0.6"
              loading="lazy"
              reveal="auto"
              style={{ width: '100%', height: '100%', display: 'block', '--poster-color': 'var(--bg)' }}
            />
          ) : (
            <svg viewBox="0 0 640 360" style={{ width: '100%', height: '100%' }} fill="none">
              <rect width="640" height="360" fill="#F5F0E8"/>
              <rect x="0" y="0" width="120" height="240" fill="#EDE8E0"/>
              <rect x="520" y="0" width="120" height="240" fill="#E8E0D8"/>
              <rect x="120" y="0" width="400" height="240" fill="#F5F0E8"/>
              <polygon points="0,360 120,240 520,240 640,360" fill="#E0D8CC"/>
              <rect x="220" y="40" width="200" height="120" rx="4" fill="#C8D8E0" opacity="0.5"/>
              <rect x="200" y="270" width="240" height="60" rx="8" fill="#9B8B7E" opacity="0.7"/>
              <ellipse cx="320" cy="300" rx="8" ry="8" fill="var(--accent)" opacity="0.3"/>
              <text x="320" y="300" textAnchor="middle" dominantBaseline="middle" fill="var(--accent)" fontSize="8" fontWeight="600">AR</text>
            </svg>
          )}

          {/* Menu button — disabled during Compare Mode */}
          {!compareMode && (
            <>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen); }}
                style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11 }}
              >
                <MoreVertical size={16} />
              </button>

              {menuOpen && (
                <div
                  style={{ position: 'absolute', top: 48, right: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: 'var(--shadow)', minWidth: 140, zIndex: 20 }}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); handleDelete(design._id); }}
                    style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#dc2626', fontWeight: 500 }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1, overflow: 'hidden', paddingRight: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {design.roomName || 'Untitled Room'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
              {formatDate(design.updatedAt || design.createdAt)} · {itemCount} item{itemCount !== 1 ? 's' : ''}
            </p>
          </div>
          {!compareMode && (
            <Link to={`/ar/design/${design._id}`} className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem', borderRadius: 8 }}>
              Open
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedDesigns;
