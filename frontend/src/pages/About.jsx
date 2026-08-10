import { Link } from 'react-router-dom';
import {
  Smartphone, Code2, Database, Globe, Cpu, Layers,
  Users, BookOpen, Award, ExternalLink, ChevronRight,
} from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────
const TECH_STACK = [
  { icon: <Code2 size={22}/>,   name: 'React 19',        role: 'UI Framework',        color: '#61DAFB' },
  { icon: <Layers size={22}/>,  name: 'Vite 8',          role: 'Build Tool',          color: '#646CFF' },
  { icon: <Globe size={22}/>,   name: 'Tailwind CSS',    role: 'Styling',             color: '#06B6D4' },
  { icon: <Smartphone size={22}/>, name: 'WebXR / model-viewer', role: 'AR Engine', color: '#4ADE80' },
  { icon: <Database size={22}/>, name: 'Node.js + Express', role: 'Backend API',     color: '#68A063' },
  { icon: <Database size={22}/>, name: 'MongoDB',        role: 'Database',            color: '#47A248' },
  { icon: <Cpu size={22}/>,     name: 'Three.js / GLB',  role: '3D Rendering',        color: '#F97316' },
  { icon: <Globe size={22}/>,   name: 'React Router v7', role: 'Client Routing',      color: '#CA4246' },
];

const TEAM = [
  { name: 'Zaid Ahmed',      role: 'Full-Stack Developer',   initials: 'ZA', desc: 'Backend architecture, REST API, MongoDB schema design, and AR integration.' },
  { name: 'Team Member 2',   role: 'Frontend Developer',     initials: 'TM', desc: 'React component design, Tailwind styling, and responsive UI implementation.' },
  { name: 'Team Member 3',   role: 'AR / 3D Specialist',    initials: 'TM', desc: 'WebXR pipeline, GLB model pipeline, and model-viewer configuration.' },
];

const OBJECTIVES = [
  { num: '01', title: 'Reduce Decision Uncertainty', desc: 'Help buyers visualize true-to-scale furniture before purchase, reducing return rates by up to 40%.' },
  { num: '02', title: 'Accessible AR',               desc: 'Leverage WebXR to deliver AR directly in the browser — no app download required on any device.' },
  { num: '03', title: 'Full-Stack Architecture',     desc: 'Demonstrate a production-grade MERN stack app with authentication, analytics, and real-time AR.' },
];

// ─── About ────────────────────────────────────────────────────────────────────
const About = () => {
  return (
    <div style={{ paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--accent) 0%, #2A3828 100%)', padding: '6rem 0 5rem', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            <div className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>B.Tech Final Year Project · 2025–26</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              AR Interior Design<br />Visualizer
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 560 }}>
              A WebXR-powered web application that lets users place true-to-scale 3D furniture in their real environment using their smartphone camera — no app download required.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/ar/p004" className="btn btn-lg" style={{ background: '#fff', color: 'var(--accent)' }}>
                <Smartphone size={17} /> Try AR Demo
              </Link>
              <Link to="/catalogue" className="btn btn-lg" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)' }}>
                View Catalogue <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project summary */}
      <section style={{ padding: '5rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="about-grid">
            <div>
              <div className="section-label">What We Built</div>
              <h2 className="section-title">Project Overview</h2>
              <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                The AR Interior Design Visualizer is a full-stack web application that solves a fundamental problem in furniture shopping: <strong>buyers cannot truly gauge how a piece will look in their space until it arrives</strong> — often too late for second thoughts.
              </p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                By combining a curated 3D furniture catalogue with Google's <code style={{ background: 'var(--surface-2)', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.85em' }}>model-viewer</code> component and the WebXR Device API, we deliver a seamless AR experience entirely within the mobile browser.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[['500+', 'Furniture Models'], ['WebXR', 'AR Engine'], ['MERN', 'Tech Stack'], ['0', 'App Downloads Needed']].map(([v, l]) => (
                  <div key={l} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.2rem' }}>{v}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div id="ar">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>How AR Works in This App</h3>
                {[
                  { step: '1', title: 'Camera Access', desc: 'The browser requests camera permission via WebXR Device API.' },
                  { step: '2', title: 'Surface Detection', desc: 'ARCore (Android) or ARKit (iOS) detects horizontal planes in the room.' },
                  { step: '3', title: 'Model Placement', desc: 'A .GLB 3D model is overlaid on the detected surface at real-world scale.' },
                  { step: '4', title: 'Free Interaction', desc: 'Users move, rotate, and resize the furniture in real time.' },
                ].map(({ step, title, desc }) => (
                  <div key={step} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--accent)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700,
                    }}>{step}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{title}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }`}</style>
      </section>

      {/* Objectives */}
      <section style={{ padding: '5rem 0', background: 'var(--surface-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">Why We Built It</div>
            <h2 className="section-title">Project Objectives</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {OBJECTIVES.map(({ num, title, desc }) => (
              <div key={num} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -8, right: 12, fontFamily: "'Playfair Display', serif", fontSize: '5rem', fontWeight: 700, color: 'var(--border)', lineHeight: 1, userSelect: 'none' }}>{num}</div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,74,58,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Award size={22} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.6rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" style={{ padding: '5rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">Under the Hood</div>
            <h2 className="section-title">Technology Stack</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>Every layer of the application, from browser to database</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {TECH_STACK.map(({ icon, name, role, color }) => (
              <div key={name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: color }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.1rem' }}>{name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" style={{ padding: '5rem 0', background: 'var(--surface-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">The People</div>
            <h2 className="section-title">Meet the Team</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
            {TEAM.map(({ name, role, initials, desc }) => (
              <div key={name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem', textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff',
                  margin: '0 auto 1rem',
                }}>
                  {initials}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{name}</h3>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gold)', marginBottom: '0.875rem' }}>{role}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' }}>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                    style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                    <ExternalLink size={14} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                    style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supervisor / guide */}
      <section style={{ padding: '4rem 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2.5rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(184,150,90,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <BookOpen size={28} style={{ color: 'var(--gold)' }} />
            </div>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Project Guide</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.3rem' }}>Prof. [Supervisor Name]</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>Department of Computer Science & Engineering</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', background: 'var(--accent)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Try It Yourself
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '2rem' }}>
            Open this page on your mobile browser to experience real WebXR AR.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/ar/p004" className="btn btn-lg" style={{ background: '#fff', color: 'var(--accent)' }}>
              <Smartphone size={17} /> Launch AR
            </Link>
            <Link to="/catalogue" className="btn btn-lg" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)' }}>
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
