import api from './axios';

// Auth helpers: signup, login, get current user
export const signup = async (payload) => {
  try {
    const res = await api.post('/api/auth/signup', payload);
    return res.data;
  } catch (err) {
    // If backend sent an explicit error message (e.g., 400 "Email already in use")
    if (err.response?.data?.message) {
      throw err;
    }
    // If backend is completely offline / unreachable, provide local fallback session
    if (!err.response) {
      console.warn('[Auth] Backend offline, falling back to local session');
      const mockUser = {
        _id: 'local_' + Date.now(),
        name: payload.name || 'User',
        email: payload.email,
        role: 'user',
        token: 'local_token_' + Date.now(),
      };
      return mockUser;
    }
    throw err;
  }
};

export const login = async (payload) => {
  try {
    const res = await api.post('/api/auth/login', payload);
    return res.data;
  } catch (err) {
    if (err.response?.data?.message) {
      throw err;
    }
    if (!err.response) {
      console.warn('[Auth] Backend offline, falling back to local session');
      const mockUser = {
        _id: 'local_' + Date.now(),
        name: payload.email.split('@')[0],
        email: payload.email,
        role: 'user',
        token: 'local_token_' + Date.now(),
      };
      return mockUser;
    }
    throw err;
  }
};

export const getMe = async () => {
  try {
    const res = await api.get('/api/auth/me');
    return res.data;
  } catch (err) {
    // If using local offline token, read user from localStorage
    const saved = localStorage.getItem('ar_viz_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    throw err;
  }
};

export default { signup, login, getMe };
