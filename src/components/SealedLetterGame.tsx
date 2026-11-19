import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, BookOpen, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';
import type { CharacterItem } from '../App';
import { getCharacterStoryProfile } from '../data/characterProfiles';
import { BlackCatMascot } from './BlackCatMascot';
import {
  playDestinyChime,
  playSoftTap,
  playWaxSealBreakChime,
} from '../utils/soundEffects';

export interface SealedLetterGameProps {
  characters: CharacterItem[];
  onOpenCharacterProfile: (character: CharacterItem) => void;
  resetSignal?: number;
}

type MoodId = 'lonely-night' | 'danger-thrill' | 'gentle-shoulder';
type LetterPhase = 'mood' | 'sealed' | 'breaking' | 'opened';

interface MoodOption {
  id: MoodId;
  emoji: string;
  label: string;
  subtitle: string;
  keywords: string[];
  salutation: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'lonely-night',
    emoji: '🌙',
    label: 'Cô đơn đêm muộn',
    subtitle: 'Một lời thì thầm đồng cảm giữa khoảng lặng nửa đêm',
    keywords: [
      'cho doi',
      'chung tinh',
      'nguoc tam',
      'hoi han',
      'mit uot',
      'bi an',
      'lanh lung',
      'au co',
      'co trang',
      'chua lanh',
      'bam nguoi',
      'ngoai tinh',
    ],
    salutation: 'Gửi em, người còn thức lúc trăng đã nghiêng bóng...',
  },
  {
    id: 'danger-thrill',
    emoji: '🔥',
    label: 'Muốn tìm chút nguy hiểm',
    subtitle: 'Ánh nhìn sắc lạnh, chiếm hữu và sức hút khó cưỡng',
    keywords: [
      'chiem huu',
      'mafia',
      'hac dao',
      'yandere',
      'cuong che',
      'dien',
      'ma mi',
      'tam co',
      'mo hon',
      'ca khia',
      'hai mat',
      'tra xanh',
      'phan dien',
      'thang he',
    ],
    salutation: 'Đã tự mình chạm vào phong thư này thì đừng mong quay đầu...',
  },
  {
    id: 'gentle-shoulder',
    emoji: '🍷',
    label: 'Cần một bờ vai dịu dàng',
    subtitle: 'Chở che ấm áp, chiều chuộng và những câu nói vỗ về',
    keywords: [
      'sung',
      'sung ngot',
      'ngot',
      'greenflag',
      'chua lanh',
      'diu dang',
      'cun con',
      'cun lon',
      'bam vo',
      'nghien vo',
      'me vo',
      'thanh mai truc ma',
      'ghen ngam',
    ],
    salutation: 'Đừng gồng mình nữa, lại đây dựa vào vai ta một lát thôi...',
  },
];

function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function getPrimaryName(name: string): string {
  return name.split(/\s+[—-]\s+/)[0] || name;
}

function getSecondaryName(name: string): string {
  const parts = name.split(/\s+[—-]\s+/);
  return parts.length > 1 ? parts.slice(1).join(' · ') : '';
}

function matchCharacterForMood(
  mood: MoodOption,
  characters: CharacterItem[],
  lastId: string | null
): CharacterItem | null {
  if (characters.length === 0) return null;

  const keywords = mood.keywords.map(normalizeForMatch);
  const scored = characters.map((char) => {
    const profile = getCharacterStoryProfile(char);
    const normalizedTags = char.tags.map(normalizeForMatch);
    const normalizedCorpus = normalizeForMatch(
      `${char.name} ${char.description} ${profile.backstory.slice(0, 360)}`
    );

    let score = 0;
    for (const kw of keywords) {
      if (normalizedTags.some((t) => t.includes(kw) || kw.includes(t))) {
        score += 6;
      } else if (normalizedCorpus.includes(kw)) {
        score += 2;
      }
    }

    if (characters.length > 1 && char.id === lastId) {
      score -= 8;
    }

    score += Math.random() * 3.2;
    return { char, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.char || characters[0];
}

function extractLetterExcerpt(char: CharacterItem): {
  slogan: string;
  messageBody: string;
} {
  const profile = getCharacterStoryProfile(char);
  const primary = getPrimaryName(char.name);
  const slogan = char.description.trim().replace(/^["“]+|["”]+$/g, '');

  const rawFirst = profile.firstMessage
    .replace(/\{\{user\}\}/gi, 'em')
    .replace(/\{\{char\}\}/gi, primary)
    .replace(/\*+/g, '')
    .trim();

  // Tìm câu thoại trực tiếp trong ngoặc kép nếu đủ giàu cảm xúc
  const quoteMatches = rawFirst.match(/[“"][^”"]{28,240}[”"]/g);
  if (quoteMatches && quoteMatches.length > 0) {
    const chosenQuote = quoteMatches[0].replace(/^["“]+|["”]+$/g, '').trim();
    return {
      slogan,
      messageBody: chosenQuote,
    };
  }

  // Nếu không có ngoặc kép dài, lấy đoạn mở đầu gọn đẹp từ firstMessage
  const paragraphs = rawFirst
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 24);
  const rawExcerpt = paragraphs[paragraphs.length - 1] || paragraphs[0] || slogan;
  const cleaned = rawExcerpt.replace(/\s+/g, ' ').trim();

  if (cleaned.length <= 215) {
    return { slogan, messageBody: cleaned };
  }

  const sliced = cleaned.slice(0, 212);
  const lastSpace = sliced.lastIndexOf(' ');
  return {
    slogan,
    messageBody: `${lastSpace > 140 ? sliced.slice(0, lastSpace) : sliced}...`,
  };
}

/**
 * Con dấu sáp đỏ pha viền vàng Gold cổ điển dập nổi hoa văn hoàng gia & mèo nhỏ.
 */
const CrimsonGoldWaxSeal: React.FC<{ isBreaking?: boolean }> = ({ isBreaking = false }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full drop-shadow-[0_8px_22px_rgba(165,24,48,0.65)] transition-transform duration-200 ${
      isBreaking ? '' : 'group-hover:scale-105 group-active:scale-95'
    }`}
  >
    <defs>
      <radialGradient id="crimsonWaxOuter" cx="38%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#E14D63" />
        <stop offset="35%" stopColor="#A6192E" />
        <stop offset="78%" stopColor="#700B1C" />
        <stop offset="100%" stopColor="#430510" />
      </radialGradient>
      <radialGradient id="crimsonWaxInner" cx="42%" cy="36%" r="65%">
        <stop offset="0%" stopColor="#8F1427" />
        <stop offset="68%" stopColor="#5C0917" />
        <stop offset="100%" stopColor="#3B040E" />
      </radialGradient>
      <linearGradient id="sealGoldRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF3C4" />
        <stop offset="48%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8A6714" />
      </linearGradient>
    </defs>

    {/* Viền sáp đỏ chảy tự nhiên */}
    <path
      d="M60 6 C71 5, 79 10, 88 13 C96 17, 103 24, 107 33 C112 42, 115 51, 113 61 C114 72, 109 81, 104 90 C98 99, 91 106, 82 109 C73 113, 65 116, 56 114 C46 114, 38 111, 29 106 C21 101, 15 94, 11 85 C7 76, 5 67, 7 57 C6 46, 11 37, 16 28 C21 20, 28 14, 37 10 C45 7, 52 7, 60 6 Z"
      fill="url(#crimsonWaxOuter)"
      stroke="url(#sealGoldRim)"
      strokeOpacity="0.72"
      strokeWidth="1.5"
    />

    {/* Lòng dập nổi */}
    <circle
      cx="60"
      cy="60"
      r="40"
      fill="url(#crimsonWaxInner)"
      stroke="url(#sealGoldRim)"
      strokeOpacity="0.88"
      strokeWidth="1.8"
    />
    <circle
      cx="60"
      cy="60"
      r="34"
      stroke="#F3E5AB"
      strokeOpacity="0.38"
      strokeWidth="1"
      strokeDasharray="3 3"
    />

    {/* Họa tiết trái tim & cánh sao vàng dập nổi */}
    <path
      d="M60 22 L61.5 26 L65.5 27.5 L61.5 29 L60 33 L58.5 29 L54.5 27.5 L58.5 26 Z"
      fill="#F3E5AB"
      fillOpacity="0.9"
    />
    <path
      d="M60 77 C60 77 41 64.5 41 51.5 C41 44.5 46.5 39.5 52.8 39.5 C56.5 39.5 58.8 41.4 60 43.4 C61.2 41.4 63.5 39.5 67.2 39.5 C73.5 39.5 79 44.5 79 51.5 C79 64.5 60 77 60 77 Z"
      fill="url(#sealGoldRim)"
      fillOpacity="0.92"
      stroke="#FFF7D6"
      strokeOpacity="0.55"
      strokeWidth="1"
    />
    <path
      d="M60 88 L61.2 91.2 L64.4 92.4 L61.2 93.6 L60 96.8 L58.8 93.6 L55.6 92.4 L58.8 91.2 Z"
      fill="#F3E5AB"
      fillOpacity="0.8"
    />
  </svg>
);

export const SealedLetterGame: React.FC<SealedLetterGameProps> = ({
  characters,
  onOpenCharacterProfile,
  resetSignal = 0,
}) => {
  const [phase, setPhase] = useState<LetterPhase>('mood');
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [matchedChar, setMatchedChar] = useState<CharacterItem | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const breakTimerRef = useRef<number | null>(null);
  const lastMatchedIdRef = useRef<string | null>(null);

  const clearTimers = useCallback(() => {
    if (breakTimerRef.current) {
      window.clearTimeout(breakTimerRef.current);
      breakTimerRef.current = null;
    }
  }, []);

  const resetToMoodSelection = useCallback(() => {
    clearTimers();
    setPhase('mood');
    setSelectedMood(null);
    setMatchedChar(null);
    setAvatarFailed(false);
  }, [clearTimers]);

  useEffect(() => {
    if (resetSignal > 0) {
      resetToMoodSelection();
    }
  }, [resetSignal, resetToMoodSelection]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const handleSelectMood = (mood: MoodOption) => {
    if (characters.length === 0) return;
    playSoftTap('card');
    clearTimers();

    const chosen = matchCharacterForMood(mood, characters, lastMatchedIdRef.current);
    if (chosen) {
      lastMatchedIdRef.current = chosen.id;
    }

    setSelectedMood(mood);
    setMatchedChar(chosen);
    setAvatarFailed(false);
    setPhase('sealed');
  };

  const handleBreakSeal = () => {
    if (phase !== 'sealed' || !matchedChar) return;
    playWaxSealBreakChime();
    setPhase('breaking');

    clearTimers();
    breakTimerRef.current = window.setTimeout(() => {
      setPhase('opened');
      playDestinyChime();
    }, 680);
  };

  const handleDrawAnotherForMood = () => {
    if (!selectedMood) return;
    handleSelectMood(selectedMood);
  };

  const excerpt = matchedChar ? extractLetterExcerpt(matchedChar) : null;
  const primaryLink = matchedChar
    ? matchedChar.dokiLink?.trim() || matchedChar.ggaiLink?.trim() || ''
    : '';
  const hasDoki = Boolean(matchedChar?.dokiLink && matchedChar.dokiLink.trim() !== '');
  const hasGgai = Boolean(matchedChar?.ggaiLink && matchedChar.ggaiLink.trim() !== '');
  const hasBothLinks = hasDoki && hasGgai;

  return (
    <div className="relative pt-4 pb-2">
      {/* BƯỚC 1: CHỌN TÂM TRẠNG */}
      {phase === 'mood' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F3E5AB]">
              💌 Bức Thư Niêm Phong Sáp Đỏ
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-[#B8B0A0] leading-relaxed">
              Chọn tâm trạng của bạn ngay lúc này. Một phong thư đen tuyền niêm phong sáp đỏ từ người hữu duyên nhất sẽ được đặt lên bàn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => handleSelectMood(mood)}
                className="group relative text-left rounded-2xl border border-[#D4AF37]/55 bg-[#12121A]/95 hover:bg-[#191622] hover:border-[#FFF4C4] p-4 sm:p-5 flex flex-col justify-between gap-3 min-h-[132px] shadow-[0_12px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_14px_38px_rgba(212,175,55,0.24)] active:scale-[0.98] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2B171D] to-[#121018] border border-[#D4AF37]/50 flex items-center justify-center text-2xl shadow-[0_0_16px_rgba(196,37,62,0.22)] group-hover:scale-105 transition-transform">
                    {mood.emoji}
                  </span>
                  <span className="text-[11px] font-medium text-[#D4AF37] opacity-80 group-hover:opacity-100">
                    Chọn tâm trạng →
                  </span>
                </div>

                <div>
                  <p className="font-display text-lg font-semibold text-[#F3E5AB] group-hover:text-[#FFF4C4] transition-colors">
                    {mood.label}
                  </p>
                  <p className="mt-1 text-xs text-[#A89F8F] leading-relaxed">
                    {mood.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* BƯỚC 2: PHONG THƯ ĐEN TUYỀN VỚI CON DẤU SÁP ĐỎ */}
      {(phase === 'sealed' || phase === 'breaking') && selectedMood && matchedChar && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-xl mx-auto py-3 flex flex-col items-center text-center"
        >
          <p className="text-xs font-medium text-[#D4AF37] mb-1">
            {selectedMood.emoji} {selectedMood.label}
          </p>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F3E5AB] mb-5">
            Một phong thư niêm phong vừa gửi tới bạn
          </h3>

          {/* Phong thư đen tuyền đặt giữa màn hình */}
          <div className="relative w-full max-w-[390px] sm:max-w-[430px] aspect-[16/10.5] flex items-center justify-center">
            {/* Ánh sáng huyền bí phía sau phong thư */}
            <motion.div
              aria-hidden="true"
              animate={
                phase === 'breaking'
                  ? { opacity: [0.55, 1, 0.85], scale: [1, 1.24, 1.1] }
                  : { opacity: [0.32, 0.56, 0.32], scale: [0.96, 1.04, 0.96] }
              }
              transition={
                phase === 'breaking'
                  ? { duration: 0.65, ease: 'easeOut' }
                  : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }
              className="pointer-events-none absolute -inset-6 rounded-3xl blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(166,25,46,0.24) 48%, transparent 74%)',
              }}
            />

            {/* Thân phong thư obsidian */}
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#14121B] via-[#0B0A10] to-[#060609] border border-[#D4AF37]/60 shadow-[0_24px_60px_rgba(0,0,0,0.92),inset_0_0_32px_rgba(212,175,55,0.08)] overflow-hidden">
              {/* Viền chỉ vàng bên trong phong thư */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#D4AF37]/28"
              />

              {/* Đường gấp tam giác đáy & hai bên */}
              <svg
                viewBox="0 0 400 260"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full"
              >
                <path
                  d="M0 260 L200 132 L400 260 Z"
                  fill="#0D0C12"
                  stroke="rgba(212,175,55,0.32)"
                  strokeWidth="1.2"
                />
                <path
                  d="M0 0 L190 128 L0 260 Z"
                  fill="#100F16"
                  fillOpacity="0.6"
                  stroke="rgba(212,175,55,0.22)"
                  strokeWidth="1"
                />
                <path
                  d="M400 0 L210 128 L400 260 Z"
                  fill="#100F16"
                  fillOpacity="0.6"
                  stroke="rgba(212,175,55,0.22)"
                  strokeWidth="1"
                />
              </svg>

              {/* Nắp tam giác phía trên mở ra khi breaking */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={phase === 'breaking' ? { rotateX: 165, opacity: 0.7 } : { rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'top center' }}
                className="pointer-events-none absolute inset-x-0 top-0 h-[58%] z-10"
              >
                <svg
                  viewBox="0 0 400 150"
                  preserveAspectRatio="none"
                  className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
                >
                  <path
                    d="M0 0 L400 0 L200 142 Z"
                    fill="#15131D"
                    stroke="rgba(212,175,55,0.58)"
                    strokeWidth="1.6"
                  />
                </svg>
              </motion.div>

              {/* Con dấu sáp đỏ/vàng tương tác ở trung tâm nắp thư */}
              <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={handleBreakSeal}
                  disabled={phase === 'breaking'}
                  aria-label="Bấm vào con dấu sáp đỏ để mở bức thư định mệnh"
                  className="group relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4]"
                >
                  {/* Vòng sáng quanh con dấu */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-3 rounded-full opacity-70"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(212,175,55,0.34) 0%, rgba(166,25,46,0.24) 55%, transparent 76%)',
                    }}
                  />

                  {/* Hiệu ứng nứt vỡ đôi khi bấm */}
                  <div className="relative w-full h-full">
                    <motion.div
                      animate={
                        phase === 'breaking'
                          ? { x: -24, y: -6, rotate: -20, opacity: 0 }
                          : { x: 0, y: 0, rotate: 0, opacity: 1 }
                      }
                      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                      style={{ clipPath: 'inset(0 50% 0 0)' }}
                      className="absolute inset-0"
                    >
                      <CrimsonGoldWaxSeal isBreaking={phase === 'breaking'} />
                    </motion.div>

                    <motion.div
                      animate={
                        phase === 'breaking'
                          ? { x: 24, y: 8, rotate: 20, opacity: 0 }
                          : { x: 0, y: 0, rotate: 0, opacity: 1 }
                      }
                      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                      style={{ clipPath: 'inset(0 0 0 50%)' }}
                      className="absolute inset-0"
                    >
                      <CrimsonGoldWaxSeal isBreaking={phase === 'breaking'} />
                    </motion.div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm font-medium text-[#F3E5AB]">
            {phase === 'breaking'
              ? '✨ Con dấu sáp đang tan chảy, bức thư dần hé mở...'
              : 'Chạm vào con dấu sáp đỏ ở giữa để bóc niêm phong'}
          </p>

          <button
            type="button"
            onClick={() => {
              playSoftTap('nav');
              resetToMoodSelection();
            }}
            className="mt-3 inline-flex items-center gap-1.5 min-h-[40px] px-4 py-1.5 rounded-xl border border-[#D4AF37]/35 bg-[#0B0B0F]/80 text-xs font-medium text-[#CFC8B8] hover:text-[#F3E5AB] hover:border-[#D4AF37]/75 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>Chọn lại tâm trạng</span>
          </button>
        </motion.div>
      )}

      {/* BƯỚC 3: BỨC THƯ ĐÃ MỞ RA VỚI LỜI NHẮN & CHỮ KÝ */}
      <AnimatePresence>
        {phase === 'opened' && selectedMood && matchedChar && excerpt && (
          <motion.div
            key="opened-letter-sheet"
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-2xl mx-auto"
          >
            {/* Vầng sáng vàng nhẹ quanh trang thư */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 rounded-[30px] blur-2xl opacity-55"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(166,25,46,0.16) 52%, transparent 76%)',
              }}
            />

            {/* Tờ thư cổ điển đen - vàng Gold */}
            <div className="relative z-10 rounded-2xl bg-gradient-to-b from-[#17151F] via-[#100F17] to-[#0B0A0F] border border-[#D4AF37]/75 p-5 sm:p-7 shadow-[0_22px_58px_rgba(0,0,0,0.92),0_0_32px_rgba(212,175,55,0.2)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#D4AF37]/24"
              />

              {/* Header lá thư: Chân dung người gửi + tâm trạng */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/65 shadow-[0_0_18px_rgba(212,175,55,0.28)] shrink-0 flex items-center justify-center">
                    {!avatarFailed && matchedChar.avatar.trim() !== '' ? (
                      <img
                        src={matchedChar.avatar}
                        alt={`Ảnh đại diện ${matchedChar.name}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                        onLoad={(e) => {
                          if (e.currentTarget.naturalWidth === 0) setAvatarFailed(true);
                        }}
                        onError={() => setAvatarFailed(true)}
                      />
                    ) : (
                      <BlackCatMascot size={42} variant="companion" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-[#D4AF37] flex items-center gap-1.5">
                      <span>{selectedMood.emoji}</span>
                      <span>{selectedMood.label}</span>
                    </p>
                    <h4 className="font-display text-2xl sm:text-[26px] font-semibold text-[#F3E5AB] truncate">
                      {getPrimaryName(matchedChar.name)}
                    </h4>
                    {getSecondaryName(matchedChar.name) && (
                      <p className="text-xs text-[#C7C0B2] truncate">
                        {getSecondaryName(matchedChar.name)}
                      </p>
                    )}
                    {matchedChar.tags.length > 0 && (
                      <p className="mt-1 text-[11px] text-[#9E9687] truncate">
                        {matchedChar.tags.slice(0, 4).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDrawAnotherForMood}
                  title="Rút một lá thư khác cùng tâm trạng"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 bg-[#0B0B0F]/85 text-xs font-medium text-[#E6CD82] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>Thư khác</span>
                </button>
              </div>

              {/* Nội dung lời nhắn & chữ ký */}
              <div className="relative z-10 py-5 space-y-3.5">
                <p className="text-xs sm:text-[13px] italic text-[#D4AF37]">
                  {selectedMood.salutation}
                </p>

                <blockquote className="rounded-xl bg-[#0B0B0F]/82 border border-[#D4AF37]/28 p-4 sm:p-5 space-y-2.5">
                  <p className="text-sm sm:text-[15.5px] text-[#F5EFE0] leading-relaxed italic">
                    “{excerpt.messageBody}”
                  </p>
                  {excerpt.slogan &&
                    normalizeForMatch(excerpt.slogan) !==
                      normalizeForMatch(excerpt.messageBody) && (
                      <p className="text-xs text-[#B8B0A0] pt-2 border-t border-[#D4AF37]/15">
                        Lời thì thầm: “{excerpt.slogan}”
                      </p>
                    )}
                </blockquote>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap('card');
                      onOpenCharacterProfile(matchedChar);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E6CD82] hover:text-[#FFF4C4] underline underline-offset-4 decoration-[#D4AF37]/50 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                    <span>Xem hồ sơ tình yêu</span>
                  </button>

                  <p className="font-display text-lg sm:text-xl italic text-[#F3E5AB] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                    <span>— {getPrimaryName(matchedChar.name)}</span>
                  </p>
                </div>
              </div>

              {/* Hai nút hành động chính bên dưới bức thư */}
              <div className="relative z-10 pt-4 border-t border-[#D4AF37]/20 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {primaryLink ? (
                    <a
                      href={primaryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSoftTap('card')}
                      className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#ECCD72] to-[#D4AF37] text-[#0B0B0F] text-xs sm:text-sm font-semibold whitespace-nowrap shadow-[0_0_24px_rgba(212,175,55,0.38)] hover:brightness-110 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4]"
                    >
                      <span>💌 Hồi âm ngay</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        playSoftTap('card');
                        onOpenCharacterProfile(matchedChar);
                      }}
                      className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#ECCD72] to-[#D4AF37] text-[#0B0B0F] text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer"
                    >
                      <span>💌 Xem hồ sơ để hồi âm</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap('nav');
                      resetToMoodSelection();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#161320]/95 border border-[#D4AF37]/70 text-[#F3E5AB] text-xs sm:text-sm font-semibold whitespace-nowrap hover:bg-[#D4AF37]/16 hover:border-[#FFF4C4] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                    <span>Chọn lại tâm trạng</span>
                  </button>
                </div>

                {hasBothLinks && (
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-[#B8B0A0]">
                    <span>Hồi âm qua:</span>
                    <a
                      href={matchedChar.dokiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSoftTap('card')}
                      className="inline-flex items-center gap-0.5 text-[#F3E5AB] hover:text-[#FFF4C4] underline underline-offset-4 decoration-[#D4AF37]/60"
                    >
                      <span>DokiChat</span>
                      <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                    </a>
                    <span aria-hidden="true" className="text-[#D4AF37]/50">
                      ·
                    </span>
                    <a
                      href={matchedChar.ggaiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSoftTap('card')}
                      className="inline-flex items-center gap-0.5 text-[#F3E5AB] hover:text-[#FFF4C4] underline underline-offset-4 decoration-[#D4AF37]/60"
                    >
                      <span>GGAI</span>
                      <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
