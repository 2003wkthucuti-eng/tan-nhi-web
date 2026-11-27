import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  ChevronDown,
  Coffee,
  DoorOpen,
  KeyRound,
  Mail,
  Moon,
  MoonStar,
  Palette,
  Scale,
  Share2,
  Sparkles,
  User,
  Wand2,
  X,
} from 'lucide-react';
import { AVATAR_FRAME_MAP } from '../data/avatarFrames';
import { getThemeOriginFromEvent, useSiteTheme } from '../themes/siteThemes';
import type { AvatarFrameId, DefaultAvatarIconId, UserProfile } from '../types/user';
import { playSoftTap } from '../utils/soundEffects';
import { BlackCatMascot } from './BlackCatMascot';
import { SessionFootprintBar, type SessionFootprintStats } from './SessionFootprintBar';
import { UserAvatarBadge } from './UserAvatarBadge';

const QUICK_GENRES = ['Tất cả', 'Tổng tài', 'Fantasy', 'Cổ trang', 'Chữa lành'] as const;

export interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  activeDisplayName: string;
  activeAvatarUrl: string;
  activeAvatarIcon: DefaultAvatarIconId;
  equippedFrameId: AvatarFrameId | null;
  unlockedFramesCount: number;
  totalFramesCount: number;
  footprintStats: SessionFootprintStats;
  selectedGenre: string;
  isWitchingHourActive: boolean;
  isMoonlightSilverMode: boolean;
  onOpenFrameStudio: () => void;
  onOpenProfileModal: () => void;
  onOpenDestinyTarot: () => void;
  onOpenMysticCorner: () => void;
  onOpenDualMatchup: () => void;
  onOpenWhisperMailbox: () => void;
  onOpenMoodDrinkBar: () => void;
  onOpenSecretNotebook: () => void;
  onToggleWitchingHour: () => void;
  onToggleMoonlightSilver: () => void;
  onSelectGenre: (genre: string) => void;
  onShareWebsite: () => void;
  onReplayIntro: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  activeDisplayName,
  activeAvatarUrl,
  activeAvatarIcon,
  equippedFrameId,
  unlockedFramesCount,
  totalFramesCount,
  footprintStats,
  selectedGenre,
  isWitchingHourActive,
  isMoonlightSilverMode,
  onOpenFrameStudio,
  onOpenProfileModal,
  onOpenDestinyTarot,
  onOpenMysticCorner,
  onOpenDualMatchup,
  onOpenWhisperMailbox,
  onOpenMoodDrinkBar,
  onOpenSecretNotebook,
  onToggleWitchingHour,
  onToggleMoonlightSilver,
  onSelectGenre,
  onShareWebsite,
  onReplayIntro,
}) => {
  const { activeTheme, themes, themeId, setThemeId } = useSiteTheme();
  const [isThemeGridExpanded, setIsThemeGridExpanded] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playSoftTap('nav');
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    playSoftTap('nav');
    onClose();
  };

  const runAndClose = (action: () => void) => {
    onClose();
    action();
  };

  const equippedFrame = equippedFrameId ? AVATAR_FRAME_MAP[equippedFrameId] ?? null : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="side-menu-drawer-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu chức năng Ngôi Nhà Nhỏ"
          className="fixed inset-0 z-[65] flex"
        >
          {/* Lớp nền mờ bên ngoài: chạm/bấm vào là tự thu gọn menu */}
          <button
            type="button"
            aria-label="Đóng menu khi chạm ra ngoài"
            onClick={handleClose}
            className="fixed inset-0 bg-[#040407]/72 backdrop-blur-sm cursor-default"
          />

          {/* Ngăn kéo bên trái đồng bộ màu sắc, viền decor và font chữ theo Theme hiện tại */}
          <motion.aside
            initial={{ x: '-102%' }}
            animate={{ x: 0 }}
            exit={{ x: '-102%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 m-1.5 sm:m-2.5 w-[min(344px,calc(100vw-0.75rem))] sm:w-[374px] h-[calc(100%-0.75rem)] sm:h-[calc(100%-1.25rem)] rounded-[24px] bg-[#121218]/96 border border-[#D4AF37]/65 shadow-[0_24px_70px_rgba(0,0,0,0.92),0_0_36px_rgba(212,175,55,0.22)] flex flex-col overflow-hidden"
          >
            {/* Ảnh nền theme mờ nhẹ trong ngăn kéo */}
            {activeTheme.bgImageUrl && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
              >
                <div
                  style={{
                    backgroundImage: `url(${activeTheme.bgImageUrl})`,
                    opacity: Math.min(0.18, activeTheme.bgImageOpacity || 0.16),
                  }}
                  className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
                />
                <div
                  style={{
                    background: `linear-gradient(180deg, ${activeTheme.bgColor}BA 0%, ${activeTheme.bgColor}E3 55%, ${activeTheme.bgColor}F5 100%)`,
                  }}
                  className="absolute inset-0"
                />
              </div>
            )}

            {/* Header của ngăn kéo */}
            <div className="relative z-10 px-4 py-3.5 border-b border-[#D4AF37]/25 flex items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <BlackCatMascot
                  size={34}
                  variant="badge"
                  className="shrink-0 drop-shadow-[0_0_8px_rgba(212,175,55,0.35)]"
                />
                <div className="min-w-0">
                  <p className="font-display text-base sm:text-lg font-semibold text-[#F3E5AB] leading-tight truncate">
                    Ngôi Nhà Nhỏ
                  </p>
                  <p className="text-[11px] text-[#B8B0A0] truncate">
                    {activeTheme.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng menu"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/45 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Nội dung cuộn bên trong ngăn kéo */}
            <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-3.5 sm:p-4 space-y-3.5">
              {/* 1. Hồ sơ & Avatar / Khung Ảnh Đại Diện */}
              <section
                aria-label="Hồ sơ và Khung Ảnh Đại Diện"
                className="rounded-2xl bg-[#0B0B0F]/75 border border-[#D4AF37]/30 p-3 space-y-2.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatarBadge
                    avatarUrl={activeAvatarUrl}
                    avatarIcon={activeAvatarIcon}
                    frameId={equippedFrameId}
                    displayName={activeDisplayName}
                    size="md"
                    reserveFrameSpace
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium tracking-widest uppercase text-[#D4AF37]">
                      {userProfile ? 'Hồ sơ Tri Kỷ' : 'Chế độ xem thử'}
                    </p>
                    <p className="font-display text-base font-semibold text-[#F3E5AB] truncate">
                      {activeDisplayName}
                    </p>
                    <p className="text-[11px] text-[#B8B0A0] truncate">
                      {equippedFrame
                        ? `Khung: ${equippedFrame.name}`
                        : `Đã mở ${unlockedFramesCount}/${totalFramesCount} khung`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap('tap');
                      runAndClose(onOpenFrameStudio);
                    }}
                    className="w-full flex items-center justify-between gap-2 min-h-[42px] px-3 py-2 rounded-xl bg-[#14121B] border border-[#D4AF37]/45 text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <span className="truncate">Avatar & Khung Ảnh Đại Diện</span>
                    </span>
                    <span className="tabular-nums text-[11px] font-semibold text-[#D4AF37] shrink-0">
                      {unlockedFramesCount}/{totalFramesCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap('tap');
                      runAndClose(onOpenProfileModal);
                    }}
                    className="w-full flex items-center justify-between gap-2 min-h-[42px] px-3 py-2 rounded-xl bg-[#121218] border border-[#D4AF37]/35 text-xs font-medium text-[#F5EFE0] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <User className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        {userProfile ? 'Thẻ Căn Cước Khách Thăm' : 'Góc Tri Kỷ (Nhận Thẻ)'}
                      </span>
                    </span>
                    <span className="text-[11px] text-[#B8B0A0] shrink-0">
                      {userProfile ? 'Xem thẻ' : 'Đăng nhập'}
                    </span>
                  </button>
                </div>
              </section>

              {/* 1b. Nhật Ký Dấu Chân trong phiên */}
              <SessionFootprintBar {...footprintStats} variant="drawer" />

              {/* 2. Trải nghiệm đặc biệt */}
              <section
                aria-label="Khám phá và Nghi thức"
                className="rounded-2xl bg-[#0B0B0F]/70 border border-[#D4AF37]/25 p-3 space-y-2"
              >
                <p className="text-[10px] font-medium tracking-widest uppercase text-[#D4AF37] px-0.5">
                  ✦ Khám phá & Nghi thức
                </p>

                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('card');
                    runAndClose(onOpenWhisperMailbox);
                  }}
                  className="w-full flex items-center justify-between gap-2 min-h-[42px] px-3 py-2 rounded-xl bg-[#15121A] border border-[#D4AF37]/40 text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span className="truncate">💌 Hộp Thư Thì Thầm</span>
                  </span>
                  <span className="text-[11px] text-[#B8B0A0] shrink-0">Dấu sáp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('card');
                    runAndClose(onOpenMoodDrinkBar);
                  }}
                  className="w-full flex items-center justify-between gap-2 min-h-[42px] px-3 py-2 rounded-xl bg-[#15121A] border border-[#D4AF37]/40 text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Coffee className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span className="truncate">🍸 Quầy Đồ Uống Tâm Trạng</span>
                  </span>
                  <span className="text-[11px] text-[#B8B0A0] shrink-0">Theo vibe</span>
                </button>

                <button
                  type="button"
                  onClick={() => runAndClose(onOpenDestinyTarot)}
                  className="w-full flex items-center justify-between gap-2 min-h-[42px] px-3 py-2 rounded-xl bg-[#15121A] border border-[#D4AF37]/40 text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span className="truncate">Gặp gỡ định mệnh</span>
                  </span>
                  <span className="text-[11px] text-[#B8B0A0] shrink-0">Tarot 3 lá</span>
                </button>

                <button
                  type="button"
                  onClick={() => runAndClose(onOpenMysticCorner)}
                  className="w-full flex items-center justify-between gap-2 min-h-[42px] px-3 py-2 rounded-xl bg-[#15121A] border border-[#D4AF37]/40 text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Wand2 className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span className="truncate">🔮 Góc Huyền Bí</span>
                  </span>
                  <span className="text-[11px] text-[#B8B0A0] shrink-0">Mini Game</span>
                </button>

                <button
                  type="button"
                  onClick={() => runAndClose(onOpenDualMatchup)}
                  className="w-full flex items-center justify-between gap-2 min-h-[42px] px-3 py-2 rounded-xl bg-[#15121A] border border-[#D4AF37]/40 text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Scale className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span className="truncate">⚖️ Hai Cánh Cửa</span>
                  </span>
                  <span className="text-[11px] text-[#B8B0A0] shrink-0">Chọn 1 trong 2</span>
                </button>
              </section>

              {/* 3. Đổi Theme & Không Khí */}
              <section
                aria-label="Đổi Theme và Không Khí"
                className="rounded-2xl bg-[#0B0B0F]/75 border border-[#D4AF37]/30 p-3 space-y-2.5"
              >
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('tap');
                    setIsThemeGridExpanded((prev) => !prev);
                  }}
                  aria-expanded={isThemeGridExpanded}
                  className="w-full flex items-center justify-between gap-2 min-h-[38px] px-2.5 py-1.5 rounded-xl bg-[#14121B] border border-[#D4AF37]/35 text-xs font-semibold text-[#F3E5AB] hover:border-[#D4AF37] transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Palette className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span className="truncate">Đổi Theme ({activeTheme.shortName})</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-200 ${
                      isThemeGridExpanded ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isThemeGridExpanded && (
                  <div className="grid grid-cols-3 gap-1.5 max-h-[248px] overflow-y-auto pr-0.5">
                    {themes.map((theme) => {
                      const isSelected = theme.id === themeId;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={(e) => {
                            playSoftTap('tap');
                            setThemeId(theme.id, getThemeOriginFromEvent(e));
                          }}
                          aria-pressed={isSelected}
                          title={`${theme.name} — ${theme.mascotLabel}`}
                          style={{
                            backgroundColor: theme.bgColor,
                            borderColor: isSelected ? theme.brightColor : `${theme.accentColor}4D`,
                            boxShadow: isSelected
                              ? `0 0 12px ${theme.accentColor}52, inset 0 0 10px ${theme.accentColor}20`
                              : 'none',
                          }}
                          className="group relative aspect-square rounded-lg border overflow-hidden p-1.5 flex flex-col items-center justify-between text-center transition-transform duration-150 hover:scale-[1.03] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                        >
                          {theme.bgImageUrl && (
                            <div
                              aria-hidden="true"
                              style={{ backgroundImage: `url(${theme.bgImageUrl})` }}
                              className="absolute inset-0 bg-cover bg-center opacity-35 group-hover:opacity-45 transition-opacity"
                            />
                          )}
                          <div
                            aria-hidden="true"
                            style={{
                              background: `linear-gradient(180deg, ${theme.bgColor}66 0%, ${theme.bgColor}DB 74%, ${theme.bgColor}FA 100%)`,
                            }}
                            className="absolute inset-0"
                          />

                          <div className="relative z-10 w-full flex items-center justify-between">
                            <span
                              aria-hidden="true"
                              style={{
                                background: `linear-gradient(135deg, ${theme.swatchFrom}, ${theme.swatchTo})`,
                              }}
                              className="w-2 h-2 rounded-full border border-white/35"
                            />
                            {isSelected && (
                              <span
                                style={{
                                  backgroundColor: theme.brightColor,
                                  color: theme.buttonTextColor,
                                }}
                                className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center shadow-sm"
                              >
                                <Check className="w-2 h-2 stroke-[3]" aria-hidden="true" />
                              </span>
                            )}
                          </div>

                          <div className="relative z-10 flex items-center justify-center my-auto">
                            <BlackCatMascot
                              size={24}
                              variant="badge"
                              themeOverride={theme.id}
                              className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] transition-transform duration-150 group-hover:scale-110"
                            />
                          </div>

                          <span
                            style={{ color: isSelected ? theme.brightColor : theme.textColor }}
                            className="relative z-10 text-[9.5px] font-semibold leading-tight truncate w-full"
                          >
                            {theme.shortName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    aria-pressed={isWitchingHourActive}
                    onClick={onToggleWitchingHour}
                    className={`w-full flex items-center justify-between gap-2 min-h-[38px] px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                      isWitchingHourActive
                        ? 'bg-[#D4AF37]/18 border-[#F3E5AB]/70 text-[#F3E5AB]'
                        : 'bg-[#121218] border-[#D4AF37]/30 text-[#DCD4C6] hover:border-[#D4AF37]/65'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Moon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <span className="truncate">Không khí Đêm Sâu</span>
                    </span>
                    <span className="text-[10.5px] shrink-0">
                      {isWitchingHourActive ? 'Đang bật' : 'Đang tắt'}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={isMoonlightSilverMode}
                    onClick={onToggleMoonlightSilver}
                    className={`w-full flex items-center justify-between gap-2 min-h-[38px] px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                      isMoonlightSilverMode
                        ? 'bg-[#D4AF37]/18 border-[#F3E5AB]/70 text-[#F3E5AB]'
                        : 'bg-[#121218] border-[#D4AF37]/30 text-[#DCD4C6] hover:border-[#D4AF37]/65'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <MoonStar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <span className="truncate">Sắc Bạc Ánh Trăng</span>
                    </span>
                    <span className="text-[10.5px] shrink-0">
                      {isMoonlightSilverMode ? 'Bạc Trăng' : 'Mặc định'}
                    </span>
                  </button>
                </div>
              </section>

              {/* 4. Lọc nhanh thể loại & Tiện ích */}
              <section
                aria-label="Thể loại và tiện ích"
                className="rounded-2xl bg-[#0B0B0F]/70 border border-[#D4AF37]/25 p-3 space-y-2.5"
              >
                <p className="text-[10px] font-medium tracking-widest uppercase text-[#D4AF37] px-0.5">
                  ✦ Thể loại nhanh & Tiện ích
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {QUICK_GENRES.map((genre) => {
                    const active = selectedGenre === genre;
                    return (
                      <button
                        key={genre}
                        type="button"
                        aria-pressed={active}
                        onClick={() => runAndClose(() => onSelectGenre(genre))}
                        className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                          active
                            ? 'bg-[#D4AF37] text-[#0B0B0F] font-semibold'
                            : 'bg-[#121218] border border-[#D4AF37]/30 text-[#DCD4C6] hover:border-[#D4AF37]/65 hover:text-[#F3E5AB]'
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap('card');
                      runAndClose(onOpenSecretNotebook);
                    }}
                    className="w-full flex items-center gap-2 min-h-[38px] px-3 py-1.5 rounded-xl bg-[#121218] border border-[#D4AF37]/30 text-xs font-medium text-[#DCD4C6] hover:text-[#F3E5AB] hover:border-[#D4AF37]/65 transition-all cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span className="truncate">Sổ Tay Bí Mật & Khung Ảnh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => runAndClose(onShareWebsite)}
                    className="w-full flex items-center gap-2 min-h-[38px] px-3 py-1.5 rounded-xl bg-[#121218] border border-[#D4AF37]/30 text-xs font-medium text-[#DCD4C6] hover:text-[#F3E5AB] hover:border-[#D4AF37]/65 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span className="truncate">Chia sẻ trang web</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap('nav');
                      runAndClose(onReplayIntro);
                    }}
                    className="w-full flex items-center gap-2 min-h-[38px] px-3 py-1.5 rounded-xl bg-[#121218] border border-[#D4AF37]/30 text-xs font-medium text-[#DCD4C6] hover:text-[#F3E5AB] hover:border-[#D4AF37]/65 transition-all cursor-pointer"
                  >
                    <DoorOpen className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span className="truncate">Xem lại Màn chào (Intro)</span>
                  </button>
                </div>
              </section>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
