import api from './axios';
import {
  mockProducts,
  filterProducts as mockFilter,
  getDistinctProducts,
  getProductById as mockGetById,
} from '../data/mockProducts';

// ─── Helper: are we in offline / no-backend mode? ────────────────────────────
// If the Vite proxy target (localhost:3000) is unreachable, every axios call
// will reject.  We catch that and transparently fall back to mock data so the
// UI stays fully functional without a running backend.

const isMockMode = () => {
  // Honour an explicit opt-in env var if set
  if (import.meta.env.VITE_USE_MOCK === 'true') return true;
  return false;
};

// ─── getProducts ─────────────────────────────────────────────────────────────
export const getProducts = async (params = {}) => {
  if (isMockMode()) return mockFilter({ category: params.category, search: params.search });
  try {
    const res = await api.get('/api/products', { params });
    return getDistinctProducts(res.data);
  } catch (err) {
    console.warn('[API] Backend unreachable — using mock product data.', err.message);
    return mockFilter({ category: params.category, search: params.search });
  }
};

// ─── getProductById ───────────────────────────────────────────────────────────
export const getProductById = async (id) => {
  if (isMockMode()) {
    const p = mockGetById(id);
    if (!p) throw new Error(`Mock product not found: ${id}`);
    return p;
  }
  try {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  } catch (err) {
    console.warn(`[API] Backend unreachable — falling back to mock for id "${id}".`, err.message);
    // Try mock by MongoDB _id first, then by short id
    const p = mockProducts.find(m => m._id === id || m.id === id);
    if (!p) throw new Error(`Product not found: ${id}`);
    return p;
  }
};
