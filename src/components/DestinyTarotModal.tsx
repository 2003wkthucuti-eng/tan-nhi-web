import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, RotateCcw, Sparkles, X } from 'lucide-react';
import type { CharacterItem } from '../App';
import { BlackCatMascot } from './BlackCatMascot';
import { HolographicTiltCard } from './HolographicTiltCard';
import { playDestinyChime, playSoftTap } from '../utils/soundEffects';

interface DestinyTarotModalProps {
  isOpen: boolean;
  characters: CharacterItem[];
  onClose: () => void;
}

type DrawPhase = 'choosing' | 'spinning' | 'revealed';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V'] as const;

function formatQuotedDescription(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const startsWithQuote = /^["“'‘]/.test(trimmed);
  const endsWithQuote = /["”'’]$/.test(trimmed);
  if (startsWithQuote && endsWithQuote) return trimmed;
  const cleaned = trimmed.replace(/^["“]+|["”]+$/g, '');
  return `“${cleaned}”`;
}

export const DestinyTarotModal: React.FC<DestinyTarotModalProps> = ({
  isOpen,
  characters,
  onClose,
}) => {
  const [phase, setPhase] = useState<DrawPhase>('choosing');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [drawnCharacter, setDrawnCharacter] = useState<CharacterItem | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [dealKey, setDealKey] = useState(0);

  const revealTimerRef = useRef<number | null>(null);
  const lastCharacterIdRef = useRef<string | null>(null);

  const clearTimers = () => {
    if (revealTimerRef.current) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      clearTimers();
      setPhase('choosing');
      setSelectedIndex(null);
      setDrawnCharacter(null);
      setAvatarFailed(false);
      setDealKey((prev) => prev + 1);
    } else {
      clearTimers();
    }
    return () => clearTimers();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playSoftTap('nav');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePickCard = (cardIdx: number) => {
    if (phase !== 'choosing' || characters.length === 0) return;

    playDestinyChime();

    const pool =
      characters.length > 1 && lastCharacterIdRef.current
        ? characters.filter((c) => c.id !== lastCharacterIdRef.current)
        : characters;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    lastCharacterIdRef.current = chosen.id;

    setSelectedIndex(cardIdx);
    setDrawnCharacter(chosen);
    setAvatarFailed(false);
    setPhase('spinning');

    clearTimers();
    revealTimerRef.current = window.setTimeout(() => {
      setPhase('revealed');
    }, 1100);
  };

  const handleRedraw = () => {
    playSoftTap('nav');
    clearTimers();
    setPhase('choosing');
    setSelectedIndex(null);
    setDrawnCharacter(null);
    setAvatarFailed(false);
    setDealKey((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    playSoftTap('nav');
    clearTimers();
    onClose();
  };

  const hasDoki = Boolean(drawnCharacter?.dokiLink && drawnCharacter.dokiLink.trim() !== '');
  const hasGgai = Boolean(drawnCharacter?.ggaiLink && drawnCharacter.ggaiLink.trim() !== '');
  const hasBothLinks = hasDoki && hasGgai;

  const nameParts = drawnCharacter ? drawnCharacter.name.split(/\s+[—-]\s+/) : [];
  const primaryName = nameParts[0] || '';
  const secondaryName = nameParts.length > 1 ? nameParts.slice(1).join(' · ') : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="destiny-tarot-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="destiny-modal-title"
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#050508]/88 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl my-auto rounded-3xl bg-gradient-to-b from-[#13121A] via-[#0B0B10] to-[#111017] border border-[#D4AF37]/45 shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.18)] p-5 sm:p-8 overflow-hidden"
          >
            {/* Họa tiết ánh sáng nền Tarot huyền bí */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 25%, rgba(212, 175, 55, 0.14) 0%, transparent 62%)',
              }}
            />

            {/* Khung viền mảnh bên trong */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-2xl border border-[#D4AF37]/20"
            />

            {/* Nút Đóng góc trên bên phải */}
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Đóng bàn bốc bài định mệnh"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-xl bg-[#0B0B0F]/90 border border-[#D4AF37]/40 text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Đóng</span>
            </button>

            {/* Tiêu đề bàn bốc bài */}
            <div className="relative z-10 text-center pt-1 pb-4 sm:pb-6 pr-12 sm:pr-0 sm:px-14">
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium tracking-widest text-[#D4AF37] mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB]" aria-hidden="true" />
                <span>Trải bài Tarot</span>
                <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB]" aria-hidden="true" />
              </div>
              <h2
                id="destiny-modal-title"
                className="font-display text-2xl sm:text-3xl font-semibold gold-shimmer-text"
              >
                Gặp Gỡ Định Mệnh
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#C7C0B2]">
                {phase === 'choosing' && 'Hãy chạm vào 1 lá bài định mệnh của bạn...'}
                {phase === 'spinning' && 'Lá bài đang xoay chuyển, lắng nghe tiếng chuông định mệnh...'}
                {phase === 'revealed' && 'Tâm hồn hữu duyên dành cho bạn đêm nay đã lộ diện.'}
              </p>
            </div>

            {/* Khu vực 5 lá bài hoặc thẻ nhân vật lộ diện */}
            <div className="relative z-10 min-h-[300px] sm:min-h-[340px] flex flex-col items-center justify-center">
              {phase === 'choosing' && (
                <div
                  key={`deck-${dealKey}`}
                  className="w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 py-2"
                >
                  {ROMAN_NUMERALS.map((numeral, idx) => (
                    <motion.button
                      key={`${dealKey}-${numeral}`}
                      type="button"
                      initial={{ opacity: 0, y: 18, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.38,
                        delay: idx * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{ y: -8, scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handlePickCard(idx)}
                      aria-label={`Chọn lá bài Tarot số ${idx + 1}`}
                      className="group relative w-[94px] sm:w-[122px] md:w-[132px] aspect-[2/3] rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                    >
                      <HolographicTiltCard
                        maxTilt={10}
                        className="w-full h-full rounded-2xl bg-gradient-to-b from-[#171622] via-[#0D0D14] to-[#15131E] border border-[#D4AF37]/65 group-hover:border-[#F3E5AB] shadow-[0_12px_28px_rgba(0,0,0,0.75),0_0_16px_rgba(212,175,55,0.16)] group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.85),0_0_28px_rgba(243,229,171,0.42)] flex flex-col items-center justify-between p-2.5 sm:p-3 transition-colors duration-200"
                      >
                        {/* Viền mảnh trang trí mặt lưng Tarot */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-1.5 rounded-xl border border-[#D4AF37]/35 group-hover:border-[#F3E5AB]/70 transition-colors"
                        />
                        {/* Số La Mã & sao nhỏ trên đỉnh */}
                        <div className="relative z-10 flex items-center gap-1 text-[10px] sm:text-[11px] font-display tracking-widest text-[#D4AF37] group-hover:text-[#F3E5AB]">
                          <span>✦</span>
                          <span>{numeral}</span>
                          <span>✦</span>
                        </div>

                        {/* Mèo đen & vầng hào quang lấp lánh giữa lá bài */}
                        <div className="relative z-10 flex items-center justify-center">
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full bg-[#D4AF37]/12 blur-md group-hover:bg-[#F3E5AB]/25 transition-colors"
                          />
                          <BlackCatMascot
                            size={58}
                            variant="companion"
                            className="relative drop-shadow-[0_0_10px_rgba(212,175,55,0.45)] group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        {/* Mặt trăng khuyết nhỏ ở đáy lá bài */}
                        <div className="relative z-10 flex items-center gap-1.5 text-[9px] sm:text-[10px] tracking-widest uppercase text-[#D4AF37]/80 group-hover:text-[#F3E5AB]">
                          <span>✧</span>
                          <span>Tarot</span>
                          <span>✧</span>
                        </div>
                      </HolographicTiltCard>
                    </motion.button>
                  ))}
                </div>
              )}

              {phase === 'spinning' && selectedIndex !== null && (
                <div className="relative w-full flex items-center justify-center py-4 [perspective:1200px]">
                  {/* 4 lá bài còn lại mờ dần nhẹ nhàng */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4"
                  >
                    {ROMAN_NUMERALS.map((numeral, idx) =>
                      idx === selectedIndex ? null : (
                        <motion.div
                          key={`fading-${numeral}`}
                          initial={{ opacity: 0.8, scale: 1 }}
                          animate={{ opacity: 0, scale: 0.86 }}
                          transition={{ duration: 0.36, ease: 'easeOut' }}
                          className="w-[94px] sm:w-[122px] md:w-[132px] aspect-[2/3] rounded-2xl bg-[#12121A] border border-[#D4AF37]/30"
                        />
                      )
                    )}
                  </div>

                  {/* Lá bài được chọn tỏa hào quang vàng rực rỡ và xoay lật 3D */}
                  <motion.div
                    initial={{ scale: 0.92, rotateY: 0 }}
                    animate={{
                      scale: [0.95, 1.12, 1.05],
                      rotateY: [0, 360, 720, 990],
                    }}
                    transition={{
                      duration: 1.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative z-20 w-[148px] sm:w-[172px] aspect-[2/3] rounded-2xl bg-gradient-to-b from-[#1E1B28] via-[#0E0E15] to-[#1A1724] border-2 border-[#F3E5AB] shadow-[0_0_52px_rgba(243,229,171,0.7),0_0_90px_rgba(212,175,55,0.45)] flex flex-col items-center justify-between p-4"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-2 rounded-xl border border-[#F3E5AB]/55"
                    />
                    <div className="relative z-10 flex items-center gap-1.5 text-xs font-display tracking-widest text-[#F3E5AB]">
                      <span>✦</span>
                      <span>{ROMAN_NUMERALS[selectedIndex]}</span>
                      <span>✦</span>
                    </div>
                    <BlackCatMascot
                      size={80}
                      variant="hero"
                      className="relative z-10 drop-shadow-[0_0_20px_rgba(243,229,171,0.75)]"
                    />
                    <div className="relative z-10 text-[11px] font-medium tracking-widest uppercase text-[#F3E5AB]">
                      Định Mệnh
                    </div>
                  </motion.div>
                </div>
              )}

              {phase === 'revealed' && drawnCharacter && (
                <motion.div
                  key={`revealed-${drawnCharacter.id}`}
                  initial={{ opacity: 0, scale: 0.92, rotateY: -75 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-sm mx-auto [perspective:1200px]"
                >
                  <HolographicTiltCard
                    maxTilt={7}
                    className="destiny-card-glow shimmer-card-border bg-[#121218]/96 border border-[#F3E5AB]/85 rounded-2xl p-4 sm:p-5 flex flex-col"
                  >
                    {/* Huy hiệu lá bài Tarot trên cùng */}
                    <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium tracking-wider text-[#F3E5AB]">
                        <Sparkles className="w-3 h-3 text-[#F3E5AB]" aria-hidden="true" />
                        Lá bài {selectedIndex !== null ? ROMAN_NUMERALS[selectedIndex] : 'Định Mệnh'}
                      </span>
                      <span className="text-[11px] text-[#D4AF37] font-display italic">
                        Hữu duyên tương ngộ
                      </span>
                    </div>

                    {/* Ảnh đại diện nhân vật */}
                    <div className="relative z-10 aspect-square max-h-[220px] sm:max-h-[245px] w-full mx-auto rounded-xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/50 shadow-[0_0_24px_rgba(212,175,55,0.28)]">
                      {!avatarFailed && drawnCharacter.avatar.trim() !== '' ? (
                        <img
                          src={drawnCharacter.avatar}
                          alt={`Ảnh đại diện nhân vật ${drawnCharacter.name}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                          onLoad={(e) => {
                            if (e.currentTarget.naturalWidth === 0) {
                              setAvatarFailed(true);
                            }
                          }}
                          onError={() => setAvatarFailed(true)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#16161F] to-[#0B0B0F] p-4 text-center">
                          <BlackCatMascot size={64} variant="companion" />
                          <span className="font-display text-lg text-[#F3E5AB]">
                            {primaryName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tên & câu thoại */}
                    <div className="relative z-10 mt-3.5 text-center">
                      <h3 className="font-display text-2xl font-semibold text-[#F3E5AB] tracking-tight leading-snug">
                        {primaryName}
                      </h3>
                      {secondaryName && (
                        <p className="text-xs font-medium text-[#D4AF37]/90 mt-0.5">
                          {secondaryName}
                        </p>
                      )}
                      <p className="mt-2 text-xs sm:text-[13px] text-[#DCD4C6] italic leading-relaxed">
                        {formatQuotedDescription(drawnCharacter.description)}
                      </p>
                    </div>

                    {/* Tag thể loại */}
                    {drawnCharacter.tags.length > 0 && (
                      <div className="relative z-10 mt-3 flex flex-wrap justify-center gap-1.5">
                        {drawnCharacter.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0B0B0F]/90 border border-[#D4AF37]/35 text-[11px] font-medium text-[#E6CD82]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nút dẫn link Chat trực tiếp */}
                    {(hasDoki || hasGgai) && (
                      <div
                        className={`relative z-10 mt-4 pt-3.5 border-t border-[#D4AF37]/20 ${
                          hasBothLinks ? 'grid grid-cols-2 gap-2.5' : 'flex'
                        }`}
                      >
                        {hasDoki && (
                          <a
                            href={drawnCharacter.dokiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playSoftTap('card')}
                            className={`shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold whitespace-nowrap hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] transition-all ${
                              !hasBothLinks ? 'w-full' : ''
                            }`}
                          >
                            <span>Link DokiChat</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          </a>
                        )}

                        {hasGgai && (
                          <a
                            href={drawnCharacter.ggaiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playSoftTap('card')}
                            className={`inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-2 rounded-xl bg-[#0B0B0F] border border-[#D4AF37]/65 text-[#F3E5AB] text-xs font-medium whitespace-nowrap hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-all ${
                              !hasBothLinks ? 'w-full' : ''
                            }`}
                          >
                            <span>Link GGAI</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
                  </HolographicTiltCard>

                  {/* Nút Bốc lại & Đóng bên dưới thẻ kết quả */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRedraw}
                      className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-[#D4AF37]/65 bg-[#121218] text-xs sm:text-sm font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                      <span>Bốc lại</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
