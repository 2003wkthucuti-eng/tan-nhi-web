import React, { useId } from 'react';

interface BlackCatMascotProps {
  className?: string;
  size?: number;
  variant?: 'hero' | 'badge' | 'companion';
  title?: string;
}

/**
 * Linh vật chú mèo đen tối giản với ánh mắt và đường viền vàng Gold ánh kim.
 */
export const BlackCatMascot: React.FC<BlackCatMascotProps> = ({
  className = '',
  size = 64,
  variant = 'hero',
  title = 'Chú mèo đen của Tần Nhi',
}) => {
  const uid = useId().replace(/:/g, '');
  const strokeId = `goldStroke-${uid}`;
  const auraId = `goldAura-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={strokeId} x1="15" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA8220" />
        </linearGradient>
        <radialGradient id={auraId} cx="50%" cy="54%" r="50%">
          <stop offset="0%" stopColor="#F3E5AB" stopOpacity="0.34" />
          <stop offset="52%" stopColor="#D4AF37" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {variant !== 'badge' && (
        <circle cx="60" cy="60" r="56" fill={`url(#${auraId})`} />
      )}

      {/* 3 ngôi sao nhỏ nhấp nháy quanh mèo đen */}
      {variant !== 'badge' && (
        <g aria-hidden="true">
          <path
            d="M22 28L23.6 33.4L29 35L23.6 36.6L22 42L20.4 36.6L15 35L20.4 33.4Z"
            fill="#F3E5AB"
            className="animate-cat-star-1"
          />
          <path
            d="M99 42L100.2 45.8L104 47L100.2 48.2L99 52L97.8 48.2L94 47L97.8 45.8Z"
            fill="#D4AF37"
            className="animate-cat-star-2"
          />
          <path
            d="M24 78L25 81L28 82L25 83L24 86L23 83L20 82L23 81Z"
            fill="#F3E5AB"
            className="animate-cat-star-3"
          />
        </g>
      )}

      {/* Mặt trăng khuyết mảnh phía sau cho bản hero & companion */}
      {variant !== 'badge' && (
        <path
          d="M84 23C74 16 59 17 50 26C62 24 75 31 80 43C85 37 87 29 84 23Z"
          stroke={`url(#${strokeId})`}
          strokeWidth="1.4"
          strokeOpacity="0.65"
          fill="#D4AF37"
          fillOpacity="0.08"
        />
      )}

      {/* Đuôi mèo uốn cong đung đưa mềm mại */}
      <path
        d="M77 95C91 95 101 86 101 75C101 66 93 62 90 67C88 71 92 75 93 78"
        stroke={`url(#${strokeId})`}
        strokeWidth="3.2"
        strokeLinecap="round"
        className="animate-cat-tail"
      />

      {/* Thân mèo ngồi */}
      <path
        d="M39 97C37 81 42 66 48 61H72C78 66 83 81 81 97C72 100 48 100 39 97Z"
        fill="#0D0D13"
        stroke={`url(#${strokeId})`}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Hai chân trước nhỏ nhắn */}
      <path
        d="M53 84V98M67 84V98"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />

      {/* Vòng cổ vàng mảnh và chuông nhỏ */}
      <path
        d="M47 62C54 66 66 66 73 62"
        stroke={`url(#${strokeId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="67" r="2.8" fill="#F3E5AB" />

      {/* Đầu mèo & đôi tai nhọn tinh nghịch */}
      <path
        d="M38 45L36 25L50 35C56 33 64 33 70 35L84 25L82 45C84 54 76 63 60 63C44 63 36 54 38 45Z"
        fill="#0D0D13"
        stroke={`url(#${strokeId})`}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Lòng tai ánh vàng nhẹ */}
      <path d="M40 40L39.5 31L46.5 36.5" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.65" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 40L80.5 31L73.5 36.5" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.65" strokeLinecap="round" strokeLinejoin="round" />

      {/* Đôi mắt vàng ánh kim bí ẩn chớp nhẹ */}
      <g className="animate-cat-eye">
        <ellipse cx="50.5" cy="48" rx="3.4" ry="4.2" fill="#F3E5AB" />
        <ellipse cx="50.8" cy="48" rx="1.1" ry="2.8" fill="#0B0B0F" />
        <circle cx="49.5" cy="46.5" r="0.9" fill="#FFFFFF" fillOpacity="0.9" />
      </g>
      <g className="animate-cat-eye">
        <ellipse cx="69.5" cy="48" rx="3.4" ry="4.2" fill="#F3E5AB" />
        <ellipse cx="69.8" cy="48" rx="1.1" ry="2.8" fill="#0B0B0F" />
        <circle cx="68.5" cy="46.5" r="0.9" fill="#FFFFFF" fillOpacity="0.9" />
      </g>

      {/* Mũi nhỏ & nét miệng mỉm */}
      <path d="M58.5 53.5H61.5L60 55.2L58.5 53.5Z" fill="#D4AF37" />
      <path
        d="M56.5 56.5C58 57.8 59.5 57.5 60 56C60.5 57.5 62 57.8 63.5 56.5"
        stroke="#D4AF37"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ria mép thanh mảnh */}
      <path
        d="M35 49L43 50.5M34 53.5L43 53M85 49L77 50.5M86 53.5L77 53"
        stroke="#D4AF37"
        strokeWidth="1.1"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
};
