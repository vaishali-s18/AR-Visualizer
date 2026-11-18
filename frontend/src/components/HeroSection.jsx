import { useState, useEffect } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

// --- FadeIn wrapper ---
const FadeIn = ({ children, delay = 0, duration = 1000, className = "", style = {} }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={"transition-opacity " + className}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// --- AnimatedHeading ---
const AnimatedHeading = ({ text, className = "", style = {} }) => {
  const [animated, setAnimated] = useState(false);
  const CHAR_DELAY = 30;
  const INITIAL_DELAY = 200;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), INITIAL_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const lines = text.split("\n");

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        const chars = line.split("");
        const lineOffset = lines
          .slice(0, lineIndex)
          .reduce((acc, l) => acc + l.length, 0);

        return (
          <span key={lineIndex} style={{ display: "block" }}>
            {chars.map((char, charIndex) => {
              const globalIndex = lineOffset + charIndex;
              const delay = globalIndex * CHAR_DELAY;

              return (
                <span
                  key={charIndex}
                  style={{
                    display: "inline-block",
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateX(0)" : "translateX(-18px)",
                    transition: `opacity 500ms ease ${delay}ms, transform 500ms ease ${delay}ms`,
                    whiteSpace: "pre",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};

// --- HeroNavbar ---
const HeroNavbar = () => {
  const NAV_LINKS = ["Home", "Explore", "AR Mode", "About"];

  return (
    <div className="px-6 md:px-12 lg:px-16 pt-6">
      <div className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
        <span
          className="text-2xl font-semibold tracking-tight text-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          AR Interior
        </span>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-white transition-colors duration-200 hover:text-gray-300"
            >
              {link}
            </a>
          ))}
        </nav>

        <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-100 cursor-pointer">
          Start Designing
        </button>
      </div>
    </div>
  );
};

// --- HeroSection ---
const HeroSection = () => {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
        fontFamily: "'Inter', sans-serif",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Full-screen background video - NO overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Content layer */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <HeroNavbar />

        {/* Hero content - pushed to bottom */}
        <div className="px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 flex-1 flex flex-col justify-end">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">

            {/* Left column */}
            <div>
              <AnimatedHeading
                text={"Visualize Your Space\nBefore You Buy."}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-white"
                style={{
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                  fontFamily: "'Inter', sans-serif",
                }}
              />

              <FadeIn delay={800} duration={1000}>
                <p className="text-base md:text-lg text-gray-300 mb-5">
                  Visualize furniture in your real room before you buy — powered by augmented reality.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-black px-8 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-100 cursor-pointer">
                    Start Designing
                  </button>
                  <button className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white hover:text-black cursor-pointer">
                    Explore Furniture
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right column - tag */}
            <FadeIn
              delay={1400}
              duration={1000}
              className="flex items-end justify-start lg:justify-end mt-8 lg:mt-0"
            >
              <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
                <span
                  className="text-lg md:text-xl lg:text-2xl font-light text-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Visualize. Place. Love It.
                </span>
              </div>
            </FadeIn>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
