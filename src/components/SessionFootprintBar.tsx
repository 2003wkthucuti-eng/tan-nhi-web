import React from 'react';
import { Award, Compass, Palette, Users } from 'lucide-react';
import { useSiteTheme } from '../themes/siteThemes';

export interface SessionFootprintStats {
  viewedCharactersCount: number;
  totalCharactersCount: number;
  triedThemesCount: number;
  totalThemesCount: number;
  unlockedFramesCount: number;
  totalFramesCount: number;
}

interface SessionFootprintBarProps extends SessionFootprintStats {
  variant?: 'drawer' | 'card';
  className?: string;
}

export const SessionFootprintBar: React.FC<SessionFootprintBarProps> = ({
  viewedCharactersCount,
  totalCharactersCount,
  triedThemesCount,
  totalThemesCount,
  unlockedFramesCount,
  totalFramesCount,
  variant = 'drawer',
  className = '',
}) => {
  const { activeTheme } = useSiteTheme();

  const charPct =
    totalCharactersCount > 0 ? Math.min(100, Math.round((viewedCharactersCount / totalCharactersCount) * 100)) : 0;
  const themePct =
    totalThemesCount > 0 ? Math.min(100, Math.round((triedThemesCount / totalThemesCount) * 100)) : 0;
  const framePct =
    totalFramesCount > 0 ? Math.min(100, Math.round((unlockedFramesCount / totalFramesCount) * 100)) : 0;

  const overallPct = Math.round((charPct + themePct + framePct) / 3);

  const items = [
    {
      id: 'chars',
      label: 'Nhân vật',
      value: `${viewedCharactersCount}/${totalCharactersCount}`,
      pct: charPct,
      icon: Users,
    },
    {
      id: 'themes',
      label: 'Theme',
      value: `${triedThemesCount}/${totalThemesCount}`,
      pct: themePct,
      icon: Palette,
    },
    {
      id: 'frames',
      label: 'Khung ảnh',
      value: `${unlockedFramesCount}/${totalFramesCount}`,
      pct: framePct,
      icon: Award,
    },
  ];

  const isCard = variant === 'card';

  return (
    <section
      aria-label="Nhật Ký Dấu Chân trong phiên"
      className={`${
        isCard
          ? 'rounded-xl bg-[#0B0B0F]/75 border border-[#D4AF37]/30 p-3'
          : 'rounded-2xl bg-[#0B0B0F]/75 border border-[#D4AF37]/30 p-3'
      } space-y-2.5 min-w-0 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-[#D4AF37] truncate">
          <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Nhật Ký Dấu Chân</span>
        </span>
        <span className="text-[11px] font-semibold text-[#F3E5AB] tabular-nums shrink-0">
          {overallPct}%
        </span>
      </div>

      {/* Thanh tiến trình tổng gọn nhẹ */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={overallPct}
        aria-label="Tiến trình khám phá trong phiên"
        className="h-1.5 w-full rounded-full bg-[#191622] border border-[#D4AF37]/20 overflow-hidden"
      >
        <div
          style={{
            width: `${Math.max(overallPct, 4)}%`,
            background: `linear-gradient(90deg, ${activeTheme.swatchFrom}, ${activeTheme.brightColor})`,
          }}
          className="h-full rounded-full transition-all duration-300 ease-out"
        />
      </div>

      {/* 3 chỉ số theo dõi trong phiên */}
      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="rounded-lg bg-[#121218]/90 border border-[#D4AF37]/20 px-2 py-1.5 min-w-0"
            >
              <div className="flex items-center gap-1 text-[10px] text-[#B8B0A0] min-w-0">
                <Icon className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </div>
              <p className="mt-0.5 text-[11px] sm:text-xs font-semibold text-[#F3E5AB] tabular-nums">
                {item.value}
              </p>
              <div className="mt-1 h-1 w-full rounded-full bg-[#0B0B0F] overflow-hidden">
                <div
                  style={{
                    width: `${item.pct > 0 ? Math.max(item.pct, 6) : 0}%`,
                    backgroundColor: activeTheme.accentColor,
                  }}
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
