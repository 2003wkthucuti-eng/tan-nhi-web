import React, { createContext, useContext, useMemo, useState } from 'react';
import thuyMacBg from '../assets/images/thuy_mac_suong_1795718425975.jpg';
import coPhongTramBg from '../assets/images/co_phong_tram_1795718426202.jpg';
import demXanhSaoBg from '../assets/images/dem_xanh_sao_1795718426121.jpg';

export type SiteThemeId =
  | 'classic-gold'
  | 'gothic-lily'
  | 'velvet-vinyl'
  | 'ink-lily'
  | 'rose-nebula'
  | 'celestial-scroll'
  | 'thuy-mac'
  | 'co-phong-tram'
  | 'dem-xanh';

export type ThemeParticleKind = 'star' | 'petal' | 'note' | 'leaf' | 'celestial';

export interface SiteThemeDefinition {
  id: SiteThemeId;
  name: string;
  shortName: string;
  tagline: string;
  mascotLabel: string;
  bgImageUrl?: string;
  bgImageOpacity: number;
  bgColor: string;
  surfaceColor: string;
  accentColor: string;
  brightColor: string;
  textColor: string;
  mutedTextColor: string;
  buttonTextColor: string;
  swatchFrom: string;
  swatchTo: string;
  particleKind: ThemeParticleKind;
  particleColors: [string, string];
  fireworkPalette: string[];
  fogPrimary: string;
  fogSecondary: string;
  waxOuter: [string, string, string, string];
  waxInner: [string, string, string];
}

export const SITE_THEMES: SiteThemeDefinition[] = [
  {
    id: 'classic-gold',
    name: 'Đêm Vàng Gold',
    shortName: 'Vàng Gold',
    tagline: 'Chốn nhỏ bình yên giữa màn đêm',
    mascotLabel: 'Mèo đen mắt vàng cổ điển',
    bgImageOpacity: 0,
    bgColor: '#0B0B0F',
    surfaceColor: '#121218',
    accentColor: '#D4AF37',
    brightColor: '#F3E5AB',
    textColor: '#F5EFE0',
    mutedTextColor: '#C4BCB0',
    buttonTextColor: '#0B0B0F',
    swatchFrom: '#D4AF37',
    swatchTo: '#F3E5AB',
    particleKind: 'star',
    particleColors: ['#F3E5AB', '#D4AF37'],
    fireworkPalette: ['#FFF7D6', '#F3E5AB', '#D4AF37', '#E6C25A', '#FFE48F'],
    fogPrimary: 'rgba(212, 175, 55, 0.11)',
    fogSecondary: 'rgba(243, 229, 171, 0.085)',
    waxOuter: ['#FFF3C4', '#E4BE52', '#B68A20', '#7C5A0F'],
    waxInner: ['#C99E2C', '#9A7216', '#6E4E0A'],
  },
  {
    id: 'gothic-lily',
    name: 'Gothic Lily & Ribbon',
    shortName: 'Gothic Lily',
    tagline: 'Hoa loa kèn tro & nơ ren dưới đêm tối',
    mascotLabel: 'Mèo đen thắt nơ ren hồng tro',
    bgImageUrl: '/assets/aistudio/ce8cc0f16705d57fc02e4b7fb4f4b8f1__1__d5041ddd.jpg',
    bgImageOpacity: 0.24,
    bgColor: '#08070B',
    surfaceColor: '#120F16',
    accentColor: '#D8A7B1',
    brightColor: '#F6EAEF',
    textColor: '#F7EFF2',
    mutedTextColor: '#C8BAC0',
    buttonTextColor: '#160B10',
    swatchFrom: '#B77D8B',
    swatchTo: '#F6EAEF',
    particleKind: 'petal',
    particleColors: ['#F6EAEF', '#D8A7B1'],
    fireworkPalette: ['#FFF4F7', '#F6EAEF', '#D8A7B1', '#C88D9B', '#E9CED6'],
    fogPrimary: 'rgba(216, 167, 177, 0.12)',
    fogSecondary: 'rgba(246, 234, 239, 0.075)',
    waxOuter: ['#F9ECF0', '#DFB1BC', '#AA7481', '#693F4A'],
    waxInner: ['#C48B98', '#96616E', '#5D3540'],
  },
  {
    id: 'velvet-vinyl',
    name: 'Velvet & Vinyl',
    shortName: 'Velvet Vinyl',
    tagline: 'Nhung đỏ đô, đĩa than & giai điệu cổ điển',
    mascotLabel: 'Mèo vintage đeo tai nghe đỏ đô',
    bgImageUrl: '/assets/aistudio/6a56e08276857d550606dffb5a54f635_f64444bd.jpg',
    bgImageOpacity: 0.22,
    bgColor: '#14060A',
    surfaceColor: '#1E0B10',
    accentColor: '#E2B89B',
    brightColor: '#F7EAD9',
    textColor: '#FAF1E6',
    mutedTextColor: '#D2BFB8',
    buttonTextColor: '#24080E',
    swatchFrom: '#8E2034',
    swatchTo: '#F7EAD9',
    particleKind: 'note',
    particleColors: ['#F7EAD9', '#D99B9E'],
    fireworkPalette: ['#FFF6EC', '#F7EAD9', '#E2B89B', '#C95A6B', '#F0D0BA'],
    fogPrimary: 'rgba(176, 44, 66, 0.16)',
    fogSecondary: 'rgba(247, 234, 217, 0.08)',
    waxOuter: ['#FCEFE0', '#DFAA8B', '#9D3B46', '#56151E'],
    waxInner: ['#B44653', '#822330', '#4A0F18'],
  },
  {
    id: 'ink-lily',
    name: 'Ink Lily & Seal',
    shortName: 'Ink Lily',
    tagline: 'Thủy mặc đen mực, bách hợp rêu & ấn triện',
    mascotLabel: 'Mèo thủy mặc đeo tua rua ngọc rêu',
    bgImageUrl: '/assets/aistudio/634e3eca74285a337e3853a4866c7c08_d75aaa8c.jpg',
    bgImageOpacity: 0.25,
    bgColor: '#070908',
    surfaceColor: '#101411',
    accentColor: '#9CAF8E',
    brightColor: '#E7EFE0',
    textColor: '#EFF4EA',
    mutedTextColor: '#B8C2B0',
    buttonTextColor: '#0D130E',
    swatchFrom: '#6D8060',
    swatchTo: '#E7EFE0',
    particleKind: 'leaf',
    particleColors: ['#E7EFE0', '#9CAF8E'],
    fireworkPalette: ['#F3F7EE', '#E7EFE0', '#9CAF8E', '#7E9370', '#C6D4B9'],
    fogPrimary: 'rgba(156, 175, 142, 0.12)',
    fogSecondary: 'rgba(231, 239, 224, 0.075)',
    waxOuter: ['#EDF3E7', '#B2C3A4', '#728564', '#3F4B37'],
    waxInner: ['#8EA27F', '#617454', '#37442F'],
  },
  {
    id: 'rose-nebula',
    name: 'Rose Nebula',
    shortName: 'Rose Nebula',
    tagline: 'Tinh vân hồng dâu lấp lánh ánh sao mơ màng',
    mascotLabel: 'Mèo tinh vân mắt sao đội vương miện nhỏ',
    bgImageUrl: '/assets/aistudio/f316552d8a1b58fd7d916d457bf721de_06da47a4.jpg',
    bgImageOpacity: 0.22,
    bgColor: '#1E0B15',
    surfaceColor: '#2A111D',
    accentColor: '#F7A8C8',
    brightColor: '#FFF0F7',
    textColor: '#FFF5FA',
    mutedTextColor: '#E4C2D2',
    buttonTextColor: '#2B0C1B',
    swatchFrom: '#D95D93',
    swatchTo: '#FFF0F7',
    particleKind: 'star',
    particleColors: ['#FFF0F7', '#F7A8C8'],
    fireworkPalette: ['#FFFFFF', '#FFF0F7', '#F7A8C8', '#EE7FB0', '#FFD1E6'],
    fogPrimary: 'rgba(247, 146, 190, 0.16)',
    fogSecondary: 'rgba(255, 240, 247, 0.09)',
    waxOuter: ['#FFF4F9', '#F8B2D0', '#CA588A', '#7A244C'],
    waxInner: ['#E275A5', '#AF3D70', '#691C3E'],
  },
  {
    id: 'celestial-scroll',
    name: 'Celestial Scroll',
    shortName: 'Celestial',
    tagline: 'Cuộn tranh cổ phong vân ngọc & nhật nguyệt',
    mascotLabel: 'Mèo cổ phong mang vòng hào quang mây ngọc',
    bgImageUrl: '/assets/aistudio/d0055a583fe61a369f86a752f605e9b8_deb62e3c.jpg',
    bgImageOpacity: 0.24,
    bgColor: '#0E0B0E',
    surfaceColor: '#171316',
    accentColor: '#8FB9A8',
    brightColor: '#E8D29B',
    textColor: '#F5EFE2',
    mutedTextColor: '#C9C0B2',
    buttonTextColor: '#100E10',
    swatchFrom: '#8FB9A8',
    swatchTo: '#E8D29B',
    particleKind: 'celestial',
    particleColors: ['#E8D29B', '#8FB9A8'],
    fireworkPalette: ['#FFF6DE', '#E8D29B', '#8FB9A8', '#D06C62', '#B7D5C7'],
    fogPrimary: 'rgba(143, 185, 168, 0.13)',
    fogSecondary: 'rgba(232, 210, 155, 0.085)',
    waxOuter: ['#F8EBCB', '#D9BC7B', '#6E9A8A', '#3E4B47'],
    waxInner: ['#7DA796', '#A6554C', '#4D2523'],
  },
  {
    id: 'thuy-mac',
    name: 'Thủy Mặc Sương Khói',
    shortName: 'Thủy Mặc',
    tagline: 'Cuốn thư mực tàu & sương khói bảng lảng',
    mascotLabel: 'Mèo đen nét mực tĩnh lặng',
    bgImageUrl: thuyMacBg,
    bgImageOpacity: 0.2,
    bgColor: '#0A0B0D',
    surfaceColor: '#121417',
    accentColor: '#A9B4C0',
    brightColor: '#EEF2F5',
    textColor: '#F2F5F7',
    mutedTextColor: '#B8C0C8',
    buttonTextColor: '#0B0D10',
    swatchFrom: '#545F6B',
    swatchTo: '#EEF2F5',
    particleKind: 'leaf',
    particleColors: ['#EEF2F5', '#A9B4C0'],
    fireworkPalette: ['#FFFFFF', '#EEF2F5', '#BFC8D1', '#8E99A6', '#D7DFE6'],
    fogPrimary: 'rgba(176, 186, 198, 0.13)',
    fogSecondary: 'rgba(238, 242, 245, 0.08)',
    waxOuter: ['#F0F3F6', '#B9C3CD', '#6B7682', '#333A42'],
    waxInner: ['#85919E', '#57616C', '#2A3037'],
  },
  {
    id: 'co-phong-tram',
    name: 'Cổ Phong Trâm Ngọc',
    shortName: 'Trâm Ngọc',
    tagline: 'Cửa gỗ cổ, trâm ngọc bích & sắc đỏ trầm',
    mascotLabel: 'Mèo ngồi cạnh dây tua rua nhỏ',
    bgImageUrl: coPhongTramBg,
    bgImageOpacity: 0.2,
    bgColor: '#12080A',
    surfaceColor: '#1B0D10',
    accentColor: '#67C4A7',
    brightColor: '#EFE4CA',
    textColor: '#F8F1E3',
    mutedTextColor: '#CFBFC2',
    buttonTextColor: '#16080B',
    swatchFrom: '#9B2938',
    swatchTo: '#67C4A7',
    particleKind: 'celestial',
    particleColors: ['#EFE4CA', '#67C4A7'],
    fireworkPalette: ['#FFF6DF', '#67C4A7', '#C84B59', '#9ADCC6', '#EFE4CA'],
    fogPrimary: 'rgba(103, 196, 167, 0.11)',
    fogSecondary: 'rgba(168, 46, 62, 0.12)',
    waxOuter: ['#F5EAD2', '#7FCBB2', '#8F2936', '#461218'],
    waxInner: ['#A83846', '#448C74', '#2F1115'],
  },
  {
    id: 'dem-xanh',
    name: 'Đêm Xanh Ánh Mắt',
    shortName: 'Đêm Xanh',
    tagline: 'Bầu trời đêm khuya & ánh sao xanh băng',
    mascotLabel: 'Mèo xanh đêm mắt sao lấp lánh',
    bgImageUrl: demXanhSaoBg,
    bgImageOpacity: 0.2,
    bgColor: '#070C18',
    surfaceColor: '#0E1629',
    accentColor: '#7EC8F2',
    brightColor: '#E8F6FF',
    textColor: '#F0F8FF',
    mutedTextColor: '#B5C8E0',
    buttonTextColor: '#061022',
    swatchFrom: '#2F6FB3',
    swatchTo: '#E8F6FF',
    particleKind: 'star',
    particleColors: ['#E8F6FF', '#7EC8F2'],
    fireworkPalette: ['#FFFFFF', '#E8F6FF', '#7EC8F2', '#52A4DF', '#B8E3FF'],
    fogPrimary: 'rgba(126, 200, 242, 0.13)',
    fogSecondary: 'rgba(232, 246, 255, 0.08)',
    waxOuter: ['#F0F9FF', '#8CD2F7', '#357BB5', '#15385E'],
    waxInner: ['#53A3DC', '#265E96', '#102B4A'],
  },
];

const THEME_BY_ID = new Map<SiteThemeId, SiteThemeDefinition>(
  SITE_THEMES.map((theme) => [theme.id, theme])
);

export function getSiteThemeById(id: SiteThemeId): SiteThemeDefinition {
  return THEME_BY_ID.get(id) ?? SITE_THEMES[0];
}

interface SiteThemeContextValue {
  themeId: SiteThemeId;
  activeTheme: SiteThemeDefinition;
  setThemeId: (nextId: SiteThemeId) => void;
  themes: SiteThemeDefinition[];
}

const SiteThemeContext = createContext<SiteThemeContextValue>({
  themeId: 'classic-gold',
  activeTheme: SITE_THEMES[0],
  setThemeId: () => {},
  themes: SITE_THEMES,
});

export const SiteThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<SiteThemeId>('classic-gold');

  const value = useMemo<SiteThemeContextValue>(
    () => ({
      themeId,
      activeTheme: getSiteThemeById(themeId),
      setThemeId,
      themes: SITE_THEMES,
    }),
    [themeId]
  );

  return <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>;
};

export function useSiteTheme(): SiteThemeContextValue {
  return useContext(SiteThemeContext);
}
