import React, { useEffect, useRef, useState } from 'react';

interface TrailDot {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
}

interface ClickPulse {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export const InteractiveCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const trail = useRef<TrailDot[]>([]);
  const pulses = useRef<ClickPulse[]>([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Move center blue dot with exact pinpoint alignment
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer')
        );
        setIsHovering(isInteractive);
      }

      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Add gentle blue particle trail
      if (dist > 5) {
        trail.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 2 + 1.2,
          alpha: 0.7,
          color: '#38bdf8' // Electric neon sky blue
        });
      }

      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e: MouseEvent) => {
      // Crisp electric blue ripple pulse on click
      pulses.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 3,
        alpha: 0.9
      });
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Render gentle blue click ripples
      for (let i = pulses.current.length - 1; i >= 0; i--) {
        const p = pulses.current[i];
        p.radius += 2.0;
        p.alpha -= 0.045;

        if (p.alpha <= 0 || p.radius >= 30) {
          pulses.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Render subtle electric blue particle trail
      for (let i = trail.current.length - 1; i >= 0; i--) {
        const t = trail.current[i];
        t.alpha -= 0.038;
        t.size *= 0.96;

        if (t.alpha <= 0 || t.size <= 0.3) {
          trail.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${t.alpha})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      if (trail.current.length > 25) {
        trail.current.splice(0, trail.current.length - 25);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Primary Vibrant Neon Blue Impact Dot (Centered pinpoint) */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed top-0 left-0 -ml-[4px] -mt-[4px] rounded-full z-[99999] transition-all duration-75 will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isHovering
            ? 'w-3 h-3 -ml-[6px] -mt-[6px] bg-cyan-300 shadow-[0_0_12px_#38bdf8,0_0_24px_#0284c7]'
            : 'w-2 h-2 -ml-[4px] -mt-[4px] bg-cyan-400 shadow-[0_0_8px_#38bdf8,0_0_16px_#0284c7]'
        }`}
      />

      {/* Subtle outer neon ring when hovering clickable elements */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 -ml-[12px] -mt-[12px] w-6 h-6 rounded-full border border-cyan-400/60 z-[99998] transition-all duration-150 will-change-transform ${
          isVisible && isHovering
            ? 'opacity-80 scale-100'
            : 'opacity-0 scale-50'
        }`}
      />

      {/* Lightweight canvas for electric blue click ripples & soft trails */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[99997] w-full h-full"
      />
    </>
  );
};
