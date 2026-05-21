'use client';
import { useEffect, useRef } from 'react';

export default function SpineCanvas() {
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

    function draw() {
      if (!canvas) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W * 0.42;
      const numVert = 16;
      const totalH = H * 0.82;
      const startY = H * 0.09;
      const spacing = totalH / (numVert - 1);

      // Central spinal canal
      ctx.beginPath();
      ctx.moveTo(cx, startY);
      ctx.lineTo(cx, startY + totalH);
      const canalGrad = ctx.createLinearGradient(0, startY, 0, startY + totalH);
      canalGrad.addColorStop(0, 'rgba(93,202,165,0.08)');
      canalGrad.addColorStop(0.5, 'rgba(29,158,117,0.35)');
      canalGrad.addColorStop(1, 'rgba(93,202,165,0.08)');
      ctx.strokeStyle = canalGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Traveling signal pulse
      const sigY = startY + (totalH * ((Math.sin(t * 1.4) + 1) / 2));
      const sigR = ctx.createRadialGradient(cx, sigY, 0, cx, sigY, 22);
      sigR.addColorStop(0, 'rgba(159,225,203,0.8)');
      sigR.addColorStop(0.4, 'rgba(93,202,165,0.3)');
      sigR.addColorStop(1, 'rgba(93,202,165,0)');
      ctx.beginPath();
      ctx.arc(cx, sigY, 22, 0, Math.PI * 2);
      ctx.fillStyle = sigR;
      ctx.fill();

      for (let i = 0; i < numVert; i++) {
        const y = startY + i * spacing;
        const isCervical = i < 4;
        const isLumbar = i >= 10 && i < 14;
        const isSacral = i >= 14;
        const w = isSacral ? 46 : isLumbar ? 40 : isCervical ? 28 : 33;
        const h = isSacral ? 12 : isLumbar ? 11 : isCervical ? 8 : 9;
        const pulse = Math.sin(t * 2.2 - i * 0.38) * 0.14;
        const alpha = 0.5 + pulse;

        // Vertebra body
        ctx.beginPath();
        ctx.roundRect(cx - w / 2, y - h / 2, w, h, 3);
        ctx.fillStyle = `rgba(29,158,117,${alpha * 0.5})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(93,202,165,${alpha * 0.9})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Vertebra label (cervical)
        if (isCervical) {
          ctx.font = `bold ${7}px DM Sans, sans-serif`;
          ctx.fillStyle = `rgba(159,225,203,${alpha * 0.7})`;
          ctx.textAlign = 'center';
          ctx.fillText(`C${i + 1}`, cx, y + 3);
        } else if (isLumbar) {
          ctx.font = `bold ${7}px DM Sans, sans-serif`;
          ctx.fillStyle = `rgba(159,225,203,${alpha * 0.7})`;
          ctx.textAlign = 'center';
          ctx.fillText(`L${i - 9}`, cx, y + 3);
        }

        // Spinous process
        if (!isSacral) {
          ctx.beginPath();
          ctx.moveTo(cx - w / 2, y);
          ctx.lineTo(cx - w / 2 - 14, y - 2);
          ctx.moveTo(cx + w / 2, y);
          ctx.lineTo(cx + w / 2 + 14, y - 2);
          ctx.strokeStyle = `rgba(93,202,165,${alpha * 0.4})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        // Nerve roots
        if (!isSacral) {
          [-1, 1].forEach(side => {
            const rootX = cx + side * (w / 2 + 22);
            const rootY = y + Math.sin(t * 1.8 - i * 0.3) * 2;
            ctx.beginPath();
            ctx.moveTo(cx + side * w / 2, y);
            ctx.quadraticCurveTo(
              cx + side * (w / 2 + 11), y,
              rootX, rootY
            );
            ctx.strokeStyle = `rgba(93,202,165,${0.2 + Math.abs(Math.sin(t - i * 0.4)) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(rootX, rootY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(159,225,203,${0.45 + pulse * 0.5})`;
            ctx.fill();
          });
        }

        // Intervertebral disc
        if (i < numVert - 1 && !isSacral) {
          const discY = y + spacing / 2;
          ctx.beginPath();
          ctx.ellipse(cx, discY, w * 0.38, 2.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(13,110,86,0.5)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(29,158,117,0.3)';
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }

      // === TRIGEMINAL NERVE (top-right) ===
      const tx = cx + 58, ty = startY + 22;

      // Trigeminal ganglion
      const gangGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, 7);
      gangGrad.addColorStop(0, 'rgba(29,158,117,0.95)');
      gangGrad.addColorStop(1, 'rgba(29,158,117,0.2)');
      ctx.beginPath();
      ctx.arc(tx, ty, 6, 0, Math.PI * 2);
      ctx.fillStyle = gangGrad;
      ctx.fill();
      ctx.strokeStyle = `rgba(93,202,165,${0.8 + Math.sin(t * 2) * 0.15})`;
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // 3 branches
      const branches: [number, number, string][] = [
        [tx + 34, ty - 22, 'V1 Oftalmik'],
        [tx + 36, ty + 1, 'V2 Maksiller'],
        [tx + 30, ty + 24, 'V3 Mandibulyar'],
      ];

      branches.forEach(([bx, by, label], bi) => {
        const bp = Math.sin(t * 2 - bi * 0.9);
        // branch line
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.quadraticCurveTo(tx + (bx - tx) * 0.5, ty + (by - ty) * 0.3, bx, by);
        ctx.strokeStyle = `rgba(93,202,165,${0.45 + bp * 0.15})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // terminal
        const trg = ctx.createRadialGradient(bx, by, 0, bx, by, 4);
        trg.addColorStop(0, `rgba(159,225,203,${0.7 + bp * 0.2})`);
        trg.addColorStop(1, 'rgba(93,202,165,0)');
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fillStyle = trg;
        ctx.fill();

        // label
        ctx.font = `500 7.5px DM Sans, sans-serif`;
        ctx.fillStyle = `rgba(159,225,203,${0.55 + bp * 0.1})`;
        ctx.textAlign = 'left';
        ctx.fillText(label, bx + 6, by + 3);
      });

      // Trigeminal title
      ctx.font = `600 8px Syne, sans-serif`;
      ctx.fillStyle = 'rgba(93,202,165,0.5)';
      ctx.textAlign = 'left';
      ctx.fillText('N. TRIGEMINUS', tx - 4, ty - 32);

      t += 0.018;
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
      style={{ width: '100%', height: '100%' }}
    />
  );
}
