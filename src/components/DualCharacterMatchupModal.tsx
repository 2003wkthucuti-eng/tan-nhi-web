import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, DoorOpen, RefreshCcw, Sparkles, X } from 'lucide-react';
import type { CharacterItem } from '../App';
import { BlackCatMascot } from './BlackCatMascot';
import { GoldenStardust } from './GoldenStardust';
import { HolographicTiltCard } from './HolographicTiltCard';
import { playDestinyChime, playSoftTap } from '../utils/soundEffects';

interface DualCharacterMatchupModalProps {
  isOpen: boolean;
  characters: CharacterItem[];
  onInspectCharacter: (char: CharacterItem) => void;
  onChatLinkClick: (charId: string) => void;
  onClose: () => void;
}

function ensureQuoted(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const startsWithQuote = /^["“'‘]/.test(trimmed);
  const endsWithQuote = /["”'’]$/.test(trimmed);
  if (startsWithQuote && endsWithQuote) return trimmed;
  const cleaned = trimmed.replace(/^["“]+|["”]+$/g, '');
  return `“${cleaned}”`;
}

export const DualCharacterMatchupModal: React.FC<DualCharacterMatchupModalProps> = ({
  isOpen,
  characters,
  onInspectCharacter,
  onChatLinkClick,
  onClose,
}) => {
  const [pair, setPair] = useState<[CharacterItem, CharacterItem] | null>(null);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});

  const rollNewPair = () => {
    if (characters.length < 2) return;
    playDestinyChime();
    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    setPair([shuffled[0], shuffled[1]]);
  };

  useEffect(() => {
    if (isOpen && characters.length >= 2) {
      rollNewPair();
    }
  }, [isOpen, characters]);

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

  if (!isOpen || !pair) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="dual-character-matchup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dual-matchup-title"
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#050508]/88 backdrop-blur-md overflow-y-auto"
        >
          <GoldenStardust className="z-0 opacity-95" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-4xl my-auto"
          >
            <HolographicTiltCard
              disableTilt
              className="rounded-[26px] sm:rounded-[28px] bg-gradient-to-b from-[#191522] via-[#0B0B11] to-[#15121B] border-2 border-[#D4AF37]/85 shadow-[0_28px_84px_rgba(0,0,0,0.95),0_0_54px_rgba(212,175,55,0.34)] p-4 sm:p-7 max-h-[88vh] overflow-y-auto"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#F3E5AB]/28"
              />

              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng Hai Cánh Cửa Định Mệnh"
                className="absolute top-4 right-4 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center">
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#D4AF37] inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>So Sánh Tương Quan</span>
                </p>

                <h2
                  id="dual-matchup-title"
                  className="mt-1 font-display text-2xl sm:text-3xl font-semibold gold-shimmer-text leading-tight"
                >
                  ⚖️ Hai Cánh Cửa Định Mệnh
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#B8B0A0] max-w-md">
                  Đằng sau mỗi cánh cửa là một thế giới cảm xúc khác biệt. Đêm nay, trái tim bạn sẽ hướng về ai?
                </p>

                {/* 2 cột nhân vật đối xứng */}
                <div className="mt-5 w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
                  {pair.map((char, index) => {
                    const nameParts = char.name.split(/\s+[—-]\s+/);
                    const primaryName = nameParts[0];
                    const secondaryName = nameParts.length > 1 ? nameParts.slice(1).join(' · ') : '';
                    const hasDoki = Boolean(char.dokiLink && char.dokiLink.trim() !== '');

                    return (
                      <div
                        key={char.id}
                        className="rounded-2xl bg-[#0B0B0F]/90 border border-[#D4AF37]/35 p-4 sm:p-5 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)] group hover:border-[#D4AF37]/75 transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-3.5 mb-3.5">
                            <div className="relative aspect-square w-16 sm:w-20 rounded-xl overflow-hidden bg-[#050508] border border-[#D4AF37]/50 shrink-0">
                              {!failedAvatars[char.id] && char.avatar.trim() !== '' ? (
                                <img
                                  src={char.avatar}
                                  alt={char.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover object-top"
                                  onError={() =>
                                    setFailedAvatars((prev) => ({ ...prev, [char.id]: true }))
                                  }
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#121218]">
                                  <BlackCatMascot size={36} variant="companion" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-medium tracking-widest text-[#D4AF37] uppercase">
                                Cánh cửa #{index + 1}
                              </span>
                              <h3 className="font-display text-lg sm:text-xl font-semibold text-[#F3E5AB] truncate">
                                {primaryName}
                              </h3>
                              {secondaryName && (
                                <p className="text-[11px] text-[#D4AF37]/85 truncate">{secondaryName}</p>
                              )}
                            </div>
                          </div>

                          {char.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2.5">
                              {char.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#161622] border border-[#D4AF37]/25 text-[10px] font-medium text-[#E6CD82]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="rounded-xl bg-[#12121A] border border-[#D4AF37]/20 p-3 mb-4">
                            <p className="text-xs sm:text-[13px] text-[#E5DEC9] italic leading-relaxed line-clamp-3">
                              {ensureQuoted(char.description)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-[#D4AF37]/15">
                          <button
                            type="button"
                            onClick={() => {
                              playSoftTap('card');
                              onClose();
                              onInspectCharacter(char);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 min-h-[38px] px-3 py-2 rounded-xl bg-[#121218] border border-[#D4AF37]/50 text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] active:scale-95 transition-all cursor-pointer"
                          >
                            <span>Xem hồ sơ</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              playSoftTap('card');
                              onClose();
                              if (hasDoki) {
                                onChatLinkClick(char.id);
                                window.open(char.dokiLink, '_blank', 'noopener,noreferrer');
                              } else {
                                onInspectCharacter(char);
                              }
                            }}
                            className="shimmer-gold-btn flex-1 inline-flex items-center justify-center gap-1 min-h-[38px] px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                          >
                            <DoorOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>Chọn cửa này</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Nút đổi cặp khác & Đóng */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={rollNewPair}
                    className="shimmer-gold-btn w-full sm:w-auto inline-flex items-center justify-center gap-1.5 min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <RefreshCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>🔄 Đổi cặp khác</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 min-h-[40px] px-5 py-2 rounded-xl bg-[#121218] border border-[#D4AF37]/45 text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Trở về danh sách</span>
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
