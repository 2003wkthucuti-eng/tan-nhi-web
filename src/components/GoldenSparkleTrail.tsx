import React, { useEffect, useRef } from 'react';
import { useSiteTheme } from '../themes/siteThemes';

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  isStar: boolean;
  color: string;
}

const MAX_PARTICLES = 44;

interface GoldenSparkleTrailProps {
  moonlightMode?: boolean;
}

/**
 * Vệt bụi sao đồng bộ theo Theme (hoặc Bạc Ánh Trăng) khi chạm tay hoặc di chuột lướt trên màn hình.
 */
export const GoldenSparkleTrail: React.FC<GoldenSparkleTrailProps> = ({
  moonlightMode = false,
}) => {
  const { activeTheme } = useSiteTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const moonlightRef = useRef(moonlightMode);
  moonlightRef.current = moonlightMode;
  const themeColorsRef = useRef<[string, string]>(activeTheme.particleColors);
  themeColorsRef.current = activeTheme.particleColors;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const particles: SparkleParticle[] = [];
    let rafId: number | null = null;
    let lastSpawnTime = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const spawnParticles = (x: number, y: number, count: number) => {
      const isSilver = moonlightRef.current;
      const [brightCol, accentCol] = themeColorsRef.current;
      for (let i = 0; i < count; i += 1) {
        if (particles.length >= MAX_PARTICLES) {
          particles.shift();
        }
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.25 + Math.random() * 0.75;
        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.45,
          size: 2.2 + Math.random() * 3.4,
          life: 0,
          maxLife: 28 + Math.random() * 20,
          isStar: Math.random() > 0.52,
          color: isSilver
            ? Math.random() > 0.4
              ? '#E6F0FC'
              : '#A8BFE0'
            : Math.random() > 0.4
            ? brightCol
            : accentCol,
        });
      }
      if (rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const drawFourPointStar = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.translate(x, y);
      ctx.beginPath();
      const inner = r * 0.28;
      ctx.moveTo(0, -r);
      ctx.lineTo(inner, -inner);
      ctx.lineTo(r, 0);
      ctx.lineTo(inner, inner);
      ctx.lineTo(0, r);
      ctx.lineTo(-inner, inner);
      ctx.lineTo(-r, 0);
      ctx.lineTo(-inner, -inner);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life += 1;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.012;

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * (progress < 0.2 ? progress / 0.2 : 1) * 0.88;
        const currentSize = p.size * (1 - progress * 0.45);

        if (p.isStar) {
          drawFourPointStar(p.x, p.y, currentSize * 1.45, p.color, alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 0.55, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (particles.length > 0) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawnTime < 28) return;
      lastSpawnTime = now;
      spawnParticles(e.clientX, e.clientY, 1);
    };

    const handlePointerDown = (e: PointerEvent) => {
      spawnParticles(e.clientX, e.clientY, 5);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
};
