import api from './axios';

const MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

// Fetch all favorites for the logged-in user
export const getFavorites = async () => {
  if (MOCK_MODE) return JSON.parse(localStorage.getItem('ar_favorites') || '[]');
  try {
    return await api.get('/api/favorites').then(r => r.data);
  } catch {
    return JSON.parse(localStorage.getItem('ar_favorites') || '[]');
  }
};

// Add a product to favorites
export const addFavorite = async (productId) => {
  if (MOCK_MODE) return { success: true };
  try {
    return await api.post(`/api/favorites/${productId}`).then(r => r.data);
  } catch {
    return { success: true };
  }
};

// Remove a product from favorites
export const deleteFavorite = async (productId) => {
  if (MOCK_MODE) return { success: true };
  try {
    return await api.delete(`/api/favorites/${productId}`).then(r => r.data);
  } catch {
    return { success: true };
  }
};
