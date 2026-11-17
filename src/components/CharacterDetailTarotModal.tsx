import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Heart,
  Mail,
  MessageSquareQuote,
  Send,
  Sparkles,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import type { CharacterItem } from '../App';
import { getCharacterStoryProfile } from '../data/characterProfiles';
import type { HeartfeltLetter, UserProfile } from '../types/user';
import { BlackCatMascot } from './BlackCatMascot';
import { GoldenStardust } from './GoldenStardust';
import { HolographicTiltCard } from './HolographicTiltCard';
import { SoulmateInlineBadge, UserAvatarBadge } from './UserAvatarBadge';
import { playSoftTap } from '../utils/soundEffects';

interface CharacterDetailTarotModalProps {
  character: CharacterItem | null;
  userProfile: UserProfile | null;
  hasSoulmateBadge: boolean;
  letters: HeartfeltLetter[];
  openedFromTarot?: boolean;
  onBackToTarot?: () => void;
  openedFromMystic?: boolean;
  onBackToMystic?: () => void;
  onSendLetter: (characterId: string, content: string) => void;
  onDeleteLetter: (characterId: string, letterId: string) => void;
  onOpenProfileModal: () => void;
  onClose: () => void;
}

type ModalTab = 'profile' | 'mailbox';

function formatQuotedText(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const startsWithQuote = /^["“'‘]/.test(trimmed);
  const endsWithQuote = /["”'’]$/.test(trimmed);
  if (startsWithQuote && endsWithQuote) return trimmed;
  const cleaned = trimmed.replace(/^["“]+|["”]+$/g, '');
  return `“${cleaned}”`;
}

function formatLetterTimestamp(timestamp: number): string {
  try {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} · ${hours}:${minutes}`;
  } catch {
    return '';
  }
}

/**
 * Phóng to thẻ nhân vật thành "Lá bài Tarot khổng lồ" chạm trổ ánh kim
 * gồm Hồ sơ chi tiết (Câu chuyện nền, Lời thoại mở đầu + Copy nhanh) & Hòm Thư Tâm Tình.
 */
export const CharacterDetailTarotModal: React.FC<CharacterDetailTarotModalProps> = ({
  character,
  userProfile,
  hasSoulmateBadge,
  letters,
  openedFromTarot = false,
  onBackToTarot,
  openedFromMystic = false,
  onBackToMystic,
  onSendLetter,
  onDeleteLetter,
  onOpenProfileModal,
  onClose,
}) => {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>('profile');
  const [copiedFirstMsg, setCopiedFirstMsg] = useState(false);
  const [draftLetter, setDraftLetter] = useState('');

  useEffect(() => {
    setAvatarFailed(false);
    setActiveTab('profile');
    setCopiedFirstMsg(false);
    setDraftLetter('');
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

  const storyProfile = character ? getCharacterStoryProfile(character) : null;

  const handleCopyFirstMessage = async () => {
    if (!storyProfile) return;
    playSoftTap('card');
    try {
      await navigator.clipboard.writeText(storyProfile.firstMessage);
      setCopiedFirstMsg(true);
    } catch {
      // Fallback copy for restricted environments
      const helper = document.createElement('textarea');
      helper.value = storyProfile.firstMessage;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      try {
        document.execCommand('copy');
        setCopiedFirstMsg(true);
      } finally {
        document.body.removeChild(helper);
      }
    }
    window.setTimeout(() => {
      setCopiedFirstMsg(false);
    }, 2200);
  };

  const handleLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!character || !userProfile) return;
    const trimmed = draftLetter.trim();
    if (!trimmed) return;
    playSoftTap('card');
    onSendLetter(character.id, trimmed);
    setDraftLetter('');
  };

  return (
    <AnimatePresence>
      {character && storyProfile && (
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
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-[#050508]/88 backdrop-blur-md overflow-y-auto"
        >
          {/* Hạt bụi sáng bay lồng lộng xung quanh lá bài khổng lồ */}
          <GoldenStardust className="z-0 opacity-95" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-[440px] md:max-w-[780px] my-auto"
          >
            <HolographicTiltCard
              disableTilt
              className="rounded-[26px] sm:rounded-[28px] bg-gradient-to-b from-[#171620] via-[#0D0D14] to-[#14121B] border-2 border-[#D4AF37]/80 shadow-[0_26px_80px_rgba(0,0,0,0.92),0_0_48px_rgba(212,175,55,0.28)] p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Khung viền hoa văn Tarot chạm trổ ánh kim bên trong */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2 rounded-[20px] sm:rounded-[22px] border border-[#F3E5AB]/30"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3.5 rounded-[14px] sm:rounded-[16px] border border-[#D4AF37]/15"
              />

              {/* Thanh đầu lá bài Tarot: Nút quay lại (nếu mở từ Tarot) · Tiêu đề · Nút đóng */}
              <div className="relative z-20 flex items-center justify-between gap-2 pb-3.5">
                <div className="min-w-[36px] flex items-center justify-start">
                  {openedFromTarot && onBackToTarot && (
                    <button
                      type="button"
                      onClick={() => {
                        playSoftTap('nav');
                        onBackToTarot();
                      }}
                      className="inline-flex items-center gap-1 min-h-[36px] px-2.5 sm:px-3 rounded-full bg-[#0B0B0F]/95 border border-[#D4AF37]/45 text-[11px] sm:text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Bàn Tarot</span>
                    </button>
                  )}
                  {!openedFromTarot && openedFromMystic && onBackToMystic && (
                    <button
                      type="button"
                      onClick={() => {
                        playSoftTap('nav');
                        onBackToMystic();
                      }}
                      className="inline-flex items-center gap-1 min-h-[36px] px-2.5 sm:px-3 rounded-full bg-[#0B0B0F]/95 border border-[#D4AF37]/45 text-[11px] sm:text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 active:scale-95 transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Góc Huyền Bí</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-display tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#D4AF37] text-center">
                  <span aria-hidden="true">✦</span>
                  <span className="inline-flex items-center gap-1 text-[#F3E5AB]">
                    <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span>
                      {openedFromTarot
                        ? 'Lá Bài Định Mệnh'
                        : openedFromMystic
                          ? 'Hồ Sơ Tình Yêu'
                          : 'Arcana · Tần Nhi'}
                    </span>
                  </span>
                  <span aria-hidden="true">✦</span>
                </div>

                <div className="min-w-[36px] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Đóng lá bài nhân vật"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0F]/95 border border-[#D4AF37]/55 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Bố cục 2 cột trên máy tính, 1 cột cuộn gọn gàng trên điện thoại */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-[270px_minmax(0,1fr)] gap-5 md:gap-6 items-start">
                {/* Cột trái: Ảnh đại diện + Tên + Tag + Link Chat trực tiếp */}
                <div className="flex flex-col items-center text-center md:sticky md:top-2">
                  <div className="relative aspect-square w-full max-w-[240px] md:max-w-full rounded-2xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/60 shadow-[0_0_26px_rgba(212,175,55,0.25)]">
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

                  <div className="mt-3.5 px-1">
                    <h3
                      id="tarot-zoom-char-name"
                      className="font-display text-2xl sm:text-[27px] font-semibold text-[#F3E5AB] tracking-tight leading-tight"
                    >
                      {primaryName}
                    </h3>
                    {secondaryName && (
                      <p className="text-xs font-medium text-[#D4AF37] mt-0.5">{secondaryName}</p>
                    )}
                    <p className="mt-2 text-xs text-[#DCD4C6] italic leading-relaxed">
                      {formatQuotedText(character.description)}
                    </p>
                  </div>

                  {/* Các tag thể loại */}
                  {character.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {character.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0B0B0F]/92 border border-[#D4AF37]/38 text-[10px] sm:text-[11px] font-medium text-[#E6CD82]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Nút dẫn link Chat trực tiếp */}
                  {(hasDoki || hasGgai) && (
                    <div className="w-full mt-4 pt-3.5 border-t border-[#D4AF37]/25 space-y-2">
                      <p className="text-[11px] font-medium text-[#B8B0A0]">
                        Chọn nền tảng trò chuyện
                      </p>
                      <div
                        className={
                          hasBothLinks ? 'grid grid-cols-2 gap-2' : 'flex'
                        }
                      >
                        {hasDoki && (
                          <a
                            href={character.dokiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playSoftTap('card')}
                            className={`shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold whitespace-nowrap hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] transition-all ${
                              !hasBothLinks ? 'w-full' : ''
                            }`}
                          >
                            <span>DokiChat</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          </a>
                        )}

                        {hasGgai && (
                          <a
                            href={character.ggaiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playSoftTap('card')}
                            className={`inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-2 rounded-xl bg-[#0B0B0F] border border-[#D4AF37]/65 text-[#F3E5AB] text-xs font-medium whitespace-nowrap hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-all ${
                              !hasBothLinks ? 'w-full' : ''
                            }`}
                          >
                            <span>GGAI</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cột phải: Tab chuyển đổi Hồ sơ chi tiết & Hòm Thư Tâm Tình */}
                <div className="flex flex-col min-w-0">
                  {/* Thanh chọn Tab thanh lịch */}
                  <div
                    role="tablist"
                    aria-label="Thông tin hồ sơ nhân vật"
                    className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#0B0B0F]/90 border border-[#D4AF37]/30 mb-4"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'profile'}
                      onClick={() => {
                        playSoftTap('tap');
                        setActiveTab('profile');
                      }}
                      className={`inline-flex items-center justify-center gap-1.5 min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === 'profile'
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] font-semibold shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                          : 'text-[#CFC8B8] hover:text-[#F3E5AB]'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Hồ sơ & Lời mở đầu</span>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'mailbox'}
                      onClick={() => {
                        playSoftTap('tap');
                        setActiveTab('mailbox');
                      }}
                      className={`inline-flex items-center justify-center gap-1.5 min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === 'mailbox'
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] font-semibold shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                          : 'text-[#CFC8B8] hover:text-[#F3E5AB]'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Hòm Thư Tâm Tình</span>
                      <span
                        className={`tabular-nums text-[10px] px-1.5 py-0.5 rounded-full ${
                          activeTab === 'mailbox'
                            ? 'bg-[#0B0B0F]/20 text-[#0B0B0F]'
                            : 'bg-[#D4AF37]/15 text-[#F3E5AB]'
                        }`}
                      >
                        {letters.length}
                      </span>
                    </button>
                  </div>

                  {activeTab === 'profile' ? (
                    <div className="space-y-3.5">
                      {/* Mục 1: Câu chuyện nền (Backstory) */}
                      <section className="rounded-2xl bg-[#0B0B0F]/75 border border-[#D4AF37]/25 p-3.5 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                          <h4 className="font-display text-lg font-semibold text-[#F3E5AB]">
                            Câu chuyện nền (Backstory)
                          </h4>
                        </div>
                        <div className="max-h-[210px] sm:max-h-[230px] overflow-y-auto pr-2 text-xs sm:text-[13.5px] text-[#DED7C8] leading-relaxed whitespace-pre-line">
                          {storyProfile.backstory}
                        </div>
                      </section>

                      {/* Mục 2: Lời thoại mở đầu (First Message) + Copy nhanh */}
                      <section className="rounded-2xl bg-[#0B0B0F]/85 border border-[#D4AF37]/35 p-3.5 sm:p-4">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <MessageSquareQuote
                              className="w-4 h-4 text-[#D4AF37] shrink-0"
                              aria-hidden="true"
                            />
                            <h4 className="font-display text-lg font-semibold text-[#F3E5AB] truncate">
                              Lời thoại mở đầu (First Message)
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyFirstMessage}
                            className={`inline-flex items-center gap-1.5 min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                              copiedFirstMsg
                                ? 'bg-[#D4AF37] border-[#F3E5AB] text-[#0B0B0F] font-semibold'
                                : 'bg-[#15151E] border-[#D4AF37]/45 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15'
                            }`}
                          >
                            {copiedFirstMsg ? (
                              <>
                                <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>Đã sao chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>Copy nhanh</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="rounded-xl bg-[#12121A]/90 border border-[#D4AF37]/18 p-3 max-h-[220px] sm:max-h-[245px] overflow-y-auto pr-2 text-xs sm:text-[13.5px] text-[#EDE6D6] leading-relaxed whitespace-pre-line italic">
                          {storyProfile.firstMessage}
                        </div>
                      </section>
                    </div>
                  ) : (
                    /* Tab 2: Hòm Thư Tâm Tình (Gửi lời nhắn riêng cho nhân vật) */
                    <div className="space-y-4">
                      {userProfile ? (
                        <form
                          onSubmit={handleLetterSubmit}
                          className="rounded-2xl bg-[#0B0B0F]/80 border border-[#D4AF37]/30 p-3.5 sm:p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <UserAvatarBadge
                                avatarUrl={userProfile.avatarUrl}
                                avatarIcon={userProfile.avatarIcon}
                                displayName={userProfile.displayName}
                                size="sm"
                              />
                              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                                <span className="text-xs sm:text-sm font-semibold text-[#F3E5AB] truncate max-w-[140px] sm:max-w-[190px]">
                                  {userProfile.displayName}
                                </span>
                                {hasSoulmateBadge && <SoulmateInlineBadge />}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                playSoftTap('tap');
                                onOpenProfileModal();
                              }}
                              className="text-[11px] text-[#D4AF37] hover:text-[#F3E5AB] underline underline-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              Đổi hồ sơ
                            </button>
                          </div>

                          <textarea
                            rows={3}
                            maxLength={450}
                            value={draftLetter}
                            onChange={(e) => setDraftLetter(e.target.value)}
                            placeholder={`Gửi một lời nhắn tâm tình riêng tới ${primaryName}...`}
                            className="w-full rounded-xl bg-[#12121A] border border-[#D4AF37]/30 px-3 py-2.5 text-xs sm:text-sm text-[#F5EFE0] placeholder:text-[#7E776B] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 resize-none"
                          />

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-[#8E877A] tabular-nums">
                              {draftLetter.length}/450 ký tự
                            </span>

                            <button
                              type="submit"
                              disabled={!draftLetter.trim()}
                              className="shimmer-gold-btn inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 disabled:opacity-45 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              <span>Gửi thư tâm tình</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="rounded-2xl bg-[#0B0B0F]/80 border border-[#D4AF37]/30 p-4 text-center flex flex-col items-center gap-2.5">
                          <Heart className="w-5 h-5 text-[#D4AF37]" aria-hidden="true" />
                          <p className="text-xs sm:text-[13px] text-[#DED7C8] leading-relaxed max-w-sm">
                            Hãy tạo một hồ sơ nhỏ tại <strong className="text-[#F3E5AB]">Góc Tri Kỷ</strong> để viết thư tâm sự gửi riêng cho {primaryName} nhé.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              playSoftTap('card');
                              onOpenProfileModal();
                            }}
                            className="shimmer-gold-btn inline-flex items-center gap-1.5 min-h-[38px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 transition-all cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>Mở Góc Tri Kỷ để gửi thư</span>
                          </button>
                        </div>
                      )}

                      {/* Danh sách các lá thư đã lưu */}
                      <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                        {letters.length > 0 ? (
                          letters.map((letter) => {
                            const showBadge =
                              letter.hasSoulmateBadge ||
                              (hasSoulmateBadge &&
                                userProfile &&
                                letter.authorName === userProfile.displayName);

                            return (
                              <article
                                key={letter.id}
                                className="rounded-xl bg-[#0B0B0F]/70 border border-[#D4AF37]/22 p-3 space-y-2"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <UserAvatarBadge
                                      avatarUrl={letter.authorAvatarUrl}
                                      avatarIcon={letter.authorAvatarIcon}
                                      displayName={letter.authorName}
                                      size="sm"
                                    />
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="text-xs font-semibold text-[#F3E5AB] truncate max-w-[160px]">
                                          {letter.authorName}
                                        </span>
                                        {showBadge && <SoulmateInlineBadge />}
                                      </div>
                                      <p className="text-[10px] text-[#8E877A] tabular-nums mt-0.5">
                                        {formatLetterTimestamp(letter.createdAt)}
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      playSoftTap('nav');
                                      onDeleteLetter(character.id, letter.id);
                                    }}
                                    aria-label="Xóa lời nhắn này"
                                    title="Xóa lời nhắn"
                                    className="p-1.5 rounded-lg text-[#8E877A] hover:text-amber-300 hover:bg-[#D4AF37]/10 transition-colors cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                  </button>
                                </div>

                                <p className="text-xs sm:text-[13px] text-[#E5DEC9] leading-relaxed whitespace-pre-line">
                                  {letter.content}
                                </p>
                              </article>
                            );
                          })
                        ) : (
                          <div className="py-6 text-center rounded-xl border border-dashed border-[#D4AF37]/20 text-xs text-[#8E877A]">
                            Hòm thư của {primaryName} đang yên lặng chờ lá thư đầu tiên từ cậu.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chân lá bài Tarot */}
              <div
                aria-hidden="true"
                className="relative z-10 mt-5 pt-2 border-t border-[#D4AF37]/15 flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] text-[#D4AF37]/75"
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
