import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ 
      background: 'var(--surface)', 
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
    }}>

      <div className="container" style={{ padding: '4rem 2rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>

          {/* Brand col */}
          <div>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontWeight: 600, 
              fontSize: '1.5rem', 
              marginBottom: '1rem',
            }}>
              AR Interior
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-2)', maxWidth: 280 }}>
              Visualize furniture in your real environment with augmented reality and create a room that feels truly yours.
            </p>
          </div>

          {/* Navigate */}
          <FooterCol title="Navigate">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/catalogue">Explore Furniture</FooterLink>
            <FooterLink to="/designs">My Designs</FooterLink>
            <FooterLink to="/about">About</FooterLink>
          </FooterCol>

          {/* Categories */}
          <FooterCol title="Categories">
            <FooterLink to="/catalogue?category=Sofas">Sofas</FooterLink>
            <FooterLink to="/catalogue?category=Chairs">Chairs</FooterLink>
            <FooterLink to="/catalogue?category=Tables">Tables</FooterLink>
            <FooterLink to="/catalogue?category=Lighting">Lighting</FooterLink>
          </FooterCol>

          {/* Account */}
          <FooterCol title="Account">
            <FooterLink to="/login">Sign In</FooterLink>
            <FooterLink to="/signup">Create Account</FooterLink>
            <FooterLink to="/profile">Profile</FooterLink>
          </FooterCol>

        </div>

        {/* Bottom bar */}
        <div style={{ 
          borderTop: '1px solid var(--border)', 
          paddingTop: '2rem',
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          alignItems: 'center', 
          justifyContent: 'space-between',
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>
            © {year} AR Interior · B.Tech Final Year Project
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>
            Built with React · Vite · Tailwind CSS · WebXR
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
      letterSpacing: '0.1em', 
      textTransform: 'uppercase', 
      color: 'var(--text-3)', 
      marginBottom: '1rem',
    }}>
      {title}
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {children}
    </div>
  </div>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    style={{ fontSize: '0.9rem', color: 'var(--text-2)', transition: 'color 0.2s' }}
    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; }}
  >
    {children}
  </Link>
);

export default Footer;
