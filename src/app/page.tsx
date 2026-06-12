'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, ArrowUpRight, Menu, X } from 'lucide-react';

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

const s: Record<string, React.CSSProperties> = {
  iBtn: { background: 'linear-gradient(135deg,var(--t1),var(--t0))', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 24px rgba(29,158,117,0.35)', transition: 'all .25s', display: 'flex', alignItems: 'center', gap: 6 },
  oBtn: { background: 'rgba(0,255,194,0.06)', color: 'var(--t3)', padding: '12px 22px', borderRadius: 10, fontSize: 13, border: '0.5px solid rgba(0,255,194,0.25)', cursor: 'pointer', transition: 'all .25s', display: 'flex', alignItems: 'center', gap: 6 },
  label: { fontSize: 10, color: 'var(--t3)', letterSpacing: '2.5px', textTransform: 'uppercase' as const, marginBottom: 10 },
  h2: { fontFamily: 'Clash Display,sans-serif', fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 },
  sub: { fontSize: 13, color: 'var(--muted)', marginTop: 8 },
  fi: { width: '100%', padding: '11px 14px', border: '0.5px solid rgba(0,255,194,0.15)', borderRadius: 9, fontSize: 12.5, background: 'rgba(0,255,194,0.04)', color: 'var(--text)', outline: 'none', fontFamily: 'Space Grotesk,sans-serif', transition: 'border-color .2s' },
};

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const getAnswer = (q: string): string => {
    const ql = q.toLowerCase();
    if (ql.includes('manzil') || ql.includes('qayer')) return "Manzil: Andijon viloyati, Baliqchi tumani, Chinobod shaharchasi. Moljal: 54-maktab yonida.";
    if (ql.includes('telefon') || ql.includes('raqam') || ql.includes('boglan')) return "Telefon: +998 90 573 00 83. Telegram: @fayz1717";
    if (ql.includes('vaqt') || ql.includes('soat')) return "Ish vaqtimiz: Dushanba-Juma 09:00-16:00, Shanba 09:00-15:00. Yakshanba dam olish.";
    if (ql.includes('vrach') || ql.includes('doktor')) return "Vrachlarimiz: Tursunov Madaminjon, Raimjonov Xurshidbek, Zokirjonov Muhammadyusuf, Tursunov Furqatbek.";
    if (ql.includes('xizmat')) return "Xizmatlar: Neyrojarrohlik, Endoskopik jarrohlik, Trigeminal nevralgiya, Umurtqa pogonasi, MRT/KT, Reabilitatsiya.";
    if (ql.includes('salom') || ql.includes('assalom')) return "Assalomu alaykum! Fayz Plus klinikasiga xush kelibsiz!";
    return "Bu savol boyicha: +998 90 573 00 83. Telegram: @fayz1717";
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const botMsg = { role: 'assistant', content: getAnswer(input) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,var(--t1),var(--t0))', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(0,255,194,0.35)', fontSize: 24 }}>
        {open ? 'X' : 'Chat'}
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: 96, right: 28, zIndex: 9998, width: 'min(340px, calc(100vw - 40px))', height: 480, background: 'rgba(4,9,15,0.97)', border: '0.5px solid rgba(0,255,194,0.2)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '0.5px solid rgba(0,255,194,0.1)', background: 'rgba(0,255,194,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--acc)' }}>Fayz Plus Yordamchi</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>Online</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginTop: 16 }}>
                <div style={{ marginBottom: 12, color: 'var(--t3)', fontSize: 13 }}>Salom! Qanday yordam kerak?</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Klinika manzili', 'Vrachlar', 'Xizmatlar', 'Boglanish'].map((q) => (
                    <button key={q} onClick={() => setInput(q)} style={{ background: 'rgba(0,255,194,0.05)', border: '0.5px solid rgba(0,255,194,0.15)', borderRadius: 8, padding: '7px 12px', color: 'var(--t3)', fontSize: 11.5, cursor: 'pointer', textAlign: 'left' }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', padding: '8px 12px', borderRadius: 10, fontSize: 12.5, lineHeight: 1.7, whiteSpace: 'pre-line', background: m.role === 'user' ? 'linear-gradient(135deg,var(--t1),var(--t0))' : 'rgba(0,255,194,0.06)', color: m.role === 'user' ? '#fff' : 'var(--text)' }}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: '0.5px solid rgba(0,255,194,0.1)', display: 'flex', gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Savol yozing..." style={{ flex: 1, background: 'rgba(0,255,194,0.04)', border: '0.5px solid rgba(0,255,194,0.15)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 12.5, outline: 'none' }} />
            <button onClick={send} style={{ background: 'linear-gradient(135deg,var(--t1),var(--t0))', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: 14 }}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}

function BookingForm({ isMobile }: { isMobile: boolean }) {
  const [ism, setIsm] = useState('');
  const [telefon, setTelefon] = useState('');
  const [izoh, setIzoh] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const submit = async () => {
    if (!ism.trim() || !telefon.trim()) {
      setStatus('error');
      setErrMsg('Iltimos, ism va telefon raqamini kiriting.');
      return;
    }
    setStatus('sending');
    setErrMsg('');
    try {
      const res = await fetch('/api/navbat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ism, telefon, izoh }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus('ok');
        setIsm('');
        setTelefon('');
        setIzoh('');
      } else {
        setStatus('error');
        setErrMsg(data.error || 'Yuborishda xatolik. Qayta urinib koring.');
      }
    } catch {
      setStatus('error');
      setErrMsg('Internet aloqasini tekshiring va qayta urinib koring.');
    }
  };

  if (status === 'ok') {
    return (
      <div className="glass-card" style={{ padding: isMobile ? 28 : 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>OK</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--acc)', marginBottom: 10 }}>Murojaatingiz qabul qilindi!</div>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 24 }}>Rahmat! Tez orada operatorlarimiz siz bilan boglanishadi.</p>
        <button onClick={() => setStatus('idle')} style={{ ...s.oBtn, justifyContent: 'center', margin: '0 auto' }}>Yana murojaat qoldirish</button>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: isMobile ? 20 : 28, display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Ism-sharif</label>
          <input type="text" value={ism} onChange={(e) => setIsm(e.target.value)} placeholder="Ism va familiya" style={s.fi} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Telefon raqamingiz</label>
          <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+998 ..." style={s.fi} />
        </div>
      </div>
      <div>
        <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Qanday kasallik boyicha murojaat qilmoqchisiz?</label>
        <textarea rows={4} value={izoh} onChange={(e) => setIzoh(e.target.value)} placeholder="Masalan: bel ogrigi, bosh ogriq, disk churrasi..." style={{ ...s.fi, resize: 'vertical' }} />
      </div>
      {status === 'error' && (
        <div style={{ fontSize: 12, color: '#e27a7a', background: 'rgba(226,122,122,0.08)', border: '0.5px solid rgba(226,122,122,0.25)', borderRadius: 8, padding: '9px 12px' }}>{errMsg}</div>
      )}
      <button onClick={submit} disabled={status === 'sending'} style={{ ...s.iBtn, justifyContent: 'center', fontSize: 14, opacity: status === 'sending' ? 0.6 : 1, cursor: status === 'sending' ? 'wait' : 'pointer' }}>
        {status === 'sending' ? 'Yuborilmoqda...' : 'Konsultatsiya olish'} <ArrowUpRight size={16} />
      </button>
    </div>
  );
}

function HologramIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const [text, setText] = useState('');
  const fullText = 'Xush kelibsiz! Men Fayz Plus klinikasining virtual yordamchisiman.';

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
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--acc)', letterSpacing: 3, marginBottom: 24, opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.8s' }}>FAYZ PLUS</div>
      <div style={{ maxWidth: 480, textAlign: 'center', fontSize: 15, color: 'rgba(0,255,194,0.8)', lineHeight: 1.8, minHeight: 80, padding: '0 24px', opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.8s' }}>{text}</div>
    </div>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onS);
    return () => window.removeEventListener('scroll', onS);
  }, []);

  const navLinks = ['Haqimizda', 'Navbat', 'Kontakt'];

  return (
    <div style={{ background: 'var(--d0)', minHeight: '100vh', overflowX: 'hidden' }}>
      {showIntro && <HologramIntro onDone={() => setShowIntro(false)} />}
      <ChatBot />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || menu ? 'rgba(4,9,15,0.96)' : 'transparent', borderBottom: scrolled || menu ? '0.5px solid var(--border)' : 'none', backdropFilter: scrolled || menu ? 'blur(16px)' : 'none', transition: 'all .35s' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '.6px' }}>FAYZ PLYUS</div>
              <div style={{ fontSize: 8, color: 'var(--t3)', letterSpacing: '1.4px', textTransform: 'uppercase' }}>Endoskopik Jarrohlik</div>
            </div>
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {navLinks.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: 12.5, color: 'var(--muted)', textDecoration: 'none' }}>{item}</a>
              ))}
              <a href="#navbat"><button style={s.iBtn}>Konsultatsiya olish <ArrowUpRight size={14} /></button></a>
            </div>
          )}
          {isMobile && (
            <button onClick={() => setMenu(!menu)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 8 }}>
              {menu ? <X size={26} /> : <Menu size={26} />}
            </button>
          )}
        </div>
        {isMobile && menu && (
          <div style={{ background: 'rgba(4,9,15,0.98)', borderTop: '0.5px solid var(--border)', padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenu(false)} style={{ fontSize: 15, color: 'var(--text)', textDecoration: 'none', padding: '12px 4px', borderBottom: '0.5px solid rgba(0,255,194,0.08)' }}>{item}</a>
            ))}
            <a href="#navbat" onClick={() => setMenu(false)} style={{ marginTop: 12 }}>
              <button style={{ ...s.iBtn, justifyContent: 'center', width: '100%' }}>Konsultatsiya olish <ArrowUpRight size={14} /></button>
            </a>
          </div>
        )}
      </nav>

      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(29,158,117,0.12) 0%, transparent 60%), linear-gradient(180deg,var(--d0) 0%,var(--d1) 100%)' }}>
        <NeuralBackground />
        <div style={{ position: 'relative', zIndex: 5, maxWidth: 1280, margin: '0 auto', padding: isMobile ? '110px 20px 50px' : '100px 28px 60px', width: '100%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 48, alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 'clamp(30px,7vw,58px)', fontWeight: 700, lineHeight: 1.1, color: '#fff', marginBottom: 18 }}>
              Zamonaviy<br /><span className="grad-text">jarrohlik</span> —<br /><span style={{ color: 'var(--t4)' }}>ishonchli sogliq</span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 32, maxWidth: 400 }}>
              Fayz Plyus klinikasida ilgor endoskopik texnologiyalar bilan soglom hayot yolida sizga hamrohligimiz.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 42 }}>
              <a href="#navbat"><button style={s.iBtn}>Konsultatsiya olish <ArrowUpRight size={15} /></button></a>
            </div>
            <div style={{ display: 'flex', gap: isMobile ? 20 : 32, paddingTop: 28, borderTop: '0.5px solid var(--border)', flexWrap: 'wrap' }}>
              {[['5000+', 'Operatsiya'], ['98%', 'Muvaffaqiyat'], ['12+', 'Yil']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--acc)' }}>{n}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, letterSpacing: '.5px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: isMobile ? 340 : 520, position: 'relative' }}>
            <SpineCanvas />
          </div>
        </div>
      </section>

      <div style={{ position: 'relative', height: 80, overflow: 'hidden', background: 'linear-gradient(90deg,var(--d0),rgba(9,21,37,0.9),var(--d0))', borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)' }}>
        <NerveBanner />
      </div>

      <section id="haqimizda" style={{ background: 'linear-gradient(180deg,var(--d2) 0%,var(--d1) 100%)', padding: isMobile ? '64px 20px' : '88px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeIn>
            <div style={s.label}>Biz haqimizda</div>
            <h2 style={{ ...s.h2, marginBottom: 20 }}>Neyrojarrohlikda ishonchli markaz</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 14, maxWidth: 700 }}>
              Fayz Plyus — Ozbekistondagi endoskopik jarrohlik sohasida yetakchi xususiy klinika. Biz 12 yildan ortiq davomida bemorlarimizga eng yuqori sifatli tibbiy yordam korsatib kelmoqdamiz.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id="navbat" style={{ background: 'linear-gradient(180deg,var(--d2) 0%,var(--d3) 100%)', padding: isMobile ? '64px 20px' : '88px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={s.label}>Onlayn murojaat</div>
              <h2 style={s.h2}>Konsultatsiya olish</h2>
              <p style={s.sub}>Malumotlaringizni qoldiring, biz siz bilan boglanamiz</p>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: 28, alignItems: 'start' }}>
            <FadeIn><BookingForm isMobile={isMobile} /></FadeIn>
            <FadeIn delay={0.12}>
              <div className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>
                  <Clock size={17} color="var(--acc)" /> Ish vaqtlari
                </div>
                {[['Dushanba - Juma', '09:00 - 16:00', false], ['Shanba', '09:00 - 15:00', false], ['Yakshanba', 'Dam olish', true]].map(([d, ti, cl]) => (
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
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={s.label}>Manzil</div>
              <h2 style={s.h2}>Bizni toping</h2>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            <FadeIn>
              <div className="glass-card" style={{ height: 220, overflow: 'hidden', borderRadius: 12 }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3017.0311132567695!2d71.98292959999999!3d40.8711914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bca1bdc698961d%3A0x81f15bc2cb73a3fe!2sChinobod%20Fayz%20Plyus!5e0!3m2!1sen!2s!4v1779531484557!5m2!1sen!2s" width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: MapPin, l: 'Manzil', v: 'Andijon viloyati Baliqchi tumani Chinobod shaharchasi. Moljal 54-maktab' },
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
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 8 }}>FAYZ PLYUS</div>
          <p style={{ fontSize: 12.5, color: 'rgba(159,225,203,0.38)', marginBottom: 16 }}>Endoskopik jarrohlik va neyrojarrohlik markazi</p>
          <span style={{ fontSize: 11.5, color: 'rgba(159,225,203,0.28)' }}>2025 Fayz Plyus. Barcha huquqlar himoyalangan. Andijon, Ozbekiston</span>
        </div>
      </footer>
    </div>
  );
}