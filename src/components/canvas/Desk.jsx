import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createScreenCanvasTexture } from './screenTexture';
import deskModelUrl from '../../assets/models/desk.glb?url';

const DRACO_DECODER_PATH = `${import.meta.env.BASE_URL}draco/`;

function resolveInteractiveItem(object) {
  if (!object) return null;
  const name = object.name || '';
  const matName = object.material?.name || '';

  if (
    name === 'monitor-screen' ||
    matName === 'system_monitor' ||
    name === 'polySurface213_chair_wood1_0_7'
  ) {
    return {
      id: 'terminal',
      label: 'Retro CRT Monitor',
      action: 'Open Terminal CLI',
      icon: '🖥️',
    };
  }
  if (matName === 'system_keyboard' || name === 'polySurface213_chair_wood1_0_8') {
    return {
      id: 'keyboard',
      label: 'Mechanical Keyboard',
      action: 'Type Code',
      icon: '⌨️',
    };
  }
  if (matName === 'system_cpu' || name === 'polySurface213_chair_wood1_0_5') {
    return {
      id: 'cpu',
      label: 'Retro CPU Tower',
      action: 'Read Floppy Disk',
      icon: '💾',
    };
  }
  if (matName === 'system_mouse' || name === 'polySurface213_chair_wood1_0_6') {
    return {
      id: 'mouse',
      label: 'Vintage Mouse',
      action: 'Click Button',
      icon: '🖱️',
    };
  }
  if (matName === 'book' || name === 'polySurface213_chair_wood1_0_9') {
    return {
      id: 'book',
      label: 'Developer Notebook',
      action: 'Flip Notes',
      icon: '📖',
    };
  }
  if (matName === 'pen_holder' || name === 'polySurface213_chair_wood1_0_4') {
    return {
      id: 'pen_holder',
      label: 'Stationery & Pens',
      action: 'Inspect Tools',
      icon: '✏️',
    };
  }
  if (
    matName === 'chair_wood1' ||
    matName === 'chair_cushion' ||
    name === 'polySurface213_chair_wood1_0_1' ||
    name === 'polySurface213_chair_wood1_0_10'
  ) {
    return {
      id: 'chair',
      label: 'Office Chair',
      action: 'Swivel',
      icon: '🪑',
    };
  }
  return null;
}

export function Desk() {
  const groupRef = useRef(null);
  const screenMeshRef = useRef(null);
  const screenTextureManagerRef = useRef(null);

  const chairMeshesRef = useRef([]);
  const keyboardMeshRef = useRef(null);
  const initialKeyboardYRef = useRef(null);
  const cpuMeshRef = useRef(null);
  const initialCpuXRef = useRef(null);

  const chairWobbleRef = useRef(0);
  const keyboardDipRef = useRef(0);
  const cpuVibeRef = useRef(0);

  const prefersReducedMotion = useReducedMotion();
  const { currentTheme, setHoveredObject, interactWithObject, activeInteraction } = useWorkspace();

  // Load Draco-compressed model using local decoder
  const { scene } = useGLTF(deskModelUrl, DRACO_DECODER_PATH);

  // Setup screen material, interactive mesh references, and shadows
  useEffect(() => {
    let screenMesh = null;
    const chairs = [];

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const matName = child.material?.name || '';

        if (child.name === 'monitor-screen') {
          screenMesh = child;
        } else if (matName === 'chair_wood1' || matName === 'chair_cushion') {
          chairs.push(child);
        } else if (matName === 'system_keyboard') {
          keyboardMeshRef.current = child;
          if (initialKeyboardYRef.current === null) {
            initialKeyboardYRef.current = child.position.y;
          }
        } else if (matName === 'system_cpu') {
          cpuMeshRef.current = child;
          if (initialCpuXRef.current === null) {
            initialCpuXRef.current = child.position.x;
          }
        }

        if (child.material && child.name !== 'monitor-screen') {
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

    chairMeshesRef.current = chairs;

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

  // Trigger tactile response animations when activeInteraction changes
  useEffect(() => {
    if (activeInteraction === 'chair') chairWobbleRef.current = 1.0;
    if (activeInteraction === 'keyboard') keyboardDipRef.current = 1.0;
    if (activeInteraction === 'cpu') cpuVibeRef.current = 1.0;
  }, [activeInteraction]);

  // Monitor screen pulse & dynamic canvas rendering & micro-animations
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

    // Dynamic micro-interactions
    if (chairWobbleRef.current > 0.001) {
      chairWobbleRef.current = THREE.MathUtils.lerp(chairWobbleRef.current, 0, 0.06);
      const wobble = Math.sin(t * 14.0) * 0.06 * chairWobbleRef.current;
      chairMeshesRef.current.forEach((mesh) => {
        if (mesh) mesh.rotation.y = wobble;
      });
    }

    if (keyboardDipRef.current > 0.001 && keyboardMeshRef.current) {
      keyboardDipRef.current = THREE.MathUtils.lerp(keyboardDipRef.current, 0, 0.14);
      if (initialKeyboardYRef.current !== null) {
        keyboardMeshRef.current.position.y =
          initialKeyboardYRef.current - 0.04 * keyboardDipRef.current;
      }
    }

    if (cpuVibeRef.current > 0.001 && cpuMeshRef.current) {
      cpuVibeRef.current = THREE.MathUtils.lerp(cpuVibeRef.current, 0, 0.08);
      if (initialCpuXRef.current !== null) {
        const vibe = Math.sin(t * 45.0) * 0.02 * cpuVibeRef.current;
        cpuMeshRef.current.position.x = initialCpuXRef.current + vibe;
      }
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
            const item = resolveInteractiveItem(e.object);
            if (item) {
              e.stopPropagation();
              interactWithObject(item);
            }
          }}
          onPointerOver={(e) => {
            const item = resolveInteractiveItem(e.object);
            if (item) {
              document.body.style.cursor = 'pointer';
              setHoveredObject(item);
            }
          }}
          onPointerOut={(e) => {
            const item = resolveInteractiveItem(e.object);
            if (item) {
              document.body.style.cursor = 'auto';
              setHoveredObject(null);
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
