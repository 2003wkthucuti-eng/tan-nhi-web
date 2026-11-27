import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Palette, X } from 'lucide-react';
import { BlackCatMascot } from './BlackCatMascot';
import { GoldenStardust } from './GoldenStardust';
import { getThemeOriginFromEvent, useSiteTheme, type SiteThemeId } from '../themes/siteThemes';
import { playSoftTap } from '../utils/soundEffects';

export type IntroPhase = 'idle' | 'opening' | 'entered';

interface IntroSealDoorsProps {
  phase: IntroPhase;
  onOpenDoor: () => void;
  moonlightMode?: boolean;
}

const ArtDecoCorner: React.FC<{ className?: string; accentColor: string; brightColor: string }> = ({
  className = '',
  accentColor,
  brightColor,
}) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ color: accentColor }}
    className={`pointer-events-none w-10 h-10 sm:w-14 sm:h-14 ${className}`}
  >
    <path d="M4 44V10C4 6.686 6.686 4 10 4H44" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.85" />
    <path d="M10 34V14C10 11.791 11.791 10 14 10H34" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.55" />
    <path d="M4 22H14V4" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.5" />
    <path d="M22 4V14H4" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.5" />
    <path d="M19 15L20.3 17.7L23 19L20.3 20.3L19 23L17.7 20.3L15 19L17.7 17.7Z" fill={brightColor} fillOpacity="0.85" />
    <circle cx="48" cy="4" r="1.4" fill="currentColor" fillOpacity="0.7" />
    <circle cx="4" cy="48" r="1.4" fill="currentColor" fillOpacity="0.7" />
  </svg>
);

const DoorOrnament: React.FC<{ side: 'left' | 'right'; accentColor: string }> = ({
  side,
  accentColor,
}) => (
  <div
    aria-hidden="true"
    style={{
      borderColor: `${accentColor}47`,
      borderRightColor: side === 'left' ? `${accentColor}8C` : `${accentColor}47`,
      borderLeftColor: side === 'right' ? `${accentColor}8C` : `${accentColor}47`,
    }}
    className="pointer-events-none absolute inset-4 sm:inset-7 rounded-2xl border"
  >
    {/* Khung vòm Art Deco dọc theo cánh cửa */}
    <div
      style={{ borderColor: `${accentColor}2E` }}
      className="absolute inset-2.5 sm:inset-4 rounded-xl border flex items-center justify-center"
    >
      <div
        style={{ borderColor: `${accentColor}38` }}
        className={`w-24 sm:w-40 h-56 sm:h-72 rounded-t-full border ${
          side === 'left' ? 'translate-x-1/4' : '-translate-x-1/4'
        }`}
      />
    </div>
  </div>
);

/**
 * Màn hình Intro với Con dấu sáp & Cánh cửa ánh sáng + Nút mở khung vuông chọn Theme đồng bộ trực tiếp.
 */
export const IntroSealDoors: React.FC<IntroSealDoorsProps> = ({
  phase,
  onOpenDoor,
  moonlightMode = false,
}) => {
  const { activeTheme, themeId, setThemeId, themes } = useSiteTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themePickerRef = useRef<HTMLDivElement | null>(null);
  const heartUid = useId().replace(/:/g, '');
  const heartClipId = `introHeartClip-${heartUid}`;
  const heartLeftMaskId = `introHeartLeft-${heartUid}`;
  const heartRightMaskId = `introHeartRight-${heartUid}`;
  const heartFadeMaskId = `introHeartBotFade-${heartUid}`;

  useEffect(() => {
    if (!isThemeMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (themePickerRef.current && !themePickerRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsThemeMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isThemeMenuOpen]);

  useEffect(() => {
    if (phase !== 'idle') {
      setIsThemeMenuOpen(false);
    }
  }, [phase]);

  if (phase === 'entered') return null;

  const isOpening = phase === 'opening';
  const accentColor = moonlightMode ? '#B6C9E4' : activeTheme.accentColor;
  const brightColor = moonlightMode ? '#E4EEF9' : activeTheme.brightColor;

  return (
    <section
      key="intro-seal-doors"
      className={`fixed inset-0 z-50 overflow-hidden ${isOpening ? 'pointer-events-none' : ''}`}
      aria-label="Màn hình chào Ngôi Nhà Nhỏ Của Tần Nhi"
    >
      {/* Nút đổi Theme nhỏ gọn ở góc trên phải -> bấm vào mở ra khung vuông chứa loạt Theme để chọn */}
      <motion.div
        ref={themePickerRef}
        animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -10 : 0 }}
        transition={{ duration: 0.28 }}
        className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-40 flex flex-col items-end"
      >
        <button
          type="button"
          onClick={() => {
            playSoftTap('tap');
            setIsThemeMenuOpen((prev) => !prev);
          }}
          aria-expanded={isThemeMenuOpen}
          aria-label={`Chọn Theme giao diện (hiện tại: ${activeTheme.name})`}
          style={{
            backgroundColor: `${activeTheme.surfaceColor}EB`,
            borderColor: isThemeMenuOpen ? brightColor : `${accentColor}5C`,
            color: brightColor,
            boxShadow: `0 8px 24px rgba(0,0,0,0.55), 0 0 16px ${accentColor}26`,
          }}
          className="inline-flex items-center gap-2 min-h-[38px] px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs font-medium transition-all duration-150 hover:brightness-110 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
        >
          <span
            aria-hidden="true"
            style={{
              background: `linear-gradient(135deg, ${activeTheme.swatchFrom}, ${activeTheme.swatchTo})`,
              boxShadow: `0 0 8px ${activeTheme.accentColor}`,
            }}
            className="w-3 h-3 rounded-full border border-white/35 shrink-0"
          />
          <Palette className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} aria-hidden="true" />
          <span>{activeTheme.shortName}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              isThemeMenuOpen ? 'rotate-180' : ''
            }`}
            style={{ color: accentColor }}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence>
          {isThemeMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-label="Chọn giao diện Ngôi Nhà Nhỏ"
              style={{
                backgroundColor: `${activeTheme.surfaceColor}F5`,
                borderColor: `${accentColor}75`,
                boxShadow: `0 18px 42px rgba(0,0,0,0.88), 0 0 24px ${accentColor}2A`,
              }}
              className="mt-2 w-[228px] sm:w-[248px] rounded-2xl border backdrop-blur-xl p-2.5"
            >
              <div
                style={{ borderBottomColor: `${accentColor}24` }}
                className="flex items-center justify-between gap-1.5 pb-1.5 mb-2 border-b"
              >
                <span
                  style={{ color: brightColor }}
                  className="text-[11px] font-semibold tracking-wide pl-0.5"
                >
                  Chọn Theme
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('nav');
                    setIsThemeMenuOpen(false);
                  }}
                  aria-label="Đóng bảng chọn Theme"
                  style={{ color: activeTheme.mutedTextColor }}
                  className="w-6 h-6 rounded-md inline-flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Lưới vuông 3 cột nhỏ gọn */}
              <div className="grid grid-cols-3 gap-1.5 max-h-[268px] sm:max-h-[286px] overflow-y-auto pr-0.5">
                {themes.map((theme) => {
                  const isSelected = theme.id === themeId;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={(e) => {
                        playSoftTap('tap');
                        setThemeId(theme.id, getThemeOriginFromEvent(e));
                        setIsThemeMenuOpen(false);
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
                      className="group relative aspect-square rounded-xl border overflow-hidden p-1.5 flex flex-col items-center justify-between text-center transition-all duration-150 hover:scale-[1.03] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
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
                          size={26}
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

                {Array.from({
                  length: themes.length % 3 === 0 ? 0 : 3 - (themes.length % 3),
                }).map((_, idx) => (
                  <div
                    key={`reserved-slot-${idx}`}
                    aria-hidden="true"
                    style={{
                      borderColor: `${accentColor}26`,
                      backgroundColor: `${activeTheme.bgColor}66`,
                      color: activeTheme.mutedTextColor,
                    }}
                    className="aspect-square rounded-xl border border-dashed flex flex-col items-center justify-center gap-0.5 opacity-55 select-none"
                  >
                    <span className="text-[10px]" style={{ color: accentColor }}>
                      ✦
                    </span>
                    <span className="text-[8.5px] tracking-tight">Sắp thêm</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hai cánh cửa hoa văn tách sang hai bên */}
      <div className="absolute inset-0 flex">
        {/* Cánh cửa bên trái */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: isOpening ? '-102%' : '0%' }}
          transition={{ duration: 1.08, delay: isOpening ? 0.14 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundColor: activeTheme.bgColor,
            borderRightColor: `${accentColor}80`,
          }}
          className="relative w-1/2 h-full border-r shadow-[10px_0_40px_rgba(0,0,0,0.85)] overflow-hidden transition-colors duration-500"
        >
          {activeTheme.bgImageUrl && (
            <div
              aria-hidden="true"
              style={{
                backgroundImage: `url(${activeTheme.bgImageUrl})`,
                opacity: activeTheme.bgImageOpacity,
              }}
              className="absolute inset-0 w-[200%] h-full bg-cover bg-center blur-[2px] scale-105 transition-opacity duration-500"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: activeTheme.isSpecialTheme
                ? `radial-gradient(circle at 100% 48%, ${accentColor}26 0%, ${activeTheme.bgColor}61 48%, ${activeTheme.bgColor}A6 92%)`
                : `radial-gradient(circle at 100% 48%, ${accentColor}26 0%, ${activeTheme.bgColor}99 48%, ${activeTheme.bgColor}DE 90%)`,
            }}
          />
          <DoorOrnament side="left" accentColor={accentColor} />
          <ArtDecoCorner
            accentColor={accentColor}
            brightColor={brightColor}
            className="absolute top-3 left-3 sm:top-6 sm:left-6"
          />
          <ArtDecoCorner
            accentColor={accentColor}
            brightColor={brightColor}
            className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 -rotate-90"
          />
        </motion.div>

        {/* Cánh cửa bên phải */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: isOpening ? '102%' : '0%' }}
          transition={{ duration: 1.08, delay: isOpening ? 0.14 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundColor: activeTheme.bgColor,
            borderLeftColor: `${accentColor}80`,
          }}
          className="relative w-1/2 h-full border-l shadow-[-10px_0_40px_rgba(0,0,0,0.85)] overflow-hidden transition-colors duration-500"
        >
          {activeTheme.bgImageUrl && (
            <div
              aria-hidden="true"
              style={{
                backgroundImage: `url(${activeTheme.bgImageUrl})`,
                opacity: activeTheme.bgImageOpacity,
              }}
              className="absolute inset-0 -left-full w-[200%] h-full bg-cover bg-center blur-[2px] scale-105 transition-opacity duration-500"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: activeTheme.isSpecialTheme
                ? `radial-gradient(circle at 0% 48%, ${accentColor}26 0%, ${activeTheme.bgColor}61 48%, ${activeTheme.bgColor}A6 92%)`
                : `radial-gradient(circle at 0% 48%, ${accentColor}26 0%, ${activeTheme.bgColor}99 48%, ${activeTheme.bgColor}DE 90%)`,
            }}
          />
          <DoorOrnament side="right" accentColor={accentColor} />
          <ArtDecoCorner
            accentColor={accentColor}
            brightColor={brightColor}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 rotate-90"
          />
          <ArtDecoCorner
            accentColor={accentColor}
            brightColor={brightColor}
            className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 rotate-180"
          />
        </motion.div>
      </div>

      {/* Hạt bụi ánh sáng & họa tiết bay nhẹ trên nền cửa */}
      <motion.div
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{ duration: 0.45 }}
        className="pointer-events-none absolute inset-0"
      >
        <GoldenStardust className="z-10" moonlightMode={moonlightMode} />
      </motion.div>

      {/* Luồng sáng lóe nhẹ ở khe giữa khi cánh cửa hé mở */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={
          isOpening
            ? { opacity: [0, 0.95, 0.6, 0], scaleX: [0.2, 1.3, 2.4, 3.2] }
            : { opacity: 0.18, scaleX: 0.3 }
        }
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-24 sm:w-36 z-20"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor}48 32%, ${brightColor}E0 50%, ${accentColor}48 68%, transparent 100%)`,
        }}
      />

      {/* Nội dung trung tâm & Con dấu sáp phong ấn */}
      {(() => {
        const hasCutoutShowcase =
          themeId === 'collage-hai-be' ||
          themeId === 'bien-dem-sua' ||
          themeId === 'bao-cu-nhac' ||
          themeId === 'pixel-doodles' ||
          themeId === 'sabbath-crew' ||
          themeId === 'night-ride' ||
          themeId === 'ilay-riegrow' ||
          themeId === 'joo-jaekyung' ||
          themeId === 'zhenya' ||
          themeId === 'caesar' ||
          themeId === 'sanzu-haruchiyo' ||
          themeId === 'yeo-taeju' ||
          themeId === 'be-tho';

        const cutoutAccentDecor: Partial<Record<SiteThemeId, { left: string; right: string; glow: string }>> = {
          'bien-dem-sua': {
            left: '🫧',
            right: '🪼',
            glow: 'radial-gradient(circle, rgba(108,182,255,0.45) 0%, rgba(226,242,255,0.22) 52%, transparent 74%)',
          },
          'bao-cu-nhac': {
            left: '♪',
            right: '♫',
            glow: 'radial-gradient(circle, rgba(207,169,114,0.42) 0%, rgba(245,233,211,0.22) 52%, transparent 74%)',
          },
          'pixel-doodles': {
            left: '♡',
            right: '♥',
            glow: 'radial-gradient(circle, rgba(247,154,192,0.48) 0%, rgba(255,242,246,0.28) 52%, transparent 74%)',
          },
          'sabbath-crew': {
            left: '⚡',
            right: '★',
            glow: 'radial-gradient(circle, rgba(229,72,80,0.48) 0%, rgba(242,201,76,0.24) 52%, transparent 74%)',
          },
          'night-ride': {
            left: '★',
            right: '★',
            glow: 'radial-gradient(circle, rgba(240,201,117,0.44) 0%, rgba(247,250,255,0.24) 52%, transparent 74%)',
          },
          'ilay-riegrow': {
            left: '✧',
            right: '✦',
            glow: 'radial-gradient(circle, rgba(255,255,255,0.46) 0%, rgba(242,198,182,0.28) 52%, transparent 74%)',
          },
          'joo-jaekyung': {
            left: '♠',
            right: '🥊',
            glow: 'radial-gradient(circle, rgba(255,255,255,0.38) 0%, rgba(214,216,222,0.22) 52%, transparent 74%)',
          },
          'zhenya': {
            left: '🎞️',
            right: '🦋',
            glow: 'radial-gradient(circle, rgba(245,239,228,0.4) 0%, rgba(216,206,190,0.22) 52%, transparent 74%)',
          },
          'caesar': {
            left: '🎀',
            right: '💋',
            glow: 'radial-gradient(circle, rgba(242,181,196,0.5) 0%, rgba(255,245,244,0.28) 52%, transparent 74%)',
          },
          'sanzu-haruchiyo': {
            left: '★',
            right: '🌀',
            glow: 'radial-gradient(circle, rgba(255,255,255,0.42) 0%, rgba(210,214,224,0.24) 52%, transparent 74%)',
          },
          'yeo-taeju': {
            left: '✕',
            right: '🔥',
            glow: 'radial-gradient(circle, rgba(246,243,235,0.4) 0%, rgba(214,208,194,0.22) 52%, transparent 74%)',
          },
          'be-tho': {
            left: '🎀',
            right: '🌹',
            glow: 'radial-gradient(circle, rgba(230,57,70,0.5) 0%, rgba(255,240,242,0.24) 52%, transparent 74%)',
          },
        };

        const specialDecor = cutoutAccentDecor[themeId];

        return (
          <div
            className={`relative z-30 h-full flex flex-col items-center justify-center px-5 sm:px-6 text-center ${
              hasCutoutShowcase
                ? 'pt-12 pb-6 sm:pt-14 sm:pb-8'
                : 'pt-16 pb-8 sm:pt-20 sm:pb-10'
            }`}
          >
            <motion.div
              animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -10 : 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col items-center max-w-xl mx-auto"
            >
              <div
                style={{ filter: `drop-shadow(0 0 24px ${accentColor}52)` }}
                className={`animate-cat-float transition-all duration-300 ${
                  hasCutoutShowcase ? 'mb-2 sm:mb-3 scale-90 sm:scale-95' : 'mb-3.5 sm:mb-4'
                }`}
              >
                <BlackCatMascot size={108} variant="hero" />
              </div>

              <p
                style={{ color: accentColor }}
                className="text-xs sm:text-sm font-medium tracking-widest mb-1.5 sm:mb-2 transition-colors duration-300"
              >
                {activeTheme.tagline}
              </p>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.12] [text-wrap:balance] gold-shimmer-text">
                Ngôi Nhà Nhỏ Của Tần Nhi
              </h1>

              <div
                className={`w-24 h-px transition-all duration-300 ${
                  hasCutoutShowcase ? 'my-2.5 sm:my-3.5' : 'my-4 sm:my-5'
                }`}
                style={{
                  background: `linear-gradient(to right, transparent, ${accentColor}B3, transparent)`,
                }}
                aria-hidden="true"
              />

              <p
                style={{ color: activeTheme.mutedTextColor }}
                className={`text-xs sm:text-base leading-relaxed max-w-md transition-colors duration-300 ${
                  hasCutoutShowcase ? 'mb-3 sm:mb-4' : 'mb-6 sm:mb-8'
                }`}
              >
                Nơi lưu giữ những nhân vật AI Chatbot dịu dàng và bí ẩn, luôn đợi bạn ghé thăm sau một ngày dài.
              </p>
            </motion.div>

            {/* Con dấu sáp phong ấn cổ điển đổi sắc theo Theme */}
            <div className="relative flex flex-col items-center">
              {/* Collage Hai Bé & Dấu Sáp */}
              {themeId === 'collage-hai-be' && (
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={
                    isOpening
                      ? { opacity: 0, scale: 0.94, y: -12 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none select-none relative z-0 -mb-12 sm:-mb-14 flex items-center justify-center"
                >
                  <div
                    className="absolute -inset-3 rounded-full blur-2xl opacity-55"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(246,240,228,0.45) 0%, rgba(223,149,165,0.28) 48%, transparent 74%)',
                    }}
                  />
                  <span className="absolute -left-4 top-5 text-lg text-[#F6F0E4] drop-shadow-[0_0_8px_rgba(246,240,228,0.85)] animate-pulse">
                    ✦
                  </span>
                  <span className="absolute -right-4 top-8 text-base text-[#DF95A5] drop-shadow-[0_0_8px_rgba(223,149,165,0.85)] animate-pulse">
                    ★
                  </span>
                  <div
                    className="relative w-40 h-44 sm:w-52 sm:h-56 rounded-t-[999px] rounded-b-[28px] overflow-hidden border-[3px] border-[#F6F0E4]/90 shadow-[0_14px_34px_rgba(0,0,0,0.72),0_0_24px_rgba(246,240,228,0.28)]"
                    style={{
                      backgroundColor: '#1E1D24',
                      backgroundImage:
                        "url('/assets/aistudio/78335d250b39f0b102946d1a018dd969_e5721dca.jpg')",
                      backgroundSize: '204% auto',
                      backgroundPosition: '95% 81%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(17,17,21,0.92) 0%, rgba(17,17,21,0.22) 28%, transparent 55%)',
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Theme Đặc Biệt: Khung đặc trưng phía sau dấu sáp (không dùng trái tim cố định cho Caesar / Sanzu / Zhenya) */}
              {specialDecor && activeTheme.bgImageUrl && (
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={
                    isOpening
                      ? { opacity: 0, scale: 0.94, y: -12 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none select-none relative z-0 -mb-14 sm:-mb-16 flex items-center justify-center"
                >
                  <div
                    className="absolute -inset-4 rounded-full blur-2xl opacity-70"
                    style={{ background: specialDecor.glow }}
                  />
                  <span
                    style={{ color: brightColor }}
                    className="absolute -left-2 sm:-left-4 top-6 text-base sm:text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] animate-pulse"
                  >
                    {specialDecor.left}
                  </span>
                  <span
                    style={{ color: accentColor }}
                    className="absolute -right-2 sm:-right-4 top-8 text-base sm:text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] animate-pulse"
                  >
                    {specialDecor.right}
                  </span>

                  {themeId === 'caesar' ? (
                    /* Caesar: Khung nơ ruy băng mềm mại phía sau dấu sáp */
                    <svg
                      viewBox="0 0 220 200"
                      className="relative w-52 h-48 sm:w-64 sm:h-60 overflow-visible"
                      style={{
                        filter: `drop-shadow(0 14px 32px rgba(0,0,0,0.68)) drop-shadow(0 0 20px ${accentColor}59)`,
                      }}
                    >
                      <defs>
                        <clipPath id={`caesarRibbonClip-${heartUid}`}>
                          <path d="M110 20 C145 20 176 32 188 58 C200 84 198 124 182 150 C166 176 138 188 110 188 C82 188 54 176 38 150 C22 124 20 84 32 58 C44 32 75 20 110 20 Z" />
                        </clipPath>
                        <linearGradient id={heartFadeMaskId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="70%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="100%" stopColor={activeTheme.bgColor} stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id={`${heartLeftMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="47%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="56%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </linearGradient>
                        <mask id={heartLeftMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartLeftMaskId}-grad)`} />
                        </mask>
                        <linearGradient id={`${heartRightMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="44%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="53%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                        </linearGradient>
                        <mask id={heartRightMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartRightMaskId}-grad)`} />
                        </mask>
                      </defs>

                      <g clipPath={`url(#caesarRibbonClip-${heartUid})`}>
                        <rect x="0" y="0" width="220" height="200" fill={activeTheme.surfaceColor} />
                        {/* Nửa trái: Caesar chân dung với nơ nhỏ trên tóc */}
                        <g mask={`url(#${heartLeftMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-14"
                            y="-340"
                            width="360"
                            height="640"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        {/* Nửa phải: Chuỗi ánh nhìn cận mặt Caesar */}
                        <g mask={`url(#${heartRightMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-105"
                            y="-172"
                            width="320"
                            height="569"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        <rect x="0" y="0" width="220" height="200" fill={`url(#${heartFadeMaskId})`} />
                      </g>

                      {/* Viền khung mềm mại đôi tông kem - hồng satin */}
                      <path
                        d="M110 20 C145 20 176 32 188 58 C200 84 198 124 182 150 C166 176 138 188 110 188 C82 188 54 176 38 150 C22 124 20 84 32 58 C44 32 75 20 110 20 Z"
                        fill="none"
                        stroke="#FFF5F4"
                        strokeWidth="3"
                        strokeOpacity="0.92"
                      />
                      <path
                        d="M110 14 C148 14 182 28 195 56 C208 85 205 128 187 156 C169 183 140 194 110 194 C80 194 51 183 33 156 C15 128 12 85 25 56 C38 28 72 14 110 14 Z"
                        fill="none"
                        stroke="#F2B5C4"
                        strokeWidth="1.4"
                        strokeDasharray="6 4"
                        strokeOpacity="0.72"
                      />

                      {/* Nơ ruy băng hồng satin lớn trên đỉnh khung */}
                      <g transform="translate(110, 17)">
                        <path
                          d="M-5 2 C-18 14 -30 28 -36 46 C-28 43 -22 39 -16 32 C-11 22 -7 12 -3 4 Z"
                          fill="#F2B5C4"
                          fillOpacity="0.88"
                          stroke="#FFF5F4"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M5 2 C18 14 30 28 36 46 C28 43 22 39 16 32 C11 22 7 12 3 4 Z"
                          fill="#F2B5C4"
                          fillOpacity="0.88"
                          stroke="#FFF5F4"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M-4 0 L-36 -18 C-42 -6 -40 10 -28 16 L-4 4 Z"
                          fill="#F7DCE2"
                          stroke="#FFF5F4"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 0 L36 -18 C42 -6 40 10 28 16 L4 4 Z"
                          fill="#F7DCE2"
                          stroke="#FFF5F4"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                        <ellipse cx="0" cy="1" rx="6.5" ry="5.5" fill="#FFF5F4" stroke="#E59BB0" strokeWidth="1.4" />
                      </g>
                    </svg>
                  ) : themeId === 'sanzu-haruchiyo' ? (
                    /* Sanzu Haruchiyo: Khung sao sọc xoáy góc cạnh phía sau dấu sáp */
                    <svg
                      viewBox="0 0 220 200"
                      className="relative w-52 h-48 sm:w-64 sm:h-60 overflow-visible"
                      style={{
                        filter: `drop-shadow(0 14px 32px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(255,255,255,0.34))`,
                      }}
                    >
                      <defs>
                        <clipPath id={`sanzuStarClip-${heartUid}`}>
                          <polygon points="110,8 140,34 196,26 178,78 212,112 170,144 180,192 110,170 40,192 50,144 8,112 42,78 24,26 80,34" />
                        </clipPath>
                        <pattern id={`sanzuStripes-${heartUid}`} width="10" height="10" patternTransform="rotate(35)" patternUnits="userSpaceOnUse">
                          <rect width="5" height="10" fill="#FFFFFF" />
                          <rect x="5" width="5" height="10" fill="#09090B" />
                        </pattern>
                        <linearGradient id={heartFadeMaskId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="70%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="100%" stopColor={activeTheme.bgColor} stopOpacity="0.92" />
                        </linearGradient>
                        <linearGradient id={`${heartLeftMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="47%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="56%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </linearGradient>
                        <mask id={heartLeftMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartLeftMaskId}-grad)`} />
                        </mask>
                        <linearGradient id={`${heartRightMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="44%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="53%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                        </linearGradient>
                        <mask id={heartRightMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartRightMaskId}-grad)`} />
                        </mask>
                      </defs>

                      {/* Lớp khung sao sọc xoáy lớn phía sau tạo viền sọc trắng đen góc cạnh */}
                      <polygon
                        points="110,2 143,30 203,20 183,76 218,113 174,147 185,197 110,174 35,197 46,147 2,113 37,76 17,20 77,30"
                        fill={`url(#sanzuStripes-${heartUid})`}
                        stroke="#FFFFFF"
                        strokeWidth="1.6"
                      />

                      <g clipPath={`url(#sanzuStarClip-${heartUid})`}>
                        <rect x="0" y="0" width="220" height="200" fill={activeTheme.surfaceColor} />
                        {/* Nửa trái: Sanzu Haruchiyo góc trên trái */}
                        <g mask={`url(#${heartLeftMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-12"
                            y="-6"
                            width="290"
                            height="515"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        {/* Nửa phải: Sanzu đưa tay lên khóe miệng */}
                        <g mask={`url(#${heartRightMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-92"
                            y="-154"
                            width="315"
                            height="560"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        <rect x="0" y="0" width="220" height="200" fill={`url(#${heartFadeMaskId})`} />
                      </g>

                      <polygon
                        points="110,8 140,34 196,26 178,78 212,112 170,144 180,192 110,170 40,192 50,144 8,112 42,78 24,26 80,34"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.4"
                      />

                      {/* Huy hiệu ngôi sao sọc xoáy 5 cánh đặc trưng ở góc trên phải */}
                      <g transform="translate(182, 28) rotate(12)">
                        <path
                          d="M0 -18 L5 -6 L18 -5 L8 4 L11 17 L0 10 L-11 17 L-8 4 L-18 -5 L-5 -6 Z"
                          fill={`url(#sanzuStripes-${heartUid})`}
                          stroke="#FFFFFF"
                          strokeWidth="1.4"
                        />
                        <circle cx="0" cy="1" r="6.5" fill="#09090B" stroke="#FFFFFF" strokeWidth="1" />
                        <path
                          d="M0 1 C0 -0.5 1.8 -1.2 2.8 -0.1 C3.8 1.1 3.1 3.3 1.1 3.8 C-1.4 4.3 -3.5 2 -3.1 -0.6 C-2.7 -3.4 0.4 -5 3.1 -4"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="1.35"
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                  ) : themeId === 'zhenya' ? (
                    /* Zhenya: Khung thẻ phim / hồ sơ cổ điển (cuộn phim noir + băng keo + kẹp giấy) */
                    <svg
                      viewBox="0 0 220 200"
                      className="relative w-52 h-48 sm:w-64 sm:h-60 overflow-visible"
                      style={{
                        filter: `drop-shadow(0 14px 32px rgba(0,0,0,0.82)) drop-shadow(0 0 18px ${accentColor}40)`,
                      }}
                    >
                      <defs>
                        <clipPath id={`zhenyaFilmClip-${heartUid}`}>
                          <rect x="26" y="14" width="168" height="170" rx="6" />
                        </clipPath>
                        <linearGradient id={heartFadeMaskId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="72%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="100%" stopColor={activeTheme.bgColor} stopOpacity="0.92" />
                        </linearGradient>
                      </defs>

                      {/* Thẻ hồ sơ nghiêng nhẹ phía sau cuộn phim */}
                      <rect
                        x="22"
                        y="18"
                        width="174"
                        height="164"
                        rx="4"
                        transform="rotate(-4 110 100)"
                        fill="#1C1B19"
                        stroke="#D8CEBE"
                        strokeOpacity="0.45"
                        strokeWidth="1.2"
                      />

                      {/* Thân khung phim / hồ sơ chính */}
                      <rect
                        x="18"
                        y="10"
                        width="184"
                        height="178"
                        rx="6"
                        fill="#0F0F12"
                        stroke="#F5EFE4"
                        strokeWidth="2"
                        strokeOpacity="0.88"
                      />

                      {/* Lỗ đục cuộn phim cổ điển dọc 2 bên trái & phải */}
                      {[20, 38, 56, 74, 92, 110, 128, 146, 164].map((py) => (
                        <React.Fragment key={py}>
                          <rect x="20.5" y={py} width="3.5" height="9" rx="1" fill="#F5EFE4" fillOpacity="0.72" />
                          <rect x="196" y={py} width="3.5" height="9" rx="1" fill="#F5EFE4" fillOpacity="0.72" />
                        </React.Fragment>
                      ))}

                      <g clipPath={`url(#zhenyaFilmClip-${heartUid})`}>
                        <rect x="26" y="14" width="168" height="170" fill={activeTheme.surfaceColor} />
                        <image
                          href={activeTheme.bgImageUrl}
                          x="-24"
                          y="-94"
                          width="268"
                          height="476"
                          preserveAspectRatio="xMidYMid slice"
                        />
                        <rect x="26" y="14" width="168" height="170" fill={`url(#${heartFadeMaskId})`} />
                      </g>

                      <rect
                        x="26"
                        y="14"
                        width="168"
                        height="170"
                        rx="4"
                        fill="none"
                        stroke="#D8CEBE"
                        strokeWidth="1.1"
                        strokeOpacity="0.65"
                      />

                      {/* Miếng băng keo giấy cổ điển dán góc trên phải */}
                      <rect
                        x="166"
                        y="4"
                        width="38"
                        height="13"
                        rx="1.5"
                        transform="rotate(22 185 10.5)"
                        fill="#EDE3D2"
                        fillOpacity="0.45"
                        stroke="#F5EFE4"
                        strokeOpacity="0.55"
                        strokeWidth="0.9"
                      />

                      {/* Kẹp giấy bạc đính hồ sơ ở góc trên trái */}
                      <path
                        d="M35 2V22C35 25.5 41 25.5 41 22V6C41 3.5 37 3.5 37 6V18"
                        fill="none"
                        stroke="#F5EFE4"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      {/* Vương miện phác thảo nhỏ trên đỉnh khung */}
                      <path
                        d="M99 10L103 2L110 7L117 2L121 10Z"
                        fill="none"
                        stroke="#F5EFE4"
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : themeId === 'yeo-taeju' ? (
                    /* Yeo Taeju: Khung nét vẽ tay / giấy nháp cắt dán doodle */
                    <svg
                      viewBox="0 0 220 200"
                      className="relative w-52 h-48 sm:w-64 sm:h-60 overflow-visible"
                      style={{
                        filter: `drop-shadow(0 14px 30px rgba(0,0,0,0.82)) drop-shadow(0 0 18px ${accentColor}40)`,
                      }}
                    >
                      <defs>
                        <clipPath id={`taejuDoodleClip-${heartUid}`}>
                          <polygon points="18,16 34,12 52,18 72,11 94,17 114,11 136,17 156,12 178,18 198,13 204,176 184,186 164,179 144,187 122,180 100,188 78,180 56,187 34,179 16,185" />
                        </clipPath>
                        <linearGradient id={heartFadeMaskId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="70%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="100%" stopColor={activeTheme.bgColor} stopOpacity="0.92" />
                        </linearGradient>
                        <linearGradient id={`${heartLeftMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="47%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="56%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </linearGradient>
                        <mask id={heartLeftMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartLeftMaskId}-grad)`} />
                        </mask>
                        <linearGradient id={`${heartRightMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="44%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="53%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                        </linearGradient>
                        <mask id={heartRightMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartRightMaskId}-grad)`} />
                        </mask>
                      </defs>

                      {/* Tờ giấy nháp kẻ lưới nghiêng phía sau */}
                      <rect
                        x="14"
                        y="12"
                        width="192"
                        height="174"
                        rx="3"
                        transform="rotate(-4 110 100)"
                        fill="#232428"
                        stroke="#F6F3EB"
                        strokeOpacity="0.45"
                        strokeWidth="1.4"
                        strokeDasharray="6 3"
                      />

                      <g clipPath={`url(#taejuDoodleClip-${heartUid})`}>
                        <rect x="0" y="0" width="220" height="200" fill={activeTheme.surfaceColor} />
                        {/* Nửa trái: Nét nghiêng Yeo Taeju */}
                        <g mask={`url(#${heartLeftMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-34"
                            y="-208"
                            width="290"
                            height="515"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        {/* Nửa phải: Yeo Taeju cười rạng rỡ */}
                        <g mask={`url(#${heartRightMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-68"
                            y="-110"
                            width="275"
                            height="489"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        <rect x="0" y="0" width="220" height="200" fill={`url(#${heartFadeMaskId})`} />
                      </g>

                      {/* Viền nét vẽ tay hai lớp quanh tờ cắt dán */}
                      <polygon
                        points="18,16 34,12 52,18 72,11 94,17 114,11 136,17 156,12 178,18 198,13 204,176 184,186 164,179 144,187 122,180 100,188 78,180 56,187 34,179 16,185"
                        fill="none"
                        stroke="#F6F3EB"
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 21C14 68 15 130 13 179M207 18C209 70 206 128 208 175"
                        fill="none"
                        stroke="#D6D0C2"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeOpacity="0.65"
                      />

                      {/* Nét gạch X vẽ tay lớn góc trái */}
                      <path
                        d="M10 86L30 108M29 85L9 109"
                        stroke="#F6F3EB"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10 86L30 108M29 85L9 109"
                        stroke="#101113"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />

                      {/* Doodle bật lửa đen góc trên trái */}
                      <g transform="translate(22, 2) rotate(-14)">
                        <rect x="0" y="7" width="16" height="19" rx="2" fill="#18191C" stroke="#F6F3EB" strokeWidth="1.5" />
                        <path d="M1 7L-4 -1L10 -3L14 6" fill="#2A2B30" stroke="#F6F3EB" strokeWidth="1.3" strokeLinejoin="round" />
                        <path d="M8 5.5C6.2 3 7.5 0.2 9.6 -1C11 0.8 11.2 3.2 9.6 5.5Z" fill="#F6F3EB" />
                      </g>

                      {/* Trái tim mắt vẽ tay giữa đỉnh khung */}
                      <g transform="translate(110, 14)">
                        <path
                          d="M0 11C0 11 -13 2 -13 -6C-13 -11 -8.5 -14 -4 -14C-1.5 -14 0 -12 0 -10C0 -12 1.5 -14 4 -14C8.5 -14 13 -11 13 -6C13 2 0 11 0 11Z"
                          fill="#101113"
                          stroke="#F6F3EB"
                          strokeWidth="1.6"
                        />
                        <ellipse cx="0" cy="-4" rx="7" ry="4.2" fill="#F6F3EB" />
                        <circle cx="0" cy="-4" r="2.2" fill="#101113" />
                      </g>

                      {/* Mặt cười doodle góc trên phải */}
                      <g transform="translate(188, 16) rotate(12)">
                        <circle cx="0" cy="0" r="11" fill="#191A1D" stroke="#F6F3EB" strokeWidth="1.7" />
                        <circle cx="-3.5" cy="-2" r="1.4" fill="#F6F3EB" />
                        <circle cx="3.5" cy="-2" r="1.4" fill="#F6F3EB" />
                        <path d="M-4.5 2.5C-2 5.5 2 5.5 4.5 2.5" stroke="#F6F3EB" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                      </g>
                    </svg>
                  ) : themeId === 'be-tho' ? (
                    /* Bé Thỏ: Khung nơ đỏ & hoa hồng sắc nét phía sau dấu sáp */
                    <svg
                      viewBox="0 0 220 200"
                      className="relative w-52 h-48 sm:w-64 sm:h-60 overflow-visible"
                      style={{
                        filter: `drop-shadow(0 14px 32px rgba(0,0,0,0.82)) drop-shadow(0 0 22px ${accentColor}59)`,
                      }}
                    >
                      <defs>
                        <clipPath id={`beThoCrispClip-${heartUid}`}>
                          <polygon points="110,16 176,30 198,82 184,152 110,186 36,152 22,82 44,30" />
                        </clipPath>
                        <linearGradient id={heartFadeMaskId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="70%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="100%" stopColor={activeTheme.bgColor} stopOpacity="0.92" />
                        </linearGradient>
                        <linearGradient id={`${heartLeftMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="47%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="56%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </linearGradient>
                        <mask id={heartLeftMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartLeftMaskId}-grad)`} />
                        </mask>
                        <linearGradient id={`${heartRightMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="44%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="53%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                        </linearGradient>
                        <mask id={heartRightMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartRightMaskId}-grad)`} />
                        </mask>
                      </defs>

                      {/* Viền ngoài góc cạnh màu đỏ thẫm */}
                      <polygon
                        points="110,8 182,24 206,80 190,158 110,194 30,158 14,80 38,24"
                        fill="#2A0B12"
                        stroke="#E63946"
                        strokeWidth="1.8"
                      />

                      <g clipPath={`url(#beThoCrispClip-${heartUid})`}>
                        <rect x="0" y="0" width="220" height="200" fill={activeTheme.surfaceColor} />
                        {/* Nửa trái: Taekjoo gile đỏ */}
                        <g mask={`url(#${heartLeftMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-58"
                            y="-295"
                            width="310"
                            height="551"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        {/* Nửa phải: Taekjoo nơ đỏ trên tóc & hoa hồng */}
                        <g mask={`url(#${heartRightMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-102"
                            y="-336"
                            width="315"
                            height="560"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        <rect x="0" y="0" width="220" height="200" fill={`url(#${heartFadeMaskId})`} />
                      </g>

                      <polygon
                        points="110,16 176,30 198,82 184,152 110,186 36,152 22,82 44,30"
                        fill="none"
                        stroke="#FFF0F2"
                        strokeWidth="2.4"
                        strokeLinejoin="miter"
                      />

                      {/* Nơ đỏ sắc nét lớn trên đỉnh khung */}
                      <g transform="translate(110, 17)">
                        <path d="M-4 3L-26 30L-14 26L-2 5Z" fill="#9E1622" stroke="#FFF0F2" strokeWidth="1" />
                        <path d="M4 3L26 30L14 26L2 5Z" fill="#9E1622" stroke="#FFF0F2" strokeWidth="1" />
                        <path d="M-3 0L-34 -16L-28 12L-3 4Z" fill="#E63946" stroke="#FFF0F2" strokeWidth="1.3" strokeLinejoin="miter" />
                        <path d="M3 0L34 -16L28 12L3 4Z" fill="#E63946" stroke="#FFF0F2" strokeWidth="1.3" strokeLinejoin="miter" />
                        <polygon points="0,-5 6,1 0,7 -6,1" fill="#FFF0F2" stroke="#E63946" strokeWidth="1.4" />
                      </g>

                      {/* Hoa hồng đỏ sắc nét góc trái & góc phải khung */}
                      <g transform="translate(28, 146)">
                        <polygon points="0,-13 5,-6 13,-4 8,3 11,11 0,7 -11,11 -8,3 -13,-4 -5,-6" fill="#C91F2F" stroke="#FFF0F2" strokeWidth="1" />
                        <path d="M-4 -1C-1.5 -4.5 3 -4.5 4.5 -1C5.5 1.5 3 4 0 4C-2.5 4 -4.5 2 -3.5 0" fill="none" stroke="#FFF0F2" strokeWidth="1.2" strokeLinecap="round" />
                      </g>
                      <g transform="translate(192, 146)">
                        <polygon points="0,-13 5,-6 13,-4 8,3 11,11 0,7 -11,11 -8,3 -13,-4 -5,-6" fill="#C91F2F" stroke="#FFF0F2" strokeWidth="1" />
                        <path d="M-4 -1C-1.5 -4.5 3 -4.5 4.5 -1C5.5 1.5 3 4 0 4C-2.5 4 -4.5 2 -3.5 0" fill="none" stroke="#FFF0F2" strokeWidth="1.2" strokeLinecap="round" />
                      </g>
                    </svg>
                  ) : themeId === 'ilay-riegrow' ? (
                    /* Ilay Riegrow: Khung viền ren trắng & ánh sao lấp lánh (không dùng trái tim) */
                    <svg
                      viewBox="0 0 220 200"
                      className="relative w-52 h-48 sm:w-64 sm:h-60 overflow-visible"
                      style={{
                        filter: `drop-shadow(0 14px 32px rgba(0,0,0,0.72)) drop-shadow(0 0 24px rgba(255,255,255,0.42))`,
                      }}
                    >
                      <defs>
                        <clipPath id={`ilayLaceClip-${heartUid}`}>
                          <rect x="26" y="18" width="168" height="168" rx="84" />
                        </clipPath>
                        <linearGradient id={heartFadeMaskId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="72%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="100%" stopColor={activeTheme.bgColor} stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id={`${heartLeftMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="47%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="56%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </linearGradient>
                        <mask id={heartLeftMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartLeftMaskId}-grad)`} />
                        </mask>
                        <linearGradient id={`${heartRightMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="44%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="53%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                        </linearGradient>
                        <mask id={heartRightMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartRightMaskId}-grad)`} />
                        </mask>
                      </defs>

                      {/* Vòng ren trắng sò điệp (scalloped lace ring) bao quanh */}
                      <circle
                        cx="110"
                        cy="102"
                        r="90"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="9"
                        strokeDasharray="1.5 9.5"
                        strokeLinecap="round"
                        strokeOpacity="0.9"
                      />
                      <circle
                        cx="110"
                        cy="102"
                        r="90"
                        fill="none"
                        stroke="#F2C6B6"
                        strokeWidth="2.4"
                        strokeDasharray="3 8"
                        strokeLinecap="round"
                        strokeOpacity="0.7"
                      />

                      <g clipPath={`url(#ilayLaceClip-${heartUid})`}>
                        <rect x="26" y="18" width="168" height="168" fill={activeTheme.surfaceColor} />
                        {/* Nửa trái: Ilay mỉm cười */}
                        <g mask={`url(#${heartLeftMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-8"
                            y="-4"
                            width="310"
                            height="551"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        {/* Nửa phải: Ilay góc nghiêng dưới ánh nắng */}
                        <g mask={`url(#${heartRightMaskId})`}>
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-54"
                            y="-175"
                            width="285"
                            height="507"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </g>
                        <rect x="26" y="18" width="168" height="168" fill={`url(#${heartFadeMaskId})`} />
                      </g>

                      {/* Viền khung ren kép trắng tinh khiết */}
                      <circle cx="110" cy="102" r="84" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeOpacity="0.96" />
                      <circle cx="110" cy="102" r="79" fill="none" stroke="#F2C6B6" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.75" />

                      {/* Nơ ren trắng nhỏ xinh trên đỉnh khung */}
                      <g transform="translate(110, 14)">
                        <path d="M-3 0L-21 -10C-24 -3 -22 5 -15 8L-3 3Z" fill="#FFFFFF" stroke="#F2C6B6" strokeWidth="1.2" />
                        <path d="M3 0L21 -10C24 -3 22 5 15 8L3 3Z" fill="#FFFFFF" stroke="#F2C6B6" strokeWidth="1.2" />
                        <circle cx="0" cy="1" r="4" fill="#FFFFFF" stroke="#F2C6B6" strokeWidth="1.2" />
                      </g>

                      {/* Ánh sao 4 cánh lấp lánh quanh khung ren */}
                      <path d="M32 34L34.5 41L41.5 43.5L34.5 46L32 53L29.5 46L22.5 43.5L29.5 41Z" fill="#FFFFFF" />
                      <path d="M188 38L190 43.5L195.5 45.5L190 47.5L188 53L186 47.5L180.5 45.5L186 43.5Z" fill="#FFFFFF" />
                      <path d="M184 148L185.8 153L190.8 154.8L185.8 156.6L184 161.6L182.2 156.6L177.2 154.8L182.2 153Z" fill="#F2C6B6" />
                    </svg>
                  ) : (
                    /* Các Theme đặc biệt trước đó giữ nguyên khung trái tim lớn */
                    <svg
                      viewBox="0 0 220 200"
                      className="relative w-52 h-48 sm:w-64 sm:h-60 overflow-visible"
                      style={{
                        filter: `drop-shadow(0 14px 32px rgba(0,0,0,0.72)) drop-shadow(0 0 20px ${accentColor}4D)`,
                      }}
                    >
                      <defs>
                        <clipPath id={heartClipId}>
                          <path d="M110 186 C110 186 16 128 16 64 C16 30 42 12 69 12 C88 12 103 23 110 37 C117 23 132 12 151 12 C178 12 204 30 204 64 C204 128 110 186 110 186 Z" />
                        </clipPath>

                        <linearGradient id={heartFadeMaskId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="68%" stopColor={activeTheme.bgColor} stopOpacity="0" />
                          <stop offset="100%" stopColor={activeTheme.bgColor} stopOpacity="0.88" />
                        </linearGradient>

                        <linearGradient id={`${heartLeftMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="46%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="56%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </linearGradient>
                        <mask id={heartLeftMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartLeftMaskId}-grad)`} />
                        </mask>

                        <linearGradient id={`${heartRightMaskId}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="44%" stopColor="#FFFFFF" stopOpacity="0" />
                          <stop offset="54%" stopColor="#FFFFFF" stopOpacity="1" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                        </linearGradient>
                        <mask id={heartRightMaskId}>
                          <rect x="0" y="0" width="220" height="200" fill={`url(#${heartRightMaskId}-grad)`} />
                        </mask>
                      </defs>

                      <g clipPath={`url(#${heartClipId})`}>
                        <rect x="0" y="0" width="220" height="200" fill={activeTheme.surfaceColor} />

                        {themeId === 'bien-dem-sua' && (
                          <>
                            <g mask={`url(#${heartLeftMaskId})`}>
                              <image
                                href={activeTheme.bgImageUrl}
                                x="-62"
                                y="-116"
                                width="315"
                                height="560"
                                preserveAspectRatio="xMidYMid slice"
                              />
                            </g>
                            <g mask={`url(#${heartRightMaskId})`}>
                              <image
                                href={activeTheme.bgImageUrl}
                                x="-16"
                                y="-260"
                                width="350"
                                height="622"
                                preserveAspectRatio="xMidYMid slice"
                              />
                            </g>
                          </>
                        )}

                        {themeId === 'bao-cu-nhac' && (
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-44"
                            y="-26"
                            width="308"
                            height="548"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        )}

                        {themeId === 'pixel-doodles' && (
                          <image
                            href={activeTheme.bgImageUrl}
                            x="6"
                            y="-242"
                            width="632"
                            height="1124"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        )}

                        {themeId === 'sabbath-crew' && (
                          <>
                            <g mask={`url(#${heartLeftMaskId})`}>
                              <image
                                href={activeTheme.bgImageUrl}
                                x="-16"
                                y="4"
                                width="440"
                                height="782"
                                preserveAspectRatio="xMidYMid slice"
                              />
                            </g>
                            <g mask={`url(#${heartRightMaskId})`}>
                              <image
                                href={activeTheme.bgImageUrl}
                                x="-125"
                                y="-85"
                                width="480"
                                height="853"
                                preserveAspectRatio="xMidYMid slice"
                              />
                            </g>
                          </>
                        )}

                        {themeId === 'night-ride' && (
                          <image
                            href={activeTheme.bgImageUrl}
                            x="-22"
                            y="-12"
                            width="264"
                            height="469"
                            preserveAspectRatio="xMidYMid slice"
                          />
                        )}

                        {themeId === 'joo-jaekyung' && (
                          <>
                            <g mask={`url(#${heartLeftMaskId})`}>
                              <image
                                href={activeTheme.bgImageUrl}
                                x="-135"
                                y="-212"
                                width="400"
                                height="711"
                                preserveAspectRatio="xMidYMid slice"
                              />
                            </g>
                            <g mask={`url(#${heartRightMaskId})`}>
                              <image
                                href={activeTheme.bgImageUrl}
                                x="-148"
                                y="4"
                                width="370"
                                height="658"
                                preserveAspectRatio="xMidYMid slice"
                              />
                            </g>
                          </>
                        )}

                        <rect x="0" y="0" width="220" height="200" fill={`url(#${heartFadeMaskId})`} />
                      </g>

                      <path
                        d="M110 186 C110 186 16 128 16 64 C16 30 42 12 69 12 C88 12 103 23 110 37 C117 23 132 12 151 12 C178 12 204 30 204 64 C204 128 110 186 110 186 Z"
                        fill="none"
                        stroke={brightColor}
                        strokeWidth="3.2"
                        strokeOpacity="0.92"
                      />
                      <path
                        d="M110 192 C110 192 10 132 10 64 C10 26 39 6 69 6 C89 6 104 17 110 30 C116 17 131 6 151 6 C181 6 210 26 210 64 C210 132 110 192 110 192 Z"
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="1.2"
                        strokeOpacity="0.55"
                        strokeDasharray={
                          themeId === 'pixel-doodles' || themeId === 'sabbath-crew' ? '5 4' : undefined
                        }
                      />
                    </svg>
                  )}
                </motion.div>
              )}

          <button
            type="button"
            onClick={onOpenDoor}
            disabled={isOpening}
            aria-label="Chạm vào con dấu sáp để mở cửa Ngôi Nhà Nhỏ Của Tần Nhi"
            className="group relative z-10 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0E] rounded-full"
          >
            {/* Vòng hào quang nhẹ phía sau con dấu */}
            <motion.span
              aria-hidden="true"
              animate={
                isOpening
                  ? { opacity: [0.9, 0], scale: [1, 1.75] }
                  : { opacity: [0.45, 0.8, 0.45], scale: [0.97, 1.05, 0.97] }
              }
              transition={
                isOpening
                  ? { duration: 0.5, ease: 'easeOut' }
                  : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
              }
              className="pointer-events-none absolute -inset-4 rounded-full"
              style={{
                background: `radial-gradient(circle, ${brightColor}61 0%, ${accentColor}24 52%, transparent 74%)`,
              }}
            />

            {/* Nửa trái & nửa phải của con dấu sáp để tạo hiệu ứng vỡ tách đôi khi bấm */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              {/* Nửa trái con dấu */}
              <motion.div
                animate={
                  isOpening
                    ? { x: -24, y: -6, rotate: -18, opacity: 0 }
                    : { x: 0, y: 0, rotate: 0, opacity: 1 }
                }
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                style={{ clipPath: 'inset(0 50% 0 0)' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <WaxSealArtwork />
              </motion.div>

              {/* Nửa phải con dấu */}
              <motion.div
                animate={
                  isOpening
                    ? { x: 24, y: 6, rotate: 18, opacity: 0 }
                    : { x: 0, y: 0, rotate: 0, opacity: 1 }
                }
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                style={{ clipPath: 'inset(0 0 0 50%)' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <WaxSealArtwork />
              </motion.div>
            </div>
          </button>

          <motion.span
            animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? 6 : 0 }}
            transition={{ duration: 0.28 }}
            style={{ color: brightColor }}
            className="mt-3.5 text-xs sm:text-sm font-medium tracking-widest uppercase transition-colors duration-300"
          >
            Chạm con dấu · Gõ cửa nhà nhỏ
          </motion.span>
            </div>
          </div>
        );
      })()}
    </section>
  );
};

/**
 * Đồ họa con dấu sáp ánh kim đổi sắc & họa tiết mèo theo Theme hiện tại.
 */
const WaxSealArtwork: React.FC = () => {
  const { activeTheme, themeId } = useSiteTheme();
  const uid = useId().replace(/:/g, '');
  const outerId = `waxOuter-${uid}`;
  const innerId = `waxInner-${uid}`;
  const [o0, o1, o2, o3] = activeTheme.waxOuter;
  const [i0, i1, i2] = activeTheme.waxInner;

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 8px 22px ${activeTheme.accentColor}73)` }}
      className="w-full h-full transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
    >
      <defs>
        <radialGradient id={outerId} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor={o0} />
          <stop offset="38%" stopColor={o1} />
          <stop offset="78%" stopColor={o2} />
          <stop offset="100%" stopColor={o3} />
        </radialGradient>
        <radialGradient id={innerId} cx="42%" cy="38%" r="64%">
          <stop offset="0%" stopColor={i0} />
          <stop offset="65%" stopColor={i1} />
          <stop offset="100%" stopColor={i2} />
        </radialGradient>
      </defs>

      {/* Viền sáp lượn sóng cổ điển */}
      <path
        d="M60 5 C70 4, 78 9, 86 12 C95 15, 102 22, 106 31 C111 40, 115 49, 114 60 C115 71, 110 80, 105 89 C100 98, 93 105, 84 109 C75 113, 68 116, 58 115 C48 115, 40 112, 31 107 C22 103, 16 96, 12 87 C7 78, 5 69, 6 58 C5 48, 9 39, 14 30 C19 21, 26 15, 35 11 C43 7, 51 6, 60 5 Z"
        fill={`url(#${outerId})`}
        stroke={o0}
        strokeOpacity="0.58"
        strokeWidth="1.2"
      />

      {/* Lòng dập nổi bên trong */}
      <circle
        cx="60"
        cy="60"
        r="41"
        fill={`url(#${innerId})`}
        stroke={o0}
        strokeOpacity="0.65"
        strokeWidth="1.6"
      />
      <circle
        cx="60"
        cy="60"
        r="36"
        stroke={o3}
        strokeOpacity="0.55"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Sao nhỏ 4 cánh trên/dưới quanh con dấu */}
      <path d="M60 21L61.2 24.8L65 26L61.2 27.2L60 31L58.8 27.2L55 26L58.8 24.8Z" fill={o0} fillOpacity="0.85" />
      <path d="M60 89L61.2 92.8L65 94L61.2 95.2L60 99L58.8 95.2L55 94L58.8 92.8Z" fill={o0} fillOpacity="0.72" />

      {/* Hình chú mèo khắc nổi ở trung tâm con dấu */}
      <g transform="translate(0, 2)">
        {/* Đuôi cong */}
        <path
          d="M72 78C82 78 88 72 88 64C88 58 83 56 81 59"
          stroke="#120E06"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Thân mèo */}
        <path
          d="M46 80C45 68 48 59 53 56H67C72 59 75 68 74 80C67 82 53 82 46 80Z"
          fill="#161108"
          stroke={o0}
          strokeOpacity="0.45"
          strokeWidth="0.9"
        />
        {/* Đầu & tai mèo */}
        <path
          d="M45 45L43.5 31L53 38C57 36.5 63 36.5 67 38L76.5 31L75 45C76.5 51 71 57 60 57C49 57 43.5 51 45 45Z"
          fill="#161108"
          stroke={o0}
          strokeOpacity="0.5"
          strokeWidth="0.9"
        />

        {/* Dấu ấn phụ kiện nhỏ theo theme ngay trên con dấu */}
        {themeId === 'gothic-lily' && (
          <path d="M54 58L60 61L66 58L64 63L60 60.5L56 63Z" fill={o0} fillOpacity="0.85" />
        )}
        {themeId === 'velvet-vinyl' && (
          <path d="M43 44C43 32 50 26 60 26C70 26 77 32 77 44" stroke={o0} strokeWidth="1.5" strokeOpacity="0.85" />
        )}
        {themeId === 'rose-nebula' && (
          <path d="M56 36L58 31L60 34L62 31L64 36Z" fill={o0} fillOpacity="0.9" />
        )}
        {themeId === 'bong-bong-sua' && (
          <g fill="none" stroke={o0} strokeOpacity="0.82">
            <circle cx="43" cy="29" r="3.4" strokeWidth="1" />
            <circle cx="77" cy="30" r="2.6" strokeWidth="0.9" />
          </g>
        )}
        {themeId === 'collage-hai-be' && (
          <path d="M72 32L73.2 35L76.2 36L73.2 37L72 40L70.8 37L67.8 36L70.8 35Z" fill={o0} fillOpacity="0.9" />
        )}
        {themeId === 'bien-dem-sua' && (
          <path d="M40 31C40 27.5 42.5 25.5 45 25.5C47.5 25.5 50 27.5 50 31H40Z" fill={o0} fillOpacity="0.78" />
        )}
        {themeId === 'bao-cu-nhac' && (
          <circle cx="66.5" cy="46.5" r="4.2" stroke={o0} strokeWidth="0.95" fill="none" strokeOpacity="0.85" />
        )}
        {themeId === 'pixel-doodles' && (
          <path d="M58 29H60V30.5H61.5V29H63.5V31.5H61.5V33H60V34.5H58.5V33H57V31.5H56.5V29H58Z" fill={o0} fillOpacity="0.92" />
        )}
        {themeId === 'sabbath-crew' && (
          <path d="M61 28L56.5 34.5H60L59 40L64 33H60.5L61 28Z" fill={o0} fillOpacity="0.92" />
        )}
        {themeId === 'night-ride' && (
          <g fill={o0} fillOpacity="0.9">
            <circle cx="51" cy="31" r="1.4" />
            <circle cx="60" cy="29" r="1.7" />
            <circle cx="69" cy="31" r="1.4" />
          </g>
        )}
        {themeId === 'ilay-riegrow' && (
          <path d="M60 27L61.6 31.4L66 33L61.6 34.6L60 39L58.4 34.6L54 33L58.4 31.4Z" fill={o0} fillOpacity="0.94" />
        )}
        {themeId === 'joo-jaekyung' && (
          <path
            d="M60 27.5C60 27.5 56 31 56 33.4C56 34.8 57.1 35.6 58.3 35.6C59 35.6 59.6 35.2 60 34.6C60.4 35.2 61 35.6 61.7 35.6C62.9 35.6 64 34.8 64 33.4C64 31 60 27.5 60 27.5ZM59.2 35L58.3 37.5H61.7L60.8 35H59.2Z"
            fill={o0}
            fillOpacity="0.92"
          />
        )}
        {themeId === 'zhenya' && (
          <path d="M55 34L57 29L60 32L63 29L65 34Z" fill={o0} fillOpacity="0.95" />
        )}
        {themeId === 'caesar' && (
          <g fill={o0} fillOpacity="0.94">
            <path d="M59 59L52.5 55.5C51.8 58 52.2 60.5 54 62L59 59.8Z" />
            <path d="M61 59L67.5 55.5C68.2 58 67.8 60.5 66 62L61 59.8Z" />
            <circle cx="60" cy="59.4" r="1.4" />
          </g>
        )}
        {themeId === 'sanzu-haruchiyo' && (
          <path
            d="M60 27L61.8 31.2L66.4 31.6L62.8 34.6L63.8 39L60 36.6L56.2 39L57.2 34.6L53.6 31.6L58.2 31.2Z"
            fill={o0}
            fillOpacity="0.95"
          />
        )}
        {themeId === 'yeo-taeju' && (
          <path
            d="M55.5 29L64.5 38M64.5 29L55.5 38"
            stroke={o0}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeOpacity="0.94"
          />
        )}
        {themeId === 'be-tho' && (
          <g fill={o0} fillOpacity="0.95">
            <path d="M59 59L52 55.5L53 62L59 59.8Z" />
            <path d="M61 59L68 55.5L67 62L61 59.8Z" />
            <polygon points="60,57.5 61.6,59.2 60,60.9 58.4,59.2" />
          </g>
        )}

        {/* Đôi mắt sáng nổi bật trên nền khắc đen */}
        <ellipse cx="53.5" cy="46.5" rx="2.3" ry="2.8" fill={o0} />
        <ellipse cx="66.5" cy="46.5" rx="2.3" ry="2.8" fill={o0} />
        <ellipse cx="53.6" cy="46.5" rx="0.8" ry="1.9" fill="#161108" />
        <ellipse cx="66.6" cy="46.5" rx="0.8" ry="1.9" fill="#161108" />
      </g>
    </svg>
  );
};
