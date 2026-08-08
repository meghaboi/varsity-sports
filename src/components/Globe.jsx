import { useEffect, useRef } from 'react';

// Stylized procedural world map coordinates for continents
// Mapped as coordinate arrays [latitude, longitude] to resemble Earth continents
const CONTINENTS = [
  // North America
  [[-100, 40], [-120, 50], [-120, 60], [-80, 60], [-60, 50], [-80, 30], [-100, 20], [-100, 40]],
  // South America
  [[-70, -10], [-50, -10], [-40, -10], [-60, -40], [-70, -50], [-70, -30], [-80, -10], [-70, -10]],
  // Africa
  [[20, 10], [10, 30], [30, 30], [40, 15], [20, -30], [10, -20], [-10, 5], [0, 30], [20, 10]],
  // Eurasia (Europe + Asia)
  [[0, 50], [30, 60], [60, 70], [100, 70], [120, 60], [140, 50], [120, 30], [100, 20], [80, 10], [40, 30], [10, 40], [0, 50]],
  // Australia
  [[120, -20], [140, -20], [150, -30], [130, -35], [115, -30], [120, -20]]
];

export default function Globe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement.clientHeight || 400);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.clientWidth || 400;
      height = canvas.height = canvas.parentElement.clientHeight || 400;
    };
    window.addEventListener('resize', handleResize);

    let rotationY = 0;
    let rotationX = 0.3; // Tilt the globe slightly

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const radius = Math.min(width, height) * 0.42;
      const cx = width / 2;
      const cy = height / 2;

      // 1. Draw glowing atmosphere behind globe
      const backGlow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.3);
      backGlow.addColorStop(0, 'rgba(201, 162, 39, 0.12)');
      backGlow.addColorStop(1, 'rgba(201, 162, 39, 0)');
      ctx.fillStyle = backGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw base sphere shadow/lighting
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#080808';
      ctx.fill();

      // Helper: Project 3D sphere coordinate to 2D screen coordinate
      const project = (lat, lon) => {
        // Convert to radians
        const radLat = (lat * Math.PI) / 180;
        const radLon = (lon * Math.PI) / 180 + rotationY;

        // 3D coordinates on sphere
        const x3d = Math.cos(radLat) * Math.sin(radLon);
        const y3d = Math.sin(radLat);
        const z3d = Math.cos(radLat) * Math.cos(radLon);

        // Apply X rotation (tilt)
        const rx = x3d;
        const ry = y3d * Math.cos(rotationX) - z3d * Math.sin(rotationX);
        const rz = y3d * Math.sin(rotationX) + z3d * Math.cos(rotationX);

        // If it's on the front half (facing camera)
        return {
          x: cx + rx * radius,
          y: cy - ry * radius,
          visible: rz > 0,
          depth: rz
        };
      };

      // 3. Draw grid lines (latitude & longitude)
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.18)';
      ctx.lineWidth = 1;

      // Longitude lines (vertical rings)
      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 5) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Latitude lines (horizontal rings)
      for (let lat = -60; lat <= 60; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lon = 0; lon <= 360; lon += 5) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // 4. Draw continents (glowing landmasses)
      ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
      ctx.strokeStyle = 'rgba(244, 212, 122, 0.8)';
      ctx.lineWidth = 1.5;

      CONTINENTS.forEach(polygon => {
        ctx.beginPath();
        let first = true;
        let visibleCount = 0;

        polygon.forEach(([lon, lat]) => {
          const pt = project(lat, lon);
          if (pt.visible) {
            visibleCount++;
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        });

        if (visibleCount > 1) {
          ctx.stroke();
          // Semi-transparent land fill
          ctx.fillStyle = 'rgba(201, 162, 39, 0.15)';
          ctx.fill();
        }
      });

      // 5. Draw glowing outer rim / atmosphere line
      ctx.strokeStyle = 'rgba(244, 212, 122, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Front highlighting overlay
      const gradient = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(201, 162, 39, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Rotate the globe
      rotationY += 0.004;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }} />
    </div>
  );
}
