import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, Sparkles, X } from 'lucide-react';
import { BlackCatMascot } from './BlackCatMascot';
import { HolographicTiltCard } from './HolographicTiltCard';
import { playSoftTap } from '../utils/soundEffects';

interface SecretBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Bảng huy hiệu thành tựu ẩn "✨ Tri kỷ của Tần Nhi" khi chạm chú mèo đen 3 lần.
 */
export const SecretBadgeModal: React.FC<SecretBadgeModalProps> = ({ isOpen, onClose }) => {
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
          key="secret-badge-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="secret-badge-title"
          onClick={handleClose}
          className="fixed inset-0 z-[65] flex items-center justify-center p-4 sm:p-6 bg-[#050508]/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <HolographicTiltCard
              maxTilt={7}
              className="destiny-card-glow rounded-[28px] bg-gradient-to-b from-[#1A1722] via-[#0D0C12] to-[#15121B] border-2 border-[#F3E5AB]/85 shadow-[0_28px_80px_rgba(0,0,0,0.94),0_0_56px_rgba(212,175,55,0.38)] p-6 sm:p-8 text-center"
            >
              {/* Viền kép cổ điển bên trong */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-[#D4AF37]/40"
              />

              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng bảng huy hiệu"
                className="absolute top-4 right-4 z-30 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/45 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[11px] font-medium tracking-widest uppercase text-[#F3E5AB] mb-4">
                  <Award className="w-3.5 h-3.5 text-[#F3E5AB]" aria-hidden="true" />
                  <span>Thành tựu ẩn đã mở khóa</span>
                </div>

                {/* Khung tròn biểu tượng Mèo Đen & Hào quang vàng */}
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-b from-[#231D0F] to-[#0B0B0F] border-2 border-[#F3E5AB]/80 shadow-[0_0_32px_rgba(212,175,55,0.45)] flex items-center justify-center mb-4">
                  <BlackCatMascot
                    size={84}
                    variant="hero"
                    className="drop-shadow-[0_0_16px_rgba(243,229,171,0.55)]"
                  />
                  <Sparkles
                    className="w-5 h-5 text-[#F3E5AB] absolute -top-1 -right-1 drop-shadow-[0_0_8px_rgba(243,229,171,0.9)]"
                    aria-hidden="true"
                  />
                </div>

                <h2
                  id="secret-badge-title"
                  className="font-display text-3xl sm:text-[34px] font-semibold gold-shimmer-text leading-tight"
                >
                  ✨ Tri kỷ của Tần Nhi
                </h2>

                <div
                  aria-hidden="true"
                  className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent my-3.5"
                />

                <p className="text-xs sm:text-sm text-[#DED7C8] leading-relaxed max-w-xs">
                  Chúc mừng cậu đã tìm ra bí mật nhỏ của ngôi nhà! Chú mèo đen luôn ghi nhớ những người bạn tinh tế và dịu dàng nhất.
                </p>

                <button
                  type="button"
                  onClick={handleClose}
                  className="shimmer-gold-btn mt-6 inline-flex items-center justify-center gap-2 min-h-[42px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs sm:text-sm font-semibold shadow-[0_0_24px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Trân giữ huy hiệu</span>
                </button>
              </div>
            </HolographicTiltCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
