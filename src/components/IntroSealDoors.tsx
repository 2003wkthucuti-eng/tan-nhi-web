import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Palette, X } from 'lucide-react';
import { BlackCatMascot } from './BlackCatMascot';
import { GoldenStardust } from './GoldenStardust';
import { useSiteTheme } from '../themes/siteThemes';
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
                  Chọn Theme (3×3)
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

              {/* Lưới vuông 3x3 nhỏ gọn */}
              <div className="grid grid-cols-3 gap-1.5">
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

                {Array.from({ length: Math.max(0, 9 - themes.length) }).map((_, idx) => (
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
      <div className="relative z-30 h-full flex flex-col items-center justify-center px-5 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-10 text-center">
        <motion.div
          animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -10 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col items-center max-w-xl mx-auto"
        >
          <div
            style={{ filter: `drop-shadow(0 0 24px ${accentColor}52)` }}
            className="animate-cat-float mb-3.5 sm:mb-4 transition-all duration-300"
          >
            <BlackCatMascot size={108} variant="hero" />
          </div>

          <p
            style={{ color: accentColor }}
            className="text-xs sm:text-sm font-medium tracking-widest mb-2 transition-colors duration-300"
          >
            {activeTheme.tagline}
          </p>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.12] [text-wrap:balance] gold-shimmer-text">
            Ngôi Nhà Nhỏ Của Tần Nhi
          </h1>

          <div
            className="w-24 h-px my-4 sm:my-5 transition-all duration-300"
            style={{
              background: `linear-gradient(to right, transparent, ${accentColor}B3, transparent)`,
            }}
            aria-hidden="true"
          />

          <p
            style={{ color: activeTheme.mutedTextColor }}
            className="text-sm sm:text-base leading-relaxed max-w-md mb-6 sm:mb-8 transition-colors duration-300"
          >
            Nơi lưu giữ những nhân vật AI Chatbot dịu dàng và bí ẩn, luôn đợi bạn ghé thăm sau một ngày dài.
          </p>
        </motion.div>

        {/* Con dấu sáp phong ấn cổ điển đổi sắc theo Theme */}
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            onClick={onOpenDoor}
            disabled={isOpening}
            aria-label="Chạm vào con dấu sáp để mở cửa Ngôi Nhà Nhỏ Của Tần Nhi"
            className="group relative flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0E] rounded-full"
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

        {/* Đôi mắt sáng nổi bật trên nền khắc đen */}
        <ellipse cx="53.5" cy="46.5" rx="2.3" ry="2.8" fill={o0} />
        <ellipse cx="66.5" cy="46.5" rx="2.3" ry="2.8" fill={o0} />
        <ellipse cx="53.6" cy="46.5" rx="0.8" ry="1.9" fill="#161108" />
        <ellipse cx="66.6" cy="46.5" rx="0.8" ry="1.9" fill="#161108" />
      </g>
    </svg>
  );
};
