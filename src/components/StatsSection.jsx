import { useEffect, useRef, useState } from 'react';

function CountUp({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const numberRef = useRef(null);

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return undefined;
    let frame;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setDisplay(value);
        return;
      }

      const start = performance.now();
      const duration = 1700;
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplay(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        run();
        observer.disconnect();
      }
    }, { threshold: 0.28 });
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={numberRef}>{display.toLocaleString('en-IN')}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="metrics-section" aria-labelledby="metrics-title">
      <div className="section-shell metrics-inner">
        <div className="metrics-heading">
          <p className="metrics-kicker">Varsity in numbers</p>
          <h2 id="metrics-title">Built by students.<br />Seen by millions.</h2>
        </div>
        <div className="metrics-grid">
          <article><strong><CountUp value={2500} /></strong><p>Athletes</p></article>
          <article><strong><CountUp value={150} /></strong><p>Schools</p></article>
          <article><strong><CountUp value={50} suffix="M+" /></strong><p>People reached</p></article>
        </div>
      </div>
    </section>
  );
}
