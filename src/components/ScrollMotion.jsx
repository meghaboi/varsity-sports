import { useEffect } from 'react';

const SELECTORS = [
  '.metrics-heading > *',
  '.metrics-grid article',
  '.countdown-copy > *',
  '.countdown-panel',
  '.section-intro > *',
  '.benefit-grid article',
  '.outcomes-heading > *',
  '.university-card',
  '.outcomes-cta > *',
  '.press-heading > *',
  '.press-grid > *',
  '.apply-layout > *',
  '.footer-row > *',
].join(',');

export default function ScrollMotion() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(SELECTORS));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    elements.forEach((element) => {
      const siblings = Array.from(element.parentElement?.children || []);
      const index = Math.max(0, siblings.indexOf(element));
      element.classList.add('scroll-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 270)}ms`);
    });

    if (reducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
