'use client';
import { useEffect, useRef } from 'react';

export default function NerveBanner() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    let id: number, t = 0;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const lines = Array.from({ length: 16 }, (_, i) => ({
      y: 0, off: i * 18, spd: 1.0 + Math.random() * 1.1,
      amp: 4 + Math.random() * 14, freq: 0.02 + Math.random() * 0.018, al: 0.08 + Math.random() * 0.22,
    }));
    const draw = () => {
      const W = c.width, H = c.height; ctx.clearRect(0, 0, W, H);
      lines.forEach((l, i) => {
        l.y = H * (0.08 + i * 0.055);
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const y = l.y + Math.sin(x * l.freq + t * l.spd + l.off) * l.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(0,255,194,${l.al})`; ctx.lineWidth = 0.7; ctx.stroke();
        // moving pulse dot
        const px = ((t * l.spd * 48 + l.off * 10) % W);
        const py = l.y + Math.sin(px * l.freq + t * l.spd + l.off) * l.amp;
        const g = ctx.createRadialGradient(px, py, 0, px, py, 12);
        g.addColorStop(0, 'rgba(0,255,194,0.9)'); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      });
      t += 0.015; id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}
