import axios from 'axios';

// Route LAN and tunnel requests through Vite's same-origin proxy so HTTPS pages
// do not make mixed-content requests to the HTTP development API.
const getBaseURL = () => {
  // Production hosts the frontend and API separately; use the configured API
  // origin instead of sending /api requests back to the static frontend host.
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';

    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '';
    }
  }

  // Desktop localhost fallback
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return 'http://localhost:3000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: automatically attaches JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
