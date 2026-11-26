import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { SiteThemeDefinition } from '../themes/siteThemes';

export interface ThemeTransitionOrigin {
  x: number;
  y: number;
}

export interface ThemeTransitionState {
  key: number;
  theme: SiteThemeDefinition;
  origin: ThemeTransitionOrigin;
}

interface ThemeLiquidTransitionProps {
  transition: ThemeTransitionState | null;
  onComplete: (key: number) => void;
}

/**
 * Hiệu ứng chuyển tiếp loang màu như giọt màu / mực tan trong nước mỗi khi đổi Theme.
 * Luôn bật pointer-events-none và tự động gỡ bỏ sau khi hoàn tất để không che hay làm chậm thao tác.
 */
export const ThemeLiquidTransition: React.FC<ThemeLiquidTransitionProps> = ({
  transition,
  onComplete,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!transition) return;
    const timeoutMs = prefersReducedMotion ? 160 : 940;
    const timer = window.setTimeout(() => {
      onComplete(transition.key);
    }, timeoutMs);
    return () => window.clearTimeout(timer);
  }, [transition, prefersReducedMotion, onComplete]);

  if (!transition || typeof window === 'undefined') return null;

  const { key, theme, origin } = transition;
  const vw = window.innerWidth || 1280;
  const vh = window.innerHeight || 800;
  const ox = Number.isFinite(origin.x) ? origin.x : vw / 2;
  const oy = Number.isFinite(origin.y) ? origin.y : vh / 2;

  const maxRadius = Math.hypot(Math.max(ox, vw - ox), Math.max(oy, vh - oy));
  const washDiameter = Math.ceil(maxRadius * 2.24);
  const ringDiameter = Math.ceil(maxRadius * 2.36);

  if (prefersReducedMotion) {
    return (
      <div
        key={`liquid-reduced-${key}`}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[120]"
        style={{
          background: `radial-gradient(circle at ${ox}px ${oy}px, ${theme.accentColor}2E 0%, ${theme.bgColor}24 65%, transparent 100%)`,
        }}
      />
    );
  }

  return (
    <div
      key={`liquid-transition-${key}`}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120] overflow-hidden select-none"
    >
      {/* Lớp loang màu hòa tan chủ đạo xuất phát từ tọa độ nút vừa chọn */}
      <motion.div
        initial={{ scale: 0.025, opacity: 0.9 }}
        animate={{ scale: 1, opacity: [0.9, 0.78, 0.34, 0] }}
        transition={{
          duration: 0.86,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.34, 0.72, 1],
        }}
        style={{
          position: 'fixed',
          left: ox,
          top: oy,
          width: washDiameter,
          height: washDiameter,
          marginLeft: -washDiameter / 2,
          marginTop: -washDiameter / 2,
          borderRadius: '9999px',
          willChange: 'transform, opacity',
          background: `radial-gradient(circle,
            ${theme.swatchFrom}A8 0%,
            ${theme.accentColor}88 36%,
            ${theme.swatchTo}62 64%,
            ${theme.brightColor}4A 82%,
            ${theme.accentColor}1E 92%,
            transparent 100%)`,
        }}
      />

      {/* Ánh viền mờ nhẹ ở rìa vòng loang tạo cảm giác mực khuếch tán trong nước */}
      <motion.div
        initial={{ scale: 0.02, opacity: 0.88 }}
        animate={{ scale: 1.04, opacity: [0.88, 0.68, 0.24, 0] }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
          times: [0, 0.38, 0.75, 1],
        }}
        style={{
          position: 'fixed',
          left: ox,
          top: oy,
          width: ringDiameter,
          height: ringDiameter,
          marginLeft: -ringDiameter / 2,
          marginTop: -ringDiameter / 2,
          borderRadius: '9999px',
          willChange: 'transform, opacity',
          background: `radial-gradient(circle,
            transparent 58%,
            ${theme.accentColor}4A 76%,
            ${theme.brightColor}8C 88%,
            ${theme.accentColor}2E 95%,
            transparent 100%)`,
        }}
      />

      {/* Giọt màu đậm nở sáng nhẹ ngay tâm điểm chạm */}
      <motion.div
        initial={{ scale: 0.16, opacity: 0.95 }}
        animate={{ scale: 2.35, opacity: 0 }}
        transition={{
          duration: 0.52,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: 'fixed',
          left: ox,
          top: oy,
          width: 220,
          height: 220,
          marginLeft: -110,
          marginTop: -110,
          borderRadius: '9999px',
          willChange: 'transform, opacity',
          background: `radial-gradient(circle, ${theme.brightColor}CC 0%, ${theme.accentColor}75 42%, transparent 74%)`,
        }}
      />
    </div>
  );
};
