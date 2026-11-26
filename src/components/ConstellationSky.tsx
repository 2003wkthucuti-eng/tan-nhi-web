import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, RotateCcw, Sparkles, X } from 'lucide-react';
import { useSiteTheme } from '../themes/siteThemes';
import {
  playConstellationCompleteChime,
  playConstellationStarChime,
  playSoftTap,
} from '../utils/soundEffects';

interface StarPoint {
  id: number;
  xPct: number;
  yPct: number;
  label: string;
}

const CONSTELLATION_STARS: StarPoint[] = [
  { id: 0, xPct: 9, yPct: 62, label: 'Sao Khởi Nguyên' },
  { id: 1, xPct: 28, yPct: 24, label: 'Sao Tương Phùng' },
  { id: 2, xPct: 50, yPct: 68, label: 'Sao Hoài Niệm' },
  { id: 3, xPct: 72, yPct: 26, label: 'Sao Định Mệnh' },
  { id: 4, xPct: 91, yPct: 58, label: 'Sao Vĩnh Cửu' },
];

const STAR_BLESSINGS: string[] = [
  '“Đêm nay các vì sao đã nối thành nhịp cầu ánh sáng. Mong rằng người bạn thầm nhớ cũng đang ngước nhìn cùng một bầu trời với bạn.”',
  '“Lời chúc phúc của sao đêm: Mọi mỏi mệt ban ngày sẽ hóa thành bụi sáng dịu dàng, để lại cho trái tim bạn một giấc mơ thật bình yên.”',
  '“Khi 5 ngôi sao cùng bừng sáng, vận may và những cuộc gặp gỡ dịu dàng nhất đang lặng lẽ tìm đường đến bên bạn.”',
  '“Giữa muôn vàn tinh tú xa xôi, ánh mắt tinh tế của bạn đã đánh thức cả một chòm sao. Chúc bạn đêm nay được yêu thương thật trọn vẹn.”',
  '“Sao đêm nhắn gửi: Dù câu chuyện ngoài kia có vội vã đến đâu, ngôi nhà nhỏ này luôn giữ lại một góc trời lấp lánh dành riêng cho bạn.”',
];

interface ConstellationSkyProps {
  moonlightMode?: boolean;
  hasUnlockedStarWeaver: boolean;
  onConstellationComplete: () => boolean;
}

export const ConstellationSky: React.FC<ConstellationSkyProps> = ({
  moonlightMode = false,
  hasUnlockedStarWeaver,
  onConstellationComplete,
}) => {
  const { activeTheme } = useSiteTheme();
  const [litOrder, setLitOrder] = useState<number[]>([]);
  const [activeBlessing, setActiveBlessing] = useState<string | null>(null);
  const [justUnlockedBadge, setJustUnlockedBadge] = useState(false);
  const [showLightWave, setShowLightWave] = useState(false);

  const isCompleted = litOrder.length === CONSTELLATION_STARS.length;

  useEffect(() => {
    if (!showLightWave) return;
    const timer = window.setTimeout(() => setShowLightWave(false), 1600);
    return () => window.clearTimeout(timer);
  }, [showLightWave]);

  const handleStarClick = (starId: number) => {
    if (litOrder.includes(starId)) {
      if (isCompleted) {
        playSoftTap('tap');
        const nextBlessing =
          STAR_BLESSINGS[Math.floor(Math.random() * STAR_BLESSINGS.length)];
        setActiveBlessing(nextBlessing);
      }
      return;
    }

    const nextOrder = [...litOrder, starId];
    setLitOrder(nextOrder);

    if (nextOrder.length < CONSTELLATION_STARS.length) {
      playConstellationStarChime(nextOrder.length - 1);
    } else {
      playConstellationCompleteChime();
      setShowLightWave(true);
      const unlockedFresh = onConstellationComplete();
      setJustUnlockedBadge(unlockedFresh);
      const blessing =
        STAR_BLESSINGS[Math.floor(Math.random() * STAR_BLESSINGS.length)];
      setActiveBlessing(blessing);
    }
  };

  const handleReset = () => {
    playSoftTap('nav');
    setLitOrder([]);
    setActiveBlessing(null);
    setJustUnlockedBadge(false);
  };

  const primaryColor = moonlightMode ? '#E4EEF9' : activeTheme.brightColor;
  const accentColor = moonlightMode ? '#9CB7DB' : activeTheme.accentColor;

  return (
    <div className="relative mb-3 sm:mb-4 select-none">
      {/* Vòm trời 5 ngôi sao ẩn tinh tế phía đầu trang */}
      <div
        aria-label="Chòm sao bí mật trên bầu trời đêm"
        className="relative h-12 sm:h-14 w-full overflow-visible"
      >
        {/* Hiệu ứng tia sáng lan tỏa khi nối đủ 5 ngôi sao */}
        <AnimatePresence>
          {showLightWave && (
            <motion.div
              key="constellation-light-wave"
              initial={{ opacity: 0.9, scale: 0.45 }}
              animate={{ opacity: 0, scale: 1.75 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: moonlightMode
                  ? 'radial-gradient(ellipse at center, rgba(228,238,249,0.34) 0%, rgba(156,183,219,0.12) 45%, transparent 72%)'
                  : 'radial-gradient(ellipse at center, rgba(255,244,196,0.36) 0%, rgba(212,175,55,0.14) 45%, transparent 72%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* SVG vẽ đường nối ánh sáng giữa các ngôi sao đã thắp sáng */}
        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
        >
          <defs>
            <filter id="constellation-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {litOrder.length > 1 &&
            litOrder.slice(0, -1).map((fromId, idx) => {
              const toId = litOrder[idx + 1];
              const fromStar = CONSTELLATION_STARS[fromId];
              const toStar = CONSTELLATION_STARS[toId];
              return (
                <motion.line
                  key={`${fromId}-${toId}`}
                  x1={fromStar.xPct * 10}
                  y1={fromStar.yPct}
                  x2={toStar.xPct * 10}
                  y2={toStar.yPct}
                  stroke={primaryColor}
                  strokeWidth={isCompleted ? 2.4 : 1.8}
                  strokeLinecap="round"
                  filter="url(#constellation-glow)"
                  initial={{ pathLength: 0, opacity: 0.35 }}
                  animate={{ pathLength: 1, opacity: isCompleted ? 0.95 : 0.8 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
        </svg>

        {/* 5 ngôi sao nhỏ nổi bật tinh tế có thể chạm/bấm */}
        {CONSTELLATION_STARS.map((star) => {
          const litIdx = litOrder.indexOf(star.id);
          const isLit = litIdx !== -1;

          return (
            <button
              key={star.id}
              type="button"
              onClick={() => handleStarClick(star.id)}
              aria-label={`${star.label}${isLit ? ' (đã thắp sáng)' : ''}`}
              title={isLit ? `${star.label} · Đã sáng` : 'Một ngôi sao lấp lánh... thử chạm vào xem'}
              style={{
                left: `${star.xPct}%`,
                top: `${star.yPct}%`,
                touchAction: 'manipulation',
              }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
            >
              {/* Hào quang khi ngôi sao đã thắp sáng */}
              <span
                aria-hidden="true"
                className={`absolute rounded-full transition-all duration-500 ${
                  isLit
                    ? 'w-7 h-7 opacity-100 scale-100'
                    : 'w-4 h-4 opacity-0 group-hover:opacity-70 scale-75 group-hover:scale-100'
                }`}
                style={{
                  background: moonlightMode
                    ? 'radial-gradient(circle, rgba(228,238,249,0.55) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(255,244,196,0.55) 0%, transparent 70%)',
                }}
              />

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={`relative transition-all duration-300 ${
                  isLit
                    ? 'w-5 h-5 scale-115'
                    : 'w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:scale-125'
                }`}
                style={{
                  filter: isLit
                    ? `drop-shadow(0 0 8px ${primaryColor}) drop-shadow(0 0 14px ${accentColor})`
                    : `drop-shadow(0 0 4px ${accentColor})`,
                }}
              >
                <path
                  d="M12 1L14.6 9.4L23 12L14.6 14.6L12 23L9.4 14.6L1 12L9.4 9.4Z"
                  fill={isLit ? primaryColor : accentColor}
                />
              </svg>
            </button>
          );
        })}

        {/* Bộ đếm siêu mảnh chỉ hiện khi người chơi bắt đầu thắp sao */}
        <AnimatePresence>
          {litOrder.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute right-0 -bottom-2 flex items-center gap-1.5 text-[10px] tracking-wider text-[#D4AF37]/80"
            >
              <span className="tabular-nums">
                ✦ {litOrder.length}/5 ánh sao
              </span>
              {isCompleted && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Thắp lại 5 ngôi sao"
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#121218]/90 border border-[#D4AF37]/35 text-[10px] text-[#F3E5AB] hover:border-[#F3E5AB] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" aria-hidden="true" />
                  <span>Thắp lại</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lời Chúc Phúc Của Sao Đêm khi nối đủ 5 ngôi sao */}
      <AnimatePresence>
        {activeBlessing && (
          <motion.div
            key="constellation-blessing-card"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            className="mt-2 rounded-2xl bg-gradient-to-r from-[#171320]/95 via-[#12101A]/95 to-[#17140D]/95 border border-[#D4AF37]/65 px-4 py-3.5 shadow-[0_12px_34px_rgba(0,0,0,0.68),0_0_28px_rgba(212,175,55,0.22)] relative"
          >
            <button
              type="button"
              onClick={() => {
                playSoftTap('nav');
                setActiveBlessing(null);
              }}
              aria-label="Đóng Lời Chúc Phúc Của Sao Đêm"
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full inline-flex items-center justify-center text-[#B8B0A0] hover:text-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <div className="pr-8">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#F3E5AB] tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>Lời Chúc Phúc Của Sao Đêm</span>
                </span>

                {(justUnlockedBadge || hasUnlockedStarWeaver) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D4AF37]/20 border border-[#F3E5AB]/55 text-[10px] font-medium text-[#F3E5AB]">
                    <Award className="w-3 h-3" aria-hidden="true" />
                    <span>
                      {justUnlockedBadge
                        ? 'Mở khóa: Người Nối Ánh Sao!'
                        : 'Huy hiệu: Người Nối Ánh Sao'}
                    </span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-[13px] text-[#EDE6D6] leading-relaxed italic">
                {activeBlessing}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
