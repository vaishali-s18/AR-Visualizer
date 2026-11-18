import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, RefreshCw } from 'lucide-react';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Sofas', 'Chairs', 'Tables', 'Beds', 'Storage', 'Lighting', 'Decor'];

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
];

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
  }}>
    <div style={{ aspectRatio: '4/3', background: 'var(--bg)', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ height: 16, background: 'var(--bg)', borderRadius: 6, width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 12, background: 'var(--bg)', borderRadius: 6, width: '40%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 38, background: 'var(--bg)', borderRadius: 99, marginTop: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  </div>
);

// ─── Catalogue ────────────────────────────────────────────────────────────────
const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search,   setSearch]   = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort,     setSort]     = useState('default');
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search.trim())       params.search   = search.trim();

      let result = await getProducts(params);

      // Client-side sort (the backend returns unsorted by default)
      if (sort === 'price-asc')  result = [...result].sort((a, b) => a.price - b.price);
      if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
      if (sort === 'rating')     result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));

      setProducts(result);
    } catch {
      setError('Failed to load products. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [category, search, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Sync URL params on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    const q   = searchParams.get('search');
    if (cat) setCategory(cat);
    if (q)   setSearch(q);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilters = () => {
    setSearch(''); setCategory('All'); setSort('default'); setSearchParams({});
  };

  const isFiltered = search || category !== 'All';

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '3.5rem 0 3rem' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, marginBottom: '0.75rem' }}>
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

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative', maxWidth: 400 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input
              className="input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search furniture..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-2)' }}>Sort by:</label>
            <select
              className="input"
              style={{ width: 'auto', minWidth: 180, cursor: 'pointer' }}
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
            {loading ? 'Loading…' : (
              <>Showing <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{products.length}</strong> items
                {category !== 'All' && ` in ${category}`}
                {search && ` for "${search}"`}
              </>
            )}
          </p>
          {isFiltered && !loading && (
            <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem' }}>{error}</p>
            <button className="btn btn-outline" onClick={fetchProducts} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={14} /> Try again
            </button>
          </div>
        )}

        {/* Grid */}
        {!error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : products.length > 0
                ? products.map(p => <ProductCard key={p._id || p.id} product={p} />)
                : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🔍</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>No products found</h3>
                    <p style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>Try adjusting your filters or search term.</p>
                    <button className="btn btn-primary" onClick={clearFilters}>Clear all filters</button>
                  </div>
                )
            }
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: '@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }' }} />
    </div>
  );
};

export default Catalogue;
