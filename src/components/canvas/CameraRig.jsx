import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useLenis } from '../../hooks/useLenis';
import { CAMERA_STOPS } from '../../data/cameraStops';

gsap.registerPlugin(ScrollTrigger);

export function CameraRig() {
  const scrollRigRef = useRef(null);
  const idleRigRef = useRef(null);
  const cameraRef = useRef(null);
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  // Internal state object updated by GSAP ScrollTrigger timeline
  const rigState = useRef({
    posX: CAMERA_STOPS.hero.pos[0],
    posY: CAMERA_STOPS.hero.pos[1],
    posZ: CAMERA_STOPS.hero.pos[2],
    targetX: CAMERA_STOPS.hero.target[0],
    targetY: CAMERA_STOPS.hero.target[1],
    targetZ: CAMERA_STOPS.hero.target[2],
  });

  // Setup GSAP ScrollTrigger timeline
  useEffect(() => {
    // When prefersReducedMotion is enabled, keep camera fixed at hero stop
    if (prefersReducedMotion) {
      rigState.current = {
        posX: CAMERA_STOPS.hero.pos[0],
        posY: CAMERA_STOPS.hero.pos[1],
        posZ: CAMERA_STOPS.hero.pos[2],
        targetX: CAMERA_STOPS.hero.target[0],
        targetY: CAMERA_STOPS.hero.target[1],
        targetZ: CAMERA_STOPS.hero.target[2],
      };
      return;
    }

    const ctx = gsap.context(() => {
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainContent,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrub with slight inertia
          invalidateOnRefresh: true,
        },
      });

      // Stop 1 (Hero) -> Stop 2 (About)
      tl.to(rigState.current, {
        posX: CAMERA_STOPS.about.pos[0],
        posY: CAMERA_STOPS.about.pos[1],
        posZ: CAMERA_STOPS.about.pos[2],
        targetX: CAMERA_STOPS.about.target[0],
        targetY: CAMERA_STOPS.about.target[1],
        targetZ: CAMERA_STOPS.about.target[2],
        ease: 'power2.inOut',
        duration: 1,
      })
        // Stop 2 (About) -> Stop 3 (Projects)
        .to(rigState.current, {
          posX: CAMERA_STOPS.projects.pos[0],
          posY: CAMERA_STOPS.projects.pos[1],
          posZ: CAMERA_STOPS.projects.pos[2],
          targetX: CAMERA_STOPS.projects.target[0],
          targetY: CAMERA_STOPS.projects.target[1],
          targetZ: CAMERA_STOPS.projects.target[2],
          ease: 'power2.inOut',
          duration: 1,
        })
        // Stop 3 (Projects) -> Stop 4 (Contact)
        .to(rigState.current, {
          posX: CAMERA_STOPS.contact.pos[0],
          posY: CAMERA_STOPS.contact.pos[1],
          posZ: CAMERA_STOPS.contact.pos[2],
          targetX: CAMERA_STOPS.contact.target[0],
          targetY: CAMERA_STOPS.contact.target[1],
          targetZ: CAMERA_STOPS.contact.target[2],
          ease: 'power2.inOut',
          duration: 1,
        });
    });

    return () => {
      ctx.revert(); // Completely tears down timelines and scrollTriggers
    };
  }, [prefersReducedMotion]);

  // Debounced window resize listener to keep stops aligned with section boundaries
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Expose inspection interface in DEV mode
  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      window.__cameraRig = {
        getState: () => ({
          posX: Number(rigState.current.posX.toFixed(3)),
          posY: Number(rigState.current.posY.toFixed(3)),
          posZ: Number(rigState.current.posZ.toFixed(3)),
          targetX: Number(rigState.current.targetX.toFixed(3)),
          targetY: Number(rigState.current.targetY.toFixed(3)),
          targetZ: Number(rigState.current.targetZ.toFixed(3)),
        }),
        getScrollRig: () => ({
          position: scrollRigRef.current
            ? [
                Number(scrollRigRef.current.position.x.toFixed(3)),
                Number(scrollRigRef.current.position.y.toFixed(3)),
                Number(scrollRigRef.current.position.z.toFixed(3)),
              ]
            : null,
          rotation: scrollRigRef.current
            ? [
                Number(scrollRigRef.current.rotation.x.toFixed(3)),
                Number(scrollRigRef.current.rotation.y.toFixed(3)),
                Number(scrollRigRef.current.rotation.z.toFixed(3)),
              ]
            : null,
        }),
        getIdleRig: () => ({
          position: idleRigRef.current
            ? [
                Number(idleRigRef.current.position.x.toFixed(3)),
                Number(idleRigRef.current.position.y.toFixed(3)),
                Number(idleRigRef.current.position.z.toFixed(3)),
              ]
            : null,
        }),
      };
      return () => {
        delete window.__cameraRig;
      };
    }
  }, []);

  // Frame tick: Drive Lenis, ScrollTrigger, camera rig transform, and additive idle float
  useFrame((state) => {
    // Drive Lenis from R3F's single render loop
    if (lenis) {
      lenis.raf(performance.now());
    }
    ScrollTrigger.update();

    // Apply scroll-driven position to scrollRig
    if (scrollRigRef.current) {
      scrollRigRef.current.position.set(
        rigState.current.posX,
        rigState.current.posY,
        rigState.current.posZ
      );
    }

    // Apply lookAt target to the camera
    if (cameraRef.current) {
      cameraRef.current.lookAt(
        rigState.current.targetX,
        rigState.current.targetY,
        rigState.current.targetZ
      );
    }

    // Apply subtle additive idle float to idleRig child
    if (idleRigRef.current) {
      if (prefersReducedMotion) {
        idleRigRef.current.position.set(0, 0, 0);
        idleRigRef.current.rotation.set(0, 0, 0);
      } else {
        const t = state.clock.getElapsedTime();
        idleRigRef.current.position.y = Math.sin(t * 0.7) * 0.02;
        idleRigRef.current.position.x = Math.cos(t * 0.5) * 0.01;
        idleRigRef.current.rotation.z = Math.sin(t * 0.6) * 0.004;
        idleRigRef.current.rotation.x = Math.cos(t * 0.4) * 0.003;
      }
    }
  });

  return (
    <group
      ref={scrollRigRef}
      position={[
        CAMERA_STOPS.hero.pos[0],
        CAMERA_STOPS.hero.pos[1],
        CAMERA_STOPS.hero.pos[2],
      ]}
    >
      <group ref={idleRigRef}>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 0, 0]}
          fov={42}
        />
      </group>
    </group>
  );
}

export default CameraRig;
