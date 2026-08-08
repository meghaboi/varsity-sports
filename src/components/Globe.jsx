/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function GlobeSphere() {
  const meshRef = useRef();
  const dotsRef = useRef();

  // Create a grid of points on a sphere for a high-tech dotted globe look
  const points = useMemo(() => {
    const pts = [];
    const count = 350;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);
      pts.push(new THREE.Vector3(x * 1.5, y * 1.5, z * 1.5));
    }
    return pts;
  }, []);

  const tempObject = new THREE.Object3D();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.rotation.x = time * 0.05;
    }
    if (dotsRef.current) {
      dotsRef.current.rotation.y = -time * 0.1;
      
      // Animate the dots slightly
      points.forEach((point, i) => {
        const factor = Math.sin(time + i) * 0.03;
        tempObject.position.copy(point).multiplyScalar(1 + factor);
        tempObject.scale.setScalar(0.02 + Math.sin(time * 2 + i) * 0.01);
        tempObject.updateMatrix();
        dotsRef.current.setMatrixAt(i, tempObject.matrix);
      });
      dotsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Semi-transparent inner sphere */}
      <mesh>
        <sphereGeometry args={[1.48, 32, 32]} />
        <meshBasicMaterial
          color="#d4af37"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sphere Wireframe */}
      <mesh>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial
          color="#d4af37"
          wireframe
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Dotted sphere surface */}
      <instancedMesh ref={dotsRef} args={[null, null, points.length]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#f4d47a" />
      </instancedMesh>

      {/* Floating orbital ring 1 */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.8, 1.82, 64]} />
        <meshBasicMaterial color="#d4af37" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>

      {/* Floating orbital ring 2 */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <ringGeometry args={[2.0, 2.01, 64]} />
        <meshBasicMaterial color="#f5f5f0" side={THREE.DoubleSide} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default function Globe() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 55 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <GlobeSphere />
      </Canvas>
    </div>
  );
}
