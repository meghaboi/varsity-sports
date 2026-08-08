import { Link } from 'react-router-dom';
import AcidSquares from '../components/AcidSquares.jsx';

export default function Home() {
  return (
    <section className="hero">
      <AcidSquares
        color1="#0a0a0a"
        color2="#d4af37"
        color3="#f5f5f0"
        speed={0.6}
        zoom={1.4}
        glow={1.1}
        exposure={2600}
        mouseInteraction={true}
        mouseStrength={0.12}
        grain={true}
        grainIntensity={0.04}
      />
      <div className="hero-content">
        {/* logo already lives in /public in the repo, referenced from root */}
        <img src="/logo.png" alt="Varsity Sports logo" className="hero-logo" />
        <p className="hero-tag">Volunteer Recruitment</p>
        <h1 className="hero-title">Varsity <span>Sports</span></h1>
        <p className="hero-desc">
          This is the biggest basketball season in the country, and we're recruiting
          Varsity Members who will be dedicated season-long. An exclusive opportunity
          to unlock a first-tier college app activity, recommendation letters, and a
          certificate. Apply now.
        </p>
        <Link to="/apply" className="btn">Apply for Volunteer</Link>
      </div>
    </section>
  );
}
