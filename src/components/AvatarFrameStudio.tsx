import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Lock,
  RotateCcw,
  Sparkles,
  Unlock,
  X,
} from 'lucide-react';
import {
  AVATAR_FRAMES,
  AVATAR_FRAME_MAP,
  SAMPLE_CAT_AVATAR_CHOICES,
  type AvatarFrameDefinition,
  type SampleAvatarChoice,
} from '../data/avatarFrames';
import type { AvatarFrameId, DefaultAvatarIconId } from '../types/user';
import { useProcessedAvatarFrameUrl } from '../utils/avatarFrameCutout';
import { playSoftTap } from '../utils/soundEffects';
import { GoldenStardust } from './GoldenStardust';
import { HolographicTiltCard } from './HolographicTiltCard';
import {
  AvatarFrameInlineTag,
  UserAvatarBadge,
  UserAvatarIconGlyph,
} from './UserAvatarBadge';

export interface CharacterAvatarSample {
  id: string;
  name: string;
  avatar: string;
}

interface AvatarFrameStudioProps {
  avatarUrl: string;
  avatarIcon: DefaultAvatarIconId;
  displayName?: string;
  equippedFrameId: AvatarFrameId | null;
  unlockedFrames: Partial<Record<AvatarFrameId, number>>;
  characterSamples: CharacterAvatarSample[];
  onChangeAvatar: (nextUrl: string, nextIcon: DefaultAvatarIconId) => void;
  onSelectFrame: (frameId: AvatarFrameId | null) => void;
  onOpenNotebook?: () => void;
}

/** Resize ảnh tải từ máy lên gọn nhẹ (~420px) để xem thử mượt trong phiên */
function readAndScaleLocalImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh.'));
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        reject(new Error('Ảnh không hợp lệ.'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 420;
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export const AvatarFrameThumbnail: React.FC<{
  frame: AvatarFrameDefinition;
  isUnlocked: boolean;
  className?: string;
}> = ({ frame, isUnlocked, className = '' }) => {
  const processedUrl = useProcessedAvatarFrameUrl(frame);

  return (
    <div
      className={`relative flex items-center justify-center aspect-square w-full ${className}`}
    >
      {/* Vòng tròn tâm mờ phía sau để người dùng thấy rõ độ trong suốt của tâm khung */}
      <div
        aria-hidden="true"
        className="w-[54%] h-[54%] rounded-full border border-dashed border-[#D4AF37]/30 bg-radial from-[#1F1C2A]/85 to-[#0B0B10]/90"
      />
      <img
        src={processedUrl || frame.imageUrl}
        alt={frame.name}
        style={{
          filter: isUnlocked
            ? frame.cutoutMode === 'ink-white'
              ? 'drop-shadow(0 0 2px rgba(255,248,236,0.75))'
              : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))'
            : 'grayscale(0.55) brightness(0.6)',
        }}
        className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 ${
          isUnlocked ? 'opacity-100' : 'opacity-45'
        }`}
      />
    </div>
  );
};

const AvatarFrameStudioBody: React.FC<
  AvatarFrameStudioProps & { compact?: boolean }
> = ({
  avatarUrl,
  avatarIcon,
  displayName = 'Tri kỷ của Tần Nhi',
  equippedFrameId,
  unlockedFrames,
  characterSamples,
  onChangeAvatar,
  onSelectFrame,
  onOpenNotebook,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [inspectHintFrameId, setInspectHintFrameId] = useState<AvatarFrameId | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const unlockedCount = AVATAR_FRAMES.filter((f) => Boolean(unlockedFrames[f.id])).length;
  const equippedFrame = equippedFrameId ? AVATAR_FRAME_MAP[equippedFrameId] ?? null : null;

  const inspectedLockedFrame =
    inspectHintFrameId && !unlockedFrames[inspectHintFrameId]
      ? AVATAR_FRAME_MAP[inspectHintFrameId]
      : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP...).');
      return;
    }
    setUploadError(null);
    try {
      const scaledUrl = await readAndScaleLocalImage(file);
      playSoftTap('card');
      onChangeAvatar(scaledUrl, avatarIcon);
    } catch {
      setUploadError('Không thể đọc ảnh này, thử chọn ảnh khác nhé.');
    }
  };

  const sampleList: SampleAvatarChoice[] = [
    ...SAMPLE_CAT_AVATAR_CHOICES,
    ...characterSamples.slice(0, 5).map((char) => ({
      id: `char-${char.id}`,
      label: char.name.split(/\s+[—-]\s+/)[0],
      avatarUrl: char.avatar,
      avatarIcon: 'black-cat' as DefaultAvatarIconId,
    })),
  ];

  const isCustomUploaded = avatarUrl.startsWith('data:');

  return (
    <div
      className={`grid grid-cols-1 ${
        compact ? 'lg:grid-cols-[270px_minmax(0,1fr)]' : 'md:grid-cols-[280px_minmax(0,1fr)]'
      } gap-4 sm:gap-5 items-start`}
    >
      {/* Khối trái: Xem trước Avatar + Tải ảnh từ máy / Chọn ảnh mẫu */}
      <div className="rounded-2xl bg-[#0B0B0F]/82 border border-[#D4AF37]/30 p-4 flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center min-h-[164px] sm:min-h-[184px] w-full">
          <div
            aria-hidden="true"
            style={{
              background: equippedFrame
                ? `radial-gradient(circle, ${equippedFrame.glowRgba} 0%, transparent 68%)`
                : 'radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 68%)',
            }}
            className="pointer-events-none absolute w-40 h-40 rounded-full blur-xl transition-all duration-500"
          />

          <UserAvatarBadge
            avatarUrl={avatarUrl}
            avatarIcon={avatarIcon}
            frameId={equippedFrameId}
            displayName={displayName}
            size="showcase"
            reserveFrameSpace
          />
        </div>

        <div className="mt-1 space-y-1">
          <p className="text-xs font-semibold text-[#F3E5AB] truncate max-w-[220px]">
            {displayName}
          </p>
          {equippedFrame ? (
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <AvatarFrameInlineTag frameId={equippedFrame.id} />
              <button
                type="button"
                onClick={() => {
                  playSoftTap('nav');
                  onSelectFrame(null);
                }}
                title="Tháo khung đang đeo"
                className="text-[10px] text-[#B8B0A0] hover:text-[#F3E5AB] underline underline-offset-2 cursor-pointer"
              >
                Tháo khung
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-[#9E9687]">
              Chưa đeo khung · {unlockedCount}/{AVATAR_FRAMES.length} khung đã mở
            </p>
          )}
        </div>

        {/* Tải ảnh từ máy để xem thử trong phiên */}
        <div className="mt-3.5 w-full space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playSoftTap('tap');
                fileInputRef.current?.click();
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-xl bg-[#15131E] border border-[#D4AF37]/50 text-[11px] font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all cursor-pointer"
            >
              <ImagePlus className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
              <span>{isCustomUploaded ? 'Đổi ảnh từ máy' : 'Tải ảnh từ máy'}</span>
            </button>

            {isCustomUploaded && (
              <button
                type="button"
                onClick={() => {
                  playSoftTap('nav');
                  onChangeAvatar('', 'black-cat');
                }}
                title="Quay về ảnh mẫu mặc định"
                aria-label="Quay về ảnh mẫu mặc định"
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0E0E14] border border-[#D4AF37]/30 text-[#B8B0A0] hover:text-[#F3E5AB] hover:border-[#D4AF37]/70 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {uploadError && <p className="text-[11px] text-amber-300">{uploadError}</p>}

          {/* Ảnh mẫu nhân vật / mèo */}
          <div className="pt-1">
            <p className="text-[10px] uppercase tracking-wider text-[#9B9385] mb-1.5">
              Ảnh mẫu có sẵn
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {sampleList.map((sample) => {
                const isSelected = sample.avatarUrl
                  ? avatarUrl === sample.avatarUrl
                  : avatarUrl.trim() === '' && avatarIcon === sample.avatarIcon;

                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      playSoftTap('tap');
                      setUploadError(null);
                      onChangeAvatar(sample.avatarUrl, sample.avatarIcon);
                    }}
                    title={`Chọn ảnh mẫu: ${sample.label}`}
                    aria-label={`Chọn ảnh mẫu ${sample.label}`}
                    className={`relative w-9 h-9 rounded-full overflow-hidden border transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'border-[#F3E5AB] ring-2 ring-[#D4AF37]/45 scale-105 bg-[#1B1726]'
                        : 'border-[#D4AF37]/30 bg-[#121118] opacity-80 hover:opacity-100 hover:border-[#D4AF37]/70'
                    }`}
                  >
                    {sample.avatarUrl ? (
                      <img
                        src={sample.avatarUrl}
                        alt={sample.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <UserAvatarIconGlyph iconId={sample.avatarIcon} size="sm" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Khối phải: Bộ sưu tập 5 Khung Ảnh Đại Diện */}
      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#F3E5AB]">
              Bộ Sưu Tập Khung Ảnh Đại Diện
            </h3>
            <p className="text-[11px] sm:text-xs text-[#B8B0A0]">
              Tương tác với nhân vật, Tarot, mini-game, Theme hoặc bí mật ẩn để mở khóa khung mới.
            </p>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D4AF37]/12 border border-[#D4AF37]/40 text-[11px] font-medium text-[#F3E5AB] tabular-nums shrink-0">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />
            <span>
              {unlockedCount}/{AVATAR_FRAMES.length} đã mở
            </span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {AVATAR_FRAMES.map((frame) => {
            const isUnlocked = Boolean(unlockedFrames[frame.id]);
            const isEquipped = equippedFrameId === frame.id;
            const isHintFocused = inspectHintFrameId === frame.id;

            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => {
                  if (isUnlocked) {
                    playSoftTap('card');
                    setInspectHintFrameId(null);
                    onSelectFrame(isEquipped ? null : frame.id);
                  } else {
                    playSoftTap('tap');
                    setInspectHintFrameId((prev) => (prev === frame.id ? null : frame.id));
                  }
                }}
                aria-pressed={isEquipped}
                title={
                  isUnlocked
                    ? isEquipped
                      ? `Đang đeo ${frame.name} (bấm để tháo)`
                      : `Bấm để đeo khung ${frame.name}`
                    : `Chưa mở khóa · ${frame.unlockHint}`
                }
                style={{
                  borderColor: isEquipped
                    ? frame.accentColor
                    : isHintFocused
                      ? `${frame.accentColor}88`
                      : undefined,
                  boxShadow: isEquipped ? `0 0 18px ${frame.glowRgba}` : undefined,
                }}
                className={`group relative rounded-xl p-2.5 border flex flex-col items-center text-center transition-all duration-150 cursor-pointer ${
                  isEquipped
                    ? 'bg-gradient-to-b from-[#1E1928] to-[#111018] border-[#F3E5AB]'
                    : isUnlocked
                      ? 'bg-[#12111A]/90 border-[#D4AF37]/35 hover:border-[#F3E5AB]/75 hover:bg-[#191724]'
                      : 'bg-[#0D0C12]/80 border-[#D4AF37]/18 hover:border-[#D4AF37]/40'
                }`}
              >
                {/* Trạng thái trên góc */}
                <div className="w-full flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${
                      isEquipped
                        ? 'bg-[#D4AF37] text-[#0B0B0F]'
                        : isUnlocked
                          ? 'bg-[#D4AF37]/15 text-[#F3E5AB]'
                          : 'bg-[#171620] text-[#8E877A]'
                    }`}
                  >
                    {isEquipped ? (
                      <Check className="w-3 h-3 stroke-[2.8]" aria-hidden="true" />
                    ) : isUnlocked ? (
                      <Unlock className="w-2.5 h-2.5" aria-hidden="true" />
                    ) : (
                      <Lock className="w-2.5 h-2.5" aria-hidden="true" />
                    )}
                  </span>

                  <span className="text-[9px] font-medium text-[#9B9385] truncate max-w-[70px]">
                    {isEquipped ? 'Đang đeo' : isUnlocked ? 'Đã mở' : 'Đang khóa'}
                  </span>
                </div>

                {/* Hình khung tâm trong suốt */}
                <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] my-0.5 transition-transform duration-200 group-hover:scale-105">
                  <AvatarFrameThumbnail frame={frame} isUnlocked={isUnlocked} />
                </div>

                <span
                  className={`mt-1.5 text-[11px] font-semibold leading-tight line-clamp-2 ${
                    isUnlocked ? 'text-[#F3E5AB]' : 'text-[#8E877A]'
                  }`}
                >
                  {frame.name}
                </span>

                {!isUnlocked && (
                  <span className="mt-0.5 text-[9.5px] text-[#9E9687] line-clamp-2 leading-tight">
                    {frame.unlockTitle}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Gợi ý cách mở khi chạm vào khung đang khóa */}
        <AnimatePresence mode="wait">
          {inspectedLockedFrame ? (
            <motion.div
              key={inspectedLockedFrame.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl bg-[#13111B]/95 border border-[#D4AF37]/40 px-3.5 py-2.5 flex items-start gap-2.5 text-xs"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#F3E5AB]">
                  Cách mở khóa {inspectedLockedFrame.name}:
                </p>
                <p className="text-[#CFC8B8] leading-relaxed mt-0.5">
                  {inspectedLockedFrame.unlockHint}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="default-frame-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-[#0D0C12]/80 border border-[#D4AF37]/20 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#B8B0A0]"
            >
              <span>
                ✦ Bấm vào khung đã mở để đeo thử ngay · Bấm khung đang khóa để xem gợi ý mở khóa.
              </span>
              {onOpenNotebook && (
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('tap');
                    onOpenNotebook();
                  }}
                  className="text-[#F3E5AB] hover:underline underline-offset-2 font-medium cursor-pointer"
                >
                  Xem Nhật Ký Bí Mật →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const AvatarFrameShowcaseSection: React.FC<AvatarFrameStudioProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const unlockedCount = AVATAR_FRAMES.filter((f) => Boolean(props.unlockedFrames[f.id])).length;
  const equippedFrame = props.equippedFrameId
    ? AVATAR_FRAME_MAP[props.equippedFrameId] ?? null
    : null;

  return (
    <section
      aria-label="Khu vực Avatar và Chọn Khung Ảnh Đại Diện"
      className="mb-6 sm:mb-8 rounded-2xl bg-[#121218]/92 backdrop-blur-sm border border-[#D4AF37]/35 shadow-[0_12px_36px_rgba(0,0,0,0.45)] overflow-hidden"
    >
      {/* Thanh tiêu đề thu gọn / mở rộng */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#D4AF37]/18 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <UserAvatarBadge
            avatarUrl={props.avatarUrl}
            avatarIcon={props.avatarIcon}
            frameId={props.equippedFrameId}
            displayName={props.displayName}
            size="sm"
            reserveFrameSpace
          />
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#D4AF37]">
              ✦ Cá nhân hóa trong phiên ✦
            </p>
            <h3 className="font-display text-base sm:text-lg font-semibold text-[#F3E5AB] truncate">
              Avatar & Khung Ảnh Đại Diện
              {equippedFrame ? ` · ${equippedFrame.name}` : ''}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playSoftTap('tap');
            setIsExpanded((prev) => !prev);
          }}
          aria-expanded={isExpanded}
          className="inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1 rounded-xl bg-[#0B0B0F]/90 border border-[#D4AF37]/40 text-[11px] sm:text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-all cursor-pointer shrink-0"
        >
          <span>
            {isExpanded
              ? 'Thu gọn'
              : `Mở chọn khung (${unlockedCount}/${AVATAR_FRAMES.length})`}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="avatar-frame-showcase-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5">
              <AvatarFrameStudioBody {...props} compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

interface AvatarFrameStudioModalProps extends AvatarFrameStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarFrameStudioModal: React.FC<AvatarFrameStudioModalProps> = ({
  isOpen,
  onClose,
  ...studioProps
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
          key="avatar-frame-studio-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="avatar-frame-studio-title"
          onClick={handleClose}
          className="fixed inset-0 z-[72] flex items-center justify-center p-3 sm:p-6 bg-[#040407]/88 backdrop-blur-md overflow-y-auto"
        >
          <GoldenStardust className="z-0 opacity-85" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-4xl my-auto"
          >
            <HolographicTiltCard
              disableTilt
              className="rounded-[26px] bg-gradient-to-b from-[#181521] via-[#0C0B11] to-[#14111A] border-2 border-[#D4AF37]/80 shadow-[0_28px_84px_rgba(0,0,0,0.95),0_0_52px_rgba(212,175,55,0.28)] p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#F3E5AB]/25"
              />

              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng Phòng Chọn Khung Ảnh Đại Diện"
                className="absolute top-4 right-4 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="relative z-10 space-y-4">
                <div className="text-center pr-8 sm:pr-0">
                  <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#D4AF37]">
                    ✦ Trang Trí Ảnh Đại Diện ✦
                  </p>
                  <h2
                    id="avatar-frame-studio-title"
                    className="mt-0.5 font-display text-2xl sm:text-3xl font-semibold gold-shimmer-text"
                  >
                    Phòng Chọn Avatar & Khung Ảnh
                  </h2>
                </div>

                <AvatarFrameStudioBody {...studioProps} />

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Hoàn tất</span>
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
