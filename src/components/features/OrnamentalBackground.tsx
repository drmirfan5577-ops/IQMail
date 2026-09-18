import { useEffect, useRef } from 'react';
import { useBgStore } from '@/stores/backgroundStore';

interface Orb {
  x: number; y: number; r: number; vx: number; vy: number;
  color: string; alpha: number; pulse: number; pulseSpeed: number;
  type: 'dot' | 'bubble' | 'flower' | 'star' | 'ring';
  rotation: number; rotSpeed: number; size: number;
}

const THEME_PALETTES: Record<string, string[]> = {
  nebula:  ['#60a5fa','#a78bfa','#34d399','#f472b6','#fb923c','#38bdf8'],
  aurora:  ['#34d399','#6ee7b7','#a7f3d0','#5eead4','#67e8f9','#4ade80'],
  matrix:  ['#4ade80','#22c55e','#86efac','#bbf7d0','#a3e635','#84cc16'],
  ocean:   ['#38bdf8','#7dd3fc','#bae6fd','#67e8f9','#a5f3fc','#0ea5e9'],
  neon:    ['#f0abfc','#e879f9','#c084fc','#f472b6','#fb7185','#818cf8'],
};

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  const petals = 6;
  for (let i = 0; i < petals; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / petals);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.6, size * 0.25, size * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }
  // Center
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = alpha * 0.6;
  ctx.fill();
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  const spikes = 4;
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes;
    const r = i % 2 === 0 ? size : size * 0.38;
    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha * 0.35;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // Shine
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
  grad.addColorStop(0, color + '55');
  grad.addColorStop(0.4, color + '18');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

function drawRing(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha * 0.45;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8;
  ctx.setLineDash([3, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

export default function OrnamentalBackground() {
  const { theme, focusMode } = useBgStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const rafRef = useRef<number>(0);
  const palette = THEME_PALETTES[theme] ?? THEME_PALETTES.nebula;

  // Build orb pool whenever theme changes
  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const types: Orb['type'][] = ['dot', 'dot', 'dot', 'bubble', 'bubble', 'flower', 'star', 'ring'];
    orbsRef.current = Array.from({ length: 140 }, () => {
      const type = types[Math.floor(Math.random() * types.length)];
      const baseSize = type === 'dot' ? Math.random() * 2.5 + 0.5
        : type === 'bubble' ? Math.random() * 14 + 6
        : type === 'ring' ? Math.random() * 20 + 10
        : Math.random() * 8 + 4; // flower / star
      return {
        x: Math.random() * W, y: Math.random() * H,
        r: baseSize, size: baseSize,
        vx: (Math.random() - 0.5) * 0.28,
        vy: -(Math.random() * 0.25 + 0.05), // gentle upward drift
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.55 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.008,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.012,
      };
    });
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const opacity = focusMode ? 0.08 : 1;
      ctx.globalAlpha = opacity;

      orbsRef.current.forEach((o) => {
        // Move
        o.x += o.vx; o.y += o.vy; o.rotation += o.rotSpeed;
        o.pulse += o.pulseSpeed;
        const pulseAlpha = o.alpha * (0.75 + 0.25 * Math.sin(o.pulse));

        // Wrap
        if (o.x < -40) o.x = canvas.width + 40;
        if (o.x > canvas.width + 40) o.x = -40;
        if (o.y < -40) { o.y = canvas.height + 40; o.x = Math.random() * canvas.width; }
        if (o.y > canvas.height + 40) o.y = -40;

        switch (o.type) {
          case 'dot': {
            ctx.save();
            ctx.globalAlpha = pulseAlpha;
            // Glow
            const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 3.5);
            g.addColorStop(0, o.color + 'cc');
            g.addColorStop(0.4, o.color + '55');
            g.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
            // Core
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            ctx.fillStyle = o.color;
            ctx.fill();
            ctx.restore();
            break;
          }
          case 'bubble':
            drawBubble(ctx, o.x, o.y, o.r, o.color, pulseAlpha);
            break;
          case 'flower':
            drawFlower(ctx, o.x, o.y, o.size, o.rotation, o.color, pulseAlpha * 0.75);
            break;
          case 'star':
            drawStar(ctx, o.x, o.y, o.size, o.rotation, o.color, pulseAlpha * 0.8);
            break;
          case 'ring':
            drawRing(ctx, o.x, o.y, o.r, o.color, pulseAlpha);
            break;
        }
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [theme, focusMode, palette]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-[8] w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
