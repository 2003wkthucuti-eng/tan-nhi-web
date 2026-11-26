import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Palette, X } from 'lucide-react';
import { BlackCatMascot } from './BlackCatMascot';
import { useSiteTheme } from '../themes/siteThemes';
import { playSoftTap } from '../utils/soundEffects';

/**
 * Nút chọn Theme nhỏ gọn ở thanh Header bên trong trang, mở khung vuông 3x3 đồng bộ với màn hình Intro.
 */
export const ThemeSelectorButton: React.FC = () => {
  const { activeTheme, themeId, setThemeId, themes } = useSiteTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          playSoftTap('tap');
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-label={`Đổi Theme giao diện (hiện tại: ${activeTheme.name})`}
        title={`Theme: ${activeTheme.name}`}
        className="inline-flex items-center justify-center gap-1.5 min-w-[38px] min-h-[38px] sm:min-h-[40px] px-2 sm:px-3 py-1.5 rounded-xl border border-[#D4AF37]/35 bg-[#121218] text-[11px] sm:text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer"
      >
        <span
          aria-hidden="true"
          style={{
            background: `linear-gradient(135deg, ${activeTheme.swatchFrom}, ${activeTheme.swatchTo})`,
          }}
          className="w-3 h-3 rounded-full border border-white/30 shrink-0"
        />
        <Palette className="w-3.5 h-3.5 text-[#D4AF37] hidden sm:inline shrink-0" aria-hidden="true" />
        <span className="hidden md:inline max-w-[92px] truncate">{activeTheme.shortName}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Danh sách Theme"
            className="absolute right-0 top-full mt-2 z-50 w-[228px] sm:w-[248px] rounded-2xl bg-[#121218]/96 backdrop-blur-xl border border-[#D4AF37]/60 p-2.5 shadow-[0_18px_42px_rgba(0,0,0,0.88),0_0_24px_rgba(212,175,55,0.22)]"
          >
            <div className="flex items-center justify-between gap-1.5 pb-1.5 mb-2 border-b border-[#D4AF37]/20">
              <span className="text-[11px] font-semibold tracking-wide text-[#F3E5AB] pl-0.5">
                Chọn Theme
              </span>
              <button
                type="button"
                onClick={() => {
                  playSoftTap('nav');
                  setIsOpen(false);
                }}
                aria-label="Đóng bảng chọn Theme"
                className="w-6 h-6 rounded-md inline-flex items-center justify-center text-[#B8B0A0] hover:text-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

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
                      setIsOpen(false);
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
                    className="group relative aspect-square rounded-xl border overflow-hidden p-1.5 flex flex-col items-center justify-between text-center transition-all duration-150 hover:scale-[1.03] active:scale-95 cursor-pointer"
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
                  className="aspect-square rounded-xl border border-dashed border-[#D4AF37]/25 bg-[#0B0B0F]/45 flex flex-col items-center justify-center gap-0.5 opacity-55 select-none"
                >
                  <span className="text-[10px] text-[#D4AF37]">✦</span>
                  <span className="text-[8.5px] text-[#B8B0A0] tracking-tight">Sắp thêm</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
