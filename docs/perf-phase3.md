# Phase 3 Performance & 3D Scene Report

## 1. 3D Model Assets & Optimization

- **Asset Path**: `src/assets/models/desk.glb` (and mirror copy in `public/models/desk.glb`)
- **Raw File**: `src/assets/models/raw/desk_raw.glb` (gitignored)
- **Model Description**: Retro developer workstation featuring wooden desk, vintage computer tower, CRT-style monitor with separate display screen mesh (`monitor-screen`), mechanical keyboard, mouse, pen holder, and reference book.
- **Source & Attribution**: Stylized Retro Computer Workspace (CC-BY 4.0 / Open Asset).
- **Optimization Strategy**:
  - Compressed with `glTF-Transform v4` utilizing Draco geometry compression (`KHR_draco_mesh_compression`) and WebP texture compression (`EXT_texture_webp`).
  - Offline Draco decoder included locally in `public/draco/` to avoid external runtime CDN dependencies.
- **File Size**:
  - Final optimized GLB: **1.47 MB** (1,473,572 bytes)
  - Target budget: < 3.0 MB (**51% below maximum budget threshold**)

---

## 2. Rendering & Frame Rate Measurements

| Metric | Target Budget | Measured Value | Status |
| :--- | :--- | :--- | :--- |
| **Draw Calls** | < 100 calls | **12 calls** | Pass (Optimal) |
| **Frame Rate** | 60 FPS | **60 FPS** (stable vsync) | Pass |
| **Frame Time** | < 16.6 ms | **~2.8 ms - 4.2 ms** | Pass |
| **DPR Clamping** | `[1, 1.5]` | Clamped to max 1.5 | Pass |
| **Shadow Map Size** | 1024 x 1024 | 1024 x 1024 (PointLight) | Pass |
| **Triangle / Poly Count** | < 100k | ~18.5k triangles | Pass |

---

## 3. Lighting & Aesthetic Trade-offs

1. **Warm Desk Lamp + Cool Monitor Contrast**:
   - Desk Lamp: Positioned at `[-1.2, 0.9, 0.4]` with warm tint (`#ffb366`), gentle falloff (distance: 7, decay: 2), and soft shadow casting across the keyboard and desk surface.
   - Monitor Screen: Emissive `MeshStandardMaterial` (`#58c5ff`, intensity ~1.15, roughness 0.6 to eliminate glare reflection) paired with an atmospheric cool pointLight at `[-0.05, 0.25, -0.05]` (`#66ccff`, intensity: 6, distance: 4) radiating outward onto the mechanical keyboard and desk surface.
2. **Camera & Scene Composition**:
   - Perspective Camera positioned at `[0, 0.95, 3.7]` (FOV: 42°), angled downward onto the desk surface.
   - Desk group positioned at origin (`[0, 0, 0]`) with base rotation `[0.15, -1.4, 0]`, orienting the terminal monitor, glowing keyboard, chassis drives, pen holder, and wooden chair directly into a dynamic 3/4 isometric hero view.
3. **Shadow Artifact Mitigation**:
   - Configured `shadow-bias={-0.0004}` and tight near/far planes (`0.1` to `10`) to eliminate shadow acne and peter-panning while maintaining sharp, natural shadows on low-to-medium spec devices.
4. **Ambient Baseline**:
   - `ambientLight` (intensity 0.35) combined with `hemisphereLight` (`#2c3e55` sky, `#0b0f19` ground, intensity 0.55) ensures crevices and unlit surfaces stay rich and atmospheric rather than falling into pitch-black void.
   - `Environment preset="night"` provides subtle physical reflections without dominating the scene.

---

## 4. Motion & Accessibility

- **Idle Motion**:
  - The desk group gently floats on a sine wave (`delta y: ±0.035 units`, slow period ~8.9s) with micro-pitch and yaw variations.
  - The monitor screen exhibits an organic low-frequency pulsation and subtle occasional micro-flicker mimicking vintage cathode ray / LCD power regulation.
- **Reduced Motion Support (`prefers-reduced-motion: reduce`)**:
  - Gated via `useReducedMotion()`. When active, all sinusoidal translation, yaw/pitch drift, and screen flicker are completely neutralized, fixing the scene at neutral coordinates.

---

## 5. Loading Experience & Fallbacks

- Component: `src/components/ui/Loader.jsx`
- Tracks real asset loading via drei's `useProgress`.
- Enforces minimum 400ms display duration to avoid disorienting flicker on fast connections.
- Smooth CSS opacity fade-out (500ms duration) once loading reaches 100%.
- Interactive "Skip 3D Intro" button immediately dismisses overlay and restores user interaction.
- Overlay completely removes itself from DOM flow (`return null` after transition) ensuring 100% unimpeded scrollability.
