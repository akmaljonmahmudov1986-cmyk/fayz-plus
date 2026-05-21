'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain, Eye, Activity, Scan, Cross, Stethoscope,
  MapPin, Phone, Mail, Clock, ChevronRight, Star,
  Share2, Send, Globe, PlayCircle, Menu, X,
} from 'lucide-react';

const NeuralBackground = dynamic(() => import('@/components/NeuralBackground'), { ssr: false });
const SpineCanvas = dynamic(() => import('@/components/SpineCanvas'), { ssr: false });
const NerveBanner = dynamic(() => import('@/components/NerveBanner'), { ssr: false });

const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}>
      {children}
    </motion.div>
  );
};

const services = [
  { icon: Brain, name: 'Neyrojarrohlik', desc: 'Miya va orqa miya kasalliklari bo\'yicha zamonaviy endoskopik operatsiyalar.' },
  { icon: Eye, name: 'Endoskopik diagnostika', desc: 'Yuqori aniqlikdagi endoskop uskunalari bilan tezkor va aniq tashxis.' },
  { icon: Activity, name: 'Reabilitatsiya', desc: 'Operatsiyadan keyingi tiklash va qayta tiklanish dasturlari.' },
  { icon: Scan, name: 'MRT · KT tahlil', desc: '3D tasvirlash texnologiyalari bilan yuqori aniqlikdagi diagnostika.' },
  { icon: Cross, name: 'Laparoskopiya', desc: 'Minimal invaziv laparoskopik jarrohlik amaliyotlari.' },
  { icon: Stethoscope, name: 'Konsultatsiya', desc: 'Mutaxassis vrachlar bilan bepul birlamchi tibbiy konsultatsiya.' },
];

const doctors = [
  { name: 'Prof. Aliyev Rustam', spec: 'Bosh neyrojarroh', exp: '20 yillik tajriba', initials: 'AR' },
  { name: 'Dr. Karimova Nilufar', spec: 'Endoskopik jarroh', exp: '14 yillik tajriba', initials: 'KN' },
  { name: 'Dr. Yusupov Jahongir', spec: 'Reabilitolog', exp: '10 yillik tajriba', initials: 'YJ' },
];

const stats = [
  { n: '5000+', l: 'Muvaffaqiyatli operatsiya' },
  { n: '12+', l: 'Yillik tajriba' },
  { n: '98%', l: 'Muvaffaqiyat darajasi' },
  { n: '15+', l: 'Mutaxassis vrach' },
];

const iStyle = {
  width: '100%', padding: '10px 14px',
  border: '0.5px solid rgba(29,158,117,0.22)', borderRadius: 8,
  fontSize: 12, background: 'rgba(255,255,255,0.04)', color: 'var(--text)',
  outline: 'none', fontFamily: 'DM Sans, sans-serif',
} as React.CSSProperties;

const selStyle = {
  width: '100%', padding: '10px 14px',
  border: '0.5px solid rgba(29,158,117,0.22)', borderRadius: 8,
  fontSize: 12, background: 'rgba(12,35,50,0.9)', color: 'var(--text)', outline: 'none',
} as React.CSSProperties;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: 'var(--dark0)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? 'rgba(5,14,22,0.97)' : 'rgba(5,14,22,0.85)',
        borderBottom: '0.5px solid var(--border)',
        backdropFilter: 'blur(12px)', transition: 'background 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <circle cx="10" cy="8" r="5" fill="var(--teal1)" />
              <circle cx="20" cy="8" r="4" fill="var(--teal1)" />
              <circle cx="10" cy="20" r="4" fill="var(--teal1)" />
              <circle cx="20" cy="20" r="5" fill="var(--teal1)" />
              <circle cx="14" cy="13" r="2.5" fill="var(--teal2)" />
            </svg>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '.5px' }}>FAYZ PLYUS</div>
              <div style={{ fontSize: 8.5, color: 'var(--teal2)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>Endoskopik Jarrohlik Markazi</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {['Xizmatlar', 'Vrachlar', 'Galereya', 'Biz haqimizda', 'Kontakt'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal2)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >{item}</a>
            ))}
            <a href="#navbat">
              <button style={{
                background: 'var(--teal1)', color: '#fff', border: 'none',
                padding: '8px 18px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#16875f')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--teal1)')}
              >Navbat olish</button>
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg,#050e16 0%,#071a28 45%,#0b2535 100%)' }}>
        <NeuralBackground />
        <div style={{ position: 'relative', zIndex: 5, maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(29,158,117,0.12)', border: '0.5px solid rgba(29,158,117,0.3)',
                color: 'var(--teal2)', fontSize: 10, letterSpacing: '1.5px',
                padding: '5px 14px', borderRadius: 20, marginBottom: 20, textTransform: 'uppercase',
              }}>
                <span style={{ width: 7, height: 7, background: 'var(--teal2)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.8s ease-in-out infinite' }} />
                Neyrojarrohlik · Endoskopiya
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.12 }}
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,4vw,50px)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
              Zamonaviy<br /><span style={{ color: 'var(--teal2)' }}>jarrohlik</span> —<br />ishonchli sog'liq
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28, maxWidth: 380 }}>
              Fayz Plyus klinikasida eng ilg'or endoskopik texnologiyalar bilan sog'lom hayot yo'lida sizga hamrohligimiz. Trigeminal nevralgiya va umurtqa pog'onasi kasalliklarida mutaxassis.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }} style={{ display: 'flex', gap: 12 }}>
              <a href="#navbat">
                <button style={{ background: 'var(--teal1)', color: '#fff', border: 'none', padding: '12px 26px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(29,158,117,0.3)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#16875f')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--teal1)')}>
                  Navbat olish
                </button>
              </a>
              <a href="#xizmatlar">
                <button style={{ background: 'transparent', color: 'var(--teal2)', padding: '12px 22px', borderRadius: 8, fontSize: 13, border: '0.5px solid rgba(93,202,165,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(93,202,165,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  Xizmatlar <ChevronRight size={14} />
                </button>
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '0.5px solid var(--border)' }}>
              {[['5000+', 'Operatsiya'], ['98%', 'Muvaffaqiyat'], ['12+', 'Yil tajriba']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--teal2)' }}>{n}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} style={{ height: 500, position: 'relative' }}>
            <SpineCanvas />
          </motion.div>
        </div>
      </section>

      {/* NERVE BANNER */}
      <div style={{ position: 'relative', height: 88, overflow: 'hidden', background: 'linear-gradient(90deg,#060f18,#0d2535,#060f18)' }}>
        <NerveBanner />
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {['Trigeminal Nevralgiya', '3 Shohli Nerv', "Umurtqa Pog'onasi", 'Endoskopik Jarrohlik', 'Neyronavigatsiya'].map(chip => (
            <span key={chip} style={{ background: 'rgba(5,14,22,0.82)', border: '0.5px solid var(--border)', borderRadius: 20, padding: '5px 14px', fontSize: 10, color: 'var(--teal2)', letterSpacing: '.8px', backdropFilter: 'blur(4px)' }}>{chip}</span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="xizmatlar" style={{ background: 'linear-gradient(160deg,#071a27 0%,#0c2530 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, color: 'var(--teal2)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 8 }}>Xizmatlarimiz</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>Ixtisoslashgan tibbiy yordam</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>Endoskopik va neyrojarrohlik sohasida to'liq xizmat</p>
          </div></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
            {services.map((s, i) => (
              <FadeIn key={s.name} delay={i * 0.07}>
                <div className="card-hover" style={{ background: 'var(--cardbg)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 22 }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(29,158,117,0.1)', border: '0.5px solid rgba(29,158,117,0.22)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <s.icon size={20} color="var(--teal2)" />
                  </div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="biz-haqimizda" style={{ background: 'linear-gradient(160deg,#050e16 0%,#071a27 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <FadeIn>
            <div style={{ fontSize: 10, color: 'var(--teal2)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 10 }}>Biz haqimizda</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 18, lineHeight: 1.25 }}>Neyrojarrohlikda <span style={{ color: 'var(--teal2)' }}>ishonchli</span> markaz</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 14 }}>Fayz Plyus — O'zbekistondagi endoskopik jarrohlik sohasida yetakchi xususiy klinika. Biz 12 yildan ortiq davomida bemorlarimizga eng yuqori sifatli tibbiy yordam ko'rsatib kelmoqdamiz.</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 28 }}>Klinikamizda Yevropa standartlaridagi zamonaviy jihozlar, tajribali neyrojarrohlar va individual yondashuv asosida har bir bemor uchun eng yaxshi natijaga erishiladi.</p>
            <button style={{ background: 'var(--teal1)', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              onMouseEnter={e => (e.currentTarget.style.background = '#16875f')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--teal1)')}>
              Batafsil <ChevronRight size={15} />
            </button>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {([['Brain', Brain], ['Scan', Scan], ['Activity', Activity], ['Star', Star]] as [string, React.ComponentType<{ size: number; color: string }>][]).map(([label, Icon]) => (
                <div key={label} style={{ height: 160, background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Icon size={28} color="rgba(93,202,165,0.3)" />
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>{label === 'Brain' ? 'Operatsion zal' : label === 'Scan' ? 'Diagnostika' : label === 'Activity' ? 'Reabilitatsiya' : 'Natijalar'}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: 'linear-gradient(90deg,#071a27,#0c2530)', borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ padding: '28px 16px', textAlign: 'center', borderRight: i < 3 ? '0.5px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 700, color: 'var(--teal2)' }}>{s.n}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.l}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* DOCTORS */}
      <section id="vrachlar" style={{ background: 'linear-gradient(160deg,#071a27 0%,#0c2530 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, color: 'var(--teal2)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 8 }}>Vrachlarimiz</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>Mutaxassis jamoamiz</h2>
          </div></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            {doctors.map((d, i) => (
              <FadeIn key={d.name} delay={i * 0.1}>
                <div className="card-hover" style={{ background: 'var(--cardbg)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 28, textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, background: 'rgba(29,158,117,0.12)', border: '0.5px solid rgba(29,158,117,0.25)', borderRadius: '50%', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--teal2)' }}>{d.initials}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--teal2)', marginTop: 4 }}>{d.spec}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{d.exp}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="galereya" style={{ background: 'linear-gradient(160deg,#050e16 0%,#071a27 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn><div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 10, color: 'var(--teal2)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 8 }}>Galereya</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>Klinikamiz</h2>
          </div></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[1,2,3,4].map(n => (
              <FadeIn key={n} delay={n * 0.07}>
                <div style={{ height: 180, background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(93,202,165,0.2)' }}>
                  <Eye size={28} color="rgba(93,202,165,0.2)" />
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>Rasm {n}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="navbat" style={{ background: 'linear-gradient(135deg,#050e16 0%,#0a2030 55%,#0e2c38 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, color: 'var(--teal2)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 8 }}>Onlayn navbat</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>Navbat olish</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>Qulay vaqtni tanlang, biz siz bilan bog'lanamiz</p>
          </div></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
            <FadeIn>
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[['Ism-sharif', 'Ism va familiya'], ['Telefon', '+998 ...']].map(([label, ph]) => (
                    <div key={label}><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{label}</label><input type="text" placeholder={ph} style={iStyle} /></div>
                  ))}
                </div>
                <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Xizmat turi</label>
                  <select style={selStyle}><option>Neyrojarrohlik konsultatsiyasi</option><option>Trigeminal nevralgiya</option><option>Endoskopik diagnostika</option><option>Umurtqa pog'onasi</option><option>MRT / KT</option><option>Reabilitatsiya</option></select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Sana</label><input type="text" placeholder="KK.OO.YYYY" style={iStyle} /></div>
                  <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Vaqt</label>
                    <select style={selStyle}>{['09:00','10:00','11:00','12:00','14:00','15:00','16:00'].map(t=><option key={t}>{t}</option>)}</select>
                  </div>
                </div>
                <div><label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Izoh (ixtiyoriy)</label>
                  <textarea rows={3} placeholder="Muammo haqida qisqacha..." style={{ ...iStyle, resize: 'vertical' }} />
                </div>
                <button style={{ background: 'var(--teal1)', color: '#fff', border: 'none', padding: 13, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(29,158,117,0.25)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#16875f')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--teal1)')}>
                  Navbat olish →
                </button>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border)', borderRadius: 14, padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}><Clock size={16} color="var(--teal2)" /> Ish vaqtlari</div>
                {[['Dushanba – Juma','08:00 – 18:00',false],['Shanba','09:00 – 15:00',false],['Yakshanba','Dam olish',true]].map(([day,time,closed])=>(
                  <div key={String(day)} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'0.5px solid rgba(255,255,255,0.06)', fontSize:12 }}>
                    <span style={{color:'var(--muted)'}}>{day}</span>
                    <span style={{color:closed?'#e27a7a':'var(--teal2)',fontWeight:600}}>{time}</span>
                  </div>
                ))}
                <div style={{ marginTop:16, padding:'14px 16px', background:'rgba(29,158,117,0.1)', border:'0.5px solid rgba(29,158,117,0.25)', borderRadius:10 }}>
                  <div style={{fontSize:9,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:5}}>Shoshilinch yordam</div>
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:18,fontWeight:700,color:'var(--teal2)'}}>+998 71 123 45 67</div>
                  <div style={{fontSize:9,color:'var(--muted)',marginTop:3}}>24 soat, 7 kun</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="kontakt" style={{ background: 'linear-gradient(160deg,#071a27 0%,#0c2530 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, color: 'var(--teal2)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 8 }}>Manzil</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>Bizni toping</h2>
          </div></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <FadeIn>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border)', borderRadius: 14, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <MapPin size={36} color="var(--teal2)" />
                <div style={{fontSize:12,color:'var(--muted)'}}>Toshkent shahri, Chilonzor tumani</div>
                <div style={{fontSize:11,color:'var(--teal2)',cursor:'pointer'}}>Xaritada ko'rish →</div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  {icon:MapPin,label:'Manzil',val:"Toshkent, Chilonzor, Bunyodkor sh. 12"},
                  {icon:Phone,label:'Telefon',val:'+998 71 123 45 67'},
                  {icon:Mail,label:'Email',val:'info@fayzplyus.uz'},
                  {icon:Send,label:'Telegram',val:'@fayzplyus'},
                ].map(({icon:Icon,label,val})=>(
                  <div key={label} style={{display:'flex',alignItems:'flex-start',gap:12}}>
                    <div style={{width:36,height:36,background:'rgba(29,158,117,0.1)',border:'0.5px solid rgba(29,158,117,0.22)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={16} color="var(--teal2)" /></div>
                    <div><div style={{fontSize:9,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.5px'}}>{label}</div><div style={{fontSize:12,color:'var(--text)',fontWeight:600,marginTop:2}}>{val}</div></div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'linear-gradient(160deg,#030b12 0%,#060f18 100%)', borderTop: '0.5px solid var(--border)', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="10" cy="8" r="5" fill="var(--teal1)"/><circle cx="20" cy="8" r="4" fill="var(--teal1)"/><circle cx="10" cy="20" r="4" fill="var(--teal1)"/><circle cx="20" cy="20" r="5" fill="var(--teal1)"/><circle cx="14" cy="13" r="2.5" fill="var(--teal2)"/></svg>
                <div><div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,color:'#fff'}}>FAYZ PLYUS</div><div style={{fontSize:8,color:'var(--teal2)',letterSpacing:'1px',textTransform:'uppercase'}}>Endoskopik Jarrohlik Markazi</div></div>
              </div>
              <p style={{fontSize:12,color:'rgba(180,220,210,0.4)',lineHeight:1.75,maxWidth:280}}>Endoskopik jarrohlik va neyrojarrohlik sohasida O'zbekistondagi ishonchli markaz.</p>
              <div style={{display:'flex',gap:8,marginTop:18}}>
                {[{icon:Send,l:'Telegram'},{icon:Share2,l:'Instagram'},{icon:Globe,l:'Facebook'},{icon:PlayCircle,l:'YouTube'}].map(({icon:Icon,l})=>(
                  <button key={l} aria-label={l} style={{width:34,height:34,background:'rgba(29,158,117,0.1)',border:'0.5px solid rgba(29,158,117,0.22)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='rgba(29,158,117,0.22)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='rgba(29,158,117,0.1)')}>
                    <Icon size={15} color="var(--teal2)" />
                  </button>
                ))}
              </div>
            </div>
            {[{title:'Xizmatlar',links:['Neyrojarrohlik','Endoskopiya','Laparoskopiya','MRT · KT','Reabilitatsiya']},{title:'Klinika',links:['Biz haqimizda','Vrachlar','Galereya','Navbat olish','Kontakt']}].map(col=>(
              <div key={col.title}>
                <div style={{fontSize:11,fontWeight:600,color:'var(--teal2)',marginBottom:14,textTransform:'uppercase',letterSpacing:'.5px'}}>{col.title}</div>
                {col.links.map(link=>(
                  <a key={link} href="#" style={{display:'block',fontSize:12,color:'rgba(180,220,210,0.4)',textDecoration:'none',marginBottom:8,transition:'color .2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='var(--teal2)')}
                    onMouseLeave={e=>(e.currentTarget.style.color='rgba(180,220,210,0.4)')}>{link}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:'0.5px solid rgba(255,255,255,0.07)',paddingTop:20,display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:11,color:'rgba(180,220,210,0.3)'}}>© 2025 Fayz Plyus. Barcha huquqlar himoyalangan.</span>
            <span style={{fontSize:11,color:'rgba(180,220,210,0.3)'}}>Toshkent, O'zbekiston</span>
          </div>
        </div>
      </footer>

      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.7);}}`}</style>
    </div>
  );
}
