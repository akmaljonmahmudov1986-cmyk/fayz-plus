'use client';
import { useEffect, useRef } from 'react';

export default function NerveBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const lines = Array.from({ length: 14 }, (_, i) => ({
      y: 0,
      offset: i * 20,
      speed: 1.1 + Math.random() * 0.9,
      amp: 5 + Math.random() * 12,
      freq: 0.022 + Math.random() * 0.016,
      alpha: 0.1 + Math.random() * 0.2,
    }));

    function draw() {
      if (!canvas) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      lines.forEach((l, i) => {
        l.y = H * (0.1 + i * 0.06);

        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const y = l.y + Math.sin(x * l.freq + t * l.speed + l.offset) * l.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(29,158,117,${l.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Signal pulse
        const px = ((t * l.speed * 45 + l.offset * 9) % W);
        const py = l.y + Math.sin(px * l.freq + t * l.speed + l.offset) * l.amp;
        const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
        g.addColorStop(0, 'rgba(93,202,165,0.85)');
        g.addColorStop(1, 'rgba(93,202,165,0)');
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      t += 0.016;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
