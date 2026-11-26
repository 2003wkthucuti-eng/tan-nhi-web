import React, { useId } from 'react';
import { useSiteTheme, type SiteThemeId } from '../themes/siteThemes';

interface BlackCatMascotProps {
  className?: string;
  size?: number;
  variant?: 'hero' | 'badge' | 'companion';
  title?: string;
  themeOverride?: SiteThemeId;
}

/**
 * Linh vật chú mèo của Ngôi Nhà Nhỏ Của Tần Nhi — tự động biến hóa phụ kiện và sắc thái theo Theme đang chọn.
 */
export const BlackCatMascot: React.FC<BlackCatMascotProps> = ({
  className = '',
  size = 64,
  variant = 'hero',
  title,
  themeOverride,
}) => {
  const { themeId: contextThemeId, activeTheme } = useSiteTheme();
  const effectiveThemeId = themeOverride ?? contextThemeId;
  const uid = useId().replace(/:/g, '');
  const strokeId = `catStroke-${uid}`;
  const auraId = `catAura-${uid}`;

  const paletteMap: Record<
    SiteThemeId,
    {
      gradStart: string;
      gradMid: string;
      gradEnd: string;
      bodyFill: string;
      eyeFill: string;
      pupilFill: string;
      noseFill: string;
      auraInner: string;
      auraMid: string;
      starBright: string;
      starWarm: string;
    }
  > = {
    'classic-gold': {
      gradStart: '#F3E5AB',
      gradMid: '#D4AF37',
      gradEnd: '#AA8220',
      bodyFill: '#0D0D13',
      eyeFill: '#F3E5AB',
      pupilFill: '#0B0B0F',
      noseFill: '#D4AF37',
      auraInner: '#F3E5AB',
      auraMid: '#D4AF37',
      starBright: '#F3E5AB',
      starWarm: '#D4AF37',
    },
    'gothic-lily': {
      gradStart: '#F6EAEF',
      gradMid: '#D8A7B1',
      gradEnd: '#9B6573',
      bodyFill: '#0A080D',
      eyeFill: '#F6EAEF',
      pupilFill: '#1A0B12',
      noseFill: '#D8A7B1',
      auraInner: '#F6EAEF',
      auraMid: '#D8A7B1',
      starBright: '#F6EAEF',
      starWarm: '#D8A7B1',
    },
    'velvet-vinyl': {
      gradStart: '#F7EAD9',
      gradMid: '#E2B89B',
      gradEnd: '#8E2034',
      bodyFill: '#18080C',
      eyeFill: '#F7EAD9',
      pupilFill: '#24070D',
      noseFill: '#E2B89B',
      auraInner: '#F7EAD9',
      auraMid: '#A62D42',
      starBright: '#F7EAD9',
      starWarm: '#E2B89B',
    },
    'ink-lily': {
      gradStart: '#E7EFE0',
      gradMid: '#9CAF8E',
      gradEnd: '#5D7051',
      bodyFill: '#0A0D0B',
      eyeFill: '#E7EFE0',
      pupilFill: '#0B120C',
      noseFill: '#9CAF8E',
      auraInner: '#E7EFE0',
      auraMid: '#9CAF8E',
      starBright: '#E7EFE0',
      starWarm: '#9CAF8E',
    },
    'rose-nebula': {
      gradStart: '#FFF4F9',
      gradMid: '#F7A8C8',
      gradEnd: '#D4578D',
      bodyFill: '#2B101E',
      eyeFill: '#FFF4F9',
      pupilFill: '#3B0E24',
      noseFill: '#F7A8C8',
      auraInner: '#FFF0F7',
      auraMid: '#F7A8C8',
      starBright: '#FFF4F9',
      starWarm: '#F7A8C8',
    },
    'celestial-scroll': {
      gradStart: '#E8D29B',
      gradMid: '#8FB9A8',
      gradEnd: '#B54B4B',
      bodyFill: '#120E11',
      eyeFill: '#F5E4B8',
      pupilFill: '#171012',
      noseFill: '#D46B62',
      auraInner: '#E8D29B',
      auraMid: '#8FB9A8',
      starBright: '#E8D29B',
      starWarm: '#8FB9A8',
    },
  };

  const p = paletteMap[effectiveThemeId];
  const resolvedTitle = title ?? activeTheme.mascotLabel;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={resolvedTitle}
    >
      <defs>
        <linearGradient id={strokeId} x1="15" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={p.gradStart} />
          <stop offset="50%" stopColor={p.gradMid} />
          <stop offset="100%" stopColor={p.gradEnd} />
        </linearGradient>
        <radialGradient id={auraId} cx="50%" cy="54%" r="50%">
          <stop offset="0%" stopColor={p.auraInner} stopOpacity="0.34" />
          <stop offset="52%" stopColor={p.auraMid} stopOpacity="0.16" />
          <stop offset="100%" stopColor={p.auraMid} stopOpacity="0" />
        </radialGradient>
      </defs>

      {variant !== 'badge' && (
        <circle cx="60" cy="60" r="56" fill={`url(#${auraId})`} />
      )}

      {/* Họa tiết nền riêng theo từng theme cho bản hero & companion */}
      {variant !== 'badge' && effectiveThemeId === 'classic-gold' && (
        <>
          <g aria-hidden="true">
            <path
              d="M22 28L23.6 33.4L29 35L23.6 36.6L22 42L20.4 36.6L15 35L20.4 33.4Z"
              fill={p.starBright}
              className="animate-cat-star-1"
            />
            <path
              d="M99 42L100.2 45.8L104 47L100.2 48.2L99 52L97.8 48.2L94 47L97.8 45.8Z"
              fill={p.starWarm}
              className="animate-cat-star-2"
            />
            <path
              d="M24 78L25 81L28 82L25 83L24 86L23 83L20 82L23 81Z"
              fill={p.starBright}
              className="animate-cat-star-3"
            />
          </g>
          <path
            d="M84 23C74 16 59 17 50 26C62 24 75 31 80 43C85 37 87 29 84 23Z"
            stroke={`url(#${strokeId})`}
            strokeWidth="1.4"
            strokeOpacity="0.65"
            fill={p.starWarm}
            fillOpacity="0.08"
          />
        </>
      )}

      {/* Gothic Lily & Ribbon: Cánh hoa loa kèn & ren gothic phía sau */}
      {variant !== 'badge' && effectiveThemeId === 'gothic-lily' && (
        <g aria-hidden="true">
          <circle
            cx="60"
            cy="52"
            r="38"
            stroke="#D8A7B1"
            strokeOpacity="0.32"
            strokeWidth="1.1"
            strokeDasharray="2.5 3.5"
          />
          <path
            d="M21 31C24 27 28 29 27 34C25 36 22 35 21 31Z"
            fill="#F6EAEF"
            fillOpacity="0.72"
            className="animate-cat-star-1"
          />
          <path
            d="M99 36C96 32 92 34 93 39C95 41 98 40 99 36Z"
            fill="#D8A7B1"
            fillOpacity="0.8"
            className="animate-cat-star-2"
          />
          <path
            d="M23 77L24.2 80.5L27.5 81.5L24.2 82.5L23 86L21.8 82.5L18.5 81.5L21.8 80.5Z"
            fill="#F6EAEF"
            className="animate-cat-star-3"
          />
        </g>
      )}

      {/* Velvet & Vinyl: Đĩa than cổ điển phía sau đầu mèo & nốt nhạc bay */}
      {variant !== 'badge' && effectiveThemeId === 'velvet-vinyl' && (
        <g aria-hidden="true">
          <circle cx="60" cy="48" r="35" fill="#0B0406" fillOpacity="0.65" stroke="#8E2034" strokeWidth="1.4" strokeOpacity="0.6" />
          <circle cx="60" cy="48" r="29" stroke="#F7EAD9" strokeWidth="0.7" strokeOpacity="0.22" strokeDasharray="12 6" />
          <circle cx="60" cy="48" r="23" stroke="#E2B89B" strokeWidth="0.6" strokeOpacity="0.24" />
          {/* Nốt nhạc móc đơn nhảy nhẹ */}
          <g className="animate-cat-star-1" fill="#F7EAD9">
            <circle cx="22" cy="36" r="2.3" />
            <path d="M24 36V25L29 27V30L24 28.2" stroke="#F7EAD9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g className="animate-cat-star-2" fill="#E2B89B">
            <circle cx="96" cy="47" r="2.1" />
            <path d="M98 47V37.5L102 39" stroke="#E2B89B" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* Ink Lily & Seal: Vòng tròn thủy mặc & dấu ấn đỏ son nhỏ */}
      {variant !== 'badge' && effectiveThemeId === 'ink-lily' && (
        <g aria-hidden="true">
          <circle
            cx="60"
            cy="52"
            r="39"
            stroke="#9CAF8E"
            strokeOpacity="0.4"
            strokeWidth="1.3"
            strokeDasharray="24 6 4 6"
          />
          <rect x="92" y="25" width="9" height="12" rx="1.5" fill="#8C2E2B" fillOpacity="0.82" stroke="#E7EFE0" strokeOpacity="0.45" strokeWidth="0.7" />
          <path d="M94.5 28.5H98.5M96.5 28.5V34M94.5 32H98.5" stroke="#F2E7D5" strokeWidth="0.9" strokeLinecap="round" />
          <path
            d="M21 38C25 34 29 35 28 39C26 42 22 41 21 38Z"
            fill="#E7EFE0"
            fillOpacity="0.65"
            className="animate-cat-star-1"
          />
        </g>
      )}

      {/* Rose Nebula: Quỹ đạo tinh vân & các ngôi sao trắng/hồng lấp lánh */}
      {variant !== 'badge' && effectiveThemeId === 'rose-nebula' && (
        <g aria-hidden="true">
          <ellipse
            cx="60"
            cy="55"
            rx="43"
            ry="22"
            transform="rotate(-14 60 55)"
            stroke="#F7A8C8"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            strokeDasharray="6 4"
          />
          <path
            d="M20 34L22 39.5L27.5 41.5L22 43.5L20 49L18 43.5L12.5 41.5L18 39.5Z"
            fill="#FFF4F9"
            className="animate-cat-star-1"
          />
          <path
            d="M99 39L100.5 43L104.5 44.5L100.5 46L99 50L97.5 46L93.5 44.5L97.5 43Z"
            fill="#F7A8C8"
            className="animate-cat-star-2"
          />
          <circle cx="25" cy="80" r="2.2" fill="#FFF4F9" className="animate-cat-star-3" />
        </g>
      )}

      {/* Celestial Scroll: Vòng hào quang nhật nguyệt & vân mây cổ phong */}
      {variant !== 'badge' && effectiveThemeId === 'celestial-scroll' && (
        <g aria-hidden="true">
          <circle cx="60" cy="48" r="34" stroke="#E8D29B" strokeOpacity="0.55" strokeWidth="1.5" />
          <circle cx="60" cy="48" r="39" stroke="#8FB9A8" strokeOpacity="0.38" strokeWidth="1" strokeDasharray="4 4" />
          {/* Tia nhật luân trên đỉnh vòng quang */}
          <path
            d="M60 9V14M44 13L46.5 17M76 13L73.5 17M31 24L35 27M89 24L85 27"
            stroke="#E8D29B"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeOpacity="0.72"
          />
          <path
            d="M17 77C21 73 27 73 30 77C33 74 37 75 38 78"
            stroke="#8FB9A8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
          <path
            d="M84 79C87 75 93 75 96 79"
            stroke="#E8D29B"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
        </g>
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
        fill={p.bodyFill}
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

      {/* Vòng cổ & phụ kiện cổ riêng theo từng theme */}
      {effectiveThemeId === 'gothic-lily' ? (
        /* Nơ ren hồng tro nổi bật ở cổ mèo */
        <g aria-hidden="true">
          <path d="M47 62C54 65 66 65 73 62" stroke="#D8A7B1" strokeWidth="1.8" strokeLinecap="round" />
          {/* Cánh nơ trái & phải viền ren */}
          <path
            d="M58 65L45 59C43.5 63.5 44 69 47 72L58 67Z"
            fill="#B77D8B"
            stroke="#F6EAEF"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M62 65L75 59C76.5 63.5 76 69 73 72L62 67Z"
            fill="#B77D8B"
            stroke="#F6EAEF"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Dải ruy-băng rủ xuống */}
          <path d="M58 68L53 79L57 77L59 68Z" fill="#D8A7B1" stroke="#F6EAEF" strokeWidth="0.9" />
          <path d="M62 68L67 79L63 77L61 68Z" fill="#D8A7B1" stroke="#F6EAEF" strokeWidth="0.9" />
          <circle cx="60" cy="66" r="3" fill="#F6EAEF" stroke="#9B6573" strokeWidth="1.1" />
        </g>
      ) : effectiveThemeId === 'ink-lily' ? (
        /* Nút thắt đồng tâm & tua rua ngọc rêu cổ phong */
        <g aria-hidden="true">
          <path d="M47 62C54 66 66 66 73 62" stroke="#9CAF8E" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="57.2" y="64.5" width="5.6" height="5.6" transform="rotate(45 60 67.3)" fill="#617454" stroke="#E7EFE0" strokeWidth="1" />
          <path d="M60 71.5V82M58 73L57 81M62 73L63 81" stroke="#9CAF8E" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="60" cy="67.3" r="1.4" fill="#E7EFE0" />
        </g>
      ) : effectiveThemeId === 'celestial-scroll' ? (
        /* Dải lụa mây ngọc & ngọc bội đỏ son */
        <g aria-hidden="true">
          <path d="M46 62C54 67 66 67 74 62" stroke="#8FB9A8" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M48 64C42 70 40 76 44 82" stroke="#8FB9A8" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.85" />
          <path d="M72 64C78 70 80 76 76 82" stroke="#E8D29B" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.85" />
          <circle cx="60" cy="67.5" r="3.4" fill="#B54B4B" stroke="#E8D29B" strokeWidth="1.3" />
        </g>
      ) : (
        /* Vòng cổ mảnh & chuông / mặt dây chuyền */
        <>
          <path
            d="M47 62C54 66 66 66 73 62"
            stroke={`url(#${strokeId})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="67"
            r="2.9"
            fill={effectiveThemeId === 'velvet-vinyl' ? '#8E2034' : p.eyeFill}
            stroke={effectiveThemeId === 'velvet-vinyl' ? '#F7EAD9' : 'none'}
            strokeWidth={effectiveThemeId === 'velvet-vinyl' ? '1.1' : undefined}
          />
        </>
      )}

      {/* Đầu mèo & đôi tai nhọn tinh nghịch */}
      <path
        d="M38 45L36 25L50 35C56 33 64 33 70 35L84 25L82 45C84 54 76 63 60 63C44 63 36 54 38 45Z"
        fill={p.bodyFill}
        stroke={`url(#${strokeId})`}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Lòng tai */}
      <path d="M40 40L39.5 31L46.5 36.5" stroke={p.gradMid} strokeWidth="1.2" strokeOpacity="0.72" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 40L80.5 31L73.5 36.5" stroke={p.gradMid} strokeWidth="1.2" strokeOpacity="0.72" strokeLinecap="round" strokeLinejoin="round" />

      {/* Velvet & Vinyl: Tai nghe đỏ đô - kem cổ điển chụp lên đầu mèo */}
      {effectiveThemeId === 'velvet-vinyl' && (
        <g aria-hidden="true">
          {/* Quai tai nghe uốn vòng qua đỉnh đầu */}
          <path
            d="M34 44C33 27 45 19 60 19C75 19 87 27 86 44"
            stroke="#F7EAD9"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M34 44C33 27 45 19 60 19C75 19 87 27 86 44"
            stroke="#7B182A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Chụp tai trái */}
          <rect x="29" y="40" width="9.5" height="15.5" rx="4.5" fill="#7B182A" stroke="#F7EAD9" strokeWidth="1.4" />
          <line x1="33.8" y1="44" x2="33.8" y2="51.5" stroke="#E2B89B" strokeWidth="1.1" strokeLinecap="round" />
          {/* Chụp tai phải */}
          <rect x="81.5" y="40" width="9.5" height="15.5" rx="4.5" fill="#7B182A" stroke="#F7EAD9" strokeWidth="1.4" />
          <line x1="86.2" y1="44" x2="86.2" y2="51.5" stroke="#E2B89B" strokeWidth="1.1" strokeLinecap="round" />
        </g>
      )}

      {/* Rose Nebula: Vương miện ngôi sao nhỏ lấp lánh trên trán */}
      {effectiveThemeId === 'rose-nebula' && (
        <g aria-hidden="true">
          <path
            d="M52 33L54 25L57.5 29L60 22.5L62.5 29L66 25L68 33Z"
            fill="#F7A8C8"
            stroke="#FFF4F9"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <circle cx="60" cy="22" r="1.4" fill="#FFF4F9" />
        </g>
      )}

      {/* Đôi mắt biểu cảm chớp nhẹ */}
      <g className="animate-cat-eye">
        <ellipse cx="50.5" cy="48" rx="3.4" ry="4.2" fill={p.eyeFill} />
        <ellipse cx="50.8" cy="48" rx="1.1" ry="2.8" fill={p.pupilFill} />
        {effectiveThemeId === 'rose-nebula' ? (
          <path d="M50.5 45.2L51.1 47.4L53.3 48L51.1 48.6L50.5 50.8L49.9 48.6L47.7 48L49.9 47.4Z" fill="#FFF4F9" />
        ) : (
          <circle cx="49.5" cy="46.5" r="0.9" fill="#FFFFFF" fillOpacity="0.9" />
        )}
      </g>
      <g className="animate-cat-eye">
        <ellipse cx="69.5" cy="48" rx="3.4" ry="4.2" fill={p.eyeFill} />
        <ellipse cx="69.8" cy="48" rx="1.1" ry="2.8" fill={p.pupilFill} />
        {effectiveThemeId === 'rose-nebula' ? (
          <path d="M69.5 45.2L70.1 47.4L72.3 48L70.1 48.6L69.5 50.8L68.9 48.6L66.7 48L68.9 47.4Z" fill="#FFF4F9" />
        ) : (
          <circle cx="68.5" cy="46.5" r="0.9" fill="#FFFFFF" fillOpacity="0.9" />
        )}
      </g>

      {/* Rose Nebula: Má hồng dịu dàng */}
      {effectiveThemeId === 'rose-nebula' && (
        <g aria-hidden="true">
          <ellipse cx="43.5" cy="53" rx="2.6" ry="1.4" fill="#F7A8C8" fillOpacity="0.45" />
          <ellipse cx="76.5" cy="53" rx="2.6" ry="1.4" fill="#F7A8C8" fillOpacity="0.45" />
        </g>
      )}

      {/* Mũi nhỏ & nét miệng mỉm */}
      <path d="M58.5 53.5H61.5L60 55.2L58.5 53.5Z" fill={p.noseFill} />
      <path
        d="M56.5 56.5C58 57.8 59.5 57.5 60 56C60.5 57.5 62 57.8 63.5 56.5"
        stroke={p.gradMid}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ria mép thanh mảnh */}
      <path
        d="M35 49L43 50.5M34 53.5L43 53M85 49L77 50.5M86 53.5L77 53"
        stroke={p.gradMid}
        strokeWidth="1.1"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
};
