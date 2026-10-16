import React, { useEffect, useRef } from 'react';

interface TrailDot {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
}

interface SimplePulse {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export const InteractiveCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const trail = useRef<TrailDot[]>([]);
  const pulses = useRef<SimplePulse[]>([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });

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

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
        dotRef.current.style.opacity = '1';
      }

      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only add subtle minimal trail dot when moving smoothly
      if (dist > 6) {
        trail.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 2 + 1.5,
          alpha: 0.6,
          color: '#38bdf8' // Clean subtle cyan
        });
      }

      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e: MouseEvent) => {
      // Small, elegant, non-intrusive click pulse
      pulses.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        alpha: 0.8
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Render gentle click pulse
      for (let i = pulses.current.length - 1; i >= 0; i--) {
        const p = pulses.current[i];
        p.radius += 1.8;
        p.alpha -= 0.04;

        if (p.alpha <= 0 || p.radius >= 26) {
          pulses.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Render subtle minimalist trail
      for (let i = trail.current.length - 1; i >= 0; i--) {
        const t = trail.current[i];
        t.alpha -= 0.035;
        t.size *= 0.95;

        if (t.alpha <= 0 || t.size <= 0.4) {
          trail.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${t.alpha})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }

      if (trail.current.length > 30) {
        trail.current.splice(0, trail.current.length - 30);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Sleek minimal cursor center dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] z-50 transition-opacity duration-150 opacity-0 will-change-transform"
      />
      {/* Lightweight canvas for gentle trails & click ripples */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-40 w-full h-full"
      />
    </>
  );
};
