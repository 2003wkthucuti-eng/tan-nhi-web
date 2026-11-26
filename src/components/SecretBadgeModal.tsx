import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Sparkles, X } from 'lucide-react';
import { AVATAR_FRAME_MAP } from '../data/avatarFrames';
import type { AvatarFrameId, DefaultAvatarIconId } from '../types/user';
import { playSoftTap } from '../utils/soundEffects';
import { HolographicTiltCard } from './HolographicTiltCard';
import { UserAvatarBadge } from './UserAvatarBadge';

interface SecretBadgeModalProps {
  isOpen: boolean;
  frameId: AvatarFrameId | null;
  sourceNote?: string;
  avatarUrl: string;
  avatarIcon: DefaultAvatarIconId;
  displayName?: string;
  isEquipped: boolean;
  onEquipFrame: (frameId: AvatarFrameId) => void;
  onClose: () => void;
}

/**
 * Bảng chúc mừng khi người chơi vừa mở khóa một Khung Ảnh Đại Diện mới trong phiên.
 */
export const SecretBadgeModal: React.FC<SecretBadgeModalProps> = ({
  isOpen,
  frameId,
  sourceNote,
  avatarUrl,
  avatarIcon,
  displayName = 'Tri kỷ',
  isEquipped,
  onEquipFrame,
  onClose,
}) => {
  const frame = frameId ? AVATAR_FRAME_MAP[frameId] ?? null : null;

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
      {isOpen && frame && (
        <motion.div
          key="avatar-frame-unlock-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="avatar-frame-unlock-title"
          onClick={handleClose}
          className="fixed inset-0 z-[78] flex items-center justify-center p-4 sm:p-6 bg-[#050508]/86 backdrop-blur-md"
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
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-[#D4AF37]/40"
              />

              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng thông báo mở khóa khung ảnh đại diện"
                className="absolute top-4 right-4 z-30 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/45 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[11px] font-medium tracking-widest uppercase text-[#F3E5AB] mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB]" aria-hidden="true" />
                  <span>Mở khóa Khung Ảnh Đại Diện</span>
                </div>

                {/* Xem trước trực tiếp Avatar đang đeo Khung mới mở khóa */}
                <div className="relative flex items-center justify-center min-h-[168px] my-1">
                  <div
                    aria-hidden="true"
                    style={{
                      background: `radial-gradient(circle, ${frame.glowRgba} 0%, transparent 70%)`,
                    }}
                    className="pointer-events-none absolute w-40 h-40 rounded-full blur-xl"
                  />
                  <UserAvatarBadge
                    avatarUrl={avatarUrl}
                    avatarIcon={avatarIcon}
                    frameId={frame.id}
                    displayName={displayName}
                    size="showcase"
                    reserveFrameSpace
                  />
                </div>

                <h2
                  id="avatar-frame-unlock-title"
                  className="mt-2 font-display text-2xl sm:text-[30px] font-semibold gold-shimmer-text leading-tight"
                >
                  {frame.name}
                </h2>
                <p className="mt-1 text-xs font-medium text-[#D4AF37]">{frame.subtitle}</p>

                <div
                  aria-hidden="true"
                  className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent my-3.5"
                />

                <p className="text-xs sm:text-sm text-[#DED7C8] leading-relaxed max-w-xs">
                  {sourceNote || frame.unlockedDesc}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap('card');
                      onEquipFrame(frame.id);
                      onClose();
                    }}
                    className="shimmer-gold-btn flex-1 min-w-[150px] inline-flex items-center justify-center gap-1.5 min-h-[42px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs sm:text-sm font-semibold shadow-[0_0_24px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    {isEquipped ? (
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>{isEquipped ? 'Đang đeo khung này' : 'Đeo khung ngay'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center min-h-[42px] px-4 py-2.5 rounded-xl bg-[#121218] border border-[#D4AF37]/45 text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Để sau</span>
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
