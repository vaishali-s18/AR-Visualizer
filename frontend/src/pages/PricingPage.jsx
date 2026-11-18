import { useState } from 'react';
import { CheckCircle2, X, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const FREE_FEATURES = [
  { text: '3 AR views per day', included: true },
  { text: '5 saved designs', included: true },
  { text: 'Basic furniture catalogue', included: true },
  { text: 'Unlimited AR views', included: false },
  { text: 'Unlimited saved designs', included: false },
  { text: 'New arrivals — early access', included: false },
  { text: 'Room style PDF reports', included: false },
  { text: 'Priority support', included: false },
];

const PRO_FEATURES = [
  { text: 'Unlimited AR views in WebXR', included: true },
  { text: 'Unlimited saved room configurations', included: true },
  { text: 'Full 3D catalogue access (500+ items)', included: true },
  { text: 'New designer arrivals — early access', included: true },
  { text: 'High-res room export (PNG / PDF)', included: true },
  { text: 'Compare up to 4 models side-by-side', included: true },
  { text: 'Custom scale & light estimation', included: true },
  { text: 'Priority 1-on-1 designer support', included: true },
];

const FAQ = [
  { q: 'When does Pro launch?', a: 'We are launching soon! Everyone who joins the early access waitlist today receives 3 months completely free on release.' },
  { q: 'How do payments work?', a: 'Once launched, payments will be securely processed through UPI, Debit/Credit Cards, and Net Banking.' },
  { q: 'Can I cancel anytime?', a: 'Yes! No contracts, no lock-in. Cancel from your profile settings in one click with zero penalties.' },
  { q: 'Is the free plan really free forever?', a: 'Yes. The free tier will always remain available without time limits for casual room designing.' },
  { q: 'What devices does AR work on?', a: 'AR runs directly inside modern mobile browsers (Chrome / Scene Viewer on Android, Safari / Quick Look on iOS) without installing external apps.' },
];

const PricingPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (email.trim()) {
      const existing = JSON.parse(localStorage.getItem('pro_waitlist') || '[]');
      if (!existing.includes(email.trim())) {
        existing.push(email.trim());
        localStorage.setItem('pro_waitlist', JSON.stringify(existing));
      }
      setSubmitted(true);
    }
  };

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <section style={{ padding: '5rem 0 3.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Warm golden radial aura */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'radial-gradient(ellipse at 50% 30%, rgba(196,165,123,0.18) 0%, transparent 65%)', 
          pointerEvents: 'none' 
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(196,165,123,0.12)', border: '1px solid rgba(196,165,123,0.3)',
            borderRadius: 999, padding: '0.45rem 1.15rem', marginBottom: '1.75rem',
          }}>
            <Zap size={14} style={{ color: 'var(--tan)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--tan-dark, #9A7A52)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Early Access — Join the Waitlist
            </span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.4rem, 5vw, 3.75rem)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-2)', maxWidth: 540, margin: '0 auto', lineHeight: 1.75 }}>
            Start designing for free. Upgrade to Pro for unlimited AR placement, full 3D catalogue, and design exports.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: 960, margin: '0 auto' }} className="pricing-grid">

            {/* Free Plan */}
            <div style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--border)', 
              borderRadius: 24, 
              padding: '2.5rem', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.75rem' }}>
                  Starter Tier
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>₹0</span>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.9rem', fontWeight: 500 }}>/month</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                  Everything you need to try out AR furniture in your living space.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                {FREE_FEATURES.map(f => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {f.included
                      ? <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                      : <X size={16} style={{ color: 'var(--border)', flexShrink: 0 }} />
                    }
                    <span style={{ fontSize: '0.875rem', color: f.included ? 'var(--text)' : 'var(--text-3)' }}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/catalogue" className="btn btn-outline btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '2.5rem' }}>
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)', 
              border: '1.5px solid rgba(196,165,123,0.5)',
              borderRadius: 24, 
              padding: '2.5rem',
              boxShadow: '0 20px 50px rgba(196,165,123,0.15)',
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative', 
              overflow: 'hidden',
            }}>
              {/* Top golden accent line */}
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 3, 
                background: 'linear-gradient(90deg, transparent, #C4A57B, transparent)' 
              }} />

              {/* Launching soon badge */}
              <div style={{ 
                position: 'absolute', 
                top: 20, 
                right: 20, 
                background: '#C4A57B', 
                color: '#ffffff', 
                fontSize: '0.65rem', 
                fontWeight: 700, 
                letterSpacing: '0.08em', 
                textTransform: 'uppercase', 
                padding: '0.3rem 0.75rem', 
                borderRadius: 999,
                boxShadow: '0 2px 8px rgba(196,165,123,0.3)',
              }}>
                Early Access
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4A57B', marginBottom: '0.75rem' }}>
                  Professional
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>₹199</span>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.9rem', fontWeight: 500 }}>/month</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                  Unlimited everything. Waitlist members get <strong style={{ color: '#9A7A52' }}>3 months free</strong> upon launch.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                {PRO_FEATURES.map(f => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#C4A57B', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                {!submitted ? (
                  <form onSubmit={handleWaitlist}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.75rem' }}>
                      Claim 3 months free — enter your email:
                    </p>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                      <input
                        type="email"
                        className="input"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ fontSize: '0.875rem' }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem' }}>
                      <ShieldCheck size={12} style={{ color: 'var(--text-3)' }} />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                        No spam. Unsubscribe anytime.
                      </span>
                    </div>
                  </form>
                ) : (
                  <div style={{
                    background: 'rgba(196,165,123,0.15)', border: '1px solid rgba(196,165,123,0.4)',
                    borderRadius: 16, padding: '1.25rem', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>🎉</div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>You're on the priority list!</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>We'll notify you as soon as Pro goes live with your 3 free months unlocked.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '2.5rem' }}>
            Prices in INR (Indian Rupees) · Transparent pricing · Cancel anytime
          </p>
        </div>

        <style>{`@media (max-width: 640px) { .pricing-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4.5rem 0 6rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ margin: '0 auto 0.75rem' }}>Got Questions?</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{
                background: 'var(--surface-2)', 
                border: '1px solid var(--border)',
                borderRadius: 14, 
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                ...(openFaq === i ? { borderColor: 'rgba(196,165,123,0.5)', boxShadow: 'var(--shadow-sm)' } : {}),
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '1.25rem 1.5rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)',
                    gap: '1rem',
                  }}
                >
                  {item.q}
                  <span style={{
                    flexShrink: 0, width: 24, height: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%', background: openFaq === i ? 'rgba(196,165,123,0.2)' : 'var(--surface)',
                    color: openFaq === i ? 'var(--tan-dark, #9A7A52)' : 'var(--text-3)',
                    fontSize: '1.1rem', fontWeight: 600, lineHeight: 1,
                    transition: 'all 0.2s',
                  }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.75 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default PricingPage;
