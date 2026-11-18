import { useState } from "react";
import { Link } from "react-router-dom";

// SVG room scene illustrations with premium modern colors & transitions
const RoomSceneAR = ({ isNight }) => (
  <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
    <rect width="400" height="280" fill={isNight ? "#110f0c" : "#faf9f6"} style={{ transition: "fill 0.5s" }}/>
    <polygon points="0,280 400,280 320,160 80,160" fill={isNight ? "#1a1612" : "#f0ede9"} style={{ transition: "fill 0.5s" }}/>
    <rect x="80" y="0" width="240" height="160" fill={isNight ? "#14110e" : "#f6f4f0"} style={{ transition: "fill 0.5s" }}/>
    <polygon points="0,0 80,0 80,160 0,280" fill={isNight ? "#0d0a08" : "#ebe8e2"} style={{ transition: "fill 0.5s" }}/>
    <polygon points="320,0 400,0 400,280 320,160" fill={isNight ? "#120f0c" : "#f2eee7"} style={{ transition: "fill 0.5s" }}/>
    <ellipse cx="200" cy="30" rx="120" ry="40" fill={isNight ? "rgba(196,129,48,0.12)" : "rgba(196,129,48,0.03)"} style={{ transition: "fill 0.5s" }} />
    
    {/* Sofa */}
    <rect x="110" y="170" width="180" height="70" rx="16" fill={isNight ? "#422f1d" : "#9e8065"} style={{ transition: "fill 0.5s" }}/>
    <rect x="100" y="160" width="200" height="30" rx="8" fill={isNight ? "#523c26" : "#b0937a"} style={{ transition: "fill 0.5s" }}/>
    <rect x="100" y="155" width="20" height="80" rx="6" fill={isNight ? "#422f1d" : "#9e8065"} style={{ transition: "fill 0.5s" }}/>
    <rect x="280" y="155" width="20" height="80" rx="6" fill={isNight ? "#422f1d" : "#9e8065"} style={{ transition: "fill 0.5s" }}/>
    
    {/* Lamp with light cone */}
    <ellipse cx="310" cy="100" rx="30" ry="30" fill={isNight ? "rgba(255,180,50,0.1)" : "rgba(255,180,50,0.02)"} style={{ transition: "fill 0.5s" }}/>
    <rect x="307" y="90" width="6" height="60" fill={isNight ? "#735712" : "#9e7d28"} style={{ transition: "fill 0.5s" }}/>
    <ellipse cx="310" cy="90" rx="18" ry="8" fill={isNight ? "#cfa12f" : "#ebd068"} style={{ transition: "fill 0.5s" }}/>
    
    {/* AI chat bubble */}
    <rect x="110" y="45" width="140" height="50" rx="12" fill={isNight ? "#1f1f1f" : "#ffffff"} stroke={isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1" style={{ transition: "all 0.5s" }}/>
    <polygon points="120,95 130,95 125,105" fill={isNight ? "#1f1f1f" : "#ffffff"} stroke={isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1" style={{ transition: "all 0.5s" }}/>
    <rect x="122" y="55" width="80" height="6" rx="3" fill={isNight ? "#444" : "#e2e8f0"} style={{ transition: "fill 0.5s" }}/>
    <rect x="122" y="67" width="115" height="6" rx="3" fill={isNight ? "rgba(196,129,48,0.5)" : "rgba(196,129,48,0.8)"} style={{ transition: "fill 0.5s" }}/>
    <rect x="122" y="79" width="50" height="6" rx="3" fill={isNight ? "#444" : "#e2e8f0"} style={{ transition: "fill 0.5s" }}/>
    
    {/* Action badge */}
    <rect x="175" y="112" width="50" height="18" rx="9" fill="#10b981" style={{ transition: "fill 0.5s" }}/>
    <rect x="183" y="118" width="34" height="6" rx="3" fill="#ffffff" opacity="0.9"/>
  </svg>
);

const RoomSceneBuild = ({ isNight }) => (
  <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
    <rect width="400" height="280" fill={isNight ? "#110b14" : "#f7f4fa"} style={{ transition: "fill 0.5s" }}/>
    <polygon points="0,280 400,280 340,160 60,160" fill={isNight ? "#170f1c" : "#ede7f5"} style={{ transition: "fill 0.5s" }}/>
    <rect x="60" y="0" width="280" height="160" fill={isNight ? "#130d18" : "#f1ebfa"} style={{ transition: "fill 0.5s" }}/>
    <polygon points="0,0 60,0 60,160 0,280" fill={isNight ? "#0d0712" : "#e4dbeb"} style={{ transition: "fill 0.5s" }}/>
    <ellipse cx="200" cy="80" rx="160" ry="80" fill={isNight ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.03)"} style={{ transition: "fill 0.5s" }} />
    
    {/* LED shelves glow */}
    <rect x="60" y="60" width="80" height="100" fill={isNight ? "#170f1c" : "#ede7f5"} style={{ transition: "fill 0.5s" }}/>
    <rect x="62" y="65" width="76" height="2" fill="#a78bfa" opacity={isNight ? 0.8 : 0.4}/>
    <rect x="62" y="85" width="76" height="2" fill="#a78bfa" opacity={isNight ? 0.6 : 0.3}/>
    
    {/* Sofa */}
    <rect x="120" y="172" width="160" height="65" rx="14" fill={isNight ? "#241830" : "#7c629c"} style={{ transition: "fill 0.5s" }}/>
    <rect x="110" y="162" width="180" height="28" rx="8" fill={isNight ? "#312142" : "#9176b3"} style={{ transition: "fill 0.5s" }}/>
    <rect x="108" y="158" width="22" height="75" rx="7" fill={isNight ? "#241830" : "#7c629c"} style={{ transition: "fill 0.5s" }}/>
    <rect x="270" y="158" width="22" height="75" rx="7" fill={isNight ? "#241830" : "#7c629c"} style={{ transition: "fill 0.5s" }}/>
    
    {/* Window */}
    <rect x="245" y="25" width="90" height="90" rx="6" fill={isNight ? "#120721" : "#e9e1f5"} style={{ transition: "fill 0.5s" }}/>
    <rect x="245" y="25" width="90" height="90" rx="6" stroke={isNight ? "#312142" : "#cfbfe3"} strokeWidth="2" style={{ transition: "stroke 0.5s" }}/>
  </svg>
);

const RoomScenePlan = ({ isNight }) => (
  <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
    <rect width="400" height="280" fill={isNight ? "#090d12" : "#f4f6f9"} style={{ transition: "fill 0.5s" }}/>
    {/* Blueprint Grid */}
    {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map(x => (
      <line key={`g_x_${x}`} x1={x} y1="0" x2={x} y2="280" stroke={isNight ? "#141c26" : "#e1e5eb"} strokeWidth="1" style={{ transition: "stroke 0.5s" }}/>
    ))}
    {[0, 40, 80, 120, 160, 200, 240, 280].map(y => (
      <line key={`g_y_${y}`} x1="0" y1={y} x2="400" y2={y} stroke={isNight ? "#141c26" : "#e1e5eb"} strokeWidth="1" style={{ transition: "stroke 0.5s" }}/>
    ))}
    {/* Room border outline */}
    <rect x="60" y="40" width="280" height="200" rx="8" fill={isNight ? "#0d131a" : "#ffffff"} stroke={isNight ? "#10b981" : "#10b981"} strokeWidth="2" style={{ transition: "all 0.5s" }}/>
    {/* Sofa view */}
    <rect x="100" y="80" width="120" height="50" rx="8" fill={isNight ? "#1b2735" : "#e8eff7"} stroke={isNight ? "#3b82f6" : "#2563eb"} strokeWidth="1.5" style={{ transition: "all 0.5s" }}/>
    {/* Selection border */}
    <rect x="88" y="68" width="234" height="140" rx="8" fill="none" stroke={isNight ? "#10b981" : "#10b981"} strokeWidth="2" strokeDasharray="6 4" style={{ transition: "stroke 0.5s" }}/>
    {/* Green corner handles */}
    <rect x="84" y="64" width="8" height="8" rx="2" fill="#10b981"/>
    <rect x="318" y="64" width="8" height="8" rx="2" fill="#10b981"/>
    <rect x="84" y="200" width="8" height="8" rx="2" fill="#10b981"/>
    <rect x="318" y="200" width="8" height="8" rx="2" fill="#10b981"/>
    {/* Dimensions */}
    <rect x="148" y="210" width="64" height="20" rx="6" fill="#10b981"/>
    <rect x="153" y="215" width="54" height="10" rx="3" fill={isNight ? "#090d12" : "#ffffff"} style={{ transition: "fill 0.5s" }}/>
  </svg>
);

const RoomSceneStyle = ({ isNight }) => (
  <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
    <rect width="400" height="280" fill={isNight ? "#14100c" : "#faf7f2"} style={{ transition: "fill 0.5s" }}/>
    <polygon points="0,280 400,280 320,150 80,150" fill={isNight ? "#1c160f" : "#ede7dd"} style={{ transition: "fill 0.5s" }}/>
    <rect x="80" y="0" width="240" height="150" fill={isNight ? "#18130d" : "#f4eee4"} style={{ transition: "fill 0.5s" }}/>
    {/* Panel UI Card Overlay */}
    <rect x="220" y="20" width="160" height="240" rx="16" fill={isNight ? "#1d1914" : "#ffffff"} stroke={isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1" opacity="0.98" style={{ transition: "all 0.5s" }}/>
    {/* Swatches */}
    {[
      { y: 48, color: "#8c6b4f" },
      { y: 76, color: "#b59274" },
      { y: 104, color: "#6b5847" },
      { y: 132, color: "#8e998f" },
    ].map((swatch, idx) => (
      <g key={idx}>
        <rect x="232" y={swatch.y} width="24" height="18" rx="4" fill={swatch.color}/>
        <rect x="264" y={swatch.y + 4} width="50" height="4" rx="2" fill={isNight ? "#444" : "#e2e8f0"} style={{ transition: "fill 0.5s" }}/>
      </g>
    ))}
    {/* Small palette preview */}
    <rect x="232" y="170" width="136" height="70" rx="10" fill={isNight ? "#14100a" : "#f7f5f0"} style={{ transition: "fill 0.5s" }}/>
    <circle cx="248" cy="188" r="8" fill="#8c6b4f"/>
    <circle cx="270" cy="188" r="8" fill="#b59274"/>
    <circle cx="292" cy="188" r="8" fill="#6b5847"/>
    <circle cx="314" cy="188" r="8" fill="#8e998f"/>
  </svg>
);

const FEATURE_CARDS = [
  {
    id: 1,
    Scene: RoomSceneAR,
    iconColor: "#38bdf8",
    iconBg: "rgba(56,189,248,0.12)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
        <polyline points="7.5 19.79 7.5 14.6 3 12"/>
      </svg>
    ),
    title: "Design the room together",
    desc: "Pin ideas and nudge furniture with your studio on the same live canvas.",
  },
  {
    id: 2,
    Scene: RoomSceneBuild,
    iconColor: "#34d399",
    iconBg: "rgba(52,211,153,0.12)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
      </svg>
    ),
    title: "Build the room in real time",
    desc: "Move pieces, explore finishes, and align with your studio on one shared canvas.",
  },
  {
    id: 3,
    Scene: RoomScenePlan,
    iconColor: "#fbbf24",
    iconBg: "rgba(251,191,36,0.12)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 21V9M3 9h18"/>
      </svg>
    ),
    title: "Plan with real-world scale",
    desc: "Place furniture, check dimensions, and visualize how everything fits.",
  },
  {
    id: 4,
    Scene: RoomSceneStyle,
    iconColor: "#a78bfa",
    iconBg: "rgba(167,139,250,0.12)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5"/>
        <circle cx="19" cy="14" r="2.5"/>
        <circle cx="8" cy="14" r="2.5"/>
      </svg>
    ),
    title: "Explore finishes instantly",
    desc: "Swap materials and compare palettes before deciding.",
  },
];

const FeatureCard = ({ card, isNight }) => {
  const { Scene, iconColor, iconBg, icon, title, desc } = card;
  return (
    <div
      style={{
        background: isNight ? "#111111" : "#ffffff",
        borderRadius: "24px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: isNight ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: isNight ? "inset 0 1px 1px rgba(255,255,255,0.05)" : "none",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = isNight 
          ? "0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)" 
          : "0 20px 40px rgba(0,0,0,0.05)";
        if (isNight) e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        else e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isNight ? "inset 0 1px 1px rgba(255,255,255,0.05)" : "none";
        e.currentTarget.style.borderColor = isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
      }}
    >
      <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
        <Scene isNight={isNight} />
      </div>

      <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: isNight ? iconBg : `${iconColor}15`,
                color: iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.3s ease",
              }}
            >
              {icon}
            </div>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: isNight ? "#ffffff" : "#111827",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.01em",
                transition: "color 0.3s ease",
              }}
            >
              {title}
            </span>
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: isNight ? "#9ca3af" : "#4b5563",
              lineHeight: 1.6,
              marginLeft: "2.85rem",
              fontFamily: "'Inter', sans-serif",
              transition: "color 0.3s ease",
            }}
          >
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureCards = () => {
  const [isNight, setIsNight] = useState(false);

  return (
    <section
      style={{
        background: isNight ? "#080808" : "#fbfaf7",
        padding: "7rem 0 8rem",
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
        
        {/* Toggle pill matching screenshot 1 */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: isNight ? "#ffffff" : "#64748b",
              letterSpacing: "0.08em",
              transition: "color 0.3s",
            }}
          >
            NIGHT
          </span>
          <button
            onClick={() => setIsNight(!isNight)}
            aria-label="Toggle night mode"
            style={{
              width: 46,
              height: 24,
              borderRadius: 12,
              background: isNight ? "#ffffff" : "#e2e8f0",
              position: "relative",
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: isNight ? "#000000" : "#ffffff",
                position: "absolute",
                top: 3,
                left: isNight ? 25 : 3,
                transition: "left 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            />
          </button>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 400,
              color: isNight ? "#ffffff" : "#111827",
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
              marginBottom: "1.25rem",
              fontFamily: "'Inter', sans-serif",
              transition: "color 0.3s",
            }}
          >
            Design your next room,<br />live, with your studio.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: isNight ? "#888888" : "#4b5563",
              maxWidth: 540,
              margin: "0 auto",
              lineHeight: 1.7,
              transition: "color 0.3s",
            }}
          >
            From the first sketch to the final finish, the whole design
            process stays connected on one shared canvas.
          </p>
        </div>

        {/* Responsive Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem",
          }}
          className="feature-cards-grid"
        >
          {FEATURE_CARDS.map(card => (
            <FeatureCard key={card.id} card={card} isNight={isNight} />
          ))}
        </div>

        {/* Call to action button */}
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <Link
            to="/catalogue"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: isNight ? "#ffffff" : "#111827",
              color: isNight ? "#000000" : "#ffffff",
              padding: "1rem 2.25rem",
              borderRadius: "999px",
              fontSize: "0.95rem",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = isNight ? "#e5e5e5" : "#1f2937";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = isNight ? "#ffffff" : "#111827";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Explore the Catalogue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .feature-cards-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1.5rem !important; }
        }
        @media (max-width: 640px) {
          .feature-cards-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </section>
  );
};

export default FeatureCards;
