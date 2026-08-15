import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { filterProducts, CATEGORIES } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('default');
  const [products, setProducts] = useState([]);

  // Re-filter whenever search/category changes
  useEffect(() => {
    let result = filterProducts({ category, search });
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating') result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setProducts(result);
  }, [category, search, sort]);

  // Sync from URL on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('default');
    setSearchParams({});
  };

  const isFiltered = search || category !== 'All';

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{ 
        background: 'var(--surface)', 
        borderBottom: '1px solid var(--border)', 
        padding: '3.5rem 0 3rem',
      }}>
        <div className="container">
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 600, 
            marginBottom: '0.75rem',
          }}>
            Find pieces that fit your space.
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '1.05rem' }}>
            Browse, preview in 3D, then place in your room using AR.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>

        {/* Category chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`chip ${category === cat ? 'chip-active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search + Sort bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 280, display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              <input
                className="input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Search furniture..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-2)' }}>Sort by:</label>
            <select
              className="input"
              style={{ width: 'auto', minWidth: 180, cursor: 'pointer', paddingRight: '2.5rem' }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Results meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-2)' }}>
            Showing <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{products.length}</strong> items
            {category !== 'All' && ` in ${category}`}
            {search && ` for "${search}"`}
          </p>
          {isFiltered && (
            <button onClick={clearFilters} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontSize: '0.875rem', 
              color: 'var(--text-2)', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 0,
            }}>
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '6rem 2rem',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>No products found</h3>
            <p style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>
              Try adjusting your filters or search term.
            </p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Catalogue;
