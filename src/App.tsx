/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Music, Pause, Play, Search, SkipForward, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { BlackCatMascot } from './components/BlackCatMascot';
import { CharacterDetailTarotModal } from './components/CharacterDetailTarotModal';
import { DestinyTarotModal } from './components/DestinyTarotModal';
import { GoldenSparkleTrail } from './components/GoldenSparkleTrail';
import { GoldenStardust } from './components/GoldenStardust';
import { HolographicTiltCard } from './components/HolographicTiltCard';
import { IntroSealDoors, type IntroPhase } from './components/IntroSealDoors';
import { MysticalFogOverlay } from './components/MysticalFogOverlay';
import { playCatMeowChime, playDoorChime, playSoftTap } from './utils/soundEffects';

export type GenreTag = string;

export interface CharacterItem {
  id: string;
  name: string;
  avatar: string;
  description: string;
  tags: GenreTag[];
  dokiLink?: string;
  ggaiLink?: string;
}

/**
 * DANH SÁCH NHÂN VẬT AI CHATBOT (Dễ dàng thêm / sửa / xóa trực tiếp tại đây)
 * - Để thêm nhân vật mới, chỉ cần thêm 1 object vào mảng CHARACTERS bên dưới.
 * - Nếu nhân vật chỉ có 1 trong 2 link (DokiChat hoặc GGAI), để trống '' hoặc bỏ qua trường còn lại.
 */
const CHARACTERS: CharacterItem[] = [
  {
    id: 'te-ngac',
    name: 'Tề Ngạc',
    avatar: 'https://files.catbox.moe/oz9pkx.jpg',
    description: '“Tôi chưa từng yêu em.”',
    tags: ['Boygirl', 'Lạnh Lùng', 'Thống Trị', 'Mafia'],
    dokiLink: 'https://www.dokichat.club/vi/role/6f866b44-70ea-4103-b2a0-df4d2a59ebec?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'dong-hoang',
    name: 'Đông Hoàng',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/0IQE0ulX.jpg',
    description: '“Anh xin lỗi em, là anh không mang lại cho em được hạnh phúc.”',
    tags: ['Boygirl', 'Dịu dàng', 'Chung Thủy', 'Chủ Tịch'],
    dokiLink: 'https://www.dokichat.club/vi/role/16cbe7e1-6f2e-43d6-ae86-1f4f9c4f2828?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'han-duy',
    name: 'Hấn Duy',
    avatar: 'https://files.catbox.moe/8u0bbd.jpg',
    description: '“Anh xin em đừng bỏ anh.”',
    tags: ['Boygirl', 'Tâm lý yếu', 'Ngược nam', 'Mong manh'],
    dokiLink: 'https://www.dokichat.club/vi/role/941f74bf-4ee3-4efd-9bbb-da69c964c4eb?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221TZRWp_Zbak0PhIOZrX4XHvL_cPcZX3i3%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'han-trach',
    name: 'Hàn Trạch',
    avatar: 'https://files.catbox.moe/zyvlrw.jpg',
    description: '“Liệu cô ấy có trách tôi không? Vì lúc đó tôi đã tuyệt tình đến mức ấy.”',
    tags: ['Boygirl', 'Trùng Sinh', 'Gương vỡ lại lành', 'Ngược'],
    dokiLink: 'https://www.dokichat.club/vi/role/c06d8fe2-f490-4300-8860-fa591f8dfbee?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221aKwwQk174RkiD5JqVrlnPlO8wC7r0Guc%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'can-dat',
    name: 'Cẩn Dật',
    avatar: 'https://files.catbox.moe/urmgnj.jpg',
    description: 'Cả hai bị cắm sừng cùng một lúc.',
    tags: ['Boygirl', 'Đánh Ghen', 'Hài Hước', 'Trả Thù'],
    dokiLink: 'https://www.dokichat.club/vi/role/dadc3f65-73c3-46c6-8390-b3e9b03feb82?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221kabCUOVNKEGHMCAklZVZQM1rbVBHIdcW%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'khinh-hoang',
    name: 'Khinh Hoàng',
    avatar: 'https://files.catbox.moe/bmiu4f.jpg',
    description: 'Nhắm mắt giết chết hàng nghìn người nhưng lại mở mắt để nhìn em lần cuối.',
    tags: ['Boygirl', 'Điệp Viên × Sát Nhân', 'Ngược'],
    dokiLink: 'https://www.dokichat.club/vi/role/d824156d-a383-4f03-8d9a-27969c9fd5e2?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%2219-4XYQPLCM5GISIbtpbaVFwythrU9Fjj%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'chu-sat',
    name: 'Chu Sát',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/2ApziP5r.png',
    description: '“Em là lý do tôi không mất kiểm soát, và cũng là lý do duy nhất khiến tôi muốn được sống”',
    tags: ['Boygirl', 'Tâm thần', 'Yếu đuối', 'Cún con', 'Thời đại 5.0'],
    dokiLink: 'https://www.dokichat.club/vi/role/e578f062-0e3b-4eb2-9f63-de9da22c14c9?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221zhKTL1eSQBiM0vMzus2ouYh6699lb0uQ%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'chu-canh-duong',
    name: 'Chu Cảnh Dương — 周景阳',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/AjjspPPR.jpg',
    description:
      '“Em ôm anh một cái đi mà, con mẹ nó vợ ơi, tự nhiên thấy thiếu hơi em làm anh khó chịu chết đi được.”',
    tags: ['Boygirl', 'Boylove', 'Nghiện vợ', 'Hài hước', 'Mít ướt'],
    dokiLink: 'https://www.dokichat.club/vi/role/2a94cff1-f7c3-4836-93a4-50ca6cfdbdc9?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'chu-dich-an',
    name: 'Chu Dịch An — 周亦安',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/1aOpJkpX3.jpg',
    description: '“Đừng có chạy lung tung, anh bận vô địch rồi, không rảnh đi tìm em đâu.”',
    tags: [
      'Boygirl',
      'Game thủ',
      'Idol Esport',
      'Ngọt',
      'Hài hước',
      'Cưng chiều',
      'Dễ ghen',
      'Yêu nhiều khó tính',
    ],
    dokiLink: 'https://www.dokichat.club/vi/role/7c933a41-fec8-4b79-8942-a950a84fed8a?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'co-tram',
    name: 'Cố Trầm',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/17mQcL2bF.png',
    description: '“Cái gì?! Kẻ bắt nạt tôi hằng ngày lại là người yêu qua mạng của tôi ư?”',
    tags: ['Boygirl', 'Bắt nạt', 'Thiếu gia', 'Mỏ hỗn'],
    dokiLink: 'https://www.dokichat.club/vi/role/4c9f86ed-29b8-46a4-9d2c-5edc4b28b24d?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221TZRWp_Zbak0PhIOZrX4XHvL_cPcZX3i3%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'co-da-lam',
    name: 'Cố Dạ Lam - 顾夜岚',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/1gY04hZ5t.jpg',
    description: '“Cậu xem tôi là trò tiêu khiển, còn tôi… lại xem cậu là cả thế giới.”',
    tags: ['Boygirl', 'Ngược', 'TXVT', 'Đơn phương'],
    dokiLink: 'https://www.dokichat.club/vi/role/908367c4-9f6d-4b54-b05d-17a77b9e7161?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221J1Gwo9FfL9xeg5x2OUxPc6faw6KcyajU%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'tham-da',
    name: 'Thẩm Dạ',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/pXhNo0Eq.jpg',
    description: '“Em thất vọng vì mong đợi, không phải vì tôi.”',
    tags: ['Boygirl', 'Lạnh lẽo', 'Trap boy', 'Không thật lòng', 'Học đường'],
    dokiLink: 'https://www.dokichat.club/vi/role/f7353eeb-c1e2-4934-b874-c420056e1f2d?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'tham-canh-tham',
    name: 'Thẩm Cảnh Thâm — 沈景深',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/kdwJ1oM5.jpg',
    description: '“Tao không phải không yêu em, tao chỉ chọn sai cách yêu.”',
    tags: ['Boygirl', 'Thay lòng', 'TXVT', 'Người thứ 3', 'Ngược'],
    dokiLink: 'https://www.dokichat.club/vi/role/66120485-89a3-48b4-88e8-6ca66e718e56?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221fzioM2wQHfu-8qyG5pXgHw5DKWjvTokE%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'tham-hoai-can',
    name: 'Thẩm Hoài Cẩn — 沈怀瑾',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/1eybTfkrq.jpg',
    description: '“Anh có thể không biết cách yêu em, nhưng lại quá quen với việc em luôn ở bên cạnh.”',
    tags: ['Boygirl', 'Gia trưởng', 'Chiếm hữu', 'Cưới Trước Yêu Sau', 'Ngược'],
    dokiLink: 'https://www.dokichat.club/vi/role/01a1c1e5-78ec-745c-afdd-c49b1fae1712?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221XqB3IZH-hgDEPhJTz0vOuPrhJS8Eymcr%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D',
  },
  {
    id: 'mac-bac',
    name: 'Mạc Bắc',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/11v2k09lL.png',
    description: '“Ở cạnh tao quen rồi, giờ làm bộ khách sáo nhìn ngứa mắt ghê.”',
    tags: ['BG', 'Bạn thân', 'Ghen', 'TXVT', 'Mỏ hỗn'],
    dokiLink: 'https://www.dokichat.club/vi/role/588f9690-98ae-443d-b204-580e977bf3e5?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'tan-tram',
    name: 'Tần Trầm',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/nWb2AW97.png',
    description: '“Anh ở đây rồi, ngoan nào.”',
    tags: ['BG', 'Côn đồ', 'Thái tử gia Bắc Kinh', 'Ngọt Sủng', 'Ngốc bạch ngọt'],
    dokiLink: 'https://www.dokichat.club/vi/role/6c9f786d-37ff-40ea-9ca0-4888fd70b330?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221CEQDIWbpQIzFZ9NTcHitdXa_BxheMjWs%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'tan-hao-nhien',
    name: 'Tần Hạo Nhiên — 秦浩然',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/4LbBxCu3.png',
    description: '“Mày cứ làm bạn với tao đi… để xem tao nhịn được đến bao giờ.”',
    tags: ['BG', 'TXVT', 'Trên tình bạn dưới tình yêu', 'Bạn thân', 'Cưng Chiều', 'SizeGap', 'Ngọt'],
    dokiLink: 'https://www.dokichat.club/vi/role/019feda1-2d09-7e02-b542-2c060383f400?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'tram-uyen',
    name: 'Trầm Uyên',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/sVMN9OOv.png',
    description: '“Em đừng có suy nghĩ linh tinh, em chẳng hiểu cái mẹ gì đâu.”',
    tags: ['BG', 'BL', 'Ngược', 'User Ngốc', 'Ngoại tình'],
    dokiLink: 'https://www.dokichat.club/vi/role/c30f1ea7-bc60-4d1d-96d3-983564a7d652?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221JoALLn3EJRpnS6yxeR22Uh43XgzX2waO%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'luc-tu-han',
    name: 'Lục Tư Hàn — 陆司寒',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/EOrjtmEx.png',
    description: '“Đừng để tao phải cướp mày khỏi tay anh ta.”',
    tags: ['BG', 'BL', 'Ham muốn cao', 'Tình tay ba', 'CEO', 'Bạn Thân'],
    dokiLink: 'https://www.dokichat.club/vi/role/098493ed-3613-47d7-93e6-8352ef869c52?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221YuKaV9F-F7gKKCpOD3XelZFhLLNHCMwD%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'luc-canh-vien',
    name: 'Lục Cảnh Viên — 陆景渊',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/Q2yPh12H.jpg',
    description: '“Nếu em sợ anh rồi… vậy anh nên buông tay, hay giữ em lại?”',
    tags: [
      'BG',
      'TXVT',
      'Hiểu lầm',
      'Ngược nhẹ',
      'Yêu thầm',
      'Cá biệt',
      'Sáng học bá',
      'Tối du côn',
    ],
    dokiLink: 'https://www.dokichat.club/vi/role/7220c670-bdec-4e5c-9fbb-e3c364dd9307?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221Svn6DDhK3iSnXYbEmfAesMii16dUckDX%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'tieu-truong-uyen',
    name: 'Tiêu Trường Uyên — 萧长渊',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/z7s8IPA6.jpg',
    description: '“Nếu phải hi sinh một người, ta sẽ chọn nàng.”',
    tags: ['BG', 'Lạnh nhạt', 'Khó chinh phục', 'Ngược', 'Cổ Trang'],
    dokiLink: 'https://www.dokichat.club/vi/role/491ac770-dfa3-47c8-baf4-09aad0098c15?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221oTrLh2nKaAFzNN4_ZeYBx-8OXl_U2sB8%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
];

export interface PlaylistTrack {
  id: string;
  title: string;
  url: string;
}

/**
 * DANH SÁCH NHẠC NỀN (PLAYLIST)
 * - Phát tự động liên tục và lặp vòng khi hết danh sách.
 * - Có thể thêm bài hát thứ 3 bằng cách bổ sung 1 object { id, title, url } vào mảng bên dưới.
 */
const PLAYLIST: PlaylistTrack[] = [
  {
    id: 'tham-co-tri',
    title: 'Thăm Cố Tri',
    url: 'https://files.catbox.moe/wkmnw5.mp3',
  },
  {
    id: 'du-tinh',
    title: 'Dự Tính',
    url: 'https://files.catbox.moe/uebzvi.mp3',
  },
];

const BASE_GENRES: GenreTag[] = [
  'Tất cả',
  'Tổng tài',
  'Fantasy',
  'Cổ trang',
  'Tâm lý',
  'Chữa lành',
];

const GENRE_FILTERS: GenreTag[] = (() => {
  const seen = new Set<string>();
  const result: GenreTag[] = [];
  for (const tag of [...BASE_GENRES, ...CHARACTERS.flatMap((char) => char.tags)]) {
    const key = tag.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(tag.trim());
    }
  }
  return result;
})();

const ITEMS_PER_PAGE = 12;

const HOST_CAT_GREETINGS: string[] = [
  'Hôm nay cậu mệt không? Chọn một người trò chuyện nhé~',
  'Chào mừng ghé thăm nhà nhỏ của Tần Nhi!',
  'Gặp được nhau giữa thế gian này đều là duyên phận...',
  'Đêm nay gió nhẹ lắm, vào sưởi ấm cùng tách trà nhé~',
  'Meow~ Chuyện vui hay buồn đều có thể kể ở đây nè.',
  'Mong rằng có một ánh mắt nơi đây khiến lòng cậu dịu lại.',
];

const TarotDivider: React.FC = () => (
  <div aria-hidden="true" className="my-5 sm:my-7 flex items-center justify-center gap-3 sm:gap-4">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-[#D4AF37]/75" />
    <div className="flex items-center gap-2.5 text-[#D4AF37]">
      <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/70" />
      <svg viewBox="0 0 64 24" fill="none" className="w-14 h-5 sm:w-16 sm:h-6">
        {/* Mặt trăng khuyết mảnh */}
        <path
          d="M23 5.5C19.2 6.1 16.5 9.2 16.5 12.8C16.5 16.7 19.6 19.8 23.5 19.8C25.1 19.8 26.6 19.2 27.8 18.3C25.4 18.4 23.2 16.6 22.8 14.1C22.4 11.4 23.8 8.8 26.1 7.6C25.2 6.4 24.1 5.7 23 5.5Z"
          stroke="#D4AF37"
          strokeWidth="1.25"
          fill="#D4AF37"
          fillOpacity="0.16"
        />
        {/* Ngôi sao 4 cánh lấp lánh ở trung tâm */}
        <path
          d="M36 4L37.8 10.2L44 12L37.8 13.8L36 20L34.2 13.8L28 12L34.2 10.2Z"
          fill="#F3E5AB"
          stroke="#D4AF37"
          strokeWidth="0.7"
        />
        <circle cx="48.5" cy="12" r="1.2" fill="#D4AF37" fillOpacity="0.8" />
      </svg>
      <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/70" />
    </div>
    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/35 to-[#D4AF37]/75" />
  </div>
);

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
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

function getPaginationItems(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: Array<number | 'ellipsis'> = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) items.push('ellipsis');
  for (let p = left; p <= right; p += 1) {
    items.push(p);
  }
  if (right < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
}

export default function App() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<'Tất cả' | GenreTag>('Tất cả');
  const [showAllTags, setShowAllTags] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [catGreetingOpen, setCatGreetingOpen] = useState(false);
  const [headerCatMessage, setHeaderCatMessage] = useState<string | null>(null);
  const [isDestinyModalOpen, setIsDestinyModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterItem | null>(null);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldPlayRef = useRef(false);
  const errorStreakRef = useRef(0);
  const headerCatTimerRef = useRef<number | null>(null);
  const introTimerRef = useRef<number | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const hasEntered = introPhase !== 'idle';
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    return () => {
      if (headerCatTimerRef.current) window.clearTimeout(headerCatTimerRef.current);
      if (introTimerRef.current) window.clearTimeout(introTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.volume = 0.65;
    if (shouldPlayRef.current) {
      audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            errorStreakRef.current = 0;
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
            shouldPlayRef.current = false;
          });
      }
    }
  }, [currentTrackIndex, currentTrack]);

  const handleEnterHouse = () => {
    if (introPhase !== 'idle') return;
    playDoorChime();
    setIntroPhase('opening');

    if (introTimerRef.current) {
      window.clearTimeout(introTimerRef.current);
    }
    introTimerRef.current = window.setTimeout(() => {
      setIntroPhase('entered');
    }, 1150);

    const audio = audioRef.current;
    if (audio && PLAYLIST.length > 0) {
      shouldPlayRef.current = true;
      if (audio.paused) {
        audio.volume = 0.65;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              errorStreakRef.current = 0;
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
              shouldPlayRef.current = false;
            });
        }
      }
    }
  };

  const handleTogglePlay = () => {
    playSoftTap('music');
    const audio = audioRef.current;
    if (!audio || PLAYLIST.length === 0) return;

    if (audio.paused) {
      shouldPlayRef.current = true;
      audio.play().catch(() => {
        setIsPlaying(false);
        shouldPlayRef.current = false;
      });
    } else {
      shouldPlayRef.current = false;
      audio.pause();
    }
  };

  const handleNextTrack = () => {
    playSoftTap('music');
    if (PLAYLIST.length === 0) return;
    shouldPlayRef.current = true;
    errorStreakRef.current = 0;

    if (PLAYLIST.length === 1 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
        shouldPlayRef.current = false;
      });
      return;
    }

    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handleTrackEnded = () => {
    if (PLAYLIST.length === 0) return;
    shouldPlayRef.current = true;

    if (PLAYLIST.length === 1 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
        shouldPlayRef.current = false;
      });
      return;
    }

    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handleTrackError = () => {
    if (PLAYLIST.length <= 1) {
      setIsPlaying(false);
      shouldPlayRef.current = false;
      return;
    }
    errorStreakRef.current += 1;
    if (errorStreakRef.current < PLAYLIST.length && shouldPlayRef.current) {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    } else {
      setIsPlaying(false);
      shouldPlayRef.current = false;
    }
  };

  const filteredCharacters = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);
    return CHARACTERS.filter((char) => {
      const matchesGenre =
        selectedGenre === 'Tất cả' ||
        char.tags.some((t) => t.trim().toLowerCase() === selectedGenre.toLowerCase());
      const matchesSearch =
        normalizedQuery === '' ||
        normalizeText(char.name).includes(normalizedQuery);
      return matchesGenre && matchesSearch;
    });
  }, [searchQuery, selectedGenre]);

  const totalPages = Math.max(1, Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCharacters = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredCharacters.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCharacters, safeCurrentPage]);

  const pageRangeStart =
    filteredCharacters.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const pageRangeEnd = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredCharacters.length
  );

  const handlePageChange = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(nextPage, totalPages));
    if (clamped === safeCurrentPage) return;
    playSoftTap('nav');
    setCurrentPage(clamped);
    const galleryEl = document.getElementById('bo-suu-tap');
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectGenreFromHeader = (genre: 'Tất cả' | GenreTag) => {
    playSoftTap('tap');
    setSelectedGenre(genre);
    setCurrentPage(1);
    const galleryEl = document.getElementById('bo-suu-tap');
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleHeaderCatClick = () => {
    playCatMeowChime();
    const candidates = HOST_CAT_GREETINGS.filter((msg) => msg !== headerCatMessage);
    const pool = candidates.length > 0 ? candidates : HOST_CAT_GREETINGS;
    const nextMsg = pool[Math.floor(Math.random() * pool.length)];
    setHeaderCatMessage(nextMsg);

    if (headerCatTimerRef.current) {
      window.clearTimeout(headerCatTimerRef.current);
    }
    headerCatTimerRef.current = window.setTimeout(() => {
      setHeaderCatMessage(null);
    }, 4500);
  };

  const handleOpenDestinyModal = () => {
    if (CHARACTERS.length === 0) return;
    playSoftTap('nav');
    setIsDestinyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5EFE0] relative selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB]">
      {/* Audio phát nhạc nền liên tục */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          preload="metadata"
          onEnded={handleTrackEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={handleTrackError}
        />
      )}
      {/* Màn hình Intro Con dấu sáp & Cánh cửa ánh sáng */}
      <IntroSealDoors phase={introPhase} onOpenDoor={handleEnterHouse} />

      {/* Vệt bụi sao vàng Gold khi chạm/di chuột trên màn hình */}
      <GoldenSparkleTrail />

      {/* Giao diện Trang chủ */}
      <div
        aria-hidden={!hasEntered}
        className={`relative min-h-screen flex flex-col transition-opacity duration-500 ${
          hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none h-screen overflow-hidden'
        }`}
      >
        {/* Lớp sương mù vàng Gold huyền ảo chuyển động chậm */}
        <MysticalFogOverlay />

        {/* Bụi vàng lấp lánh ở nền Trang chủ */}
        <GoldenStardust className="fixed inset-0 z-0 opacity-85" />

        {/* Top Bar 3 vùng rõ ràng */}
        <header className="sticky top-0 z-30 bg-[#0B0B0F]/90 backdrop-blur-md border-b border-[#D4AF37]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
            {/* Zone 1: Linh vật mèo đen tương tác + Brand Title */}
            <div className="relative flex items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleHeaderCatClick}
                aria-label="Chạm vào chú mèo đen để nhận lời chào"
                title="Meow~ Chạm vào mình đi!"
                className="relative p-0.5 rounded-xl hover:bg-[#D4AF37]/10 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <BlackCatMascot
                  size={36}
                  variant="badge"
                  className="shrink-0 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                />
              </button>

              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  playSoftTap('nav');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg py-1"
              >
                <span className="font-display text-lg sm:text-2xl font-semibold tracking-tight gold-shimmer-text">
                  Ngôi Nhà Nhỏ Của Tần Nhi
                </span>
              </a>

              <AnimatePresence>
                {headerCatMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    role="status"
                    className="absolute left-0 top-full mt-2.5 z-50 w-64 sm:w-72 rounded-xl bg-[#0B0B0F]/95 backdrop-blur-md border border-[#D4AF37]/75 px-3.5 py-2.5 text-xs leading-relaxed text-[#F3E5AB] shadow-[0_12px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,55,0.22)]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -top-1.5 left-4 w-3 h-3 rotate-45 bg-[#0B0B0F] border-l border-t border-[#D4AF37]/75"
                    />
                    <p className="relative z-10">{headerCatMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Zone 2: Nav links lọc nhanh thể loại */}
            <nav
              aria-label="Điều hướng thể loại"
              className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#B8B0A0]"
            >
              {(['Tất cả', 'Tổng tài', 'Fantasy', 'Cổ trang', 'Chữa lành'] as const).map(
                (item) => {
                  const isActive = selectedGenre === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSelectGenreFromHeader(item)}
                      className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                        isActive
                          ? 'text-[#F3E5AB] border-[#D4AF37]'
                          : 'text-[#B8B0A0] border-transparent hover:text-[#F3E5AB] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                }
              )}
            </nav>

            {/* Zone 3: 1 Primary Action */}
            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  playSoftTap('nav');
                  if (introTimerRef.current) {
                    window.clearTimeout(introTimerRef.current);
                  }
                  setIntroPhase('idle');
                }}
                className="min-h-[40px] px-4 py-2 rounded-lg border border-[#D4AF37]/45 bg-[#121218] text-xs sm:text-sm font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Màn chào
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung chính */}
        <main id="top" className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Phần giới thiệu ngắn đầu trang */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-[11px] sm:text-xs font-medium tracking-widest text-[#D4AF37] mb-1.5">
                  Bộ sưu tập nhân vật AI Chatbot
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-[40px] font-semibold text-[#F5EFE0] leading-[1.15] [text-wrap:balance]">
                  Những tâm hồn đang đợi bạn trò chuyện đêm nay
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#B8B0A0] leading-relaxed">
                  Chọn một nhân vật hợp tâm trạng để bước vào câu chuyện riêng tư trên DokiChat hoặc GGAI.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#B8B0A0] tabular-nums shrink-0">
                <span>
                  Tổng cộng <strong className="text-[#F3E5AB] font-semibold">{CHARACTERS.length}</strong> nhân vật
                </span>
                <span aria-hidden="true" className="text-[#D4AF37]/60">·</span>
                <span>
                  Đang hiển thị <strong className="text-[#F3E5AB] font-semibold">{filteredCharacters.length}</strong>
                </span>
              </div>
            </div>
          </section>

          {/* Đường kẻ phân cách Tarot mặt trăng khuyết & ngôi sao 4 cánh */}
          <TarotDivider />

          {/* Thanh tìm kiếm, Gặp gỡ định mệnh & Bộ lọc thể loại thu gọn */}
          <section
            id="bo-suu-tap"
            aria-label="Tìm kiếm và lọc nhân vật"
            className="scroll-mt-20 mb-5 sm:mb-7 flex flex-col gap-3"
          >
            {/* Hàng trên: Thanh tìm kiếm + Xem thêm Tag + Gặp gỡ định mệnh */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
              <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-sm">
                <Search
                  aria-hidden="true"
                  className="w-4 h-4 text-[#D4AF37]/80 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm theo tên nhân vật..."
                  aria-label="Tìm kiếm theo tên nhân vật"
                  className="w-full min-h-[40px] pl-9 pr-9 py-2 rounded-xl bg-[#121218] border border-[#D4AF37]/25 text-xs sm:text-sm text-[#F5EFE0] placeholder:text-[#8E877A] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/60 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      playSoftTap('tap');
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#B8B0A0] hover:text-[#F3E5AB] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('tap');
                    setShowAllTags((prev) => !prev);
                  }}
                  aria-expanded={showAllTags}
                  className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 sm:px-3.5 py-2 rounded-xl border text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    showAllTags || selectedGenre !== 'Tất cả'
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37]/65 text-[#F3E5AB]'
                      : 'bg-[#121218] border-[#D4AF37]/25 text-[#DCD4C6] hover:border-[#D4AF37]/60 hover:text-[#F3E5AB]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span>{showAllTags ? 'Thu gọn' : 'Xem thêm Tag'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-200 ${
                      showAllTags ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleOpenDestinyModal}
                  className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 sm:px-3.5 py-2 rounded-xl border border-[#D4AF37]/75 bg-gradient-to-r from-[#19150A] via-[#271F0A] to-[#19150A] text-xs font-medium text-[#F3E5AB] shadow-[0_0_16px_rgba(212,175,55,0.2)] hover:border-[#F3E5AB] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] active:scale-95 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB] shrink-0" aria-hidden="true" />
                  <span>Gặp gỡ định mệnh</span>
                </button>
              </div>
            </div>

            {/* Danh sách Tag: Mặc định 1 hàng ngang vuốt trượt mượt, bấm nút sẽ xổ gọn toàn bộ */}
            {!showAllTags ? (
              <div className="relative">
                <div
                  role="group"
                  aria-label="Lọc nhanh theo thể loại"
                  className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 pr-4"
                >
                  {GENRE_FILTERS.map((genre) => {
                    const isActive = selectedGenre === genre;
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          playSoftTap('tap');
                          setSelectedGenre(genre);
                          setCurrentPage(1);
                        }}
                        aria-pressed={isActive}
                        className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                          isActive
                            ? 'bg-[#D4AF37] text-[#0B0B0F] font-semibold shadow-[0_0_12px_rgba(212,175,55,0.28)]'
                            : 'bg-[#121218] border border-[#D4AF37]/25 text-[#DCD4C6] hover:border-[#D4AF37]/65 hover:text-[#F3E5AB]'
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                role="group"
                aria-label="Tất cả thể loại"
                className="p-3 rounded-xl bg-[#121218]/90 border border-[#D4AF37]/25 flex flex-wrap items-center gap-1.5"
              >
                {GENRE_FILTERS.map((genre) => {
                  const isActive = selectedGenre === genre;
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => {
                        playSoftTap('tap');
                        setSelectedGenre(genre);
                        setCurrentPage(1);
                        setShowAllTags(false);
                      }}
                      aria-pressed={isActive}
                      className={`min-h-[32px] px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                        isActive
                          ? 'bg-[#D4AF37] text-[#0B0B0F] font-semibold shadow-[0_0_12px_rgba(212,175,55,0.28)]'
                          : 'bg-[#0B0B0F] border border-[#D4AF37]/25 text-[#DCD4C6] hover:border-[#D4AF37]/65 hover:text-[#F3E5AB]'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Lưới hiển thị các thẻ nhân vật (2 cột trên điện thoại, 3-4 cột trên màn lớn) */}
          {filteredCharacters.length > 0 ? (
            <>
              <section
                aria-label="Danh sách nhân vật"
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6"
              >
                {paginatedCharacters.map((char, index) => {
                  const hasDoki = Boolean(char.dokiLink && char.dokiLink.trim() !== '');
                  const hasGgai = Boolean(char.ggaiLink && char.ggaiLink.trim() !== '');
                  const hasBothLinks = hasDoki && hasGgai;

                  const nameParts = char.name.split(/\s+[—-]\s+/);
                  const primaryName = nameParts[0];
                  const secondaryName = nameParts.length > 1 ? nameParts.slice(1).join(' · ') : '';

                  return (
                    <motion.article
                      key={`${char.id}-p${safeCurrentPage}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                      transition={{
                        duration: 0.45,
                        delay: hasEntered ? 0.08 + Math.min(index * 0.05, 0.35) : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <HolographicTiltCard
                        maxTilt={6.5}
                        onClick={() => {
                          playSoftTap('card');
                          setSelectedCharacter(char);
                        }}
                        className="shimmer-card-border group h-full bg-[#121218]/92 backdrop-blur-sm border border-[#D4AF37]/25 hover:border-[#D4AF37]/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-5 flex flex-col justify-between transition-colors duration-200 hover:shadow-[0_0_32px_-6px_rgba(212,175,55,0.32)] cursor-pointer"
                      >
                    <div>
                      {/* 1. Ảnh đại diện vuông bo góc tinh tế trên cùng */}
                      <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/35 group-hover:border-[#F3E5AB]/75 group-hover:shadow-[0_0_22px_rgba(212,175,55,0.28)] transition-all duration-200">
                        {!failedAvatars[char.id] && char.avatar.trim() !== '' ? (
                          <img
                            src={char.avatar}
                            alt={`Ảnh đại diện nhân vật ${char.name}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                            onLoad={(e) => {
                              if (e.currentTarget.naturalWidth === 0) {
                                setFailedAvatars((prev) => ({ ...prev, [char.id]: true }));
                              }
                            }}
                            onError={() => {
                              setFailedAvatars((prev) => ({ ...prev, [char.id]: true }));
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-b from-[#16161F] to-[#0B0B0F] p-3 text-center">
                            <BlackCatMascot size={50} variant="companion" />
                            <span className="font-display text-sm sm:text-lg text-[#F3E5AB]">
                              {primaryName}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-[#B8B0A0]">
                              Chưa tải được ảnh
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 2. Tên nhân vật nổi bật, thông tin phụ & câu thoại ngắn đặt trong ngoặc kép */}
                      <div className="mt-2.5 sm:mt-3.5">
                        <h3 className="font-display text-[17px] sm:text-xl lg:text-2xl font-semibold text-[#F3E5AB] tracking-tight leading-snug">
                          {primaryName}
                        </h3>
                        {secondaryName && (
                          <p className="text-[11px] sm:text-xs font-medium text-[#D4AF37]/85 mt-0.5 truncate">
                            {secondaryName}
                          </p>
                        )}
                        <p className="mt-1.5 text-[11px] sm:text-[13px] text-[#C7C0B2] italic leading-snug sm:leading-relaxed line-clamp-3">
                          {ensureQuoted(char.description)}
                        </p>
                      </div>

                      {/* 3. Các tag thể loại xếp thành các viên nhỏ (badge) nối tiếp nhau ở phần giữa thẻ */}
                      {char.tags.length > 0 && (
                        <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1 sm:gap-1.5">
                          {char.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md bg-[#0B0B0F]/90 border border-[#D4AF37]/30 text-[10px] sm:text-[11px] font-medium text-[#E6CD82] leading-tight"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 4. Hai nút bấm liên kết nằm gọn gàng ở đáy thẻ */}
                    {(hasDoki || hasGgai) && (
                      <div
                        className={`mt-3 sm:mt-4 pt-2.5 sm:pt-3.5 border-t border-[#D4AF37]/15 ${
                          hasBothLinks ? 'grid grid-cols-2 gap-1.5 sm:gap-2.5' : 'flex'
                        }`}
                      >
                        {hasDoki && (
                          <a
                            href={char.dokiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSoftTap('card');
                            }}
                            className={`shimmer-gold-btn inline-flex items-center justify-center gap-1 min-h-[36px] sm:min-h-[40px] px-1.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-[11px] sm:text-xs font-semibold whitespace-nowrap hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] transition-all duration-150 ${
                              !hasBothLinks ? 'w-full' : ''
                            }`}
                          >
                            {hasBothLinks ? (
                              <>
                                <span className="sm:hidden">DokiChat</span>
                                <span className="hidden sm:inline">Link DokiChat</span>
                              </>
                            ) : (
                              <span>Link DokiChat</span>
                            )}
                            <ArrowUpRight
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
                                hasBothLinks ? 'hidden sm:inline-block' : ''
                              }`}
                              aria-hidden="true"
                            />
                          </a>
                        )}

                        {hasGgai && (
                          <a
                            href={char.ggaiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSoftTap('card');
                            }}
                            className={`inline-flex items-center justify-center gap-1 min-h-[36px] sm:min-h-[40px] px-1.5 sm:px-3 py-1.5 rounded-lg bg-[#0B0B0F] border border-[#D4AF37]/60 text-[#F3E5AB] text-[11px] sm:text-xs font-medium whitespace-nowrap hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-all duration-150 ${
                              !hasBothLinks ? 'w-full' : ''
                            }`}
                          >
                            {hasBothLinks ? (
                              <>
                                <span className="sm:hidden">GGAI</span>
                                <span className="hidden sm:inline">Link GGAI</span>
                              </>
                            ) : (
                              <span>Link GGAI</span>
                            )}
                            <ArrowUpRight
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
                                hasBothLinks ? 'hidden sm:inline-block' : ''
                              }`}
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                    )}
                      </HolographicTiltCard>
                    </motion.article>
                  );
                })}
              </section>

              {/* Thanh phân trang */}
              {totalPages > 1 && (
                <nav
                  aria-label="Phân trang danh sách nhân vật"
                  className="mt-8 sm:mt-10 flex flex-col items-center gap-3"
                >
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#121218]/92 border border-[#D4AF37]/25 shadow-[0_6px_24px_rgba(0,0,0,0.45)]">
                    <button
                      type="button"
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                      disabled={safeCurrentPage === 1}
                      aria-label="Trang trước"
                      className="inline-flex items-center justify-center min-w-[38px] min-h-[38px] sm:px-3 rounded-xl border border-transparent text-xs font-medium text-[#F3E5AB] hover:border-[#D4AF37]/45 hover:bg-[#D4AF37]/10 disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    >
                      <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="hidden sm:inline ml-1 whitespace-nowrap">Trang trước</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {getPaginationItems(safeCurrentPage, totalPages).map((item, idx) =>
                        item === 'ellipsis' ? (
                          <span
                            key={`ellipsis-${idx}`}
                            aria-hidden="true"
                            className="px-1.5 text-xs text-[#8E877A] select-none"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handlePageChange(item)}
                            aria-current={item === safeCurrentPage ? 'page' : undefined}
                            aria-label={`Trang ${item}`}
                            className={`min-w-[36px] min-h-[36px] px-2.5 rounded-xl text-xs sm:text-sm tabular-nums transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                              item === safeCurrentPage
                                ? 'bg-gradient-to-br from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] font-semibold shadow-[0_0_16px_rgba(212,175,55,0.32)]'
                                : 'text-[#DCD4C6] hover:text-[#F3E5AB] hover:bg-[#D4AF37]/12'
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePageChange(safeCurrentPage + 1)}
                      disabled={safeCurrentPage === totalPages}
                      aria-label="Trang sau"
                      className="inline-flex items-center justify-center min-w-[38px] min-h-[38px] sm:px-3 rounded-xl border border-transparent text-xs font-medium text-[#F3E5AB] hover:border-[#D4AF37]/45 hover:bg-[#D4AF37]/10 disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    >
                      <span className="hidden sm:inline mr-1 whitespace-nowrap">Trang sau</span>
                      <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </button>
                  </div>

                  <p className="text-xs text-[#B8B0A0] tabular-nums">
                    Trang <strong className="text-[#F3E5AB] font-medium">{safeCurrentPage}</strong> / {totalPages}
                    <span aria-hidden="true" className="mx-2 text-[#D4AF37]/60">·</span>
                    Hiển thị {pageRangeStart}–{pageRangeEnd} trên {filteredCharacters.length} nhân vật
                  </p>
                </nav>
              )}
            </>
          ) : (
            /* Trạng thái trống hoặc không tìm thấy nhân vật */
            <section className="py-16 px-6 rounded-2xl bg-[#121218] border border-[#D4AF37]/20 text-center flex flex-col items-center">
              <BlackCatMascot size={82} variant="hero" className="mb-4 opacity-90" />
              <h3 className="font-display text-2xl font-semibold text-[#F3E5AB]">
                {CHARACTERS.length === 0
                  ? 'Ngôi nhà nhỏ hiện chưa có nhân vật nào'
                  : 'Chưa tìm thấy nhân vật phù hợp'}
              </h3>
              <p className="mt-2 text-sm text-[#B8B0A0] max-w-md">
                {CHARACTERS.length === 0
                  ? 'Chú mèo nhỏ đang dọn sẵn chỗ ngồi ấm áp, chờ bạn thêm những nhân vật đầu tiên vào danh sách.'
                  : 'Chú mèo nhỏ đã lùng sục khắp phòng trà nhưng chưa thấy ai khớp với từ khóa hoặc thể loại bạn đang chọn.'}
              </p>
              {CHARACTERS.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('tap');
                    setSearchQuery('');
                    setSelectedGenre('Tất cả');
                    setCurrentPage(1);
                  }}
                  className="mt-6 min-h-[42px] px-5 py-2 rounded-lg bg-[#D4AF37] text-[#0B0B0F] text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
                >
                  Hiển thị tất cả nhân vật
                </button>
              )}
            </section>
          )}
        </main>

        {/* Footer tối giản */}
        <footer className="relative z-10 border-t border-[#D4AF37]/15 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8E877A]">
            <p className="text-[#B8B0A0]">
              Ngôi Nhà Nhỏ Của Tần Nhi · Góc lưu trữ nhân vật AI Chatbot
            </p>
            <p>Chúc bạn có những cuộc trò chuyện thật êm đềm.</p>
          </div>
        </footer>
      </div>

      {/* Trình phát nhạc mini & Linh vật mèo đen ở góc dưới màn hình */}
      {hasEntered && currentTrack && (
        <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-30 flex flex-col items-end gap-2 max-w-[calc(100vw-1.5rem)]">
          <AnimatePresence>
            {catGreetingOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="max-w-[230px] rounded-xl bg-[#121218] border border-[#D4AF37]/45 px-3.5 py-2.5 text-xs text-[#F3E5AB] shadow-lg"
              >
                Meow~ Chào mừng bạn ghé thăm Ngôi Nhà Nhỏ Của Tần Nhi.
              </motion.div>
            )}
          </AnimatePresence>

          <aside
            aria-label="Trình phát nhạc nền"
            className="flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-[#121218]/95 backdrop-blur-md border border-[#D4AF37]/45 px-2.5 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(212,175,55,0.12)]"
          >
            {/* Mèo đen đồng hành */}
            <button
              type="button"
              onClick={() => {
                playSoftTap('music');
                setCatGreetingOpen((prev) => !prev);
              }}
              aria-label="Chú mèo đen đồng hành"
              title="Chú mèo đen đồng hành"
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0B0B0F] border border-[#D4AF37]/35 hover:border-[#F3E5AB] flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <BlackCatMascot size={34} variant="companion" />
            </button>

            {/* Thông tin bài hát hiện tại */}
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#D4AF37] tabular-nums">
                <Music className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">
                  Bài {currentTrackIndex + 1}/{PLAYLIST.length}
                </span>
              </div>
              <p
                title={currentTrack.title}
                className="text-xs sm:text-[13px] font-semibold text-[#F3E5AB] truncate max-w-[120px] sm:max-w-[160px]"
              >
                {currentTrack.title}
              </p>
            </div>

            {/* Nút điều khiển Phát / Tạm dừng & Chuyển bài */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
                title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-[1px]" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={handleNextTrack}
                aria-label="Chuyển sang bài tiếp theo"
                title="Bài tiếp theo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B0B0F] border border-[#D4AF37]/45 text-[#F3E5AB] flex items-center justify-center hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <SkipForward className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      )}
      {/* Bàn bốc bài Tarot Gặp Gỡ Định Mệnh */}
      <DestinyTarotModal
        isOpen={isDestinyModalOpen}
        characters={CHARACTERS}
        onClose={() => setIsDestinyModalOpen(false)}
      />

      {/* Lá bài Tarot khổng lồ xem chi tiết nhân vật */}
      <CharacterDetailTarotModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  );
}
