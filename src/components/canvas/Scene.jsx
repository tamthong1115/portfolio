import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Desk from './Desk';
import CameraRig from './CameraRig';

export function Scene() {
  const [showDevControls, setShowDevControls] = useState(false);

  useEffect(() => {
    // Only in development and when URL hash includes #controls
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      const checkHash = () => {
        setShowDevControls(window.location.hash.includes('controls'));
      };
      checkHash();
      window.addEventListener('hashchange', checkHash);
      return () => window.removeEventListener('hashchange', checkHash);
    }
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: showDevControls ? 'auto' : 'none',
      }}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        frameloop="always"
        shadows="percentage"
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
      >
        {/* Scroll-driven Camera Rig with Additive Idle Motion */}
        <CameraRig />

        {/* Ambient & fill lighting to prevent any pure black shadows */}
        <ambientLight intensity={0.35} />
        <hemisphereLight
          args={['#2c3e55', '#0b0f19', 0.55]}
          position={[0, 5, 0]}
        />

        {/* Warm lamp light - casts soft shadows across desk surface */}
        <pointLight
          castShadow
          position={[-1.2, 0.9, 0.4]}
          color="#ffb366"
          intensity={14}
          distance={7}
          decay={2}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0004}
          shadow-camera-near={0.1}
          shadow-camera-far={10}
        />

        {/* Cool monitor glow - creates atmospheric contrast against warm lamp */}
        <pointLight
          position={[-0.05, 0.25, -0.05]}
          color="#66ccff"
          intensity={6}
          distance={4}
          decay={2}
        />

        {/* Subtle environment reflections */}
        <Environment preset="night" environmentIntensity={0.2} />

        {/* Hero Desk Workspace Model */}
        <Suspense fallback={null}>
          <Desk />
        </Suspense>

        {/* Dev-only OrbitControls: strictly hidden unless DEV mode + #controls hash */}
        {import.meta.env.DEV && showDevControls && (
          <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
        )}
      </Canvas>
    </div>
  );
}

export default Scene;
