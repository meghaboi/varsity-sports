import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = `${import.meta.env.BASE_URL}models/basketball.glb`;

function BasketballModel() {
  const groupRef = useRef(null);
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
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.22;
    groupRef.current.rotation.x += (state.pointer.y * 0.12 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.z += (-state.pointer.x * 0.1 - groupRef.current.rotation.z) * 0.04;
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.35, -0.08]} scale={1.72}>
      <primitive object={scene} />
    </group>
  );
}

useLoader.preload(GLTFLoader, MODEL_URL);

export default function Basketball() {
  return (
    <div className="basketball-stage" aria-label="Interactive 3D basketball model">
      <div className="basketball-glow" />
      <Canvas camera={{ position: [0, 0, 4.7], fov: 42 }} dpr={[1, 2]} shadows gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.25} />
        <directionalLight position={[-3, 4, 5]} intensity={4.1} color="#ffe0a0" castShadow />
        <pointLight position={[4, -2, 3]} intensity={13} color="#b76116" />
        <Suspense fallback={null}>
          <BasketballModel />
        </Suspense>
      </Canvas>
      <div className="ball-ground-shadow" />
    </div>
  );
}
