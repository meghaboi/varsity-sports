import { useEffect, useRef } from 'react';

export default function Globe() {
  const containerRef = useRef(null);

  useEffect(() => {
    let world;
    const container = containerRef.current;
    if (!container) return;

    const tryInit = () => {
      if (window.Globe) {
        // Clear container first
        container.innerHTML = '';
        
        // Initialize globe
        world = new window.Globe(container, { animateIn: false })
          .width(container.clientWidth || 400)
          .height(container.clientHeight || 400)
          .backgroundColor('rgba(0,0,0,0)')
          .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
          .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
          .showAtmosphere(true)
          .atmosphereColor('#d4af37')
          .atmosphereDaylightAlpha(0.15);

        // Configure controls
        const controls = world.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.5;
          controls.enableZoom = false; // Prevent user scroll zooming
        }
      }
    };

    // Poll to wait for script loading
    const poll = setInterval(() => {
      if (window.Globe) {
        tryInit();
        clearInterval(poll);
      }
    }, 100);

    tryInit();

    // Resize handler
    const handleResize = () => {
      if (world && container) {
        world.width(container.clientWidth).height(container.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(poll);
      window.removeEventListener('resize', handleResize);
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative', 
        overflow: 'hidden' 
      }} 
    />
  );
}
