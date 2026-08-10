import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--text)', color: '#C9C3BB', marginTop: 'auto' }}>

      {/* Main footer grid */}
      <div className="container" style={{ padding: '4rem 1.5rem 3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
        }}>

          {/* Brand col */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: '#F7F4EF' }}>
                AR Visualizer
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#9B8F85', maxWidth: 260 }}>
              Visualize Before You Realize. Place true-to-scale 3D furniture in your space using augmented reality — before you buy.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          {[
                { label: 'GitHub',    href: 'https://github.com'    },
                { label: 'LinkedIn',  href: 'https://linkedin.com'  },
                { label: 'Twitter',   href: 'https://twitter.com'   },
                { label: 'Instagram', href: 'https://instagram.com' },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#9B8F85', transition: 'all 0.15s',
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#F7F4EF'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9B8F85'; }}
                >
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <FooterCol title="Explore">
            <FooterLink to="/catalogue">Furniture Catalogue</FooterLink>
            <FooterLink to="/catalogue?category=Sofas">Sofas</FooterLink>
            <FooterLink to="/catalogue?category=Chairs">Chairs</FooterLink>
            <FooterLink to="/catalogue?category=Lighting">Lighting</FooterLink>
            <FooterLink to="/catalogue?category=Tables">Tables</FooterLink>
          </FooterCol>

          {/* Project */}
          <FooterCol title="Project">
            <FooterLink to="/about">About the Project</FooterLink>
            <FooterLink to="/about#tech">Technology Stack</FooterLink>
            <FooterLink to="/about#team">Our Team</FooterLink>
            <FooterLink to="/about#ar">How AR Works</FooterLink>
          </FooterCol>

          {/* Account */}
          <FooterCol title="Account">
            <FooterLink to="/login">Sign In</FooterLink>
            <FooterLink to="/signup">Create Account</FooterLink>
            <FooterLink to="/designs">Saved Designs</FooterLink>
            <FooterLink to="/profile">Profile</FooterLink>
          </FooterCol>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem 1.5rem' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.8rem', color: '#6B6159' }}>
            © {year} AR Interior Design Visualizer · B.Tech Final Year Project
          </p>
          <p style={{ fontSize: '0.8rem', color: '#6B6159' }}>
            Built with React · Vite · Tailwind CSS · WebXR
          </p>
        </div>
      </div>

    </footer>
  );
};

/* Small helper sub-components */
const FooterCol = ({ title, children }) => (
  <div>
    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6159', marginBottom: '1rem' }}>
      {title}
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {children}
    </div>
  </div>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    style={{ fontSize: '0.875rem', color: '#9B8F85', transition: 'color 0.15s' }}
    onMouseEnter={e => { e.currentTarget.style.color = '#F7F4EF'; }}
    onMouseLeave={e => { e.currentTarget.style.color = '#9B8F85'; }}
  >
    {children}
  </Link>
);

export default Footer;
