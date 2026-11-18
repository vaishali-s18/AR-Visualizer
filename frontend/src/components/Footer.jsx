import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ 
      background: '#111111', 
      color: '#ffffff',
      marginTop: 'auto',
      position: 'relative',
    }}>
      {/* Top golden gradient accent border */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, transparent, #C4A57B 30%, #C4A57B 70%, transparent)',
        width: '100%',
      }} />

      <div className="container" style={{ padding: '4.5rem 2rem 2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem',
        }}>

          {/* Brand col */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1f1a14 0%, #3d2f1f 100%)',
                border: '1px solid rgba(196,165,123,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C4A57B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <h2 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontWeight: 600, 
                fontSize: '1.5rem', 
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
                AR Interior
              </h2>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
              Visualize furniture in your real environment with augmented reality and create a room that feels truly yours.
            </p>
            {/* Tagline pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              background: 'rgba(196,165,123,0.1)',
              border: '1px solid rgba(196,165,123,0.25)',
              fontSize: '0.75rem',
              color: '#C4A57B',
              fontWeight: 600,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              WebXR AR Powered
            </div>
          </div>

          {/* Navigate */}
          <FooterCol title="Navigate">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/catalogue">Explore Furniture</FooterLink>
            <FooterLink to="/designs">My Designs</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/pricing">Pricing Plans</FooterLink>
          </FooterCol>

          {/* Categories */}
          <FooterCol title="Categories">
            <FooterLink to="/catalogue?category=Sofas">Sofas & Couches</FooterLink>
            <FooterLink to="/catalogue?category=Chairs">Lounge Chairs</FooterLink>
            <FooterLink to="/catalogue?category=Tables">Coffee & Dining Tables</FooterLink>
            <FooterLink to="/catalogue?category=Lighting">Ambient Lighting</FooterLink>
            <FooterLink to="/catalogue?category=Storage">Cabinets & Storage</FooterLink>
          </FooterCol>

          {/* Account */}
          <FooterCol title="Account & Help">
            <FooterLink to="/login">Sign In</FooterLink>
            <FooterLink to="/signup">Create Free Account</FooterLink>
            <FooterLink to="/profile">My Profile</FooterLink>
            <FooterLink to="/favourites">Saved Favourites</FooterLink>
          </FooterCol>

        </div>

        {/* Bottom bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.08)', 
          paddingTop: '2rem',
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          alignItems: 'center', 
          justifyContent: 'space-between',
        }}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
            © {year} AR Interior · B.Tech Final Year Project
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
            Built with React · WebXR · Three.js · Tailwind CSS
          </p>
        </div>
      </div>

    </footer>
  );
};

const FooterCol = ({ title, children }) => (
  <div>
    <p style={{ 
      fontSize: '0.75rem', 
      fontWeight: 700, 
      letterSpacing: '0.12em', 
      textTransform: 'uppercase', 
      color: '#C4A57B', 
      marginBottom: '1.25rem',
    }}>
      {title}
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {children}
    </div>
  </div>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    style={{ 
      fontSize: '0.9rem', 
      color: 'rgba(255,255,255,0.65)', 
      transition: 'all 0.2s ease',
      display: 'inline-block',
    }}
    onMouseEnter={e => { 
      e.currentTarget.style.color = '#ffffff'; 
      e.currentTarget.style.transform = 'translateX(3px)';
    }}
    onMouseLeave={e => { 
      e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; 
      e.currentTarget.style.transform = 'translateX(0)';
    }}
  >
    {children}
  </Link>
);

export default Footer;
