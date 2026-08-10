import api from './axios';

/**
 * Product API helpers
 * WHY: Centralising API calls here means if the endpoint URL ever changes,
 * we only update it in one place, not in every component that uses it.
 */

// Fetch all products — supports optional { category, search } filters
export const getProducts = (params = {}) =>
  api.get('/api/products', { params }).then((res) => res.data);

// Fetch a single product by its MongoDB _id
export const getProductById = (id) =>
  api.get(`/api/products/${id}`).then((res) => res.data);
