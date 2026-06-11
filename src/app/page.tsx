'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ChevronRight, Send, ArrowUpRight, Menu, X } from 'lucide-react';

const NeuralBackground = dynamic(() => import('@/components/NeuralBackground'), { ssr: false });
const SpineCanvas = dynamic(() => import('@/components/SpineCanvas'), { ssr: false });
const NerveBanner = dynamic(() => import('@/components/NerveBanner'), { ssr: false });

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const FadeIn = ({ children, delay = 0, y = 28, className = '' }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) => {
  const ref = useRef(null);
  const io = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={io ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    rx.set(dy * 10); ry.set(-dx * 10);
  }, [rx, ry]);
  const onLeave = useCallback(() => { rx.set(0); ry.set(0); }, [rx, ry]);
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
      className={className}>
      {children}
    </motion.div>
  );
};

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const dur = 1800, step = 16;
    const inc = target / (dur / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [active, target]);
  return val;
}

const DOCTORS = [
  { name: 'Tursunov Madaminjon', spec: 'Neyroxirurg', exp: '15 yil', rate: 5.0, initials: 'TM', ops: '5000+' },
  { name: 'Raimjonov Xurshidbek', spec: 'Neyroxirurg', exp: '10 yil', rate: 5.0, initials: 'RX', ops: '4000+' },
  { name: 'Zokirjonov Muhammadyusuf', spec: 'Neyroxirurg', exp: '7 yil', rate: 4.8, initials: 'ZM', ops: '3000+' },
  { name: 'Tursunov Furqatbek', spec: 'Neyroxirurg', exp: '9 yil', rate: 4.5, initials: 'TF', ops: '1000+' },
];

const STATS = [
  { n: 5000, suf: '+', l: 'Muvaffaqiyatli operatsiya' },
  { n: 12, suf: '+', l: 'Yillik tajriba' },
  { n: 98, suf: '%', l: 'Muvaffaqiyat darajasi' },
  { n: 15, suf: '+', l: 'Mutaxassis vrach' },
];

const s: Record<string, React.CSSProperties> = {
  iBtn: { background: 'linear-gradient(135deg,var(--t1),var(--t0))', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 24px rgba(29,158,117,0.35)', transition: 'all .25s', display: 'flex', alignItems: 'center', gap: 6 },
  oBtn: { background: 'rgba(0,255,194,0.06)', color: 'var(--t3)', padding: '12px 22px', borderRadius: 10, fontSize: 13, border: '0.5px solid rgba(0,255,194,0.25)', cursor: 'pointer', transition: 'all .25s', display: 'flex', alignItems: 'center', gap: 6 },
  label: { fontSize: 10, color: 'var(--t3)', letterSpacing: '2.5px', textTransform: 'uppercase' as const, marginBottom: 10 },
  h2: { fontFamily: 'Clash Display,sans-serif', fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 },
  sub: { fontSize: 13, color: 'var(--muted)', marginTop: 8 },
  fi: { width: '100%', padding: '11px 14px', border: '0.5px solid rgba(0,255,194,0.15)', borderRadius: 9, fontSize: 12.5, background: 'rgba(0,255,194,0.04)', color: 'var(--text)', outline: 'none', fontFamily: 'Space Grotesk,sans-serif', transition: 'border-color .2s' },
  fs: { width: '100%', padding: '11px 14px', border: '0.5px solid rgba(0,255,194,0.15)', borderRadius: 9, fontSize: 12.5, background: 'rgba(4,9,15,0.8)', color: 'var(--text)', outline: 'none' },
};

function StatCard({ n, suf, l }: { n: number; suf: string; l: string }) {
  const ref = useRef(null);
  const io = useInView(ref, { once: true });
  const val = useCounter(n, io);
  return (
    <div ref={ref} style={{ padding: '26px 16px', textAlign: 'center', borderRight: '0.5px solid var(--border)' }}>
      <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--acc)' }}>
        {val}{suf}
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 5, letterSpacing: '.5px', textTransform: 'uppercase' }}>{l}</div>
    </div>
  );
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{role:string,content:string}[]>([]);
  const [input, setInput] = useState('');

  const getAnswer = (q: string): string => {
    const ql = q.toLowerCase();
    if (ql.includes('savol ber') || ql.includes('bersam bo') || ql.includes('so\'rasam') || ql.includes('bilsam') || ql.includes('qanday savol') || ql.includes('nima haqida') || ql.includes('yordam ber')) return "Albatta! 😊 Men quyidagilarda yordam beraman:\n\n🏥 Klinika haqida:\n• Manzil, telefon, ish vaqti\n• Vrachlar, xizmatlar, narxlar\n• Navbat olish\n\n🧠 Kasalliklar haqida:\n• Bosh og'riq, migren\n• Disk churrasi, stenoz, skolioz\n• 3 shohli nerv nevralgiyasi\n• Insult, epilepsiya\n• Parkinson, Alzheimer\n• Miya o'smasi\n• Uyqu buzilishi\n\nSavol yozing! 👇";
    if (ql.includes('manzil') || ql.includes('qayer') || ql.includes('adres') || ql.includes('joylash')) return "📍 Manzil: Andijon viloyati, Baliqchi tumani, Chinobod shaharchasi.\nMo'ljal: 54-maktab yonida.";
    if (ql.includes('telefon') || ql.includes('raqam') || ql.includes('bog\'lan') || ql.includes('murojaat')) return "📞 Telefon: +998 90 573 00 83\n💬 Telegram: @fayz1717\n📧 Email: fayzplus2025@gmail.com";
    if (ql.includes('vaqt') || ql.includes('soat') || ql.includes('qachon') || ql.includes('ochiq')) return "🕘 Ish vaqtimiz:\nDushanba-Juma: 09:00-16:00\nShanba: 09:00-15:00\n❌ Yakshanba: Dam olish";
    if (ql.includes('vrach') || ql.includes('doktor') || ql.includes('mutaxassis')) return "👨‍⚕️ Vrachlarimiz:\n• Tursunov Madaminjon — 15 yil, 5000+ operatsiya\n• Raimjonov Xurshidbek — 10 yil, 4000+ operatsiya\n• Zokirjonov Muhammadyusuf — 7 yil, 3000+ operatsiya\n• Tursunov Furqatbek — 9 yil, 1000+ operatsiya";
    if (ql.includes('narx') || ql.includes('pul') || ql.includes('qancha') || ql.includes('tolov')) return "💰 Narxlar haqida: +998 90 573 00 83\nKonsultatsiya bepul!";
    if (ql.includes('xizmat') || ql.includes('davolash')) return "🏥 Xizmatlar:\n✅ Neyrojarrohlik\n✅ Endoskopik jarrohlik\n✅ Trigeminal nevralgiya\n✅ Umurtqa pog'onasi\n✅ MRT/KT diagnostika\n✅ Reabilitatsiya";
    if (ql.includes('navbat') || ql.includes('yozil') || ql.includes('qabul')) return "📅 Navbat olish:\n📞 +998 90 573 00 83\n💬 Telegram: @fayz1717\nYoki saytdagi 'Navbat olish' bo'limidan!";
    if (ql.includes('salom') || ql.includes('assalom') || ql.includes('hello')) return "Assalomu alaykum! 👋 Fayz Plus klinikasi virtual yordamchisiga xush kelibsiz!\nKlinika, vrachlar yoki tibbiy savollar bo'yicha yordam beraman.";
    if (ql.includes('rahmat') || ql.includes('xayr')) return "Xayr! Sog'-salomat bo'ling! 😊";
    if (ql.includes('trigeminal') || ql.includes('3 shohli') || ql.includes('uch shohli') || ql.includes('yuz nerv') || ql.includes('yuz og\'riq')) return "🧠 3 Shohli Nerv Nevralgiyasi:\n\nBelgilari:\n• Yuzda to'satdan kuchli og'riq\n• Chaynash, gapirish, tegishda og'riq\n• Og'riq bir tomonda\n• Hujumlar takrorlanadi\n\nSabablari:\n• Qon tomiri nervga bosim\n• Nerv po'stlog'i zararlanishi\n\nDavolash:\n💊 Dori (Karbamazepin)\n🔬 Endoskopik MVD operatsiyasi\n\nBizda eng zamonaviy usulda davolanadi!\n📞 +998 90 573 00 83";
    if (ql.includes('disk churrasi') || ql.includes('grija') || ql.includes('disk')) return "🦴 Disk Churrasi:\n\nBelgilari:\n• Bel yoki bo'yin og'rig'i\n• Oyoq yoki qo'lga tarqaluvchi og'riq\n• Keyishish, uvishish\n• Kuchsizlik\n\nDavolash:\n💊 Dori, fizioterapiya\n🔬 Endoskopik diskektomiya\n\nBizda 1 kunda operatsiya, 2-3 kunda uyga!\n📞 +998 90 573 00 83";
    if (ql.includes('stenoz') || ql.includes('toray') || ql.includes('kanal')) return "🦴 Umurtqa Kanali Stenozi:\n\nBelgilari:\n• Yurish paytida bel va oyoq og'rig'i\n• Dam olganda kamayadi\n• Oyoqlar keyishi\n\nDavolash:\n🔬 Endoskopik dekompressiya\n📞 +998 90 573 00 83";
    if (ql.includes('skolioz') || ql.includes('egri') || ql.includes('umurtqa egri')) return "🦴 Skolioz (Umurtqa egriligi):\n\nDarajalari:\n• 1-daraja: 10-25° — kuzatuv\n• 2-daraja: 25-40° — korset\n• 3-daraja: 40°+ — jarrohlik\n\nBelgilari:\n• Yelka va bel nosimmetrik\n• Uzoq o'tirishda og'riq\n\nKonsultatsiya: +998 90 573 00 83";
    if (ql.includes('umurtqa') || ql.includes('bel og\'riq') || ql.includes('orqa og\'riq')) return "🦴 Umurtqa Pog'onasi Kasalliklari:\n\nTurlari:\n• Disk churrasi\n• Stenoz\n• Skolioz\n• Spondiloz\n\nBelgilari:\n• Bel, bo'yin og'rig'i\n• Oyoq-qo'lga tarqaluvchi og'riq\n\nBizda endoskopik usulda davolaymiz!\n📞 +998 90 573 00 83";
    if (ql.includes('bosh og\'riq') || ql.includes('migren') || ql.includes('bosh aylan')) return "🧠 Bosh Og'rig'i:\n\nTurlari:\n• Migren — bir tomonda kuchli og'riq\n• Tension — ikki tomonda siquvchi\n• Cluster — ko'z atrofida\n• Gipertenziv — bosim ko'tarilganda\n\nVrach ko'rish SHART:\n⚠️ 3 kundan ko'p davom etsa\n⚠️ Dori yordam bermasa\n\n📞 +998 90 573 00 83";
    if (ql.includes('insult') || ql.includes('miya qon') || ql.includes('falaj')) return "🚨 Insult Belgilari (FAST):\n🅕 Yuz qiyshayishi\n🅐 Qo'l kuchsizligi\n🅢 Nutq buzilishi\n🅣 DARHOL 103!\n\nInsultdan keyin reabilitatsiya:\n📞 +998 90 573 00 83";
    if (ql.includes('epilepsiya') || ql.includes('talvasa') || ql.includes('tutqanoq')) return "🧠 Epilepsiya:\n\nBelgilari:\n• Talvasa\n• Hushdan ketish\n• Tananing qotishi\n\nDavolash:\n💊 Dori (80% bemorlar)\n🔬 Jarrohlik (kerak bo'lsa)\n\n📞 +998 90 573 00 83";
    if (ql.includes('parkinson') || ql.includes('titrash') || ql.includes('titroq')) return "🧠 Parkinson:\n\nBelgilari:\n• Qo'l-oyoq titrashi\n• Harakatlar sekinlashishi\n• Muskul qotishi\n• Muvozanat buzilishi\n\nDavolash:\n💊 Dori\n🔬 DBS stimulyatsiya\n\n📞 +998 90 573 00 83";
    if (ql.includes('alzgeym') || ql.includes('xotira') || ql.includes('unutuvchan')) return "🧠 Xotira Muammolari:\n\nBelgilari:\n• Yaqin voqealarni unutish\n• Tanish joyda adashish\n• So'z topishda qiyinchilik\n\n✅ Erta murojaat muhim!\n📞 +998 90 573 00 83";
    if (ql.includes('uyqu') || ql.includes('uxlay olm') || ql.includes('insomn')) return "😴 Uyqu Buzilishi:\n\nSabablari:\n• Stress\n• Asab kasalliklari\n• Noto'g'ri hayot tarzi\n\nTavsiyalar:\n✅ Bir vaqtda uxlash\n✅ Ekrandan uzoqlashing\n✅ Xona 18-20°C\n\n📞 +998 90 573 00 83";
    if (ql.includes('o\'sma') || ql.includes('tumor') || ql.includes('miya o\'sm')) return "🧠 Miya O'smasi:\n\nBelgilari:\n• Kuchayib boruvchi bosh og'riq\n• Epileptik tutqanoqlar\n• Ko'rish, nutq buzilishi\n\nDiagnostika: MRT\nDavolash: Endoskopik jarrohlik\n\n⚠️ Erta aniqlash muhim!\n📞 +998 90 573 00 83";
    if (ql.includes('mrt') || ql.includes('kt') || ql.includes('diagnos') || ql.includes('tekshir')) return "🔬 Diagnostika:\n\n• 3T MRI\n• 128-qatlamli KT skaneri\n• Neyrofiziologik tekshiruvlar\n\n📞 +998 90 573 00 83";
    return "Bu savol bo'yicha:\n📞 +998 90 573 00 83\n💬 Telegram: @fayz1717\n\nYoki boshqa savol bering! 😊";
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const answer = getAnswer(input);
    const botMsg = { role: 'assistant', content: answer };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,var(--t1),var(--t0))', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(0,255,194,0.35)', fontSize: 24 }}>
        {open ? '✕' : '👩‍⚕️'}
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: 96, right: 28, zIndex: 9998, width: 'min(340px, calc(100vw - 40px))', height: 480, background: 'rgba(4,9,15,0.97)', border: '0.5px solid rgba(0,255,194,0.2)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '0.5px solid rgba(0,255,194,0.1)', background: 'rgba(0,255,194,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>👩‍⚕️</span>
            <div>
              <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--acc)' }}>Fayz Plus Yordamchi</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>● Online</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginTop: 16 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>👩‍⚕️</div>
                <div style={{ marginBottom: 12, color: 'var(--t3)', fontSize: 13 }}>Salom! Qanday yordam kerak?</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {["📍 Klinika manzili", "👨‍⚕️ Vrachlar", "🏥 Xizmatlar", "📞 Bog'lanish", "🧠 Bosh og'riq", "🦴 Disk churrasi", "🧠 3 shohli nerv", "🦴 Skolioz"].map(q => (
                    <button key={q} onClick={() => setInput(q)} style={{ background: 'rgba(0,255,194,0.05)', border: '0.5px solid rgba(0,255,194,0.15)', borderRadius: 8, padding: '7px 12px', color: 'var(--t3)', fontSize: 11.5, cursor: 'pointer', textAlign: 'left' }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', padding: '8px 12px', borderRadius: 10, fontSize: 12.5, lineHeight: 1.7, whiteSpace: 'pre-line', background: m.role === 'user' ? 'linear-gradient(135deg,var(--t1),var(--t0))' : 'rgba(0,255,194,0.06)', color: m.role === 'user' ? '#fff' : 'var(--text)', border: m.role === 'user' ? 'none' : '0.5px solid rgba(0,255,194,0.15)' }}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: '0.5px solid rgba(0,255,194,0.1)', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Savol yozing..." style={{ flex: 1, background: 'rgba(0,255,194,0.04)', border: '0.5px solid rgba(0,255,194,0.15)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 12.5, outline: 'none' }} />
            <button onClick={send} style={{ background: 'linear-gradient(135deg,var(--t1),var(--t0))', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: 14 }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

function HologramIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const [text, setText] = useState('');
  const fullText = 'Xush kelibsiz! Men Fayz Plus klinikasining virtual yordamchisiman. Sizga qanday yordam bera olaman?';

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (phase < 2) return;
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === 3) {
      const t = setTimeout(onDone, fullText.length * 35 + 1500);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#020609', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,194,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,194,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 40 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ position: 'absolute', inset: i * 20, borderRadius: '50%', border: '1px solid rgba(0,255,194,0.3)', animation: `spin ${3 + i}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}` }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,194,0.15) 0%, transparent 70%)', border: '2px solid rgba(0,255,194,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👩‍⚕️</div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,255,194,0.8), transparent)', animation: 'scanline 2s ease-in-out infinite', top: '50%' }} />
      </div>
      <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--acc)', letterSpacing: 3, marginBottom: 24, opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.8s' }}>FAYZ PLUS</div>
      <div style={{ maxWidth: 480, textAlign: 'center', fontSize: 15, color: 'rgba(0,255,194,0.8)', lineHeight: 1.8, minHeight: 80, padding: '0 24px', opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.8s' }}>
        {text}<span style={{ animation: 'blink 1s infinite' }}>|</span>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scanline { 0%,100% { top: 20%; opacity: 0; } 50% { top: 80%; opacity: 1; } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const curX = useSpring(0, { stiffness: 120, damping: 18 });
  const curY = useSpring(0, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onS);
    const onM = (e: MouseEvent) => { curX.set(e.clientX); curY.set(e.clientY); };
    window.addEventListener('mousemove', onM);
    return () => { window.removeEventListener('scroll', onS); window.removeEventListener('mousemove', onM); };
  }, [curX, curY]);

  const navLinks = ['Haqimizda', 'Navbat', 'Kontakt'];

  return (
    <div style={{ background: 'var(--d0)', minHeight: '100vh', overflowX: 'hidden' }}>
      {showIntro && <HologramIntro onDone={() => setShowIntro(false)} />}
      <ChatBot />
      {!isMobile && (
        <motion.div style={{ x: curX, y: curY, position: 'fixed', top: -16, left: -16, width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(0,255,194,0.45)', pointerEvents: 'none', zIndex: 9999, mixBlendMode: 'screen' }} />
      )}

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || menu ? 'rgba(4,9,15,0.96)' : 'transparent', borderBottom: scrolled || menu ? '0.5px solid var(--border)' : 'none', backdropFilter: scrolled || menu ? 'blur(16px)' : 'none', transition: 'all .35s' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="34" height="34" viewBox="0 0 28 28" fill="none">
              <circle cx="10" cy="8" r="5" fill="var(--t1)" />
              <circle cx="20" cy="8" r="4" fill="var(--t1)" />
              <circle cx="10" cy="20" r="4" fill="var(--t1)" />
              <circle cx="20" cy="20" r="5" fill="var(--t1)" />
              <circle cx="14" cy="13" r="2.5" fill="var(--acc)" />
            </svg>
            <div>
              <div style={{ fontFamily: 'Clash Display,sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '.6px' }}>FAYZ PLYUS</div>
              <div style={{ fontSize: 8, color: 'var(--t3)', letterSpacing: '1.4px', textTransform: 'uppercase' }}>Endoskopik Jarrohlik</div>
            </div>
          </motion.div>

          {!isMobile && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {navLinks.map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: 12.5, color: 'var(--muted)', textDecoration: 'none', transition: 'color .2s', letterSpacing: '.2px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--t3)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>{item}</a>
              ))}
              <a href="#navbat">
                <button style={s.iBtn}>Navbat olish <ArrowUpRight size={14} /></button>
              </a>
            </motion.div>
          )}

          {isMobile && (
            <button onClick={() => setMenu(!menu)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 8 }} aria-label="Menyu">
              {menu ? <X size={26} /> : <Menu size={26} />}
            </button>
          )}
        </div>

        {isMobile && menu && (
          <div style={{ background: 'rgba(4,9,15,0.98)', borderTop: '0.5px solid var(--border)', padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenu(false)} style={{ fontSize: 15, color: 'var(--text)', textDecoration: 'none', padding: '12px 4px', borderBottom: '0.5px solid rgba(0,255,194,0.08)' }}>{item}</a>
            ))}
            <a href="#navbat" onClick={() => setMenu(false)} style={{ marginTop: 12 }}>
              <button style={{ ...s.iBtn, justifyContent: 'center', width: '100%' }}>Navbat olish <ArrowUpRight size={14} /></button>
            </a>
          </div>
        )}
      </nav>

      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(29,158,117,0.12) 0%, transparent 60%), linear-gradient(180deg,var(--d0) 0%,var(--d1) 100%)' }}>
        <NeuralBackground />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,194,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,194,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 5, maxWidth: 1280, margin: '0 auto', padding: isMobile ? '110px 20px 50px' : '100px 28px 60px', width: '100%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 48, alignItems: 'center' }}>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,194,0.06)', border: '0.5px solid rgba(0,255,194,0.2)', color: 'var(--acc)', fontSize: 10, letterSpacing: '2px', padding: '5px 14px', borderRadius: 30, marginBottom: 22, textTransform: 'uppercase' }}>
                <span style={{ width: 6, height: 6, background: 'var(--acc)', borderRadius: '50%', animation: 'pulseRing 2s ease-out infinite', display: 'inline-block' }} />
                Neyrojarrohlik · Endoskopiya
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }}
              style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 'clamp(30px,7vw,58px)', fontWeight: 700, lineHeight: 1.1, color: '#fff', marginBottom: 18 }}>
              Zamonaviy<br /><span className="grad-text">jarrohlik</span> —<br /><span style={{ color: 'var(--t4)' }}>ishonchli sog'liq</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}
              style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 32, maxWidth: 400 }}>
              Fayz Plyus klinikasida ilg'or endoskopik texnologiyalar bilan sog'lom hayot yo'lida sizga hamrohligimiz.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .38 }} style={{ display: 'flex', gap: 12, marginBottom: 42 }}>
              <a href="#navbat"><button style={s.iBtn}>Navbat olish <ArrowUpRight size={15} /></button></a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .48 }}
              style={{ display: 'flex', gap: isMobile ? 20 : 32, paddingTop: 28, borderTop: '0.5px solid var(--border)', flexWrap: 'wrap' }}>
              {[['5000+', 'Operatsiya'], ['98%', 'Muvaffaqiyat'], ['12+', 'Yil']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--acc)' }}>{n}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, letterSpacing: '.5px' }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>
          {!isMobile && (
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: .22 }}
              style={{ height: 520, position: 'relative', filter: 'drop-shadow(0 0 40px rgba(0,255,194,0.08))' }}>
              <SpineCanvas />
            </motion.div>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(transparent,var(--d0))', zIndex: 6 }} />
      </section>

      <div style={{ position: 'relative', height: 80, overflow: 'hidden', background: 'linear-gradient(90deg,var(--d0),rgba(9,21,37,0.9),var(--d0))', borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)' }}>
        <NerveBanner />
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', padding: '0 16px' }}>
          {['Trigeminal Nevralgiya', '3 Shohli Nerv', "Umurtqa Pog'onasi", 'Endoskopik Jarrohlik', 'Neyronavigatsiya', 'MRT Diagnostika'].map(chip => (
            <span key={chip} style={{ background: 'rgba(4,9,15,0.85)', border: '0.5px solid rgba(0,255,194,0.2)', borderRadius: 30, padding: '4px 13px', fontSize: 10, color: 'var(--t3)', letterSpacing: '.8px', backdropFilter: 'blur(6px)' }}>{chip}</span>
          ))}
        </div>
      </div>

      <section id="haqimizda" style={{ background: 'linear-gradient(180deg,var(--d2) 0%,var(--d1) 100%)', padding: isMobile ? '64px 20px' : '88px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -100, top: '50%', transform: 'translateY(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(29,158,117,0.06) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 64, alignItems: 'center', position: 'relative' }}>
          <FadeIn>
            <div style={s.label}>Biz haqimizda</div>
            <h2 style={{ ...s.h2, marginBottom: 20 }}>Neyrojarrohlikda <span className="glow-text">ishonchli</span> markaz</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 14 }}>
              Fayz Plyus — O'zbekistondagi endoskopik jarrohlik sohasida yetakchi xususiy klinika. Biz 12 yildan ortiq davomida bemorlarimizga eng yuqori sifatli tibbiy yordam ko'rsatib kelmoqdamiz.
            </p>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 30 }}>
              Klinikamizda Yevropa standartlaridagi zamonaviy jihozlar, tajribali neyrojarrohlar va individual yondashuv asosida har bir bemor uchun eng yaxshi natijaga erishiladi.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id="navbat" style={{ background: 'linear-gradient(180deg,var(--d2) 0%,var(--d3) 100%)', padding: isMobile ? '64px 20px' : '88px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -80, top: '40%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(29,158,117,0.07) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <FadeIn><div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={s.label}>Onlayn navbat</div>
            <h2 style={s.h2}>Navbat olish</h2>
            <p style={s.sub}>Qulay vaqtni tanlang, biz siz bilan bog'lanamiz</p>
          </div></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: 28, alignItems: 'start' }}>
            <FadeIn>
              <div className="glass-card" style={{ padding: isMobile ? 20 : 28, display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                  {[['Ism-sharif', 'Ism va familiya'], ['Telefon', '+998 ...']].map(([lbl, ph]) => (
                    <div key={lbl}><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{lbl}</label>
                      <input type="text" placeholder={ph} style={s.fi} /></div>
                  ))}
                </div>
                <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Xizmat turi</label>
                  <select style={s.fs}><option>Neyrojarrohlik konsultatsiyasi</option><option>Trigeminal nevralgiya</option><option>Endoskopik diagnostika</option><option>Umurtqa pog'onasi</option><option>MRT / KT</option><option>Reabilitatsiya</option></select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                  <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Sana</label>
                    <input type="text" placeholder="KK.OO.YYYY" style={s.fi} /></div>
                  <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Vaqt</label>
                    <select style={s.fs}>{['09:00','10:00','11:00','12:00','14:00','15:00','16:00'].map(t => <option key={t}>{t}</option>)}</select>
                  </div>
                </div>
                <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Izoh</label>
                  <textarea rows={3} placeholder="Muammo haqida qisqacha..." style={{ ...s.fi, resize: 'vertical' }} />
                </div>
                <button style={{ ...s.iBtn, justifyContent: 'center', fontSize: 14 }}>Navbat olish <ArrowUpRight size={16} /></button>
              </div>
            </FadeIn>
            <FadeIn delay={0.12}>
              <div className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Clash Display,sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>
                  <Clock size={17} color="var(--acc)" /> Ish vaqtlari
                </div>
                {[['Dushanba – Juma', '09:00 – 16:00', false], ['Shanba', '9:00 - 15:00', false], ['Yakshanba', 'Dam olish', true]].map(([d, ti, cl]) => (
                  <div key={String(d)} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '0.5px solid rgba(0,255,194,0.08)', fontSize: 12.5 }}>
                    <span style={{ color: 'var(--muted)' }}>{d}</span>
                    <span style={{ color: cl ? '#e27a7a' : 'var(--acc)', fontWeight: 600 }}>{ti}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="kontakt" style={{ background: 'var(--d1)', padding: isMobile ? '64px 20px' : '88px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeIn><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={s.label}>Manzil</div>
            <h2 style={s.h2}>Bizni toping</h2>
          </div></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            <FadeIn>
              <div className="glass-card scanline" style={{ height: 220, overflow: 'hidden', borderRadius: 12 }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3017.0311132567695!2d71.98292959999999!3d40.8711914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bca1bdc698961d%3A0x81f15bc2cb73a3fe!2sChinobod%20Fayz%20Plyus%20neyrojarrohlik%20klinikasi!5e0!3m2!1sen!2s!4v1779531484557!5m2!1sen!2s" width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: MapPin, l: 'Manzil', v: "Andijon viloyati Baliqchi tumani Chinobod shaharchasi. Mo'ljal 54-maktab" },
                  { icon: Phone, l: 'Telefon', v: '+998 90 573 00 83' },
                  { icon: Mail, l: 'Email', v: 'fayzplus2025@gmail.com' },
                  { icon: Send, l: 'Telegram', v: 'fayz1717' },
                ].map(({ icon: Icon, l, v }) => (
                  <div key={l} className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 38, height: 38, background: 'rgba(0,255,194,0.07)', border: '0.5px solid rgba(0,255,194,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={17} color="var(--acc)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{l}</div>
                      <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, marginTop: 2 }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <footer style={{ background: 'linear-gradient(180deg,var(--d0) 0%,#020609 100%)', borderTop: '0.5px solid var(--border)', padding: isMobile ? '40px 20px 24px' : '52px 28px 26px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr 1fr 1fr', gap: isMobile ? 28 : 40, marginBottom: 44 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <svg width="30" height="30" viewBox="0 0 28 28" fill="none"><circle cx="10" cy="8" r="5" fill="var(--t1)" /><circle cx="20" cy="8" r="4" fill="var(--t1)" /><circle cx="10" cy="20" r="4" fill="var(--t1)" /><circle cx="20" cy="20" r="5" fill="var(--t1)" /><circle cx="14" cy="13" r="2.5" fill="var(--acc)" /></svg>
                <div>
                  <div style={{ fontFamily: 'Clash Display,sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>FAYZ PLYUS</div>
                  <div style={{ fontSize: 8, color: 'var(--t3)', letterSpacing: '1px', textTransform: 'uppercase' }}>Endoskopik Jarrohlik Markazi</div>
                </div>
              </div>
              <p style={{ fontSize: 12.5, color: 'rgba(159,225,203,0.38)', lineHeight: 1.8, maxWidth: 260 }}>
                Endoskopik jarrohlik va neyrojarrohlik sohasida O'zbekistondagi №1 ishonchli markaz.
              </p>
            </div>
            {[
              { t: 'Xizmatlar', ls: ['Neyrojarrohlik', 'Endoskopiya', 'Laparoskopiya', 'MRT · KT', 'Reabilitatsiya'] },
              { t: 'Klinika', ls: ['Biz haqimizda', 'Navbat olish', 'Ish vaqti'] },
              { t: 'Kontakt', ls: ['+998 90 573 00 83', 'fayzplus2025@gmail.com', '@fayz17', 'Andijon viloyati Baliqchi tumani'] },
            ].map(col => (
              <div key={col.t}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', marginBottom: 14, letterSpacing: '.5px', textTransform: 'uppercase' }}>{col.t}</div>
                {col.ls.map(link => (
                  <a key={link} href="#" style={{ display: 'block', fontSize: 12.5, color: 'rgba(159,225,203,0.38)', textDecoration: 'none', marginBottom: 9, transition: 'color .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--t3)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(159,225,203,0.38)')}>{link}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '0.5px solid rgba(0,255,194,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11.5, color: 'rgba(159,225,203,0.28)' }}>© 2025 Fayz Plyus. Barcha huquqlar himoyalangan.</span>
            <span style={{ fontSize: 11.5, color: 'rgba(159,225,203,0.28)' }}>Andijon, O'zbekiston</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
  