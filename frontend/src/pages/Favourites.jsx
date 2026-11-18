import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, RefreshCw } from 'lucide-react';
import { getFavorites } from '../api/favorites';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const Favourites = () => {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch {
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchFavs();
    } else if (!authLoading && !user) {
      // Guest fallback: load from localStorage
      try {
        const local = JSON.parse(localStorage.getItem('ar_favorites') || '[]');
        setFavorites(local);
      } catch {
        setFavorites([]);
      }
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleRemoveFavorite = (prodId) => {
    setFavorites(prev => prev.filter(p => (p._id || p.id) !== prodId));
  };

  if (authLoading || loading) {
    return (
      <div style={{ paddingTop: 80, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }}>
            <circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Loading favorites...</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { to { transform: rotate(360deg); } }' }} />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container" style={{ padding: '3rem 2rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.5rem' }}>
            Collection
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Heart size={32} style={{ color: '#ef4444', fill: '#ef4444' }} /> My Favourites
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem' }}>{error}</p>
            <button className="btn btn-outline" onClick={fetchFavs} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={14} /> Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && favorites.length === 0 && (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Heart size={36} style={{ color: 'var(--text-3)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>Your favorites folder is empty</h3>
            <p style={{ color: 'var(--text-2)', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: 420, margin: '0 auto 2.5rem' }}>
              Tap the heart icon on any furniture card in the catalogue to save it here.
            </p>
            <Link to="/catalogue" className="btn btn-primary btn-lg">
              Browse Catalogue
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {!error && favorites.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {favorites.map(p => (
              <ProductCard
                key={p._id || p.id}
                product={p}
                onFavoriteToggle={handleRemoveFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
