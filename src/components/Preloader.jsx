import { useEffect, useRef, useState } from 'react';
import logoImg from '../assets/logo.jpeg';
import { Boid } from './Boids.js';

export default function Preloader({ onDone }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrame;
    let progressFrame;
    let doneTimer;
    let exitTimer;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resize();
    const flock = Array.from(
      { length: reducedMotion ? 36 : 120 },
      () => new Boid(Math.random() * canvas.width, Math.random() * canvas.height)
    );
    const draw = () => {
      context.fillStyle = 'rgba(8, 8, 6, 0.2)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      flock.forEach((boid) => {
        if (!reducedMotion) {
          boid.flock(flock);
          boid.update(canvas.width, canvas.height);
        }

        const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
        context.save();
        context.translate(boid.position.x, boid.position.y);
        context.rotate(angle);
        context.beginPath();
        context.moveTo(10, 0);
        context.lineTo(-6, -4);
        context.lineTo(-3, 0);
        context.lineTo(-6, 4);
        context.closePath();
        context.fillStyle = '#d5ad57';
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
    draw();
    progressFrame = requestAnimationFrame(updateProgress);
    doneTimer = window.setTimeout(() => {
      setProgress(100);
      setLeaving(true);
      exitTimer = window.setTimeout(onDone, 650);
    }, duration);

    return () => {
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(progressFrame);
      clearTimeout(doneTimer);
      clearTimeout(exitTimer);
      window.removeEventListener('resize', resize);
    };
  }, [onDone]);

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
        <p className="preloader-progress">Entering Varsity&nbsp;&nbsp;{String(progress).padStart(3, '0')}</p>
      </div>
    </div>
  );
}
