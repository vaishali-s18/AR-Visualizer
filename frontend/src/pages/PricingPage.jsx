import { useState } from 'react';
import { CheckCircle2, X, Zap, ArrowRight } from 'lucide-react';
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
  { text: 'Unlimited AR views', included: true },
  { text: 'Unlimited saved designs', included: true },
  { text: 'Full furniture catalogue', included: true },
  { text: 'New arrivals — early access', included: true },
  { text: 'Room style PDF reports', included: true },
  { text: 'Priority support', included: true },
  { text: 'Export room designs (PNG/PDF)', included: true },
  { text: 'Compare up to 4 products side-by-side', included: true },
];

const FAQ = [
  { q: 'When does Pro launch?', a: 'We\'re targeting Q4 2024. Everyone on the waitlist gets 3 months free on launch as a thank-you.' },
  { q: 'How do payments work?', a: 'Once we launch, payments will be via UPI, Debit/Credit Card, and Net Banking through Razorpay — India\'s most trusted payment gateway.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no lock-in. Cancel from your account settings in one click.' },
  { q: 'Is the free plan really free forever?', a: 'Yes. The free plan remains free with no time limits. We\'ll add more features to Pro over time.' },
  { q: 'What devices does AR work on?', a: 'AR works on any modern Android phone (Chrome / Scene Viewer) or iPhone (Safari / Quick Look). No app download needed.' },
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
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>

      {/* Header */}
      <section style={{ padding: '5rem 0 4rem', textAlign: 'center', borderBottom: '1px solid var(--border)', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,212,255,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--accent-dim)', border: '1px solid rgba(0,212,255,0.25)',
            borderRadius: 999, padding: '0.35rem 1rem', marginBottom: '1.75rem',
          }}>
            <Zap size={12} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Early Access — Join the Waitlist
            </span>
          </div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1.25rem' }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-2)', maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.75 }}>
            Start free forever. Upgrade when you need more — at a price that won't surprise you.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '4rem 0 5rem', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 900, margin: '0 auto' }} className="pricing-grid">

            {/* Free Plan */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.75rem' }}>
                  Free Plan
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '3rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.04em' }}>₹0</span>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>/month</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                  Everything you need to start visualizing furniture in AR.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {FREE_FEATURES.map(f => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {f.included
                      ? <CheckCircle2 size={16} style={{ color: 'var(--text-2)', flexShrink: 0 }} />
                      : <X size={16} style={{ color: 'var(--surface-3)', flexShrink: 0 }} />
                    }
                    <span style={{ fontSize: '0.875rem', color: f.included ? 'var(--text-2)' : 'var(--text-3)', textDecoration: f.included ? 'none' : 'none' }}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/catalogue" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '2.5rem' }}>
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div style={{
              background: 'var(--bg)', border: '1px solid rgba(0,212,255,0.4)',
              borderRadius: 24, padding: '2.5rem',
              boxShadow: '0 0 0 1px rgba(0,212,255,0.08), 0 16px 60px rgba(0,212,255,0.07)',
              display: 'flex', flexDirection: 'column',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Top glow line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

              <div style={{ position: 'absolute', top: 20, right: 20, background: 'var(--accent)', color: '#000', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.25rem 0.625rem', borderRadius: 4 }}>
                Launching Soon
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
                  Pro Plan
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '3rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.04em' }}>₹199</span>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>/month</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                  Unlimited everything. Waitlist members get <strong style={{ color: 'var(--accent)' }}>3 months free</strong> on launch.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {PRO_FEATURES.map(f => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                {!submitted ? (
                  <form onSubmit={handleWaitlist}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>
                      Enter your email to join the waitlist:
                    </p>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                      <input
                        type="email"
                        className="input"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ fontSize: '0.875rem' }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: '0.5rem' }}>
                      No spam. Unsubscribe anytime.
                    </p>
                  </form>
                ) : (
                  <div style={{
                    background: 'var(--accent-dim)', border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: 12, padding: '1.25rem', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎉</div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>You're on the list!</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>We'll notify you the moment Pro launches — with your 3 free months ready.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '2rem' }}>
            Prices in INR (Indian Rupees) · Including GST · Cancel anytime
          </p>
        </div>

        <style>{`@media (max-width: 640px) { .pricing-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem 0 6rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Got Questions?</div>
            <h2 className="section-title">Frequently Asked</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 12, overflow: 'hidden',
                transition: 'border-color 0.2s',
                ...(openFaq === i ? { borderColor: 'rgba(0,212,255,0.25)' } : {}),
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '1.25rem 1.5rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.925rem', fontWeight: 600, color: 'var(--text)',
                    gap: '1rem',
                  }}
                >
                  {item.q}
                  <span style={{
                    flexShrink: 0, width: 22, height: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%', background: openFaq === i ? 'var(--accent-dim)' : 'var(--surface-3)',
                    color: openFaq === i ? 'var(--accent)' : 'var(--text-3)',
                    fontSize: '1rem', fontWeight: 700, lineHeight: 1,
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
