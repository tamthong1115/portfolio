import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import deskModelUrl from '../../assets/models/desk.glb?url';

const DRACO_DECODER_PATH = `${import.meta.env.BASE_URL}draco/`;

export function Desk() {
  const groupRef = useRef(null);
  const screenMeshRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Load Draco-compressed model using local decoder
  const { scene } = useGLTF(deskModelUrl, DRACO_DECODER_PATH);

  // Setup screen material and shadows on meshes
  useEffect(() => {
    let screenMesh = null;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name === 'monitor-screen') {
          screenMesh = child;
        } else if (child.material) {
          // Keep roughness realistic to avoid overly shiny plastic look
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => {
              m.roughness = Math.max(m.roughness || 0, 0.45);
            });
          } else {
            child.material.roughness = Math.max(child.material.roughness || 0, 0.45);
          }
        }
      }
    });

    if (screenMesh) {
      screenMeshRef.current = screenMesh;
      // High-tech terminal monitor emissive surface
      screenMesh.material = new THREE.MeshStandardMaterial({
        color: 0x050d1a,
        emissive: new THREE.Color('#58c5ff'),
        emissiveIntensity: 1.15,
        roughness: 0.6,
        metalness: 0.0,
      });
      screenMesh.castShadow = false;
      screenMesh.receiveShadow = false;
    }
  }, [scene]);

  // Subtle idle animation - floating desk group and subtle monitor glow pulse
  useFrame((state) => {
    if (prefersReducedMotion) {
      // In reduced motion mode, reset positions to strictly static neutral values
      if (groupRef.current) {
        groupRef.current.position.y = 0;
        groupRef.current.rotation.y = -1.4;
        groupRef.current.rotation.x = 0.15;
      }
      if (screenMeshRef.current && screenMeshRef.current.material) {
        screenMeshRef.current.material.emissiveIntensity = 1.15;
      }
      return;
    }

    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle sine-wave floating and yaw drift (idle motion)
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.035;
      groupRef.current.rotation.y = -1.4 + Math.sin(t * 0.4) * 0.02;
      groupRef.current.rotation.x = 0.15 + Math.cos(t * 0.5) * 0.008;
    }

    if (screenMeshRef.current && screenMeshRef.current.material) {
      // Faint monitor pulse & flicker: primary slow pulse with micro-fluctuation
      const slowPulse = Math.sin(t * 2.0) * 0.1;
      const microFlicker = Math.sin(t * 17.0) > 0.95 ? 0.06 : 0;
      screenMeshRef.current.material.emissiveIntensity = 1.15 + slowPulse + microFlicker;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.15, -1.4, 0]}>
      {/* Center helper normalizes model bounding box so desk sits comfortably at origin */}
      <Center position={[0, -0.4, 0]}>
        <primitive object={scene} scale={0.11} />
      </Center>
    </group>
  );
}

// Preload the model asset for instant availability
useGLTF.preload(deskModelUrl, DRACO_DECODER_PATH);

export default Desk;
