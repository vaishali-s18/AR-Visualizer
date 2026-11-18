import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

// ── Pages ──────────────────────────────────────────────────────────────────────
import Home          from './pages/Home';
import Catalogue     from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import ARPlacement   from './pages/ARPlacement';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import SavedDesigns  from './pages/SavedDesigns';
import CompareDesigns from './pages/CompareDesigns';
import Favourites     from './pages/Favourites';
import Profile       from './pages/Profile';
import About         from './pages/About';
import PricingPage   from './pages/PricingPage';
import SharedDesign  from './pages/SharedDesign';

// ── Protected route ────────────────────────────────────────────────────────────
import ProtectedRoute from './components/ProtectedRoute';

// ── 404 page ──────────────────────────────────────────────────────────────────
const NotFound = () => (
  <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
    <div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '6rem', fontWeight: 700, color: 'var(--border)', lineHeight: 1 }}>404</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>Page not found</h2>
      <p style={{ color: 'var(--text-2)', marginBottom: '2rem', fontSize: '0.9rem' }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  </div>
);

// ── App ────────────────────────────────────────────────────────────────────────
const App = () => (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <CartDrawer />
          <CheckoutModal />

          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public */}
              <Route path="/"             element={<Home />} />
              <Route path="/catalogue"    element={<Catalogue />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/ar/:id"       element={<ARPlacement />} />
              <Route path="/ar/design/:designId" element={<ARPlacement />} />
              <Route path="/shared/:token" element={<SharedDesign />} />
              <Route path="/login"        element={<Login />} />
              <Route path="/signup"       element={<Signup />} />
              <Route path="/about"        element={<About />} />
              <Route path="/pricing"      element={<PricingPage />} />
              <Route path="/favourites"   element={<Favourites />} />

              {/* Protected */}
              <Route path="/designs" element={
                <ProtectedRoute><SavedDesigns /></ProtectedRoute>
              } />
              <Route path="/compare" element={
                <ProtectedRoute><CompareDesigns /></ProtectedRoute>
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
            <Route path="/ar/design/:designId" element={null} />
            <Route path="/compare" element={null} />
            <Route path="*"       element={<Footer />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default App;
