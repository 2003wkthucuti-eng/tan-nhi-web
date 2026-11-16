import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, Check, LogOut, Sparkles, UserCheck, X } from 'lucide-react';
import type { DefaultAvatarIconId, UserProfile } from '../types/user';
import {
  DEFAULT_AVATAR_OPTIONS,
  SoulmateInlineBadge,
  UserAvatarBadge,
  UserAvatarIconGlyph,
} from './UserAvatarBadge';
import { playSoftTap } from '../utils/soundEffects';

interface SoulmateCornerModalProps {
  isOpen: boolean;
  userProfile: UserProfile | null;
  hasSoulmateBadge: boolean;
  totalLettersSent: number;
  onSaveProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  onClose: () => void;
}

/**
 * Góc Tri Kỷ: Tạo / chỉnh sửa tài khoản cục bộ (Tên hiển thị + Link Avatar hoặc chọn Icon mặc định)
 * và theo dõi trạng thái huy hiệu độc quyền "✨ Tri kỷ".
 */
export const SoulmateCornerModal: React.FC<SoulmateCornerModalProps> = ({
  isOpen,
  userProfile,
  hasSoulmateBadge,
  totalLettersSent,
  onSaveProfile,
  onLogout,
  onClose,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarIcon, setAvatarIcon] = useState<DefaultAvatarIconId>('black-cat');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setDisplayName(userProfile?.displayName ?? '');
    setAvatarUrl(userProfile?.avatarUrl ?? '');
    setAvatarIcon(userProfile?.avatarIcon ?? 'black-cat');
    setErrorMsg('');
  }, [isOpen, userProfile]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = displayName.trim();
    if (!cleanedName) {
      setErrorMsg('Hãy nhập tên hiển thị của cậu nhé.');
      return;
    }

    playSoftTap('card');
    onSaveProfile({
      displayName: cleanedName.slice(0, 32),
      avatarUrl: avatarUrl.trim(),
      avatarIcon,
      createdAt: userProfile?.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  const handleLogoutClick = () => {
    playSoftTap('nav');
    onLogout();
    onClose();
  };

  const lettersRemaining = Math.max(0, 3 - totalLettersSent);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="soulmate-corner-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="soulmate-corner-title"
          onClick={handleClose}
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-[#050508]/86 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md my-auto rounded-[24px] bg-gradient-to-b from-[#171620] via-[#0E0E15] to-[#13111A] border border-[#D4AF37]/65 shadow-[0_24px_70px_rgba(0,0,0,0.92),0_0_40px_rgba(212,175,55,0.22)] p-5 sm:p-6"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 rounded-[18px] border border-[#D4AF37]/20"
            />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng Góc Tri Kỷ"
              className="absolute top-3.5 right-3.5 z-20 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/45 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Header */}
            <div className="relative z-10 text-center pb-4 border-b border-[#D4AF37]/20">
              <p className="text-[10px] font-display tracking-[0.22em] uppercase text-[#D4AF37]">
                ✦ Thẻ Thành Viên ✦
              </p>
              <h2
                id="soulmate-corner-title"
                className="font-display text-2xl sm:text-[28px] font-semibold text-[#F3E5AB] mt-0.5"
              >
                Góc Tri Kỷ
              </h2>
              <p className="text-xs text-[#B8B0A0] mt-1">
                {userProfile
                  ? 'Tùy chỉnh tên hiển thị và dấu ấn riêng khi gửi Hòm Thư Tâm Tình.'
                  : 'Tạo hồ sơ nhỏ để viết và lưu lời nhắn riêng cho từng nhân vật.'}
              </p>
            </div>

            {/* Live Preview Card */}
            <div className="relative z-10 mt-4 p-3.5 rounded-xl bg-[#0B0B0F]/85 border border-[#D4AF37]/30 flex items-center gap-3">
              <UserAvatarBadge
                avatarUrl={avatarUrl}
                avatarIcon={avatarIcon}
                displayName={displayName || 'Tri kỷ ẩn danh'}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider text-[#8E877A]">
                  Xem trước hiển thị
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-sm sm:text-base text-[#F3E5AB] truncate max-w-[175px]">
                    {displayName.trim() || 'Tên hiển thị của cậu'}
                  </span>
                  {hasSoulmateBadge && <SoulmateInlineBadge />}
                </div>
                <p className="text-[11px] text-[#B8B0A0] mt-0.5">
                  {hasSoulmateBadge
                    ? 'Đã sở hữu danh hiệu ✨ Tri kỷ độc quyền'
                    : 'Chưa mở khóa huy hiệu ✨ Tri kỷ'}
                </p>
              </div>
            </div>

            {/* Soulmate Badge Progress */}
            <div className="relative z-10 mt-3 p-3 rounded-xl bg-[#121219]/90 border border-[#D4AF37]/20 flex items-start gap-2.5 text-xs">
              <Award className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-[#CFC8B8] leading-relaxed">
                {hasSoulmateBadge ? (
                  <span>
                    Danh hiệu ánh vàng <strong className="text-[#F3E5AB]">✨ Tri kỷ</strong> đang
                    tự động gắn sau tên của cậu trong mọi Hòm Thư Tâm Tình.
                  </span>
                ) : (
                  <span>
                    Chạm vào <strong className="text-[#F3E5AB]">chú mèo đen 3 lần</strong> hoặc gửi
                    thêm <strong className="text-[#F3E5AB]">{lettersRemaining} lá thư</strong> tâm
                    tình ({totalLettersSent}/3) để mở khóa huy hiệu{' '}
                    <strong className="text-[#F3E5AB]">✨ Tri kỷ</strong>.
                  </span>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10 mt-4 space-y-4">
              <div>
                <label
                  htmlFor="profile-display-name"
                  className="block text-xs font-medium text-[#E6CD82] mb-1.5"
                >
                  Tên hiển thị <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  id="profile-display-name"
                  type="text"
                  maxLength={32}
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Ví dụ: Tiểu Ly, Mèo Con Đêm..."
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#0B0B0F] border border-[#D4AF37]/35 text-sm text-[#F5EFE0] placeholder:text-[#7E776B] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/60"
                />
                {errorMsg && <p className="mt-1 text-xs text-amber-300">{errorMsg}</p>}
              </div>

              <div>
                <label
                  htmlFor="profile-avatar-url"
                  className="block text-xs font-medium text-[#E6CD82] mb-1.5"
                >
                  Link ảnh đại diện (tùy chọn)
                </label>
                <input
                  id="profile-avatar-url"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Dán link ảnh https://... (để trống nếu dùng icon)"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0B0B0F] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#F5EFE0] placeholder:text-[#7E776B] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/60"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#E6CD82] mb-2">
                  Hoặc chọn biểu tượng mặc định
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {DEFAULT_AVATAR_OPTIONS.map((option) => {
                    const isSelected = avatarIcon === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          playSoftTap('tap');
                          setAvatarIcon(option.id);
                        }}
                        className={`relative flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4AF37]/18 border-[#F3E5AB] text-[#F3E5AB] shadow-[0_0_14px_rgba(212,175,55,0.25)]'
                            : 'bg-[#0B0B0F]/90 border-[#D4AF37]/25 text-[#B8B0A0] hover:border-[#D4AF37]/60 hover:text-[#F3E5AB]'
                        }`}
                      >
                        <UserAvatarIconGlyph iconId={option.id} size="sm" />
                        <span className="truncate max-w-full">{option.label}</span>
                        {isSelected && (
                          <Check
                            className="w-3 h-3 text-[#F3E5AB] absolute top-1.5 right-1.5"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="submit"
                  className="shimmer-gold-btn flex-1 inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs sm:text-sm font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  {userProfile ? (
                    <UserCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{userProfile ? 'Lưu thay đổi' : 'Xác nhận hồ sơ'}</span>
                </button>

                {userProfile && (
                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    title="Đăng xuất khỏi tài khoản cục bộ"
                    className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl bg-[#0B0B0F] border border-[#D4AF37]/35 text-xs font-medium text-[#C7C0B2] hover:border-amber-400/70 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Đăng xuất</span>
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
