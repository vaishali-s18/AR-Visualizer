import { useState } from 'react';
import { X, CheckCircle2, CreditCard, QrCode, Building, Banknote, ArrowRight, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = () => {
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
    grandTotal,
    deliveryMethod,
    setDeliveryMethod,
  } = useCart();

  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1 = Address & Delivery, 2 = Payment, 3 = Confirmed
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const merchantUpiId = import.meta.env.VITE_UPI_ID?.trim() || '';
  const merchantName = import.meta.env.VITE_UPI_NAME?.trim() || 'AR Interior';

  // Form states
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    instructions: 'Elevator available, please call on arrival',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiTransactionRef, setUpiTransactionRef] = useState('');
  const [upiLaunchMessage, setUpiLaunchMessage] = useState('');
  const [upiCopyMessage, setUpiCopyMessage] = useState('');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const upiPaymentUri = merchantUpiId
    ? `upi://pay?${new URLSearchParams({
        pa: merchantUpiId,
        pn: merchantName,
        am: grandTotal.toFixed(2),
        cu: 'INR',
        tn: 'AR Interior furniture order',
      }).toString()}`
    : '';

  const handleOpenUpiApp = () => {
    if (!/android|iphone|ipad|ipod/i.test(navigator.userAgent)) {
      setUpiLaunchMessage('UPI apps open on supported phones. Scan this QR with your phone to pay from a computer.');
      return;
    }

    setUpiLaunchMessage('If an app does not open, scan the QR with your UPI app.');
    window.location.assign(upiPaymentUri);
  };

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(merchantUpiId);
      setUpiCopyMessage('UPI ID copied');
    } catch (error) {
      console.error('Unable to copy the merchant UPI ID:', error);
      setUpiCopyMessage('Copy failed. Please select the UPI ID above.');
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.pincode) {
      alert('Please fill out all required delivery fields.');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setSaveError('');
    if (paymentMethod === 'upi' && !upiPaymentUri) {
      alert('UPI payment is not configured. Please contact the store.');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      const paymentId = 'AR-PAY-' + Date.now();
      const paymentReference = paymentMethod === 'upi' ? upiTransactionRef.trim() : '';
      const paymentStatus = paymentMethod === 'cod'
        ? 'Due on delivery'
        : paymentReference
          ? 'Reference submitted — verification required'
          : 'Payment not verified';
      const order = {
        orderId: 'AR-ORD-' + Math.floor(100000 + Math.random() * 900000),
        paymentId,
        items: [...items],
        total: grandTotal,
        deliveryMethod,
        address: { ...address },
        paymentMethod,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        estimatedDelivery: deliveryMethod === 'express' ? '1-2 Business Days' : '3-5 Business Days',
        status: 'Order Placed',
        currentStep: 1,
        paymentStatus,
        paymentReference,
        paymentRecordedAt: new Date().toISOString(),
      };

      try {
        const prevOrders = JSON.parse(localStorage.getItem('ar_orders') || '[]');
        if (!Array.isArray(prevOrders)) {
          throw new Error('Stored order history is not a list');
        }
        localStorage.setItem('ar_orders', JSON.stringify([order, ...prevOrders]));
      } catch (err) {
        console.error('Failed to save order and payment record:', err);
        setSaveError('Could not save your order/payment record in this browser. Check available storage and try again.');
        setLoading(false);
        return;
      }

      setPlacedOrder(order);
      clearCart();
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {/* Backdrop */}
      <div
        onClick={step === 3 ? closeCheckout : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.2s ease forwards',
        }}
      />

      {/* Modal Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 720,
        maxHeight: '90vh',
        background: 'var(--surface)',
        borderRadius: 24,
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 111,
        overflow: 'hidden',
        animation: 'modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 2rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface-2)',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.4rem',
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0,
            }}>
              {step === 1 && '1. Delivery Details'}
              {step === 2 && '2. Choose Payment Method'}
              {step === 3 && 'Order Recorded'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', margin: 0 }}>
              {step === 1 && 'Step 1 of 2: Where should we deliver your furniture?'}
              {step === 2 && 'Step 2 of 2: Complete your payment securely'}
              {step === 3 && 'Demo checkout confirmation'}
            </p>
          </div>

          <button
            onClick={closeCheckout}
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
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>

          {/* STEP 1: Delivery Address & Method */}
          {step === 1 && (
            <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    required
                    placeholder="e.g. Vaishali Sharma"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.35rem' }}>
                    Phone Number (for Delivery) *
                  </label>
                  <input
                    type="tel"
                    className="input"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.35rem' }}>
                  Street Address & Flat / House No. *
                </label>
                <input
                  type="text"
                  className="input"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  placeholder="e.g. Flat 402, Green Glen Heights, Sector 14"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }} className="form-row-3">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.35rem' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.35rem' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.35rem' }}>
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    required
                    placeholder="110001"
                  />
                </div>
              </div>

              {/* Delivery method selector */}
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tan-dark, #9A7A52)', marginBottom: '0.6rem' }}>
                  Select Delivery Service
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="delivery-row">
                  <div
                    onClick={() => setDeliveryMethod('standard')}
                    style={{
                      border: deliveryMethod === 'standard' ? '2px solid var(--tan)' : '1px solid var(--border)',
                      borderRadius: 14,
                      padding: '1rem',
                      background: deliveryMethod === 'standard' ? 'rgba(196,165,123,0.06)' : 'var(--surface-2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Standard Delivery</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>FREE</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', margin: 0, lineHeight: 1.4 }}>
                      Delivered to your doorstep in 3-5 business days via insured freight.
                    </p>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('express')}
                    style={{
                      border: deliveryMethod === 'express' ? '2px solid var(--tan)' : '1px solid var(--border)',
                      borderRadius: 14,
                      padding: '1rem',
                      background: deliveryMethod === 'express' ? 'rgba(196,165,123,0.06)' : 'var(--surface-2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>White-Glove Assembly</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>₹499</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', margin: 0, lineHeight: 1.4 }}>
                      1-2 business days with custom in-room placement, unboxing, and full assembly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery instructions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.35rem' }}>
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  className="input"
                  value={address.instructions}
                  onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                  placeholder="e.g. 3rd floor, elevator available, please ring doorbell"
                />
              </div>

              {/* Submit to Step 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Order Total</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)' }}>
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Gateway Selection */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Payment Methods Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }} className="payment-tabs">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: <QrCode size={18} /> },
                  { id: 'card', label: 'Card', icon: <CreditCard size={18} /> },
                  { id: 'netbanking', label: 'Net Banking', icon: <Building size={18} /> },
                  { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={18} /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      border: paymentMethod === m.id ? '2px solid var(--tan)' : '1px solid var(--border)',
                      borderRadius: 12,
                      padding: '0.85rem 0.5rem',
                      background: paymentMethod === m.id ? 'rgba(196,165,123,0.1)' : 'var(--surface-2)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: paymentMethod === m.id ? 'var(--text)' : 'var(--text-2)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {m.icon}
                    <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment details panel */}
              <div style={{
                background: 'var(--surface-2)',
                borderRadius: 16,
                padding: '1.5rem',
                border: '1px solid var(--border)',
              }}>
                {/* UPI Mode */}
                {paymentMethod === 'upi' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                        Scan with any UPI app
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', margin: 0 }}>
                      Confirm the recipient and amount in your UPI app before authorizing.
                    </p>
                    {upiPaymentUri ? (
                      <>
                        <div style={{
                          background: '#ffffff',
                          padding: '0.9rem',
                          borderRadius: 18,
                          border: '1px solid var(--border)',
                          boxShadow: 'var(--shadow-sm)',
                        }}>
                          <QRCodeSVG value={upiPaymentUri} size={196} level="H" includeMargin />
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>
                          <strong style={{ color: 'var(--text)' }}>{merchantName}</strong>
                          <div>{merchantUpiId}</div>
                        </div>
                        <div style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.8rem 1rem',
                          borderRadius: 10,
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          fontSize: '0.88rem',
                        }}>
                          <span style={{ color: 'var(--text-2)' }}>Amount</span>
                          <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem' }}>
                          <button type="button" onClick={handleOpenUpiApp} className="btn btn-outline btn-sm">
                            Open UPI app on this phone
                          </button>
                          <button type="button" onClick={handleCopyUpiId} className="btn btn-outline btn-sm">
                            Copy UPI ID
                          </button>
                        </div>
                        {(upiLaunchMessage || upiCopyMessage) && (
                          <p role="status" style={{ fontSize: '0.75rem', color: 'var(--text-2)', margin: 0 }}>
                            {[upiLaunchMessage, upiCopyMessage].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        <div style={{ width: '100%', textAlign: 'left' }}>
                          <label htmlFor="upi-transaction-reference" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.35rem' }}>
                            UPI transaction reference / UTR (optional)
                          </label>
                          <input
                            id="upi-transaction-reference"
                            type="text"
                            className="input"
                            value={upiTransactionRef}
                            onChange={(event) => setUpiTransactionRef(event.target.value)}
                            maxLength={80}
                            placeholder="Enter it after paying to keep it with this order"
                            autoComplete="off"
                          />
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>
                          Payment records are saved in this browser. A reference entered here is not independently verified.
                        </p>
                      </>
                    ) : (
                      <div className="error-box" role="alert">
                        UPI QR is unavailable because the merchant account is not configured.
                      </div>
                    )}
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>
                      Demo checkout: this site cannot verify UPI transfers. An order recorded here is not proof of payment.
                    </p>
                  </div>
                )}

                {/* Card Mode */}
                {paymentMethod === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.3rem' }}>
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="4532 •••• •••• 8921"
                        value={cardInfo.number}
                        onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.3rem' }}>
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="08/28"
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.3rem' }}>
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          className="input"
                          placeholder="•••"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.6rem' }}>
                      Select Your Bank
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                        <div
                          key={b}
                          onClick={() => setSelectedBank(b)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: 8,
                            background: selectedBank === b ? 'var(--surface)' : 'transparent',
                            border: selectedBank === b ? '1.5px solid var(--tan)' : '1px solid var(--border)',
                            fontSize: '0.82rem',
                            fontWeight: selectedBank === b ? 600 : 400,
                            cursor: 'pointer',
                          }}
                        >
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                {paymentMethod === 'cod' && (
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text)' }}>
                      Pay upon Arrival & Room Placement
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                      Inspect your 3D furniture item in your room before completing payment. You can pay via cash or UPI to our logistics partner upon assembly.
                    </p>
                  </div>
                )}
              </div>

              {/* Order items recap */}
              <div style={{
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '1rem',
                background: 'var(--surface)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Shipping to:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                    {address.fullName} · {address.city}, {address.pincode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--tan-dark, #9A7A52)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Edit Address
                </button>
              </div>

              {/* Action buttons */}
              {saveError && <div className="error-box" role="alert">{saveError}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ minWidth: 200, justifyContent: 'center' }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/>
                      </svg>
                      Recording order…
                    </span>
                  ) : (
                    <>Place Demo Order</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Confirmation */}
          {step === 3 && placedOrder && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(16,185,129,0.12)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <CheckCircle2 size={40} style={{ color: '#10b981' }} />
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--tan-dark, #9A7A52)',
              }}>
                Order Recorded (Demo)
              </span>

              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--text)',
                margin: '0.35rem 0 0.75rem',
              }}>
                Thank You, {placedOrder.address.fullName}!
              </h2>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-2)', maxWidth: 440, margin: '0 auto 2rem', lineHeight: 1.6 }}>
                Order <strong style={{ color: 'var(--text)' }}>{placedOrder.orderId}</strong> is saved in this browser. This demo does not verify payments or receive carrier tracking updates.
              </p>

              {/* Order Info Card */}
              <div style={{
                background: 'var(--surface-2)',
                borderRadius: 16,
                padding: '1.5rem',
                border: '1px solid var(--border)',
                textAlign: 'left',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-3)' }}>Order Reference:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{placedOrder.orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-3)' }}>Payment status:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{placedOrder.paymentStatus}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-3)' }}>Payment record:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{placedOrder.paymentId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-3)' }}>Estimated Delivery:</span>
                  <span style={{ fontWeight: 600, color: '#10b981' }}>{placedOrder.estimatedDelivery}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-3)' }}>Delivery Service:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {placedOrder.deliveryMethod === 'express' ? 'White-Glove In-Room Assembly' : 'Standard Insured Freight'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-3)' }}>Destination:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)', textAlign: 'right', maxWidth: 260 }}>
                    {placedOrder.address.street}, {placedOrder.address.city} - {placedOrder.address.pincode}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.75rem',
                  marginTop: '0.25rem',
                }}>
                  <span style={{ fontFamily: "'Playfair Display', serif" }}>Order Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif" }}>₹{placedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={closeCheckout}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}
              >
                Continue Designing
              </button>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
                  .form-row, .form-row-3, .delivery-row, .payment-tabs {
            grid-template-columns: 1fr !important;
          }
        }
      ` }} />
    </div>
  );
};

export default CheckoutModal;
