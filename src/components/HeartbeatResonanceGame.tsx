import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';
import type { CharacterItem } from '../App';
import { getCharacterStoryProfile } from '../data/characterProfiles';
import { BlackCatMascot } from './BlackCatMascot';
import {
  playDestinyChime,
  playHeartbeatPulseTone,
  playResonanceHitChime,
  playResonanceMissTone,
  playSoftTap,
} from '../utils/soundEffects';

export interface HeartbeatResonanceGameProps {
  characters: CharacterItem[];
  onOpenCharacterProfile: (character: CharacterItem) => void;
  resetSignal?: number;
}

type HeartbeatPhase = 'playing' | 'resonated';

const START_RADIUS = 126;
const TARGET_RADIUS = 46;
const END_RADIUS = 22;
const HIT_TOLERANCE = 15.5;
const CYCLE_DURATIONS_MS = [1740, 1600, 1480];

function getPrimaryName(name: string): string {
  return name.split(/\s+[—-]\s+/)[0] || name;
}

function getSecondaryName(name: string): string {
  const parts = name.split(/\s+[—-]\s+/);
  return parts.length > 1 ? parts.slice(1).join(' · ') : '';
}

function formatQuotedDescription(text: string): string {
  const trimmed = text.trim().replace(/^["“]+|["”]+$/g, '');
  return trimmed ? `“${trimmed}”` : '';
}

function extractResonantLine(char: CharacterItem): string {
  const profile = getCharacterStoryProfile(char);
  const primary = getPrimaryName(char.name);

  const rawFirst = profile.firstMessage
    .replace(/\{\{user\}\}/gi, 'em')
    .replace(/\{\{char\}\}/gi, primary)
    .replace(/\*+/g, '')
    .trim();

  const quotes = rawFirst.match(/[“"][^”"]{24,200}[”"]/g);
  if (quotes && quotes.length > 0) {
    return quotes[0].replace(/^["“]+|["”]+$/g, '').trim();
  }

  const slogan = char.description.trim().replace(/^["“]+|["”]+$/g, '');
  if (slogan.length >= 20) return slogan;

  const fallback = rawFirst.replace(/\s+/g, ' ').slice(0, 170).trim();
  return fallback;
}

export const HeartbeatResonanceGame: React.FC<HeartbeatResonanceGameProps> = ({
  characters,
  onOpenCharacterProfile,
  resetSignal = 0,
}) => {
  const [targetChar, setTargetChar] = useState<CharacterItem | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [phase, setPhase] = useState<HeartbeatPhase>('playing');
  const [hits, setHits] = useState(0);
  const [feedback, setFeedback] = useState<{
    key: number;
    type: 'hit' | 'miss' | 'idle';
    text: string;
  }>({
    key: 0,
    type: 'idle',
    text: 'Chạm vào viên ngọc hoặc màn hình đúng lúc vòng sáng thu nhỏ chạm viền ngọc',
  });
  const [rippleKey, setRippleKey] = useState(0);
  const [inSweetSpot, setInSweetSpot] = useState(false);

  const haloCircleRef = useRef<SVGCircleElement | null>(null);
  const haloGlowRef = useRef<SVGCircleElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const cycleStartRef = useRef<number>(0);
  const currentRadiusRef = useRef<number>(START_RADIUS);
  const hitsRef = useRef<number>(0);
  const phaseRef = useRef<HeartbeatPhase>('playing');
  const lastCharIdRef = useRef<string | null>(null);
  const tappedThisCycleRef = useRef<boolean>(false);
  const cooldownUntilRef = useRef<number>(0);
  const inSweetSpotRef = useRef<boolean>(false);

  const pickRandomCharacter = useCallback(
    (avoidRepeat = true) => {
      if (characters.length === 0) {
        setTargetChar(null);
        return;
      }

      const pool =
        avoidRepeat && characters.length > 1 && lastCharIdRef.current
          ? characters.filter((c) => c.id !== lastCharIdRef.current)
          : characters;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      lastCharIdRef.current = chosen.id;

      setTargetChar(chosen);
      setAvatarFailed(false);
      setHits(0);
      hitsRef.current = 0;
      setPhase('playing');
      phaseRef.current = 'playing';
      tappedThisCycleRef.current = false;
      cycleStartRef.current = performance.now();
      currentRadiusRef.current = START_RADIUS;
      setInSweetSpot(false);
      inSweetSpotRef.current = false;
      setFeedback({
        key: Date.now(),
        type: 'idle',
        text: 'Cảm nhận nhịp tim và chạm khi vòng hào quang trùng khớp với viên ngọc',
      });
    },
    [characters]
  );

  // Khởi tạo nhân vật ngẫu nhiên khi mở game hoặc nhận resetSignal từ modal
  useEffect(() => {
    pickRandomCharacter(false);
  }, [pickRandomCharacter, resetSignal]);

  // Vòng lặp requestAnimationFrame cho vòng tròn hào quang thu nhỏ mượt mà
  useEffect(() => {
    if (phase !== 'playing' || !targetChar) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    cycleStartRef.current = performance.now();
    tappedThisCycleRef.current = false;

    const tick = (now: number) => {
      if (phaseRef.current !== 'playing') return;

      // Tạm nghỉ ngắn sau khi vừa chạm chuẩn để mắt nhận biết rõ
      if (now < cooldownUntilRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const currentHits = hitsRef.current;
      const cycleDuration =
        CYCLE_DURATIONS_MS[Math.min(currentHits, CYCLE_DURATIONS_MS.length - 1)];

      let elapsed = now - cycleStartRef.current;
      if (elapsed >= cycleDuration) {
        cycleStartRef.current = now;
        elapsed = 0;
        tappedThisCycleRef.current = false;
        playHeartbeatPulseTone();
      }

      const progress = Math.min(1, Math.max(0, elapsed / cycleDuration));
      const radius = START_RADIUS - progress * (START_RADIUS - END_RADIUS);
      currentRadiusRef.current = radius;

      const delta = Math.abs(radius - TARGET_RADIUS);
      const isSweet = delta <= HIT_TOLERANCE;
      if (isSweet !== inSweetSpotRef.current) {
        inSweetSpotRef.current = isSweet;
        setInSweetSpot(isSweet);
      }

      // Độ mờ mượt: fade in ở đầu, rõ nét quanh vùng target, fade out ở cuối
      let opacity = 0.85;
      if (progress < 0.14) {
        opacity = (progress / 0.14) * 0.85;
      } else if (progress > 0.88) {
        opacity = Math.max(0, ((1 - progress) / 0.12) * 0.85);
      }

      if (haloCircleRef.current) {
        haloCircleRef.current.setAttribute('r', radius.toFixed(2));
        haloCircleRef.current.setAttribute(
          'stroke',
          isSweet ? '#FFF4C4' : '#D4AF37'
        );
        haloCircleRef.current.setAttribute(
          'stroke-width',
          isSweet ? '4' : '2.75'
        );
        haloCircleRef.current.style.opacity = opacity.toFixed(3);
      }

      if (haloGlowRef.current) {
        haloGlowRef.current.setAttribute('r', radius.toFixed(2));
        haloGlowRef.current.style.opacity = (opacity * (isSweet ? 0.55 : 0.25)).toFixed(3);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [phase, targetChar]);

  const handleBeatTap = useCallback(() => {
    if (phaseRef.current !== 'playing' || !targetChar) return;

    const now = performance.now();
    if (now < cooldownUntilRef.current || tappedThisCycleRef.current) return;

    const delta = Math.abs(currentRadiusRef.current - TARGET_RADIUS);
    tappedThisCycleRef.current = true;

    if (delta <= HIT_TOLERANCE) {
      const nextHits = hitsRef.current + 1;
      hitsRef.current = nextHits;
      setHits(nextHits);
      setRippleKey((prev) => prev + 1);

      if (nextHits >= 3) {
        playResonanceHitChime(3);
        window.setTimeout(() => playDestinyChime(), 160);
        phaseRef.current = 'resonated';
        setPhase('resonated');
        setFeedback({
          key: Date.now(),
          type: 'hit',
          text: '✨ Cộng hưởng trọn vẹn 3/3! Nhịp tim đã đồng điệu.',
        });
      } else {
        playResonanceHitChime(nextHits);
        setFeedback({
          key: Date.now(),
          type: 'hit',
          text:
            nextHits === 1
              ? '✨ Chuẩn nhịp 1/3! Tiếp tục bắt nhịp tiếp theo...'
              : '💫 Chuẩn nhịp 2/3! Chỉ còn một nhịp nữa thôi!',
        });
        // Nghỉ ngắn 260ms rồi thả vòng hào quang tiếp theo
        cooldownUntilRef.current = now + 260;
        cycleStartRef.current = now + 260;
        currentRadiusRef.current = START_RADIUS;
        tappedThisCycleRef.current = false;
      }
    } else {
      // Lệch nhịp: reset về 0/3 với thông báo nhẹ nhàng và bắt đầu vòng mới ngay
      playResonanceMissTone();
      hitsRef.current = 0;
      setHits(0);

      const timingHint =
        currentRadiusRef.current > TARGET_RADIUS + HIT_TOLERANCE
          ? 'Hơi sớm một chút! Đợi vòng sáng chạm vào viên ngọc vàng nhé.'
          : 'Hơi muộn một chút! Thử lại ngay ở vòng sáng tiếp theo nhé.';

      setFeedback({
        key: Date.now(),
        type: 'miss',
        text: timingHint,
      });

      cooldownUntilRef.current = now + 220;
      cycleStartRef.current = now + 220;
      currentRadiusRef.current = START_RADIUS;
      tappedThisCycleRef.current = false;
    }
  }, [targetChar]);

  // Hỗ trợ bấm phím Space / Enter khi đang chơi trên máy tính
  useEffect(() => {
    if (phase !== 'playing') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        const activeTag = (document.activeElement as HTMLElement | null)?.tagName;
        if (activeTag === 'BUTTON' || activeTag === 'A') return;
        e.preventDefault();
        handleBeatTap();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, handleBeatTap]);

  if (!targetChar) return null;

  const primaryName = getPrimaryName(targetChar.name);
  const secondaryName = getSecondaryName(targetChar.name);
  const resonantLine = extractResonantLine(targetChar);
  const hasDoki = Boolean(targetChar.dokiLink && targetChar.dokiLink.trim() !== '');
  const hasGgai = Boolean(targetChar.ggaiLink && targetChar.ggaiLink.trim() !== '');
  const hasBothLinks = hasDoki && hasGgai;
  const primaryChatLink = targetChar.dokiLink?.trim() || targetChar.ggaiLink?.trim() || '';

  return (
    <div className="relative pt-4 pb-2">
      {phase === 'playing' ? (
        <div className="space-y-4">
          {/* Thanh thông tin nhân vật & tiến độ 1/3, 2/3, 3/3 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#0B0B0F]/80 border border-[#D4AF37]/30 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#121218] border border-[#D4AF37]/50 shrink-0 flex items-center justify-center">
                {!avatarFailed && targetChar.avatar.trim() !== '' ? (
                  <img
                    src={targetChar.avatar}
                    alt={targetChar.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <BlackCatMascot size={28} variant="companion" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#D4AF37]">
                  💓 Nhịp Đập Cộng Hưởng
                </p>
                <h3 className="font-display text-lg font-semibold text-[#F3E5AB] truncate">
                  {primaryName}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              {/* 3 chấm sáng báo hiệu tiến độ 1/3, 2/3, 3/3 */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121218] border border-[#D4AF37]/35"
                aria-label={`Tiến độ cộng hưởng ${hits} trên 3`}
              >
                {[1, 2, 3].map((step) => {
                  const isLit = hits >= step;
                  return (
                    <span
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        isLit
                          ? 'bg-[#FFF4C4] scale-110 shadow-[0_0_12px_rgba(243,229,171,0.95)]'
                          : 'bg-[#2A241A] border border-[#D4AF37]/40'
                      }`}
                    />
                  );
                })}
                <span className="ml-1 text-xs font-semibold text-[#F3E5AB] tabular-nums">
                  {hits}/3
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSoftTap('nav');
                  pickRandomCharacter(true);
                }}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-xl border border-[#D4AF37]/45 bg-[#121218] text-xs font-medium text-[#E6CD82] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>Đổi nhân vật</span>
              </button>
            </div>
          </div>

          {/* Sân khấu trung tâm: Ảnh nhân vật mờ ảo nền tối + Trái tim/viên ngọc vàng + Vòng hào quang thu nhỏ */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Chạm đúng lúc vòng hào quang vàng trùng khớp với viên ngọc ở giữa"
            onPointerDown={(e) => {
              e.preventDefault();
              handleBeatTap();
            }}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleBeatTap();
              }
            }}
            onContextMenu={(e) => e.preventDefault()}
            className="relative mx-auto max-w-2xl min-h-[310px] sm:min-h-[340px] rounded-2xl overflow-hidden border border-[#D4AF37]/45 bg-[#08080C] flex flex-col items-center justify-center p-4 select-none touch-manipulation cursor-pointer shadow-[inset_0_0_60px_rgba(0,0,0,0.92),0_16px_44px_rgba(0,0,0,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4]"
          >
            {/* Ảnh nhân vật mờ ảo ánh vàng làm nền */}
            {!avatarFailed && targetChar.avatar.trim() !== '' && (
              <img
                src={targetChar.avatar}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="pointer-events-none absolute inset-0 w-full h-full object-cover object-top opacity-28 blur-[3px] scale-105"
              />
            )}

            {/* Lớp phủ tối ánh vàng huyền bí */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 48%, rgba(212,175,55,0.22) 0%, rgba(11,11,15,0.82) 55%, rgba(5,5,8,0.96) 100%)',
              }}
            />

            {/* Sóng cộng hưởng bùng lên mỗi khi chạm chuẩn nhịp */}
            <AnimatePresence>
              {rippleKey > 0 && (
                <motion.div
                  key={rippleKey}
                  aria-hidden="true"
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="pointer-events-none absolute w-28 h-28 rounded-full border-2 border-[#FFF4C4] shadow-[0_0_28px_rgba(243,229,171,0.8)]"
                />
              )}
            </AnimatePresence>

            {/* Vùng SVG Vòng hào quang thu nhỏ & Viên ngọc trái tim vàng */}
            <div className="relative z-10 w-[250px] h-[250px] sm:w-[272px] sm:h-[272px] flex items-center justify-center">
              <svg
                viewBox="0 0 280 280"
                className="w-full h-full overflow-visible"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="heartGemGrad" cx="38%" cy="32%" r="70%">
                    <stop offset="0%" stopColor="#FFF8D8" />
                    <stop offset="42%" stopColor="#F3CD68" />
                    <stop offset="78%" stopColor="#B8871B" />
                    <stop offset="100%" stopColor="#6D4B09" />
                  </radialGradient>
                </defs>

                {/* Vòng mục tiêu cố định bao quanh viên ngọc */}
                <circle
                  cx="140"
                  cy="140"
                  r={TARGET_RADIUS}
                  fill={inSweetSpot ? 'rgba(243, 229, 171, 0.14)' : 'rgba(212, 175, 55, 0.05)'}
                  stroke={inSweetSpot ? '#FFF4C4' : 'rgba(212, 175, 55, 0.45)'}
                  strokeWidth={inSweetSpot ? '2.5' : '1.5'}
                  strokeDasharray="5 4"
                  style={{ transition: 'stroke 100ms ease, fill 100ms ease' }}
                />

                {/* Vòng hào quang sáng mờ đi theo vòng thu nhỏ */}
                <circle
                  ref={haloGlowRef}
                  cx="140"
                  cy="140"
                  r={START_RADIUS}
                  fill="none"
                  stroke="#F3E5AB"
                  strokeWidth="9"
                  style={{ filter: 'blur(4px)', opacity: 0.25 }}
                />

                {/* Vòng hào quang sắc nét thu nhỏ dần về tâm */}
                <circle
                  ref={haloCircleRef}
                  cx="140"
                  cy="140"
                  r={START_RADIUS}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2.75"
                />
              </svg>

              {/* Biểu tượng trái tim / viên ngọc vàng phát sáng đập theo nhịp ở trung tâm */}
              <motion.div
                animate={{
                  scale: [1, 1.11, 1, 1.07, 1],
                }}
                transition={{
                  duration: 1.45,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`pointer-events-none absolute w-[74px] h-[74px] rounded-full flex items-center justify-center transition-shadow duration-150 ${
                  inSweetSpot
                    ? 'shadow-[0_0_38px_rgba(255,244,196,0.95)]'
                    : 'shadow-[0_0_24px_rgba(212,175,55,0.6)]'
                }`}
                style={{
                  background:
                    'radial-gradient(circle at 38% 32%, rgba(255,248,216,0.28) 0%, rgba(212,175,55,0.12) 60%, transparent 100%)',
                }}
              >
                <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-[0_4px_14px_rgba(212,175,55,0.75)]">
                  <defs>
                    <linearGradient id="centerGemHeart" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFF7D6" />
                      <stop offset="45%" stopColor="#E6C255" />
                      <stop offset="100%" stopColor="#8E6710" />
                    </linearGradient>
                  </defs>
                  {/* Trái tim pha lê cắt mặt vàng */}
                  <path
                    d="M40 67 C40 67 12 49.5 12 30.5 C12 20.5 19.8 13.5 28.8 13.5 C34.1 13.5 37.9 16.2 40 19.6 C42.1 16.2 45.9 13.5 51.2 13.5 C60.2 13.5 68 20.5 68 30.5 C68 49.5 40 67 40 67 Z"
                    fill="url(#centerGemHeart)"
                    stroke="#FFF4C4"
                    strokeWidth="1.8"
                  />
                  {/* Đường cắt mặt đá quý bên trong */}
                  <path
                    d="M40 19.6 L30 33 L40 67 L50 33 Z"
                    fill="#FFF7D6"
                    fillOpacity="0.22"
                  />
                  <path
                    d="M12 30.5 L30 33 L50 33 L68 30.5"
                    stroke="#FFF7D6"
                    strokeOpacity="0.45"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Nhãn phản hồi chạm nhịp */}
            <div className="relative z-10 mt-1 text-center px-3">
              <p
                key={feedback.key}
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  feedback.type === 'hit'
                    ? 'text-[#FFF4C4]'
                    : feedback.type === 'miss'
                      ? 'text-amber-300'
                      : 'text-[#CFC8B8]'
                }`}
              >
                {feedback.text}
              </p>
              <p className="mt-1 text-[11px] text-[#8E877A]">
                Chạm trực tiếp vào khung này (hoặc nhấn phím Space)
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* TRẠNG THÁI THẮNG: CỘNG HƯỞNG THÀNH CÔNG 3/3 */
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-xl mx-auto py-2"
        >
          {/* Ánh sáng vàng bùng lên */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 0.95, 0.5], scale: [0.75, 1.18, 1] }}
            transition={{ duration: 1 }}
            className="pointer-events-none absolute -inset-5 rounded-[34px] blur-2xl"
            style={{
              background:
                'radial-gradient(circle, rgba(255,244,196,0.34) 0%, rgba(212,175,55,0.22) 48%, transparent 74%)',
            }}
          />

          <div className="relative z-10 rounded-2xl bg-gradient-to-b from-[#181522] via-[#100F17] to-[#0B0B0F] border-2 border-[#F3E5AB]/85 p-5 sm:p-6 shadow-[0_0_44px_rgba(212,175,55,0.3)] text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#F3E5AB]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span>Nhịp đập cộng hưởng · 3/3 Hoàn hảo</span>
            </div>

            <div className="mt-4 flex flex-col items-center">
              <div className="w-[144px] sm:w-[168px] aspect-square rounded-2xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/70 shadow-[0_0_26px_rgba(212,175,55,0.35)] flex items-center justify-center">
                {!avatarFailed && targetChar.avatar.trim() !== '' ? (
                  <img
                    src={targetChar.avatar}
                    alt={`Ảnh đại diện ${targetChar.name}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                    onLoad={(e) => {
                      if (e.currentTarget.naturalWidth === 0) setAvatarFailed(true);
                    }}
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <BlackCatMascot size={56} variant="companion" />
                )}
              </div>

              <h4 className="mt-3.5 font-display text-2xl sm:text-[28px] font-semibold text-[#F3E5AB]">
                {primaryName}
              </h4>
              {secondaryName && (
                <p className="text-xs font-medium text-[#D4AF37]">{secondaryName}</p>
              )}

              {targetChar.tags.length > 0 && (
                <p className="mt-1.5 text-[11px] sm:text-xs text-[#9E9687]">
                  {targetChar.tags.slice(0, 5).join(' · ')}
                </p>
              )}

              <blockquote className="mt-4 w-full rounded-xl bg-[#0B0B0F]/85 border border-[#D4AF37]/30 p-4 space-y-2">
                <p className="text-xs sm:text-sm text-[#F5EFE0] italic leading-relaxed">
                  “{resonantLine}”
                </p>
                {targetChar.description &&
                  formatQuotedDescription(targetChar.description) !== `“${resonantLine}”` && (
                    <p className="text-[11px] sm:text-xs text-[#D4AF37] italic pt-1.5 border-t border-[#D4AF37]/15">
                      {formatQuotedDescription(targetChar.description)}
                    </p>
                  )}
              </blockquote>
            </div>

            <div className="mt-5 pt-4 border-t border-[#D4AF37]/20 space-y-2.5">
              <div
                className={`grid gap-2.5 ${
                  primaryChatLink ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-xs mx-auto'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('card');
                    onOpenCharacterProfile(targetChar);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#161320]/95 border border-[#D4AF37]/80 text-[#F3E5AB] text-xs sm:text-[13px] font-semibold whitespace-nowrap shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:bg-[#D4AF37]/18 hover:border-[#FFF4C4] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                >
                  <span>💌 Xem hồ sơ tình yêu</span>
                </button>

                {primaryChatLink && (
                  <a
                    href={primaryChatLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSoftTap('card')}
                    className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#ECCD72] to-[#D4AF37] text-[#0B0B0F] text-xs sm:text-[13px] font-semibold whitespace-nowrap shadow-[0_0_22px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4]"
                  >
                    <span>💬 Vào phòng chat</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                )}
              </div>

              {hasBothLinks && (
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-[#B8B0A0]">
                  <span>Nền tảng chat:</span>
                  <a
                    href={targetChar.dokiLink}
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
                    href={targetChar.ggaiLink}
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

              <div className="pt-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('tap');
                    pickRandomCharacter(true);
                  }}
                  className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 rounded-xl border border-[#D4AF37]/35 bg-[#0B0B0F]/85 text-xs font-medium text-[#CFC8B8] hover:text-[#F3E5AB] hover:border-[#D4AF37]/75 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>Chơi lại với nhân vật khác</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
