import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

function createBallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');

  const gradient = context.createLinearGradient(0, 0, 1024, 512);
  gradient.addColorStop(0, '#d98a27');
  gradient.addColorStop(0.48, '#b96318');
  gradient.addColorStop(1, '#8a3d0c');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 512);

  context.fillStyle = 'rgba(45, 19, 5, .32)';
  for (let y = 3; y < 512; y += 6) {
    for (let x = 3; x < 1024; x += 6) {
      context.beginPath();
      context.arc(x + ((y / 6) % 2) * 2.2, y, 0.72, 0, Math.PI * 2);
      context.fill();
    }
  }

  context.strokeStyle = '#211208';
  context.lineWidth = 15;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(0, 256);
  context.lineTo(1024, 256);
  context.moveTo(512, 0);
  context.lineTo(512, 512);
  context.moveTo(256, 0);
  context.bezierCurveTo(365, 145, 365, 367, 256, 512);
  context.moveTo(768, 0);
  context.bezierCurveTo(659, 145, 659, 367, 768, 512);
  context.moveTo(0, 90);
  context.bezierCurveTo(230, 205, 390, 205, 512, 90);
  context.bezierCurveTo(634, -25, 794, -25, 1024, 90);
  context.moveTo(0, 422);
  context.bezierCurveTo(230, 307, 390, 307, 512, 422);
  context.bezierCurveTo(634, 537, 794, 537, 1024, 422);
  context.stroke();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

function Ball() {
  const meshRef = useRef(null);
  const texture = useMemo(createBallTexture, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.16;
    meshRef.current.rotation.x += (state.pointer.y * 0.14 - meshRef.current.rotation.x) * 0.045;
    meshRef.current.rotation.z += (-state.pointer.x * 0.12 - meshRef.current.rotation.z) * 0.045;
  });

  return (
    <mesh ref={meshRef} castShadow rotation={[0, -0.4, -0.08]}>
      <sphereGeometry args={[1.45, 96, 96]} />
      <meshPhysicalMaterial map={texture} bumpMap={texture} bumpScale={0.035} roughness={0.72} clearcoat={0.12} clearcoatRoughness={0.7} />
    </mesh>
  );
}

export default function Basketball() {
  return (
    <div className="basketball-stage" aria-label="Interactive 3D basketball">
      <div className="basketball-glow" />
      <Canvas camera={{ position: [0, 0, 4.7], fov: 42 }} dpr={[1, 2]} shadows gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.35} />
        <directionalLight position={[-3, 4, 5]} intensity={4.2} color="#ffe0a0" />
        <pointLight position={[4, -2, 3]} intensity={15} color="#b76116" />
        <Ball />
      </Canvas>
      <div className="ball-ground-shadow" />
      <p className="visual-note"><span>01</span> Built for the next generation</p>
    </div>
  );
}
