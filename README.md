# 3D Portfolio

A modern, interactive 3D developer portfolio built with React 19, Three.js, and React Three Fiber (R3F).

## Planned Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) + [React Three Fiber (@react-three/fiber)](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation & Motion**: [GSAP](https://gsap.com/)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/)

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22 LTS (Node 24 LTS supported)
- npm

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

## Image Optimization

Project assets are placed in `src/assets/projects/` named `<project-id>.jpg|png|webp` and imported directly via Vite for automatic hashing and bundle optimization.

To convert source PNG or JPG images to optimized WebP format, run:

```bash
node scripts/optimize-images.mjs
```

This uses `sharp` to resize and compress images into 16:9 1280x720 WebP files.

## Assets Note

- `public/og.png`: Temporary 1200x630 placeholder graphic displaying the site name and title on the dark canvas theme. Remember to replace this with an in-engine capture of the finished 3D scene before production launch.
- `src/assets/models/desk.glb`: Retro developer workstation 3D model (1.47 MB), optimized with Draco geometry compression and WebP textures via glTF-Transform. Licensed under CC-BY 4.0.

