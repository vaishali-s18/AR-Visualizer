import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, Scale, DollarSign, ListFilter, Trash2 } from 'lucide-react';
import { getMyDesigns, getDesignById } from '../api/designs';
import { useAuth } from '../context/AuthContext';
import RoomScene from '../components/RoomScene';

const CompareDesigns = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const idA = searchParams.get('a') || '';
  const idB = searchParams.get('b') || '';

  // ── States ─────────────────────────────────────────────────────────────────
  const [designsList, setDesignsList] = useState([]); // List of all user's designs
  const [designA, setDesignA] = useState(null);
  const [designB, setDesignB] = useState(null);
  
  const [loadingList, setLoadingList] = useState(true);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [error, setError] = useState('');

  // ── Load User's Designs List ───────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoadingList(false);
      return;
    }

    setLoadingList(true);
    getMyDesigns()
      .then((data) => {
        setDesignsList(data);
        // If a and b are not set, default to first two designs if available
        if (!idA && !idB && data.length >= 2) {
          setSearchParams({ a: data[0]._id, b: data[1]._id });
        } else if (!idA && data.length >= 1) {
          setSearchParams({ a: data[0]._id, b: idB });
        }
      })
      .catch(() => setError('Failed to load designs.'))
      .finally(() => setLoadingList(false));
  }, [user, authLoading, setSearchParams, idA, idB]);

  // ── Load Design A Details ──────────────────────────────────────────────────
  useEffect(() => {
    if (!idA) {
      setDesignA(null);
      return;
    }
    setLoadingA(true);
    getDesignById(idA)
      .then((data) => {
        const items = (data.items || []).map(item => {
          const prod = item.productId || {};
          return {
            uuid: Math.random().toString(36).slice(2, 9),
            productId: prod._id || item.productId,
            name: prod.name || 'Unknown Item',
            modelUrl: prod.modelUrl || '',
            thumbnailUrl: prod.thumbnailUrl || '',
            price: prod.price || 0,
            dimensions: prod.dimensions || {},
            position: item.position,
            rotation: item.rotation,
            scale: item.scale,
            color: item.color || '',
            finish: item.finish || 'original',
            isScaled: true,
          };
        });
        setDesignA({ ...data, items });
      })
      .catch(() => setDesignA(null))
      .finally(() => setLoadingA(false));
  }, [idA]);

  // ── Load Design B Details ──────────────────────────────────────────────────
  useEffect(() => {
    if (!idB) {
      setDesignB(null);
      return;
    }
    setLoadingB(true);
    getDesignById(idB)
      .then((data) => {
        const items = (data.items || []).map(item => {
          const prod = item.productId || {};
          return {
            uuid: Math.random().toString(36).slice(2, 9),
            productId: prod._id || item.productId,
            name: prod.name || 'Unknown Item',
            modelUrl: prod.modelUrl || '',
            thumbnailUrl: prod.thumbnailUrl || '',
            price: prod.price || 0,
            dimensions: prod.dimensions || {},
            position: item.position,
            rotation: item.rotation,
            scale: item.scale,
            color: item.color || '',
            finish: item.finish || 'original',
            isScaled: true,
          };
        });
        setDesignB({ ...data, items });
      })
      .catch(() => setDesignB(null))
      .finally(() => setLoadingB(false));
  }, [idB]);

  // Handle dropdown selection changes
  const handleSelectChange = (side, designId) => {
    if (side === 'a') {
      setSearchParams({ a: designId, b: idB });
    } else {
      setSearchParams({ a: idA, b: designId });
    }
  };

  // Calculate prices
  const getBudget = (design) => {
    if (!design || !design.items) return 0;
    return design.items.reduce((sum, item) => sum + item.price, 0);
  };

  const budgetA = getBudget(designA);
  const budgetB = getBudget(designB);

  // ── Route Guards ───────────────────────────────────────────────────────────
  if (authLoading || loadingList) {
    return (
      <div style={{ paddingTop: 80, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }}>
            <circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Loading comparison...</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { to { transform: rotate(360deg); } }' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ paddingTop: 80, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Login Required</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>Please sign in to compare your saved designs.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (designsList.length === 0) {
    return (
      <div style={{ paddingTop: 80, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem', maxWidth: 460 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📋</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>No Designs Saved Yet</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            You need to create and save at least two designs in the AR room visualizer to compare them side-by-side.
          </p>
          <Link to="/catalogue" className="btn btn-primary">Explore catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0', flexShrink: 0 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <button
              onClick={() => navigate('/designs')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '0.85rem', marginBottom: 4 }}
            >
              <ArrowLeft size={14} /> Back to Saved Designs
            </button>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={24} style={{ color: 'var(--tan)' }} /> Compare Designs
            </h1>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', background: 'var(--surface-2)', padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--border)' }}>
            Comparing <strong style={{ color: 'var(--text)' }}>{designA?.roomName || 'Select Design A'}</strong> vs <strong style={{ color: 'var(--text)' }}>{designB?.roomName || 'Select Design B'}</strong>
          </div>
        </div>
      </div>

      {/* ── Side-by-Side Comparison Layout ──────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }} className="compare-workspace">
        
        {/* Left Side: Design A */}
        <div style={{ flex: 1, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
          {/* Top selection area */}
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)' }}>Design A:</span>
            <select
              value={idA}
              onChange={(e) => handleSelectChange('a', e.target.value)}
              className="input"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto', flex: 1, cursor: 'pointer' }}
            >
              <option value="">Select a layout...</option>
              {designsList.map(d => (
                <option key={d._id} value={d._id} disabled={d._id === idB}>{d.roomName}</option>
              ))}
            </select>
          </div>

          {/* 3D Scene viewport A */}
          <div style={{ height: '360px', background: '#F0EFEA', position: 'relative' }}>
            {loadingA ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(240,239,234,0.8)', zIndex: 10 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>Loading layout...</p>
              </div>
            ) : designA ? (
              <RoomScene
                placedItems={designA.items}
                selectedItemUuid={null} // Read-only viewing mode
                onSelectItem={() => {}}
                onUpdateItemTransform={() => {}}
                roomDimensions={designA.roomDimensions}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '0.9rem' }}>
                Select a saved design above.
              </div>
            )}
          </div>

          {/* Details & Furniture List A */}
          {designA && (
            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Layout Summary</h3>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>₹{budgetA.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {designA.items.map((item, index) => (
                  <div key={item.uuid} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg)', padding: '0.6rem 0.875rem', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 700 }}>#{index+1}</span>
                    <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', flexShrink: 0 }}>
                      {item.modelUrl ? (
                        <model-viewer src={item.modelUrl} alt={item.name} auto-rotate rotation-per-second="15deg" camera-orbit="45deg 75deg 105%" loading="lazy" reveal="auto" style={{ width: '100%', height: '100%', display: 'block', '--poster-color': 'var(--surface)' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'var(--text-3)' }}>3D</div>
                      )}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-2)' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
                {designA.items.length === 0 && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', textAlign: 'center', padding: '1rem 0' }}>No furniture items in this design.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Design B */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
          {/* Top selection area */}
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)' }}>Design B:</span>
            <select
              value={idB}
              onChange={(e) => handleSelectChange('b', e.target.value)}
              className="input"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto', flex: 1, cursor: 'pointer' }}
            >
              <option value="">Select a layout...</option>
              {designsList.map(d => (
                <option key={d._id} value={d._id} disabled={d._id === idA}>{d.roomName}</option>
              ))}
            </select>
          </div>

          {/* 3D Scene viewport B */}
          <div style={{ height: '360px', background: '#F0EFEA', position: 'relative' }}>
            {loadingB ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(240,239,234,0.8)', zIndex: 10 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>Loading layout...</p>
              </div>
            ) : designB ? (
              <RoomScene
                placedItems={designB.items}
                selectedItemUuid={null} // Read-only viewing mode
                onSelectItem={() => {}}
                onUpdateItemTransform={() => {}}
                roomDimensions={designB.roomDimensions}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '0.9rem' }}>
                Select a saved design above.
              </div>
            )}
          </div>

          {/* Details & Furniture List B */}
          {designB && (
            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Layout Summary</h3>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>₹{budgetB.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {designB.items.map((item, index) => (
                  <div key={item.uuid} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg)', padding: '0.6rem 0.875rem', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 700 }}>#{index+1}</span>
                    <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', flexShrink: 0 }}>
                      {item.modelUrl ? (
                        <model-viewer src={item.modelUrl} alt={item.name} auto-rotate rotation-per-second="15deg" camera-orbit="45deg 75deg 105%" loading="lazy" reveal="auto" style={{ width: '100%', height: '100%', display: 'block', '--poster-color': 'var(--surface)' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'var(--text-3)' }}>3D</div>
                      )}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-2)' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
                {designB.items.length === 0 && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', textAlign: 'center', padding: '1rem 0' }}>No furniture items in this design.</p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 800px) {
          .compare-workspace { flex-direction: column !important; overflow-y: auto !important; }
          .compare-workspace > div { border-right: none !important; border-bottom: 2px solid var(--border); }
        }
      `}</style>
    </div>
  );
};

export default CompareDesigns;
