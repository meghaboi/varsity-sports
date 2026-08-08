import { useEffect, useRef, useState } from 'react';

export default function Preloader({ onDone }) {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Animate the progress bar
    const start = performance.now();
    const duration = 2200;
    let raf;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Begin fade-out
        setFading(true);
        setTimeout(() => onDone(), 500);
      }
    };
    raf = requestAnimationFrame(tick);

    // Boot Vanta Birds once the CDN scripts have loaded
    const tryVanta = () => {
      if (window.VANTA && window.VANTA.BIRDS && vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x080808,
          color1: 0xc9a227,
          color2: 0xf0c84a,
          colorMode: 'lerp',
          birdSize: 1.2,
          wingSpan: 28,
          speedLimit: 4,
          separation: 60,
          alignment: 40,
          cohesion: 25,
          quantity: 3,
        });
      }
    };

    // Poll every 100ms until Vanta is available
    const poll = setInterval(() => {
      tryVanta();
      if (vantaEffect.current) clearInterval(poll);
    }, 100);
    tryVanta();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(poll);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [onDone]);

  return (
    <div
      ref={vantaRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080808',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      {/* Logo */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 60px rgba(201,162,39,0.4), 0 0 120px rgba(201,162,39,0.15)',
            animation: 'preloaderPulse 2s ease-in-out infinite',
          }}
        >
          <img
            src="/varsity-sports/logo.jpeg"
            alt="Varsity Sports"
            style={{ width: '90%', height: '90%', objectFit: 'contain' }}
            onError={(e) => { e.target.src = '/logo.jpeg'; }}
          />
        </div>

        {/* Brand name */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#c9a227',
            margin: '0 0 0.3rem',
          }}>
            CHANGING SPORTS IN INDIA
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#f2ede4',
            margin: 0,
            letterSpacing: '0.02em',
          }}>
            Varsity Sports
          </h2>
        </div>

        {/* Progress bar */}
        <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            width: '100%',
            height: 2,
            background: 'rgba(201,162,39,0.2)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #c9a227, #f0c84a)',
              borderRadius: 2,
              transition: 'width 0.05s linear',
              boxShadow: '0 0 8px rgba(201,162,39,0.8)',
            }} />
          </div>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.65rem',
            color: 'rgba(201,162,39,0.6)',
            letterSpacing: '0.15em',
          }}>
            {progress}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes preloaderPulse {
          0%, 100% { box-shadow: 0 0 60px rgba(201,162,39,0.4), 0 0 120px rgba(201,162,39,0.15); }
          50% { box-shadow: 0 0 80px rgba(201,162,39,0.7), 0 0 160px rgba(201,162,39,0.25); }
        }
      `}</style>
    </div>
  );
}
