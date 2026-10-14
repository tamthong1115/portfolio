import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createScreenCanvasTexture } from './screenTexture';
import deskModelUrl from '../../assets/models/desk.glb?url';

const DRACO_DECODER_PATH = `${import.meta.env.BASE_URL}draco/`;

export function Desk() {
  const groupRef = useRef(null);
  const screenMeshRef = useRef(null);
  const screenTextureManagerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { currentTheme, openTerminal } = useWorkspace();

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

      // Create live dynamic CRT terminal canvas texture
      const texManager = createScreenCanvasTexture(
        currentTheme.emissive,
        currentTheme.label
      );
      screenTextureManagerRef.current = texManager;

      // High-tech terminal monitor with live canvas texture
      screenMesh.material = new THREE.MeshStandardMaterial({
        color: 0x050d1a,
        map: texManager.texture,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: texManager.texture,
        emissiveIntensity: 1.15,
        roughness: 0.5,
        metalness: 0.05,
      });
      screenMesh.castShadow = false;
      screenMesh.receiveShadow = false;
    }

    return () => {
      screenTextureManagerRef.current?.dispose();
    };
  }, [scene, currentTheme.emissive, currentTheme.label]);

  // Update canvas texture theme when CRT theme changes
  useEffect(() => {
    if (screenTextureManagerRef.current) {
      screenTextureManagerRef.current.updateTheme(
        currentTheme.emissive,
        currentTheme.label
      );
    }
  }, [currentTheme]);

  // Monitor screen pulse & dynamic canvas rendering
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (screenTextureManagerRef.current) {
      screenTextureManagerRef.current.render(t, prefersReducedMotion);
    }

    if (prefersReducedMotion) {
      if (screenMeshRef.current && screenMeshRef.current.material) {
        screenMeshRef.current.material.emissiveIntensity = 1.15;
      }
      return;
    }

    if (screenMeshRef.current && screenMeshRef.current.material) {
      // Faint monitor pulse & flicker: primary slow pulse with micro-fluctuation
      const slowPulse = Math.sin(t * 2.0) * 0.08;
      const microFlicker = Math.sin(t * 17.0) > 0.96 ? 0.05 : 0;
      screenMeshRef.current.material.emissiveIntensity = 1.15 + slowPulse + microFlicker;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.15, -1.4, 0]}>
      {/* Center helper normalizes model bounding box so desk sits comfortably at origin */}
      <Center position={[0, -0.4, 0]}>
        <primitive
          object={scene}
          scale={0.11}
          onClick={(e) => {
            if (e.object?.name === 'monitor-screen') {
              e.stopPropagation();
              openTerminal();
            }
          }}
          onPointerOver={(e) => {
            if (e.object?.name === 'monitor-screen') {
              document.body.style.cursor = 'pointer';
            }
          }}
          onPointerOut={(e) => {
            if (e.object?.name === 'monitor-screen') {
              document.body.style.cursor = 'auto';
            }
          }}
        />
      </Center>
    </group>
  );
}

// Preload the model asset for instant availability
useGLTF.preload(deskModelUrl, DRACO_DECODER_PATH);

export default Desk;
