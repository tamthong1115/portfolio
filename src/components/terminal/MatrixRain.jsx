import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function MatrixRain({ onExit }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネハヒフヘホ';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1);

    let lastTime = 0;
    const fpsInterval = 1000 / 28; // ~28 FPS for retro CRT computer feel

    const render = (currentTime) => {
      animId = requestAnimationFrame(render);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      // Faint fade trail
      ctx.fillStyle = 'rgba(5, 12, 10, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff77';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading char is brighter white-green
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#d4ffea';
        } else {
          ctx.fillStyle = '#00ff77';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  // Handle 'q' or 'Escape' to exit matrix mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center font-mono text-[#00ff77]">
        <pre className="text-xs sm:text-sm leading-tight mb-4 select-none">
{`
  ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
  ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
  ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
  ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
  ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
  ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
`}
        </pre>
        <p className="text-sm mb-4">Wake up, Neo... Reduced motion active.</p>
        <button
          type="button"
          onClick={onExit}
          className="px-4 py-1.5 rounded-lg border border-[#00ff77]/50 bg-[#00ff77]/10 text-xs text-[#00ff77] hover:bg-[#00ff77]/20 transition-colors cursor-pointer"
        >
          Return to Shell [Q]
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[320px] bg-[#050d0a] overflow-hidden rounded-b-xl">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#00ff77] bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md border border-[#00ff77]/30 z-20 pointer-events-auto">
        <span className="truncate">MATRIX DIGITAL STREAM // Press &apos;q&apos; or ESC to exit</span>
        <button
          type="button"
          onClick={onExit}
          className="shrink-0 ml-3 px-2 py-0.5 rounded border border-[#00ff77]/40 bg-[#00ff77]/20 hover:bg-[#00ff77]/40 text-[#00ff77] transition-colors cursor-pointer"
        >
          Exit [Q]
        </button>
      </div>
    </div>
  );
}

export default MatrixRain;
