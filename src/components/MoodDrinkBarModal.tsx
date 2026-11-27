import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Coffee, Gift, Sparkles, X } from 'lucide-react';
import { AVATAR_FRAME_MAP } from '../data/avatarFrames';
import { useSiteTheme, type SiteThemeId } from '../themes/siteThemes';
import type { AvatarFrameId } from '../types/user';
import { playSoftTap } from '../utils/soundEffects';

export interface MoodDrinkDefinition {
  id: string;
  name: string;
  subtitle: string;
  vibeThemes: SiteThemeId[];
  liquidFrom: string;
  liquidTo: string;
  garnishColor: string;
  blessing: string;
  rewardPool: AvatarFrameId[];
}

const MOOD_DRINKS: MoodDrinkDefinition[] = [
  {
    id: 'tra-hoa-hong',
    name: 'Trà Hoa Hồng Mờ Sương',
    subtitle: 'Hương cánh hồng sấy & mật ong ấm',
    vibeThemes: ['gothic-lily', 'rose-nebula', 'caesar'],
    liquidFrom: '#D87495',
    liquidTo: '#F9D3E0',
    garnishColor: '#FFF0F7',
    blessing:
      'Mong buổi tối của {name} dịu lại như làn khói trà ấm, mọi muộn phiền ngoài cửa đều khép lại thật khẽ.',
    rewardPool: ['buom-trang-ngoc-trai', 'ren-trang-you-fool', 'bach-long-ho-ly'],
  },
  {
    id: 'ruou-vang-do',
    name: 'Rượu Vang Đỏ Đêm Nhung',
    subtitle: 'Vang nho chát nhẹ ánh nến đỏ',
    vibeThemes: ['velvet-vinyl', 'be-tho'],
    liquidFrom: '#7D1122',
    liquidTo: '#D94354',
    garnishColor: '#FFE0E5',
    blessing:
      'Một chút men nồng để {name} đủ dũng cảm bước vào những câu chuyện kịch tính nhất đêm nay.',
    rewardPool: ['huyet-nguyet-kiem-khach', 'day-gai-ban-tay', 'thien-vu-vuong-mien'],
  },
  {
    id: 'ca-phe-den',
    name: 'Cà Phê Đen Đá Ít Đường',
    subtitle: 'Đắng thanh tỉnh táo giữa đêm tĩnh',
    vibeThemes: ['thuy-mac', 'ink-lily', 'joo-jaekyung', 'yeo-taeju'],
    liquidFrom: '#231814',
    liquidTo: '#6B4C3B',
    garnishColor: '#EFE4CE',
    blessing:
      'Tặng {name} ly cà phê đen dứt khoát — giữ tâm trí sáng trong và trái tim thật vững vàng nhé.',
    rewardPool: ['hac-long-net-co', 'kim-lien-pho-do', 'huyet-nguyet-kiem-khach'],
  },
  {
    id: 'soda-dem-khuya',
    name: 'Soda Biển Đêm Phát Sáng',
    subtitle: 'Bọt ga xanh thẫm & bạc hà mát lạnh',
    vibeThemes: ['bien-dem-sua', 'dem-xanh', 'bong-bong-sua', 'night-ride'],
    liquidFrom: '#1C5B9E',
    liquidTo: '#7EE2FF',
    garnishColor: '#EBF8FF',
    blessing:
      'Từng bọt khí mát lành mang theo ánh sao biển gửi tới {name} — đêm nay cứ thả lỏng trôi theo cảm xúc thôi.',
    rewardPool: ['bang-vu-pha-le', 'long-van-thuy-mac', 'buom-trang-ngoc-trai'],
  },
  {
    id: 'tra-o-long-co-phong',
    name: 'Trà Ô Long Cổ Phong',
    subtitle: 'Hương trầm thoang thoảng & hậu ngọt',
    vibeThemes: ['co-phong-tram', 'celestial-scroll', 'bao-cu-nhac'],
    liquidFrom: '#8D6630',
    liquidTo: '#E4C380',
    garnishColor: '#F5EFE0',
    blessing:
      'Chén trà cổ lưu giữ dư vị bình yên, chúc {name} gặp được tri kỷ hợp ý ngay trong lần lật trang tới.',
    rewardPool: ['kim-lien-pho-do', 'long-van-thuy-mac', 'thien-vu-vuong-mien'],
  },
  {
    id: 'sua-dau-pixel',
    name: 'Sữa Dâu Pixel & Mèo Nhỏ',
    subtitle: 'Sữa kem ngọt ngào rắc kẹo sao',
    vibeThemes: ['pixel-doodles', 'collage-hai-be'],
    liquidFrom: '#F29EB8',
    liquidTo: '#FFF0F5',
    garnishColor: '#FFE58F',
    blessing:
      'Chú mèo đen gửi tặng {name} ly sữa dâu ngọt lịm — mong nụ cười của cậu hôm nay sáng hơn cả những vì sao.',
    rewardPool: ['bach-long-ho-ly', 'buom-trang-ngoc-trai', 'ren-trang-you-fool'],
  },
  {
    id: 'espresso-anh-bac',
    name: 'Espresso Khói Bạc & Vàng',
    subtitle: 'Đậm sâu, ấm áp và chút ánh kim',
    vibeThemes: ['classic-gold', 'sabbath-crew', 'zhenya', 'sanzu-haruchiyo', 'ilay-riegrow'],
    liquidFrom: '#3B2C1A',
    liquidTo: '#C99E3D',
    garnishColor: '#FFF4C4',
    blessing:
      'Ly Espresso dành riêng cho {name}: giữ một ngọn lửa ấm giữa đêm sâu và tận hưởng trọn vẹn từng khoảnh khắc.',
    rewardPool: ['bang-vu-pha-le', 'thien-vu-vuong-mien', 'day-gai-ban-tay'],
  },
];

const DrinkGlassIllustration: React.FC<{ drink: MoodDrinkDefinition }> = ({ drink }) => {
  const gradId = `drink-grad-${drink.id}`;
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="18" y1="16" x2="46" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={drink.liquidTo} />
          <stop offset="100%" stopColor={drink.liquidFrom} />
        </linearGradient>
      </defs>
      {/* Thân ly */}
      <path
        d="M17 18H47L43.5 50C43.2 52.3 41.3 54 39 54H25C22.7 54 20.8 52.3 20.5 50L17 18Z"
        fill={`url(#${gradId})`}
        fillOpacity="0.88"
        stroke={drink.garnishColor}
        strokeWidth="1.6"
      />
      {/* Miệng ly & ống hút / lá trang trí */}
      <ellipse cx="32" cy="18" rx="15" ry="3.2" fill={drink.liquidTo} fillOpacity="0.35" stroke={drink.garnishColor} strokeWidth="1.2" />
      <path d="M39 8L34 28" stroke={drink.garnishColor} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="27" cy="31" r="2" fill={drink.garnishColor} fillOpacity="0.7" />
      <circle cx="35" cy="39" r="1.4" fill={drink.garnishColor} fillOpacity="0.75" />
      <circle cx="29" cy="44" r="1.2" fill={drink.garnishColor} fillOpacity="0.55" />
    </svg>
  );
};

interface MoodDrinkBarModalProps {
  isOpen: boolean;
  displayName: string;
  unlockedFrames: Partial<Record<AvatarFrameId, number>>;
  onOrderUnlockFrame: (frameId: AvatarFrameId, sourceNote: string) => boolean;
  onOpenFrameStudio: () => void;
  onClose: () => void;
}

export const MoodDrinkBarModal: React.FC<MoodDrinkBarModalProps> = ({
  isOpen,
  displayName,
  unlockedFrames,
  onOrderUnlockFrame,
  onOpenFrameStudio,
  onClose,
}) => {
  const { activeTheme } = useSiteTheme();
  const [selectedDrink, setSelectedDrink] = useState<MoodDrinkDefinition | null>(null);
  const [serveResult, setServeResult] = useState<{
    drink: MoodDrinkDefinition;
    blessingText: string;
    unlockedFrameId: AvatarFrameId | null;
    matchedTheme: boolean;
  } | null>(null);
  const [orderCount, setOrderCount] = useState(0);

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

  const recommendedDrink =
    MOOD_DRINKS.find((drink) => drink.vibeThemes.includes(activeTheme.id)) ?? MOOD_DRINKS[0];

  const handleServeDrink = (drink: MoodDrinkDefinition) => {
    playSoftTap('card');
    setSelectedDrink(drink);
    const nextOrders = orderCount + 1;
    setOrderCount(nextOrders);

    const matchedTheme = drink.vibeThemes.includes(activeTheme.id);
    const allLockedFrames = Object.keys(AVATAR_FRAME_MAP).filter(
      (id) => !unlockedFrames[id as AvatarFrameId]
    ) as AvatarFrameId[];

    const poolLocked = drink.rewardPool.filter((id) => !unlockedFrames[id]);
    const candidateId = poolLocked[0] ?? allLockedFrames[0] ?? null;

    // Đảm bảo khi chọn món hợp vibe hoặc gọi ly đầu/thứ hai sẽ có cơ hội cao mở khóa khung ảnh trong phiên
    const shouldGrantReward =
      candidateId !== null && (matchedTheme || nextOrders === 1 || Math.random() < 0.7);

    let grantedFrameId: AvatarFrameId | null = null;
    if (shouldGrantReward && candidateId) {
      const frameDef = AVATAR_FRAME_MAP[candidateId];
      const unlocked = onOrderUnlockFrame(
        candidateId,
        `Món "${drink.name}" tại Quầy Đồ Uống Tâm Trạng đã tặng cậu Khung Ảnh ${frameDef?.name ?? ''}!`
      );
      if (unlocked) {
        grantedFrameId = candidateId;
      }
    }

    const cleanGuest = displayName.trim() || 'Tri kỷ';
    const blessingText = drink.blessing.replace(/\{name\}/g, cleanGuest);

    setServeResult({
      drink,
      blessingText,
      unlockedFrameId: grantedFrameId,
      matchedTheme,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mood-drink-bar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mood-drink-bar-title"
          onClick={handleClose}
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-[#050508]/86 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl my-auto rounded-[24px] bg-gradient-to-b from-[#171620] via-[#0E0E15] to-[#13111A] border border-[#D4AF37]/65 shadow-[0_24px_70px_rgba(0,0,0,0.92),0_0_40px_rgba(212,175,55,0.22)] p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 rounded-[18px] border border-[#D4AF37]/20"
            />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng Quầy Đồ Uống Tâm Trạng"
              className="absolute top-3.5 right-3.5 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/45 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Header */}
            <div className="relative z-10 text-center pb-3.5 border-b border-[#D4AF37]/20 pr-8 pl-8">
              <p className="text-[10px] font-display tracking-[0.22em] uppercase text-[#D4AF37]">
                ✦ Quầy Pha Chế Theo Vibe · {activeTheme.shortName} ✦
              </p>
              <h2
                id="mood-drink-bar-title"
                className="font-display text-2xl sm:text-[28px] font-semibold text-[#F3E5AB] mt-0.5"
              >
                Quầy Đồ Uống Tâm Trạng
              </h2>
              <p className="text-xs text-[#B8B0A0] mt-1">
                Chọn một thức uống hợp tâm trạng để nhận lời chúc riêng và cơ hội mở khóa thêm Khung Ảnh Đại Diện.
              </p>
            </div>

            {/* Gợi ý hợp Theme hiện tại */}
            <div className="relative z-10 mt-3.5 rounded-2xl bg-[#0B0B0F]/85 border border-[#D4AF37]/40 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <DrinkGlassIllustration drink={recommendedDrink} />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-[#D4AF37]">
                    ✦ Hợp vibe {activeTheme.name}
                  </p>
                  <p className="font-display text-base font-semibold text-[#F3E5AB] truncate">
                    {recommendedDrink.name}
                  </p>
                  <p className="text-[11px] text-[#B8B0A0] truncate">
                    {recommendedDrink.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleServeDrink(recommendedDrink)}
                className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Coffee className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Pha món gợi ý</span>
              </button>
            </div>

            {/* Thực đơn đồ uống */}
            <div className="relative z-10 mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MOOD_DRINKS.map((drink) => {
                const isSelected = selectedDrink?.id === drink.id;
                const isThemeMatch = drink.vibeThemes.includes(activeTheme.id);

                return (
                  <button
                    key={drink.id}
                    type="button"
                    onClick={() => handleServeDrink(drink)}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all cursor-pointer min-w-0 ${
                      isSelected
                        ? 'bg-[#1B1726] border-[#F3E5AB] shadow-[0_0_20px_rgba(212,175,55,0.28)]'
                        : 'bg-[#101018]/92 border-[#D4AF37]/30 hover:border-[#D4AF37]/75'
                    }`}
                  >
                    <DrinkGlassIllustration drink={drink} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <p className="text-xs sm:text-[13px] font-semibold text-[#F3E5AB] truncate">
                          {drink.name}
                        </p>
                        {isThemeMatch && (
                          <span className="text-[10px] font-medium text-[#D4AF37] shrink-0">
                            ★ Hợp vibe
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#B8B0A0] mt-0.5 line-clamp-1">
                        {drink.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Kết quả phục vụ đồ uống */}
            <AnimatePresence mode="wait">
              {serveResult && (
                <motion.article
                  key={`${serveResult.drink.id}-${orderCount}`}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 mt-4 rounded-2xl bg-[#0B0B0F]/92 border border-[#D4AF37]/55 p-4 space-y-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.75)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-[#D4AF37]">
                      🍸 Đã pha xong: {serveResult.drink.name}
                    </p>
                    {serveResult.matchedTheme && (
                      <span className="text-[11px] font-medium text-[#F3E5AB]">
                        Hợp theme {activeTheme.shortName}
                      </span>
                    )}
                  </div>

                  <p className="font-display text-base sm:text-lg italic text-[#F3E5AB] leading-relaxed">
                    “{serveResult.blessingText}”
                  </p>

                  {serveResult.unlockedFrameId ? (
                    <div className="pt-2 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-xs font-medium text-[#F3E5AB] flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                        <span>
                          Quà tặng bất ngờ: Mở khóa Khung Ảnh{' '}
                          <strong>{AVATAR_FRAME_MAP[serveResult.unlockedFrameId]?.name}</strong>!
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          playSoftTap('card');
                          onClose();
                          onOpenFrameStudio();
                        }}
                        className="inline-flex items-center justify-center gap-1 min-h-[34px] px-3 py-1 rounded-xl bg-[#1C1826] border border-[#D4AF37]/60 text-[11px] font-semibold text-[#F3E5AB] hover:border-[#F3E5AB] cursor-pointer shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                        <span>Đeo khung ngay</span>
                      </button>
                    </div>
                  ) : (
                    <p className="pt-1 text-[11px] text-[#B8B0A0]">
                      Chúc cậu thưởng thức thật ngon miệng — thử đổi theme hoặc gọi thêm món khác nếu vẫn còn khung ảnh đang khóa nhé!
                    </p>
                  )}
                </motion.article>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
