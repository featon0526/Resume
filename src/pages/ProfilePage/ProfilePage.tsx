import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Mail, Asterisk } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const BASE = (import.meta.env.MIAODA_CLIENT_BASE_PATH || '').replace(/\/$/, '') + '/';

/* Invisible placeholder + absolute animated span（文字逐行揭幕） */
function RevealLine({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className}`}>
      <span className="invisible whitespace-pre" aria-hidden="true">
        {text}
      </span>
      <span className="absolute left-0 top-0 will-change-transform" data-reveal>
        {text}
      </span>
    </span>
  );
}

/* Magnet：仅用于 ContactButton */
function Magnet({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const inner = wrap.firstElementChild as HTMLElement;
    inner.style.willChange = 'transform';
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      inner.style.transition = 'transform 0.3s ease-out';
      inner.style.transform = `translate(${dx / 3}px, ${dy / 3}px)`;
    };
    const onLeave = () => {
      inner.style.transition = 'transform 0.6s ease-in-out';
      inner.style.transform = 'translate(0px, 0px)';
    };
    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return (
    <div ref={wrapRef} style={{ padding: 150, display: 'inline-block' }}>
      {children}
    </div>
  );
}

/* ViewCaseButton：规格化 ghost pill */
function ViewCaseButton() {
  return (
    <button
      type="button"
      className="rounded-full border-2 border-[#0C0C0C] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#0C0C0C] transition-colors duration-200 hover:bg-[#0C0C0C]/10 sm:px-10 sm:py-3.5 sm:text-base"
    >
      View Case
    </button>
  );
}

const WORKS = [
  { src: `${BASE}images/character-1.png`, title: 'NEON STREET #77', year: '2026', tag: 'Streetwear character system' },
  { src: `${BASE}images/character-2.png`, title: 'URBAN MOTION #16', year: '2026', tag: 'Sportswear hero pose' },
  { src: `${BASE}images/character-3.png`, title: 'FIELD TACTICS #07', year: '2026', tag: 'Tactical kit study' },
];

const MARQUEE_WORDS = [
  '3D CHARACTER DESIGN',
  'REALTIME RENDER',
  'INTERACTIVE PORTFOLIO',
  'GAME ART',
  'LOOK DEVELOPMENT',
  'CREATIVE CODING',
];

const RESUME_ROWS = [
  { years: '2024 — Now', role: 'Independent Creative Technologist', org: 'Self-directed — character & interactive web work' },
  { years: '2021 — 2024', role: 'Game Artist / Look Developer', org: 'Studio — realtime character pipelines' },
  { years: '2019 — 2021', role: '3D Generalist', org: 'Freelance — stylized characters & product renders' },
];

export default function ProfilePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        yPercent: 120,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.1,
      });
      gsap.from('[data-fade]', {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
      });
      gsap.to('[data-figure]', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.utils.toArray<HTMLElement>('[data-scroll-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-white text-[#0C0C0C] antialiased">
      <style>{`
        @keyframes marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee-x 28s linear infinite; }
      `}</style>

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 sm:px-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#0C0C0C] opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Team
        </button>
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">AI Archmage</span>
      </header>

      {/* Hero：白色首屏，人物即主视觉 */}
      <section className="relative flex min-h-dvh items-center overflow-hidden px-5 pt-24 sm:px-10">
        <div className="pointer-events-none absolute -right-10 bottom-0 z-0 sm:-right-4 lg:right-10">
          <img
            src={`${BASE}images/character-4.png`}
            alt="AI Archmage character"
            data-figure
            draggable={false}
            className="h-[62vh] w-auto object-contain object-bottom sm:h-[78vh]"
          />
        </div>

        <div className="relative z-10 max-w-5xl">
          <p
            data-fade
            className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[#0C0C0C]/60 sm:mb-6"
          >
            Creative Developer — Character & Realtime Render
          </p>
          <h1
            className="font-black uppercase leading-[0.95]"
            style={{ fontSize: 'clamp(48px, 11vw, 168px)', letterSpacing: '-0.02em' }}
          >
            <RevealLine text="AI" />
            <br />
            <RevealLine text="Archmage" />
          </h1>
          <p
            data-fade
            className="mt-6 max-w-md text-sm leading-relaxed text-[#0C0C0C]/70 sm:mt-8 sm:text-base"
          >
            Designing characters and interactive worlds at the intersection of 3D craft and the web.
          </p>
        </div>
      </section>

      {/* Marquee */}
      <section className="overflow-hidden border-y border-[#0C0C0C]/10 py-5">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="text-sm font-medium uppercase tracking-[0.18em] sm:text-base">{w}</span>
              <Asterisk size={18} strokeWidth={2} className="text-[#0C0C0C]/40" />
            </span>
          ))}
        </div>
      </section>

      {/* Selected Works */}
      <section className="px-5 py-24 sm:px-10 sm:py-32">
        <div data-scroll-reveal className="mb-12 flex items-end justify-between sm:mb-16">
          <h2 className="text-2xl font-bold uppercase sm:text-4xl" style={{ letterSpacing: '-0.01em' }}>
            Selected Work
          </h2>
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#0C0C0C]/50">
            2026 — {WORKS.length} cases
          </span>
        </div>

        <div className="grid gap-10 sm:gap-14 lg:grid-cols-3">
          {WORKS.map((work, i) => (
            <motion.article
              key={work.title}
              data-scroll-reveal
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group"
            >
              <div className="mb-5 aspect-[4/3] overflow-hidden rounded-2xl bg-[#F4F4F2]">
                <img
                  src={work.src}
                  alt={work.title}
                  draggable={false}
                  className="h-full w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold sm:text-xl">{work.title}</h3>
                <span className="text-xs text-[#0C0C0C]/50">{work.year}</span>
              </div>
              <p className="mb-5 mt-1 text-sm text-[#0C0C0C]/60">{work.tag}</p>
              <ViewCaseButton />
            </motion.article>
          ))}
        </div>
      </section>

      {/* Resume：严肃履历 */}
      <section className="border-t border-[#0C0C0C]/10 bg-[#FAFAF8] px-5 py-24 sm:px-10 sm:py-32">
        <div data-scroll-reveal className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold uppercase sm:text-4xl" style={{ letterSpacing: '-0.01em' }}>
            Resume
          </h2>
        </div>
        <div className="max-w-3xl">
          {RESUME_ROWS.map((row) => (
            <div
              key={row.years}
              data-scroll-reveal
              className="grid gap-2 border-b border-[#0C0C0C]/10 py-6 sm:grid-cols-[120px_1fr] sm:gap-8"
            >
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#0C0C0C]/50">
                {row.years}
              </span>
              <div>
                <p className="text-base font-semibold sm:text-lg">{row.role}</p>
                <p className="mt-1 text-sm text-[#0C0C0C]/60">{row.org}</p>
              </div>
            </div>
          ))}
          <div data-scroll-reveal className="mt-10 flex flex-wrap gap-2">
            {['Character Design', 'PBR Materials', 'Realtime Render', 'React & TypeScript', 'GSAP / WebGL'].map(
              (s) => (
                <span
                  key={s}
                  className="rounded-full border border-[#0C0C0C]/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#0C0C0C]/70"
                >
                  {s}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="flex flex-col items-center px-5 py-28 text-center sm:py-40">
        <p
          data-fade
          className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[#0C0C0C]/60"
        >
          Contact
        </p>
        <h2
          data-scroll-reveal
          className="font-black uppercase leading-[0.95]"
          style={{ fontSize: 'clamp(40px, 8vw, 120px)', letterSpacing: '-0.02em' }}
        >
          Have a world
          <br />
          to build?
        </h2>
        <div data-scroll-reveal className="mt-12">
          <Magnet>
            <button
              type="button"
              className="flex items-center gap-3 rounded-full bg-[#0C0C0C] px-10 py-4 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:bg-black sm:px-12 sm:py-5 sm:text-base"
            >
              <Mail size={18} strokeWidth={2} />
              Get in touch
              <ArrowUpRight size={18} strokeWidth={2} />
            </button>
          </Magnet>
        </div>
      </section>
    </div>
  );
}
