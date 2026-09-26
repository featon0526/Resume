import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BASE = (import.meta.env.MIAODA_CLIENT_BASE_PATH || '').replace(/\/$/, '') + '/';

const FIGURINES = [
  { src: `${BASE}images/character-1.png`, alt: '橙白机能风角色 #77' },
  { src: `${BASE}images/character-2.png`, alt: '米白运动风角色 #16' },
  { src: `${BASE}images/character-3.png`, alt: '黑红战术风角色 #07' },
  { src: `${BASE}images/character-4.png`, alt: '军绿工装风角色' },
];

const GLOW_COLORS = [
  'rgba(255, 122, 42, 0.22)',
  'rgba(230, 200, 150, 0.20)',
  'rgba(232, 72, 60, 0.20)',
  'rgba(150, 170, 90, 0.22)',
];

type Role = 'center' | 'left' | 'right' | 'back';

const ROLE_ORDER: Role[] = ['center', 'left', 'back', 'right'];

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

const ITEM_BASE: CSSProperties = {
  position: 'absolute',
  aspectRatio: '0.6 / 1',
  transition: `transform 650ms ${EASE}, filter 650ms ${EASE}, opacity 650ms ${EASE}, left 650ms ${EASE}`,
  willChange: 'transform, filter, opacity',
};

function roleStyle(role: Role, isMobile: boolean): CSSProperties {
  switch (role) {
    case 'center':
      return {
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'none',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : 0,
      };
    case 'left':
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      };
    case 'right':
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      };
    case 'back':
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(4px)',
        opacity: 1,
        zIndex: 5,
        left: '50%',
        height: isMobile ? '13%' : '22%',
        bottom: isMobile ? '32%' : '12%',
      };
  }
}

export default function ToonHubHero() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640,
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)');
    const onChange = () => setIsMobile(window.innerWidth < 640);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const navigate = (dir: 'prev' | 'next') => {
    setActive((prev) =>
      dir === 'next'
        ? (prev + 1) % FIGURINES.length
        : (prev - 1 + FIGURINES.length) % FIGURINES.length,
    );
  };

  const roleOf = (index: number): Role =>
    ROLE_ORDER[(index - active + FIGURINES.length) % FIGURINES.length];

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-background">
      {/* 背景光晕：随轮播角色切换的彩色渐变，650ms 交叉淡化 */}
      {GLOW_COLORS.map((color, i) => (
        <div
          key={color}
          className="absolute inset-0 z-[1]"
          aria-hidden="true"
          style={{
            background: `radial-gradient(120% 95% at 50% 70%, ${color} 0%, transparent 62%)`,
            opacity: active === i ? 1 : 0,
            transition: `opacity 650ms ${EASE}`,
          }}
        />
      ))}

      {/* 巨型背景文字 */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center" aria-hidden="true">
        <span
          className="select-none whitespace-nowrap font-black uppercase leading-none text-white/[0.07]"
          style={{ fontSize: 'clamp(72px, 23vw, 360px)', letterSpacing: '-0.02em' }}
        >
          3D SHAPE
        </span>
      </div>

      {/* 品牌标签 */}
      <div
        className="absolute left-4 top-6 z-[60] text-xs font-semibold uppercase text-white opacity-90 sm:left-8"
        style={{ letterSpacing: '0.18em' }}
      >
        TOONHUB
      </div>

      {/* 手办轮播 */}
      <div className="absolute inset-0 z-[3]">
        {FIGURINES.map((figurine, index) => {
          const role = roleOf(index);
          return (
            <div key={figurine.src} style={{ ...ITEM_BASE, ...roleStyle(role, isMobile) }}>
              <img
                src={figurine.src}
                alt={figurine.alt}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 左下：标题 + 导航按钮 */}
      <div className="absolute bottom-6 left-4 z-[60] max-w-[320px] sm:bottom-20 sm:left-24">
        <h2
          className="mb-2 text-base font-bold uppercase tracking-widest text-white opacity-95 sm:mb-3 sm:text-[22px]"
          style={{ letterSpacing: '0.02em' }}
        >
          TOONHUB FIGURINES
        </h2>
        <p
          className="mb-4 hidden text-xs text-white opacity-85 sm:mb-5 sm:block sm:text-sm"
          style={{ lineHeight: 1.6 }}
        >
          The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is
          flawless. Many thanks! Wishing you the win. Order now.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('prev')}
            aria-label="上一只手办"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-[transform,background-color] duration-150 hover:scale-[1.08] hover:bg-white/[0.12] sm:h-16 sm:w-16"
          >
            <ArrowLeft size={26} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={() => navigate('next')}
            aria-label="下一只手办"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-[transform,background-color] duration-150 hover:scale-[1.08] hover:bg-white/[0.12] sm:h-16 sm:w-16"
          >
            <ArrowRight size={26} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {/* 右下：DISCOVER IT */}
      <button
        type="button"
        onClick={() => navigate('next')}
        className="absolute bottom-6 right-4 z-[60] flex items-center gap-2 uppercase leading-none text-white opacity-95 transition-opacity duration-200 hover:opacity-100 sm:bottom-20 sm:right-10"
        style={{
          fontFamily: "'Anton', 'Arial Narrow', sans-serif",
          fontSize: 'clamp(20px, 4vw, 56px)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
        }}
      >
        DISCOVER IT
        <ArrowRight className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={2.25} />
      </button>
    </section>
  );
}
