import { useEffect, useRef, useState } from 'react';
import logoImg from '../assets/logo.jpeg';

export default function Preloader({ onDone }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // ───── PROGRESS BAR SIMULATION ─────
    const start = performance.now();
    const duration = 2500;
    let rafId;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setFading(true);
        setTimeout(() => onDone(), 550);
      }
    };
    rafId = requestAnimationFrame(tick);

    // ───── LOCAL CANVAS BOIDS SIMULATION ─────
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse interaction coordinates
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Boids definition
    const boids = [];
    const numBoids = 65; // increased count as requested

    class Boid {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = Math.random() * 2 + 3;
        this.maxSpeed = 3.5;
        this.minSpeed = 1.5;
      }

      update() {
        // Simple boids logic: Flock together & avoid mouse
        let avgX = 0, avgY = 0, avgVx = 0, avgVy = 0, neighbors = 0;
        let avoidX = 0, avoidY = 0;

        for (let other of boids) {
          if (other === this) continue;
          const dx = other.x - this.x;
          const dy = other.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 80) {
            avgX += other.x;
            avgY += other.y;
            avgVx += other.vx;
            avgVy += other.vy;
            neighbors++;

            if (dist < 25) {
              avoidX -= dx;
              avoidY -= dy;
            }
          }
        }

        if (neighbors > 0) {
          avgX /= neighbors;
          avgY /= neighbors;
          avgVx /= neighbors;
          avgVy /= neighbors;

          // Cohesion (steer to center)
          this.vx += (avgX - this.x) * 0.005;
          this.vy += (avgY - this.y) * 0.005;

          // Alignment (steer to avg velocity)
          this.vx += (avgVx - this.vx) * 0.02;
          this.vy += (avgVy - this.vy) * 0.02;
        }

        // Separation (avoid crowding)
        this.vx += avoidX * 0.05;
        this.vy += avoidY * 0.05;

        // Mouse avoidance behavior
        const mdx = mouse.x - this.x;
        const mdy = mouse.y - this.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 150) {
          // Push away from mouse
          this.vx -= (mdx / mdist) * 0.45;
          this.vy -= (mdy / mdist) * 0.45;
        }

        // Limit speed
        const speed = Math.hypot(this.vx, this.vy);
        if (speed > this.maxSpeed) {
          this.vx = (this.vx / speed) * this.maxSpeed;
          this.vy = (this.vy / speed) * this.maxSpeed;
        } else if (speed < this.minSpeed) {
          this.vx = (this.vx / speed) * this.minSpeed;
          this.vy = (this.vy / speed) * this.minSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        const angle = Math.atan2(this.vy, this.vx);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);

        // Draw boid as a sleek glowing arrowhead
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#d4af37';
        ctx.fillStyle = 'rgba(212, 175, 87, 0.8)';
        ctx.beginPath();
        ctx.moveTo(this.size * 2, 0);
        ctx.lineTo(-this.size, -this.size * 0.7);
        ctx.lineTo(-this.size * 0.5, 0);
        ctx.lineTo(-this.size, this.size * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize boids
    for (let i = 0; i < numBoids; i++) {
      boids.push(new Boid());
    }

    let boidsRafId;
    const animateBoids = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw dark background texture
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);

      boids.forEach((boid) => {
        boid.update();
        boid.draw();
      });

      boidsRafId = requestAnimationFrame(animateBoids);
    };
    animateBoids();

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(boidsRafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      {/* Background Boids Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Centered Content */}
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
            boxShadow: '0 0 50px rgba(201,162,39,0.3)',
            animation: 'preloaderPulse 2.5s ease-in-out infinite',
          }}
        >
          <img
            src={logoImg}
            alt="Varsity Sports"
            style={{ width: '92%', height: '92%', objectFit: 'contain' }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.72rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#c9a227',
            margin: '0 0 0.4rem',
            fontWeight: 600,
          }}>
            CHANGING SPORTS IN INDIA
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#f2ede4',
            margin: 0,
            letterSpacing: '0.02em',
          }}>
            Varsity Sports
          </h2>
        </div>

        <div style={{ width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '100%',
            height: 3,
            background: 'rgba(201,162,39,0.15)',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #c9a227, #f0c84a)',
              borderRadius: 3,
              boxShadow: '0 0 8px rgba(201,162,39,0.7)',
            }} />
          </div>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.7rem',
            color: 'rgba(201,162,39,0.7)',
            letterSpacing: '0.15em',
            fontWeight: 500,
          }}>
            {progress}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes preloaderPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 50px rgba(201,162,39,0.3); }
          50% { transform: scale(1.03); box-shadow: 0 0 70px rgba(201,162,39,0.55); }
        }
      `}</style>
    </div>
  );
}
