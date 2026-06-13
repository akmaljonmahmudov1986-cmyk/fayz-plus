'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, ArrowUpRight, Menu, X } from 'lucide-react';

const SpineCanvas = dynamic(() => import('@/components/SpineCanvas'), { ssr: false });

const C = {
  bg: '#f5f7f6',
  bg2: '#ffffff',
  bg3: '#eef2f0',
  green: '#1d9e75',
  greenDark: '#157a5a',
  greenLight: '#e8f5ef',
  text: '#1a2e28',
  muted: '#5f7268',
  border: '#dde6e2',
  red: '#d9534f',
};

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

const FadeIn = ({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) => {
  const ref = useRef(null);
  const io = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={io ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

const s: Record<string, React.CSSProperties> = {
  iBtn: { background: C.green, color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 18px rgba(29,158,117,0.30)', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 6 },
  oBtn: { background: C.greenLight, color: C.greenDark, padding: '12px 22px', borderRadius: 10, fontSize: 13, border: `1px solid ${C.green}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  label: { fontSize: 10, color: C.green, letterSpacing: '2.5px', textTransform: 'uppercase' as const, marginBottom: 10, fontWeight: 600 },
  h2: { fontFamily: 'Clash Display,sans-serif', fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: C.text, lineHeight: 1.2 },
  sub: { fontSize: 13, color: C.muted, marginTop: 8 },
  fi: { width: '100%', padding: '11px 14px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 12.5, background: '#fff', color: C.text, outline: 'none' },
  card: { background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.04)' },
};

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const getAnswer = (q: string): string => {
    const ql = q.toLowerCase();
    if (ql.includes('манзил') || ql.includes('қаер') || ql.includes('manzil')) return 'Манзил: Андижон вилояти, Балиқчи тумани, Чинобод шаҳарчаси. Мўлжал: 54-мактаб ёнида.';
    if (ql.includes('телефон') || ql.includes('рақам') || ql.includes('боғлан')) return 'Телефон: +998 90 573 00 83. Telegram: @fayz1717';
    if (ql.includes('вақт') || ql.includes('соат')) return 'Иш вақтимиз: Душанба-Жума 09:00-16:00, Шанба 09:00-15:00. Якшанба дам олиш.';
    if (ql.includes('врач') || ql.includes('доктор')) return 'Врачларимиз: Турсунов Мадаминжон, Раимжонов Хуршидбек, Зокиржонов Муҳаммадюсуф, Турсунов Фурқатбек.';
    if (ql.includes('хизмат')) return 'Хизматлар: Нейрожарроҳлик, Эндоскопик жарроҳлик, Тригеминал невралгия, Умуртқа поғонаси, МРТ/КТ, Реабилитация.';
    if (ql.includes('салом') || ql.includes('ассалом')) return 'Ассалому алайкум! Файз Плюс клиникасига хуш келибсиз!';
    return 'Бу савол бўйича: +998 90 573 00 83. Telegram: @fayz1717';
  };

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: input }, { role: 'assistant', content: getAnswer(input) }]);
    setInput('');
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, width: 56, height: 56, borderRadius: '50%', background: C.green, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(29,158,117,0.4)', color: '#fff', fontSize: 13, fontWeight: 600 }}>
        {open ? 'X' : 'Чат'}
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: 96, right: 28, zIndex: 9998, width: 'min(340px, calc(100vw - 40px))', height: 480, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, background: C.greenLight }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.greenDark }}>Файз Плюс Ёрдамчи</div>
            <div style={{ fontSize: 10, color: C.muted }}>Online</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: C.muted, fontSize: 12, marginTop: 16 }}>
                <div style={{ marginBottom: 12, color: C.text, fontSize: 13 }}>Салом! Қандай ёрдам керак?</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Клиника манзили', 'Врачлар', 'Хизматлар', 'Боғланиш'].map((q) => (
                    <button key={q} onClick={() => setInput(q)} style={{ background: C.greenLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', color: C.greenDark, fontSize: 11.5, cursor: 'pointer', textAlign: 'left' }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', padding: '8px 12px', borderRadius: 10, fontSize: 12.5, lineHeight: 1.7, whiteSpace: 'pre-line', background: m.role === 'user' ? C.green : C.greenLight, color: m.role === 'user' ? '#fff' : C.text }}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Савол ёзинг..." style={{ flex: 1, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 12.5, outline: 'none' }} />
            <button onClick={send} style={{ background: C.green, border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: 13 }}>OK</button>
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
      setErrMsg('Илтимос, исм ва телефон рақамини киритинг.');
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
        setErrMsg(data.error || 'Юборишда хатолик. Қайта уриниб кўринг.');
      }
    } catch {
      setStatus('error');
      setErrMsg('Интернет алоқасини текширинг ва қайта уриниб кўринг.');
    }
  };

  if (status === 'ok') {
    return (
      <div style={{ ...s.card, padding: isMobile ? 28 : 40, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16, color: C.green }}>✓</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.greenDark, marginBottom: 10 }}>Мурожаатингиз қабул қилинди!</div>
        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>Раҳмат! Тез орада операторларимиз сиз билан боғланишади.</p>
        <button onClick={() => setStatus('idle')} style={{ ...s.oBtn, justifyContent: 'center', margin: '0 auto' }}>Яна мурожаат қолдириш</button>
      </div>
    );
  }

  return (
    <div style={{ ...s.card, padding: isMobile ? 20 : 28, display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>Исм-шариф</label>
          <input type="text" value={ism} onChange={(e) => setIsm(e.target.value)} placeholder="Исм ва фамилия" style={s.fi} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>Телефон рақамингиз</label>
          <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+998 ..." style={s.fi} />
        </div>
      </div>
      <div>
        <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>Қандай касаллик бўйича мурожаат қилмоқчисиз?</label>
        <textarea rows={4} value={izoh} onChange={(e) => setIzoh(e.target.value)} placeholder="Масалан: бел оғриғи, бош оғриқ, диск чурраси..." style={{ ...s.fi, resize: 'vertical' }} />
      </div>
      {status === 'error' && (
        <div style={{ fontSize: 12, color: C.red, background: '#fdecec', border: `1px solid ${C.red}`, borderRadius: 8, padding: '9px 12px' }}>{errMsg}</div>
      )}
      <button onClick={submit} disabled={status === 'sending'} style={{ ...s.iBtn, justifyContent: 'center', fontSize: 14, opacity: status === 'sending' ? 0.6 : 1, cursor: status === 'sending' ? 'wait' : 'pointer' }}>
        {status === 'sending' ? 'Юборилмоқда...' : 'Консультация олиш'} <ArrowUpRight size={16} />
      </button>
    </div>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onS);
    return () => window.removeEventListener('scroll', onS);
  }, []);

  const navLinks: [string, string][] = [['Биз ҳақимизда', 'haqimizda'], ['Қабул', 'navbat'], ['Контакт', 'kontakt']];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', overflowX: 'hidden', color: C.text }}>
      <ChatBot />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || menu ? 'rgba(255,255,255,0.97)' : 'transparent', borderBottom: scrolled || menu ? `1px solid ${C.border}` : 'none', backdropFilter: scrolled || menu ? 'blur(12px)' : 'none', transition: 'all .3s' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            <img src="/logo.png" alt="Файз Плюс" style={{ height: 140, width: 'auto' }} />
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {navLinks.map(([label, id]) => (
                <a key={id} href={`#${id}`} style={{ fontSize: 12.5, color: C.muted, textDecoration: 'none' }}>{label}</a>
              ))}
              <a href="#navbat"><button style={s.iBtn}>Консультация олиш <ArrowUpRight size={14} /></button></a>
            </div>
          )}
          {isMobile && (
            <button onClick={() => setMenu(!menu)} style={{ background: 'transparent', border: 'none', color: C.text, cursor: 'pointer', padding: 8 }}>
              {menu ? <X size={26} /> : <Menu size={26} />}
            </button>
          )}
        </div>
        {isMobile && menu && (
          <div style={{ background: '#fff', borderTop: `1px solid ${C.border}`, padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenu(false)} style={{ fontSize: 15, color: C.text, textDecoration: 'none', padding: '12px 4px', borderBottom: `1px solid ${C.border}` }}>{label}</a>
            ))}
            <a href="#navbat" onClick={() => setMenu(false)} style={{ marginTop: 12 }}>
              <button style={{ ...s.iBtn, justifyContent: 'center', width: '100%' }}>Консультация олиш <ArrowUpRight size={14} /></button>
            </a>
          </div>
        )}
      </nav>

      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${C.greenLight} 0%, transparent 60%), ${C.bg}` }}>
        <div style={{ position: 'relative', zIndex: 5, maxWidth: 1280, margin: '0 auto', padding: isMobile ? '110px 20px 50px' : '100px 28px 60px', width: '100%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 48, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.greenLight, border: `1px solid ${C.green}`, color: C.greenDark, fontSize: 10, letterSpacing: '2px', padding: '5px 14px', borderRadius: 30, marginBottom: 22, textTransform: 'uppercase', fontWeight: 600 }}>
              Нейрожарроҳлик · Эндоскопия
            </span>
            <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 'clamp(30px,7vw,56px)', fontWeight: 700, lineHeight: 1.12, color: C.text, marginBottom: 18 }}>
              Замонавий<br /><span style={{ color: C.green }}>жарроҳлик</span> —<br />ишончли соғлиқ
            </h1>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.85, marginBottom: 32, maxWidth: 400 }}>
              Эндоскопик ва нейрожарроҳлик соҳасида 12 йиллик тажриба. Минимал аралашув, тез тикланиш ва ишончли натижа.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 42 }}>
              <a href="#navbat"><button style={s.iBtn}>Консультация олиш <ArrowUpRight size={15} /></button></a>
            </div>
            <div style={{ display: 'flex', gap: isMobile ? 20 : 32, paddingTop: 28, borderTop: `1px solid ${C.border}`, flexWrap: 'wrap' }}>
              {[['5000+', 'Операция'], ['98%', 'Муваффақият'], ['12+', 'Йил']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 26, fontWeight: 700, color: C.green }}>{n}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: '.5px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: isMobile ? 300 : 480, position: 'relative' }}>
            <SpineCanvas />
          </div>
        </div>
      </section>

      <section id="haqimizda" style={{ background: C.bg3, padding: isMobile ? '64px 20px' : '88px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeIn>
            <div style={s.label}>Биз ҳақимизда</div>
            <h2 style={{ ...s.h2, marginBottom: 20 }}>Нейрожарроҳликда ишончли марказ</h2>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.9, marginBottom: 14, maxWidth: 720 }}>
              Файз Плюс — Ўзбекистондаги эндоскопик жарроҳлик соҳасида етакчи хусусий клиника. Биз 12 йилдан ортиқ давомида беморларимизга энг юқори сифатли тиббий ёрдам кўрсатиб келмоқдамиз.
            </p>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.9, maxWidth: 720 }}>
              Клиникамизда Европа стандартларидаги замонавий жиҳозлар, тажрибали нейрожарроҳлар ва индивидуал ёндашув асосида ҳар бир бемор учун энг яхши натижага эришилади.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id="navbat" style={{ background: C.bg, padding: isMobile ? '64px 20px' : '88px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={s.label}>Онлайн мурожаат</div>
              <h2 style={s.h2}>Консультация олиш</h2>
              <p style={s.sub}>Маълумотларингизни қолдиринг, биз сиз билан боғланамиз</p>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: 28, alignItems: 'start' }}>
            <FadeIn><BookingForm isMobile={isMobile} /></FadeIn>
            <FadeIn delay={0.12}>
              <div style={{ ...s.card, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 18 }}>
                  <Clock size={17} color={C.green} /> Иш вақтлари
                </div>
                {[['Душанба - Жума', '09:00 - 16:00', false], ['Шанба', '09:00 - 15:00', false], ['Якшанба', 'Дам олиш', true]].map(([d, ti, cl]) => (
                  <div key={String(d)} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${C.border}`, fontSize: 12.5 }}>
                    <span style={{ color: C.muted }}>{d}</span>
                    <span style={{ color: cl ? C.red : C.green, fontWeight: 600 }}>{ti}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="kontakt" style={{ background: C.bg3, padding: isMobile ? '64px 20px' : '88px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={s.label}>Манзил</div>
              <h2 style={s.h2}>Бизни топинг</h2>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            <FadeIn>
              <div style={{ ...s.card, height: 220, overflow: 'hidden', padding: 0 }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3017.0311132567695!2d71.98292959999999!3d40.8711914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bca1bdc698961d%3A0x81f15bc2cb73a3fe!2sChinobod%20Fayz%20Plyus!5e0!3m2!1sen!2s!4v1779531484557!5m2!1sen!2s" width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: MapPin, l: 'Манзил', v: 'Андижон вилояти Балиқчи тумани Чинобод шаҳарчаси. Мўлжал 54-мактаб' },
                  { icon: Phone, l: 'Телефон', v: '+998 90 573 00 83' },
                  { icon: Mail, l: 'Email', v: 'fayzplus2025@gmail.com' },
                  { icon: Send, l: 'Telegram', v: '@fayz1717' },
                ].map(({ icon: Icon, l, v }) => (
                  <div key={l} style={{ ...s.card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 38, height: 38, background: C.greenLight, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={17} color={C.green} />
                    </div>
                    <div>
                      <div style={{ fontSize: 9.5, color: C.muted, textTransform: 'uppercase', letterSpacing: '.5px' }}>{l}</div>
                      <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginTop: 2 }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <footer style={{ background: C.text, padding: isMobile ? '40px 20px 24px' : '52px 28px 26px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 8 }}>ФАЙЗ ПЛЮС</div>
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>Эндоскопик жарроҳлик ва нейрожарроҳлик маркази</p>
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)' }}>2025 Файз Плюс. Барча ҳуқуқлар ҳимояланган. Андижон, Ўзбекистон</span>
        </div>
      </footer>
    </div>
  );
}