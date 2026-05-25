'use client';
import { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    let id: number, t = 0;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);

    // neuron nodes
    const nodes = Array.from({ length: 80 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      a: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      const W = c.width, H = c.height;
      ctx.clearRect(0, 0, W, H);

      // large ambient glow blobs
      [[W * 0.15, H * 0.3, 200, 'rgba(29,158,117,0.04)'],
       [W * 0.8, H * 0.6, 180, 'rgba(0,255,194,0.03)'],
       [W * 0.5, H * 0.15, 150, 'rgba(29,158,117,0.03)']].forEach(([x, y, r, col]) => {
        const g = ctx.createRadialGradient(+x, +y, 0, +x, +y, +r);
        g.addColorStop(0, col as string); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(+x, +y, +r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      nodes.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        p.pulse += 0.03;
        const ap = p.a * (0.6 + Math.sin(p.pulse) * 0.3);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,194,${ap * 0.45})`; ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            const lineA = (1 - d / 100) * 0.15;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(29,158,117,${lineA})`; ctx.lineWidth = 0.4; ctx.stroke();
          }
        }
      }
      t += 0.01; id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}
