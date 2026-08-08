import { useRef } from 'react';

export default function Basketball() {
  const ballRef = useRef(null);

  const handleMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -18;
    ballRef.current?.style.setProperty('--rx', `${rotateX}deg`);
    ballRef.current?.style.setProperty('--ry', `${rotateY}deg`);
  };

  const reset = () => {
    ballRef.current?.style.setProperty('--rx', '-5deg');
    ballRef.current?.style.setProperty('--ry', '-10deg');
  };

  return (
    <div className="basketball-stage" onMouseMove={handleMove} onMouseLeave={reset} aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="basketball" ref={ballRef}>
        <div className="ball-grain" />
        <svg viewBox="0 0 400 400" className="ball-lines">
          <circle cx="200" cy="200" r="194" />
          <path d="M200 6c-62 54-94 119-94 194s32 140 94 194" />
          <path d="M200 6c62 54 94 119 94 194s-32 140-94 194" />
          <path d="M10 137c89 36 163 36 228 0 45-25 91-33 152-23" />
          <path d="M10 263c89-36 163-36 228 0 45 25 91 33 152 23" />
        </svg>
        <div className="ball-stamp">VS</div>
      </div>
      <div className="ball-shadow" />
      <p className="visual-note"><span>01</span> Built for the next generation</p>
    </div>
  );
}
