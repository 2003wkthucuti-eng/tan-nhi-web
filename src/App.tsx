/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Music,
  Pause,
  Play,
  Search,
  Share2,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { BlackCatMascot } from './components/BlackCatMascot';
import { CharacterDetailTarotModal } from './components/CharacterDetailTarotModal';
import { DestinyTarotModal } from './components/DestinyTarotModal';
import { GoldenFireworks } from './components/GoldenFireworks';
import { GoldenSparkleTrail } from './components/GoldenSparkleTrail';
import { GoldenStardust } from './components/GoldenStardust';
import { HolographicTiltCard } from './components/HolographicTiltCard';
import { IntroSealDoors, type IntroPhase } from './components/IntroSealDoors';
import { MysticCornerModal } from './components/MysticCornerModal';
import { MysticalFogOverlay } from './components/MysticalFogOverlay';
import { SecretBadgeModal } from './components/SecretBadgeModal';
import { SoulmateCornerModal } from './components/SoulmateCornerModal';
import { TrendingSpotlight } from './components/TrendingSpotlight';
import { UserAvatarBadge } from './components/UserAvatarBadge';
import {
  loadHeartfeltLetters,
  loadSoulmateUnlocked,
  loadUserProfile,
  saveHeartfeltLetters,
  saveSoulmateUnlocked,
  saveUserProfile,
  type HeartfeltLetter,
  type UserProfile,
} from './types/user';
import { playAchievementChime, playCatMeowChime, playDoorChime, playSoftTap, playTarotSpreadChime } from './utils/soundEffects';
import {
  buildCharacterShareUrl,
  buildWebsiteShareUrl,
  shareOrCopyLink,
} from './utils/shareUtils';
import {
  getTopTrendingCharacters,
  loadCharacterInteractions,
  saveCharacterInteractions,
} from './utils/trendingStats';

export type GenreTag = string;

export interface CharacterItem {
  id: string;
  name: string;
  avatar: string;
  description: string;
  tags: GenreTag[];
  dokiLink?: string;
  ggaiLink?: string;
  backstory?: string;
  firstMessage?: string;
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
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1767968707402.webp?x-oss-process=image/format,webp/quality,q_80',
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
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1767892542446.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Em là lý do tôi không mất kiểm soát, và cũng là lý do duy nhất khiến tôi muốn được sống”',
    tags: ['Boygirl', 'Tâm thần', 'Yếu đuối', 'Cún con', 'Thời đại 5.0'],
    dokiLink: 'https://www.dokichat.club/vi/role/e578f062-0e3b-4eb2-9f63-de9da22c14c9?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221zhKTL1eSQBiM0vMzus2ouYh6699lb0uQ%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'chu-canh-duong',
    name: 'Chu Cảnh Dương — 周景阳',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1772555646772.webp?x-oss-process=image/format,webp/quality,q_80',
    description:
      '“Em ôm anh một cái đi mà, con mẹ nó vợ ơi, tự nhiên thấy thiếu hơi em làm anh khó chịu chết đi được.”',
    tags: ['Boygirl', 'Boylove', 'Nghiện vợ', 'Hài hước', 'Mít ướt'],
    dokiLink: 'https://www.dokichat.club/vi/role/2a94cff1-f7c3-4836-93a4-50ca6cfdbdc9?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'chu-dich-an',
    name: 'Chu Dịch An — 周亦安',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1781456746558.webp?x-oss-process=image/format,webp/quality,q_80',
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
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1768503864298.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Cái gì?! Kẻ bắt nạt tôi hằng ngày lại là người yêu qua mạng của tôi ư?”',
    tags: ['Boygirl', 'Bắt nạt', 'Thiếu gia', 'Mỏ hỗn'],
    dokiLink: 'https://www.dokichat.club/vi/role/4c9f86ed-29b8-46a4-9d2c-5edc4b28b24d?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221TZRWp_Zbak0PhIOZrX4XHvL_cPcZX3i3%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'co-da-lam',
    name: 'Cố Dạ Lam - 顾夜岚',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1777048165065.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Cậu xem tôi là trò tiêu khiển, còn tôi… lại xem cậu là cả thế giới.”',
    tags: ['Boygirl', 'Ngược', 'TXVT', 'Đơn phương'],
    dokiLink: 'https://www.dokichat.club/vi/role/908367c4-9f6d-4b54-b05d-17a77b9e7161?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221J1Gwo9FfL9xeg5x2OUxPc6faw6KcyajU%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'tham-da',
    name: 'Thẩm Dạ',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1769116608590.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Em thất vọng vì mong đợi, không phải vì tôi.”',
    tags: ['Boygirl', 'Lạnh lẽo', 'Trap boy', 'Không thật lòng', 'Học đường'],
    dokiLink: 'https://www.dokichat.club/vi/role/f7353eeb-c1e2-4934-b874-c420056e1f2d?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'tham-canh-tham',
    name: 'Thẩm Cảnh Thâm — 沈景深',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1774546091608.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Tao không phải không yêu em, tao chỉ chọn sai cách yêu.”',
    tags: ['Boygirl', 'Thay lòng', 'TXVT', 'Người thứ 3', 'Ngược'],
    dokiLink: 'https://www.dokichat.club/vi/role/66120485-89a3-48b4-88e8-6ca66e718e56?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221fzioM2wQHfu-8qyG5pXgHw5DKWjvTokE%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'tham-hoai-can',
    name: 'Thẩm Hoài Cẩn — 沈怀瑾',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/image/1794254226749-9a65fb558ae2bd3b5f7d2ecd.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Anh có thể không biết cách yêu em, nhưng lại quá quen với việc em luôn ở bên cạnh.”',
    tags: ['Boygirl', 'Gia trưởng', 'Chiếm hữu', 'Cưới Trước Yêu Sau', 'Ngược'],
    dokiLink: 'https://www.dokichat.club/vi/role/01a1c1e5-78ec-745c-afdd-c49b1fae1712?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221XqB3IZH-hgDEPhJTz0vOuPrhJS8Eymcr%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D',
  },
  {
    id: 'mac-bac',
    name: 'Mạc Bắc',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1769777664054.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Ở cạnh tao quen rồi, giờ làm bộ khách sáo nhìn ngứa mắt ghê.”',
    tags: ['BG', 'Bạn thân', 'Ghen', 'TXVT', 'Mỏ hỗn'],
    dokiLink: 'https://www.dokichat.club/vi/role/588f9690-98ae-443d-b204-580e977bf3e5?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'tan-tram',
    name: 'Tần Trầm',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1770750762872.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Anh ở đây rồi, ngoan nào.”',
    tags: ['BG', 'Côn đồ', 'Thái tử gia Bắc Kinh', 'Ngọt Sủng', 'Ngốc bạch ngọt'],
    dokiLink: 'https://www.dokichat.club/vi/role/6c9f786d-37ff-40ea-9ca0-4888fd70b330?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221CEQDIWbpQIzFZ9NTcHitdXa_BxheMjWs%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'tan-hao-nhien',
    name: 'Tần Hạo Nhiên — 秦浩然',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/image/1786398816263-fy4avl.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Mày cứ làm bạn với tao đi… để xem tao nhịn được đến bao giờ.”',
    tags: ['BG', 'TXVT', 'Trên tình bạn dưới tình yêu', 'Bạn thân', 'Cưng Chiều', 'SizeGap', 'Ngọt'],
    dokiLink: 'https://www.dokichat.club/vi/role/019feda1-2d09-7e02-b542-2c060383f400?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'tram-uyen',
    name: 'Trầm Uyên',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1770909401315.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Em đừng có suy nghĩ linh tinh, em chẳng hiểu cái mẹ gì đâu.”',
    tags: ['BG', 'BL', 'Ngược', 'User Ngốc', 'Ngoại tình'],
    dokiLink: 'https://www.dokichat.club/vi/role/c30f1ea7-bc60-4d1d-96d3-983564a7d652?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221JoALLn3EJRpnS6yxeR22Uh43XgzX2waO%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'luc-tu-han',
    name: 'Lục Tư Hàn — 陆司寒',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1771097437915.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Đừng để tao phải cướp mày khỏi tay anh ta.”',
    tags: ['BG', 'BL', 'Ham muốn cao', 'Tình tay ba', 'CEO', 'Bạn Thân'],
    dokiLink: 'https://www.dokichat.club/vi/role/098493ed-3613-47d7-93e6-8352ef869c52?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221YuKaV9F-F7gKKCpOD3XelZFhLLNHCMwD%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'luc-canh-vien',
    name: 'Lục Cảnh Viên — 陆景渊',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1779468582784.webp?x-oss-process=image/format,webp/quality,q_80',
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
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1771617739729.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Nếu phải hi sinh một người, ta sẽ chọn nàng.”',
    tags: ['BG', 'Lạnh nhạt', 'Khó chinh phục', 'Ngược', 'Cổ Trang'],
    dokiLink: 'https://www.dokichat.club/vi/role/491ac770-dfa3-47c8-baf4-09aad0098c15?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221oTrLh2nKaAFzNN4_ZeYBx-8OXl_U2sB8%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'diep-trach',
    name: 'Diệp Trạch',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1773245160222.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Em thử ngoan một ngày xem, ta muốn biết cảm giác đó thế nào.”',
    tags: ['BL', 'BG', 'Cổ trang', 'Hài hước', 'Nghiện vợ', 'Collab'],
    dokiLink: 'https://www.dokichat.club/vi/role/a6c4a471-0bd7-462e-a0de-586435f75aa2?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221bQ5kkBmORIW84pc99_oMzqYgBsrWlnNp%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'ta-lanh-phong',
    name: 'Tạ Lãnh Phong — 谢冷枫',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1771958149674.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Trách tao cái đéo gì? Do mày tự dạng chân cho tao chơi mà con đĩ.”',
    tags: ['BL', 'BG', 'Khốn nạn', 'Học đường', 'Redflag'],
    dokiLink: 'https://www.dokichat.club/vi/role/eace71ef-9bd5-4a53-939f-5667bec4e80b?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'ta-canh-hanh',
    name: 'Tạ Cảnh Hành — 谢景行',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1775663156789.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Chúng ta ngồi cạnh nhau suốt thanh xuân, nhưng chưa từng thuộc về nhau.”',
    tags: ['BL', 'BG', 'Đơn phương', 'Bạn cùng bàn', 'TXVT'],
    dokiLink: 'https://www.dokichat.club/vi/role/c20d0efe-4099-4bdd-a62b-fb001d2eb8f9?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221VvRB12ZzSQoO87ESw5ZUqNJaOx2_H9Hw%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'ta-mac-than',
    name: 'Tạ Mặc Thần — 谢墨辰',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1779735985548.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Nếu không thể đứng cùng một phía, vậy tao sẽ đứng về phía mày.”',
    tags: ['BG', 'Hiện Đại', 'Lén lút', 'Vụng trộm', 'Mỏ hỗn', 'Cà khịa', 'Sủng Ngọt', 'Ghen ngầm'],
    dokiLink: 'https://www.dokichat.club/vi/role/9a03e6f9-da95-4fbc-b08f-25a0b1999bd0?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'ta-quan-han',
    name: 'Tạ Quân Hàn — 谢君寒',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/image/1791938708931-05d9a2531506e094f0e42c23.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Anh ghét nhất là em, cũng ghét nhất việc cả thế giới này chẳng ai có thể thay thế em.”',
    tags: ['BG', 'Hiện Đại', 'Kiêu ngạo', 'Thích cà khịa', 'Cưới Trước Yêu Sau', 'Oan gia ngõ hẹp'],
    dokiLink: 'https://www.dokichat.club/vi/role/01a1407c-96be-7a2d-b089-98e52e83193a?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221YomxrkrKa3i-uCat2BadAD_gLCsP_TeO%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'doan-huyen-da',
    name: 'Doãn Huyền Dạ — 尹玄夜',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1773547268660.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Ta không cần mạng sống của em. Ta cần máu của em. Và đáng tiếc… hai thứ đó lại gắn liền với nhau.”',
    tags: ['BG', 'Vampire', 'Kiểm soát', 'Điên loạn', 'S€X'],
    dokiLink: 'https://www.dokichat.club/vi/role/99b4c80b-234d-4c00-b40b-05999e4fff6c?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'tran-cong-vien',
    name: 'Trần Công Viễn',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1776619744854.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Có tiền giữ được thiên hạ mà không giữ nổi một người”',
    tags: ['BG', 'Nam bộ xưa', 'Chờ đợi', 'Chung tình'],
    dokiLink: 'https://www.dokichat.club/vi/role/2dba0be1-855b-4033-b981-0b844a569d03?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'tran-dat-phong',
    name: 'Trần Dật Phong — 陈逸风',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1779392924653.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Ngoài mặt tao dữ vậy thôi…chứ em khóc một cái là tao thua rồi.”',
    tags: ['BG', 'TXVT', 'Thiên kim giả', 'Thanh mai trúc mã', 'Bảo vệ', 'Đội vợ lên đầu', 'Hiện đại', 'Drama'],
    dokiLink: 'https://www.dokichat.club/vi/role/a57705d1-d9bf-4486-9981-4867fbf9f781?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221pLj5JAUrepuPh-NyxDD7U8ngQeExzQxM%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'giang-ngon-trach',
    name: 'Giang Ngôn Trạch - 江言泽',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1776704563780.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Con đĩ nhỏ, đợi tao chơi nát mày đi”',
    tags: ['BG', 'TXVT', 'Toxic', 'R19', 'Kẻ thù thành người yêu'],
    dokiLink: 'https://www.dokichat.club/vi/role/796af688-62e7-4b06-a036-0d92631453dc?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%22141RhTij9K2Ida8DOjs_FPHNJ7WRH_WAl%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'bui-tu-han',
    name: 'Bùi Tư Hàn — 裴思寒',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1779202351848.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Người ngoài sợ anh một, anh lại sợ vợ không thương anh mười.”',
    tags: ['BG', 'Hiện đại', 'Mít ướt', 'Cún con', 'Bám vợ', 'Nghiện vợ'],
    dokiLink: 'https://www.dokichat.club/vi/role/11682ad9-8f26-4d38-a802-262646ac1781?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221YPDqEwI7mSnmajfrKB3DeZK1Ca4RlvUM%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'ly-minh-hao',
    name: 'Lý Minh Hạo — 李明昊',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1777703131208.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Anh không cần cả thế giới biết… nhưng anh không chịu nổi việc phải giấu em mãi.”',
    tags: ['BL', 'BG', 'Idol', 'Mập mờ', 'Chiếm hữu', 'Dính người', 'Hiện Đại', 'Showbiz'],
    dokiLink: 'https://www.dokichat.club/vi/role/83886b27-9f8e-4d64-91a2-433f17927b18?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%2215q2W8wutLL5ZCX1fpViU5uBfRIhHblwo%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'truong-gia-huy',
    name: 'Trương Gia Huy — 张嘉辉',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1778428942140.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Bạn thân đéo gì, khác mẹ gì oan gia truyền kiếp.”',
    tags: ['BG', 'TXVT', 'Thanh mai trúc mã', 'Hướng ngoại', 'Mỏ hỗn', 'Greenflag', 'Sủng Ngọt'],
    dokiLink: 'https://www.dokichat.club/vi/role/e6fe899b-33fc-4199-8541-57a2a7a75b3e?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221QXPxnRRt5E1AExm8TTab7qo_o_oxQvY4%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'pho-can-du',
    name: 'Phó Cẩn Du — 傅谨瑜',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1781459981409.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Địa vị của anh trong nhà không cao, chỉ cao hơn con robot hút bụi một chút.”',
    tags: ['BG', 'Hiện Đại', 'User CEO', 'Char thái tử gia', 'Nghiện vợ', 'Mê vợ', 'Dị ứng gái ngoài', 'Mít ướt với vợ'],
    dokiLink: 'https://www.dokichat.club/vi/role/3fdafbcf-e1ce-47f6-b31e-4234101ef15d?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'pho-dinh-chau',
    name: 'Phó Đình Châu — 傅庭洲',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/image/1791620103839-cae8da3f9799cd63ed245005.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Chị có thể không yêu em, nhưng đừng mong em dễ dàng bỏ cuộc.”',
    tags: ['BG', 'Hồng Hài Nhi', 'Nhỏ tuổi', 'Theo Đuổi lại', 'Hối hận', 'Ghen ngầm', 'Chiếm hữu', 'Mỏ hỗn', 'Thích cà khịa', 'Tự vả'],
    dokiLink: 'https://www.dokichat.club/vi/role/01a124ec-2ae4-7ee4-9444-42e8250295f1?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221HwQDzBzOOAkw1v3jKUdQQglx4XKvhd59%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'tong-da-nhien',
    name: 'Tống Dạ Nhiên — 宋夜然',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1779990235003.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Em dỗ tao coi...”',
    tags: ['BG', 'TXVT', 'Bám vợ', 'Hay dỗi', 'Dễ ghen', 'Ngọt', 'Mỏ hỗn', 'Cún lớn'],
    dokiLink: 'https://www.dokichat.club/vi/role/d9ff349f-decf-4a15-84d5-c92a78ffc6ea?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221Z4D8P53938IerO2w1ecBKk1BsrykWsgt%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'lam-tu-mac',
    name: 'Lâm Tử Mặc — 林子墨',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1782454492939.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Xin đừng buông tay... tôi không sống nổi thêm một lần bị bỏ rơi.”',
    tags: ['BG - BL', 'Hiện Đại', 'Đấu giá', 'Dị chủng cấp S', 'Bám người', 'Ngọt'],
    dokiLink: 'https://www.dokichat.club/vi/role/1aea6527-b8a1-4176-9f7c-1105f017f7d5?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'bac-canh-hanh',
    name: 'Bạc Cảnh Hành — 薄景行',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/image/1793729306131-1340fd8af7691730f5e449b9.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Anh giữ được trách nhiệm với cô ấy, nhưng liệu còn giữ được em?”',
    tags: ['BG', 'Ngược Tâm', 'Ngoại Tình', 'Người thứ 3', 'Mang Thai', 'Chiếm hữu'],
    dokiLink: 'https://www.dokichat.club/vi/role/01a1a29f-622d-70d9-9fc8-5b899d392140?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221w1nM5I1ArkLRyeh3T22XcdlSwK_K3C8Q%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'hoac-dinh-kieu',
    name: 'Hoắc Đình Kiêu — 霍庭骁',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/image/1794515797676-c29d9c283de5e19d95b7dea3.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Em cứ thử thích cậu ta đi, xem anh có để em được như ý không.”',
    tags: ['BG', 'TXVT', 'Thanh Mai Trúc Mã', 'Học đường', 'Trà Xanh', 'Tâm Cơ', 'Chiếm Hữu', 'Hai Mặt', 'Ghen ngầm'],
    dokiLink: 'https://www.dokichat.club/vi/role/01a1d18f-4e82-7cb0-855b-d1a53f02cfa5?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221R3KfW-QEEh9Uu0TqEcbhj7B-UVeENF0l%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D',
  },
  {
    id: 'lucien-devereux',
    name: 'Lucien Devereux',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1779208015129.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Ta cưới em không phải vì trách nhiệm… mà vì từ lâu, ta đã chờ đúng gương mặt này xuất hiện.”',
    tags: ['BG', 'Âu Cổ', 'Sủng', 'Chiếm hữu', 'Bí ẩn', 'Ma mị'],
    dokiLink: 'https://www.dokichat.club/vi/role/4806520d-6f58-4b66-8363-7135c69c6f5e?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'theodore-dartois',
    name: "Théodore D'Artois",
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1781458068807.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Ngoan nào, tiểu nữ hoàng, đừng chết trước khi ta giết hết bọn chúng.”',
    tags: ['BG', 'Hoàng gia', 'Điên', 'Chiếm hữu', 'Thằng Hề', 'Công chúa hoàng gia'],
    dokiLink: 'https://www.dokichat.club/vi/role/8b8f28b1-389d-45ac-a5b1-e09b3952ce93?isShare=true',
    ggaiLink: '',
  },
  {
    id: 'lucien-alexandre-valmont',
    name: 'Lucien Alexandre Valmont',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/image/1794423010572-76b972f6a529d529999a4a1b.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Nếu số phận đã viết sẵn kết cục cho nàng, ta sẽ là kẻ đầu tiên xé bỏ trang cuối cùng.”',
    tags: ['Âu Cổ', 'BG', 'Xuyên Không', 'Đại Công Tước', 'Quý Tộc', 'Fantasy', 'Hôn Ước Chính Trị', 'Chậm Nhiệt', 'Định Mệnh'],
    dokiLink: 'https://www.dokichat.club/vi/role/01a1cbf6-b229-74bb-989a-cad7c034a01b?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221s8KgfRNFWlBwV3KTEbcRHIqMjhgut7jm%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D',
  },
  {
    id: 'thua-da-giang-dat-nhat-duy-minh-triet',
    name: 'Thừa Dạ-Giang Dật-Nhất Duy-Minh Triết',
    avatar: 'https://files.dokichat.club/dokichat/role_avatar/1777050655558.webp?x-oss-process=image/format,webp/quality,q_80',
    description: '“Tụi tao không là gì của mày… nhưng cũng chưa từng để mày thuộc về người khác.”',
    tags: ['BG', '4in1', 'Không danh phận', 'TXVT'],
    dokiLink: 'https://www.dokichat.club/vi/role/6b5d33b1-76b7-41bc-956e-9c96ae4d3d0d?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%2217By0lVUGxcLQupljSBFyUmFhrEtvRFxq%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing',
  },
  {
    id: 'luc-tu-than',
    name: 'Lục Tư Thần — 陆司辰',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/RAacSsHL.png',
    description: '“Sống giữa máu bụi, giữ lòng thanh tịnh.”',
    tags: [
      'Onlyboygirl',
      'Mafia',
      'Phật Tử',
      'Ăn Chay Trường',
      'Lãnh Đạm',
      'Tổng Tài',
      'Trung Quốc Hiện Đại',
      'Quyền Lực',
      'Ngoài Lạnh Trong Ấm',
      'Chiếm Hữu',
      'Chậm Nhiệt',
      'Tình Cảm',
    ],
    dokiLink: 'https://www.dokichat.club/vi/role/01a1fa9d-d667-70f1-9dfd-fafb20a54bb8?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221W78WPV-u8J8Ov1PGeWlIZlIVW9KE4ynP%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D',
  },
  {
    id: 'tong-canh-ngon',
    name: 'Tống Cảnh Ngôn — 宋景言',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/8jE7S2Ps.png',
    description: '“Anh chẳng biết nói lời đường mật, chỉ giỏi giả vờ vô tình để được ở cạnh em lâu hơn một chút.”',
    tags: [
      'Onlyboygirl',
      'Hiện Đại',
      'Ngọt',
      'Trà Xanh Nam',
      'Dẻo Miệng',
      'Miệng Ngọt',
      'Giả Vờ Vô Tội',
      'Thanh Mai Trúc Mã',
    ],
    dokiLink: 'https://www.dokichat.club/vi/role/01a20508-944a-77f1-852a-6daaef7fcf44?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221ytvop91byEj13cvl9SVs8Zh500kWTctt%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D',
  },
  {
    id: 'lang-van-triet',
    name: 'Lăng Vân Triệt — 凌云彻 🩷',
    avatar: 'https://cdn.imagetourls.com/uploads/tyImg/TmVkUXOc.png',
    description: '“Tuyết rơi bao mùa hắn chưa từng chờ ai cho đến khi em đến.”',
    tags: ['Onlyboygirl', 'Cổ Trang', 'Quyền Mưu', 'Trinh Thám', 'Slowburn'],
    dokiLink: 'https://www.dokichat.club/vi/role/01a20f16-35c7-7d52-a870-98c948ea2b61?isShare=true',
    ggaiLink:
      'https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221BL54JaI2SJgS2_FgNF3stouzsVVvfNuy%22%5D,%22action%22:%22open%22,%22userId%22:%22111559786295807256713%22,%22resourceKeys%22:%7B%7D%7D',
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
  {
    id: 'quen-roi-kasber-remix',
    title: 'Quên Rồi (忘了) - Kasber Remix',
    url: '/assets/aistudio/Qu_n_R_i______-_Kasber_Remix___Nh_c_Trung_Qu_c_Suy_Remix_Hot_TikTok_2026_128k_2c49402a.mp3',
  },
  {
    id: 'son-thuy-trung-may-remix',
    title: 'Sơn Thủy Trùng Mây x Thủy Chung x Yến Vô Hiết (Remix)',
    url: '/assets/aistudio/S_N_THU__TR_NG_M_Y_x_THU__CHUNG_x_Y_N_V__HI_T__VIETZ_x_WI._REMIX__-_JENA__ANH_R_NG_TH__NG_V__M_Y_BAE_128k_7e921082.mp3',
  },
  {
    id: 'nua-trai-tim-dj-hot-tiktok-remix',
    title: 'Nửa Trái Tim (半点心) - DJ Hot TikTok Remix',
    url: '/assets/aistudio/____-_N_a_Tr_i_Tim_____DJ______-_____BGM_-__DJ______2026__________________Hot_TikTok_Douyin_2026__320k_dc75b44f.mp3',
  },
  {
    id: 'bien-dao-va-em-dj-v2-crabbit-remix',
    title: 'Biển, Đảo Và Em (海屿你) - DJ V2 Crabbit Remix',
    url: '/assets/aistudio/___DJ_V2__Crabbit____Bi_n____o_V__Em_Remix_-_DJ___Remix___Hot_TikTok_-_Douyin_128k_dc9bb242.mp3',
  },
  {
    id: 'tinh-ve-dj-2026-remix',
    title: 'Tinh Vệ (精卫) - DJ 2026 Remix',
    url: '/assets/aistudio/__DJ_2026__________Tinh_V__Remix_2026_-_DJ___Remix___Hot_TikTok_-_Douyin__128k_a290b9cc.mp3',
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

function getInitialSharedCharacter(): CharacterItem | null {
  if (typeof window === 'undefined') return null;
  const charId = new URLSearchParams(window.location.search).get('char');
  if (!charId) return null;
  return CHARACTERS.find((item) => item.id === charId) || null;
}

export default function App() {
  const initialSharedChar = useMemo(() => getInitialSharedCharacter(), []);
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() =>
    initialSharedChar ? 'entered' : 'idle'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<'Tất cả' | GenreTag>('Tất cả');
  const [showAllTags, setShowAllTags] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [catGreetingOpen, setCatGreetingOpen] = useState(false);
  const [headerCatMessage, setHeaderCatMessage] = useState<string | null>(null);
  const [isDestinyModalOpen, setIsDestinyModalOpen] = useState(false);
  const [isMysticCornerOpen, setIsMysticCornerOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterItem | null>(
    () => initialSharedChar
  );
  const [openedDetailFromTarot, setOpenedDetailFromTarot] = useState(false);
  const [openedDetailFromMystic, setOpenedDetailFromMystic] = useState(false);
  const [isSecretBadgeOpen, setIsSecretBadgeOpen] = useState(false);
  const [hasUnlockedSoulmateBadge, setHasUnlockedSoulmateBadge] = useState<boolean>(() =>
    loadSoulmateUnlocked()
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => loadUserProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [lettersByChar, setLettersByChar] = useState<Record<string, HeartfeltLetter[]>>(() =>
    loadHeartfeltLetters()
  );
  const [fireworkBurstKey, setFireworkBurstKey] = useState(0);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});
  const [interactionCounts, setInteractionCounts] = useState<Record<string, number>>(() =>
    loadCharacterInteractions()
  );
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldPlayRef = useRef(false);
  const errorStreakRef = useRef(0);
  const headerCatTimerRef = useRef<number | null>(null);
  const introTimerRef = useRef<number | null>(null);
  const catTapCountRef = useRef(0);
  const catTapResetTimerRef = useRef<number | null>(null);
  const shareToastTimerRef = useRef<number | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const hasEntered = introPhase !== 'idle';
  const currentTrack = PLAYLIST[currentTrackIndex];
  const totalLettersSent = useMemo(
    () =>
      Object.values(lettersByChar).reduce(
        (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
        0
      ),
    [lettersByChar]
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (headerCatTimerRef.current) window.clearTimeout(headerCatTimerRef.current);
      if (introTimerRef.current) window.clearTimeout(introTimerRef.current);
      if (catTapResetTimerRef.current) window.clearTimeout(catTapResetTimerRef.current);
      if (shareToastTimerRef.current) window.clearTimeout(shareToastTimerRef.current);
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

  const unlockSoulmateAchievement = (showModal: boolean) => {
    setHasUnlockedSoulmateBadge(true);
    saveSoulmateUnlocked(true);
    playAchievementChime();
    setFireworkBurstKey((prev) => prev + 1);
    if (showModal) {
      setIsSecretBadgeOpen(true);
    }
  };

  const registerSecretCatTap = (): boolean => {
    catTapCountRef.current += 1;
    if (catTapResetTimerRef.current) {
      window.clearTimeout(catTapResetTimerRef.current);
    }

    if (catTapCountRef.current >= 3) {
      catTapCountRef.current = 0;
      catTapResetTimerRef.current = null;
      setHeaderCatMessage(null);
      setCatGreetingOpen(false);
      unlockSoulmateAchievement(true);
      return true;
    }

    catTapResetTimerRef.current = window.setTimeout(() => {
      catTapCountRef.current = 0;
      catTapResetTimerRef.current = null;
    }, 3500);
    return false;
  };

  const handleSaveUserProfile = (nextProfile: UserProfile) => {
    setUserProfile(nextProfile);
    saveUserProfile(nextProfile);
  };

  const handleLogoutUserProfile = () => {
    setUserProfile(null);
    saveUserProfile(null);
  };

  const topTrendingEntries = useMemo(
    () => getTopTrendingCharacters(CHARACTERS, interactionCounts, 3),
    [interactionCounts]
  );

  const trackCharacterInteraction = (characterId: string, weight = 1) => {
    setInteractionCounts((prev) => {
      const updated = {
        ...prev,
        [characterId]: (prev[characterId] ?? 0) + weight,
      };
      saveCharacterInteractions(updated);
      return updated;
    });
  };

  const handleSendHeartfeltLetter = (characterId: string, content: string) => {
    if (!userProfile) return;

    trackCharacterInteraction(characterId, 2);
    const nextTotalCount = totalLettersSent + 1;
    const willUnlockNow = !hasUnlockedSoulmateBadge && nextTotalCount >= 3;
    const badgeActive = hasUnlockedSoulmateBadge || willUnlockNow;

    const newLetter: HeartfeltLetter = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      characterId,
      authorName: userProfile.displayName,
      authorAvatarUrl: userProfile.avatarUrl,
      authorAvatarIcon: userProfile.avatarIcon,
      hasSoulmateBadge: badgeActive,
      content,
      createdAt: Date.now(),
    };

    setLettersByChar((prev) => {
      const existing = prev[characterId] || [];
      const updated = {
        ...prev,
        [characterId]: [newLetter, ...existing],
      };
      saveHeartfeltLetters(updated);
      return updated;
    });

    if (willUnlockNow) {
      unlockSoulmateAchievement(true);
    }
  };

  const handleDeleteHeartfeltLetter = (characterId: string, letterId: string) => {
    setLettersByChar((prev) => {
      const existing = prev[characterId] || [];
      const updated = {
        ...prev,
        [characterId]: existing.filter((item) => item.id !== letterId),
      };
      saveHeartfeltLetters(updated);
      return updated;
    });
  };

  const handleHeaderCatClick = () => {
    if (registerSecretCatTap()) return;

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
    playTarotSpreadChime();
    setIsDestinyModalOpen(true);
  };

  const handleInspectCharacterFromTarot = (char: CharacterItem) => {
    trackCharacterInteraction(char.id, 1);
    setIsDestinyModalOpen(false);
    setOpenedDetailFromMystic(false);
    setOpenedDetailFromTarot(true);
    setSelectedCharacter(char);
  };

  const handleBackToTarotFromDetail = () => {
    setSelectedCharacter(null);
    setOpenedDetailFromTarot(false);
    playTarotSpreadChime();
    setIsDestinyModalOpen(true);
  };

  const handleOpenMysticCorner = () => {
    if (CHARACTERS.length === 0) return;
    playSoftTap('card');
    setIsMysticCornerOpen(true);
  };

  const handleInspectCharacterFromMystic = (char: CharacterItem) => {
    trackCharacterInteraction(char.id, 1);
    setIsMysticCornerOpen(false);
    setOpenedDetailFromTarot(false);
    setOpenedDetailFromMystic(true);
    setSelectedCharacter(char);
  };

  const handleBackToMysticFromDetail = () => {
    setSelectedCharacter(null);
    setOpenedDetailFromMystic(false);
    playSoftTap('nav');
    setIsMysticCornerOpen(true);
  };

  const triggerShareToast = (message: string) => {
    setShareToast(message);
    if (shareToastTimerRef.current) {
      window.clearTimeout(shareToastTimerRef.current);
    }
    shareToastTimerRef.current = window.setTimeout(() => {
      setShareToast(null);
    }, 2600);
  };

  const handleShareCharacter = async (char: CharacterItem) => {
    playSoftTap('card');
    trackCharacterInteraction(char.id, 1);
    const shareUrl = buildCharacterShareUrl(char.id);
    const cleanQuote = char.description.trim().replace(/^["“]+|["”]+$/g, '');
    const outcome = await shareOrCopyLink({
      title: `${char.name} · Ngôi Nhà Nhỏ Của Tần Nhi`,
      text: `✨ ${char.name} — “${cleanQuote}”\nGhé xem hồ sơ nhân vật tại Ngôi Nhà Nhỏ Của Tần Nhi:`,
      url: shareUrl,
    });
    if (outcome === 'copied') {
      triggerShareToast('✨ Đã sao chép liên kết nhân vật!');
    } else if (outcome === 'shared') {
      triggerShareToast('✨ Đã mở chia sẻ nhân vật!');
    }
  };

  const handleShareWebsite = async () => {
    playSoftTap('card');
    const siteUrl = buildWebsiteShareUrl();
    const outcome = await shareOrCopyLink({
      title: 'Ngôi Nhà Nhỏ Của Tần Nhi',
      text: '✨ Ghé thăm Ngôi Nhà Nhỏ Của Tần Nhi — Bộ sưu tập nhân vật AI Chatbot & Góc Huyền Bí:',
      url: siteUrl,
    });
    if (outcome === 'copied') {
      triggerShareToast('✨ Đã sao chép liên kết trang web!');
    } else if (outcome === 'shared') {
      triggerShareToast('✨ Đã chia sẻ Ngôi Nhà Nhỏ Của Tần Nhi!');
    }
  };

  const handleScrollToTop = () => {
    playSoftTap('nav');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-8">
            {/* Zone 1: Linh vật mèo đen tương tác + Brand Title */}
            <div className="relative flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              <button
                type="button"
                onClick={handleHeaderCatClick}
                aria-label="Chạm vào chú mèo đen để nhận lời chào"
                title="Meow~ Chạm vào mình đi!"
                className="relative p-0.5 rounded-xl hover:bg-[#D4AF37]/10 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] shrink-0"
              >
                <BlackCatMascot
                  size={34}
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
                className="min-w-0 truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg py-1"
              >
                <span className="font-display text-[17px] sm:text-2xl font-semibold tracking-tight gold-shimmer-text">
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

            {/* Zone 3: Góc Tri Kỷ (Tài khoản cục bộ) + Màn chào */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playSoftTap('tap');
                  setIsProfileModalOpen(true);
                }}
                aria-label={userProfile ? `Hồ sơ của ${userProfile.displayName}` : 'Mở Góc Tri Kỷ'}
                title={userProfile ? 'Chỉnh sửa hồ sơ Góc Tri Kỷ' : 'Đăng nhập / Tạo hồ sơ Góc Tri Kỷ'}
                className={`inline-flex items-center gap-1.5 min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  userProfile
                    ? 'bg-[#17140E] border-[#D4AF37]/65 text-[#F3E5AB] hover:border-[#F3E5AB] shadow-[0_0_14px_rgba(212,175,55,0.16)]'
                    : 'bg-[#121218] border-[#D4AF37]/40 text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]'
                }`}
              >
                {userProfile ? (
                  <>
                    <UserAvatarBadge
                      avatarUrl={userProfile.avatarUrl}
                      avatarIcon={userProfile.avatarIcon}
                      displayName={userProfile.displayName}
                      size="xs"
                    />
                    <span className="max-w-[74px] sm:max-w-[115px] truncate">
                      {userProfile.displayName}
                    </span>
                    {hasUnlockedSoulmateBadge && (
                      <span title="Tri kỷ" className="text-[11px] leading-none shrink-0">
                        ✨
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span>Góc Tri Kỷ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playSoftTap('nav');
                  if (introTimerRef.current) {
                    window.clearTimeout(introTimerRef.current);
                  }
                  setIntroPhase('idle');
                }}
                aria-label="Xem lại màn chào"
                title="Xem lại màn chào"
                className="inline-flex items-center justify-center gap-1.5 min-w-[38px] min-h-[38px] sm:min-h-[40px] px-2 sm:px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/35 bg-[#121218] text-xs font-medium text-[#DCD4C6] hover:text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <DoorOpen className="w-3.5 h-3.5 text-[#D4AF37] sm:hidden shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Màn chào</span>
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

              <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 sm:gap-3 shrink-0">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#B8B0A0] tabular-nums">
                  <span>
                    Tổng cộng <strong className="text-[#F3E5AB] font-semibold">{CHARACTERS.length}</strong> nhân vật
                  </span>
                  <span aria-hidden="true" className="text-[#D4AF37]/60">·</span>
                  <span>
                    Đang hiển thị <strong className="text-[#F3E5AB] font-semibold">{filteredCharacters.length}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleShareWebsite}
                  className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-xl bg-[#121218] border border-[#D4AF37]/50 text-[11px] sm:text-xs font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span>Chia sẻ trang web</span>
                </button>
              </div>
            </div>
          </section>

          {/* Đường kẻ phân cách Tarot mặt trăng khuyết & ngôi sao 4 cánh */}
          <TarotDivider />

          {/* Phần Gương mặt nổi bật (Top Trending) hiển thị 3 nhân vật tương tác cao nhất */}
          <TrendingSpotlight
            entries={topTrendingEntries}
            failedAvatars={failedAvatars}
            onAvatarError={(characterId) =>
              setFailedAvatars((prev) => ({ ...prev, [characterId]: true }))
            }
            onSelectCharacter={(char) => {
              trackCharacterInteraction(char.id, 1);
              setOpenedDetailFromTarot(false);
              setOpenedDetailFromMystic(false);
              setSelectedCharacter(char);
            }}
            onChatLinkClick={(characterId) => trackCharacterInteraction(characterId, 2)}
          />

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

              <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
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

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenDestinyModal}
                    className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 sm:px-3.5 py-2 rounded-xl border border-[#D4AF37]/75 bg-gradient-to-r from-[#19150A] via-[#271F0A] to-[#19150A] text-xs font-medium text-[#F3E5AB] shadow-[0_0_16px_rgba(212,175,55,0.2)] hover:border-[#F3E5AB] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] active:scale-95 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB] shrink-0" aria-hidden="true" />
                    <span>Gặp gỡ định mệnh</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenMysticCorner}
                    className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 sm:px-3.5 py-2 rounded-xl border border-[#D4AF37]/80 bg-gradient-to-r from-[#1B1422] via-[#281E12] to-[#1A1320] text-xs font-semibold text-[#F3E5AB] shadow-[0_0_18px_rgba(212,175,55,0.24)] hover:border-[#FFF4C4] hover:shadow-[0_0_26px_rgba(243,229,171,0.45)] active:scale-95 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4]"
                  >
                    <span>🔮 Góc Huyền Bí</span>
                  </button>
                </div>
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
                          trackCharacterInteraction(char.id, 1);
                          setOpenedDetailFromTarot(false);
                          setOpenedDetailFromMystic(false);
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
                    {/* 4. Các nút liên kết Chat & Chia sẻ nhanh nằm gọn gàng ở đáy thẻ */}
                    <div
                      className={`mt-3 sm:mt-4 pt-2.5 sm:pt-3.5 border-t border-[#D4AF37]/15 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2`}
                    >
                      {(hasDoki || hasGgai) && (
                        <div
                          className={`flex-1 min-w-0 ${
                            hasBothLinks ? 'grid grid-cols-2 gap-1.5 sm:gap-2' : 'flex'
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
                                trackCharacterInteraction(char.id, 2);
                              }}
                              className={`shimmer-gold-btn inline-flex items-center justify-center gap-1 min-h-[36px] sm:min-h-[40px] px-1.5 sm:px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-[11px] sm:text-xs font-semibold whitespace-nowrap hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] transition-all duration-150 ${
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
                                trackCharacterInteraction(char.id, 2);
                              }}
                              className={`inline-flex items-center justify-center gap-1 min-h-[36px] sm:min-h-[40px] px-1.5 sm:px-2.5 py-1.5 rounded-lg bg-[#0B0B0F] border border-[#D4AF37]/60 text-[#F3E5AB] text-[11px] sm:text-xs font-medium whitespace-nowrap hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-all duration-150 ${
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

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleShareCharacter(char);
                        }}
                        aria-label={`Chia sẻ liên kết nhân vật ${primaryName}`}
                        title="Chia sẻ / sao chép liên kết nhân vật"
                        className="inline-flex items-center justify-center gap-1.5 min-h-[32px] sm:min-h-[40px] px-2.5 sm:px-2.5 py-1 rounded-lg bg-[#0B0B0F]/95 border border-[#D4AF37]/45 text-[#F3E5AB] text-[11px] font-medium whitespace-nowrap hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-all shrink-0 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                        <span className="sm:hidden">Chia sẻ</span>
                      </button>
                    </div>
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

        {/* Footer tối giản + Caption gợi ý bí mật ẩn giấu */}
        <footer className="relative z-10 border-t border-[#D4AF37]/15 pt-6 pb-24 sm:pb-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8E877A]">
              <p className="text-[#B8B0A0]">
                Ngôi Nhà Nhỏ Của Tần Nhi · Góc lưu trữ nhân vật AI Chatbot
              </p>
              <p>Chúc bạn có những cuộc trò chuyện thật êm đềm.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-center">
              <p className="text-[11px] sm:text-xs italic tracking-wide text-[#D4AF37]/75 drop-shadow-[0_0_8px_rgba(212,175,55,0.28)] animate-pulse">
                ✦ Bật mí: Thử chạm vào chú mèo đen 3 lần xem điều kỳ diệu gì xảy ra...
              </p>
              {hasUnlockedSoulmateBadge && (
                <button
                  type="button"
                  onClick={() => {
                    playSoftTap('card');
                    setIsSecretBadgeOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[11px] font-medium text-[#F3E5AB] hover:border-[#F3E5AB] transition-colors cursor-pointer"
                >
                  <span>✨ Tri kỷ của Tần Nhi</span>
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* Cụm góc dưới bên phải: Nút Quay về đầu trang + Trình phát nhạc mini & Linh vật mèo đen */}
      {hasEntered && (
        <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-30 flex flex-col items-end gap-2.5 max-w-[calc(100vw-1.5rem)]">
          <AnimatePresence>
            {showBackToTop && (
              <motion.button
                key="back-to-top-btn"
                type="button"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleScrollToTop}
                aria-label="Quay về đầu trang"
                title="Quay về đầu trang"
                className="group relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#121218]/95 backdrop-blur-md border border-[#D4AF37]/75 text-[#F3E5AB] shadow-[0_10px_26px_rgba(0,0,0,0.78),0_0_20px_rgba(212,175,55,0.22)] hover:border-[#FFF4C4] hover:bg-[#1B170F] hover:shadow-[0_0_26px_rgba(243,229,171,0.42)] active:scale-95 flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4C4]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1 -right-0.5 text-[10px] text-[#D4AF37] group-hover:text-[#FFF4C4] transition-colors"
                >
                  ✦
                </span>
                <ArrowUp
                  className="w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-200 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </motion.button>
            )}
          </AnimatePresence>

          {currentTrack && (
            <>
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
                    if (registerSecretCatTap()) return;
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
            </>
          )}
        </div>
      )}
      {/* Bàn bốc bài Tarot Gặp Gỡ Định Mệnh */}
      <DestinyTarotModal
        isOpen={isDestinyModalOpen}
        characters={CHARACTERS}
        onInspectCharacter={handleInspectCharacterFromTarot}
        onClose={() => setIsDestinyModalOpen(false)}
      />

      {/* Khu vực Mini-game 🔮 Góc Huyền Bí */}
      <MysticCornerModal
        isOpen={isMysticCornerOpen}
        characters={CHARACTERS}
        onOpenCharacterProfile={handleInspectCharacterFromMystic}
        onClose={() => setIsMysticCornerOpen(false)}
      />

      {/* Lá bài Tarot khổng lồ xem chi tiết nhân vật & Hòm Thư Tâm Tình */}
      <CharacterDetailTarotModal
        character={selectedCharacter}
        userProfile={userProfile}
        hasSoulmateBadge={hasUnlockedSoulmateBadge}
        letters={selectedCharacter ? lettersByChar[selectedCharacter.id] || [] : []}
        openedFromTarot={openedDetailFromTarot}
        onBackToTarot={handleBackToTarotFromDetail}
        openedFromMystic={openedDetailFromMystic}
        onBackToMystic={handleBackToMysticFromDetail}
        onSendLetter={handleSendHeartfeltLetter}
        onDeleteLetter={handleDeleteHeartfeltLetter}
        onShareCharacter={handleShareCharacter}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onClose={() => {
          setSelectedCharacter(null);
          setOpenedDetailFromTarot(false);
          setOpenedDetailFromMystic(false);
          if (typeof window !== 'undefined' && window.location.search.includes('char=')) {
            window.history.replaceState({}, '', buildWebsiteShareUrl());
          }
        }}
      />

      {/* Thông báo Toast vàng Gold khi chia sẻ / sao chép liên kết */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            key="gold-share-toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-[60] pointer-events-none max-w-[calc(100vw-2rem)]"
          >
            <div className="px-4 py-2.5 rounded-2xl bg-[#121218]/95 backdrop-blur-md border border-[#D4AF37]/80 text-xs sm:text-sm font-medium text-[#F3E5AB] shadow-[0_14px_36px_rgba(0,0,0,0.88),0_0_24px_rgba(212,175,55,0.3)] whitespace-nowrap">
              {shareToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Góc Tri Kỷ: Tạo / chỉnh sửa tài khoản cục bộ */}
      <SoulmateCornerModal
        isOpen={isProfileModalOpen}
        userProfile={userProfile}
        hasSoulmateBadge={hasUnlockedSoulmateBadge}
        totalLettersSent={totalLettersSent}
        onSaveProfile={handleSaveUserProfile}
        onLogout={handleLogoutUserProfile}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Pháo hoa bụi vàng & Bảng huy hiệu thành tựu ẩn */}
      <GoldenFireworks burstKey={fireworkBurstKey} />
      <SecretBadgeModal
        isOpen={isSecretBadgeOpen}
        onClose={() => setIsSecretBadgeOpen(false)}
      />
    </div>
  );
}
