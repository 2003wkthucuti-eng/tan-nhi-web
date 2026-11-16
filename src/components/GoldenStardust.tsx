import React from 'react';

interface ParticleSpec {
  id: string;
  left: string;
  top: string;
  size: number;
  kind: 'star' | 'dot';
  duration: string;
  delay: string;
  driftDuration: string;
  opacity: number;
  tone: 'bright' | 'warm';
}

const PARTICLES: ParticleSpec[] = [
  { id: 'p1', left: '8%', top: '16%', size: 12, kind: 'star', duration: '3.8s', delay: '0s', driftDuration: '11s', opacity: 0.75, tone: 'bright' },
  { id: 'p2', left: '18%', top: '72%', size: 4, kind: 'dot', duration: '3.2s', delay: '0.6s', driftDuration: '13s', opacity: 0.6, tone: 'warm' },
  { id: 'p3', left: '26%', top: '28%', size: 9, kind: 'star', duration: '4.4s', delay: '1.2s', driftDuration: '14s', opacity: 0.55, tone: 'warm' },
  { id: 'p4', left: '34%', top: '84%', size: 5, kind: 'dot', duration: '2.9s', delay: '0.4s', driftDuration: '10s', opacity: 0.65, tone: 'bright' },
  { id: 'p5', left: '44%', top: '12%', size: 10, kind: 'star', duration: '4.1s', delay: '1.9s', driftDuration: '12s', opacity: 0.6, tone: 'bright' },
  { id: 'p6', left: '54%', top: '64%', size: 3.5, kind: 'dot', duration: '3.5s', delay: '0.9s', driftDuration: '15s', opacity: 0.5, tone: 'warm' },
  { id: 'p7', left: '64%', top: '22%', size: 13, kind: 'star', duration: '4.6s', delay: '0.3s', driftDuration: '13s', opacity: 0.72, tone: 'bright' },
  { id: 'p8', left: '72%', top: '78%', size: 9, kind: 'star', duration: '3.6s', delay: '2.1s', driftDuration: '11s', opacity: 0.58, tone: 'warm' },
  { id: 'p9', left: '82%', top: '34%', size: 4.5, kind: 'dot', duration: '3.1s', delay: '1.5s', driftDuration: '12s', opacity: 0.68, tone: 'bright' },
  { id: 'p10', left: '91%', top: '18%', size: 11, kind: 'star', duration: '4.2s', delay: '0.8s', driftDuration: '14s', opacity: 0.65, tone: 'warm' },
  { id: 'p11', left: '12%', top: '46%', size: 3.5, kind: 'dot', duration: '3.7s', delay: '2.4s', driftDuration: '12s', opacity: 0.55, tone: 'bright' },
  { id: 'p12', left: '29%', top: '54%', size: 4, kind: 'dot', duration: '4.0s', delay: '1.1s', driftDuration: '16s', opacity: 0.45, tone: 'warm' },
  { id: 'p13', left: '49%', top: '42%', size: 8, kind: 'star', duration: '3.9s', delay: '2.7s', driftDuration: '13s', opacity: 0.5, tone: 'bright' },
  { id: 'p14', left: '68%', top: '48%', size: 4, kind: 'dot', duration: '3.3s', delay: '0.2s', driftDuration: '11s', opacity: 0.6, tone: 'warm' },
  { id: 'p15', left: '88%', top: '66%', size: 10, kind: 'star', duration: '4.5s', delay: '1.7s', driftDuration: '14s', opacity: 0.65, tone: 'bright' },
  { id: 'p16', left: '5%', top: '86%', size: 8, kind: 'star', duration: '3.4s', delay: '1.3s', driftDuration: '12s', opacity: 0.5, tone: 'warm' },
  { id: 'p17', left: '58%', top: '90%', size: 4.5, kind: 'dot', duration: '3.8s', delay: '2.2s', driftDuration: '10s', opacity: 0.62, tone: 'bright' },
  { id: 'p18', left: '94%', top: '88%', size: 4, kind: 'dot', duration: '4.1s', delay: '0.5s', driftDuration: '13s', opacity: 0.55, tone: 'warm' },
];

interface GoldenStardustProps {
  className?: string;
}

/**
 * Hiệu ứng bụi vàng & sao 4 cánh lấp lánh thuần CSS (GPU-accelerated transform + opacity).
 */
export const GoldenStardust: React.FC<GoldenStardustProps> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {PARTICLES.map((p) => {
        const color = p.tone === 'bright' ? '#F3E5AB' : '#D4AF37';
        return (
          <span
            key={p.id}
            className="stardust-drift absolute block"
            style={{
              left: p.left,
              top: p.top,
              animationDuration: p.driftDuration,
              animationDelay: p.delay,
            }}
          >
            {p.kind === 'star' ? (
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 24 24"
                fill="none"
                className="stardust-twinkle block"
                style={{
                  animationDuration: p.duration,
                  animationDelay: p.delay,
                  opacity: p.opacity,
                  filter: `drop-shadow(0 0 6px ${color})`,
                }}
              >
                <path
                  d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6Z"
                  fill={color}
                />
              </svg>
            ) : (
              <span
                className="stardust-twinkle block rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: color,
                  opacity: p.opacity,
                  boxShadow: `0 0 8px 1px ${color}`,
                  animationDuration: p.duration,
                  animationDelay: p.delay,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
};
