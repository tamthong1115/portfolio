# Phase 11: 3D Desk Raycasting & Procedural Sound Immersion

## Overview
Phase 11 introduces interactive 3D raycasting and synthesized procedural sound effects to Truong Tam Thong's portfolio. Visitors can now interact directly with objects on the retro 3D desk — mechanical keyboard, CPU tower, mouse, notebook, pen holder, swivel chair, monitor, and desk lamp — triggering tactile micro-animations, authentic sound effects, and floating discovery hints.

---

## Key Features

### 1. Interactive 3D Raycasting on Desk Meshes (`Desk.jsx`, `ThreeCanvas.jsx`)
- Raycast target resolution accurately identifies individual components of the 3D model:
  - **Mechanical Keyboard (`system_keyboard`)**: Click to simulate tactile typing with Cherry MX Blue clacks.
  - **Retro CPU Tower (`system_cpu`)**: Click to simulate floppy disk drive seek steps and read operations.
  - **Vintage Mouse (`system_mouse`)**: Click to register tactile microswitch clicks.
  - **Developer Notebook (`book`)**: Click to flip pages and cycle engineering principles / tech stacks.
  - **Stationery Holder (`pen_holder`)**: Click to inspect system architecture drafting tools.
  - **Ergonomic Swivel Chair (`chair_wood1`, `chair_cushion`)**: Click to swivel the chair with acoustic creak.
  - **Retro CRT Monitor (`monitor-screen`)**: Click to launch the interactive VT100 CLI terminal.
  - **Desk Lamp (`pointLight` & hit proxy)**: Click directly on the lamp head to toggle warm illumination and ambient dust particles.

### 2. Procedural Web Audio API Sound Synthesizer (`soundEffects.js`)
Zero external MP3/WAV files, zero bandwidth cost, and instantaneous playback via the Web Audio API:
- `playKeyboardClickSound()`: High-frequency tactile snap (2400–3000Hz) followed by a low resonant bottom-out thud (380Hz).
- `playDiskDriveSound()`: 3 rapid square-wave head step pulses (700–1000Hz) mimicking an authentic 1.44MB 3.5" floppy disk seek.
- `playMouseClickSound()`: 2100Hz microswitch click with rapid exponential decay.
- `playPageFlipSound()`: Bandpass-filtered white noise sweep simulating paper texture rustle.
- `playPenClinkSound()`: Resonant 3400Hz harmonic metallic chime.
- `playChairSwivelSound()`: Subtle 180Hz acoustic swivel glide.
- `playLampClickSound()`: Mechanical rocker switch toggle.
- `playTerminalChirp()`: High-tech VT100 sine wave beeps.

### 3. Tactile 3D Micro-Animations (`Desk.jsx`)
- **Swivel Chair**: Gentle harmonic rotation wobble on click using `THREE.MathUtils.lerp`.
- **Mechanical Keyboard**: Micro Y-axis keypress depress effect.
- **CPU Tower**: Subtle X-axis vibration during floppy drive read.
- Fully honors `prefers-reduced-motion` (animations skipped if reduced motion is requested).

### 4. Interactive Target Discovery HUD (`WorkspaceHUD.jsx`)
- Dynamic floating status pill rendered at the bottom center of the viewport whenever a 3D object is hovered:
  - Shows object icon, title, and recommended action (e.g. `[ ⌨️ Mechanical Keyboard • Click to Type Code ]`).
  - Seamlessly fades in and out with zero layout shift.
  - Completely accessible with `role="status"` and `aria-live="polite"`.

---

## Verification & QA Results

| Test Suite / Audit | Result | Status |
|---|---|---|
| **Linter (`oxlint`)** | **0 errors, 0 warnings** | Green across 44 files |
| **Vite Production Build** | **Built in 1.00s** | 0 warnings, zero extra dependencies |
| **Axe Accessibility Audit** | **0 violations** | Desktop, Mobile, Menu Open, Low-Tier Poster |
| **Keyboard Navigation** | **Passed** | 25 focusable elements, zero traps, full visual focus rings |
| **Terminal Functionality** | **0 errors** | Help, Neofetch, Themes, Matrix rain, Escape close |
| **3D Raycasting & Sound** | **0 errors** | Raycast clicks, HUD discovery pills, and audio toggle verified |
