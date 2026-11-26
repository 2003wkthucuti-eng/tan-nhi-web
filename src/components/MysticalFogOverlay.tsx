import React from 'react';

interface MysticalFogOverlayProps {
  moonlightMode?: boolean;
}

/**
 * Lớp sương mù / khói mờ huyền ảo sắc vàng Gold (hoặc Bạc Ánh Trăng) chuyển động cực chậm,
 * tối ưu hoàn toàn bằng GPU (chỉ transform và opacity, không gây giật lag trên di động).
 */
export const MysticalFogOverlay: React.FC<MysticalFogOverlayProps> = ({
  moonlightMode = false,
}) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {/* Dải sương phía trên trái */}
      <div
        className="animate-fog-a absolute -top-[18%] -left-[15%] w-[85vw] max-w-[900px] h-[68vh] rounded-full transition-colors duration-700"
        style={{
          background: moonlightMode
            ? 'radial-gradient(ellipse at center, rgba(176, 198, 232, 0.12) 0%, rgba(226, 238, 255, 0.05) 42%, transparent 72%)'
            : 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.11) 0%, rgba(243, 229, 171, 0.04) 42%, transparent 72%)',
        }}
      />

      {/* Dải khói mờ huyền ảo phía dưới phải */}
      <div
        className="animate-fog-b absolute -bottom-[20%] -right-[12%] w-[90vw] max-w-[960px] h-[72vh] rounded-full transition-colors duration-700"
        style={{
          background: moonlightMode
            ? 'radial-gradient(ellipse at center, rgba(220, 233, 252, 0.09) 0%, rgba(142, 166, 206, 0.05) 45%, transparent 74%)'
            : 'radial-gradient(ellipse at center, rgba(243, 229, 171, 0.09) 0%, rgba(186, 145, 42, 0.045) 45%, transparent 74%)',
        }}
      />

      {/* Lớp sương lan nhẹ ở trung tâm */}
      <div
        className="animate-fog-a absolute top-[28%] left-[18%] w-[70vw] max-w-[760px] h-[52vh] rounded-full transition-colors duration-700"
        style={{
          animationDelay: '-14s',
          background: moonlightMode
            ? 'radial-gradient(ellipse at center, rgba(176, 198, 232, 0.07) 0%, rgba(118, 142, 178, 0.03) 48%, transparent 75%)'
            : 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.065) 0%, rgba(140, 110, 38, 0.025) 48%, transparent 75%)',
        }}
      />
    </div>
  );
};

