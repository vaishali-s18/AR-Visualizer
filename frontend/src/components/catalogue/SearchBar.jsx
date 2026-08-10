import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

// ─── SearchBar ────────────────────────────────────────────────────────────────
// Debounced search input (300 ms). Emits onSearch(value) after delay.
const SearchBar = ({ value, onSearch, placeholder = 'Search furniture…' }) => {
  const [local, setLocal] = useState(value || '');
  const timer = useRef(null);

  // Keep local in sync when parent resets value
  useEffect(() => { setLocal(value || ''); }, [value]);

  const emit = (v) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(v), 300);
  };

  const handleChange = (e) => {
    setLocal(e.target.value);
    emit(e.target.value);
  };

  const handleClear = () => {
    setLocal('');
    onSearch('');
  };

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
      <Search
        size={15}
        style={{
          position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-3)', pointerEvents: 'none',
        }}
      />
      <input
        id="catalogue-search"
        className="input"
        style={{ paddingLeft: '2.4rem', paddingRight: local ? '2.4rem' : '1rem' }}
        placeholder={placeholder}
        value={local}
        onChange={handleChange}
        autoComplete="off"
        spellCheck={false}
      />
      {local && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', display: 'flex', alignItems: 'center',
            padding: 2, borderRadius: 4, transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
