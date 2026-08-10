import api from './axios';

/**
 * Saved Designs API helpers
 * All routes require a JWT (handled automatically by the axios interceptor)
 */

// Save a new AR placement for the logged-in user
export const createDesign = (data) =>
  api.post('/api/designs', data).then((res) => res.data);

// Fetch all saved designs belonging to the logged-in user
export const getMyDesigns = () =>
  api.get('/api/designs/mine').then((res) => res.data);

// Delete a saved design by its ID
export const deleteDesign = (id) =>
  api.delete(`/api/designs/${id}`).then((res) => res.data);
