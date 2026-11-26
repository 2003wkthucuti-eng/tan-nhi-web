import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen,
  Check,
  Feather,
  KeyRound,
  Lock,
  Moon,
  MoonStar,
  Sparkles,
  X,
} from 'lucide-react';
import { AVATAR_FRAMES } from '../data/avatarFrames';
import type { AvatarFrameId } from '../types/user';
import { playSoftTap } from '../utils/soundEffects';
import { AvatarFrameThumbnail } from './AvatarFrameStudio';
import { GoldenStardust } from './GoldenStardust';
import { HolographicTiltCard } from './HolographicTiltCard';

interface SecretDiaryAndBadgesModalProps {
  isOpen: boolean;
  unlockedFrames: Partial<Record<AvatarFrameId, number>>;
  equippedFrameId: AvatarFrameId | null;
  isWitchingHourActive: boolean;
  isMoonlightSilverMode: boolean;
  onSelectFrame: (frameId: AvatarFrameId | null) => void;
  onOpenFrameStudio: () => void;
  onToggleWitchingHourTest: () => void;
  onToggleMoonlightSilverMode: () => void;
  onClose: () => void;
}

function formatUnlockedTime(ts?: number): string {
  if (!ts) return 'Đã khai mở';
  try {
    const d = new Date(ts);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `Mở khóa lúc ${hours}:${mins} · ${day}/${month}`;
  } catch {
    return 'Đã khai mở';
  }
}

export const SecretDiaryAndBadgesModal: React.FC<SecretDiaryAndBadgesModalProps> = ({
  isOpen,
  unlockedFrames,
  equippedFrameId,
  isWitchingHourActive,
  isMoonlightSilverMode,
  onSelectFrame,
  onOpenFrameStudio,
  onToggleWitchingHourTest,
  onToggleMoonlightSilverMode,
  onClose,
}) => {
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

  const handleClose = () => {
    playSoftTap('nav');
    onClose();
  };

  const unlockedCount = AVATAR_FRAMES.filter((f) => Boolean(unlockedFrames[f.id])).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="secret-diary-frames-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="secret-diary-title"
          onClick={handleClose}
          className="fixed inset-0 z-[65] flex items-center justify-center p-3 sm:p-6 bg-[#040407]/88 backdrop-blur-md overflow-y-auto"
        >
          <GoldenStardust moonlightMode={isMoonlightSilverMode} className="z-0 opacity-90" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl my-auto"
          >
            <HolographicTiltCard
              disableTilt
              className="rounded-[26px] sm:rounded-[28px] bg-gradient-to-b from-[#17141D] via-[#0C0B10] to-[#141118] border-2 border-[#D4AF37]/80 shadow-[0_28px_84px_rgba(0,0,0,0.95),0_0_52px_rgba(212,175,55,0.28)] p-5 sm:p-7 max-h-[88vh] overflow-y-auto scroll-smooth"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#F3E5AB]/25"
              />

              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng Nhật Ký & Bộ Sưu Tập Khung Ảnh Đại Diện"
                className="absolute top-4 right-4 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="relative z-10 space-y-5">
                <div className="text-center pr-6 sm:pr-0">
                  <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#D4AF37] inline-flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Bức Thư Dưới Đáy Trang</span>
                  </p>
                  <h2
                    id="secret-diary-title"
                    className="mt-1 font-display text-2xl sm:text-3xl font-semibold gold-shimmer-text leading-tight"
                  >
                    📜 Nhật Ký & Khung Ảnh Đại Diện
                  </h2>
                </div>

                {/* Phần (a): Nhật ký nhỏ của Tần Nhi */}
                <section className="rounded-2xl bg-[#0B0B0F]/85 border border-[#D4AF37]/30 p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Feather className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-[#F3E5AB]">
                      (a) Nhật ký nhỏ của Tần Nhi
                    </h3>
                  </div>

                  <div className="text-[13px] sm:text-sm text-[#E5DEC9] leading-[1.8] whitespace-pre-line italic">
                    {`“Khi dựng nên Ngôi Nhà Nhỏ này giữa nền đêm đen và ánh vàng nhạt, mình chỉ mong có một góc nhỏ đủ yên tĩnh để cất giữ từng nhân vật, từng câu chuyện dang dở mà mình đã gửi gắm nhiều tâm tư.

Mỗi cái tên ở đây đều có một thế giới riêng — có người lạnh lùng giữa mưa tuyết, có người dịu dàng chờ đợi suốt nhiều mùa trăng. Cảm ơn cậu vì đã bước qua cánh cửa, chạm đến tận cùng trang web và nhặt lên chiếc chìa khóa nhỏ này.

Mong rằng mỗi đêm ghé thăm, ngôi nhà đều mang lại cho cậu một chút ấm áp bình yên.”`}
                  </div>
                  <p className="mt-3 text-right text-xs font-display tracking-wider text-[#D4AF37]">
                    — Ghi chú dưới ánh nến · Tần Nhi ✦
                  </p>
                </section>

                {/* Phần (b): Bộ Sưu Tập Khung Ảnh Đại Diện */}
                <section className="rounded-2xl bg-[#0B0B0F]/88 border border-[#D4AF37]/35 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-[#F3E5AB]">
                        (b) Bộ Sưu Tập Khung Ảnh
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-medium text-[#F3E5AB] px-2.5 py-1 rounded-lg bg-[#D4AF37]/12 border border-[#D4AF37]/40 tabular-nums">
                        Đã mở {unlockedCount}/{AVATAR_FRAMES.length} khung
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          playSoftTap('card');
                          onClose();
                          onOpenFrameStudio();
                        }}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#191624] border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#F3E5AB] transition-colors cursor-pointer"
                      >
                        Thử Avatar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {AVATAR_FRAMES.map((frame) => {
                      const unlockedAt = unlockedFrames[frame.id];
                      const unlocked = Boolean(unlockedAt);
                      const isEquipped = equippedFrameId === frame.id;

                      return (
                        <div
                          key={frame.id}
                          className={`rounded-xl p-3.5 sm:p-4 border transition-all ${
                            unlocked
                              ? 'bg-gradient-to-r from-[#1D170B]/95 via-[#151218]/95 to-[#1D170B]/95 border-[#F3E5AB]/70 shadow-[0_0_24px_rgba(212,175,55,0.18)]'
                              : 'bg-[#101016]/85 border-[#D4AF37]/18 opacity-80'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 shrink-0">
                              <AvatarFrameThumbnail frame={frame} isUnlocked={unlocked} />
                              {!unlocked && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="w-6 h-6 rounded-full bg-[#0B0B0F]/85 border border-[#D4AF37]/40 flex items-center justify-center text-[#9E9687]">
                                    <Lock className="w-3 h-3" aria-hidden="true" />
                                  </span>
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <h4
                                  className={`font-display text-base sm:text-lg font-semibold leading-snug ${
                                    unlocked ? 'gold-shimmer-text' : 'text-[#8E877A]'
                                  }`}
                                >
                                  {frame.name}
                                </h4>

                                <span
                                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md border whitespace-nowrap ${
                                    unlocked
                                      ? 'bg-[#D4AF37]/20 border-[#F3E5AB]/50 text-[#F3E5AB]'
                                      : 'bg-[#0B0B0F] border-[#D4AF37]/20 text-[#7A7264]'
                                  }`}
                                >
                                  {unlocked ? formatUnlockedTime(unlockedAt) : 'Chưa mở khóa'}
                                </span>
                              </div>

                              <p
                                className={`mt-1 text-xs leading-relaxed ${
                                  unlocked ? 'text-[#E5DEC9]' : 'text-[#9B9385] italic'
                                }`}
                              >
                                {unlocked ? frame.unlockedDesc : `Gợi ý: ${frame.unlockHint}`}
                              </p>

                              {unlocked && (
                                <div className="mt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      playSoftTap('card');
                                      onSelectFrame(isEquipped ? null : frame.id);
                                    }}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                      isEquipped
                                        ? 'bg-[#D4AF37] text-[#0B0B0F]'
                                        : 'bg-[#171522] border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#F3E5AB]'
                                    }`}
                                  >
                                    {isEquipped && <Check className="w-3 h-3" aria-hidden="true" />}
                                    <span>{isEquipped ? 'Đang đeo (bấm để tháo)' : 'Đeo khung này'}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Chân modal */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onToggleWitchingHourTest}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-xl bg-[#12121A] border border-[#D4AF37]/40 text-[11px] font-medium text-[#DCD4C6] hover:text-[#F3E5AB] hover:border-[#D4AF37]/75 transition-all cursor-pointer"
                    >
                      <Moon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <span>{isWitchingHourActive ? 'Tắt Đêm Sâu' : 'Thử Đêm Sâu'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onToggleMoonlightSilverMode}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-xl bg-[#12121A] border border-[#D4AF37]/40 text-[11px] font-medium text-[#DCD4C6] hover:text-[#F3E5AB] hover:border-[#D4AF37]/75 transition-all cursor-pointer"
                    >
                      <MoonStar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <span>{isMoonlightSilverMode ? 'Về Vàng Gold' : 'Bạc Ánh Trăng'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="shimmer-gold-btn w-full sm:w-auto inline-flex items-center justify-center gap-1.5 min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Khép sổ tay lại</span>
                  </button>
                </div>
              </div>
            </HolographicTiltCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
