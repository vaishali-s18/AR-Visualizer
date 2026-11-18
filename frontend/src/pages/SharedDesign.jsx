import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSharedDesign } from '../api/designs';
import RoomScene from '../components/RoomScene';

const DEFAULT_ROOM_DIMENSIONS = { width: 8, depth: 8, height: 3.5 };

const SharedDesign = () => {
  const { token } = useParams();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getSharedDesign(token)
      .then(data => {
        if (!active) return;
        const items = (data.items || []).map((item, index) => {
          const product = item.productId || {};
          return {
            uuid: `${product._id || 'item'}-${index}`,
            productId: product._id,
            name: product.name || 'Furniture item',
            modelUrl: product.modelUrl || '',
            thumbnailUrl: product.thumbnailUrl || '',
            price: Number(product.price) || 0,
            dimensions: product.dimensions || {},
            position: item.position || { x: 0, y: 0, z: 0 },
            rotation: item.rotation || 0,
            scale: item.scale || 1,
            color: item.color || '',
            finish: item.finish || 'original',
            isScaled: true,
          };
        });
        setDesign({ ...data, items });
      })
      .catch(() => {
        if (active) setError('This shared design is unavailable. The owner may have revoked the link.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [token]);

  if (loading || error) {
    return (
      <div style={{ minHeight: '75vh', padding: '7rem 2rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '0.75rem' }}>
            {loading ? 'Loading shared room…' : 'Design link unavailable'}
          </h1>
          {error && <p role="alert" style={{ color: 'var(--text-2)', marginBottom: '1.5rem' }}>{error}</p>}
          {error && <Link to="/catalogue" className="btn btn-primary">Explore furniture</Link>}
        </div>
      </div>
    );
  }

  const roomDimensions = design.roomDimensions || DEFAULT_ROOM_DIMENSIONS;
  const total = design.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <main style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>Shared room · view only</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', fontWeight: 600 }}>{design.roomName || 'Room design'}</h1>
            <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              {roomDimensions.width} m × {roomDimensions.depth} m · ceiling {roomDimensions.height} m
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{design.items.length} furniture item{design.items.length === 1 ? '' : 's'}</p>
            <strong style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>₹{total.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div style={{ height: 'min(65vh, 680px)', minHeight: 360, border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: '#F5F3F0' }}>
          <RoomScene
            placedItems={design.items}
            selectedItemUuid={null}
            onSelectItem={() => {}}
            onUpdateItemTransform={() => {}}
            roomDimensions={roomDimensions}
          />
        </div>

        <section style={{ margin: '1.5rem 0', padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Shopping list</h2>
          {design.items.length ? design.items.map((item, index) => (
            <div key={item.uuid} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '0.65rem 0', borderTop: '1px solid var(--border)', fontSize: '0.85rem' }}>
              <span>{index + 1}. {item.name} <span style={{ color: 'var(--text-3)' }}>· {item.finish}{item.color ? ` · ${item.color}` : ''}</span></span>
              <strong style={{ whiteSpace: 'nowrap' }}>₹{item.price.toLocaleString('en-IN')}</strong>
            </div>
          )) : <p style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>This room has no furniture items.</p>}
          <p style={{ color: 'var(--text-2)', fontSize: '0.75rem', marginTop: '0.75rem' }}>Prices are estimates and may change.</p>
        </section>

        <Link to="/catalogue" className="btn btn-primary">Design your own room</Link>
      </div>
    </main>
  );
};

export default SharedDesign;
