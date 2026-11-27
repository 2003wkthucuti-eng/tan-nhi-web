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
    'thuy-mac': {
      gradStart: '#EEF2F5',
      gradMid: '#A9B4C0',
      gradEnd: '#545F6B',
      bodyFill: '#0B0C0E',
      eyeFill: '#DDE5EC',
      pupilFill: '#0A0C0F',
      noseFill: '#8E99A6',
      auraInner: '#EEF2F5',
      auraMid: '#A9B4C0',
      starBright: '#EEF2F5',
      starWarm: '#A9B4C0',
    },
    'co-phong-tram': {
      gradStart: '#EFE4CA',
      gradMid: '#67C4A7',
      gradEnd: '#9B2938',
      bodyFill: '#14090B',
      eyeFill: '#7FE3C3',
      pupilFill: '#16080B',
      noseFill: '#C84B59',
      auraInner: '#EFE4CA',
      auraMid: '#67C4A7',
      starBright: '#EFE4CA',
      starWarm: '#67C4A7',
    },
    'dem-xanh': {
      gradStart: '#E8F6FF',
      gradMid: '#7EC8F2',
      gradEnd: '#2F6FB3',
      bodyFill: '#0A152B',
      eyeFill: '#E8F6FF',
      pupilFill: '#0B2347',
      noseFill: '#7EC8F2',
      auraInner: '#E8F6FF',
      auraMid: '#7EC8F2',
      starBright: '#E8F6FF',
      starWarm: '#7EC8F2',
    },
    'bong-bong-sua': {
      gradStart: '#EBF8FF',
      gradMid: '#8FD4EC',
      gradEnd: '#4A96BF',
      bodyFill: '#0A1A28',
      eyeFill: '#EBF8FF',
      pupilFill: '#0A263C',
      noseFill: '#8FD4EC',
      auraInner: '#EBF8FF',
      auraMid: '#8FD4EC',
      starBright: '#EBF8FF',
      starWarm: '#8FD4EC',
    },
    'collage-hai-be': {
      gradStart: '#F6F0E4',
      gradMid: '#D6D9E2',
      gradEnd: '#7E8294',
      bodyFill: '#141319',
      eyeFill: '#F6F0E4',
      pupilFill: '#1B1822',
      noseFill: '#DF95A5',
      auraInner: '#F6F0E4',
      auraMid: '#DF95A5',
      starBright: '#F6F0E4',
      starWarm: '#DF95A5',
    },
    'bien-dem-sua': {
      gradStart: '#E2F2FF',
      gradMid: '#6CB6FF',
      gradEnd: '#2B629D',
      bodyFill: '#081526',
      eyeFill: '#D4EEFF',
      pupilFill: '#05152C',
      noseFill: '#6CB6FF',
      auraInner: '#E2F2FF',
      auraMid: '#6CB6FF',
      starBright: '#E2F2FF',
      starWarm: '#6CB6FF',
    },
    'bao-cu-nhac': {
      gradStart: '#F5E9D3',
      gradMid: '#CFA972',
      gradEnd: '#7D5C38',
      bodyFill: '#1B150E',
      eyeFill: '#F5E9D3',
      pupilFill: '#1C140C',
      noseFill: '#CFA972',
      auraInner: '#F5E9D3',
      auraMid: '#CFA972',
      starBright: '#F5E9D3',
      starWarm: '#CFA972',
    },
    'pixel-doodles': {
      gradStart: '#FFF2F6',
      gradMid: '#F79AC0',
      gradEnd: '#C86790',
      bodyFill: '#181216',
      eyeFill: '#FFF2F6',
      pupilFill: '#20131A',
      noseFill: '#F79AC0',
      auraInner: '#FFF2F6',
      auraMid: '#F79AC0',
      starBright: '#FFF2F6',
      starWarm: '#F79AC0',
    },
    'sabbath-crew': {
      gradStart: '#F5E9C8',
      gradMid: '#E54850',
      gradEnd: '#9E252D',
      bodyFill: '#121015',
      eyeFill: '#F2C94C',
      pupilFill: '#0D0C0F',
      noseFill: '#E54850',
      auraInner: '#F2C94C',
      auraMid: '#E54850',
      starBright: '#F2C94C',
      starWarm: '#E54850',
    },
    'night-ride': {
      gradStart: '#F7FAFF',
      gradMid: '#F0C975',
      gradEnd: '#3B4D70',
      bodyFill: '#0B101B',
      eyeFill: '#F0C975',
      pupilFill: '#080A10',
      noseFill: '#F7FAFF',
      auraInner: '#F0C975',
      auraMid: '#526A94',
      starBright: '#F7FAFF',
      starWarm: '#F0C975',
    },
    'ilay-riegrow': {
      gradStart: '#FFFFFF',
      gradMid: '#B8BECA',
      gradEnd: '#2B2E36',
      bodyFill: '#ECEEF3',
      eyeFill: '#14151A',
      pupilFill: '#FFFFFF',
      noseFill: '#454A54',
      auraInner: '#FFFFFF',
      auraMid: '#9EA5B5',
      starBright: '#FFFFFF',
      starWarm: '#CFD4DE',
    },
    'joo-jaekyung': {
      gradStart: '#FFFFFF',
      gradMid: '#D6D8DE',
      gradEnd: '#4A4D57',
      bodyFill: '#0B0B0E',
      eyeFill: '#FFFFFF',
      pupilFill: '#0A0A0D',
      noseFill: '#D6D8DE',
      auraInner: '#FFFFFF',
      auraMid: '#9EA3AE',
      starBright: '#FFFFFF',
      starWarm: '#D6D8DE',
    },
    'zhenya': {
      gradStart: '#F5EFE4',
      gradMid: '#D8CEBE',
      gradEnd: '#4A4842',
      bodyFill: '#EDE7DC',
      eyeFill: '#9BC4B4',
      pupilFill: '#121215',
      noseFill: '#8E887E',
      auraInner: '#F5EFE4',
      auraMid: '#D8CEBE',
      starBright: '#F5EFE4',
      starWarm: '#D8CEBE',
    },
    'caesar': {
      gradStart: '#FFF5F4',
      gradMid: '#F2B5C4',
      gradEnd: '#B5788A',
      bodyFill: '#F3E8DC',
      eyeFill: '#BDD4E8',
      pupilFill: '#241B20',
      noseFill: '#E89BAE',
      auraInner: '#FFF5F4',
      auraMid: '#F2B5C4',
      starBright: '#FFF5F4',
      starWarm: '#F2B5C4',
    },
    'sanzu-haruchiyo': {
      gradStart: '#FFFFFF',
      gradMid: '#D2D6E0',
      gradEnd: '#3B3E47',
      bodyFill: '#16171C',
      eyeFill: '#FFFFFF',
      pupilFill: '#09090B',
      noseFill: '#D2D6E0',
      auraInner: '#FFFFFF',
      auraMid: '#B2B7C4',
      starBright: '#FFFFFF',
      starWarm: '#D2D6E0',
    },
  };

  const p = paletteMap[effectiveThemeId];
  const resolvedTitle = title ?? activeTheme.mascotLabel;
  const hasStarryEyes =
    effectiveThemeId === 'rose-nebula' ||
    effectiveThemeId === 'dem-xanh' ||
    effectiveThemeId === 'bien-dem-sua';

  /* Theme Pixel Doodles & Mèo Trắng Đen: Render riêng cặp mèo trắng đen ôm nhau */
  if (effectiveThemeId === 'pixel-doodles') {
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
          <radialGradient id={auraId} cx="50%" cy="54%" r="50%">
            <stop offset="0%" stopColor="#FFF2F6" stopOpacity="0.34" />
            <stop offset="56%" stopColor="#F79AC0" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#F79AC0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {variant !== 'badge' && (
          <>
            <circle cx="60" cy="60" r="56" fill={`url(#${auraId})`} />
            <rect
              x="14"
              y="14"
              width="92"
              height="92"
              rx="24"
              stroke="#F79AC0"
              strokeOpacity="0.38"
              strokeWidth="1.4"
              strokeDasharray="4 4"
            />
          </>
        )}

        {/* Trái tim pixel hồng bay quanh cặp mèo */}
        <path
          d="M55 21H58V23H60V25H62V23H64V21H67V23H69V27H67V29H65V31H63V33H61V35H59V33H57V31H55V29H53V27H51V23H53V21H55Z"
          fill="#F79AC0"
          className="animate-cat-star-1"
        />
        {variant !== 'badge' && (
          <>
            <path
              d="M17 33H19V35H21V33H23V37H21V39H19V41H17V39H15V37H13V33H15V35H17V33Z"
              fill="#FFF2F6"
              className="animate-cat-star-2"
            />
            <path
              d="M97 34H99V36H101V34H103V38H101V40H99V42H97V40H95V38H93V34H95V36H97V34Z"
              fill="#F79AC0"
              className="animate-cat-star-3"
            />
          </>
        )}

        {/* Đuôi mèo trắng & mèo đen tạo hình trái tim mềm mại ở 2 bên */}
        <path
          d="M28 91C16 88 13 76 19 69C23 65 28 69 27 74"
          stroke="#FFF8FA"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M92 91C104 88 107 76 101 69C97 65 92 69 93 74"
          stroke="#F79AC0"
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {/* Mèo trắng (bên trái, hơi nghiêng ôm lấy mèo đen) */}
        <g transform="rotate(6 45 70)">
          <path
            d="M27 94C26 78 31 65 37 61H54C59 66 61 80 59 94C50 97 35 97 27 94Z"
            fill="#FFF8FA"
            stroke="#241820"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          <path
            d="M27 48L26 30L38 38C43 36 50 37 54 39L64 31L62 49C63 57 57 64 45 64C33 64 26 56 27 48Z"
            fill="#FFF8FA"
            stroke="#241820"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          {/* Tai trong hồng phấn */}
          <path d="M29.5 43L29.5 35.5L35 40" stroke="#F79AC0" strokeWidth="1.5" strokeLinecap="round" />
          {/* Mắt nhắm tít hạnh phúc & má hồng */}
          <path d="M36 50C37.5 48.2 40 48.2 41.5 50" stroke="#241820" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M49 50C50.5 48.2 53 48.2 54.5 50" stroke="#241820" strokeWidth="1.7" strokeLinecap="round" />
          <ellipse cx="34" cy="54" rx="2.4" ry="1.3" fill="#F79AC0" fillOpacity="0.65" />
          <path d="M43.5 53.5C44.5 54.5 46 54.5 47 53.5" stroke="#241820" strokeWidth="1.3" strokeLinecap="round" />
        </g>

        {/* Mèo đen (bên phải, rúc đầu ôm mèo trắng) */}
        <g transform="rotate(-6 75 70)">
          <path
            d="M61 94C59 80 61 66 66 61H83C89 65 94 78 93 94C85 97 70 97 61 94Z"
            fill="#1B1419"
            stroke="#F79AC0"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          <path
            d="M58 49L56 31L66 39C70 37 77 36 82 38L94 30L93 48C94 56 87 64 75 64C63 64 57 57 58 49Z"
            fill="#1B1419"
            stroke="#F79AC0"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          <path d="M90.5 43L90.5 35.5L85 40" stroke="#F79AC0" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="67.5" cy="50" r="2.2" fill="#FFF2F6" />
          <circle cx="80.5" cy="50" r="2.2" fill="#FFF2F6" />
          <ellipse cx="86" cy="54" rx="2.4" ry="1.3" fill="#F79AC0" fillOpacity="0.55" />
          <path d="M72.5 54C73.5 55 75 55 76 54" stroke="#F79AC0" strokeWidth="1.3" strokeLinecap="round" />
        </g>

        {/* Đôi tay mèo trắng đặt ôm sang vai mèo đen */}
        <path
          d="M53 72C59 71 66 72 70 76"
          stroke="#FFF8FA"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M53 72C59 71 66 72 70 76"
          stroke="#241820"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

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

      {/* Gothic Lily & Ribbon */}
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

      {/* Velvet & Vinyl */}
      {variant !== 'badge' && effectiveThemeId === 'velvet-vinyl' && (
        <g aria-hidden="true">
          <circle cx="60" cy="48" r="35" fill="#0B0406" fillOpacity="0.65" stroke="#8E2034" strokeWidth="1.4" strokeOpacity="0.6" />
          <circle cx="60" cy="48" r="29" stroke="#F7EAD9" strokeWidth="0.7" strokeOpacity="0.22" strokeDasharray="12 6" />
          <circle cx="60" cy="48" r="23" stroke="#E2B89B" strokeWidth="0.6" strokeOpacity="0.24" />
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

      {/* Ink Lily & Seal */}
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

      {/* Rose Nebula */}
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

      {/* Celestial Scroll */}
      {variant !== 'badge' && effectiveThemeId === 'celestial-scroll' && (
        <g aria-hidden="true">
          <circle cx="60" cy="48" r="34" stroke="#E8D29B" strokeOpacity="0.55" strokeWidth="1.5" />
          <circle cx="60" cy="48" r="39" stroke="#8FB9A8" strokeOpacity="0.38" strokeWidth="1" strokeDasharray="4 4" />
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

      {/* Thủy Mặc Sương Khói: Vòng nét mực Enso & làn khói sương nhẹ phía sau */}
      {variant !== 'badge' && effectiveThemeId === 'thuy-mac' && (
        <g aria-hidden="true">
          <path
            d="M34 25C49 14 75 15 88 30C99 44 97 67 84 80"
            stroke="#A9B4C0"
            strokeOpacity="0.45"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M28 42C20 55 21 73 33 83"
            stroke="#EEF2F5"
            strokeOpacity="0.28"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Dải sương khói uốn nhẹ */}
          <path
            d="M14 78C23 73 30 77 36 74"
            stroke="#EEF2F5"
            strokeOpacity="0.42"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M86 24C92 21 98 24 104 20"
            stroke="#A9B4C0"
            strokeOpacity="0.48"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Cổ Phong Trâm Ngọc: Trâm ngọc cài phía sau & khung cửa cổ tròn */}
      {variant !== 'badge' && effectiveThemeId === 'co-phong-tram' && (
        <g aria-hidden="true">
          <circle
            cx="60"
            cy="52"
            r="39"
            stroke="#9B2938"
            strokeOpacity="0.52"
            strokeWidth="1.6"
          />
          <circle
            cx="60"
            cy="52"
            r="35"
            stroke="#67C4A7"
            strokeOpacity="0.34"
            strokeWidth="0.9"
            strokeDasharray="6 4"
          />
          {/* Cây trâm ngọc bích vắt chéo tinh tế */}
          <line x1="25" y1="29" x2="94" y2="21" stroke="#EFE4CA" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.72" />
          <circle cx="24" cy="29" r="3.4" fill="#67C4A7" stroke="#EFE4CA" strokeWidth="1" />
        </g>
      )}

      {/* Đêm Xanh Ánh Mắt: Các ngôi sao xanh băng lấp lánh quanh chú mèo xanh đêm */}
      {variant !== 'badge' && effectiveThemeId === 'dem-xanh' && (
        <g aria-hidden="true">
          <path
            d="M21 29L23 35L29 37L23 39L21 45L19 39L13 37L19 35Z"
            fill="#E8F6FF"
            className="animate-cat-star-1"
          />
          <path
            d="M99 40L100.6 44.4L105 46L100.6 47.6L99 52L97.4 47.6L93 46L97.4 44.4Z"
            fill="#7EC8F2"
            className="animate-cat-star-2"
          />
          <path
            d="M23 77L24.2 80.5L27.5 81.5L24.2 82.5L23 86L21.8 82.5L18.5 81.5L21.8 80.5Z"
            fill="#E8F6FF"
            className="animate-cat-star-3"
          />
          <circle cx="88" cy="22" r="1.8" fill="#7EC8F2" />
          <circle cx="34" cy="18" r="1.4" fill="#E8F6FF" />
        </g>
      )}

      {/* Bong Bóng Sứa Lam Ngọc: Mèo lơ lửng giữa vòng bong bóng xanh băng - bạc */}
      {effectiveThemeId === 'bong-bong-sua' && (
        <g aria-hidden="true">
          {/* Vòng bong bóng lớn bao quanh chú mèo */}
          <circle
            cx="60"
            cy="55"
            r={variant === 'badge' ? 46 : 43}
            fill="#8FD4EC"
            fillOpacity="0.06"
            stroke="#EBF8FF"
            strokeOpacity="0.45"
            strokeWidth="1.4"
          />
          <path
            d="M32 34C39 24 51 19 63 19"
            stroke="#FFFFFF"
            strokeOpacity="0.55"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {variant !== 'badge' && (
            <>
              {/* Các bong bóng nhỏ lơ lửng xung quanh */}
              <g className="animate-cat-star-1">
                <circle cx="21" cy="34" r="8.5" fill="#8FD4EC" fillOpacity="0.14" stroke="#EBF8FF" strokeOpacity="0.68" strokeWidth="1.2" />
                <path d="M16.5 31C17.5 29 19.5 28 21.5 28" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="1.2" strokeLinecap="round" />
              </g>
              <g className="animate-cat-star-2">
                <circle cx="98" cy="39" r="7" fill="#EBF8FF" fillOpacity="0.12" stroke="#8FD4EC" strokeOpacity="0.72" strokeWidth="1.2" />
                <path d="M94.5 36.2C95.4 34.7 97 34 98.6 34" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="1.1" strokeLinecap="round" />
              </g>
              <g className="animate-cat-star-3">
                <circle cx="24" cy="79" r="5" fill="#8FD4EC" fillOpacity="0.15" stroke="#EBF8FF" strokeOpacity="0.65" strokeWidth="1.1" />
                <circle cx="22.5" cy="77.2" r="1.1" fill="#FFFFFF" fillOpacity="0.85" />
              </g>
              <circle cx="95" cy="77" r="4.2" fill="#EBF8FF" fillOpacity="0.15" stroke="#8FD4EC" strokeOpacity="0.6" strokeWidth="1" />
              <circle cx="88" cy="19" r="2.6" fill="#EBF8FF" fillOpacity="0.55" />
            </>
          )}
        </g>
      )}

      {/* Collage Hai Bé & Dấu Sáp: Khung Polaroid nghiêng nhẹ & sticker ngôi sao / hội thoại pixel */}
      {variant !== 'badge' && effectiveThemeId === 'collage-hai-be' && (
        <g aria-hidden="true">
          <rect
            x="16"
            y="14"
            width="88"
            height="92"
            rx="12"
            transform="rotate(-2.5 60 60)"
            fill="#F6F0E4"
            fillOpacity="0.04"
            stroke="#F6F0E4"
            strokeOpacity="0.34"
            strokeWidth="1.4"
            strokeDasharray="6 4"
          />
          {/* Sticker bong bóng pixel trái tim */}
          <g className="animate-cat-star-1">
            <rect x="88" y="19" width="18" height="14" rx="4" fill="#F6F0E4" stroke="#141319" strokeWidth="1.1" />
            <path d="M97 29.5C97 29.5 92.8 26.8 92.8 24.4C92.8 23.1 93.8 22.2 95 22.2C95.8 22.2 96.5 22.7 97 23.4C97.5 22.7 98.2 22.2 99 22.2C100.2 22.2 101.2 23.1 101.2 24.4C101.2 26.8 97 29.5 97 29.5Z" fill="#DF95A5" />
          </g>
          {/* Ngôi sao sticker lấp lánh */}
          <path
            d="M21 31L23 36.2L28.2 38.2L23 40.2L21 45.4L19 40.2L13.8 38.2L19 36.2Z"
            fill="#F6F0E4"
            className="animate-cat-star-2"
          />
          <path
            d="M24 79L25.4 82.6L29 84L25.4 85.4L24 89L22.6 85.4L19 84L22.6 82.6Z"
            fill="#DF95A5"
            className="animate-cat-star-3"
          />
        </g>
      )}

      {/* Biển Đêm & Sứa: Sứa phát sáng lam ngọc & bọt nước đại dương bay quanh mèo */}
      {effectiveThemeId === 'bien-dem-sua' && (
        <g aria-hidden="true">
          {/* Sứa phát sáng nhỏ góc trên phải */}
          <g className="animate-cat-star-1">
            <path d="M88 26C88 20.5 92.2 16.5 97 16.5C101.8 16.5 106 20.5 106 26H88Z" fill="#6CB6FF" fillOpacity="0.45" stroke="#E2F2FF" strokeWidth="1.1" />
            <path d="M92 26.5C91 31 93 35 91.5 38M97 26.5C97.6 31.5 96.4 36 97 39.5M102 26.5C103 31 101 35 102.5 38" stroke="#6CB6FF" strokeWidth="1.1" strokeLinecap="round" />
          </g>
          {variant !== 'badge' && (
            <>
              <circle cx="22" cy="37" r="6" fill="#6CB6FF" fillOpacity="0.14" stroke="#E2F2FF" strokeOpacity="0.65" strokeWidth="1.1" className="animate-cat-star-2" />
              <circle cx="20" cy="34.8" r="1.3" fill="#FFFFFF" fillOpacity="0.85" />
              <circle cx="24" cy="78" r="4.2" fill="#E2F2FF" fillOpacity="0.14" stroke="#6CB6FF" strokeOpacity="0.7" strokeWidth="1" className="animate-cat-star-3" />
              <circle cx="98" cy="72" r="3.5" fill="#6CB6FF" fillOpacity="0.18" stroke="#E2F2FF" strokeOpacity="0.65" strokeWidth="1" />
            </>
          )}
        </g>
      )}

      {/* Báo Cũ & Nhạc Cổ Điển: Viền báo cổ điển double-circle & nốt nhạc vintage */}
      {variant !== 'badge' && effectiveThemeId === 'bao-cu-nhac' && (
        <g aria-hidden="true">
          <circle cx="60" cy="54" r="41" stroke="#CFA972" strokeOpacity="0.48" strokeWidth="1.2" />
          <circle cx="60" cy="54" r="37" stroke="#F5E9D3" strokeOpacity="0.28" strokeWidth="0.9" strokeDasharray="3 3" />
          <g className="animate-cat-star-1" fill="#F5E9D3">
            <circle cx="21" cy="35" r="2.2" />
            <path d="M23 35V24L29 26.5V29.5L23 27.5" stroke="#CFA972" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g className="animate-cat-star-2" fill="#CFA972">
            <circle cx="97" cy="43" r="2" />
            <path d="M99 43V33.5L103 35" stroke="#F5E9D3" strokeWidth="1.3" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* Sabbath Crew: Tia sét vàng & sticker đường phố sau lưng mèo */}
      {variant !== 'badge' && effectiveThemeId === 'sabbath-crew' && (
        <g aria-hidden="true">
          <rect
            x="17"
            y="17"
            width="86"
            height="86"
            rx="10"
            transform="rotate(-3 60 60)"
            stroke="#F5E9C8"
            strokeOpacity="0.28"
            strokeWidth="1.4"
            strokeDasharray="8 5"
          />
          <path
            d="M23 27L16 39H22L20 49L29 36H23L23 27Z"
            fill="#F2C94C"
            className="animate-cat-star-1"
          />
          <path
            d="M99 30L94 39H98.5L97 47L104 37H99.5L99 30Z"
            fill="#E54850"
            className="animate-cat-star-2"
          />
          <path
            d="M20 77L26 83M26 77L20 83"
            stroke="#F5E9C8"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="animate-cat-star-3"
          />
        </g>
      )}

      {/* Night Ride: Ánh đèn đường đêm & 3 ngôi sao sáng */}
      {variant !== 'badge' && effectiveThemeId === 'night-ride' && (
        <g aria-hidden="true">
          <path
            d="M20 35C32 18 88 18 100 35"
            stroke="#F0C975"
            strokeOpacity="0.42"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M24 27L25.4 30.8L29.4 31L26.2 33.4L27.3 37.2L24 35L20.7 37.2L21.8 33.4L18.6 31L22.6 30.8Z"
            fill="#F7FAFF"
            className="animate-cat-star-1"
          />
          <path
            d="M60 12L61.2 15.2L64.6 15.4L61.9 17.5L62.8 20.8L60 18.9L57.2 20.8L58.1 17.5L55.4 15.4L58.8 15.2Z"
            fill="#F0C975"
            className="animate-cat-star-2"
          />
          <path
            d="M96 27L97.4 30.8L101.4 31L98.2 33.4L99.3 37.2L96 35L92.7 37.2L93.8 33.4L90.6 31L94.6 30.8Z"
            fill="#F7FAFF"
            className="animate-cat-star-3"
          />
        </g>
      )}

      {/* Ilay Riegrow: Khung tạp chí đen trắng sắc cạnh & sao 4 cánh lạnh */}
      {variant !== 'badge' && effectiveThemeId === 'ilay-riegrow' && (
        <g aria-hidden="true">
          <rect
            x="16"
            y="16"
            width="88"
            height="88"
            stroke="#FFFFFF"
            strokeOpacity="0.42"
            strokeWidth="1.3"
          />
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            stroke="#9EA5B5"
            strokeOpacity="0.28"
            strokeWidth="0.9"
          />
          <path
            d="M96 23L97.8 28.2L103 30L97.8 31.8L96 37L94.2 31.8L89 30L94.2 28.2Z"
            fill="#FFFFFF"
            className="animate-cat-star-1"
          />
          <path
            d="M23 76L24.4 80.2L28.6 81.6L24.4 83L23 87.2L21.6 83L17.4 81.6L21.6 80.2Z"
            fill="#CFD4DE"
            className="animate-cat-star-2"
          />
        </g>
      )}

      {/* Joo Jaekyung: Đĩa vinyl, lá bài tây bích & găng đấm bốc phía sau mèo đen */}
      {variant !== 'badge' && effectiveThemeId === 'joo-jaekyung' && (
        <g aria-hidden="true">
          {/* Đĩa vinyl trắng đen phía sau */}
          <circle cx="88" cy="48" r="19" fill="#131317" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1.2" />
          <circle cx="88" cy="48" r="12" stroke="#D6D8DE" strokeOpacity="0.28" strokeWidth="0.8" />
          <circle cx="88" cy="48" r="5" fill="#F7F8FA" fillOpacity="0.85" />
          {/* Lá bài tây A Bích góc trên trái */}
          <g transform="rotate(-14 23 33)" className="animate-cat-star-1">
            <rect x="14" y="21" width="17" height="23" rx="2" fill="#F7F8FA" stroke="#0B0B0E" strokeWidth="1.2" />
            <path d="M22.5 27.5C22.5 27.5 18.5 31 18.5 33.4C18.5 34.8 19.6 35.6 20.8 35.6C21.5 35.6 22.1 35.2 22.5 34.6C22.9 35.2 23.5 35.6 24.2 35.6C25.4 35.6 26.5 34.8 26.5 33.4C26.5 31 22.5 27.5 22.5 27.5ZM21.7 35L20.8 37.5H24.2L23.3 35H21.7Z" fill="#0B0B0E" />
          </g>
          {/* Găng đấm bốc nhỏ góc dưới trái */}
          <g className="animate-cat-star-2">
            <rect x="16" y="75" width="12" height="10" rx="4" fill="#18191E" stroke="#FFFFFF" strokeWidth="1.2" />
            <rect x="17.5" y="83.5" width="9" height="4" rx="1" fill="#FFFFFF" />
          </g>
        </g>
      )}

      {/* Zhenya: Cuộn phim noir cổ điển, quân Vua cờ vua & bướm đêm */}
      {variant !== 'badge' && effectiveThemeId === 'zhenya' && (
        <g aria-hidden="true">
          {/* Cuộn phim dọc phía sau bên trái */}
          <rect
            x="16"
            y="18"
            width="22"
            height="76"
            rx="2"
            transform="rotate(-8 27 56)"
            fill="#141418"
            fillOpacity="0.86"
            stroke="#D8CEBE"
            strokeOpacity="0.55"
            strokeWidth="1.2"
          />
          <g fill="#F5EFE4" fillOpacity="0.65" transform="rotate(-8 27 56)">
            <rect x="18.5" y="22" width="3" height="4" rx="0.6" />
            <rect x="18.5" y="30" width="3" height="4" rx="0.6" />
            <rect x="18.5" y="38" width="3" height="4" rx="0.6" />
            <rect x="18.5" y="46" width="3" height="4" rx="0.6" />
            <rect x="18.5" y="54" width="3" height="4" rx="0.6" />
            <rect x="18.5" y="62" width="3" height="4" rx="0.6" />
          </g>
          {/* Quân Vua cờ vua nhỏ bên phải */}
          <g transform="translate(88, 56)" className="animate-cat-star-2">
            <path d="M9 2V8M6.5 4.5H11.5" stroke="#F5EFE4" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M5 11H13L11.5 23H6.5L5 11Z" fill="#1C1C22" stroke="#D8CEBE" strokeWidth="1.1" />
            <rect x="3.5" y="23" width="11" height="3.2" rx="1" fill="#D8CEBE" />
          </g>
          {/* Bướm nhỏ bay bên trên */}
          <g className="animate-cat-star-1">
            <path
              d="M91 25C88.5 21.5 85 20 84.2 22C83.5 23.6 86 25.5 88.8 26C86.8 26.8 85.8 28.8 87.2 30C88.5 31.2 90.5 29.4 91 26.8Z"
              fill="#F5EFE4"
              fillOpacity="0.82"
            />
            <path
              d="M92 25C94.5 21.5 98 20 98.8 22C99.5 23.6 97 25.5 94.2 26C96.2 26.8 97.2 28.8 95.8 30C94.5 31.2 92.5 29.4 92 26.8Z"
              fill="#F5EFE4"
              fillOpacity="0.82"
            />
          </g>
        </g>
      )}

      {/* Caesar: Dải ruy băng hồng mềm mại, dấu son & trái tim dấu vân tay */}
      {variant !== 'badge' && effectiveThemeId === 'caesar' && (
        <g aria-hidden="true">
          <path
            d="M15 32C30 22 46 27 60 22C74 17 90 22 105 30"
            stroke="#F2B5C4"
            strokeOpacity="0.52"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M15 32C30 22 46 27 60 22C74 17 90 22 105 30"
            stroke="#FFF5F4"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Dấu trái tim hồng nhỏ bên trái */}
          <path
            d="M22 44C22 44 17 40.8 17 37.8C17 36.2 18.2 35 19.8 35C20.8 35 21.6 35.6 22 36.4C22.4 35.6 23.2 35 24.2 35C25.8 35 27 36.2 27 37.8C27 40.8 22 44 22 44Z"
            fill="#F2B5C4"
            fillOpacity="0.72"
            className="animate-cat-star-1"
          />
          {/* Dấu son môi nhỏ góc phải */}
          <g transform="translate(91, 68) rotate(-14)" className="animate-cat-star-2">
            <path d="M2 5C5 2.5 9 2.5 12 5C9 6.5 5 6.5 2 5Z" fill="#E89BAE" fillOpacity="0.82" />
            <path d="M2 6.5C5 9 9 9 12 6.5C9 7.4 5 7.4 2 6.5Z" fill="#F2B5C4" fillOpacity="0.88" />
          </g>
        </g>
      )}

      {/* Sanzu Haruchiyo: Ngôi sao sọc xoáy góc cạnh phía sau mèo */}
      {variant !== 'badge' && effectiveThemeId === 'sanzu-haruchiyo' && (
        <g aria-hidden="true">
          {/* Ngôi sao lớn sọc xoáy góc trên phải */}
          <g className="animate-cat-star-1">
            <path
              d="M94 18L97.4 26L106 27L99.5 32.8L101.2 41.2L94 36.8L86.8 41.2L88.5 32.8L82 27L90.6 26Z"
              fill="#FFFFFF"
              stroke="#09090B"
              strokeWidth="1.3"
            />
            <path
              d="M94 31C94 29.8 95.4 29.3 96.2 30.2C97.1 31.2 96.5 33 94.8 33.4C92.8 33.8 91.2 32 91.5 29.9C91.8 27.6 94.2 26.2 96.5 27"
              stroke="#09090B"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>
          {/* Ngôi sao góc cạnh nhỏ bên trái */}
          <path
            d="M22 30L24.5 36L31 36.8L26 41L27.2 47.4L22 44L16.8 47.4L18 41L13 36.8L19.5 36Z"
            fill="#D2D6E0"
            fillOpacity="0.72"
            stroke="#09090B"
            strokeWidth="1"
            className="animate-cat-star-2"
          />
          <path
            d="M21 76L23 80.5L28 81L24.2 84L25.2 88.8L21 86.2L16.8 88.8L17.8 84L14 81L19 80.5Z"
            fill="#FFFFFF"
            fillOpacity="0.82"
            className="animate-cat-star-3"
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

      {/* Cổ Phong Trâm Ngọc: Dây tua rua nhỏ rủ cạnh chú mèo đang ngồi */}
      {effectiveThemeId === 'co-phong-tram' && (
        <g aria-hidden="true">
          {/* Dây treo từ cạnh cổ xuống bên trái mèo */}
          <path
            d="M44 63C35 66 30 72 30 78"
            stroke="#9B2938"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Hạt ngọc bích & nút thắt nhỏ */}
          <circle cx="30" cy="79" r="2.7" fill="#67C4A7" stroke="#EFE4CA" strokeWidth="0.9" />
          {/* Chùm tua rua đỏ trầm rủ thẳng */}
          <path
            d="M30 82V96M28 83L26.8 95M32 83L33.2 95"
            stroke="#C84B59"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      )}

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
        <g aria-hidden="true">
          <path d="M47 62C54 65 66 65 73 62" stroke="#D8A7B1" strokeWidth="1.8" strokeLinecap="round" />
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
          <path d="M58 68L53 79L57 77L59 68Z" fill="#D8A7B1" stroke="#F6EAEF" strokeWidth="0.9" />
          <path d="M62 68L67 79L63 77L61 68Z" fill="#D8A7B1" stroke="#F6EAEF" strokeWidth="0.9" />
          <circle cx="60" cy="66" r="3" fill="#F6EAEF" stroke="#9B6573" strokeWidth="1.1" />
        </g>
      ) : effectiveThemeId === 'ink-lily' ? (
        <g aria-hidden="true">
          <path d="M47 62C54 66 66 66 73 62" stroke="#9CAF8E" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="57.2" y="64.5" width="5.6" height="5.6" transform="rotate(45 60 67.3)" fill="#617454" stroke="#E7EFE0" strokeWidth="1" />
          <path d="M60 71.5V82M58 73L57 81M62 73L63 81" stroke="#9CAF8E" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="60" cy="67.3" r="1.4" fill="#E7EFE0" />
        </g>
      ) : effectiveThemeId === 'celestial-scroll' ? (
        <g aria-hidden="true">
          <path d="M46 62C54 67 66 67 74 62" stroke="#8FB9A8" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M48 64C42 70 40 76 44 82" stroke="#8FB9A8" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.85" />
          <path d="M72 64C78 70 80 76 76 82" stroke="#E8D29B" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.85" />
          <circle cx="60" cy="67.5" r="3.4" fill="#B54B4B" stroke="#E8D29B" strokeWidth="1.3" />
        </g>
      ) : effectiveThemeId === 'thuy-mac' ? (
        /* Thủy Mặc Sương Khói: Nét mực tĩnh lặng thanh thoát, không chuông rườm rà */
        <path
          d="M48 63C55 66 65 66 72 63"
          stroke="#A9B4C0"
          strokeWidth="1.6"
          strokeOpacity="0.7"
          strokeLinecap="round"
        />
      ) : effectiveThemeId === 'co-phong-tram' ? (
        /* Cổ Phong Trâm Ngọc: Vòng cổ đỏ trầm đính ngọc bích giữa ngực */
        <g aria-hidden="true">
          <path d="M47 62C54 66 66 66 73 62" stroke="#C84B59" strokeWidth="2.1" strokeLinecap="round" />
          <circle cx="60" cy="67" r="3.1" fill="#67C4A7" stroke="#EFE4CA" strokeWidth="1.1" />
        </g>
      ) : effectiveThemeId === 'collage-hai-be' ? (
        /* Collage Hai Bé & Dấu Sáp: Vòng cổ gắn charm sticker ngôi sao hồng kem */
        <g aria-hidden="true">
          <path d="M47 62C54 66 66 66 73 62" stroke="#F6F0E4" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M60 63.2L61.6 66.5L65 67.5L61.6 68.5L60 71.8L58.4 68.5L55 67.5L58.4 66.5Z"
            fill="#DF95A5"
            stroke="#F6F0E4"
            strokeWidth="0.9"
          />
        </g>
      ) : effectiveThemeId === 'sabbath-crew' ? (
        /* Sabbath Crew: Dây xích bạc & tag crew đỏ vàng */
        <g aria-hidden="true">
          <path d="M46 62C54 67 66 67 74 62" stroke="#E2E5EC" strokeWidth="2.4" strokeDasharray="3.2 2.2" strokeLinecap="round" />
          <rect x="56.5" y="65" width="7" height="5.5" rx="1" fill="#E54850" stroke="#F2C94C" strokeWidth="1" />
        </g>
      ) : effectiveThemeId === 'ilay-riegrow' ? (
        /* Ilay Riegrow: Cổ áo sơ mi trắng & cà vạt đen sắc nét */
        <g aria-hidden="true">
          <path d="M48 62L55 68L60 64L65 68L72 62" fill="#FFFFFF" stroke="#18191F" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M58 65H62L63.2 79L60 83L56.8 79L58 65Z" fill="#14151A" stroke="#FFFFFF" strokeWidth="0.8" strokeLinejoin="round" />
        </g>
      ) : effectiveThemeId === 'joo-jaekyung' ? (
        /* Joo Jaekyung: Vòng đai võ đài trắng đen & charm quân bích */
        <g aria-hidden="true">
          <path d="M46 62C54 66 66 66 74 62" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="55" y="64.5" width="10" height="7" rx="1.2" fill="#0B0B0E" stroke="#FFFFFF" strokeWidth="1.1" />
          <path d="M60 65.8C60 65.8 57.6 67.8 57.6 69.2C57.6 70 58.3 70.5 59 70.5C59.4 70.5 59.8 70.3 60 69.9C60.2 70.3 60.6 70.5 61 70.5C61.7 70.5 62.4 70 62.4 69.2C62.4 67.8 60 65.8 60 65.8Z" fill="#FFFFFF" />
        </g>
      ) : effectiveThemeId === 'zhenya' ? (
        /* Zhenya: Cổ áo noir tối & ghim hoa hồng trắng / vương miện nhỏ */
        <g aria-hidden="true">
          <path d="M47 62L55 68L60 64L65 68L73 62" fill="#1C1C22" stroke="#F5EFE4" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="60" cy="68.5" r="3" fill="#F5EFE4" stroke="#2D2B27" strokeWidth="1" />
          <circle cx="60" cy="68.5" r="1.2" fill="#8E887E" />
        </g>
      ) : effectiveThemeId === 'caesar' ? (
        /* Caesar: Nơ ruy băng hồng satin thắt trước cổ */
        <g aria-hidden="true">
          <path d="M47 62C54 66 66 66 73 62" stroke="#F2B5C4" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M58.5 65L48 60C47 64 47.5 68 50 70.5L58.5 66.8Z" fill="#F2B5C4" stroke="#FFF5F4" strokeWidth="1" strokeLinejoin="round" />
          <path d="M61.5 65L72 60C73 64 72.5 68 70 70.5L61.5 66.8Z" fill="#F2B5C4" stroke="#FFF5F4" strokeWidth="1" strokeLinejoin="round" />
          <path d="M58.8 67.2L55 76.5L58 74.8L59.5 67.5Z" fill="#E59BB0" stroke="#FFF5F4" strokeWidth="0.8" />
          <path d="M61.2 67.2L65 76.5L62 74.8L60.5 67.5Z" fill="#E59BB0" stroke="#FFF5F4" strokeWidth="0.8" />
          <circle cx="60" cy="66" r="2.6" fill="#FFF5F4" stroke="#C88EA0" strokeWidth="1" />
        </g>
      ) : effectiveThemeId === 'sanzu-haruchiyo' ? (
        /* Sanzu Haruchiyo: Cà vạt sọc tối & charm ngôi sao xoáy trắng đen */
        <g aria-hidden="true">
          <path d="M47 62C54 66 66 66 73 62" stroke="#FFFFFF" strokeWidth="2.1" strokeDasharray="3.5 2.5" strokeLinecap="round" />
          <path d="M58 64H62L63.5 79L60 83L56.5 79L58 64Z" fill="#23252E" stroke="#FFFFFF" strokeWidth="1" strokeLinejoin="round" />
          <circle cx="60" cy="68.5" r="2.8" fill="#FFFFFF" stroke="#09090B" strokeWidth="0.9" />
        </g>
      ) : (
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

      {/* Velvet & Vinyl: Tai nghe đỏ đô - kem cổ điển */}
      {effectiveThemeId === 'velvet-vinyl' && (
        <g aria-hidden="true">
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
          <rect x="29" y="40" width="9.5" height="15.5" rx="4.5" fill="#7B182A" stroke="#F7EAD9" strokeWidth="1.4" />
          <line x1="33.8" y1="44" x2="33.8" y2="51.5" stroke="#E2B89B" strokeWidth="1.1" strokeLinecap="round" />
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

      {/* Đêm Xanh Ánh Mắt: Điểm nhấn trăng khuyết nhỏ trên trán mèo xanh đêm */}
      {effectiveThemeId === 'dem-xanh' && (
        <path
          d="M62.5 38C61 36.2 58.2 36.4 57.2 38.4C58.6 38 60.4 38.8 61 40.3C62 39.8 62.7 39 62.5 38Z"
          fill="#7EC8F2"
          opacity="0.9"
        />
      )}

      {/* Collage Hai Bé & Dấu Sáp: Kẹp tóc sticker ngôi sao trên tai phải & sticker băng dán cá nhân */}
      {effectiveThemeId === 'collage-hai-be' && (
        <g aria-hidden="true">
          <path
            d="M78.5 30L79.8 33.2L83 34.2L79.8 35.2L78.5 38.4L77.2 35.2L74 34.2L77.2 33.2Z"
            fill="#F6F0E4"
            stroke="#DF95A5"
            strokeWidth="0.8"
          />
          <rect
            x="40.5"
            y="50.5"
            width="6.5"
            height="3.2"
            rx="1.2"
            transform="rotate(-12 43.7 52.1)"
            fill="#F6F0E4"
            stroke="#DF95A5"
            strokeWidth="0.7"
          />
        </g>
      )}

      {/* Báo Cũ & Nhạc Cổ Điển: Mũ nồi vintage & kính tròn đồng cổ */}
      {effectiveThemeId === 'bao-cu-nhac' && (
        <g aria-hidden="true">
          {/* Mũ beret cổ điển đội lệch nhẹ */}
          <path
            d="M44 33C46 25 56 22 68 25C74 26.5 78 30 76 34C67 32 54 32 44 33Z"
            fill="#5C4026"
            stroke="#CFA972"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <circle cx="63" cy="23.5" r="1.5" fill="#CFA972" />
          {/* Kính tròn vintage mắt phải */}
          <circle cx="69.5" cy="48" r="6" stroke="#CFA972" strokeWidth="1.4" fill="#F5E9D3" fillOpacity="0.08" />
          <path d="M75.5 48C79 51 80 57 78 63" stroke="#CFA972" strokeWidth="0.9" strokeDasharray="2 1.5" strokeLinecap="round" />
        </g>
      )}

      {/* Sabbath Crew: Mũ len đường phố & tag vàng */}
      {effectiveThemeId === 'sabbath-crew' && (
        <g aria-hidden="true">
          <path
            d="M44 35C45 24 52 20 60 20C68 20 75 24 76 35C68 33 52 33 44 35Z"
            fill="#B82D35"
            stroke="#F5E9C8"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M44 33.5C53 31.5 67 31.5 76 33.5" stroke="#F2C94C" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="65" y="29.5" width="6" height="4" rx="0.8" fill="#F2C94C" />
        </g>
      )}

      {/* Night Ride: Kính đêm gọng sáng trên trán mèo */}
      {effectiveThemeId === 'night-ride' && (
        <g aria-hidden="true">
          <rect x="43" y="34" width="14" height="6.5" rx="2.5" fill="#182238" stroke="#F0C975" strokeWidth="1.2" />
          <rect x="63" y="34" width="14" height="6.5" rx="2.5" fill="#182238" stroke="#F0C975" strokeWidth="1.2" />
          <line x1="57" y1="37" x2="63" y2="37" stroke="#F7FAFF" strokeWidth="1.2" />
        </g>
      )}

      {/* Caesar: Nơ ruy băng hồng nhỏ kẹp trên mái tóc / tai mèo phải */}
      {effectiveThemeId === 'caesar' && (
        <g aria-hidden="true" transform="translate(72, 31) rotate(16)">
          <path d="M0 0L-6.5 -3.5C-7.2 -0.5 -6.8 2.5 -4.5 4L0 1.2Z" fill="#F2B5C4" stroke="#FFF5F4" strokeWidth="0.9" />
          <path d="M1.5 0L8 -3.5C8.7 -0.5 8.3 2.5 6 4L1.5 1.2Z" fill="#F2B5C4" stroke="#FFF5F4" strokeWidth="0.9" />
          <circle cx="0.75" cy="0.5" r="1.7" fill="#FFF5F4" stroke="#C88EA0" strokeWidth="0.7" />
        </g>
      )}

      {/* Sanzu Haruchiyo: Khuyên tai đôi, băng cá nhân trên má & sẹo khóe miệng hình thoi */}
      {effectiveThemeId === 'sanzu-haruchiyo' && (
        <g aria-hidden="true">
          {/* 2 vòng khuyên tai bạc bên tai phải */}
          <circle cx="83.5" cy="36" r="2.2" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          <circle cx="83" cy="40.5" r="2.2" stroke="#D2D6E0" strokeWidth="1.2" fill="none" />
          {/* Băng dán nhỏ trên má trái */}
          <rect
            x="40"
            y="50.5"
            width="6.5"
            height="3.2"
            rx="1"
            transform="rotate(-14 43.2 52.1)"
            fill="#D2D6E0"
            stroke="#09090B"
            strokeWidth="0.7"
          />
        </g>
      )}

      {/* Đôi mắt biểu cảm chớp nhẹ */}
      {effectiveThemeId === 'thuy-mac' ? (
        /* Thủy Mặc Sương Khói: Đôi mắt tĩnh lặng thanh thoát */
        <>
          <g className="animate-cat-eye">
            <ellipse cx="50.5" cy="48.5" rx="3.2" ry="2.4" fill={p.eyeFill} />
            <ellipse cx="50.8" cy="48.5" rx="1" ry="1.8" fill={p.pupilFill} />
          </g>
          <g className="animate-cat-eye">
            <ellipse cx="69.5" cy="48.5" rx="3.2" ry="2.4" fill={p.eyeFill} />
            <ellipse cx="69.8" cy="48.5" rx="1" ry="1.8" fill={p.pupilFill} />
          </g>
        </>
      ) : (
        <>
          <g className="animate-cat-eye">
            <ellipse cx="50.5" cy="48" rx="3.4" ry="4.2" fill={p.eyeFill} />
            <ellipse cx="50.8" cy="48" rx="1.1" ry="2.8" fill={p.pupilFill} />
            {hasStarryEyes ? (
              <path
                d="M50.5 45L51.1 47.4L53.5 48L51.1 48.6L50.5 51L49.9 48.6L47.5 48L49.9 47.4Z"
                fill="#FFFFFF"
              />
            ) : (
              <circle cx="49.5" cy="46.5" r="0.9" fill="#FFFFFF" fillOpacity="0.9" />
            )}
          </g>
          <g className="animate-cat-eye">
            <ellipse cx="69.5" cy="48" rx="3.4" ry="4.2" fill={p.eyeFill} />
            <ellipse cx="69.8" cy="48" rx="1.1" ry="2.8" fill={p.pupilFill} />
            {hasStarryEyes ? (
              <path
                d="M69.5 45L70.1 47.4L72.5 48L70.1 48.6L69.5 51L68.9 48.6L66.5 48L68.9 47.4Z"
                fill="#FFFFFF"
              />
            ) : (
              <circle cx="68.5" cy="46.5" r="0.9" fill="#FFFFFF" fillOpacity="0.9" />
            )}
          </g>
        </>
      )}

      {/* Rose Nebula, Collage Hai Bé & Caesar: Má hồng dịu dàng */}
      {(effectiveThemeId === 'rose-nebula' ||
        effectiveThemeId === 'collage-hai-be' ||
        effectiveThemeId === 'caesar') && (
        <g aria-hidden="true">
          <ellipse
            cx="43.5"
            cy="53"
            rx="2.6"
            ry="1.4"
            fill={
              effectiveThemeId === 'caesar'
                ? '#F2B5C4'
                : effectiveThemeId === 'collage-hai-be'
                ? '#DF95A5'
                : '#F7A8C8'
            }
            fillOpacity="0.52"
          />
          <ellipse
            cx="76.5"
            cy="53"
            rx="2.6"
            ry="1.4"
            fill={
              effectiveThemeId === 'caesar'
                ? '#F2B5C4'
                : effectiveThemeId === 'collage-hai-be'
                ? '#DF95A5'
                : '#F7A8C8'
            }
            fillOpacity="0.52"
          />
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

      {/* Sẹo khóe miệng hình thoi đặc trưng của Sanzu */}
      {effectiveThemeId === 'sanzu-haruchiyo' && (
        <g aria-hidden="true" fill="#D2D6E0">
          <path d="M53 56.5L55 54.8L57 56.5L55 58.2Z" />
          <path d="M63 56.5L65 54.8L67 56.5L65 58.2Z" />
        </g>
      )}

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
