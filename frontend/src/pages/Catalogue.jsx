import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { filterProducts, CATEGORIES } from '../data/mockProducts';

// Phase 2 reusable catalogue components
import SearchBar         from '../components/catalogue/SearchBar';
import CategoryFilter    from '../components/catalogue/CategoryFilter';
import FurnitureGrid     from '../components/catalogue/FurnitureGrid';
import ModelPreviewModal from '../components/catalogue/ModelPreviewModal';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured'          },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated'         },
];

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search,   setSearch]   = useState(searchParams.get('search')   || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort,     setSort]     = useState('default');
  const [products, setProducts] = useState([]);
  const [preview,  setPreview]  = useState(null); // product open in 3D modal

  // Re-filter whenever search / category / sort changes
  useEffect(() => {
    let result = filterProducts({ category, search });
    if (sort === 'price-asc')  result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating')     result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setProducts(result);
  }, [category, search, sort]);

  // Sync state from URL params on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const q = searchParams.get('search');
    if (q)   setSearch(q);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('default');
    setSearchParams({});
  };

  const isFiltered = search || category !== 'All';

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <div className="section-label">Our Collection</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Furniture Catalogue
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '1rem' }}>
            Browse, preview in 3D, then place in your room using AR.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>

        {/* Search + Sort bar */}
        <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar
            value={search}
            onSearch={setSearch}
            placeholder="Search furniture, materials, categories…"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <SlidersHorizontal size={15} style={{ color: 'var(--text-3)' }} />
            <select
              id="catalogue-sort"
              className="input"
              style={{ width: 'auto', cursor: 'pointer' }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Category filter pills */}
        <div style={{ marginBottom: '1.75rem' }}>
          <CategoryFilter
            categories={CATEGORIES}
            active={category}
            onChange={setCategory}
          />
        </div>

        {/* Results meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>
            Showing <strong style={{ color: 'var(--text)' }}>{products.length}</strong> items
            {category !== 'All' && ` in ${category}`}
            {search && ` for "${search}"`}
          </p>
          {isFiltered && (
            <button
              onClick={clearFilters}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* Furniture Grid */}
        <FurnitureGrid
          products={products}
          onPreview3D={setPreview}
        />

      </div>

      {/* 3D Model Preview Modal */}
      {preview && (
        <ModelPreviewModal
          product={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
};

export default Catalogue;
