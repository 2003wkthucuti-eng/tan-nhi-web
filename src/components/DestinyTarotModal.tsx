import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, RotateCcw, Sparkles, X } from 'lucide-react';
import type { CharacterItem } from '../App';
import { BlackCatMascot } from './BlackCatMascot';
import { GoldenStardust } from './GoldenStardust';
import { HolographicTiltCard } from './HolographicTiltCard';
import { playDestinyChime, playSoftTap, playTarotSpreadChime } from '../utils/soundEffects';

interface DestinyTarotModalProps {
  isOpen: boolean;
  characters: CharacterItem[];
  onInspectCharacter: (character: CharacterItem) => void;
  onClose: () => void;
}

type DrawPhase = 'choosing' | 'spinning' | 'revealed';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V'] as const;

const FAN_SPREAD = [
  { angle: -15, arcY: 26, zIndex: 10 },
  { angle: -7.5, arcY: 8, zIndex: 12 },
  { angle: 0, arcY: 0, zIndex: 14 },
  { angle: 7.5, arcY: 8, zIndex: 12 },
  { angle: 15, arcY: 26, zIndex: 10 },
] as const;

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
  onInspectCharacter,
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
    playTarotSpreadChime();
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

  const handleInspectProfile = () => {
    if (!drawnCharacter) return;
    playSoftTap('card');
    clearTimers();
    onInspectCharacter(drawnCharacter);
  };

  const hasDoki = Boolean(drawnCharacter?.dokiLink && drawnCharacter.dokiLink.trim() !== '');
  const hasGgai = Boolean(drawnCharacter?.ggaiLink && drawnCharacter.ggaiLink.trim() !== '');
  const hasBothLinks = hasDoki && hasGgai;
  const primaryChatLink =
    drawnCharacter?.dokiLink?.trim() || drawnCharacter?.ggaiLink?.trim() || '';

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
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl my-auto rounded-[28px] border border-[#D4AF37]/55 shadow-[0_28px_90px_rgba(0,0,0,0.95),0_0_64px_rgba(212,175,55,0.2)] p-4 sm:p-8 overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at 50% 48%, #1A1622 0%, #0C0B11 54%, #050508 100%)',
            }}
          >
            {/* Ánh nến vàng ấm tỏa trên mặt bàn nhung đen huyền bí */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 68% 48% at 50% 58%, rgba(212, 175, 55, 0.16) 0%, rgba(243, 229, 171, 0.05) 45%, transparent 76%)',
              }}
            />

            {/* Bụi sao nhẹ trên bàn bọc nhung */}
            <GoldenStardust className="z-0 opacity-60" />

            {/* Đường viền mạ vàng bàn bọc nhung */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2.5 sm:inset-4 rounded-2xl border border-[#D4AF37]/25"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-4 sm:inset-5 rounded-xl border border-[#D4AF37]/12"
            />

            {/* Nút Đóng góc trên bên phải */}
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Đóng bàn bốc bài định mệnh"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-xl bg-[#0B0B0F]/92 border border-[#D4AF37]/45 text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Đóng</span>
            </button>

            {/* Tiêu đề bàn bọc nhung */}
            <div className="relative z-10 text-center pt-1 pb-3 sm:pb-5 pr-12 sm:pr-0 sm:px-14">
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium tracking-widest text-[#D4AF37] mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB]" aria-hidden="true" />
                <span>Bàn Trải Bài Tarot</span>
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

            {/* Khu vực trải bài cánh quạt hoặc thẻ nhân vật lộ diện */}
            <div className="relative z-10 min-h-[270px] sm:min-h-[350px] flex flex-col items-center justify-center">
              {phase === 'choosing' && (
                <div
                  key={`deck-${dealKey}`}
                  className="relative w-full flex items-end justify-center pt-4 pb-10 sm:pt-6 sm:pb-12"
                >
                  {/* Vòng hào quang vàng dịu dưới chân 5 lá bài cánh quạt */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 w-[84%] max-w-lg h-16 rounded-full blur-xl"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(243, 229, 171, 0.28) 0%, rgba(212, 175, 55, 0.08) 60%, transparent 100%)',
                    }}
                  />

                  {ROMAN_NUMERALS.map((numeral, idx) => {
                    const fan = FAN_SPREAD[idx];
                    return (
                      <motion.button
                        key={`${dealKey}-${numeral}`}
                        type="button"
                        initial={{ opacity: 0, y: 88, scale: 0.78, rotate: 0 }}
                        animate={{ opacity: 1, y: fan.arcY, scale: 1, rotate: fan.angle }}
                        transition={{
                          duration: 0.62,
                          delay: idx * 0.085,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={{ y: fan.arcY - 18, scale: 1.09, zIndex: 35 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handlePickCard(idx)}
                        aria-label={`Chọn lá bài Tarot số ${idx + 1}`}
                        style={{ zIndex: fan.zIndex, transformOrigin: 'bottom center' }}
                        className="group relative -mx-2.5 sm:-mx-1.5 md:mx-0.5 w-[76px] sm:w-[116px] md:w-[132px] aspect-[2/3] rounded-xl sm:rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                      >
                        <HolographicTiltCard
                          maxTilt={10}
                          className="w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#1A1826] via-[#0D0D15] to-[#171420] border border-[#D4AF37]/75 group-hover:border-[#FFF4C4] shadow-[0_14px_30px_rgba(0,0,0,0.82),0_0_18px_rgba(212,175,55,0.2)] group-hover:shadow-[0_22px_42px_rgba(0,0,0,0.9),0_0_34px_rgba(243,229,171,0.52)] flex flex-col items-center justify-between p-1.5 sm:p-3 transition-colors duration-200"
                        >
                          {/* Viền mảnh trang trí mặt lưng Tarot */}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-1 sm:inset-1.5 rounded-lg sm:rounded-xl border border-[#D4AF37]/40 group-hover:border-[#F3E5AB]/75 transition-colors"
                          />
                          {/* Số La Mã & sao nhỏ trên đỉnh */}
                          <div className="relative z-10 flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[11px] font-display tracking-widest text-[#D4AF37] group-hover:text-[#F3E5AB]">
                            <span>✦</span>
                            <span>{numeral}</span>
                            <span>✦</span>
                          </div>

                          {/* Mèo đen & vầng hào quang lấp lánh giữa lá bài */}
                          <div className="relative z-10 flex items-center justify-center">
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 rounded-full bg-[#D4AF37]/14 blur-md group-hover:bg-[#F3E5AB]/30 transition-colors"
                            />
                            <BlackCatMascot
                              size={42}
                              variant="companion"
                              className="sm:hidden relative drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                            />
                            <BlackCatMascot
                              size={60}
                              variant="companion"
                              className="hidden sm:block relative drop-shadow-[0_0_12px_rgba(212,175,55,0.5)] group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>

                          {/* Chữ Tarot nhỏ ở đáy lá bài */}
                          <div className="relative z-10 flex items-center gap-1 text-[7px] sm:text-[10px] tracking-widest uppercase text-[#D4AF37]/85 group-hover:text-[#F3E5AB]">
                            <span>✧</span>
                            <span>Tarot</span>
                            <span>✧</span>
                          </div>
                        </HolographicTiltCard>
                      </motion.button>
                    );
                  })}
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
                  initial={{ opacity: 0, scale: 0.92, rotateY: -82 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-[470px] mx-auto [perspective:1200px]"
                >
                  {/* Vầng sáng rực rỡ bừng nở khi lá bài lật ngửa */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: [0, 0.9, 0.5], scale: [0.75, 1.12, 1] }}
                    transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                    className="pointer-events-none absolute -inset-4 sm:-inset-6 rounded-[36px] blur-2xl"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 42%, rgba(255, 244, 196, 0.36) 0%, rgba(212, 175, 55, 0.2) 44%, transparent 72%)',
                    }}
                  />

                  {/* Lá bài Tarot lật ngửa */}
                  <div className="relative z-10 max-w-[350px] sm:max-w-[376px] mx-auto">
                    <HolographicTiltCard
                      maxTilt={7}
                      className="destiny-card-glow shimmer-card-border bg-[#121218]/96 border-2 border-[#F3E5AB]/85 rounded-2xl p-4 sm:p-5 flex flex-col"
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

                      {/* Ảnh đại diện nhân vật tỉ lệ vuông cân đối */}
                      <div className="relative z-10 w-[184px] sm:w-[216px] aspect-square mx-auto rounded-xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/60 shadow-[0_0_28px_rgba(212,175,55,0.34)]">
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
                        <p className="mt-2 text-xs sm:text-[13px] text-[#DCD4C6] italic leading-relaxed line-clamp-3">
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
                    </HolographicTiltCard>
                  </div>

                  {/* 2 nút hành động chính ngay bên dưới lá bài Tarot */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mt-4 sm:mt-5 w-full space-y-3"
                  >
                    <div
                      className={`grid gap-2.5 sm:gap-3 ${
                        primaryChatLink ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-xs mx-auto'
                      }`}
                    >
                      {/* Nút 1: Xem hồ sơ định mệnh */}
                      <button
                        type="button"
                        onClick={handleInspectProfile}
                        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#161320]/95 border border-[#D4AF37]/80 text-[#F3E5AB] text-xs sm:text-[13px] font-semibold whitespace-nowrap shadow-[0_0_22px_rgba(212,175,55,0.2)] hover:bg-[#D4AF37]/18 hover:border-[#FFF4C4] hover:shadow-[0_0_28px_rgba(243,229,171,0.38)] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                      >
                        <span>📜 Xem hồ sơ định mệnh</span>
                      </button>

                      {/* Nút 2: Vào phòng chat ngay */}
                      {primaryChatLink && (
                        <a
                          href={primaryChatLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playSoftTap('card')}
                          className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#ECCD72] to-[#D4AF37] text-[#0B0B0F] text-xs sm:text-[13px] font-semibold whitespace-nowrap shadow-[0_0_24px_rgba(212,175,55,0.38)] hover:brightness-110 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4]"
                        >
                          <span>💬 Vào phòng chat ngay</span>
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        </a>
                      )}
                    </div>

                    {/* Chọn nhanh nền tảng nếu nhân vật có cả DokiChat & GGAI */}
                    {hasBothLinks && (
                      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-[#B8B0A0]">
                        <span>Mở trực tiếp trên:</span>
                        <a
                          href={drawnCharacter.dokiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playSoftTap('card')}
                          className="inline-flex items-center gap-0.5 text-[#F3E5AB] hover:text-[#FFF4C4] underline underline-offset-4 decoration-[#D4AF37]/60 transition-colors"
                        >
                          <span>DokiChat</span>
                          <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                        </a>
                        <span aria-hidden="true" className="text-[#D4AF37]/50">
                          ·
                        </span>
                        <a
                          href={drawnCharacter.ggaiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playSoftTap('card')}
                          className="inline-flex items-center gap-0.5 text-[#F3E5AB] hover:text-[#FFF4C4] underline underline-offset-4 decoration-[#D4AF37]/60 transition-colors"
                        >
                          <span>GGAI</span>
                          <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                        </a>
                      </div>
                    )}

                    {/* Nút Bốc lại */}
                    <div className="flex items-center justify-center pt-0.5">
                      <button
                        type="button"
                        onClick={handleRedraw}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-4 py-1.5 rounded-xl border border-[#D4AF37]/45 bg-[#121218]/90 text-xs font-medium text-[#DCD4C6] hover:text-[#F3E5AB] hover:bg-[#D4AF37]/12 hover:border-[#D4AF37] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                        <span>Bốc lại lá khác</span>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
