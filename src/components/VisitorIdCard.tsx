import React from 'react';
import { Sparkles } from 'lucide-react';
import { AVATAR_FRAME_MAP } from '../data/avatarFrames';
import { useSiteTheme, type SiteThemeId } from '../themes/siteThemes';
import type { AvatarFrameId, DefaultAvatarIconId } from '../types/user';
import { BlackCatMascot } from './BlackCatMascot';
import { SessionFootprintBar, type SessionFootprintStats } from './SessionFootprintBar';
import { AvatarFrameInlineTag, UserAvatarBadge } from './UserAvatarBadge';

interface VisitorIdCardProps {
  displayName: string;
  avatarUrl: string;
  avatarIcon: DefaultAvatarIconId;
  frameId: AvatarFrameId | null;
  createdAt?: string;
  footprintStats: SessionFootprintStats;
  onOpenFrameStudio?: () => void;
  compact?: boolean;
}

function buildPassSerial(name: string, themeId: SiteThemeId): string {
  const clean = `${name}-${themeId}`;
  let hash = 0;
  for (let i = 0; i < clean.length; i += 1) {
    hash = (hash * 31 + clean.charCodeAt(i)) % 9999;
  }
  const num = String(1000 + (hash % 8999));
  return `TN-${num}`;
}

function getThemePassSubtitle(themeId: SiteThemeId): {
  title: string;
  ornamentSymbol: string;
  tagText: string;
} {
  switch (themeId) {
    case 'bien-dem-sua':
      return { title: 'Thẻ Khách Thăm Biển Đêm', ornamentSymbol: '🫧', tagText: 'Sứa Phát Sáng' };
    case 'bao-cu-nhac':
      return { title: 'Ấn Bản Khách Thăm', ornamentSymbol: '🗞️', tagText: 'Nhật Báo Cổ' };
    case 'pixel-doodles':
      return { title: 'Pixel Guest Pass', ornamentSymbol: '♡', tagText: 'Sổ Tay Mèo' };
    case 'sabbath-crew':
      return { title: 'Sabbath Street Pass', ornamentSymbol: '⚡', tagText: 'Crew Member' };
    case 'night-ride':
      return { title: 'Night Ride Pass', ornamentSymbol: '★', tagText: 'Chuyến Xe Đêm' };
    case 'ilay-riegrow':
      return { title: 'By Your Side Pass', ornamentSymbol: '✧', tagText: 'Viền Ren & Sao' };
    case 'joo-jaekyung':
      return { title: 'Team Black Press Pass', ornamentSymbol: '♠', tagText: 'Ringside Club' };
    case 'zhenya':
      return { title: 'Hồ Sơ Khách Danh Dự', ornamentSymbol: '♛', tagText: 'Noir Dossier' };
    case 'caesar':
      return { title: 'Thiệp Ruy Băng Khách Quý', ornamentSymbol: '🎀', tagText: 'Satin Cameo' };
    case 'sanzu-haruchiyo':
      return { title: 'Spiral Star Card', ornamentSymbol: '✦', tagText: 'Manga Edition' };
    case 'yeo-taeju':
      return { title: 'Phiếu Khách Vẽ Tay', ornamentSymbol: '✕', tagText: 'Doodle Note' };
    case 'be-tho':
      return { title: 'Thẻ Khách Nơ Đỏ #7', ornamentSymbol: '🌹', tagText: 'Crimson Velvet' };
    case 'gothic-lily':
      return { title: 'Thẻ Khách Hoa Loa Kèn', ornamentSymbol: '✿', tagText: 'Gothic Ribbon' };
    case 'velvet-vinyl':
      return { title: 'Thẻ Phòng Nhung Đỏ', ornamentSymbol: '♪', tagText: 'Velvet Vinyl' };
    case 'ink-lily':
      return { title: 'Ấn Triện Khách Quý', ornamentSymbol: '❦', tagText: 'Thủy Mặc' };
    case 'rose-nebula':
      return { title: 'Thẻ Tinh Vân Hồng', ornamentSymbol: '✧', tagText: 'Rose Nebula' };
    case 'celestial-scroll':
      return { title: 'Ngọc Bài Khách Thăm', ornamentSymbol: '☾', tagText: 'Vân Ngọc' };
    default:
      return { title: 'Thẻ Căn Cước Khách Thăm', ornamentSymbol: '✦', tagText: 'Ngôi Nhà Nhỏ' };
  }
}

const ThemeCardAccessoryOrnament: React.FC<{ themeId: SiteThemeId; accent: string; bright: string }> = ({
  themeId,
  accent,
  bright,
}) => {
  if (themeId === 'bien-dem-sua') {
    return (
      <svg viewBox="0 0 64 48" fill="none" className="w-12 h-9 opacity-80 shrink-0" aria-hidden="true">
        <path
          d="M18 22C18 14.5 24 9 32 9C40 9 46 14.5 46 22C42 23.5 22 23.5 18 22Z"
          stroke={bright}
          strokeWidth="1.4"
          fill={accent}
          fillOpacity="0.22"
        />
        <path
          d="M24 23C22 29 25 35 23 41M32 23C32 30 30 36 33 43M40 23C42 29 39 35 41 40"
          stroke={accent}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="11" cy="14" r="2.2" stroke={bright} strokeWidth="1" />
        <circle cx="53" cy="16" r="1.6" fill={bright} fillOpacity="0.65" />
      </svg>
    );
  }

  if (themeId === 'bao-cu-nhac' || themeId === 'velvet-vinyl') {
    return (
      <svg viewBox="0 0 56 48" fill="none" className="w-11 h-9 opacity-85 shrink-0" aria-hidden="true">
        <circle cx="28" cy="24" r="17" stroke={accent} strokeWidth="1.3" fill={accent} fillOpacity="0.1" />
        <circle cx="28" cy="24" r="11" stroke={bright} strokeWidth="0.8" strokeDasharray="3 3" />
        <circle cx="28" cy="24" r="4.5" stroke={bright} strokeWidth="1.2" />
        <circle cx="28" cy="24" r="1.4" fill={bright} />
      </svg>
    );
  }

  if (themeId === 'caesar' || themeId === 'be-tho') {
    return (
      <svg viewBox="0 0 64 40" fill="none" className="w-12 h-8 opacity-85 shrink-0" aria-hidden="true">
        <path
          d="M32 19C26 11 14 10 14 18C14 25 25 24 32 19ZM32 19C38 11 50 10 50 18C50 25 39 24 32 19Z"
          stroke={bright}
          strokeWidth="1.35"
          fill={accent}
          fillOpacity="0.25"
        />
        <path d="M29 21L23 34M35 21L41 34" stroke={accent} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="32" cy="19" r="3" fill={bright} />
      </svg>
    );
  }

  if (themeId === 'sanzu-haruchiyo' || themeId === 'night-ride') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-9 opacity-85 shrink-0" aria-hidden="true">
        <path
          d="M24 5L29 17.5L42.5 18.5L32 27L35.2 40L24 32.5L12.8 40L16 27L5.5 18.5L19 17.5Z"
          stroke={bright}
          strokeWidth="1.4"
          fill={accent}
          fillOpacity="0.18"
        />
        <path d="M24 19A5 5 0 1 1 20 27" stroke={bright} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (themeId === 'joo-jaekyung' || themeId === 'zhenya') {
    return (
      <svg viewBox="0 0 64 44" fill="none" className="w-12 h-8 opacity-85 shrink-0" aria-hidden="true">
        <rect x="8" y="8" width="24" height="30" rx="3" stroke={bright} strokeWidth="1.3" fill={accent} fillOpacity="0.12" />
        <rect x="32" y="6" width="24" height="30" rx="3" stroke={accent} strokeWidth="1.2" strokeDasharray="3 2" />
        <path d="M20 17L24 23L20 29L16 23Z" fill={bright} />
        <circle cx="44" cy="21" r="4" stroke={bright} strokeWidth="1.2" />
      </svg>
    );
  }

  if (themeId === 'pixel-doodles' || themeId === 'yeo-taeju') {
    return (
      <svg viewBox="0 0 56 44" fill="none" className="w-11 h-8 opacity-85 shrink-0" aria-hidden="true">
        <path
          d="M14 14L26 26M26 14L14 26"
          stroke={bright}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M39 14C37 14 35 15.8 35 18C35 22 41 26 42.5 27.5C44 26 50 22 50 18C50 15.8 48 14 46 14C44.4 14 43.2 15 42.5 16.1C41.8 15 40.6 14 39 14Z"
          stroke={accent}
          strokeWidth="1.5"
          fill={accent}
          fillOpacity="0.22"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 44" fill="none" className="w-11 h-8 opacity-80 shrink-0" aria-hidden="true">
      <path
        d="M28 6L31.4 17.6L43 21L31.4 24.4L28 36L24.6 24.4L13 21L24.6 17.6Z"
        stroke={bright}
        strokeWidth="1.3"
        fill={accent}
        fillOpacity="0.2"
      />
      <circle cx="11" cy="11" r="1.8" fill={accent} />
      <circle cx="45" cy="31" r="1.8" fill={bright} />
    </svg>
  );
};

export const VisitorIdCard: React.FC<VisitorIdCardProps> = ({
  displayName,
  avatarUrl,
  avatarIcon,
  frameId,
  createdAt,
  footprintStats,
  onOpenFrameStudio,
  compact = false,
}) => {
  const { activeTheme } = useSiteTheme();
  const cleanName = displayName.trim() || 'Tri kỷ ẩn danh';
  const equippedFrame = frameId ? AVATAR_FRAME_MAP[frameId] ?? null : null;
  const themeMeta = getThemePassSubtitle(activeTheme.id);
  const passSerial = buildPassSerial(cleanName, activeTheme.id);

  const issuedDate = (() => {
    try {
      const date = createdAt ? new Date(createdAt) : new Date();
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Hôm nay';
    }
  })();

  return (
    <article
      aria-label={`Thẻ Căn Cước Khách Thăm của ${cleanName}`}
      className="shimmer-card-border relative w-full overflow-hidden rounded-[24px] bg-[#121218]/96 border border-[#D4AF37]/65 shadow-[0_18px_46px_rgba(0,0,0,0.84),0_0_26px_rgba(212,175,55,0.2)] p-4 sm:p-5 text-left"
    >
      {/* Ảnh nền theme mờ nhẹ bên trong thẻ thành viên */}
      {activeTheme.bgImageUrl && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <div
            style={{
              backgroundImage: `url(${activeTheme.bgImageUrl})`,
              opacity: 0.16,
            }}
            className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
          />
          <div
            style={{
              background: `linear-gradient(145deg, ${activeTheme.bgColor}CC 0%, ${activeTheme.surfaceColor}E8 60%, ${activeTheme.bgColor}F5 100%)`,
            }}
            className="absolute inset-0"
          />
        </div>
      )}

      {/* Khung viền trang trí bên trong */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-[16px] border border-[#D4AF37]/20"
      />

      <div className="relative z-10 space-y-3.5">
        {/* Header của Thẻ Căn Cước */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#D4AF37]/25">
          <div className="flex items-center gap-2 min-w-0">
            <BlackCatMascot
              size={30}
              variant="badge"
              className="shrink-0 drop-shadow-[0_0_8px_rgba(212,175,55,0.35)]"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#D4AF37] truncate">
                {themeMeta.ornamentSymbol} {themeMeta.title}
              </p>
              <p className="text-[11px] text-[#B8B0A0] truncate">
                {activeTheme.name} · Mã {passSerial}
              </p>
            </div>
          </div>

          <ThemeCardAccessoryOrnament
            themeId={activeTheme.id}
            accent={activeTheme.accentColor}
            bright={activeTheme.brightColor}
          />
        </div>

        {/* Thân thẻ: Avatar + Khung ảnh + Thông tin khách thăm */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          <div className="shrink-0 flex items-center justify-center py-1">
            <UserAvatarBadge
              avatarUrl={avatarUrl}
              avatarIcon={avatarIcon}
              frameId={frameId}
              displayName={cleanName}
              size={compact ? 'lg' : 'xl'}
              reserveFrameSpace
            />
          </div>

          <div className="min-w-0 flex-1 w-full text-center sm:text-left">
            <p className="text-[10.5px] tracking-wider uppercase text-[#B8B0A0]">
              Khách thăm phiên hiện tại · {themeMeta.tagText}
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F3E5AB] leading-snug break-words mt-0.5">
              {cleanName}
            </h3>

            <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs text-[#CFC8B8]">
              {frameId ? (
                <AvatarFrameInlineTag frameId={frameId} />
              ) : (
                <span className="text-[11px] text-[#B8B0A0]">
                  Chưa đeo khung ảnh đại diện
                </span>
              )}
              {onOpenFrameStudio && (
                <button
                  type="button"
                  onClick={onOpenFrameStudio}
                  className="inline-flex items-center gap-1 min-h-[28px] px-2.5 py-0.5 rounded-lg bg-[#0B0B0F]/90 border border-[#D4AF37]/45 text-[11px] font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />
                  <span>{equippedFrame ? 'Đổi khung' : 'Đeo khung'}</span>
                </button>
              )}
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/15 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[11px] text-[#B8B0A0]">
              <span>Ngày cấp: {issuedDate}</span>
              <span aria-hidden="true">·</span>
              <span>Lưu dấu: {activeTheme.shortName}</span>
            </div>
          </div>
        </div>

        {/* Nhật Ký Dấu Chân tích hợp trên thẻ thành viên */}
        <SessionFootprintBar {...footprintStats} variant="card" />
      </div>
    </article>
  );
};
