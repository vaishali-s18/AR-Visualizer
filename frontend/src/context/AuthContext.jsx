import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';
import { getFavorites } from '../api/favorites';

// ─── AuthContext ──────────────────────────────────────────────────────────────
// Stores a validated JWT token and verifies it against the real backend on mount.
const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY  = 'ar_viz_user';

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  // loading is true while we verify the stored token with GET /api/auth/me
  const [loading, setLoading] = useState(true);

// On mount: if a token exists, verify it is still valid
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((userData) => {
        setUser(userData);
        // Sync favorites cache in the background
        getFavorites()
          .then((favs) => localStorage.setItem('ar_favorites', JSON.stringify(favs)))
          .catch((err) => console.error('Failed to sync favorites:', err));
      })
      .catch(() => {
        // Token expired or tampered — clear everything
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('ar_favorites');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // login() receives the server response: { _id, name, email, role, token }
  const login = (userData) => {
    // Store token separately so the axios interceptor can read it
    localStorage.setItem(TOKEN_KEY, userData.token);
    // Store user info (without the token) for display purposes
    const { token, ...userInfo } = userData;
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    setUser(userInfo);
    // Sync favorites in the background
    getFavorites()
      .then((favs) => localStorage.setItem('ar_favorites', JSON.stringify(favs)))
      .catch((err) => console.error('Failed to sync favorites on login:', err));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('ar_favorites');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
