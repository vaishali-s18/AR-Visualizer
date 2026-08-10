import axios from 'axios';

// Create a pre-configured Axios instance.
// WHY: Instead of typing the full URL and headers every time we make an API
// call, we create one "base" instance that already knows the API URL.
// All our API helper files will import THIS instead of raw axios.
const api = axios.create({
  // VITE_ prefix is required for Vite to expose env vars to the browser
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// This runs automatically BEFORE every outgoing request.
// WHY: Instead of manually adding "Authorization: Bearer <token>" to every
// API call, this interceptor reads the token from localStorage and injects
// it into the header automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
