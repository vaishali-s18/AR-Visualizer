import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Smartphone, Eye, ShoppingCart } from 'lucide-react';
import { addFavorite, deleteFavorite } from '../api/favorites';
import { loadModelViewer } from '../utils/loadModelViewer';
import { useCart } from '../context/CartContext';

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, onFavoriteToggle }) => {
  const id = product._id || product.id;
  const { name, category, price, rating, modelUrl, arAvailable } = product;

  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const cardRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const { top, bottom } = card.getBoundingClientRect();
    if (top <= window.innerHeight + 200 && bottom >= -200) {
      setIsNearViewport(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    const viewer = viewerRef.current;
    const handleLoad = () => {
      if (!active) return;
      setModelLoaded(true);
      setModelError(false);
    };
    const handleError = () => {
      if (!active) return;
      setModelError(true);
      setModelLoaded(true);
    };

    setModelLoaded(false);
    setModelError(false);
    viewer?.addEventListener('load', handleLoad);
    viewer?.addEventListener('error', handleError);
    if (viewer?.loaded) handleLoad();

    if (!modelUrl) {
      handleError();
    } else {
      loadModelViewer().catch((err) => {
        console.warn('[ProductCard] Failed to load model-viewer:', err);
        handleError();
      });
    }

    return () => {
      active = false;
      viewer?.removeEventListener('load', handleLoad);
      viewer?.removeEventListener('error', handleError);
    };
  }, [modelUrl]);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('ar_favorites') || '[]');
      setIsFavorite(favs.some(fav => (fav._id || fav.id) === id));
    } catch {
      setIsFavorite(false);
    }
  }, [id]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    let favs = [];
    try {
      favs = JSON.parse(localStorage.getItem('ar_favorites') || '[]');
    } catch {
      favs = [];
    }

    const exists = favs.some(fav => (fav._id || fav.id) === id);

    if (exists) {
      favs = favs.filter(fav => (fav._id || fav.id) !== id);
      localStorage.setItem('ar_favorites', JSON.stringify(favs));
      setIsFavorite(false);
      if (onFavoriteToggle) onFavoriteToggle(id);
      if (token) {
        try { await deleteFavorite(id); } catch {}
      }
    } else {
      favs.push(product);
      localStorage.setItem('ar_favorites', JSON.stringify(favs));
      setIsFavorite(true);
      if (onFavoriteToggle) onFavoriteToggle(id);
      if (token) {
        try { await addFavorite(id); } catch {}
      }
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1000);
  };

  return (
    <div
      ref={cardRef}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(196,165,123,0.4)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* ── 3D Model Preview ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg)', overflow: 'hidden' }}>

        {/* Loading skeleton */}
        {!modelLoaded && !modelError && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem',
            background: 'var(--bg)',
            zIndex: 1,
          }}>
            <svg
              width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="var(--text-3)" strokeWidth="1.5"
              style={{ animation: 'spin 1.2s linear infinite', opacity: 0.5 }}
            >
              <circle cx="12" cy="12" r="10" opacity="0.2" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', letterSpacing: '0.04em' }}>
              Loading 3D…
            </span>
          </div>
        )}

        {/* Fallback if model fails */}
        {modelError && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem',
            background: 'var(--bg)',
          }}>
            <span style={{ fontSize: '2rem' }}>🪑</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', textAlign: 'center', padding: '0 1rem' }}>
              {name}
            </span>
          </div>
        )}

        {/* Model Viewer */}
        {modelUrl && !modelError && (
          <model-viewer
            ref={viewerRef}
            src={modelUrl}
            alt={name}
            auto-rotate
            auto-rotate-delay="500"
            rotation-per-second="20deg"
            camera-controls
            camera-orbit="45deg 75deg 105%"
            field-of-view="30deg"
            shadow-intensity="0.8"
            shadow-softness="1"
            exposure="1.1"
            loading={isNearViewport ? 'eager' : 'lazy'}
            reveal="auto"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              '--poster-color': 'var(--bg)',
              opacity: modelLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        )}

        {/* Heart button */}
        <button
          onClick={toggleFavorite}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36,
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s',
            zIndex: 2,
          }}
          aria-label="Add to favourites"
        >
          <Heart
            size={16}
            style={{
              color: isFavorite ? '#ef4444' : 'var(--text-3)',
              fill: isFavorite ? '#ef4444' : 'none',
              transition: 'all 0.2s',
            }}
          />
        </button>

        {/* Category badge */}
        <span className="badge" style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          {category}
        </span>

        {/* 3D label */}
        {modelLoaded && !modelError && (
          <span style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '2px 8px',
            borderRadius: 99,
            zIndex: 2,
          }}>
            3D WebXR
          </span>
        )}
      </div>

      {/* ── Info & Purchase ─────────────────────────────────────────── */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '0.5rem',
        }}>
          <Link
            to={`/products/${id}`}
            style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.3, color: 'var(--text)' }}
          >
            {name}
          </Link>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.15rem', fontWeight: 700,
            whiteSpace: 'nowrap', marginLeft: '0.75rem',
            color: 'var(--text)',
          }}>
            ₹{Number(price || 0).toLocaleString('en-IN')}
          </div>
        </div>

        {rating && (
          <div className="rating-stars" style={{ marginBottom: '1.25rem' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
                stroke={i <= Math.round(rating) ? '#F59E0B' : '#E5E5E5'}
                strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-2)', marginLeft: '0.375rem' }}>
              {rating}
            </span>
          </div>
        )}

        {/* Buttons: AR Placement + Add to Cart */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
          {arAvailable !== false ? (
            <Link
              to={`/ar/${id}`}
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '0.6rem 0.8rem' }}
            >
              <Smartphone size={14} /> AR Mode
            </Link>
          ) : (
            <Link
              to={`/products/${id}`}
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '0.6rem 0.8rem' }}
            >
              <Eye size={14} /> Details
            </Link>
          )}

          {/* Quick Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{
              padding: '0.6rem 1rem',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
            title="Add to Shopping Cart"
          >
            <ShoppingCart size={14} />
            {addedAnimation ? 'Added!' : '+ Cart'}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default ProductCard;
