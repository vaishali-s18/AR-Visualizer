import api from './axios';

// Auth helpers: signup, login, get current user
export const signup = (payload) => api.post('/api/auth/signup', payload).then((r) => r.data);
export const login = (payload) => api.post('/api/auth/login', payload).then((r) => r.data);
export const getMe = () => api.get('/api/auth/me').then((r) => r.data);

export default { signup, login, getMe };
