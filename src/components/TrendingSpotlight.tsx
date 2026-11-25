import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, Flame } from 'lucide-react';
import type { CharacterItem } from '../App';
import type { TrendingCharacterEntry } from '../utils/trendingStats';
import { playSoftTap } from '../utils/soundEffects';
import { BlackCatMascot } from './BlackCatMascot';

interface TrendingSpotlightProps {
  entries: TrendingCharacterEntry[];
  failedAvatars: Record<string, boolean>;
  onAvatarError: (characterId: string) => void;
  onSelectCharacter: (character: CharacterItem) => void;
  onChatLinkClick: (characterId: string) => void;
}

function getPrimaryName(name: string): string {
  return name.split(/\s+[—-]\s+/)[0] || name;
}

function formatQuotedSlogan(text: string): string {
  const trimmed = text.trim().replace(/^["“]+|["”]+$/g, '');
  return trimmed ? `“${trimmed}”` : '';
}

export const TrendingSpotlight: React.FC<TrendingSpotlightProps> = ({
  entries,
  failedAvatars,
  onAvatarError,
  onSelectCharacter,
  onChatLinkClick,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (entries.length === 0) return null;

  return (
    <section
      aria-labelledby="trending-spotlight-heading"
      className="mb-6 sm:mb-8"
    >
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-widest uppercase text-[#D4AF37] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
            <span>Top Trending</span>
          </p>
          <h3
            id="trending-spotlight-heading"
            className="font-display text-xl sm:text-2xl font-semibold text-[#F5EFE0] leading-tight"
          >
            Gương mặt nổi bật
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            playSoftTap('tap');
            setIsCollapsed((prev) => !prev);
          }}
          aria-expanded={!isCollapsed}
          className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-xl bg-[#121218] border border-[#D4AF37]/30 text-xs font-medium text-[#DCD4C6] hover:border-[#D4AF37]/70 hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          <span>{isCollapsed ? 'Hiện Top 3' : 'Thu gọn'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-200 ${
              isCollapsed ? '' : 'rotate-180'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {entries.map(({ character, rank, views, interactions }) => {
            const primaryName = getPrimaryName(character.name);
            const primaryLink =
              character.dokiLink?.trim() || character.ggaiLink?.trim() || '';
            const primaryTag = character.tags[0] || '';
            const formattedRank = `0${rank}`;

            return (
              <article
                key={character.id}
                onClick={() => {
                  playSoftTap('card');
                  onSelectCharacter(character);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playSoftTap('card');
                    onSelectCharacter(character);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Mở hồ sơ nhân vật nổi bật hạng ${rank}: ${primaryName}`}
                className="group relative rounded-2xl bg-[#121218]/92 border border-[#D4AF37]/30 hover:border-[#D4AF37]/75 p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-200 hover:shadow-[0_0_28px_-6px_rgba(212,175,55,0.28)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
              >
                {/* Ảnh đại diện vuông đồng bộ */}
                <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/45 group-hover:border-[#F3E5AB]/80 shrink-0 flex items-center justify-center">
                  {!failedAvatars[character.id] && character.avatar.trim() !== '' ? (
                    <img
                      src={character.avatar}
                      alt={`Ảnh đại diện ${character.name}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      onLoad={(e) => {
                        if (e.currentTarget.naturalWidth === 0) {
                          onAvatarError(character.id);
                        }
                      }}
                      onError={() => onAvatarError(character.id)}
                    />
                  ) : (
                    <BlackCatMascot size={38} variant="companion" />
                  )}
                </div>

                {/* Thông tin nhân vật nổi bật (không dùng pill box cho metadata) */}
                <div className="min-w-0 flex-1 flex flex-col justify-between gap-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#B8B0A0] tabular-nums truncate">
                    <span className="font-semibold text-[#F3E5AB]">
                      {formattedRank}
                    </span>
                    <span aria-hidden="true" className="text-[#D4AF37]/60">
                      ·
                    </span>
                    <span>{views.toLocaleString('vi-VN')} lượt xem</span>
                    {primaryTag && (
                      <>
                        <span aria-hidden="true" className="text-[#D4AF37]/60 hidden sm:inline">
                          ·
                        </span>
                        <span className="hidden sm:inline truncate text-[#D4AF37]/90">
                          {primaryTag}
                        </span>
                      </>
                    )}
                  </div>

                  <h4 className="font-display text-lg sm:text-xl font-semibold text-[#F3E5AB] group-hover:text-[#FFF4C4] transition-colors truncate leading-snug">
                    {primaryName}
                  </h4>

                  <p className="text-[11px] sm:text-xs text-[#C7C0B2] italic truncate">
                    {formatQuotedSlogan(character.description)}
                  </p>

                  <div className="pt-1 flex items-center justify-between gap-2 text-[11px] font-medium">
                    <span className="text-[#9E9687] tabular-nums truncate">
                      {interactions.toLocaleString('vi-VN')} tương tác
                    </span>

                    {primaryLink && (
                      <a
                        href={primaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSoftTap('card');
                          onChatLinkClick(character.id);
                        }}
                        className="inline-flex items-center gap-0.5 text-[#F3E5AB] hover:text-[#FFF4C4] underline underline-offset-4 decoration-[#D4AF37]/60 whitespace-nowrap shrink-0"
                      >
                        <span>Trò chuyện</span>
                        <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
