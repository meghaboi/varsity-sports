import { useEffect, useRef, useState } from 'react';
import logoImg from '../assets/logo-mark.png';
import { Boid } from './Boids.js';

export default function Preloader({ onDone }) {
  const canvasRef = useRef(null);
  const exitTimerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrame;
    let progressFrame;
    let doneTimer;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const pointer = { x: 0, y: 0, active: false };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resize();
    const flockSize = Math.min(320, Math.max(180, Math.floor((width * height) / 5000)));
    const motionConfig = reducedMotion ? {
      maxSpeed: 1.15,
      maxForce: 0.018,
      perceptionRadius: 48,
      separationDistance: 24,
      separationWeight: 1.5,
      alignmentWeight: 1,
      cohesionWeight: 1,
    } : undefined;
    const flock = Array.from(
      { length: flockSize },
      () => new Boid(Math.random() * width, Math.random() * height)
    );
    const colors = ['#efd392', '#d5ad57', '#a45145'];

    const updatePointer = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const clearPointer = () => { pointer.active = false; };

    const draw = () => {
      context.fillStyle = 'rgba(8, 8, 6, 0.28)';
      context.fillRect(0, 0, width, height);
      flock.forEach((boid) => {
        boid.flock(flock, motionConfig);

        if (pointer.active) {
          const dx = pointer.x - boid.position.x;
          const dy = pointer.y - boid.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 18 && distance < 260) {
            const response = reducedMotion ? 0.006 : 0.014;
            boid.applyForce({ x: (dx / distance) * response, y: (dy / distance) * response });
          }
        }

        boid.update(width, height, motionConfig);

        const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
        context.save();
        context.translate(boid.position.x, boid.position.y);
        context.rotate(angle);
        context.scale(boid.visualScale, boid.visualScale);
        context.beginPath();
        context.moveTo(10, 0);
        context.lineTo(-6, -4);
        context.lineTo(-3, 0);
        context.lineTo(-6, 4);
        context.closePath();
        context.fillStyle = colors[boid.colorIndex];
        context.fill();
        context.restore();
      });
      animationFrame = requestAnimationFrame(draw);
    };

    const start = performance.now();
    const duration = reducedMotion ? 500 : 2200;
    const updateProgress = (now) => {
      const value = Math.min((now - start) / duration, 1);
      setProgress(Math.round((1 - Math.pow(1 - value, 3)) * 100));
      if (value < 1) progressFrame = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', clearPointer);
    draw();
    progressFrame = requestAnimationFrame(updateProgress);
    doneTimer = window.setTimeout(() => {
      setProgress(100);
      setReady(true);
    }, duration);

    return () => {
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(progressFrame);
      clearTimeout(doneTimer);
      clearTimeout(exitTimerRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer);
      document.documentElement.removeEventListener('pointerleave', clearPointer);
    };
  }, [onDone]);

  const enterSite = () => {
    setLeaving(true);
    exitTimerRef.current = window.setTimeout(onDone, 650);
  };

  return (
    <div className={`preloader ${leaving ? 'is-leaving' : ''}`}>
      <canvas ref={canvasRef} className="preloader-canvas" aria-hidden="true" />
      <div className="preloader-vignette" />
      <div className="preloader-content">
        <img src={logoImg} alt="Varsity Sports" className="preloader-logo" />
        <p className="preloader-kicker">Changing sports in India</p>
        <h1 className="preloader-title">Varsity Sports</h1>
        <div className="preloader-meter" aria-label={`Loading ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        {ready ? (
          <button type="button" className="preloader-enter" onClick={enterSite}>
            Explore Varsity
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>
          </button>
        ) : (
          <p className="preloader-progress">Preparing Varsity&nbsp;&nbsp;{String(progress).padStart(3, '0')}</p>
        )}
      </div>
    </div>
  );
}
