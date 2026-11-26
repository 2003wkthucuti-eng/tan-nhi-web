import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Palette, X } from 'lucide-react';
import { BlackCatMascot } from './BlackCatMascot';
import { GoldenStardust } from './GoldenStardust';
import { useSiteTheme, type SiteThemeId } from '../themes/siteThemes';
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
                      onClick={() => {
                        playSoftTap('tap');
                        setThemeId(theme.id);
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
              background: `radial-gradient(circle at 100% 48%, ${accentColor}26 0%, ${activeTheme.bgColor}BA 48%, ${activeTheme.bgColor}FA 88%)`,
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
              background: `radial-gradient(circle at 0% 48%, ${accentColor}26 0%, ${activeTheme.bgColor}BA 48%, ${activeTheme.bgColor}FA 88%)`,
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
          themeId === 'pixel-doodles';

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

              {/* 3 Theme Đặc Biệt: Khung hình trái tim kích thước lớn chứa hai chủ thể nằm ngay phía sau dấu sáp */}
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
                          {/* Nửa trái trái tim: Yeo Taeju */}
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
                          {/* Nửa phải trái tim: Kim Euihyun & Yeo Taeju */}
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

                      <rect x="0" y="0" width="220" height="200" fill={`url(#${heartFadeMaskId})`} />
                    </g>

                    {/* Viền khung trái tim phát sáng đồng bộ Theme */}
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
                      strokeDasharray={themeId === 'pixel-doodles' ? '5 4' : undefined}
                    />
                  </svg>
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

        {/* Đôi mắt sáng nổi bật trên nền khắc đen */}
        <ellipse cx="53.5" cy="46.5" rx="2.3" ry="2.8" fill={o0} />
        <ellipse cx="66.5" cy="46.5" rx="2.3" ry="2.8" fill={o0} />
        <ellipse cx="53.6" cy="46.5" rx="0.8" ry="1.9" fill="#161108" />
        <ellipse cx="66.6" cy="46.5" rx="0.8" ry="1.9" fill="#161108" />
      </g>
    </svg>
  );
};
