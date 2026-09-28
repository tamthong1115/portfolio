# 3D Portfolio Concept & Design Foundation

## One-Sentence Concept
A calm, immersive 3D architectural journey where the camera seamlessly glides through space as the user scrolls, pausing at dedicated stops for Home, About, Projects, and Contact.

---

## 4 Camera Stops
Each stop aligns with a semantic section on the page, smoothly interpolated along a camera path:

1. **Hero (`#hero` / Home)**
   - **Camera Position & View**: Wide-angle establishing shot positioned directly in front of the central 3D artifact (floating geometric centerpiece), bathed in soft ambient and directional lighting.
2. **About (`#about` / About)**
   - **Camera Position & View**: Intimate medium shot; camera dollies inward and pans 45° to an oblique perspective, highlighting fine surface textures and depth of field.
3. **Projects (`#projects` / Projects)**
   - **Camera Position & View**: Elevated isometric/top-down perspective looking across a sequence of illuminated project display pedestals.
4. **Contact (`#contact` / Contact)**
   - **Camera Position & View**: Low-angle upward tilt looking toward a tranquil, illuminated horizon beacon, providing an open and peaceful visual conclusion.

---

## Mood Words & Palette

### Mood Words
- **Calm**
- **Architectural**
- **Modern**
- **Precise**
- **Atmospheric**

### Palette Tokens (Tailwind v4 `@theme`)
All color combinations are rigorously tested to pass WCAG AA (and WCAG AAA) text contrast standards:

| Token | Hex Value | Role | Contrast Ratio on `--color-bg` |
| :--- | :--- | :--- | :--- |
| `--color-bg` | `#0b0f19` | Primary canvas & body background (Deep Midnight Slate) | — |
| `--color-surface` | `#141b2d` | Elevated containers, cards, and border framing | ~1.3:1 (Subtle surface contrast) |
| `--color-text` | `#f8fafc` | Primary text and section titles (Slate 50) | **17.2:1** (Passes WCAG AAA) |
| `--color-muted` | `#94a3b8` | Supporting copy, metadata, and nav labels (Slate 400) | **7.1:1** (Passes WCAG AAA) |
| `--color-accent` | `#818cf8` | Interactive links, tags, and focal highlights (Indigo 400) | **6.6:1** (Passes WCAG AA) |

---

## Typography & Self-Hosted Fonts

To eliminate external render-blocking network calls and respect user privacy, fonts are self-hosted via `@fontsource-variable`:

1. **Display Font: Space Grotesk Variable (`--font-display`)**
   - **Package**: `@fontsource-variable/space-grotesk`
   - **Rationale**: Geometric sans-serif with architectural precision, clean mechanical quirks, and contemporary technical identity. Perfectly aligns with the developer's engineering and 3D aesthetic for section headings.
2. **Body Font: Inter Variable (`--font-body`)**
   - **Package**: `@fontsource-variable/inter`
   - **Rationale**: World-class neutral interface font designed for exceptional readability at small-to-medium screen sizes. Features extensive Unicode glyph coverage (including Vietnamese diacritics and Latin extended) and variable weight interpolation for lean asset delivery.

---

## Open Decisions

1. **3D Asset Source**
   - *Option A*: Pure procedural R3F geometries (meshes, wireframes, custom noise shaders) for zero asset network overhead and instant time-to-interactive.
   - *Option B*: Custom lightweight GLTF/GLB models (optimized with Draco/Meshopt compression) loaded via `@react-three/drei`'s `useGLTF`.
2. **Atmospheric & Post-Processing Effects**
   - Evaluate whether to introduce `@react-three/postprocessing` (Selective Bloom, Vignette, Depth of Field) or maintain lightweight Three.js built-in fog and particle fields to preserve 60+ FPS on mobile GPUs.
3. **Scroll Interpolation Strategy**
   - Finalize Lenis smooth scroll damping and GSAP ScrollTrigger timeline interpolation curves for camera `position.set` and `lookAt` targeting between the 4 section markers.
