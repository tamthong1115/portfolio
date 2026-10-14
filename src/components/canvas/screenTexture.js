import * as THREE from 'three';

/**
 * Creates and manages a dynamic 2D canvas texture simulating a live retro CRT terminal screen.
 */
export function createScreenCanvasTexture(themeColor = '#58c5ff', themeLabel = 'Cyber Cyan') {
  const width = 512;
  const height = 384;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  let lastFrame = 0;
  let currentColor = themeColor;
  let currentLabel = themeLabel;

  function render(time = 0, isReducedMotion = false) {
    if (!ctx) return;

    // Throttle redrawing to ~10-15 FPS to conserve CPU/GPU
    if (!isReducedMotion && time - lastFrame < 0.08) {
      return;
    }
    lastFrame = time;

    // Clear background: deep CRT black
    ctx.fillStyle = '#030810';
    ctx.fillRect(0, 0, width, height);

    // Subtle scanlines across the CRT face
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }

    // Outer CRT bezel border
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Header bar
    ctx.fillStyle = currentColor;
    ctx.fillRect(16, 16, width - 32, 28);
    ctx.fillStyle = '#030810';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.textBaseline = 'middle';
    ctx.fillText(`PORTFOLIO_OS [VT100] // ${currentLabel.toUpperCase()}`, 24, 30);

    // Terminal content lines
    ctx.fillStyle = currentColor;
    ctx.shadowColor = currentColor;
    ctx.shadowBlur = isReducedMotion ? 0 : 6;
    ctx.font = '14px "Courier New", monospace';

    const lines = [
      '> SYSTEM CORE: INITIALIZED',
      '> ARCHITECTURE: REACT 19 + THREE.JS',
      '> DEV: TRUONG TAM THONG',
      '> ROLE: FULLSTACK ENGINEER',
      '> STATUS: 100% OPERATIONAL',
      '',
      '> CLICK TO LAUNCH INTERACTIVE CLI',
    ];

    let startY = 75;
    for (const line of lines) {
      ctx.fillText(line, 26, startY);
      startY += 26;
    }

    // Blinking prompt cursor
    const showCursor = isReducedMotion || Math.floor(time * 2.5) % 2 === 0;
    if (showCursor) {
      ctx.fillText('> thong@portfolio:~$ █', 26, startY);
    } else {
      ctx.fillText('> thong@portfolio:~$', 26, startY);
    }

    // Reset shadow blur
    ctx.shadowBlur = 0;

    texture.needsUpdate = true;
  }

  function updateTheme(newColor, newLabel) {
    currentColor = newColor;
    currentLabel = newLabel;
    render(0, true);
  }

  // Initial draw
  render(0, true);

  return {
    texture,
    render,
    updateTheme,
    dispose: () => {
      texture.dispose();
    },
  };
}

export default createScreenCanvasTexture;
