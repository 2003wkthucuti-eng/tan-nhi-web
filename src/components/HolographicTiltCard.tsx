import React, { useRef } from 'react';

interface HolographicTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  disableTilt?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Thẻ nghiêng 3D theo góc chạm/di chuột kết hợp lớp phản chiếu ánh kim (Holographic Foil).
 * Cập nhật trực tiếp biến CSS trên DOM để không gây re-render React, đảm bảo 60fps trên di động.
 */
export const HolographicTiltCard: React.FC<HolographicTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 7,
  disableTilt = false,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const updateTilt = (clientX: number, clientY: number) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    const rotateY = disableTilt ? 0 : (px - 0.5) * (maxTilt * 2);
    const rotateX = disableTilt ? 0 : (0.5 - py) * (maxTilt * 2);

    el.setAttribute('data-tilting', 'true');
    el.style.setProperty('--tilt-rx', `${rotateX.toFixed(2)}deg`);
    el.style.setProperty('--tilt-ry', `${rotateY.toFixed(2)}deg`);
    el.style.setProperty('--foil-x', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--foil-y', `${(py * 100).toFixed(1)}%`);
    el.style.setProperty('--foil-opacity', '1');
  };

  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.removeAttribute('data-tilting');
    el.style.setProperty('--tilt-rx', '0deg');
    el.style.setProperty('--tilt-ry', '0deg');
    el.style.setProperty('--foil-opacity', '0');
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={(e) => updateTilt(e.clientX, e.clientY)}
      onPointerDown={(e) => updateTilt(e.clientX, e.clientY)}
      onPointerUp={resetTilt}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      onClick={onClick}
      className={`tilt-3d-card relative ${className}`}
    >
      {children}
      <div aria-hidden="true" className="holo-foil-layer z-20" />
    </div>
  );
};
