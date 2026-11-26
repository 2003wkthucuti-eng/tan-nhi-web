import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, BookMarked, Feather, Sparkles, X } from 'lucide-react';
import { GoldenStardust } from './GoldenStardust';
import { HolographicTiltCard } from './HolographicTiltCard';
import { playSoftTap } from '../utils/soundEffects';

interface SignatureSealModalProps {
  isOpen: boolean;
  justUnlockedSoulmate: boolean;
  moonlightMode?: boolean;
  onOpenSecretNotebook: () => void;
  onClose: () => void;
}

export const SignatureSealModal: React.FC<SignatureSealModalProps> = ({
  isOpen,
  justUnlockedSoulmate,
  moonlightMode = false,
  onOpenSecretNotebook,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="signature-seal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signature-seal-title"
          onClick={handleClose}
          className="fixed inset-0 z-[65] flex items-center justify-center p-3 sm:p-6 bg-[#040407]/88 backdrop-blur-md overflow-y-auto"
        >
          <GoldenStardust moonlightMode={moonlightMode} className="z-0 opacity-90" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 12 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg my-auto"
          >
            <HolographicTiltCard
              disableTilt
              className="destiny-card-glow rounded-[26px] bg-gradient-to-b from-[#1A141E] via-[#0C0B10] to-[#16121A] border-2 border-[#D4AF37]/80 shadow-[0_26px_80px_rgba(0,0,0,0.95),0_0_48px_rgba(212,175,55,0.3)] p-5 sm:p-7 max-h-[88vh] overflow-y-auto"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#F3E5AB]/25"
              />

              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng Dấu Ấn Của Chủ Nhân"
                className="absolute top-4 right-4 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Con dấu ấn triện đỏ thẫm viền ánh kim của Tần Nhi */}
                <div className="relative mb-3.5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6A1624] via-[#450C16] to-[#28060C] border-2 border-[#F3E5AB]/80 shadow-[0_0_28px_rgba(212,175,55,0.38),inset_0_0_14px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center">
                    <span className="font-display text-sm font-bold tracking-[0.18em] text-[#FFF4C4] leading-none">
                      TẦN NHI
                    </span>
                    <span className="mt-1 text-[9px] tracking-[0.22em] text-[#F3E5AB]/85 uppercase">
                      ✦ Tri Kỷ ✦
                    </span>
                  </div>
                  <Feather
                    className="w-4 h-4 text-[#F3E5AB] absolute -bottom-1 -right-1 drop-shadow-[0_0_6px_rgba(243,229,171,0.8)]"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#D4AF37]">
                  🖋️ Dấu Ấn Của Chủ Nhân
                </p>

                <h2
                  id="signature-seal-title"
                  className="mt-1 font-display text-2xl sm:text-3xl font-semibold gold-shimmer-text leading-tight"
                >
                  Con Dấu Tái Bút Bí Mật
                </h2>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#D4AF37]/15 border border-[#F3E5AB]/55 text-xs font-medium text-[#F3E5AB]">
                  <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {justUnlockedSoulmate
                      ? 'Đã mở khóa huy hiệu: Tri Kỷ Của Tần Nhi!'
                      : 'Huy hiệu đã sở hữu: Tri Kỷ Của Tần Nhi'}
                  </span>
                </div>

                <div className="mt-4 w-full rounded-2xl bg-[#0B0B0F]/85 border border-[#D4AF37]/30 p-4 sm:p-5 text-left">
                  <p className="text-xs sm:text-[13.5px] text-[#EDE6D6] leading-[1.82] whitespace-pre-line italic">
                    {`“Tái bút dành riêng cho người đã kiên nhẫn đặt tay giữ lâu trên cái tên Tần Nhi:

Không phải ai cũng dừng lại đủ lâu để lắng nghe nhịp tim ẩn sau từng con chữ. Cảm ơn cậu vì đã trân trọng ngôi nhà nhỏ này, trân trọng từng nhân vật và cả những tâm tình lặng lẽ nhất của mình.

Từ khoảnh khắc con dấu này đóng xuống, cánh cửa phòng trà luôn mở sẵn dành cho cậu — vị tri kỷ dịu dàng của Tần Nhi.”`}
                  </p>
                  <p className="mt-3 text-right text-xs font-display tracking-wider text-[#D4AF37]">
                    — Đóng dấu bằng ánh nến · Tần Nhi ✦
                  </p>
                </div>

                <div className="mt-5 w-full flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap('card');
                      onOpenSecretNotebook();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl bg-[#121218] border border-[#D4AF37]/55 text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] active:scale-95 transition-all cursor-pointer"
                  >
                    <BookMarked className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span>Xem Sổ Tay Bí Mật</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="shimmer-gold-btn w-full sm:w-auto inline-flex items-center justify-center gap-1.5 min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Cất giữ dấu ấn</span>
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
