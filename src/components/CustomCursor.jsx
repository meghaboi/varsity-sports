import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    let x = -100;
    let y = -100;
    let ringX = -100;
    let ringY = -100;
    let frame;

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      document.body.classList.add('cursor-visible');
    };
    const hide = () => document.body.classList.remove('cursor-visible');
    const setInteractive = (event) => {
      const active = event.target.closest('a, button, input, textarea, label');
      document.body.classList.toggle('cursor-interactive', Boolean(active));
    };
    const render = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', setInteractive);
    document.documentElement.addEventListener('mouseleave', hide);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', setInteractive);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.body.classList.remove('cursor-visible', 'cursor-interactive');
    };
  }, []);

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span className="cursor-ring" ref={ringRef} />
      <span className="cursor-dot" ref={dotRef} />
    </div>
  );
}
