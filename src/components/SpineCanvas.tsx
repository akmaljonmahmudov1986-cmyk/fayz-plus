
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SpineCanvas() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const images = [
    { src: '/SPINE.png', label: "Umurtqa pog'onasi", sub: 'Disk grija va nerv siqilishi' },
    { src: '/TRIGEMINAL.png', label: 'Trigeminal Nevralgiya', sub: 'V1 · V2 · V3 shoxlari' },
    { src: '/spine_surgery_clinic.png', label: 'Fayz Plyus Klinikasi', sub: 'Chinobod, Andijon viloyati' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative', flex: 1, borderRadius: 16, overflow: 'hidden', border: '0.5px solid rgba(0,255,194,0.2)' }}>
        {images.map((img, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: active === i ? 1 : 0, transition: 'opacity 0.8s ease' }}>
            <Image src={img.src} alt={img.label} fill style={{ objectFit: 'cover' }} priority={i === 0} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,9,15,0.85) 0%, rgba(4,9,15,0.2) 50%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, opacity: active === i ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Clash Display, sans-serif' }}>{img.label}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3 }}>{img.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {images.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ width: active === i ? 28 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', background: active === i ? 'var(--acc)' : 'rgba(0,255,194,0.25)', transition: 'all 0.35s ease', padding: 0 }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ position: 'relative', height: 60, borderRadius: 10, overflow: 'hidden', border: active === i ? '1.5px solid var(--acc)' : '0.5px solid rgba(0,255,194,0.15)', cursor: 'pointer', padding: 0, background: 'none', transition: 'border-color 0.3s' }}>
            <Image src={img.src} alt={img.label} fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: active === i ? 'rgba(0,255,194,0.1)' : 'rgba(4,9,15,0.4)', transition: 'background 0.3s' }} />
            <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: active === i ? 'var(--acc)' : 'rgba(255,255,255,0.6)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{img.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}