import React from 'react';
import { useSiteTheme } from '../themes/siteThemes';

interface MysticalFogOverlayProps {
  moonlightMode?: boolean;
}

/**
 * Lớp sương mù / khói mờ huyền ảo tự động hòa sắc theo Theme hiện tại (hoặc Bạc Ánh Trăng).
 */
export const MysticalFogOverlay: React.FC<MysticalFogOverlayProps> = ({
  moonlightMode = false,
}) => {
  const { activeTheme } = useSiteTheme();

  const primary = moonlightMode ? 'rgba(176, 198, 232, 0.12)' : activeTheme.fogPrimary;
  const secondary = moonlightMode ? 'rgba(220, 233, 252, 0.09)' : activeTheme.fogSecondary;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {/* Dải sương phía trên trái */}
      <div
        className="animate-fog-a absolute -top-[18%] -left-[15%] w-[85vw] max-w-[900px] h-[68vh] rounded-full transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse at center, ${primary} 0%, ${secondary} 45%, transparent 72%)`,
        }}
      />

      {/* Dải khói mờ huyền ảo phía dưới phải */}
      <div
        className="animate-fog-b absolute -bottom-[20%] -right-[12%] w-[90vw] max-w-[960px] h-[72vh] rounded-full transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse at center, ${secondary} 0%, ${primary} 45%, transparent 74%)`,
        }}
      />

      {/* Lớp sương lan nhẹ ở trung tâm */}
      <div
        className="animate-fog-a absolute top-[28%] left-[18%] w-[70vw] max-w-[760px] h-[52vh] rounded-full transition-colors duration-700"
        style={{
          animationDelay: '-14s',
          background: `radial-gradient(ellipse at center, ${primary} 0%, transparent 72%)`,
        }}
      />
    </div>
  );
};
