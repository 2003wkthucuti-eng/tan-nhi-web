import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, BookMarked, Clock, KeyRound, Lock, Sparkles, X } from 'lucide-react';
import { GoldenStardust } from './GoldenStardust';
import { HolographicTiltCard } from './HolographicTiltCard';
import { playSoftTap } from '../utils/soundEffects';

interface SecretRoomModalProps {
  isOpen: boolean;
  justUnlockedBadge: boolean;
  onOpenSecretNotebook: () => void;
  onClose: () => void;
}

const COMING_SOON_TEASERS = [
  {
    title: 'Lá Thư Hồi Âm Đêm Muộn',
    note: 'Những dòng hồi âm thì thầm từ nhân vật bạn gửi gắm tâm sự lúc nửa đêm...',
    tag: 'Sắp ra mắt',
  },
  {
    title: 'Vòng Quay Định Mệnh Cấm Kỵ',
    note: 'Mở khóa kịch bản ẩn hiếm chỉ xuất hiện khi các vì sao giao nhau.',
    tag: 'Đang ủ phép',
  },
  {
    title: 'Phòng Trà Độc Quyền Của Chủ Nhà',
    note: 'Nơi lưu giữ thêm nhiều nhân vật mới tinh tuyển chưa từng công bố.',
    tag: 'Bí mật tương lai',
  },
];

export const SecretRoomModal: React.FC<SecretRoomModalProps> = ({
  isOpen,
  justUnlockedBadge,
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
          key="secret-room-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="secret-room-title"
          onClick={handleClose}
          className="fixed inset-0 z-[65] flex items-center justify-center p-3 sm:p-6 bg-[#040407]/90 backdrop-blur-md overflow-y-auto"
        >
          <GoldenStardust witchingHour className="z-0 opacity-95" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-xl my-auto"
          >
            <HolographicTiltCard
              disableTilt
              className="destiny-card-glow rounded-[26px] sm:rounded-[28px] bg-gradient-to-b from-[#191522] via-[#0B0B11] to-[#15121B] border-2 border-[#D4AF37]/85 shadow-[0_28px_84px_rgba(0,0,0,0.95),0_0_54px_rgba(212,175,55,0.34)] p-5 sm:p-7 max-h-[88vh] overflow-y-auto"
            >
              {/* Viền kép chạm trổ bên trong */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#F3E5AB]/28"
              />

              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng Căn Phòng Bí Mật"
                className="absolute top-4 right-4 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Huy hiệu chìa khóa vàng */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2A2110] via-[#151219] to-[#0B0B0F] border border-[#F3E5AB]/70 shadow-[0_0_28px_rgba(212,175,55,0.42)] flex items-center justify-center mb-3.5">
                  <KeyRound
                    className="w-7 h-7 text-[#F3E5AB] drop-shadow-[0_0_10px_rgba(243,229,171,0.75)]"
                    aria-hidden="true"
                  />
                  <Sparkles
                    className="w-4 h-4 text-[#D4AF37] absolute -top-1.5 -right-1.5"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#D4AF37]">
                  ✦ Mật Mã Của Màn Đêm ✦
                </p>

                <h2
                  id="secret-room-title"
                  className="mt-1 font-display text-2xl sm:text-3xl font-semibold gold-shimmer-text leading-tight"
                >
                  🗝️ Căn Phòng Bí Mật Của Chủ Nhà
                </h2>

                {/* Trạng thái mở khóa khung ảnh đại diện */}
                <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#231B0B]/95 via-[#2F240D]/95 to-[#231B0B]/95 border border-[#F3E5AB]/60 text-xs font-medium text-[#F3E5AB] shadow-[0_0_20px_rgba(212,175,55,0.24)]">
                  <Award className="w-4 h-4 text-[#F3E5AB] shrink-0" aria-hidden="true" />
                  <span>
                    {justUnlockedBadge
                      ? 'Đã mở khóa Khung Ảnh: Hắc Long Nét Cọ!'
                      : 'Đã sở hữu Khung Ảnh: Hắc Long Nét Cọ'}
                  </span>
                </div>

                {/* Lời nhắn thơ mộng độc quyền từ Tần Nhi */}
                <div className="mt-5 w-full rounded-2xl bg-[#0B0B0F]/85 border border-[#D4AF37]/30 p-4 sm:p-5 text-left">
                  <p className="text-xs sm:text-[13.5px] text-[#EDE6D6] leading-[1.8] whitespace-pre-line italic">
                    “Không phải vị khách nào ghé qua cũng nhận ra cánh cửa ẩn sau ánh đèn vàng.
                    Cậu đã gõ đúng nhịp mật mã của màn đêm, hoặc khẽ gọi tên ngôi nhà trong khoảng không tĩnh lặng.
                    {"\n\n"}
                    Cảm ơn cậu vì sự tinh tế ấy. Ở căn phòng nhỏ phía sau tấm rèm nhung này, Tần Nhi luôn chừa sẵn một tách trà ấm và vài bí mật nhỏ chỉ dành riêng cho những tâm hồn đủ kiên nhẫn lắng nghe.”
                  </p>
                  <p className="mt-3 text-right text-xs font-display tracking-wider text-[#D4AF37]">
                    — Tần Nhi ✦
                  </p>
                </div>

                {/* Góc Sắp ra mắt (Coming Soon) bí ẩn */}
                <div className="mt-4 w-full rounded-2xl bg-[#111018]/90 border border-[#D4AF37]/25 p-4 text-left">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <h3 className="font-display text-lg font-semibold text-[#F3E5AB]">
                        Góc Hé Lộ · Sắp Ra Mắt (Coming Soon)
                      </h3>
                    </div>
                    <Lock className="w-3.5 h-3.5 text-[#D4AF37]/70 shrink-0" aria-hidden="true" />
                  </div>

                  <div className="space-y-2.5">
                    {COMING_SOON_TEASERS.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-xl bg-[#0B0B0F]/85 border border-[#D4AF37]/18 px-3.5 py-2.5 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-xs sm:text-[13px] font-semibold text-[#F3E5AB]">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[11px] sm:text-xs text-[#B8B0A0] leading-relaxed">
                            {item.note}
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] font-medium tracking-wide uppercase text-[#D4AF37] border border-[#D4AF37]/35 rounded-md px-2 py-0.5 bg-[#D4AF37]/10 whitespace-nowrap">
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>
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
                    <span>Mở Sổ Tay Bí Mật</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="shimmer-gold-btn w-full sm:w-auto inline-flex items-center justify-center gap-1.5 min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Quay lại phòng trà</span>
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
