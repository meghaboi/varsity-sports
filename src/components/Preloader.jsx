import { useEffect, useRef, useState } from 'react';
import logoImg from '../assets/logo.jpeg';

export default function Preloader({ onDone }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrame;
    let progressFrame;
    let doneTimer;
    let exitTimer;
    const pointer = { x: -1000, y: -1000 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    class Boid {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.45) * 3.2;
        this.vy = (Math.random() - 0.5) * 3.2;
        this.size = 3 + Math.random() * 4;
        this.tone = Math.random();
      }

      update(flock) {
        let centerX = 0;
        let centerY = 0;
        let alignX = 0;
        let alignY = 0;
        let separateX = 0;
        let separateY = 0;
        let count = 0;

        flock.forEach((other) => {
          if (other === this) return;
          const dx = other.x - this.x;
          const dy = other.y - this.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 105) {
            centerX += other.x;
            centerY += other.y;
            alignX += other.vx;
            alignY += other.vy;
            count += 1;
            if (distance < 28) {
              separateX -= dx / Math.max(distance, 1);
              separateY -= dy / Math.max(distance, 1);
            }
          }
        });

        if (count) {
          this.vx += ((centerX / count) - this.x) * 0.0008 + ((alignX / count) - this.vx) * 0.025;
          this.vy += ((centerY / count) - this.y) * 0.0008 + ((alignY / count) - this.vy) * 0.025;
        }
        this.vx += separateX * 0.065;
        this.vy += separateY * 0.065;

        const pointerDistance = Math.hypot(pointer.x - this.x, pointer.y - this.y);
        if (pointerDistance < 150) {
          this.vx -= ((pointer.x - this.x) / Math.max(pointerDistance, 1)) * 0.16;
          this.vy -= ((pointer.y - this.y) / Math.max(pointerDistance, 1)) * 0.16;
        }

        const speed = Math.hypot(this.vx, this.vy);
        const maxSpeed = 3.4;
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw() {
        const angle = Math.atan2(this.vy, this.vx);
        context.save();
        context.translate(this.x, this.y);
        context.rotate(angle);
        context.fillStyle = this.tone > 0.25 ? 'rgba(231, 194, 111, .82)' : 'rgba(246, 240, 224, .72)';
        context.beginPath();
        context.moveTo(this.size * 2.5, 0);
        context.lineTo(-this.size, -this.size * 0.72);
        context.lineTo(-this.size * 0.3, 0);
        context.lineTo(-this.size, this.size * 0.72);
        context.closePath();
        context.fill();
        context.restore();
      }
    }

    resize();
    const flock = Array.from({ length: reducedMotion ? 28 : Math.min(92, Math.round(width / 17)) }, () => new Boid());
    const draw = () => {
      context.clearRect(0, 0, width, height);
      flock.forEach((boid) => {
        if (!reducedMotion) boid.update(flock);
        boid.draw();
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

    const move = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move);
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
      window.removeEventListener('pointermove', move);
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
