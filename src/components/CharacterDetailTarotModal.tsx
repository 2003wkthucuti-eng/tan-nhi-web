import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';
import type { CharacterItem } from '../App';
import { BlackCatMascot } from './BlackCatMascot';
import { GoldenStardust } from './GoldenStardust';
import { HolographicTiltCard } from './HolographicTiltCard';
import { playSoftTap } from '../utils/soundEffects';

interface CharacterDetailTarotModalProps {
  character: CharacterItem | null;
  onClose: () => void;
}

function formatQuotedText(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const startsWithQuote = /^["“'‘]/.test(trimmed);
  const endsWithQuote = /["”'’]$/.test(trimmed);
  if (startsWithQuote && endsWithQuote) return trimmed;
  const cleaned = trimmed.replace(/^["“]+|["”]+$/g, '');
  return `“${cleaned}”`;
}

/**
 * Phóng to thẻ nhân vật thành "Lá bài Tarot khổng lồ" chạm trổ ánh kim
 * kèm bụi sáng lồng lộng, nghiêng 3D phản chiếu ánh kim và nút dẫn link chat trực tiếp.
 */
export const CharacterDetailTarotModal: React.FC<CharacterDetailTarotModalProps> = ({
  character,
  onClose,
}) => {
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [character?.id]);

  useEffect(() => {
    if (!character) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playSoftTap('nav');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [character, onClose]);

  const handleClose = () => {
    playSoftTap('nav');
    onClose();
  };

  const hasDoki = Boolean(character?.dokiLink && character.dokiLink.trim() !== '');
  const hasGgai = Boolean(character?.ggaiLink && character.ggaiLink.trim() !== '');
  const hasBothLinks = hasDoki && hasGgai;

  const nameParts = character ? character.name.split(/\s+[—-]\s+/) : [];
  const primaryName = nameParts[0] || '';
  const secondaryName = nameParts.length > 1 ? nameParts.slice(1).join(' · ') : '';

  return (
    <AnimatePresence>
      {character && (
        <motion.div
          key="character-tarot-zoom-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tarot-zoom-char-name"
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050508]/88 backdrop-blur-md overflow-y-auto"
        >
          {/* Hạt bụi sáng bay lồng lộng xung quanh lá bài khổng lồ */}
          <GoldenStardust className="z-0 opacity-95" />

          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 14 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-[395px] my-auto"
          >
            <HolographicTiltCard
              maxTilt={8}
              className="rounded-[28px] bg-gradient-to-b from-[#171620] via-[#0D0D14] to-[#14121B] border-2 border-[#D4AF37]/80 shadow-[0_26px_80px_rgba(0,0,0,0.92),0_0_48px_rgba(212,175,55,0.28)] p-4 sm:p-5"
            >
              {/* Khung viền hoa văn Tarot chạm trổ ánh kim bên trong */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2 rounded-[22px] border border-[#F3E5AB]/35"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3.5 rounded-[16px] border border-[#D4AF37]/20"
              />

              {/* Nút Đóng góc trên lá bài */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng lá bài nhân vật"
                className="absolute top-3.5 right-3.5 z-30 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Đầu lá bài Tarot: Mặt trăng & Sao 4 cánh */}
              <div className="relative z-10 flex items-center justify-center gap-2 pt-1 pb-3 text-[10px] sm:text-[11px] font-display tracking-[0.22em] uppercase text-[#D4AF37]">
                <span>✦</span>
                <span className="inline-flex items-center gap-1 text-[#F3E5AB]">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />
                  Arcana · Tần Nhi
                </span>
                <span>✦</span>
              </div>

              {/* Khung ảnh đại diện chạm trổ vòm Tarot */}
              <div className="relative z-10 aspect-square max-h-[265px] w-full mx-auto rounded-2xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/60 shadow-[0_0_26px_rgba(212,175,55,0.25)]">
                {!avatarFailed && character.avatar.trim() !== '' ? (
                  <img
                    src={character.avatar}
                    alt={`Ảnh đại diện nhân vật ${character.name}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                    onLoad={(e) => {
                      if (e.currentTarget.naturalWidth === 0) {
                        setAvatarFailed(true);
                      }
                    }}
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#16161F] to-[#0B0B0F] p-4 text-center">
                    <BlackCatMascot size={70} variant="companion" />
                    <span className="font-display text-xl text-[#F3E5AB]">{primaryName}</span>
                  </div>
                )}
              </div>

              {/* Thông tin chi tiết nhân vật */}
              <div className="relative z-10 mt-4 text-center px-1">
                <h3
                  id="tarot-zoom-char-name"
                  className="font-display text-2xl sm:text-[28px] font-semibold text-[#F3E5AB] tracking-tight leading-tight"
                >
                  {primaryName}
                </h3>
                {secondaryName && (
                  <p className="text-xs font-medium text-[#D4AF37] mt-0.5">
                    {secondaryName}
                  </p>
                )}
                <p className="mt-2.5 text-xs sm:text-[13px] text-[#E0D9CA] italic leading-relaxed">
                  {formatQuotedText(character.description)}
                </p>
              </div>

              {/* Các tag thể loại */}
              {character.tags.length > 0 && (
                <div className="relative z-10 mt-3.5 flex flex-wrap justify-center gap-1.5 px-1">
                  {character.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0B0B0F]/92 border border-[#D4AF37]/38 text-[11px] font-medium text-[#E6CD82]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Nút dẫn link Chat trực tiếp */}
              {(hasDoki || hasGgai) && (
                <div
                  className={`relative z-10 mt-4 pt-3.5 border-t border-[#D4AF37]/25 ${
                    hasBothLinks ? 'grid grid-cols-2 gap-2.5' : 'flex'
                  }`}
                >
                  {hasDoki && (
                    <a
                      href={character.dokiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSoftTap('card')}
                      className={`shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold whitespace-nowrap hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] transition-all ${
                        !hasBothLinks ? 'w-full' : ''
                      }`}
                    >
                      <span>Link DokiChat</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  )}

                  {hasGgai && (
                    <a
                      href={character.ggaiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSoftTap('card')}
                      className={`inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3 py-2 rounded-xl bg-[#0B0B0F] border border-[#D4AF37]/65 text-[#F3E5AB] text-xs font-medium whitespace-nowrap hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-all ${
                        !hasBothLinks ? 'w-full' : ''
                      }`}
                    >
                      <span>Link GGAI</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}

              {/* Chân lá bài Tarot */}
              <div
                aria-hidden="true"
                className="relative z-10 mt-3 pt-1 flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] text-[#D4AF37]/75"
              >
                <span>✧</span>
                <span>NGÔI NHÀ NHỎ</span>
                <span>✧</span>
              </div>
            </HolographicTiltCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
