import React from 'react';
import { motion } from 'motion/react';
import { BlackCatMascot } from './BlackCatMascot';
import { GoldenStardust } from './GoldenStardust';

export type IntroPhase = 'idle' | 'opening' | 'entered';

interface IntroSealDoorsProps {
  phase: IntroPhase;
  onOpenDoor: () => void;
}

const ArtDecoCorner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={`pointer-events-none w-10 h-10 sm:w-14 sm:h-14 text-[#D4AF37] ${className}`}
  >
    <path d="M4 44V10C4 6.686 6.686 4 10 4H44" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.85" />
    <path d="M10 34V14C10 11.791 11.791 10 14 10H34" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.55" />
    <path d="M4 22H14V4" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.5" />
    <path d="M22 4V14H4" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.5" />
    <path d="M19 15L20.3 17.7L23 19L20.3 20.3L19 23L17.7 20.3L15 19L17.7 17.7Z" fill="#F3E5AB" fillOpacity="0.85" />
    <circle cx="48" cy="4" r="1.4" fill="currentColor" fillOpacity="0.7" />
    <circle cx="4" cy="48" r="1.4" fill="currentColor" fillOpacity="0.7" />
  </svg>
);

const DoorOrnament: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-4 sm:inset-7 rounded-2xl border border-[#D4AF37]/28 ${
      side === 'left' ? 'border-r-[#D4AF37]/55' : 'border-l-[#D4AF37]/55'
    }`}
  >
    {/* Khung vòm Art Deco dọc theo cánh cửa */}
    <div className="absolute inset-2.5 sm:inset-4 rounded-xl border border-[#D4AF37]/18 flex items-center justify-center">
      <div
        className={`w-24 sm:w-40 h-56 sm:h-72 rounded-t-full border border-[#D4AF37]/22 ${
          side === 'left' ? 'translate-x-1/4' : '-translate-x-1/4'
        }`}
      />
    </div>
  </div>
);

/**
 * Màn hình Intro với Con dấu sáp vàng ánh kim khắc mèo đen và Cánh cửa ánh sáng tách sang hai bên.
 */
export const IntroSealDoors: React.FC<IntroSealDoorsProps> = ({ phase, onOpenDoor }) => {
  if (phase === 'entered') return null;

  const isOpening = phase === 'opening';

  return (
    <section
      key="intro-seal-doors"
      className={`fixed inset-0 z-50 overflow-hidden ${isOpening ? 'pointer-events-none' : ''}`}
      aria-label="Màn hình chào Ngôi Nhà Nhỏ Của Tần Nhi"
    >
      {/* Hai cánh cửa hoa văn vàng Gold tách sang hai bên */}
      <div className="absolute inset-0 flex">
        {/* Cánh cửa bên trái */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: isOpening ? '-102%' : '0%' }}
          transition={{ duration: 1.08, delay: isOpening ? 0.14 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-1/2 h-full bg-[#0A0A0E] border-r border-[#D4AF37]/50 shadow-[10px_0_40px_rgba(0,0,0,0.85)] overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 100% 48%, rgba(212, 175, 55, 0.14) 0%, rgba(18, 18, 24, 0.4) 45%, rgba(10, 10, 14, 0.98) 85%)',
            }}
          />
          <DoorOrnament side="left" />
          <ArtDecoCorner className="absolute top-3 left-3 sm:top-6 sm:left-6" />
          <ArtDecoCorner className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 -rotate-90" />
        </motion.div>

        {/* Cánh cửa bên phải */}
        <motion.div
          initial={{ x: '0%' }}
          animate={{ x: isOpening ? '102%' : '0%' }}
          transition={{ duration: 1.08, delay: isOpening ? 0.14 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-1/2 h-full bg-[#0A0A0E] border-l border-[#D4AF37]/50 shadow-[-10px_0_40px_rgba(0,0,0,0.85)] overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 0% 48%, rgba(212, 175, 55, 0.14) 0%, rgba(18, 18, 24, 0.4) 45%, rgba(10, 10, 14, 0.98) 85%)',
            }}
          />
          <DoorOrnament side="right" />
          <ArtDecoCorner className="absolute top-3 right-3 sm:top-6 sm:right-6 rotate-90" />
          <ArtDecoCorner className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 rotate-180" />
        </motion.div>
      </div>

      {/* Bụi vàng lấp lánh trên nền cửa khi chưa mở */}
      <motion.div
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{ duration: 0.45 }}
        className="pointer-events-none absolute inset-0"
      >
        <GoldenStardust className="z-10" />
      </motion.div>

      {/* Luồng sáng vàng ấm lóe nhẹ ở khe giữa khi cánh cửa hé mở */}
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
          background:
            'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.28) 32%, rgba(255,248,220,0.88) 50%, rgba(212,175,55,0.28) 68%, transparent 100%)',
        }}
      />

      {/* Nội dung trung tâm & Con dấu sáp phong ấn */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center px-6 py-10 text-center">
        <motion.div
          animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -10 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col items-center max-w-xl mx-auto"
        >
          <div className="animate-cat-float mb-4 drop-shadow-[0_0_24px_rgba(212,175,55,0.32)]">
            <BlackCatMascot size={108} variant="hero" />
          </div>

          <p className="text-xs sm:text-sm font-medium tracking-widest text-[#D4AF37] mb-2.5">
            Chốn nhỏ bình yên giữa màn đêm
          </p>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.12] [text-wrap:balance] gold-shimmer-text">
            Ngôi Nhà Nhỏ Của Tần Nhi
          </h1>

          <div
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent my-4 sm:my-5"
            aria-hidden="true"
          />

          <p className="text-sm sm:text-base text-[#C4BCB0] leading-relaxed max-w-md mb-7 sm:mb-8">
            Nơi lưu giữ những nhân vật AI Chatbot dịu dàng và bí ẩn, luôn đợi bạn ghé thăm sau một ngày dài.
          </p>
        </motion.div>

        {/* Con dấu sáp phong ấn cổ điển màu vàng ánh kim khắc hình chú mèo đen */}
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
                background:
                  'radial-gradient(circle, rgba(243, 229, 171, 0.38) 0%, rgba(212, 175, 55, 0.14) 52%, transparent 74%)',
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
            className="mt-3.5 text-xs sm:text-sm font-medium tracking-widest uppercase text-[#F3E5AB]/90"
          >
            Chạm con dấu · Gõ cửa nhà nhỏ
          </motion.span>
        </div>
      </div>
    </section>
  );
};

/**
 * Đồ họa con dấu sáp vàng ánh kim dập nổi hình chú mèo đen.
 */
const WaxSealArtwork: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-[0_8px_22px_rgba(212,175,55,0.45)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
  >
    <defs>
      <radialGradient id="waxGoldOuter" cx="38%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#FFF3C4" />
        <stop offset="38%" stopColor="#E4BE52" />
        <stop offset="78%" stopColor="#B68A20" />
        <stop offset="100%" stopColor="#7C5A0F" />
      </radialGradient>
      <radialGradient id="waxGoldInner" cx="42%" cy="38%" r="64%">
        <stop offset="0%" stopColor="#C99E2C" />
        <stop offset="65%" stopColor="#9A7216" />
        <stop offset="100%" stopColor="#6E4E0A" />
      </radialGradient>
    </defs>

    {/* Viền sáp lượn sóng cổ điển */}
    <path
      d="M60 5 C70 4, 78 9, 86 12 C95 15, 102 22, 106 31 C111 40, 115 49, 114 60 C115 71, 110 80, 105 89 C100 98, 93 105, 84 109 C75 113, 68 116, 58 115 C48 115, 40 112, 31 107 C22 103, 16 96, 12 87 C7 78, 5 69, 6 58 C5 48, 9 39, 14 30 C19 21, 26 15, 35 11 C43 7, 51 6, 60 5 Z"
      fill="url(#waxGoldOuter)"
      stroke="#FFF7D6"
      strokeOpacity="0.55"
      strokeWidth="1.2"
    />

    {/* Lòng dập nổi bên trong */}
    <circle
      cx="60"
      cy="60"
      r="41"
      fill="url(#waxGoldInner)"
      stroke="#FFEBA8"
      strokeOpacity="0.65"
      strokeWidth="1.6"
    />
    <circle
      cx="60"
      cy="60"
      r="36"
      stroke="#4E3505"
      strokeOpacity="0.45"
      strokeWidth="1"
      strokeDasharray="3 3"
    />

    {/* Sao nhỏ 4 góc quanh con dấu */}
    <path d="M60 21L61.2 24.8L65 26L61.2 27.2L60 31L58.8 27.2L55 26L58.8 24.8Z" fill="#FFF7D6" fillOpacity="0.85" />
    <path d="M60 89L61.2 92.8L65 94L61.2 95.2L60 99L58.8 95.2L55 94L58.8 92.8Z" fill="#FFF7D6" fillOpacity="0.7" />

    {/* Hình chú mèo đen khắc nổi ở trung tâm con dấu */}
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
        stroke="#FFF0B8"
        strokeOpacity="0.4"
        strokeWidth="0.9"
      />
      {/* Đầu & tai mèo */}
      <path
        d="M45 45L43.5 31L53 38C57 36.5 63 36.5 67 38L76.5 31L75 45C76.5 51 71 57 60 57C49 57 43.5 51 45 45Z"
        fill="#161108"
        stroke="#FFF0B8"
        strokeOpacity="0.45"
        strokeWidth="0.9"
      />
      {/* Đôi mắt vàng ánh kim nổi bật trên nền khắc đen */}
      <ellipse cx="53.5" cy="46.5" rx="2.3" ry="2.8" fill="#FFF5CA" />
      <ellipse cx="66.5" cy="46.5" rx="2.3" ry="2.8" fill="#FFF5CA" />
      <ellipse cx="53.6" cy="46.5" rx="0.8" ry="1.9" fill="#161108" />
      <ellipse cx="66.6" cy="46.5" rx="0.8" ry="1.9" fill="#161108" />
    </g>
  </svg>
);
