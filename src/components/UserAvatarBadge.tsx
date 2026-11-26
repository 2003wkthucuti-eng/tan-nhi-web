import React, { useEffect, useState } from 'react';
import { Coffee, Crown, Flower2, Moon, Sparkles } from 'lucide-react';
import { AVATAR_FRAME_MAP } from '../data/avatarFrames';
import type { AvatarFrameId, DefaultAvatarIconId } from '../types/user';
import { useProcessedAvatarFrameUrl } from '../utils/avatarFrameCutout';
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

export type UserAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'showcase';

interface UserAvatarBadgeProps {
  avatarUrl?: string;
  avatarIcon?: DefaultAvatarIconId;
  frameId?: AvatarFrameId | null;
  displayName?: string;
  size?: UserAvatarSize;
  className?: string;
  /** Chừa khoảng lề quanh avatar để khung họa tiết lớn không đè lên chữ bên cạnh */
  reserveFrameSpace?: boolean;
}

const SIZE_CLASSES: Record<UserAvatarSize, string> = {
  xs: 'w-[22px] h-[22px]',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
  showcase: 'w-24 h-24 sm:w-28 sm:h-28',
};

const RESERVE_MARGIN_CLASSES: Record<UserAvatarSize, string> = {
  xs: 'mx-1.5',
  sm: 'm-2',
  md: 'm-2.5',
  lg: 'm-4',
  xl: 'm-5',
  showcase: 'm-7 sm:m-8',
};

const ICON_SIZES: Record<UserAvatarSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  showcase: 'w-10 h-10 sm:w-12 sm:h-12',
};

const CAT_SIZES: Record<UserAvatarSize, number> = {
  xs: 15,
  sm: 24,
  md: 30,
  lg: 42,
  xl: 58,
  showcase: 74,
};

export const UserAvatarIconGlyph: React.FC<{
  iconId: DefaultAvatarIconId;
  size?: UserAvatarSize;
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
  frameId = null,
  displayName = 'Tri kỷ',
  size = 'md',
  className = '',
  reserveFrameSpace = false,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [avatarUrl]);

  const frameDef = frameId ? AVATAR_FRAME_MAP[frameId] ?? null : null;
  const processedFrameUrl = useProcessedAvatarFrameUrl(frameDef);

  const trimmedUrl = avatarUrl.trim();
  const showImage = trimmedUrl !== '' && !imgFailed;
  const hasFrame = Boolean(frameDef && processedFrameUrl);

  const framePct = frameDef ? `${(104 / frameDef.avatarDiameterRatio).toFixed(2)}%` : '100%';
  const txPct = frameDef ? `${-(frameDef.centerX * 100).toFixed(2)}%` : '-50%';
  const tyPct = frameDef ? `${-(frameDef.centerY * 100).toFixed(2)}%` : '-50%';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${
        SIZE_CLASSES[size]
      } ${hasFrame && reserveFrameSpace ? RESERVE_MARGIN_CLASSES[size] : ''} ${className}`}
    >
      {/* Ảnh đại diện tròn bên trong tâm khung */}
      <div
        className={`relative w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#1E1A11] to-[#0B0B0F] flex items-center justify-center ${
          hasFrame
            ? 'border border-transparent'
            : 'border border-[#D4AF37]/65 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
        }`}
      >
        {showImage ? (
          <img
            src={trimmedUrl}
            alt={`Ảnh đại diện của ${displayName}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
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

      {/* Khung Ảnh Đại Diện tâm trong suốt phủ phía trên */}
      {frameDef && processedFrameUrl && (
        <img
          src={processedFrameUrl}
          alt={`Khung ${frameDef.name}`}
          aria-hidden="true"
          style={{
            width: framePct,
            height: framePct,
            maxWidth: 'none',
            maxHeight: 'none',
            left: '50%',
            top: '50%',
            transform: `translate(${txPct}, ${tyPct})`,
            filter:
              frameDef.cutoutMode === 'ink-white'
                ? 'drop-shadow(0 0 2px rgba(255,248,236,0.78)) drop-shadow(0 0 6px rgba(255,244,224,0.34))'
                : 'drop-shadow(0 2px 8px rgba(0,0,0,0.55))',
          }}
          className="pointer-events-none select-none absolute z-10 object-contain"
        />
      )}
    </div>
  );
};

export const AvatarFrameInlineTag: React.FC<{
  frameId: AvatarFrameId;
  className?: string;
}> = ({ frameId, className = '' }) => {
  const frame = AVATAR_FRAME_MAP[frameId];
  if (!frame) return null;
  return (
    <span
      title={`Đang đeo khung: ${frame.name}`}
      style={{
        borderColor: `${frame.accentColor}85`,
      }}
      className={`soulmate-shimmer-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-semibold text-[#FFF4CC] whitespace-nowrap shrink-0 ${className}`}
    >
      <span>✦ {frame.name}</span>
    </span>
  );
};
