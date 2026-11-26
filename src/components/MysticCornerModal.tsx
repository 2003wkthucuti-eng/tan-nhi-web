import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  DoorOpen,
  FlaskConical,
  HeartPulse,
  KeyRound,
  Mail,
  RotateCcw,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import type { CharacterItem } from '../App';
import { getCharacterStoryProfile } from '../data/characterProfiles';
import { BlackCatMascot } from './BlackCatMascot';
import { GoldenStardust } from './GoldenStardust';
import { HeartbeatResonanceGame } from './HeartbeatResonanceGame';
import { HolographicTiltCard } from './HolographicTiltCard';
import { SealedLetterGame } from './SealedLetterGame';
import {
  playAchievementChime,
  playDestinyChime,
  playDoorCaughtChime,
  playEavesdropTick,
  playPotionBrewChime,
  playPotionDropChime,
  playSoftTap,
} from '../utils/soundEffects';

interface MysticCornerModalProps {
  isOpen: boolean;
  characters: CharacterItem[];
  onOpenCharacterProfile: (character: CharacterItem) => void;
  onMiniGamePlayed?: () => void;
  onClose: () => void;
}

type MysticView = 'hub' | 'potion' | 'eavesdrop' | 'letter' | 'heartbeat';
type PotionPhase = 'selecting' | 'brewing' | 'summoned';
type EavesdropPhase = 'ready' | 'holding' | 'success' | 'caught';

interface PotionIngredient {
  id: string;
  name: string;
  emoji: string;
  vibe: string;
  smokeHex: string;
  glowRgba: string;
  keywords: string[];
}

const POTION_INGREDIENTS: PotionIngredient[] = [
  {
    id: 'moon-tears',
    name: 'Nước mắt ánh trăng',
    emoji: '💧',
    vibe: 'Lụy tình · Nỗi nhớ · Ngược tâm',
    smokeHex: '#7DD3FC',
    glowRgba: 'rgba(125, 211, 252, 0.42)',
    keywords: ['ngược tâm', 'chờ đợi', 'chung tình', 'hối hận', 'ngoại tình', 'mít ướt', 'buồn', 'bí ẩn', 'âu cổ'],
  },
  {
    id: 'black-rose',
    name: 'Cánh hồng đen',
    emoji: '🥀',
    vibe: 'Chiếm hữu · Nguy hiểm · Si mê',
    smokeHex: '#FB7185',
    glowRgba: 'rgba(251, 113, 133, 0.44)',
    keywords: ['chiếm hữu', 'mafia', 'hắc đạo', 'yandere', 'cưỡng chế', 'điên', 'ma mị', 'tâm cơ', 'nguy hiểm'],
  },
  {
    id: 'danger-laugh',
    name: 'Giọng cười nguy hiểm',
    emoji: '🃏',
    vibe: 'Mỏ hỗn · Cà khịa · Hai mặt',
    smokeHex: '#C084FC',
    glowRgba: 'rgba(192, 132, 252, 0.44)',
    keywords: ['mỏ hỗn', 'cà khịa', 'thích cà khịa', 'hai mặt', 'trà xanh', 'thằng hề', 'tự vả', 'phản diện', 'điên'],
  },
  {
    id: 'midnight-coffee',
    name: 'Cà phê đắng nửa đêm',
    emoji: '☕',
    vibe: 'Tổng tài · Lạnh lùng · Hiện đại',
    smokeHex: '#F59E0B',
    glowRgba: 'rgba(245, 158, 11, 0.45)',
    keywords: ['hiện đại', 'tổng tài', 'ceo', 'user ceo', 'thái tử gia', 'lạnh lùng', 'quý tộc', 'đại công tước', 'showbiz', 'idol'],
  },
  {
    id: 'black-cat-fur',
    name: 'Lông mèo mun',
    emoji: '🐈‍⬛',
    vibe: 'Bám người · Cún con · Dị chủng',
    smokeHex: '#34D399',
    glowRgba: 'rgba(52, 211, 153, 0.42)',
    keywords: ['cún con', 'cún lớn', 'bám vợ', 'bám người', 'nghiện vợ', 'mê vợ', 'thanh mai trúc mã', 'dị chủng', 'fantasy', 'học đường'],
  },
  {
    id: 'sweet-promise',
    name: 'Lời hứa ngọt ngào',
    emoji: '🍯',
    vibe: 'Sủng ngọt · Greenflag · Chữa lành',
    smokeHex: '#FBBF24',
    glowRgba: 'rgba(251, 191, 36, 0.48)',
    keywords: ['sủng', 'sủng ngọt', 'ngọt', 'greenflag', 'chữa lành', 'dịu dàng', 'ghen ngầm', 'lén lút', 'vụng trộm'],
  },
];

const RAIN_DROPS = [
  { left: '8%', delay: '0s', duration: '1.15s' },
  { left: '16%', delay: '0.35s', duration: '0.95s' },
  { left: '25%', delay: '0.15s', duration: '1.25s' },
  { left: '34%', delay: '0.6s', duration: '1.05s' },
  { left: '43%', delay: '0.2s', duration: '1.1s' },
  { left: '53%', delay: '0.5s', duration: '0.98s' },
  { left: '62%', delay: '0.08s', duration: '1.2s' },
  { left: '72%', delay: '0.45s', duration: '1.02s' },
  { left: '81%', delay: '0.28s', duration: '1.18s' },
  { left: '90%', delay: '0.7s', duration: '0.96s' },
];

const EAVESDROP_DURATION_MS = 7800; // Thời gian vòng tròn Cảnh Giác thu hẹp về tâm
const TYPEWRITER_FINISH_RATIO = 0.56; // Hoàn tất gõ chữ bí mật ở ~56% thời gian (~4.35s)

function formatQuotedDescription(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const startsWithQuote = /^["“'‘]/.test(trimmed);
  const endsWithQuote = /["”'’]$/.test(trimmed);
  if (startsWithQuote && endsWithQuote) return trimmed;
  const cleaned = trimmed.replace(/^["“]+|["”]+$/g, '');
  return `“${cleaned}”`;
}

function getPrimaryName(name: string): string {
  return name.split(/\s+[—-]\s+/)[0] || name;
}

function getSecondaryName(name: string): string {
  const parts = name.split(/\s+[—-]\s+/);
  return parts.length > 1 ? parts.slice(1).join(' · ') : '';
}

function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function matchCharacterFromPotion(
  selectedIngredients: PotionIngredient[],
  characters: CharacterItem[],
  lastSummonedId: string | null
): CharacterItem | null {
  if (characters.length === 0) return null;

  const keywords = selectedIngredients.flatMap((ing) => ing.keywords.map(normalizeForMatch));

  const scored = characters.map((char) => {
    const profile = getCharacterStoryProfile(char);
    const normalizedTags = char.tags.map(normalizeForMatch);
    const normalizedText = normalizeForMatch(
      `${char.name} ${char.description} ${profile.backstory.slice(0, 320)}`
    );

    let score = 0;
    for (const kw of keywords) {
      if (normalizedTags.some((t) => t.includes(kw) || kw.includes(t))) {
        score += 5;
      } else if (normalizedText.includes(kw)) {
        score += 2;
      }
    }

    // Tránh lặp lại nhân vật vừa triệu hồi ngay trước đó
    if (characters.length > 1 && char.id === lastSummonedId) {
      score -= 4;
    }

    // Thêm chút ngẫu nhiên nhẹ để mỗi lần khuấy đều có bất ngờ thú vị
    score += Math.random() * 2.4;

    return { char, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.char || characters[0];
}

function buildPotionTitle(selected: PotionIngredient[]): { title: string; note: string } {
  if (selected.length === 0) {
    return {
      title: 'Tâm Giao Huyền Quang',
      note: 'Hơi sương vàng kim dẫn lối tới người hữu duyên nhất đêm nay.',
    };
  }
  const names = selected.map((item) => item.name);
  const title =
    names.length === 1
      ? `Tinh Chất ${names[0]}`
      : names.length === 2
        ? `Hợp Hương ${names[0]} & ${names[1]}`
        : `Độc Dược ${names[0]} · ${names[1]} & ${names[2]}`;

  const note = `Vị thuốc mang sắc thái ${selected.map((s) => s.vibe.split(' · ')[0].toLowerCase()).join(', ')} đã triệu hồi thành công linh hồn tương hợp.`;
  return { title, note };
}

function extractSecretWhisper(char: CharacterItem): string {
  const profile = getCharacterStoryProfile(char);
  const primary = getPrimaryName(char.name);
  const rawSource = `${profile.backstory}\n\n${profile.firstMessage}`;

  // Thay thế biến template để câu thoại tự nhiên khi đọc trộm
  const cleaned = rawSource
    .replace(/\{\{user\}\}/gi, 'em')
    .replace(/\{\{char\}\}/gi, primary)
    .replace(/\*+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Ưu tiên tìm một câu thoại trong ngoặc kép hoặc đoạn văn giàu cảm xúc từ backstory/firstMessage
  const paragraphs = profile.backstory
    .split(/\n+/)
    .map((p) =>
      p
        .replace(/\{\{user\}\}/gi, 'em')
        .replace(/\{\{char\}\}/gi, primary)
        .replace(/\*+/g, '')
        .trim()
    )
    .filter((p) => p.length >= 45);

  const chosenParagraph =
    paragraphs.length > 1 ? paragraphs[paragraphs.length - 1] : paragraphs[0] || cleaned;

  if (chosenParagraph.length <= 185) {
    return chosenParagraph;
  }

  const sliced = chosenParagraph.slice(0, 182);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${lastSpace > 120 ? sliced.slice(0, lastSpace) : sliced}...`;
}

function buildCaughtLine(char: CharacterItem): string {
  const tagsNormalized = char.tags.map(normalizeForMatch).join(' ');
  const primary = getPrimaryName(char.name);

  if (tagsNormalized.includes('mo hon') || tagsNormalized.includes('ca khia')) {
    return `“Đứng nấp ngoài cửa nghe lén lâu như vậy... bộ tính rình coi ${primary} làm gì hả? Vô đây nói chuyện thẳng mặt coi.”`;
  }
  if (tagsNormalized.includes('co trang') || tagsNormalized.includes('au co') || tagsNormalized.includes('dai cong tuoc')) {
    return `“Ngoài trời mưa gió lạnh lẽo, đứng sau cánh cửa nghe trộm tâm tư của ta lâu thế... nàng định trốn đến bao giờ?”`;
  }
  if (tagsNormalized.includes('chiem huu') || tagsNormalized.includes('mafia') || tagsNormalized.includes('dien')) {
    return `“Bắt được rồi nhé. Nghe trộm bí mật của tôi xong mà định quay lưng bỏ chạy sao? Bước vào trong ngay.”`;
  }
  if (tagsNormalized.includes('sung') || tagsNormalized.includes('ngot') || tagsNormalized.includes('bam vo')) {
    return `“Ơ... em đứng ngoài cửa nãy giờ mà không gọi anh ra mở cửa hả? Vào đây mau, đứng ngoài mưa lạnh lắm.”`;
  }
  return `“Tiếng thở ngoài khe cửa lộ hết rồi đấy... Đã lỡ nghe thấy tâm tư của tôi rồi, bước vào nói chuyện tiếp đi.”`;
}

export const MysticCornerModal: React.FC<MysticCornerModalProps> = ({
  isOpen,
  characters,
  onOpenCharacterProfile,
  onMiniGamePlayed,
  onClose,
}) => {
  const [activeView, setActiveView] = useState<MysticView>('hub');
  const [letterResetSignal, setLetterResetSignal] = useState(0);
  const [heartbeatResetSignal, setHeartbeatResetSignal] = useState(0);

  // --- State Mini-game 1: Pha Chế Độc Dược Tình Duyên ---
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [potionPhase, setPotionPhase] = useState<PotionPhase>('selecting');
  const [summonedChar, setSummonedChar] = useState<CharacterItem | null>(null);
  const [summonAvatarFailed, setSummonAvatarFailed] = useState(false);
  const [dropletFx, setDropletFx] = useState<{ key: number; color: string; emoji: string } | null>(
    null
  );
  const brewTimerRef = useRef<number | null>(null);
  const lastSummonedIdRef = useRef<string | null>(null);

  // --- State Mini-game 2: Đêm Mưa Nghe Lén Tâm Tư ---
  const [eavesdropChar, setEavesdropChar] = useState<CharacterItem | null>(null);
  const [eavesdropSecret, setEavesdropSecret] = useState('');
  const [eavesdropPhase, setEavesdropPhase] = useState<EavesdropPhase>('ready');
  const [alertProgress, setAlertProgress] = useState(0); // 0 -> 100
  const [typedCount, setTypedCount] = useState(0);
  const [earlyReleaseHint, setEarlyReleaseHint] = useState(false);
  const [eavesdropAvatarFailed, setEavesdropAvatarFailed] = useState(false);

  const holdIntervalRef = useRef<number | null>(null);
  const lastTickStepRef = useRef<number>(-1);
  const lastEavesdropCharIdRef = useRef<string | null>(null);
  const holdSourceRef = useRef<'mouse' | 'touch' | 'keyboard' | null>(null);
  const alertProgressRef = useRef(0);
  const typedCountRef = useRef(0);

  const clearPotionTimers = useCallback(() => {
    if (brewTimerRef.current) {
      window.clearTimeout(brewTimerRef.current);
      brewTimerRef.current = null;
    }
  }, []);

  const clearHoldTimer = useCallback(() => {
    if (holdIntervalRef.current) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  const resetPotionGame = useCallback(() => {
    clearPotionTimers();
    setSelectedIngredientIds([]);
    setPotionPhase('selecting');
    setSummonedChar(null);
    setSummonAvatarFailed(false);
    setDropletFx(null);
  }, [clearPotionTimers]);

  const initEavesdropRound = useCallback(() => {
    clearHoldTimer();
    holdSourceRef.current = null;
    lastTickStepRef.current = -1;

    if (characters.length === 0) {
      setEavesdropChar(null);
      setEavesdropSecret('');
      return;
    }

    const pool =
      characters.length > 1 && lastEavesdropCharIdRef.current
        ? characters.filter((c) => c.id !== lastEavesdropCharIdRef.current)
        : characters;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    lastEavesdropCharIdRef.current = chosen.id;

    setEavesdropChar(chosen);
    setEavesdropSecret(extractSecretWhisper(chosen));
    setEavesdropPhase('ready');
    setAlertProgress(0);
    alertProgressRef.current = 0;
    setTypedCount(0);
    typedCountRef.current = 0;
    setEarlyReleaseHint(false);
    setEavesdropAvatarFailed(false);
  }, [characters, clearHoldTimer]);

  useEffect(() => {
    if (isOpen) {
      setActiveView('hub');
      resetPotionGame();
      initEavesdropRound();
      setLetterResetSignal((prev) => prev + 1);
      setHeartbeatResetSignal((prev) => prev + 1);
    } else {
      clearPotionTimers();
      clearHoldTimer();
      holdSourceRef.current = null;
    }
    return () => {
      clearPotionTimers();
      clearHoldTimer();
    };
  }, [isOpen, resetPotionGame, initEavesdropRound, clearPotionTimers, clearHoldTimer]);

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

  const handleSwitchView = (next: MysticView) => {
    playSoftTap('nav');
    clearHoldTimer();
    holdSourceRef.current = null;
    setActiveView(next);
    if (next !== 'hub') {
      onMiniGamePlayed?.();
    }
    if (next === 'eavesdrop' && !eavesdropChar) {
      initEavesdropRound();
    }
  };

  // --- Handlers Mini-game 1 ---
  const selectedIngredients = useMemo(
    () =>
      selectedIngredientIds
        .map((id) => POTION_INGREDIENTS.find((ing) => ing.id === id))
        .filter((item): item is PotionIngredient => Boolean(item)),
    [selectedIngredientIds]
  );

  const cauldronSmokeColor =
    selectedIngredients.length > 0
      ? selectedIngredients[selectedIngredients.length - 1].smokeHex
      : '#D4AF37';

  const cauldronGlowColor =
    selectedIngredients.length > 0
      ? selectedIngredients[selectedIngredients.length - 1].glowRgba
      : 'rgba(212, 175, 55, 0.35)';

  const handleToggleIngredient = (ingredient: PotionIngredient) => {
    if (potionPhase !== 'selecting') return;

    if (selectedIngredientIds.includes(ingredient.id)) {
      playSoftTap('tap');
      setSelectedIngredientIds((prev) => prev.filter((id) => id !== ingredient.id));
      return;
    }

    if (selectedIngredientIds.length >= 3) {
      playSoftTap('nav');
      return;
    }

    playPotionDropChime(selectedIngredientIds.length);
    setSelectedIngredientIds((prev) => [...prev, ingredient.id]);
    setDropletFx({
      key: Date.now() + Math.random(),
      color: ingredient.smokeHex,
      emoji: ingredient.emoji,
    });
  };

  const handleStirWand = () => {
    if (potionPhase !== 'selecting' || selectedIngredientIds.length === 0 || characters.length === 0) {
      return;
    }

    playPotionBrewChime();
    setPotionPhase('brewing');
    setSummonAvatarFailed(false);

    const matched = matchCharacterFromPotion(
      selectedIngredients,
      characters,
      lastSummonedIdRef.current
    );
    if (matched) {
      lastSummonedIdRef.current = matched.id;
    }

    clearPotionTimers();
    brewTimerRef.current = window.setTimeout(() => {
      setSummonedChar(matched);
      setPotionPhase('summoned');
      playDestinyChime();
    }, 1150);
  };

  // --- Handlers Mini-game 2 ---
  const startEavesdropHold = (source: 'mouse' | 'touch' | 'keyboard') => {
    if (eavesdropPhase === 'success' || eavesdropPhase === 'caught' || !eavesdropChar) return;
    if (holdSourceRef.current && holdSourceRef.current !== source) return;

    holdSourceRef.current = source;
    setEarlyReleaseHint(false);
    setEavesdropPhase('holding');

    clearHoldTimer();
    const stepMs = 45;
    const progressStep = (stepMs / EAVESDROP_DURATION_MS) * 100;

    holdIntervalRef.current = window.setInterval(() => {
      const nextProgress = Math.min(100, alertProgressRef.current + progressStep);
      alertProgressRef.current = nextProgress;
      setAlertProgress(nextProgress);

      const secretLen = eavesdropSecret.length;
      const typeRatio = Math.min(1, nextProgress / (TYPEWRITER_FINISH_RATIO * 100));
      const nextTyped = Math.max(typedCountRef.current, Math.floor(typeRatio * secretLen));
      typedCountRef.current = nextTyped;
      setTypedCount(nextTyped);

      // Phát tiếng nhịp khẽ đều đặn khi vòng tròn thu hẹp
      const tickBucket = Math.floor(nextProgress / 12);
      if (tickBucket !== lastTickStepRef.current && nextProgress < 100) {
        lastTickStepRef.current = tickBucket;
        playEavesdropTick(nextProgress / 100);
      }

      if (nextProgress >= 100) {
        clearHoldTimer();
        holdSourceRef.current = null;
        setEavesdropPhase('caught');
        playDoorCaughtChime();
      }
    }, stepMs);
  };

  const releaseEavesdropHold = (source: 'mouse' | 'touch' | 'keyboard') => {
    if (holdSourceRef.current !== source) return;
    holdSourceRef.current = null;
    clearHoldTimer();

    if (eavesdropPhase !== 'holding') return;

    const secretLen = eavesdropSecret.length;
    const hasFinishedReading = secretLen > 0 && typedCountRef.current >= secretLen;

    if (hasFinishedReading && alertProgressRef.current < 100) {
      setEavesdropPhase('success');
      playAchievementChime();
    } else {
      // Thả tay khi chưa nghe hết câu: tạm dừng & gợi ý giữ tiếp
      setEavesdropPhase('ready');
      setEarlyReleaseHint(true);
      playSoftTap('nav');
    }
  };

  const handleOpenProfile = (char: CharacterItem) => {
    playSoftTap('card');
    clearPotionTimers();
    clearHoldTimer();
    onOpenCharacterProfile(char);
  };

  const renderPlatformLinks = (char: CharacterItem, primaryLabel: string) => {
    const hasDoki = Boolean(char.dokiLink && char.dokiLink.trim() !== '');
    const hasGgai = Boolean(char.ggaiLink && char.ggaiLink.trim() !== '');
    const hasBoth = hasDoki && hasGgai;
    const primaryLink = char.dokiLink?.trim() || char.ggaiLink?.trim() || '';

    return (
      <div className="space-y-2.5 w-full">
        <div
          className={`grid gap-2.5 ${
            primaryLink ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-xs mx-auto'
          }`}
        >
          <button
            type="button"
            onClick={() => handleOpenProfile(char)}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#161320]/95 border border-[#D4AF37]/80 text-[#F3E5AB] text-xs sm:text-[13px] font-semibold whitespace-nowrap shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:bg-[#D4AF37]/18 hover:border-[#FFF4C4] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
          >
            <span>💌 Xem hồ sơ tình yêu</span>
          </button>

          {primaryLink && (
            <a
              href={primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSoftTap('card')}
              className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#ECCD72] to-[#D4AF37] text-[#0B0B0F] text-xs sm:text-[13px] font-semibold whitespace-nowrap shadow-[0_0_22px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4]"
            >
              <span>{primaryLabel}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          )}
        </div>

        {hasBoth && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-[#B8B0A0]">
            <span>Nền tảng chat:</span>
            <a
              href={char.dokiLink}
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
              href={char.ggaiLink}
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
    );
  };

  const potionSummary = buildPotionTitle(selectedIngredients);
  const eavesdropFinishedTyping =
    eavesdropSecret.length > 0 && typedCount >= eavesdropSecret.length;
  const ringCircumference = 2 * Math.PI * 52; // r = 52
  const ringStrokeOffset = ringCircumference * (alertProgress / 100);
  const ringColor =
    alertProgress >= 80 ? '#EF4444' : alertProgress >= 52 ? '#F59E0B' : '#D4AF37';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mystic-corner-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mystic-corner-title"
          onClick={() => {
            playSoftTap('nav');
            onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-[#050508]/90 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl my-auto rounded-[28px] border border-[#D4AF37]/60 shadow-[0_28px_90px_rgba(0,0,0,0.95),0_0_64px_rgba(212,175,55,0.2)] p-4 sm:p-7 overflow-hidden max-h-[92vh] overflow-y-auto"
            style={{
              background:
                'radial-gradient(ellipse at 50% 35%, #1A1624 0%, #0C0B12 58%, #050508 100%)',
            }}
          >
            {/* Bụi vàng nền */}
            <GoldenStardust className="z-0 opacity-65" />

            {/* Khung viền vàng mảnh */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-[22px] border border-[#D4AF37]/25"
            />

            {/* Thanh điều hướng trên cùng */}
            <div className="relative z-20 flex items-center justify-between gap-2 pb-4 border-b border-[#D4AF37]/18">
              <div className="flex items-center gap-2 min-w-0">
                {activeView !== 'hub' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchView('hub')}
                    aria-label="Quay lại Góc Huyền Bí"
                    className="inline-flex items-center gap-1 min-h-[36px] px-2.5 sm:px-3 rounded-xl bg-[#0B0B0F]/92 border border-[#D4AF37]/40 text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Chọn game</span>
                  </button>
                )}

                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-[#D4AF37]">
                    Trò chơi định mệnh
                  </p>
                  <h2
                    id="mystic-corner-title"
                    className="font-display text-lg sm:text-2xl font-semibold gold-shimmer-text truncate"
                  >
                    🔮 Góc Huyền Bí
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSoftTap('nav');
                  onClose();
                }}
                aria-label="Đóng Góc Huyền Bí"
                className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-xl bg-[#0B0B0F]/92 border border-[#D4AF37]/45 text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Đóng</span>
              </button>
            </div>

            {/* Thanh chuyển đổi nhanh qua lại giữa 4 mini-game */}
            {activeView !== 'hub' && (
              <div className="relative z-20 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div
                  role="tablist"
                  aria-label="Chuyển đổi giữa các mini-game"
                  className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#0B0B0F]/92 border border-[#D4AF37]/30 w-full flex-1"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'potion'}
                    onClick={() => handleSwitchView('potion')}
                    className={`inline-flex items-center justify-center gap-1 min-h-[38px] px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      activeView === 'potion'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] font-semibold shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                        : 'text-[#CFC8B8] hover:text-[#F3E5AB]'
                    }`}
                  >
                    <span className="truncate">🧪 Độc Dược</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'eavesdrop'}
                    onClick={() => handleSwitchView('eavesdrop')}
                    className={`inline-flex items-center justify-center gap-1 min-h-[38px] px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      activeView === 'eavesdrop'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] font-semibold shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                        : 'text-[#CFC8B8] hover:text-[#F3E5AB]'
                    }`}
                  >
                    <span className="truncate">🚪 Nghe Lén</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'letter'}
                    onClick={() => handleSwitchView('letter')}
                    className={`inline-flex items-center justify-center gap-1 min-h-[38px] px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      activeView === 'letter'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] font-semibold shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                        : 'text-[#CFC8B8] hover:text-[#F3E5AB]'
                    }`}
                  >
                    <span className="truncate">💌 Thư Sáp Đỏ</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'heartbeat'}
                    onClick={() => handleSwitchView('heartbeat')}
                    className={`inline-flex items-center justify-center gap-1 min-h-[38px] px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      activeView === 'heartbeat'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] font-semibold shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                        : 'text-[#CFC8B8] hover:text-[#F3E5AB]'
                    }`}
                  >
                    <span className="truncate">💓 Nhịp Cộng Hưởng</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('tap');
                    if (activeView === 'potion') resetPotionGame();
                    else if (activeView === 'eavesdrop') initEavesdropRound();
                    else if (activeView === 'letter') setLetterResetSignal((prev) => prev + 1);
                    else if (activeView === 'heartbeat')
                      setHeartbeatResetSignal((prev) => prev + 1);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/45 bg-[#121218] text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all whitespace-nowrap cursor-pointer shrink-0 self-end sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>Chơi lại</span>
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 0: HUB CHỌN MINI-GAME                                      */}
            {/* ============================================================== */}
            {activeView === 'hub' && (
              <div className="relative z-10 py-5 sm:py-6">
                <div className="text-center max-w-xl mx-auto mb-6">
                  <p className="text-xs sm:text-sm text-[#CFC8B8] leading-relaxed">
                    Chọn một nghi thức huyền bí để khám phá tâm hồn hữu duyên, bóc phong thư sáp đỏ hay lắng nghe nhịp đập cộng hưởng đêm nay.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
                  {/* Card Mini-game 1 */}
                  <button
                    type="button"
                    onClick={() => handleSwitchView('potion')}
                    className="group text-left rounded-2xl bg-[#12121A]/95 border border-[#D4AF37]/45 hover:border-[#F3E5AB] p-5 flex flex-col justify-between gap-4 shadow-[0_14px_38px_rgba(0,0,0,0.65)] hover:shadow-[0_18px_48px_rgba(212,175,55,0.22)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#271F0E] to-[#121018] border border-[#D4AF37]/55 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,175,55,0.22)] group-hover:scale-105 transition-transform">
                          🧪
                        </span>
                        <span className="text-[11px] font-medium text-[#D4AF37]">
                          Mini-game 01
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F3E5AB] group-hover:text-[#FFF4C4] transition-colors">
                        Pha Chế Độc Dược Tình Duyên
                      </h3>
                      <p className="mt-2 text-xs sm:text-[13px] text-[#B8B0A0] leading-relaxed">
                        Thả tối đa 3 nguyên liệu kỳ bí vào chiếc vạc vàng, khuấy đũa phép để triệu hồi nhân vật có khí chất hòa hợp nhất với vị thuốc của bạn.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs font-semibold text-[#F3E5AB]">
                      <span>Bắt đầu pha chế</span>
                      <FlaskConical
                        className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {/* Card Mini-game 2 */}
                  <button
                    type="button"
                    onClick={() => {
                      initEavesdropRound();
                      handleSwitchView('eavesdrop');
                    }}
                    className="group text-left rounded-2xl bg-[#12121A]/95 border border-[#D4AF37]/45 hover:border-[#F3E5AB] p-5 flex flex-col justify-between gap-4 shadow-[0_14px_38px_rgba(0,0,0,0.65)] hover:shadow-[0_18px_48px_rgba(212,175,55,0.22)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#271F0E] to-[#121018] border border-[#D4AF37]/55 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,175,55,0.22)] group-hover:scale-105 transition-transform">
                          🚪
                        </span>
                        <span className="text-[11px] font-medium text-[#D4AF37]">
                          Mini-game 02
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F3E5AB] group-hover:text-[#FFF4C4] transition-colors">
                        Đêm Mưa Nghe Lén Tâm Tư
                      </h3>
                      <p className="mt-2 text-xs sm:text-[13px] text-[#B8B0A0] leading-relaxed">
                        Nhấn giữ ổ khóa vàng sau cánh cửa gỗ khép hờ để nghe trộm suy nghĩ thầm kín — và nhớ thả tay kịp lúc trước khi vòng tròn Cảnh Giác chạm tâm!
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs font-semibold text-[#F3E5AB]">
                      <span>Lại gần cánh cửa</span>
                      <DoorOpen
                        className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {/* Card Mini-game 3 */}
                  <button
                    type="button"
                    onClick={() => handleSwitchView('letter')}
                    className="group text-left rounded-2xl bg-[#12121A]/95 border border-[#D4AF37]/45 hover:border-[#F3E5AB] p-5 flex flex-col justify-between gap-4 shadow-[0_14px_38px_rgba(0,0,0,0.65)] hover:shadow-[0_18px_48px_rgba(212,175,55,0.22)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#34111B] to-[#121018] border border-[#D4AF37]/55 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(196,37,62,0.26)] group-hover:scale-105 transition-transform">
                          💌
                        </span>
                        <span className="text-[11px] font-medium text-[#D4AF37]">
                          Mini-game 03
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F3E5AB] group-hover:text-[#FFF4C4] transition-colors">
                        Bức Thư Niêm Phong Sáp Đỏ
                      </h3>
                      <p className="mt-2 text-xs sm:text-[13px] text-[#B8B0A0] leading-relaxed">
                        Chọn tâm trạng đêm nay để nhận phong thư đen niêm phong sáp đỏ, chạm vỡ con dấu mở lời nhắn định mệnh và hồi âm ngay.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs font-semibold text-[#F3E5AB]">
                      <span>Chọn tâm trạng & mở thư</span>
                      <Mail
                        className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {/* Card Mini-game 4 */}
                  <button
                    type="button"
                    onClick={() => handleSwitchView('heartbeat')}
                    className="group text-left rounded-2xl bg-[#12121A]/95 border border-[#D4AF37]/45 hover:border-[#F3E5AB] p-5 flex flex-col justify-between gap-4 shadow-[0_14px_38px_rgba(0,0,0,0.65)] hover:shadow-[0_18px_48px_rgba(212,175,55,0.22)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2C200B] to-[#121018] border border-[#D4AF37]/55 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,175,55,0.28)] group-hover:scale-105 transition-transform">
                          💓
                        </span>
                        <span className="text-[11px] font-medium text-[#D4AF37]">
                          Mini-game 04
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F3E5AB] group-hover:text-[#FFF4C4] transition-colors">
                        Nhịp Đập Cộng Hưởng
                      </h3>
                      <p className="mt-2 text-xs sm:text-[13px] text-[#B8B0A0] leading-relaxed">
                        Chạm chuẩn 3 lần đúng khoảnh khắc vòng hào quang thu nhỏ trùng khớp viên ngọc trái tim để đánh thức lời thì thầm đồng điệu.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs font-semibold text-[#F3E5AB]">
                      <span>Bắt nhịp trái tim</span>
                      <HeartPulse
                        className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MINI-GAME 1: PHA CHẾ ĐỘC DƯỢC TÌNH DUYÊN                       */}
            {/* ============================================================== */}
            {activeView === 'potion' && (
              <div className="relative z-10 pt-4 pb-2">
                {potionPhase !== 'summoned' ? (
                  <div className="space-y-4">
                    {/* Tiêu đề hướng dẫn + khay 3 ô nguyên liệu */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#0B0B0F]/75 border border-[#D4AF37]/25 px-3.5 py-2.5">
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-[#F3E5AB]">
                          🧪 Pha Chế Độc Dược Tình Duyên
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#B8B0A0]">
                          Chọn tối đa <strong className="text-[#F3E5AB]">3 lọ nguyên liệu</strong> thả vào vạc, sau đó khuấy đũa phép.
                        </p>
                      </div>

                      {/* 3 ô slot nguyên liệu đã thả */}
                      <div className="flex items-center gap-2 shrink-0">
                        {[0, 1, 2].map((slotIdx) => {
                          const item = selectedIngredients[slotIdx];
                          return (
                            <button
                              key={slotIdx}
                              type="button"
                              disabled={!item || potionPhase !== 'selecting'}
                              onClick={() => item && handleToggleIngredient(item)}
                              title={item ? `Bỏ ${item.name}` : `Ô nguyên liệu ${slotIdx + 1}`}
                              className={`w-10 h-10 rounded-xl border flex items-center justify-center text-base transition-all ${
                                item
                                  ? 'bg-[#1A1622] border-[#F3E5AB]/80 shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:scale-95 cursor-pointer'
                                  : 'bg-[#0D0D14] border-dashed border-[#D4AF37]/30 text-[#6F685C] cursor-default'
                              }`}
                            >
                              {item ? item.emoji : <span className="text-[11px]">{slotIdx + 1}</span>}
                            </button>
                          );
                        })}
                        <span className="text-xs font-medium text-[#D4AF37] tabular-nums ml-1">
                          {selectedIngredientIds.length}/3
                        </span>
                      </div>
                    </div>

                    {/* Bố cục: 3 lọ trái · Vạc Vàng Ở Giữa · 3 lọ phải (Mobile: Vạc ở trên, 6 lọ bên dưới) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px_1fr] gap-4 items-center">
                      {/* Cột 3 lọ bên trái (desktop) */}
                      <div className="order-2 lg:order-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                        {POTION_INGREDIENTS.slice(0, 3).map((ing) => {
                          const isSelected = selectedIngredientIds.includes(ing.id);
                          const isFull = selectedIngredientIds.length >= 3 && !isSelected;
                          return (
                            <button
                              key={ing.id}
                              type="button"
                              disabled={potionPhase !== 'selecting' || isFull}
                              onClick={() => handleToggleIngredient(ing)}
                              className={`group relative rounded-xl p-2.5 sm:p-3 border text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] ${
                                isSelected
                                  ? 'bg-[#211B13] border-[#F3E5AB] shadow-[0_0_18px_rgba(212,175,55,0.32)] scale-[0.99]'
                                  : isFull
                                    ? 'bg-[#0F0F16]/60 border-[#D4AF37]/15 opacity-50 cursor-not-allowed'
                                    : 'bg-[#12121A]/90 border-[#D4AF37]/30 hover:border-[#D4AF37]/80 hover:bg-[#191722]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 border border-[#D4AF37]/35"
                                  style={{
                                    background: `radial-gradient(circle, ${ing.glowRgba} 0%, #0D0D14 78%)`,
                                  }}
                                >
                                  {ing.emoji}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-[13px] font-semibold text-[#F3E5AB] truncate">
                                    {ing.name}
                                  </p>
                                  <p className="text-[10px] sm:text-[11px] text-[#9E9687] truncate">
                                    {ing.vibe}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Trung tâm: Chiếc Vạc Vàng lấp lánh khói sương */}
                      <div className="order-1 lg:order-2 flex flex-col items-center justify-center py-2">
                        <div className="relative w-[210px] h-[205px] flex items-center justify-center">
                          {/* Vầng khói sương đổi màu động theo nguyên liệu */}
                          <motion.div
                            animate={
                              potionPhase === 'brewing'
                                ? {
                                    scale: [1, 1.32, 1.15],
                                    opacity: [0.55, 0.95, 0.85],
                                  }
                                : {
                                    scale: [0.95, 1.08, 0.95],
                                    opacity: [0.42, 0.72, 0.42],
                                  }
                            }
                            transition={{
                              duration: potionPhase === 'brewing' ? 0.9 : 2.8,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="pointer-events-none absolute top-2 w-36 h-28 rounded-full blur-2xl"
                            style={{ background: cauldronGlowColor }}
                          />

                          {/* Giọt nguyên liệu bay vào vạc */}
                          <AnimatePresence>
                            {dropletFx && (
                              <motion.div
                                key={dropletFx.key}
                                initial={{ opacity: 1, y: -62, scale: 1.35 }}
                                animate={{ opacity: 0, y: 12, scale: 0.45 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                className="pointer-events-none absolute top-10 z-30 flex items-center justify-center text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                style={{ color: dropletFx.color }}
                              >
                                {dropletFx.emoji}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Hạt sương bốc lên từ miệng vạc */}
                          {[0, 1, 2].map((bubbleIdx) => (
                            <motion.span
                              key={bubbleIdx}
                              aria-hidden="true"
                              animate={{
                                y: [-4, -44 - bubbleIdx * 10],
                                x: [bubbleIdx === 1 ? 0 : bubbleIdx === 0 ? -12 : 12, bubbleIdx === 0 ? -18 : 16],
                                opacity: [0, 0.9, 0],
                                scale: [0.5, 1.1, 0.4],
                              }}
                              transition={{
                                duration: potionPhase === 'brewing' ? 0.9 : 2.1,
                                delay: bubbleIdx * 0.45,
                                repeat: Infinity,
                                ease: 'easeOut',
                              }}
                              className="pointer-events-none absolute top-14 w-2.5 h-2.5 rounded-full blur-[0.5px]"
                              style={{ backgroundColor: cauldronSmokeColor }}
                            />
                          ))}

                          {/* Đũa phép khuấy xoay khi brewing */}
                          <AnimatePresence>
                            {potionPhase === 'brewing' && (
                              <motion.div
                                initial={{ opacity: 0, rotate: -25 }}
                                animate={{
                                  opacity: 1,
                                  rotate: [-22, 22, -22],
                                  x: [-14, 14, -14],
                                }}
                                transition={{
                                  duration: 0.55,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                                className="pointer-events-none absolute -top-1 z-30 text-[#FFF4C4] drop-shadow-[0_0_16px_rgba(243,229,171,0.9)]"
                              >
                                <Wand2 className="w-10 h-10" aria-hidden="true" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* SVG Chiếc Vạc Vàng cổ điển */}
                          <svg
                            viewBox="0 0 180 160"
                            className="relative z-10 w-[184px] h-[164px] drop-shadow-[0_14px_26px_rgba(0,0,0,0.85)]"
                            aria-hidden="true"
                          >
                            <defs>
                              <linearGradient id="cauldronGoldGrad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#F3E5AB" />
                                <stop offset="45%" stopColor="#D4AF37" />
                                <stop offset="100%" stopColor="#7C5E18" />
                              </linearGradient>
                              <linearGradient id="cauldronBodyGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2A2319" />
                                <stop offset="55%" stopColor="#141118" />
                                <stop offset="100%" stopColor="#09080C" />
                              </linearGradient>
                            </defs>
                            {/* Chân vạc */}
                            <path d="M54 128 L44 150 L56 150 L64 132 Z" fill="url(#cauldronGoldGrad)" />
                            <path d="M126 128 L136 150 L124 150 L116 132 Z" fill="url(#cauldronGoldGrad)" />
                            {/* Tay cầm hai bên */}
                            <circle cx="32" cy="78" r="10" fill="none" stroke="url(#cauldronGoldGrad)" strokeWidth="4" />
                            <circle cx="148" cy="78" r="10" fill="none" stroke="url(#cauldronGoldGrad)" strokeWidth="4" />
                            {/* Thân vạc tròn ánh kim */}
                            <path
                              d="M36 62 C32 108, 52 138, 90 138 C128 138, 148 108, 144 62 Z"
                              fill="url(#cauldronBodyGrad)"
                              stroke="url(#cauldronGoldGrad)"
                              strokeWidth="3"
                            />
                            {/* Miệng vạc & nước thuốc đổi màu */}
                            <ellipse
                              cx="90"
                              cy="60"
                              rx="56"
                              ry="14"
                              fill="#120F17"
                              stroke="url(#cauldronGoldGrad)"
                              strokeWidth="3.5"
                            />
                            <ellipse
                              cx="90"
                              cy="61"
                              rx="46"
                              ry="9"
                              fill={cauldronSmokeColor}
                              fillOpacity={selectedIngredients.length > 0 ? 0.52 : 0.22}
                            />
                            {/* Chạm khắc ngôi sao 4 cánh trên thân vạc */}
                            <path
                              d="M90 86 L93 96 L103 99 L93 102 L90 112 L87 102 L77 99 L87 96 Z"
                              fill="url(#cauldronGoldGrad)"
                            />
                          </svg>
                        </div>

                        <button
                          type="button"
                          disabled={potionPhase !== 'selecting' || selectedIngredientIds.length === 0}
                          onClick={handleStirWand}
                          className="shimmer-gold-btn mt-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#ECCD72] to-[#D4AF37] text-[#0B0B0F] text-xs sm:text-sm font-semibold whitespace-nowrap shadow-[0_0_24px_rgba(212,175,55,0.38)] hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4]"
                        >
                          <Wand2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>
                            {potionPhase === 'brewing' ? 'Đang khuấy đũa phép...' : '✨ Khuấy đũa phép'}
                          </span>
                        </button>
                      </div>

                      {/* Cột 3 lọ bên phải (desktop) */}
                      <div className="order-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                        {POTION_INGREDIENTS.slice(3, 6).map((ing) => {
                          const isSelected = selectedIngredientIds.includes(ing.id);
                          const isFull = selectedIngredientIds.length >= 3 && !isSelected;
                          return (
                            <button
                              key={ing.id}
                              type="button"
                              disabled={potionPhase !== 'selecting' || isFull}
                              onClick={() => handleToggleIngredient(ing)}
                              className={`group relative rounded-xl p-2.5 sm:p-3 border text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] ${
                                isSelected
                                  ? 'bg-[#211B13] border-[#F3E5AB] shadow-[0_0_18px_rgba(212,175,55,0.32)] scale-[0.99]'
                                  : isFull
                                    ? 'bg-[#0F0F16]/60 border-[#D4AF37]/15 opacity-50 cursor-not-allowed'
                                    : 'bg-[#12121A]/90 border-[#D4AF37]/30 hover:border-[#D4AF37]/80 hover:bg-[#191722]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 border border-[#D4AF37]/35"
                                  style={{
                                    background: `radial-gradient(circle, ${ing.glowRgba} 0%, #0D0D14 78%)`,
                                  }}
                                >
                                  {ing.emoji}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-[13px] font-semibold text-[#F3E5AB] truncate">
                                    {ing.name}
                                  </p>
                                  <p className="text-[10px] sm:text-[11px] text-[#9E9687] truncate">
                                    {ing.vibe}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Kết quả triệu hồi từ Độc Dược Tình Duyên */
                  summonedChar && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="relative max-w-lg mx-auto py-2"
                    >
                      {/* Vầng sáng vàng kim bùng nở */}
                      <motion.div
                        aria-hidden="true"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: [0, 0.9, 0.45], scale: [0.75, 1.15, 1] }}
                        transition={{ duration: 0.95 }}
                        className="pointer-events-none absolute -inset-4 rounded-[34px] blur-2xl"
                        style={{
                          background: `radial-gradient(circle, ${cauldronGlowColor} 0%, rgba(212,175,55,0.22) 48%, transparent 74%)`,
                        }}
                      />

                      <div className="relative z-10 text-center mb-3">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wider uppercase text-[#F3E5AB]">
                          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                          <span>{potionSummary.title}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#C7C0B2] max-w-md mx-auto">
                          {potionSummary.note}
                        </p>
                      </div>

                      <HolographicTiltCard
                        maxTilt={6}
                        className="relative z-10 rounded-2xl bg-[#121218]/96 border-2 border-[#F3E5AB]/85 p-4 sm:p-5 shadow-[0_0_38px_rgba(212,175,55,0.28)]"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="relative w-[156px] sm:w-[184px] aspect-square rounded-xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/60 shadow-[0_0_24px_rgba(212,175,55,0.3)]">
                            {!summonAvatarFailed && summonedChar.avatar.trim() !== '' ? (
                              <img
                                src={summonedChar.avatar}
                                alt={`Ảnh đại diện ${summonedChar.name}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top"
                                onLoad={(e) => {
                                  if (e.currentTarget.naturalWidth === 0) setSummonAvatarFailed(true);
                                }}
                                onError={() => setSummonAvatarFailed(true)}
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3">
                                <BlackCatMascot size={56} variant="companion" />
                                <span className="font-display text-base text-[#F3E5AB]">
                                  {getPrimaryName(summonedChar.name)}
                                </span>
                              </div>
                            )}
                          </div>

                          <h4 className="mt-3 font-display text-2xl font-semibold text-[#F3E5AB]">
                            {getPrimaryName(summonedChar.name)}
                          </h4>
                          {getSecondaryName(summonedChar.name) && (
                            <p className="text-xs font-medium text-[#D4AF37]">
                              {getSecondaryName(summonedChar.name)}
                            </p>
                          )}
                          <p className="mt-2 text-xs sm:text-[13px] text-[#DCD4C6] italic leading-relaxed">
                            {formatQuotedDescription(summonedChar.description)}
                          </p>

                          {summonedChar.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                              {summonedChar.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-md bg-[#0B0B0F] border border-[#D4AF37]/35 text-[11px] text-[#E6CD82]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="w-full mt-4 pt-4 border-t border-[#D4AF37]/20">
                            {renderPlatformLinks(summonedChar, '💬 Vào phòng chat ngay')}
                          </div>
                        </div>
                      </HolographicTiltCard>
                    </motion.div>
                  )
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* MINI-GAME 2: ĐÊM MƯA NGHE LÉN TÂM TƯ                          */}
            {/* ============================================================== */}
            {activeView === 'eavesdrop' && eavesdropChar && (
              <div className="relative z-10 pt-4 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-[270px_minmax(0,1fr)] gap-5 items-center">
                  {/* Khung cảnh cánh cửa gỗ cổ điển khép hờ + mưa rơi đêm khuya */}
                  <div className="relative h-[300px] sm:h-[330px] rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-b from-[#090B12] via-[#0B0C14] to-[#06060A] flex items-center justify-center p-4 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]">
                    {/* Mưa rơi nhẹ bên ngoài */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-45">
                      {RAIN_DROPS.map((drop, i) => (
                        <motion.span
                          key={i}
                          animate={{ y: ['-15%', '115%'] }}
                          transition={{
                            duration: parseFloat(drop.duration),
                            delay: parseFloat(drop.delay),
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{ left: drop.left }}
                          className="absolute top-0 w-[1px] h-10 bg-gradient-to-b from-transparent via-[#9EC5E8]/60 to-transparent rotate-[10deg]"
                        />
                      ))}
                    </div>

                    {/* Khung cửa gỗ cổ điển + khe sáng vàng hắt ra */}
                    <div className="relative w-[176px] h-[256px] [perspective:900px]">
                      {/* Ánh sáng vàng ấm bên trong phòng hắt qua khe cửa */}
                      <motion.div
                        animate={{
                          opacity: eavesdropPhase === 'caught' ? 0.95 : eavesdropPhase === 'holding' ? 0.72 : 0.45,
                        }}
                        className="absolute inset-1 rounded-t-xl bg-gradient-to-r from-[#2A1D0A] via-[#D4AF37]/45 to-[#F3E5AB]/75 shadow-[0_0_38px_rgba(243,229,171,0.35)]"
                      />

                      {/* Nếu bị bắt quả tang, hé lộ bóng chân dung phía sau cánh cửa */}
                      {eavesdropPhase === 'caught' && (
                        <div className="absolute inset-2 rounded-t-lg overflow-hidden bg-[#0B0B0F] flex items-center justify-center">
                          {!eavesdropAvatarFailed && eavesdropChar.avatar.trim() !== '' ? (
                            <img
                              src={eavesdropChar.avatar}
                              alt={eavesdropChar.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top"
                              onError={() => setEavesdropAvatarFailed(true)}
                            />
                          ) : (
                            <BlackCatMascot size={64} variant="companion" />
                          )}
                        </div>
                      )}

                      {/* Cánh cửa gỗ khép hờ (bật mở mạnh khi bị bắt quả tang) */}
                      <motion.div
                        animate={{
                          rotateY: eavesdropPhase === 'caught' ? -72 : eavesdropPhase === 'holding' ? -14 : -9,
                        }}
                        transition={{
                          duration: eavesdropPhase === 'caught' ? 0.35 : 0.25,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: 'left center' }}
                        className="relative z-10 w-full h-full rounded-t-xl border-2 border-[#7C5A2B]/80 bg-gradient-to-b from-[#2A1C12] via-[#1C120B] to-[#120B07] p-3 flex flex-col justify-between shadow-[10px_0_24px_rgba(0,0,0,0.85)]"
                      >
                        <div className="w-full h-24 rounded-lg border border-[#D4AF37]/25 bg-[#160F0A]/70" />
                        <div className="w-full h-24 rounded-lg border border-[#D4AF37]/25 bg-[#160F0A]/70" />

                        {/* Tay nắm & Ổ khóa vàng trên cánh cửa */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-10 rounded-full bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#7D5D16] border border-[#FFF4C4]/50 shadow-[0_0_14px_rgba(212,175,55,0.65)] flex flex-col items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#1C120B]" />
                          <span className="w-1 h-2.5 rounded-sm bg-[#1C120B]" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Nhãn trạng thái cảnh giác ở đáy khung cửa */}
                    <div className="absolute bottom-2.5 inset-x-3 text-center">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B0B0F]/85 border border-[#D4AF37]/30 text-[11px] font-medium tabular-nums"
                        style={{ color: ringColor }}
                      >
                        <span>
                          {alertProgress >= 80
                            ? 'Nguy hiểm! Sắp mở cửa'
                            : alertProgress >= 52
                              ? 'Đang nghi ngờ'
                              : 'Cảnh giác'}
                        </span>
                        <span>·</span>
                        <span>{Math.round(alertProgress)}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Cột tương tác: Dòng tâm sự đánh máy + Ổ khóa vàng nhấn giữ + Kết quả */}
                  <div className="flex flex-col gap-4">
                    {/* Khung hiển thị lời tâm sự đánh máy */}
                    <div className="rounded-2xl bg-[#0B0B0F]/88 border border-[#D4AF37]/35 p-4 min-h-[145px] flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-medium tracking-wider uppercase text-[#D4AF37]">
                          {eavesdropPhase === 'success' || eavesdropPhase === 'caught'
                            ? `Giọng nói của ${getPrimaryName(eavesdropChar.name)}`
                            : 'Tiếng thì thầm sau cánh cửa'}
                        </span>
                        <span className="text-[11px] text-[#8E877A] tabular-nums">
                          {eavesdropSecret.length > 0
                            ? `${Math.min(100, Math.round((typedCount / eavesdropSecret.length) * 100))}%`
                            : '0%'}
                        </span>
                      </div>

                      {eavesdropPhase === 'caught' ? (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-rose-400">
                            ⚡ Bị bắt quả tang! Cánh cửa vừa bật mở bất ngờ...
                          </p>
                          <p className="text-xs sm:text-sm text-[#F3E5AB] italic leading-relaxed">
                            {buildCaughtLine(eavesdropChar)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-[13.5px] text-[#EAE2D0] italic leading-relaxed">
                          {typedCount > 0 ? (
                            <>
                              “{eavesdropSecret.slice(0, typedCount)}
                              {eavesdropPhase === 'holding' && !eavesdropFinishedTyping && (
                                <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-[#F3E5AB] animate-pulse" />
                              )}
                              {eavesdropFinishedTyping ? '”' : ''}
                            </>
                          ) : (
                            <span className="text-[#8E877A] not-italic">
                              Nhấn và giữ vào ổ khóa vàng bên dưới để áp tai nghe trộm suy nghĩ thầm kín...
                            </span>
                          )}
                        </p>
                      )}

                      {/* Nhắc thả tay hoặc giữ tiếp */}
                      <div className="mt-3 pt-2 border-t border-[#D4AF37]/15 min-h-[24px] flex items-center justify-between text-[11px]">
                        {eavesdropPhase === 'holding' && eavesdropFinishedTyping && (
                          <span className="font-semibold text-emerald-300 animate-pulse">
                            ✨ Đã nghe trọn bí mật — Thả tay ngay!
                          </span>
                        )}
                        {eavesdropPhase === 'holding' && !eavesdropFinishedTyping && (
                          <span className="text-[#D4AF37]">
                            Đang lắng nghe... tiếp tục giữ để đọc hết câu
                          </span>
                        )}
                        {eavesdropPhase === 'ready' && earlyReleaseHint && (
                          <span className="text-amber-300">
                            Mới nghe được một nửa — Hãy nhấn giữ tiếp để đọc trọn tâm tư!
                          </span>
                        )}
                        {eavesdropPhase === 'ready' && !earlyReleaseHint && (
                          <span className="text-[#8E877A]">
                            Giữ cho đến khi đọc xong bí mật, rồi thả tay trước khi vòng tròn chạm tâm.
                          </span>
                        )}
                        {eavesdropPhase === 'success' && (
                          <span className="font-semibold text-[#F3E5AB]">
                            🎉 Nghe lén thành công! Đã nắm giữ bí mật của {getPrimaryName(eavesdropChar.name)}.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Khu vực Ổ khóa vàng (Hold button) hoặc Card kết quả Thắng / Thua */}
                    {eavesdropPhase === 'ready' || eavesdropPhase === 'holding' ? (
                      <div className="flex flex-col items-center justify-center py-2">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                          {/* Vòng tròn Cảnh Giác thu hẹp dần */}
                          <svg
                            viewBox="0 0 120 120"
                            className="pointer-events-none absolute inset-0 w-full h-full -rotate-90"
                            aria-hidden="true"
                          >
                            <circle
                              cx="60"
                              cy="60"
                              r="52"
                              fill="none"
                              stroke="rgba(212, 175, 55, 0.16)"
                              strokeWidth="5"
                            />
                            <circle
                              cx="60"
                              cy="60"
                              r="52"
                              fill="none"
                              stroke={ringColor}
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={ringCircumference}
                              strokeDashoffset={ringStrokeOffset}
                              style={{ transition: 'stroke 150ms ease' }}
                            />
                          </svg>

                          {/* Vòng halo vật lý thu hẹp về tâm ổ khóa */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-3 rounded-full border-2"
                            style={{
                              borderColor: ringColor,
                              opacity: eavesdropPhase === 'holding' ? 0.72 : 0.25,
                              transform: `scale(${Math.max(0.45, 1 - (alertProgress / 100) * 0.52)})`,
                              transition: 'transform 45ms linear, border-color 150ms ease',
                            }}
                          />

                          {/* Nút Ổ Khóa Vàng (hỗ trợ cả chuột, cảm ứng & bàn phím) */}
                          <button
                            type="button"
                            onMouseDown={() => startEavesdropHold('mouse')}
                            onMouseUp={() => releaseEavesdropHold('mouse')}
                            onMouseLeave={() => releaseEavesdropHold('mouse')}
                            onTouchStart={(e) => {
                              e.preventDefault();
                              startEavesdropHold('touch');
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              releaseEavesdropHold('touch');
                            }}
                            onTouchCancel={() => releaseEavesdropHold('touch')}
                            onKeyDown={(e) => {
                              if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                                e.preventDefault();
                                startEavesdropHold('keyboard');
                              }
                            }}
                            onKeyUp={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                releaseEavesdropHold('keyboard');
                              }
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                            aria-label="Nhấn giữ ổ khóa vàng để nghe lén tâm tư"
                            className={`relative z-10 w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center gap-1 select-none touch-none transition-transform duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4] ${
                              eavesdropPhase === 'holding'
                                ? 'scale-95 bg-gradient-to-b from-[#2B2210] to-[#120E08] border-[#FFF4C4] shadow-[0_0_28px_rgba(243,229,171,0.45)]'
                                : 'bg-gradient-to-b from-[#1D1824] to-[#0D0D14] border-[#D4AF37]/80 hover:border-[#FFF4C4] shadow-[0_0_20px_rgba(212,175,55,0.22)]'
                            }`}
                          >
                            <KeyRound className="w-7 h-7 text-[#F3E5AB]" aria-hidden="true" />
                            <span className="text-[10px] font-semibold text-[#F3E5AB]">
                              {eavesdropPhase === 'holding' ? 'Đang nghe...' : 'Nhấn giữ'}
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Trạng thái kết thúc: Thành công (Success) hoặc Bị bắt quả tang (Caught) */
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-2xl bg-[#12121A]/95 border border-[#D4AF37]/60 p-4 space-y-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/55 shrink-0 flex items-center justify-center">
                            {!eavesdropAvatarFailed && eavesdropChar.avatar.trim() !== '' ? (
                              <img
                                src={eavesdropChar.avatar}
                                alt={eavesdropChar.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top"
                                onError={() => setEavesdropAvatarFailed(true)}
                              />
                            ) : (
                              <BlackCatMascot size={36} variant="companion" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-[#D4AF37]">
                              {eavesdropPhase === 'success'
                                ? 'Người ẩn sau cánh cửa'
                                : 'Bắt gặp tận mặt'}
                            </p>
                            <h4 className="font-display text-xl font-semibold text-[#F3E5AB] truncate">
                              {getPrimaryName(eavesdropChar.name)}
                            </h4>
                            <p className="text-[11px] text-[#C7C0B2] italic truncate">
                              {formatQuotedDescription(eavesdropChar.description)}
                            </p>
                          </div>
                        </div>

                        {renderPlatformLinks(
                          eavesdropChar,
                          eavesdropPhase === 'caught' ? '💬 Vào phòng chat ngay' : '💬 Vào phòng chat'
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* ============================================================== */}
            {/* MINI-GAME 3: BỨC THƯ NIÊM PHONG SÁP ĐỎ                          */}
            {/* ============================================================== */}
            {activeView === 'letter' && (
              <div className="relative z-10">
                <SealedLetterGame
                  characters={characters}
                  onOpenCharacterProfile={handleOpenProfile}
                  resetSignal={letterResetSignal}
                />
              </div>
            )}

            {/* ============================================================== */}
            {/* MINI-GAME 4: NHỊP ĐẬP CỘNG HƯỞNG                               */}
            {/* ============================================================== */}
            {activeView === 'heartbeat' && (
              <div className="relative z-10">
                <HeartbeatResonanceGame
                  characters={characters}
                  onOpenCharacterProfile={handleOpenProfile}
                  resetSignal={heartbeatResetSignal}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
