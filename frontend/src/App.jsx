import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ── Pages ──────────────────────────────────────────────────────────────────────
import Home          from './pages/Home';
import Catalogue     from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import ARPlacement   from './pages/ARPlacement';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import SavedDesigns  from './pages/SavedDesigns';
import Profile       from './pages/Profile';
import About         from './pages/About';
import PricingPage   from './pages/PricingPage';

// ── Protected route (simple, no backend dependency) ───────────────────────────
import ProtectedRoute from './components/ProtectedRoute';

// ── 404 page ──────────────────────────────────────────────────────────────────
const NotFound = () => (
  <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
    <div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '7rem', fontWeight: 800, color: 'var(--surface-3)', lineHeight: 1, letterSpacing: '-0.05em' }}>404</div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Page not found</h2>
      <p style={{ color: 'var(--text-2)', marginBottom: '2.25rem', fontSize: '0.9rem' }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  </div>
);

// ── App ────────────────────────────────────────────────────────────────────────
// AR Placement uses a full-screen layout so it doesn't render the footer.
// All other pages get the standard Navbar + page + Footer layout.
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public */}
            <Route path="/"             element={<Home />} />
            <Route path="/catalogue"    element={<Catalogue />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/ar/:id"       element={<ARPlacement />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/signup"       element={<Signup />} />
            <Route path="/about"        element={<About />} />
            <Route path="/pricing"      element={<PricingPage />} />

            {/* Protected */}
            <Route path="/designs" element={
              <ProtectedRoute><SavedDesigns /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Don't show footer on the full-screen AR page */}
        <Routes>
          <Route path="/ar/:id" element={null} />
          <Route path="*"       element={<Footer />} />
        </Routes>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
