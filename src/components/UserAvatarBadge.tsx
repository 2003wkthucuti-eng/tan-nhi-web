import React, { useEffect, useState } from 'react';
import { Coffee, Crown, Flower2, Moon, Sparkles } from 'lucide-react';
import type { DefaultAvatarIconId } from '../types/user';
import { BlackCatMascot } from './BlackCatMascot';

export const DEFAULT_AVATAR_OPTIONS: Array<{
  id: DefaultAvatarIconId;
  label: string;
}> = [
  { id: 'black-cat', label: 'Mèo Đen' },
  { id: 'crescent-moon', label: 'Trăng Khuyết' },
  { id: 'tarot-star', label: 'Sao Tarot' },
  { id: 'royal-crown', label: 'Vương Miện' },
  { id: 'night-rose', label: 'Hoa Hồng Đêm' },
  { id: 'warm-tea', label: 'Trà Ấm' },
];

interface UserAvatarBadgeProps {
  avatarUrl?: string;
  avatarIcon?: DefaultAvatarIconId;
  displayName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<UserAvatarBadgeProps['size']>, string> = {
  xs: 'w-5 h-5',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

const ICON_SIZES: Record<NonNullable<UserAvatarBadgeProps['size']>, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const CAT_SIZES: Record<NonNullable<UserAvatarBadgeProps['size']>, number> = {
  xs: 16,
  sm: 24,
  md: 30,
  lg: 42,
};

export const UserAvatarIconGlyph: React.FC<{
  iconId: DefaultAvatarIconId;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}> = ({ iconId, size = 'md' }) => {
  const glyphClass = `${ICON_SIZES[size]} text-[#F3E5AB]`;
  switch (iconId) {
    case 'crescent-moon':
      return <Moon className={glyphClass} aria-hidden="true" />;
    case 'tarot-star':
      return <Sparkles className={glyphClass} aria-hidden="true" />;
    case 'royal-crown':
      return <Crown className={glyphClass} aria-hidden="true" />;
    case 'night-rose':
      return <Flower2 className={glyphClass} aria-hidden="true" />;
    case 'warm-tea':
      return <Coffee className={glyphClass} aria-hidden="true" />;
    case 'black-cat':
    default:
      return <BlackCatMascot size={CAT_SIZES[size]} variant="badge" />;
  }
};

export const UserAvatarBadge: React.FC<UserAvatarBadgeProps> = ({
  avatarUrl = '',
  avatarIcon = 'black-cat',
  displayName = 'Tri kỷ',
  size = 'md',
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [avatarUrl]);

  const trimmedUrl = avatarUrl.trim();
  const showImage = trimmedUrl !== '' && !imgFailed;

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-gradient-to-b from-[#1E1A11] to-[#0B0B0F] border border-[#D4AF37]/65 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(212,175,55,0.2)] ${SIZE_CLASSES[size]} ${className}`}
    >
      {showImage ? (
        <img
          src={trimmedUrl}
          alt={`Ảnh đại diện của ${displayName}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth === 0) {
              setImgFailed(true);
            }
          }}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <UserAvatarIconGlyph iconId={avatarIcon} size={size} />
      )}
    </div>
  );
};

export const SoulmateInlineBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    title="Huy hiệu thành tựu độc quyền"
    className={`soulmate-shimmer-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#F3E5AB]/80 text-[10px] sm:text-[11px] font-semibold text-[#FFF4CC] whitespace-nowrap shrink-0 ${className}`}
  >
    <span>✨ Tri kỷ</span>
  </span>
);
