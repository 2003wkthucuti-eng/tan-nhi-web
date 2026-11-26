import React, { useEffect, useRef } from 'react';
import { useSiteTheme } from '../themes/siteThemes';

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  isStar: boolean;
}

interface GoldenFireworksProps {
  burstKey: number;
  moonlightMode?: boolean;
}

const SILVER_PALETTE = ['#FFFFFF', '#E6F0FC', '#C7D7ED', '#A8BFE0', '#DCE7F7'];

/**
 * Pháo hoa lấp lánh bung tỏa theo sắc màu của Theme đang chọn (hoặc Bạc Ánh Trăng).
 */
export const GoldenFireworks: React.FC<GoldenFireworksProps> = ({
  burstKey,
  moonlightMode = false,
}) => {
  const { activeTheme } = useSiteTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const moonlightRef = useRef(moonlightMode);
  moonlightRef.current = moonlightMode;
  const themePaletteRef = useRef(activeTheme.fireworkPalette);
  themePaletteRef.current = activeTheme.fireworkPalette;

  useEffect(() => {
    if (burstKey <= 0 || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles: FireworkParticle[] = [];
    let rafId: number | null = null;
    const timers: number[] = [];

    const palette = moonlightRef.current ? SILVER_PALETTE : themePaletteRef.current;

    const spawnBurst = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.28;
        const speed = 1.8 + Math.random() * 4.8;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          size: 2.4 + Math.random() * 3.8,
          life: 0,
          maxLife: 48 + Math.random() * 28,
          color: palette[Math.floor(Math.random() * palette.length)],
          isStar: Math.random() > 0.42,
        });
      }
      if (rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const drawStar = (x: number, y: number, r: number, color: string, alpha: number) => {
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

        p.vx *= 0.975;
        p.vy = p.vy * 0.975 + 0.065;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * 0.95;

        if (p.isStar) {
          drawStar(p.x, p.y, p.size * 1.5, p.color, alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (particles.length > 0) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
        ctx.clearRect(0, 0, width, height);
      }
    };

    spawnBurst(width * 0.5, height * 0.36, 36);
    timers.push(
      window.setTimeout(() => spawnBurst(width * 0.28, height * 0.3, 26), 190),
      window.setTimeout(() => spawnBurst(width * 0.72, height * 0.32, 26), 360)
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, width, height);
    };
  }, [burstKey]);

  if (burstKey <= 0) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
    />
  );
};
