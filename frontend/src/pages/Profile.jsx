import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Shield, Calendar, Bookmark, LogOut, Edit2, Camera, ChevronRight, Heart,
  ShoppingBag, Smartphone, LayoutGrid, Package, Truck, CheckCircle2, Clock, MapPin,
  ExternalLink, Copy, Check, ArrowRight, ShieldCheck, Phone, CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyDesigns } from '../api/designs';

// Reusable robust thumbnail component for order items
const OrderProductThumbnail = ({ product }) => {
  const p = product || {};
  const [imgFailed, setImgFailed] = useState(false);

  let img = p.thumbnailUrl || p.imageUrl;
  if (img?.startsWith('/images/products/')) {
    img = null;
  }

  const model = p.modelUrl;
  const showModel = !img || imgFailed;

  return (
    <div style={{
      width: 68,
      height: 68,
      borderRadius: 14,
      background: 'var(--surface-2)',
      border: '1.5px solid var(--border)',
      overflow: 'hidden',
      flexShrink: 0,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {!showModel ? (
        <img
          src={img}
          alt={p.name || 'Furniture'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImgFailed(true)}
        />
      ) : model ? (
        <model-viewer
          src={model}
          auto-rotate
          rotation-per-second="45deg"
          camera-controls
          shadow-intensity="0.6"
          exposure="1.2"
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        />
      ) : (
        <Package size={24} style={{ color: 'var(--text-3)' }} />
      )}
      {p.modelUrl && <span style={{
        position: 'absolute',
        bottom: 2,
        right: 2,
        background: 'rgba(0,0,0,0.65)',
        color: '#ffffff',
        fontSize: '0.55rem',
        fontWeight: 700,
        padding: '1px 5px',
        borderRadius: 4,
        letterSpacing: '0.04em',
      }}>
        3D
      </span>}
    </div>
  );
};

const TRACKING_STEPS = [
  { step: 1, title: 'Order Placed', desc: 'Your order details have been received' },
  { step: 2, title: 'Inspected & Packed', desc: 'Furniture checked & shockproof crated' },
  { step: 3, title: 'Dispatched & In Transit', desc: 'Carrier partner en route to hub' },
  { step: 4, title: 'Out for Delivery', desc: 'Local team dispatched with assembly kit' },
  { step: 5, title: 'Room Placed & Assembled', desc: 'Delivered & inspected in your room' },
];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'designs' | 'favourites' | 'account'
  const [loggingOut, setLoggingOut] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    if (user) {
      getMyDesigns()
        .then(data => setSavedCount(data.length))
        .catch(() => {});
    }

    // Load orders from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('ar_orders') || '[]');
      if (stored.length > 0) {
        setOrders(Array.isArray(stored) ? stored : []);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  }, [user]);

  const favoritesCount = (() => {
    try { return JSON.parse(localStorage.getItem('ar_favorites') || '[]').length; }
    catch { return 0; }
  })();

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise(r => setTimeout(r, 400));
    logout();
    navigate('/');
  };

  const handleCopyTracking = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const joinDate = user?.createdAt || user?.joinedAt
    ? new Date(user.createdAt || user.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'November 2026';

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'VS';

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header Band */}
      <div style={{
        background: 'linear-gradient(145deg, #13271e 0%, #203a2e 50%, #152a21 100%)',
        color: '#fff',
        padding: '3.5rem 0 5.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute', top: 0, right: '15%',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,165,123,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2b2115 0%, #4a3622 100%)',
                border: '2px solid rgba(196,165,123,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.8rem',
                fontWeight: 600,
                color: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}>
                {initials}
              </div>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 999,
                  background: 'rgba(196,165,123,0.15)',
                  border: '1px solid rgba(196,165,123,0.3)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#C4A57B',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}>
                  Verified Home Designer
                </div>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#fff',
                  margin: '0 0 0.25rem',
                }}>
                  {user?.name || 'Vaishali Sharma'}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: 0 }}>
                  {user?.email || 'vaishali05davps@gmail.com'} · Member since {joinDate}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="btn btn-outline"
              style={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontSize: '0.82rem',
                padding: '0.55rem 1.25rem',
              }}
            >
              <LogOut size={14} /> {loggingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container" style={{ padding: '0 2rem 5rem', marginTop: '-3rem' }}>
        
        {/* Navigation Tabs Bar */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          border: '1px solid var(--border)',
          padding: '0.6rem 0.8rem',
          display: 'flex',
          gap: '0.5rem',
          boxShadow: 'var(--shadow)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}>
          {[
            { id: 'orders', label: 'Orders & Tracking', icon: <Package size={16} />, badge: orders.length },
            { id: 'designs', label: 'Saved 3D Rooms', icon: <LayoutGrid size={16} />, badge: savedCount },
            { id: 'favourites', label: 'Favourites', icon: <Heart size={16} />, badge: favoritesCount },
            { id: 'account', label: 'Account Settings', icon: <User size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 14,
                border: 'none',
                background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-2)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 999,
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--surface-2)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-3)',
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: ORDERS & TRACKING */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', margin: 0 }}>
                  Active Orders & Delivery Tracking
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', margin: '0.2rem 0 0' }}>
                  Review purchased items and the latest shipment details saved for each order.
                </p>
              </div>

              <Link to="/catalogue" className="btn btn-outline btn-sm">
                Shop More Furniture
              </Link>
            </div>

            {orders.length === 0 ? (
              <div style={{
                background: 'var(--surface)',
                borderRadius: 20,
                border: '1px solid var(--border)',
                padding: '4rem 2rem',
                textAlign: 'center',
              }}>
                <Package size={40} style={{ color: 'var(--text-3)', margin: '0 auto 1rem' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  No Orders Yet
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', maxWidth: 320, margin: '0 auto 1.5rem' }}>
                  Once you purchase furniture or try out our checkout flow, your delivery status will appear here live.
                </p>
                <Link to="/catalogue" className="btn btn-primary">
                  Explore Catalogue
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((order) => {
                  const orderItems = Array.isArray(order.items) ? order.items : [];
                  const itemsCount = orderItems.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);

                  return (
                    <div
                      key={order.orderId}
                      style={{
                        background: 'var(--surface)',
                        borderRadius: 20,
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Order top bar */}
                      <div style={{
                        padding: '1.25rem 1.75rem',
                        background: 'var(--surface-2)',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', fontWeight: 600 }}>
                              Order Placed
                            </span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                              {order.date}
                            </div>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', fontWeight: 600 }}>
                              Total Amount
                            </span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', fontFamily: "'Playfair Display', serif" }}>
                              ₹{Number(order.total || 0).toLocaleString('en-IN')}
                            </div>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', fontWeight: 600 }}>
                              Payment Status
                            </span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                              {order.paymentStatus || 'Not recorded'}
                            </div>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', fontWeight: 600 }}>
                              Delivery Service
                            </span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#9A7A52' }}>
                              {order.deliveryMethod === 'express' ? 'White-Glove Assembly (1-2 Days)' : 'Standard Delivery (3-5 Days)'}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.85rem',
                            borderRadius: 999,
                            background: 'rgba(16,185,129,0.12)',
                            color: '#10b981',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                            {order.status || 'Order Placed'}
                          </span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-3)', fontWeight: 600 }}>
                            #{order.orderId}
                          </span>
                        </div>
                      </div>

                      {/* Order body */}
                      <div style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }} className="order-grid">
                        
                        {/* Items preview */}
                        <div>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>
                            Items in this Shipment ({itemsCount})
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orderItems.map((item, idx) => {
                              const p = item.product || {};
                              return (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  <OrderProductThumbnail product={p} />
                                  <div>
                                    <h5 style={{ fontSize: '0.92rem', fontWeight: 600, margin: '0 0 0.2rem', color: 'var(--text)' }}>
                                      {p.name || 'Designer Furniture Piece'}
                                    </h5>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', margin: 0 }}>
                                      Qty: {item.quantity || 1} · ₹{Number(p.price || 0).toLocaleString('en-IN')}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                            {orderItems.length === 0 && (
                              <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', margin: 0 }}>
                                Product details are unavailable for this order.
                              </p>
                            )}
                          </div>

                          {/* Destination pill */}
                          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--surface-2)', padding: '0.85rem 1rem', borderRadius: 12 }}>
                            <MapPin size={16} style={{ color: 'var(--tan-dark, #9A7A52)', flexShrink: 0, marginTop: 2 }} />
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                              <strong>Shipping to:</strong> {order.address?.fullName} — {order.address?.street}, {order.address?.city} {order.address?.pincode}
                            </div>
                          </div>
                        </div>

                        {/* Tracking Action Column */}
                        <div style={{
                          borderLeft: '1px solid var(--border)',
                          paddingLeft: '2rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: '1rem',
                        }} className="order-track-col">
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>
                              Estimated Delivery
                            </span>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', margin: '0.2rem 0 0.5rem' }}>
                              {order.estimatedDelivery || 'To be confirmed'}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', margin: 0 }}>
                              Carrier: {order.carrier || 'Not assigned yet'}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedTrackingOrder(order)}
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                          >
                            <Truck size={16} /> View Tracking Details
                          </button>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                            <ShieldCheck size={14} style={{ color: '#10b981' }} />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                              Shipment updates for this order
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED 3D ROOMS */}
        {activeTab === 'designs' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '2.5rem', textAlign: 'center' }}>
            <LayoutGrid size={36} style={{ color: 'var(--tan-dark, #9A7A52)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              Your Saved AR Room Configurations
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', maxWidth: 420, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              You have {savedCount} saved spatial room design(s). Revisit them to swap furniture, test color finishes, or proceed to buy.
            </p>
            <Link to="/designs" className="btn btn-primary">
              View All Saved Designs
            </Link>
          </div>
        )}

        {/* TAB 3: FAVOURITES */}
        {activeTab === 'favourites' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '2.5rem', textAlign: 'center' }}>
            <Heart size={36} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              Bookmarked Furniture & Decor
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', maxWidth: 420, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              You have {favoritesCount} favorited piece(s) pinned for future interior styling.
            </p>
            <Link to="/favourites" className="btn btn-primary">
              Open Favourites
            </Link>
          </div>
        )}

        {/* TAB 4: ACCOUNT SETTINGS */}
        {activeTab === 'account' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="account-grid">
            <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '2rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                Personal Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</label>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', margin: '0.2rem 0 0' }}>{user?.name || 'Vaishali Sharma'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</label>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', margin: '0.2rem 0 0' }}>{user?.email || 'vaishali05davps@gmail.com'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>Account Role</label>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', margin: '0.2rem 0 0' }}>
                    {user?.role === 'admin' ? 'Administrator' : 'Studio Member'}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '2rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                Default Delivery Address
              </h3>
              <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.35rem' }}>Vaishali Sharma</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', margin: '0 0 0.35rem', lineHeight: 1.5 }}>
                  Flat 402, Green Glen Heights, Sector 14<br />
                  New Delhi, Delhi - 110001
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', margin: 0 }}>
                  Phone: +91 98765 43210
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── LIVE TRACKING MODAL ─────────────────────────────────────── */}
      {selectedTrackingOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedTrackingOrder(null)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(5px)',
            }}
          />

          {/* Modal Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 640,
            maxHeight: '90vh',
            background: 'var(--surface)',
            borderRadius: 24,
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 121,
          }}>
            {/* Header */}
            <div style={{
              padding: '1.25rem 2rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface-2)',
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  margin: 0,
                }}>
                  Tracking Shipment #{selectedTrackingOrder.orderId}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                  Delivery Partner: {selectedTrackingOrder.carrier || 'Not assigned yet'}
                </span>
              </div>
              <button
                onClick={() => setSelectedTrackingOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-2)',
                  padding: '0.4rem',
                }}
              >
                ✕
              </button>
            </div>

            {/* Tracking Body */}
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>

              {/* Top Tracking Info Card */}
              <div style={{
                background: 'rgba(196,165,123,0.08)',
                border: '1px solid rgba(196,165,123,0.3)',
                borderRadius: 16,
                padding: '1.25rem',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tan-dark, #9A7A52)', fontWeight: 700 }}>
                    Tracking Number
                  </span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginTop: '0.2rem' }}>
                    {selectedTrackingOrder.trackingNumber || 'Assigned after dispatch'}
                  </div>
                </div>

                {selectedTrackingOrder.trackingNumber && (
                  <button
                    onClick={() => handleCopyTracking(selectedTrackingOrder.trackingNumber)}
                    className="btn btn-outline btn-sm"
                    style={{ background: 'var(--surface)', fontSize: '0.78rem' }}
                  >
                    {copiedTracking ? <><Check size={14} style={{ color: '#10b981' }} /> Copied</> : <><Copy size={14} /> Copy Number</>}
                  </button>
                )}
              </div>

              <div style={{
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '1.25rem',
                marginBottom: '2rem',
                background: 'var(--surface)',
              }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--text)' }}>
                  Items in this order
                </h4>
                {Array.isArray(selectedTrackingOrder.items) && selectedTrackingOrder.items.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {selectedTrackingOrder.items.map((item, index) => {
                      const product = item.product || {};
                      return (
                        <div key={item.id || product._id || product.id || index} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <OrderProductThumbnail product={product} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                              {product.name || 'Furniture item'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>
                              Qty {Number(item.quantity) || 1} · ₹{Number(product.price || 0).toLocaleString('en-IN')} each
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', margin: 0 }}>
                    Item details were not saved with this order.
                  </p>
                )}
              </div>

              <div style={{
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '1.25rem',
                marginBottom: '2rem',
                background: 'var(--surface-2)',
              }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 700, margin: '0 0 0.9rem', color: 'var(--text)' }}>
                  <CreditCard size={16} /> Payment Record
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, auto) 1fr', gap: '0.55rem 1rem', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-3)' }}>Record ID</span>
                  <strong style={{ color: 'var(--text)', overflowWrap: 'anywhere' }}>{selectedTrackingOrder.paymentId || 'Not recorded'}</strong>
                  <span style={{ color: 'var(--text-3)' }}>Method</span>
                  <strong style={{ color: 'var(--text)', textTransform: 'capitalize' }}>{selectedTrackingOrder.paymentMethod || 'Not recorded'}</strong>
                  <span style={{ color: 'var(--text-3)' }}>Status</span>
                  <strong style={{ color: 'var(--text)' }}>{selectedTrackingOrder.paymentStatus || 'Not recorded'}</strong>
                  <span style={{ color: 'var(--text-3)' }}>UPI reference</span>
                  <strong style={{ color: 'var(--text)', overflowWrap: 'anywhere' }}>{selectedTrackingOrder.paymentReference || 'Not provided'}</strong>
                  <span style={{ color: 'var(--text-3)' }}>Recorded</span>
                  <strong style={{ color: 'var(--text)' }}>
                    {selectedTrackingOrder.paymentRecordedAt
                      ? new Date(selectedTrackingOrder.paymentRecordedAt).toLocaleString('en-IN')
                      : 'Not recorded'}
                  </strong>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', lineHeight: 1.5, margin: '0.9rem 0 0' }}>
                  This record is saved in this browser and does not verify payment with your bank.
                </p>
              </div>

              {/* Progress Stepper Timeline */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: '1.5rem' }}>
                  Shipment Progress
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                  {/* Vertical line behind steps */}
                  <div style={{
                    position: 'absolute',
                    top: 14,
                    bottom: 14,
                    left: 15,
                    width: 2,
                    background: 'var(--border)',
                    zIndex: 0,
                  }} />

                  {TRACKING_STEPS.map((s) => {
                    const current = Math.max(1, Math.min(TRACKING_STEPS.length, Number(selectedTrackingOrder.currentStep) || 1));
                    const isDone = s.step <= current;
                    const isCurrent = s.step === current;

                    return (
                      <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', position: 'relative', zIndex: 1 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: isDone ? (isCurrent ? 'var(--tan)' : '#10b981') : 'var(--surface)',
                          border: isDone ? 'none' : '2px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isDone ? '#ffffff' : 'var(--text-3)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          boxShadow: isCurrent ? '0 0 10px rgba(196,165,123,0.6)' : 'none',
                        }}>
                          {isDone ? <Check size={16} /> : s.step}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '0.92rem',
                            fontWeight: isCurrent ? 700 : 600,
                            color: isDone ? 'var(--text)' : 'var(--text-3)',
                          }}>
                            {s.title} {isCurrent && <span style={{ fontSize: '0.7rem', color: 'var(--tan-dark, #9A7A52)', background: 'rgba(196,165,123,0.15)', padding: '0.15rem 0.5rem', borderRadius: 999, marginLeft: '0.4rem' }}>Active</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: '0.15rem' }}>
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Destination Address & Support */}
              <div style={{
                background: 'var(--surface-2)',
                borderRadius: 16,
                padding: '1.25rem',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: 'var(--tan-dark, #9A7A52)' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Destination Address</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                    {selectedTrackingOrder.address?.phone ? `Phone: ${selectedTrackingOrder.address.phone}` : 'Phone number not provided'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.5 }}>
                  {selectedTrackingOrder.address?.street}, {selectedTrackingOrder.address?.city} {selectedTrackingOrder.address?.pincode}
                </p>
                {selectedTrackingOrder.address?.instructions && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontStyle: 'italic', margin: 0 }}>
                    Note: "{selectedTrackingOrder.address.instructions}"
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 2rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--surface)',
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                Questions? Call Support at 1800-AR-HOME
              </span>
              <button
                onClick={() => setSelectedTrackingOrder(null)}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .order-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .order-track-col { border-left: none !important; padding-left: 0 !important; border-top: 1px solid var(--border); padding-top: 1.5rem; }
          .account-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
