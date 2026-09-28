import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function SpinningCube() {
  const meshRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!meshRef.current || prefersReducedMotion) return;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4f46e5" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

export function Scene() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas dpr={[1, 1.5]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <SpinningCube />
      </Canvas>
    </div>
  );
}

export default Scene;
