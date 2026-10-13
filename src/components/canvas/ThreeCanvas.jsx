import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerformanceMonitor, Sparkles } from '@react-three/drei';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Desk from './Desk';
import CameraRig from './CameraRig';

export function ThreeCanvas({ isHighTier, onDegrade, showDevControls }) {
  const { lampOn, toggleLamp, currentTheme, cycleScreenTheme } = useWorkspace();
  const prefersReducedMotion = useReducedMotion();

  return (
    <Canvas
      frameloop="always"
      shadows={isHighTier ? 'percentage' : false}
      dpr={isHighTier ? [1, 1.5] : [1, 1]}
      style={{ touchAction: 'pan-y' }}
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

      {/* Scroll-driven Camera Rig with Additive Idle Motion & Mouse Parallax */}
      <CameraRig />

      {/* Ambient & fill lighting: compensated on mid tier or when lamp is off */}
      <ambientLight intensity={isHighTier ? (lampOn ? 0.35 : 0.45) : 0.65} />
      <hemisphereLight
        args={['#2c3e55', '#0b0f19', isHighTier ? (lampOn ? 0.55 : 0.65) : 0.75]}
        position={[0, 5, 0]}
      />

      {/* Warm lamp light - dynamically toggled, casts soft shadows only on high tier */}
      <pointLight
        castShadow={isHighTier && lampOn}
        position={[-1.2, 0.9, 0.4]}
        color="#ffb366"
        intensity={lampOn ? (isHighTier ? 14 : 12) : 0.25}
        distance={7}
        decay={2}
        shadow-mapSize={isHighTier ? [1024, 1024] : [512, 512]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.1}
        shadow-camera-far={10}
      />

      {/* Cool monitor glow synced with active CRT theme */}
      <pointLight
        position={[-0.05, 0.25, -0.05]}
        color={currentTheme.glow}
        intensity={isHighTier ? 6 : 5}
        distance={4}
        decay={2}
      />

      {/* Floating atmospheric dust sparkles in the warm lamp light cone */}
      {lampOn && !prefersReducedMotion && (
        <Sparkles
          count={isHighTier ? 32 : 14}
          scale={[1.8, 1.8, 1.8]}
          position={[-0.8, 0.6, 0.2]}
          size={isHighTier ? 2.5 : 2.0}
          speed={0.35}
          opacity={isHighTier ? 0.65 : 0.45}
          color="#ffd499"
        />
      )}

      {/* Interactive 3D Hit Proxy: Desk Lamp */}
      <mesh
        position={[-1.2, 0.9, 0.4]}
        onClick={(e) => {
          e.stopPropagation();
          toggleLamp();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Interactive 3D Hit Proxy: CRT Monitor Screen */}
      <mesh
        position={[-0.05, 0.35, -0.05]}
        onClick={(e) => {
          e.stopPropagation();
          cycleScreenTheme();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[0.6, 0.5, 0.35]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

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
