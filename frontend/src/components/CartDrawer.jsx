import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    grandTotal,
    deliveryMethod,
    setDeliveryMethod,
    openCheckout,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
    }}>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.25s ease forwards',
        }}
      />

      {/* Slide-over panel */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 460,
        height: '100%',
        background: 'var(--surface)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 101,
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}>

        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'rgba(196,165,123,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingBag size={16} style={{ color: 'var(--tan-dark, #9A7A52)' }} />
            </div>
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0,
              }}>
                Shopping Cart
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-2)',
              padding: '0.4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body content */}
        {items.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <ShoppingBag size={32} style={{ color: 'var(--text-3)' }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Your cart is empty
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', maxWidth: 280, marginBottom: '1.75rem', lineHeight: 1.6 }}>
              Browse our 3D furniture catalogue and visualize pieces directly in your room before checkout.
            </p>
            <button
              onClick={closeCart}
              className="btn btn-primary"
            >
              Explore Furniture
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {items.map(({ id, product, quantity }) => {
                let img = product.thumbnailUrl || product.imageUrl;
                if (!img || img.startsWith('/images/products/')) {
                  img = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
                }
                const model = product.modelUrl || '/models/sofa-sheen.glb';

                return (
                  <div
                    key={id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: 16,
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {/* Thumbnail with 3D model fallback */}
                    <div style={{
                      width: 76,
                      height: 76,
                      borderRadius: 12,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <img
                        src={img}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <model-viewer
                        src={model}
                        auto-rotate
                        rotation-per-second="45deg"
                        camera-controls
                        shadow-intensity="0.5"
                        exposure="1.2"
                        style={{ width: '100%', height: '100%', display: 'none' }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div>
                          <h4 style={{
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            color: 'var(--text)',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 180,
                          }}>
                            {product.name}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'capitalize' }}>
                            {product.category || 'Furniture'}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-3)',
                            padding: '0.2rem',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                        {/* Quantity selector */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          background: 'var(--surface)',
                          overflow: 'hidden',
                        }}>
                          <button
                            onClick={() => updateQuantity(id, quantity - 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem 0.5rem',
                              color: 'var(--text-2)',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, padding: '0 0.4rem', minWidth: 20, textAlign: 'center' }}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(id, quantity + 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem 0.5rem',
                              color: 'var(--text-2)',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Item Total Price */}
                        <div style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--text)',
                        }}>
                          ₹{(Number(product.price || 0) * quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Delivery Method Selection */}
              <div style={{
                marginTop: '0.5rem',
                padding: '1.1rem',
                borderRadius: 16,
                background: 'rgba(196,165,123,0.08)',
                border: '1px solid rgba(196,165,123,0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Truck size={16} style={{ color: 'var(--tan-dark, #9A7A52)' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tan-dark, #9A7A52)' }}>
                    Choose Delivery Method
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {/* Standard Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: 10,
                      background: deliveryMethod === 'standard' ? 'var(--surface)' : 'transparent',
                      border: deliveryMethod === 'standard' ? '1.5px solid var(--tan)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input
                        type="radio"
                        name="drawer_delivery"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => setDeliveryMethod('standard')}
                        style={{ accentColor: 'var(--tan)' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                          Standard Delivery
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                          Delivered in 3-5 business days
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>
                      FREE
                    </span>
                  </label>

                  {/* Express White-Glove Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: 10,
                      background: deliveryMethod === 'express' ? 'var(--surface)' : 'transparent',
                      border: deliveryMethod === 'express' ? '1.5px solid var(--tan)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input
                        type="radio"
                        name="drawer_delivery"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        style={{ accentColor: 'var(--tan)' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                          White-Glove Room Assembly
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                          1-2 days · Room placement & unboxing
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                      ₹499
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Checkout Summary */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-2)' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-2)' }}>
                  <span>Delivery Method</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.75rem',
                }}>
                  <span style={{ fontFamily: "'Playfair Display', serif" }}>Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif" }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem' }}>
                <ShieldCheck size={14} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                  Secure Checkout · 100% Buyer Protection · Free Returns
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      ` }} />
    </div>
  );
};

export default CartDrawer;
