import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerformanceMonitor } from '@react-three/drei';
import Desk from './Desk';
import CameraRig from './CameraRig';

export function ThreeCanvas({ isHighTier, onDegrade, showDevControls }) {
  return (
    <Canvas
      frameloop="always"
      shadows={isHighTier ? 'percentage' : false}
      dpr={isHighTier ? [1, 1.5] : [1, 1]}
      gl={{
        antialias: isHighTier,
        powerPreference: isHighTier ? 'high-performance' : 'default',
        stencil: false,
      }}
    >
      {/* Live performance monitor: downgrade tier if sustained FPS drops below 28-30 */}
      <PerformanceMonitor
        bounds={[28, 52]}
        onDecline={() => {
          if (onDegrade) onDegrade('decline');
        }}
        onFallback={() => {
          if (onDegrade) onDegrade('fallback');
        }}
      />

      {/* Scroll-driven Camera Rig with Additive Idle Motion */}
      <CameraRig />

      {/* Ambient & fill lighting: compensated on mid tier */}
      <ambientLight intensity={isHighTier ? 0.35 : 0.65} />
      <hemisphereLight
        args={['#2c3e55', '#0b0f19', isHighTier ? 0.55 : 0.75]}
        position={[0, 5, 0]}
      />

      {/* Warm lamp light - casts soft shadows only on high tier */}
      <pointLight
        castShadow={isHighTier}
        position={[-1.2, 0.9, 0.4]}
        color="#ffb366"
        intensity={isHighTier ? 14 : 12}
        distance={7}
        decay={2}
        shadow-mapSize={isHighTier ? [1024, 1024] : [512, 512]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.1}
        shadow-camera-far={10}
      />

      {/* Cool monitor glow */}
      <pointLight
        position={[-0.05, 0.25, -0.05]}
        color="#66ccff"
        intensity={isHighTier ? 6 : 5}
        distance={4}
        decay={2}
      />

      {/* Subtle environment reflections on high tier */}
      {isHighTier && <Environment preset="night" environmentIntensity={0.2} />}

      {/* Hero Desk Workspace Model */}
      <Suspense fallback={null}>
        <Desk />
      </Suspense>

      {/* Dev-only OrbitControls: strictly hidden unless DEV mode + #controls hash */}
      {import.meta.env.DEV && showDevControls && (
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
      )}
    </Canvas>
  );
}

export default ThreeCanvas;
