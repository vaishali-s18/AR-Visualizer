import { CATEGORY_ICONS } from '../../data/mockProducts';

// ─── CategoryFilter ───────────────────────────────────────────────────────────
// Horizontally-scrollable pill row. Active pill uses accent colour.
const CategoryFilter = ({ categories, active, onChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '4px',          // room for scrollbar on some browsers
        scrollbarWidth: 'none',        // Firefox
        msOverflowStyle: 'none',       // IE/Edge
      }}
      // hide WebKit scrollbar
      className="hide-scrollbar"
    >
      {categories.map((cat) => {
        const isActive = cat === active;
        const icon = CATEGORY_ICONS[cat] || '🪑';

        return (
          <button
            key={cat}
            id={`category-filter-${cat.toLowerCase()}`}
            onClick={() => onChange(cat)}
            className={`chip${isActive ? ' chip-active' : ''}`}
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.82rem',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.18s ease',
              transform: isActive ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{icon}</span>
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
