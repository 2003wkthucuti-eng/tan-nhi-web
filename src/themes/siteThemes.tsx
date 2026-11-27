import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ThemeLiquidTransition,
  type ThemeTransitionOrigin,
  type ThemeTransitionState,
} from '../components/ThemeLiquidTransition';
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
  | 'dem-xanh'
  | 'bong-bong-sua'
  | 'collage-hai-be'
  | 'bien-dem-sua'
  | 'bao-cu-nhac'
  | 'pixel-doodles'
  | 'sabbath-crew'
  | 'night-ride'
  | 'ilay-riegrow'
  | 'joo-jaekyung'
  | 'zhenya'
  | 'caesar'
  | 'sanzu-haruchiyo'
  | 'yeo-taeju'
  | 'be-tho';

export type ThemeParticleKind =
  | 'star'
  | 'petal'
  | 'note'
  | 'leaf'
  | 'celestial'
  | 'bubble'
  | 'jellyfish'
  | 'pixel-heart'
  | 'lightning'
  | 'noir-star'
  | 'card-suit'
  | 'ribbon-bow'
  | 'spiral-star'
  | 'butterfly'
  | 'doodle-x'
  | 'rose-bow'
  | 'lace-star';

export type ThemeFormVariant =
  | 'default'
  | 'jellyfish-sea'
  | 'vintage-newspaper'
  | 'pixel-notebook'
  | 'street-crew'
  | 'night-ride'
  | 'lace-prism'
  | 'ring-magazine'
  | 'film-dossier'
  | 'ribbon-cameo'
  | 'manga-spiral'
  | 'doodle-receipt'
  | 'crimson-ribbon';

export interface SiteThemeDefinition {
  id: SiteThemeId;
  name: string;
  shortName: string;
  tagline: string;
  mascotLabel: string;
  isSpecialTheme?: boolean;
  formVariant?: ThemeFormVariant;
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
  {
    id: 'bong-bong-sua',
    name: 'Bong Bóng Sứa Lam Ngọc',
    shortName: 'Bong Bóng Sứa',
    tagline: 'Biển đêm lam ngọc & vòng bong bóng sứa mơ màng',
    mascotLabel: 'Mèo lơ lửng giữa bong bóng lam ngọc',
    bgImageUrl: '/assets/aistudio/3498711bbfcb52c939718538af244573_4e63f4fd.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#07111A',
    surfaceColor: '#0D1C2A',
    accentColor: '#8FD4EC',
    brightColor: '#EBF8FF',
    textColor: '#F2FAFF',
    mutedTextColor: '#B8D4E6',
    buttonTextColor: '#061522',
    swatchFrom: '#5DA9D6',
    swatchTo: '#EBF8FF',
    particleKind: 'bubble',
    particleColors: ['#EBF8FF', '#8FD4EC'],
    fireworkPalette: ['#FFFFFF', '#EBF8FF', '#8FD4EC', '#66B7DF', '#C7EDFC'],
    fogPrimary: 'rgba(143, 212, 236, 0.14)',
    fogSecondary: 'rgba(235, 248, 255, 0.085)',
    waxOuter: ['#F3FBFF', '#9BD8F0', '#4A96BF', '#1B4969'],
    waxInner: ['#6DBCE0', '#316F94', '#143852'],
  },
  {
    id: 'collage-hai-be',
    name: 'Collage Hai Bé & Dấu Sáp',
    shortName: 'Hai Bé',
    tagline: 'Khung Polaroid ký ức, sticker tai mèo & ánh sao đêm',
    mascotLabel: 'Mèo đeo sticker & tai mèo đáng yêu',
    bgImageUrl: '/assets/aistudio/78335d250b39f0b102946d1a018dd969_e5721dca.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#111115',
    surfaceColor: '#1A191F',
    accentColor: '#D6D9E2',
    brightColor: '#F6F0E4',
    textColor: '#F7F4EE',
    mutedTextColor: '#C9C6CE',
    buttonTextColor: '#15141A',
    swatchFrom: '#50535E',
    swatchTo: '#F6F0E4',
    particleKind: 'star',
    particleColors: ['#F6F0E4', '#DF95A5'],
    fireworkPalette: ['#FFFFFF', '#F6F0E4', '#D6D9E2', '#DF95A5', '#A9B0C2'],
    fogPrimary: 'rgba(214, 217, 226, 0.11)',
    fogSecondary: 'rgba(223, 149, 165, 0.09)',
    waxOuter: ['#FAF5EC', '#D6D9E2', '#7E8294', '#393B47'],
    waxInner: ['#B8909C', '#696C7E', '#2A2B36'],
  },
  {
    id: 'bien-dem-sua',
    name: 'Biển Đêm & Sứa',
    shortName: 'Biển Đêm',
    tagline: 'Thẻ kính biển đêm, bọt nước & sứa phát sáng',
    mascotLabel: 'Mèo biển đêm cùng sứa phát sáng & bong bóng',
    isSpecialTheme: true,
    formVariant: 'jellyfish-sea',
    bgImageUrl: '/assets/aistudio/831d5902ba49c748bd67cbf703dec664_0cdc2b76.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#060E1A',
    surfaceColor: '#0B182C',
    accentColor: '#6CB6FF',
    brightColor: '#E2F2FF',
    textColor: '#F0F7FF',
    mutedTextColor: '#B4CBE3',
    buttonTextColor: '#041020',
    swatchFrom: '#2B629D',
    swatchTo: '#B8E2FF',
    particleKind: 'jellyfish',
    particleColors: ['#E2F2FF', '#6CB6FF'],
    fireworkPalette: ['#FFFFFF', '#E2F2FF', '#6CB6FF', '#448EE4', '#A9DBFF'],
    fogPrimary: 'rgba(108, 182, 255, 0.14)',
    fogSecondary: 'rgba(226, 242, 255, 0.085)',
    waxOuter: ['#EDF7FF', '#8CC5FC', '#316BA6', '#102D50'],
    waxInner: ['#4C95DF', '#1F4D82', '#0B213E'],
  },
  {
    id: 'bao-cu-nhac',
    name: 'Báo Cũ & Nhạc Cổ Điển',
    shortName: 'Báo Cũ',
    tagline: 'Trang báo cổ điển, nâu kem & giai điệu xưa',
    mascotLabel: 'Mèo vintage kính tròn & nốt nhạc cổ điển',
    isSpecialTheme: true,
    formVariant: 'vintage-newspaper',
    bgImageUrl: '/assets/aistudio/2488991092aa63155a2893e4584dfb87_b04971ee.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#15110C',
    surfaceColor: '#1F1912',
    accentColor: '#CFA972',
    brightColor: '#F5E9D3',
    textColor: '#F8F1E3',
    mutedTextColor: '#CFC2B0',
    buttonTextColor: '#1A130C',
    swatchFrom: '#7D5C38',
    swatchTo: '#F5E9D3',
    particleKind: 'note',
    particleColors: ['#F5E9D3', '#CFA972'],
    fireworkPalette: ['#FFF8EB', '#F5E9D3', '#CFA972', '#B3844D', '#E8D2B0'],
    fogPrimary: 'rgba(207, 169, 114, 0.12)',
    fogSecondary: 'rgba(245, 233, 211, 0.075)',
    waxOuter: ['#FAF0DF', '#D9B683', '#8C6639', '#49331B'],
    waxInner: ['#B38851', '#7A562C', '#3B2712'],
  },
  {
    id: 'pixel-doodles',
    name: 'Pixel Doodles & Mèo Trắng Đen',
    shortName: 'Mèo Pixel',
    tagline: 'Sổ tay sticker bo tròn, trái tim pixel & cặp mèo ôm nhau',
    mascotLabel: 'Cặp mèo trắng đen ôm nhau cùng trái tim pixel',
    isSpecialTheme: true,
    formVariant: 'pixel-notebook',
    bgImageUrl: '/assets/aistudio/15f1ecdcad9a6a57a425d18dff732ecb_79402018.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#1B1318',
    surfaceColor: '#251A21',
    accentColor: '#F79AC0',
    brightColor: '#FFF2F6',
    textColor: '#FFF8FA',
    mutedTextColor: '#DEC5CF',
    buttonTextColor: '#24121B',
    swatchFrom: '#E57AA8',
    swatchTo: '#FFF2F6',
    particleKind: 'pixel-heart',
    particleColors: ['#FFF2F6', '#F79AC0'],
    fireworkPalette: ['#FFFFFF', '#FFF2F6', '#F79AC0', '#F077A8', '#FFD6E7'],
    fogPrimary: 'rgba(247, 154, 192, 0.14)',
    fogSecondary: 'rgba(255, 242, 246, 0.09)',
    waxOuter: ['#FFF6F9', '#F8B1CE', '#CE6692', '#6C2846'],
    waxInner: ['#E882AD', '#B34D79', '#5B1F3A'],
  },
  {
    id: 'sabbath-crew',
    name: 'Wind Breaker — Sabbath Crew',
    shortName: 'Sabbath Crew',
    tagline: 'Sticker đường phố, dây xích gai & tinh thần Sabbath Crew',
    mascotLabel: 'Mèo đường phố đội mũ len & dây xích bạc',
    isSpecialTheme: true,
    formVariant: 'street-crew',
    bgImageUrl: '/assets/aistudio/e29cb9e1d1419041e90c688169ccbc10_d90aeb35.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#0D0C0F',
    surfaceColor: '#17151A',
    accentColor: '#E54850',
    brightColor: '#F5E9C8',
    textColor: '#F6F3EC',
    mutedTextColor: '#CFC8BC',
    buttonTextColor: '#0D0C0F',
    swatchFrom: '#C8343C',
    swatchTo: '#F2C94C',
    particleKind: 'lightning',
    particleColors: ['#F2C94C', '#E54850'],
    fireworkPalette: ['#FFF6D6', '#F2C94C', '#E54850', '#F6F3EC', '#C8343C'],
    fogPrimary: 'rgba(229, 72, 80, 0.14)',
    fogSecondary: 'rgba(242, 201, 76, 0.085)',
    waxOuter: ['#FFF4D4', '#F2C94C', '#B82D35', '#4D1115'],
    waxInner: ['#D13B43', '#871E25', '#3A0B0F'],
  },
  {
    id: 'night-ride',
    name: 'Wind Breaker — Night Ride',
    shortName: 'Night Ride',
    tagline: 'Chuyến xe đêm dưới đèn đường vàng & thẻ cảm xúc phát sáng',
    mascotLabel: 'Mèo đêm khuya đeo kính râm cùng 3 ngôi sao sáng',
    isSpecialTheme: true,
    formVariant: 'night-ride',
    bgImageUrl: '/assets/aistudio/62cee9778e3fe59f56688a1bb47f75f5_7b336475.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#080A10',
    surfaceColor: '#10141E',
    accentColor: '#F0C975',
    brightColor: '#F7FAFF',
    textColor: '#F6F9FF',
    mutedTextColor: '#C2CCE0',
    buttonTextColor: '#080A10',
    swatchFrom: '#1C263B',
    swatchTo: '#F7FAFF',
    particleKind: 'star',
    particleColors: ['#F7FAFF', '#F0C975'],
    fireworkPalette: ['#FFFFFF', '#F7FAFF', '#F0C975', '#9EB5DA', '#FFE7AE'],
    fogPrimary: 'rgba(240, 201, 117, 0.12)',
    fogSecondary: 'rgba(247, 250, 255, 0.08)',
    waxOuter: ['#FFFFFF', '#F0C975', '#526282', '#171E2E'],
    waxInner: ['#7B8EAE', '#384663', '#131926'],
  },
  {
    id: 'ilay-riegrow',
    name: 'Ilay Riegrow',
    shortName: 'Ilay Riegrow',
    tagline: 'Viền ren trắng tinh tế, ánh sao lấp lánh & sắc nắng hoàng hôn',
    mascotLabel: 'Mèo bạch kim cài viền ren trắng nơ nhỏ & ánh sao lấp lánh',
    isSpecialTheme: true,
    formVariant: 'lace-prism',
    bgImageUrl: '/assets/aistudio/13f4a7af723732822c93a03d55394a00_5c216ed0.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#12101A',
    surfaceColor: '#1D1827',
    accentColor: '#F2C6B6',
    brightColor: '#FFFFFF',
    textColor: '#FAF8FC',
    mutedTextColor: '#D6CEDF',
    buttonTextColor: '#16111F',
    swatchFrom: '#D88D89',
    swatchTo: '#FFFFFF',
    particleKind: 'lace-star',
    particleColors: ['#FFFFFF', '#F2C6B6'],
    fireworkPalette: ['#FFFFFF', '#FFF8F4', '#F2C6B6', '#D9C7F2', '#FFE8D6'],
    fogPrimary: 'rgba(242, 198, 182, 0.14)',
    fogSecondary: 'rgba(255, 255, 255, 0.08)',
    waxOuter: ['#FFFFFF', '#F6DFD6', '#8E7180', '#2E2232'],
    waxInner: ['#B998A6', '#674D61', '#211828'],
  },
  {
    id: 'joo-jaekyung',
    name: 'Joo Jaekyung',
    shortName: 'Jaekyung',
    tagline: 'Tạp chí võ đài trắng đen, bộ bài tây, găng đấm bốc & đĩa vinyl',
    mascotLabel: 'Mèo đen dứt khoát bên găng đấm bốc, bài tây & đĩa vinyl',
    isSpecialTheme: true,
    formVariant: 'ring-magazine',
    bgImageUrl: '/assets/aistudio/2cdaef647b4f7e14cd8e60ae61815874_0b9e9ac6.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#0A0A0C',
    surfaceColor: '#131317',
    accentColor: '#D6D8DE',
    brightColor: '#FFFFFF',
    textColor: '#F7F8FA',
    mutedTextColor: '#C2C5CE',
    buttonTextColor: '#09090B',
    swatchFrom: '#17171B',
    swatchTo: '#FFFFFF',
    particleKind: 'card-suit',
    particleColors: ['#FFFFFF', '#B7BAC4'],
    fireworkPalette: ['#FFFFFF', '#E6E8EE', '#B7BAC4', '#8A8E99', '#F3F4F7'],
    fogPrimary: 'rgba(214, 216, 222, 0.1)',
    fogSecondary: 'rgba(255, 255, 255, 0.065)',
    waxOuter: ['#FFFFFF', '#D8DAE0', '#636670', '#18191D'],
    waxInner: ['#8A8D96', '#464850', '#141518'],
  },
  {
    id: 'zhenya',
    name: 'Zhenya',
    shortName: 'Zhenya',
    tagline: 'Cuộn phim noir cổ điển, quân Vua cờ vua & hoa hồng trắng',
    mascotLabel: 'Mèo bạch kim mắt ngọc lạnh bên cuộn phim, quân Vua & bướm đêm',
    isSpecialTheme: true,
    formVariant: 'film-dossier',
    bgImageUrl: '/assets/aistudio/6daa5fb43af7e8dee1ef31dffefce59b_68354afa.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#0C0C0E',
    surfaceColor: '#151518',
    accentColor: '#D8CEBE',
    brightColor: '#F5EFE4',
    textColor: '#F6F2EA',
    mutedTextColor: '#C6C1B8',
    buttonTextColor: '#0C0C0E',
    swatchFrom: '#222226',
    swatchTo: '#F0E6D6',
    particleKind: 'butterfly',
    particleColors: ['#F5EFE4', '#B9B4AA'],
    fireworkPalette: ['#FFFFFF', '#F5EFE4', '#D8CEBE', '#A8A39A', '#EAE2D2'],
    fogPrimary: 'rgba(216, 206, 190, 0.11)',
    fogSecondary: 'rgba(245, 239, 228, 0.07)',
    waxOuter: ['#FFFBF2', '#E2D8C7', '#6E6B64', '#1E1D1B'],
    waxInner: ['#9A9488', '#524F49', '#191817'],
  },
  {
    id: 'caesar',
    name: 'Caesar Alexandrovich',
    shortName: 'Caesar',
    tagline: 'Nơ ruy băng hồng mềm mại, dấu son & sắc kem dịu ngọt',
    mascotLabel: 'Mèo vàng kem mắt xanh băng cài nơ ruy băng hồng mềm mại',
    isSpecialTheme: true,
    formVariant: 'ribbon-cameo',
    bgImageUrl: '/assets/aistudio/246f22b9d9cc424344a2a57988627c1c_e97f8ffe.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#1D1717',
    surfaceColor: '#292021',
    accentColor: '#F2B5C4',
    brightColor: '#FFF5F4',
    textColor: '#FFF8F6',
    mutedTextColor: '#DFCECE',
    buttonTextColor: '#241417',
    swatchFrom: '#C88EA0',
    swatchTo: '#F7DCE2',
    particleKind: 'ribbon-bow',
    particleColors: ['#FFF5F4', '#F2B5C4'],
    fireworkPalette: ['#FFFFFF', '#FFF5F4', '#F2B5C4', '#E59BB0', '#FBE3E8'],
    fogPrimary: 'rgba(242, 181, 196, 0.14)',
    fogSecondary: 'rgba(255, 245, 244, 0.08)',
    waxOuter: ['#FFF7F8', '#F4C5D1', '#B37385', '#5C323E'],
    waxInner: ['#D291A3', '#8B5263', '#3E2029'],
  },
  {
    id: 'sanzu-haruchiyo',
    name: 'Sanzu Haruchiyo',
    shortName: 'Sanzu',
    tagline: 'Ngôi sao sọc xoáy góc cạnh, nét truyện tranh & khí chất nổi loạn',
    mascotLabel: 'Mèo xám đen vết sẹo khóe miệng cùng sao sọc xoáy & khuyên tai',
    isSpecialTheme: true,
    formVariant: 'manga-spiral',
    bgImageUrl: '/assets/aistudio/7e87800219a2f7ac74574185d4cd1ab6_adc03568.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#09090B',
    surfaceColor: '#131317',
    accentColor: '#D2D6E0',
    brightColor: '#FFFFFF',
    textColor: '#F7F8FA',
    mutedTextColor: '#C4C8D4',
    buttonTextColor: '#09090B',
    swatchFrom: '#1C1D22',
    swatchTo: '#FFFFFF',
    particleKind: 'spiral-star',
    particleColors: ['#FFFFFF', '#B2B7C4'],
    fireworkPalette: ['#FFFFFF', '#E6E9F0', '#C4C8D4', '#8F95A3', '#F5F6FA'],
    fogPrimary: 'rgba(210, 214, 224, 0.11)',
    fogSecondary: 'rgba(255, 255, 255, 0.065)',
    waxOuter: ['#FFFFFF', '#D5D8E0', '#5E626E', '#16171C'],
    waxInner: ['#8B909E', '#464954', '#131418'],
  },
  {
    id: 'yeo-taeju',
    name: 'Yeo Taeju',
    shortName: 'Yeo Taeju',
    tagline: 'Giấy nháp vẽ tay, bật lửa đen & nét doodle cắt dán cá tính',
    mascotLabel: 'Mèo mực đen bên bật lửa, trái tim mắt vẽ tay & nét gạch X',
    isSpecialTheme: true,
    formVariant: 'doodle-receipt',
    bgImageUrl: '/assets/aistudio/a78986ec97f9a87ca8a084179495dfba_e3b5447f.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#101113',
    surfaceColor: '#191A1D',
    accentColor: '#D6D0C2',
    brightColor: '#F6F3EB',
    textColor: '#F7F5EF',
    mutedTextColor: '#C9C4B8',
    buttonTextColor: '#101113',
    swatchFrom: '#26272B',
    swatchTo: '#EFECE3',
    particleKind: 'doodle-x',
    particleColors: ['#F6F3EB', '#C7C2B6'],
    fireworkPalette: ['#FFFFFF', '#F6F3EB', '#D6D0C2', '#9A968C', '#E6E1D5'],
    fogPrimary: 'rgba(214, 208, 194, 0.11)',
    fogSecondary: 'rgba(246, 243, 235, 0.07)',
    waxOuter: ['#FAF7F0', '#DFDBD0', '#63615B', '#18191C'],
    waxInner: ['#8E8A80', '#4A4945', '#151618'],
  },
  {
    id: 'be-tho',
    name: 'Bé Thỏ',
    shortName: 'Bé Thỏ',
    tagline: 'Nơ đỏ sắc nét, hoa hồng nhung & bí ẩn bàn bida số 7',
    mascotLabel: 'Mèo đen cài nơ đỏ sắc nét bên hoa hồng nhung & bi số 7',
    isSpecialTheme: true,
    formVariant: 'crimson-ribbon',
    bgImageUrl: '/assets/aistudio/f72145644a4114a84ab404c6991588b0_26bb3253.jpg',
    bgImageOpacity: 0.2,
    bgColor: '#13080B',
    surfaceColor: '#1E0D11',
    accentColor: '#E63946',
    brightColor: '#FFF0F2',
    textColor: '#FFF6F6',
    mutedTextColor: '#DFC4C8',
    buttonTextColor: '#1A070B',
    swatchFrom: '#A81826',
    swatchTo: '#FF7582',
    particleKind: 'rose-bow',
    particleColors: ['#FFF0F2', '#E63946'],
    fireworkPalette: ['#FFFFFF', '#FFF0F2', '#FF6B78', '#E63946', '#B81D2B'],
    fogPrimary: 'rgba(230, 57, 70, 0.16)',
    fogSecondary: 'rgba(255, 240, 242, 0.075)',
    waxOuter: ['#FFF2F3', '#F06A76', '#A61725', '#42070D'],
    waxInner: ['#CC2434', '#7D0F1B', '#2E0409'],
  },
];

export const SPECIAL_SITE_THEME_IDS: readonly SiteThemeId[] = [
  'bien-dem-sua',
  'bao-cu-nhac',
  'pixel-doodles',
  'sabbath-crew',
  'night-ride',
  'ilay-riegrow',
  'joo-jaekyung',
  'zhenya',
  'caesar',
  'sanzu-haruchiyo',
  'yeo-taeju',
  'be-tho',
];

export function isSpecialSiteTheme(id: SiteThemeId): boolean {
  return SPECIAL_SITE_THEME_IDS.includes(id);
}

const THEME_BY_ID = new Map<SiteThemeId, SiteThemeDefinition>(
  SITE_THEMES.map((theme) => [theme.id, theme])
);

export function getSiteThemeById(id: SiteThemeId): SiteThemeDefinition {
  return THEME_BY_ID.get(id) ?? SITE_THEMES[0];
}

export function getThemeOriginFromEvent(
  event?: React.MouseEvent<HTMLElement> | null
): ThemeTransitionOrigin {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0 };
  }
  const rect = event?.currentTarget?.getBoundingClientRect?.();
  if (rect && rect.width > 0 && rect.height > 0) {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }
  if (event && Number.isFinite(event.clientX) && Number.isFinite(event.clientY) && (event.clientX !== 0 || event.clientY !== 0)) {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

interface SiteThemeContextValue {
  themeId: SiteThemeId;
  activeTheme: SiteThemeDefinition;
  setThemeId: (nextId: SiteThemeId, origin?: ThemeTransitionOrigin) => void;
  themes: SiteThemeDefinition[];
}

const SiteThemeContext = createContext<SiteThemeContextValue>({
  themeId: 'classic-gold',
  activeTheme: SITE_THEMES[0],
  setThemeId: () => {},
  themes: SITE_THEMES,
});

export const SiteThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<SiteThemeId>('classic-gold');
  const [liquidTransition, setLiquidTransition] = useState<ThemeTransitionState | null>(null);
  const transitionSeqRef = useRef(0);
  const activeTheme = useMemo(() => getSiteThemeById(themeId), [themeId]);

  const setThemeId = useCallback(
    (nextId: SiteThemeId, origin?: ThemeTransitionOrigin) => {
      if (nextId !== themeId) {
        const nextTheme = getSiteThemeById(nextId);
        const fallbackCenter: ThemeTransitionOrigin =
          typeof window !== 'undefined'
            ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
            : { x: 0, y: 0 };
        const resolvedOrigin =
          origin && Number.isFinite(origin.x) && Number.isFinite(origin.y)
            ? origin
            : fallbackCenter;

        transitionSeqRef.current += 1;
        setLiquidTransition({
          key: transitionSeqRef.current,
          theme: nextTheme,
          origin: resolvedOrigin,
        });
      }
      setThemeIdState(nextId);
    },
    [themeId]
  );

  const handleTransitionComplete = useCallback((completedKey: number) => {
    setLiquidTransition((prev) => (prev && prev.key === completedKey ? null : prev));
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-site-theme', themeId);
    root.style.backgroundColor = activeTheme.bgColor;
    root.style.color = activeTheme.textColor;
  }, [themeId, activeTheme.bgColor, activeTheme.textColor]);

  const value = useMemo<SiteThemeContextValue>(
    () => ({
      themeId,
      activeTheme,
      setThemeId,
      themes: SITE_THEMES,
    }),
    [themeId, activeTheme, setThemeId]
  );

  return (
    <SiteThemeContext.Provider value={value}>
      {children}
      <ThemeLiquidTransition
        transition={liquidTransition}
        onComplete={handleTransitionComplete}
      />
    </SiteThemeContext.Provider>
  );
};

export function useSiteTheme(): SiteThemeContextValue {
  return useContext(SiteThemeContext);
}
