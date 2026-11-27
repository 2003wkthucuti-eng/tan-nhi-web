import React from 'react';
import { useSiteTheme } from '../themes/siteThemes';

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

const WITCHING_EXTRA_PARTICLES: ParticleSpec[] = [
  { id: 'w1', left: '14%', top: '24%', size: 6, kind: 'dot', duration: '2.7s', delay: '0.2s', driftDuration: '9s', opacity: 0.85, tone: 'bright' },
  { id: 'w2', left: '38%', top: '36%', size: 11, kind: 'star', duration: '3.2s', delay: '1.1s', driftDuration: '11s', opacity: 0.78, tone: 'bright' },
  { id: 'w3', left: '61%', top: '14%', size: 5.5, kind: 'dot', duration: '2.8s', delay: '0.7s', driftDuration: '10s', opacity: 0.82, tone: 'warm' },
  { id: 'w4', left: '76%', top: '52%', size: 12, kind: 'star', duration: '3.5s', delay: '1.8s', driftDuration: '12s', opacity: 0.8, tone: 'bright' },
  { id: 'w5', left: '22%', top: '62%', size: 5.5, kind: 'dot', duration: '3.0s', delay: '0.4s', driftDuration: '11s', opacity: 0.78, tone: 'warm' },
  { id: 'w6', left: '47%', top: '76%', size: 10, kind: 'star', duration: '3.4s', delay: '2.0s', driftDuration: '10s', opacity: 0.75, tone: 'bright' },
  { id: 'w7', left: '84%', top: '82%', size: 6, kind: 'dot', duration: '2.6s', delay: '1.3s', driftDuration: '9.5s', opacity: 0.85, tone: 'bright' },
  { id: 'w8', left: '9%', top: '58%', size: 9, kind: 'star', duration: '3.3s', delay: '0.9s', driftDuration: '12.5s', opacity: 0.72, tone: 'warm' },
];

interface GoldenStardustProps {
  className?: string;
  witchingHour?: boolean;
  moonlightMode?: boolean;
}

/**
 * Hiệu ứng hạt bay & ánh sáng đồng bộ theo Theme (sao, cánh hoa, nốt nhạc, lá thủy mặc hoặc bụi sao cổ phong).
 */
export const GoldenStardust: React.FC<GoldenStardustProps> = ({
  className = '',
  witchingHour = false,
  moonlightMode = false,
}) => {
  const { activeTheme } = useSiteTheme();
  const activeParticles = witchingHour
    ? [...PARTICLES, ...WITCHING_EXTRA_PARTICLES]
    : PARTICLES;

  const shapeKind = moonlightMode ? 'star' : activeTheme.particleKind;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700 ${className}`}
    >
      {activeParticles.map((p) => {
        const color = moonlightMode
          ? p.tone === 'bright'
            ? '#E8F1FD'
            : '#A9BFE0'
          : p.tone === 'bright'
          ? activeTheme.particleColors[0]
          : activeTheme.particleColors[1];
        const effectiveOpacity = witchingHour ? Math.min(0.95, p.opacity + 0.16) : p.opacity;

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
                  opacity: effectiveOpacity,
                  filter: `drop-shadow(0 0 ${witchingHour ? 9 : 6}px ${color})`,
                }}
              >
                {shapeKind === 'petal' ? (
                  <path
                    d="M12 2C16.5 5.5 18 12.5 12 22C6 12.5 7.5 5.5 12 2Z"
                    fill={color}
                  />
                ) : shapeKind === 'note' ? (
                  <path
                    d="M10 17.5A3.2 3.2 0 1 1 8.5 12.2V4.5L18 2.5V6.5L11.2 8V17.5Z"
                    fill={color}
                  />
                ) : shapeKind === 'leaf' ? (
                  <path
                    d="M20 4C11 5 5 11 4 20C13 19 19 13 20 4Z"
                    fill={color}
                  />
                ) : shapeKind === 'celestial' ? (
                  <path
                    d="M12 1L14.5 9L22.5 12L14.5 15L12 23L9.5 15L1.5 12L9.5 9Z"
                    fill={color}
                  />
                ) : shapeKind === 'bubble' ? (
                  <g>
                    <circle
                      cx="12"
                      cy="12"
                      r="8.5"
                      stroke={color}
                      strokeWidth="1.6"
                      fill={color}
                      fillOpacity="0.14"
                    />
                    <path
                      d="M8.2 9.2C9.1 7.6 10.6 6.8 12.2 6.8"
                      stroke="#FFFFFF"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeOpacity="0.85"
                    />
                  </g>
                ) : shapeKind === 'jellyfish' ? (
                  <g>
                    <path
                      d="M5 12C5 7.6 8.1 4.5 12 4.5C15.9 4.5 19 7.6 19 12H5Z"
                      fill={color}
                      fillOpacity="0.72"
                    />
                    <path
                      d="M8 12.5C7.2 15.5 8.8 18 7.8 20.5M12 12.5C12.4 16 11.4 18.5 12 21.5M16 12.5C16.8 15.5 15.2 18 16.2 20.5"
                      stroke={color}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </g>
                ) : shapeKind === 'pixel-heart' ? (
                  <path
                    d="M5 6H9V8H11V10H13V8H15V6H19V8H21V13H19V15H17V17H15V19H13V21H11V19H9V17H7V15H5V13H3V8H5V6Z"
                    fill={color}
                  />
                ) : shapeKind === 'lightning' ? (
                  <path
                    d="M13.5 1.5L4.5 13H11L9.5 22.5L19.5 10.5H13L13.5 1.5Z"
                    fill={color}
                  />
                ) : shapeKind === 'noir-star' ? (
                  <path
                    d="M12 0L13.8 10.2L24 12L13.8 13.8L12 24L10.2 13.8L0 12L10.2 10.2Z"
                    fill={color}
                  />
                ) : (
                  <path
                    d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6Z"
                    fill={color}
                  />
                )}
              </svg>
            ) : (
              <span
                className="stardust-twinkle block rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: color,
                  opacity: effectiveOpacity,
                  boxShadow: `0 0 ${witchingHour ? 13 : 8}px ${witchingHour ? 2 : 1}px ${color}`,
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
