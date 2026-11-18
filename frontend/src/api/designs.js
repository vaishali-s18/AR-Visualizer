import api from './axios';

const MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

// ── In-memory mock store for saved designs (used when backend is offline) ─────
let _mockDesigns = JSON.parse(localStorage.getItem('_mock_designs') || '[]');

const saveMock = () => localStorage.setItem('_mock_designs', JSON.stringify(_mockDesigns));

// Save a new AR placement for the logged-in user
export const createDesign = async (data) => {
  if (MOCK_MODE) {
    const design = { ...data, _id: 'design_' + Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    _mockDesigns.push(design);
    saveMock();
    return design;
  }
  try {
    return await api.post('/api/designs', data).then(r => r.data);
  } catch {
    const design = { ...data, _id: 'design_' + Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    _mockDesigns.push(design);
    saveMock();
    return design;
  }
};

// Fetch all saved designs belonging to the logged-in user
export const getMyDesigns = async () => {
  if (MOCK_MODE) return _mockDesigns;
  try {
    return await api.get('/api/designs/mine').then(r => r.data);
  } catch {
    return _mockDesigns;
  }
};

// Delete a saved design by its ID
export const deleteDesign = async (id) => {
  if (MOCK_MODE) {
    _mockDesigns = _mockDesigns.filter(d => d._id !== id);
    saveMock();
    return { success: true };
  }
  try {
    return await api.delete(`/api/designs/${id}`).then(r => r.data);
  } catch {
    _mockDesigns = _mockDesigns.filter(d => d._id !== id);
    saveMock();
    return { success: true };
  }
};

// Fetch details of a single saved design by ID
export const getDesignById = async (id) => {
  if (MOCK_MODE) {
    const d = _mockDesigns.find(d => d._id === id);
    if (!d) throw new Error(`Design not found: ${id}`);
    return d;
  }
  try {
    return await api.get(`/api/designs/${id}`).then(r => r.data);
  } catch {
    const d = _mockDesigns.find(d => d._id === id);
    if (!d) throw new Error(`Design not found: ${id}`);
    return d;
  }
};

// Fetch a design using its public, revocable share token.
export const getSharedDesign = async (token) => {
  const response = await api.get(`/api/designs/shared/${encodeURIComponent(token)}`);
  return response.data;
};

// Enable or revoke public read-only access to one of the user's designs.
export const enableDesignSharing = async (id) => {
  const response = await api.post(`/api/designs/${id}/share`);
  return response.data;
};

export const disableDesignSharing = async (id) => {
  const response = await api.delete(`/api/designs/${id}/share`);
  return response.data;
};

// Update an existing room design by ID
export const updateDesign = async (id, data) => {
  if (MOCK_MODE) {
    _mockDesigns = _mockDesigns.map(d => d._id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d);
    saveMock();
    return _mockDesigns.find(d => d._id === id);
  }
  try {
    return await api.put(`/api/designs/${id}`, data).then(r => r.data);
  } catch {
    _mockDesigns = _mockDesigns.map(d => d._id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d);
    saveMock();
    return _mockDesigns.find(d => d._id === id);
  }
};
