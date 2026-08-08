import { Link } from 'react-router-dom';
import Silk from '../components/Silk.jsx';

export default function Home() {
  return (
    <section className="hero">
      {/* Silk shader background */}
      <div className="hero-bg">
        <Silk
          color="#2a1800"
          speed={3}
          scale={1.4}
          noiseIntensity={1.8}
          rotation={0.15}
        />
      </div>

      {/* Dark gradient overlay for depth */}
      <div className="hero-overlay" />

      {/* Navbar strip */}
      <nav className="hero-nav">
        <div className="hero-nav-logo">
          <img src="/varsity-sports/logo.jpeg" alt="Varsity Sports" className="nav-logo-img" />
        </div>
        <div className="hero-nav-right">
          <span className="nav-tag">Volunteer Recruitment</span>
          <Link to="/apply" className="btn btn-sm">Apply Now</Link>
        </div>
      </nav>

      {/* Main content — two-column editorial layout */}
      <div className="hero-body">
        {/* Left: text */}
        <div className="hero-text">
          <p className="hero-eyebrow">Varsity Sports Presents</p>
          <h1 className="hero-headline">
            The Biggest<br />
            <em>Basketball</em><br />
            Season.
          </h1>
          <p className="hero-sub">
            We're recruiting dedicated season-long Varsity Members.<br />
            Earn a first-tier college app activity, recommendation letters, and a certificate.
          </p>
          <div className="hero-ctas">
            <Link to="/apply" className="btn btn-primary">Apply Now →</Link>
            <a href="#about" className="btn btn-ghost">Learn More →</a>
          </div>

          {/* Stats row */}
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">01</span>
              <span className="stat-label">Season-Long</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">∞</span>
              <span className="stat-label">Opportunities</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Exclusive</span>
            </div>
          </div>
        </div>

        {/* Right: logo crest */}
        <div className="hero-visual">
          <div className="hero-crest-glow" />
          <div className="hero-crest-wrap">
            <img
              src="/varsity-sports/logo.jpeg"
              alt="Varsity Sports crest"
              className="hero-crest-img"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Scroll to enter</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
