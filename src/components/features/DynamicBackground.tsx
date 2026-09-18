import { useEffect, useRef, useMemo } from 'react';
import { useBgStore, BgTheme } from '@/stores/backgroundStore';
import { useParallax } from '@/hooks/useParallax';

// Theme color palettes
const THEMES: Record<BgTheme, { blobs: string[]; particles: string; grid?: string }> = {
  nebula: {
    blobs: ['#1d4ed8cc', '#7c3aedcc', '#0891b2aa', '#1e1b4bcc'],
    particles: '#60a5fa',
  },
  aurora: {
    blobs: ['#065f46cc', '#0f766ecc', '#6d28d9aa', '#1e3a5fcc'],
    particles: '#34d399',
  },
  matrix: {
    blobs: ['#14532dcc', '#052e16cc', '#166534aa', '#0d1117cc'],
    particles: '#4ade80',
    grid: '#00ff4122',
  },
  ocean: {
    blobs: ['#0369a1cc', '#0c4a6ecc', '#164e63aa', '#0f172acc'],
    particles: '#38bdf8',
  },
  neon: {
    blobs: ['#86198fcc', '#be185dcc', '#4f46e5aa', '#1e1b4bcc'],
    particles: '#f0abfc',
  },
};

// Blob definitions (static positions, animated with CSS)
const BLOBS = [
  { w: 600, h: 600, x: 10, y: 5,  dur: 18, delay: 0 },
  { w: 500, h: 500, x: 60, y: 50, dur: 22, delay: -7 },
  { w: 700, h: 400, x: 30, y: 60, dur: 26, delay: -12 },
  { w: 400, h: 600, x: 75, y: 10, dur: 20, delay: -5 },
];

interface Particle {
  x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string;
}

export default function DynamicBackground() {
  const { theme, focusMode, filters, filtersEnabled } = useBgStore();
  const parallax = useParallax(0.025);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const palette = THEMES[theme];

  // Init particles
  useEffect(() => {
    const count = 80;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      color: palette.particles,
    }));
  }, [theme]);

  // Animate canvas particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!focusMode) {
        // Draw connecting lines between nearby particles
        const pts = particlesRef.current;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.strokeStyle = palette.particles + Math.round((1 - dist / 120) * 40).toString(16).padStart(2, '0');
              ctx.lineWidth = 0.5;
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw & move particles
        pts.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = palette.particles + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
          ctx.fill();
        });

        // Matrix grid overlay
        if (theme === 'matrix' && palette.grid) {
          ctx.strokeStyle = palette.grid;
          ctx.lineWidth = 0.5;
          for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
          }
          for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [theme, focusMode, palette]);

  const parallaxStyle = {
    transform: `translate(${parallax.x * 40}px, ${parallax.y * 40}px) scale(1.06)`,
    transition: 'transform 0.1s linear',
  };

  const opacity = focusMode ? 0.15 : 1;

  // Filter values
  const glassOpacity = filtersEnabled ? filters.glassIntensity / 200 : 0;
  const blurPx = filtersEnabled ? (filters.blurLevel / 100) * 6 : 0;
  const tintOpacity = filtersEnabled ? filters.tintOpacity / 100 : 0;
  const neonOpacity = filtersEnabled ? filters.neonGlow / 100 : 0;

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ transition: 'opacity 0.8s ease', opacity }}
      aria-hidden="true"
    >
      {/* Gradient blobs layer */}
      <div className="absolute inset-0" style={parallaxStyle}>
        {BLOBS.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.w,
              height: b.h,
              left: `${b.x}%`,
              top: `${b.y}%`,
              background: `radial-gradient(ellipse, ${palette.blobs[i % palette.blobs.length]}, transparent 70%)`,
              filter: 'blur(60px)',
              animation: `bgBlob ${b.dur}s ease-in-out infinite alternate`,
              animationDelay: `${b.delay}s`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* Fluid wave layer */}
      <div
        className="absolute inset-0"
        style={{
          ...parallaxStyle,
          background: `
            radial-gradient(ellipse 80% 50% at 20% 80%, ${palette.blobs[0]}44, transparent),
            radial-gradient(ellipse 60% 80% at 80% 20%, ${palette.blobs[1]}33, transparent)
          `,
          animation: 'bgWave 12s ease-in-out infinite alternate',
          willChange: 'transform, opacity',
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: focusMode ? 0 : 1, transition: 'opacity 0.5s ease' }}
      />

      {/* Visual filters overlay */}
      {filtersEnabled && (
        <>
          {/* Glass tint */}
          <div
            className="absolute inset-0"
            style={{ background: `rgba(255,255,255,${glassOpacity})`, backdropFilter: `blur(${blurPx}px)` }}
          />
          {/* Color tint */}
          <div
            className="absolute inset-0"
            style={{ background: filters.colorTint, opacity: tintOpacity }}
          />
          {/* Neon glow */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: `inset 0 0 ${200 * neonOpacity}px ${palette.particles}${Math.round(neonOpacity * 60).toString(16).padStart(2, '0')}`,
              opacity: neonOpacity,
            }}
          />
        </>
      )}
    </div>
  );
}
