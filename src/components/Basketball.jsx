import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from 'three';

const MODEL_URL = `${import.meta.env.BASE_URL}models/basketball.glb`;

function BasketballModel() {
  const spinRef = useRef(null);
  const tiltRef = useRef(null);
  const { scene } = useLoader(GLTFLoader, MODEL_URL);

  useEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (!material) return;
        material.envMapIntensity = 1.15;
        material.metalness = 0.03;
        material.roughness = material.name === 'Leather procedural' ? 0.68 : 0.84;
        material.color.set(material.name === 'Leather procedural' ? '#1a0d04' : '#c86b1b');
        material.needsUpdate = true;
      });
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!spinRef.current || !tiltRef.current) return;

    // Continuous multi-axis tumble exposes the model from every angle.
    spinRef.current.rotation.x += delta * 0.17;
    spinRef.current.rotation.y += delta * 0.48;
    spinRef.current.rotation.z += delta * 0.12;

    // Pointer movement adds a separate, smoothly damped inspection tilt.
    tiltRef.current.rotation.x += (state.pointer.y * 0.24 - tiltRef.current.rotation.x) * 0.055;
    tiltRef.current.rotation.y += (state.pointer.x * 0.3 - tiltRef.current.rotation.y) * 0.055;
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef} rotation={[0.08, -0.35, -0.08]} scale={1.72}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useLoader.preload(GLTFLoader, MODEL_URL);

export default function Basketball() {
  return (
    <div className="basketball-stage" aria-label="Interactive 3D basketball model">
      <div className="basketball-glow" />
      <Canvas
        camera={{ position: [0, 0, 4.7], fov: 42, near: 0.1, far: 50 }}
        dpr={[1.5, 2.75]}
        frameloop="always"
        shadows
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', precision: 'highp' }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.12;
          gl.outputColorSpace = SRGBColorSpace;
        }}
      >
        <hemisphereLight args={['#ffe6b5', '#180c04', 1.7]} />
        <directionalLight
          position={[-3.5, 4.5, 5]}
          intensity={4.3}
          color="#ffe0a0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.00015}
        />
        <pointLight position={[4, -2, 3]} intensity={12} color="#b76116" />
        <pointLight position={[-4, 0, -2]} intensity={7} color="#d5ad57" />
        <Suspense fallback={null}>
          <BasketballModel />
        </Suspense>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.53, 0]} receiveShadow>
          <planeGeometry args={[5.5, 5.5]} />
          <shadowMaterial transparent opacity={0.28} />
        </mesh>
      </Canvas>
      <div className="ball-ground-shadow" />
    </div>
  );
}
