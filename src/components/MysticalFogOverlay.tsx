import React from 'react';

/**
 * Lớp sương mù / khói mờ huyền ảo sắc vàng Gold nhẹ chuyển động cực chậm,
 * tối ưu hoàn toàn bằng GPU (chỉ transform và opacity, không gây giật lag trên di động).
 */
export const MysticalFogOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {/* Dải sương vàng ấm phía trên trái */}
      <div
        className="animate-fog-a absolute -top-[18%] -left-[15%] w-[85vw] max-w-[900px] h-[68vh] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.11) 0%, rgba(243, 229, 171, 0.04) 42%, transparent 72%)',
        }}
      />

      {/* Dải khói mờ huyền ảo phía dưới phải */}
      <div
        className="animate-fog-b absolute -bottom-[20%] -right-[12%] w-[90vw] max-w-[960px] h-[72vh] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(243, 229, 171, 0.09) 0%, rgba(186, 145, 42, 0.045) 45%, transparent 74%)',
        }}
      />

      {/* Lớp sương lan nhẹ ở trung tâm */}
      <div
        className="animate-fog-a absolute top-[28%] left-[18%] w-[70vw] max-w-[760px] h-[52vh] rounded-full"
        style={{
          animationDelay: '-14s',
          background:
            'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.065) 0%, rgba(140, 110, 38, 0.025) 48%, transparent 75%)',
        }}
      />
    </div>
  );
};
