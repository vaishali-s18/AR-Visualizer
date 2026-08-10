import FurnitureCard from './FurnitureCard';

// ─── FurnitureGrid ────────────────────────────────────────────────────────────
// Responsive CSS grid of FurnitureCard components.
// Shows skeleton placeholders while loading, EmptyState when no results.
const FurnitureGrid = ({ products = [], loading = false, onPreview3D }) => {
  if (loading) {
    return (
      <div style={gridStyle}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
        <h3>No furniture found</h3>
        <p>Try adjusting your search or category filter.</p>
      </div>
    );
  }

  return (
    <div style={gridStyle} className="fade-in">
      {products.map(p => (
        <FurnitureCard key={p.id} product={p} onPreview3D={onPreview3D} />
      ))}
    </div>
  );
};

// ─── Skeleton placeholder card ────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <div className="skeleton" style={{ aspectRatio: '4/3', borderRadius: 0 }} />
    <div style={{ padding: '0.9rem 1rem 1rem' }}>
      <div className="skeleton" style={{ height: 10, width: '40%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '55%', marginBottom: 12 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ height: 18, width: '35%' }} />
        <div className="skeleton" style={{ height: 30, width: '30%', borderRadius: 8 }} />
      </div>
    </div>
  </div>
);

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '1.5rem',
};

export default FurnitureGrid;
