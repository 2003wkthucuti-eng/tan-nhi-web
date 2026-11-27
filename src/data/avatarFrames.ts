import type { AvatarFrameId, DefaultAvatarIconId } from '../types/user';

export type FrameCutoutMode = 'dark-ring' | 'ink-white' | 'light-ring';

export interface AvatarFrameDefinition {
  id: AvatarFrameId;
  name: string;
  subtitle: string;
  imageUrl: string;
  cutoutMode: FrameCutoutMode;
  /** Tọa độ tâm phần lỗ tròn (tỷ lệ 0..1 theo chiều rộng & cao ảnh gốc) */
  centerX: number;
  centerY: number;
  /** Đường kính khung ảnh đại diện bên trong so với tổng kích thước ảnh khung */
  avatarDiameterRatio: number;
  /** Tỷ lệ bán kính xóa nền trong/ngoài tùy chỉnh nếu vành họa tiết dày hoặc có viền mảnh */
  cutoutInnerRadiusRatio?: number;
  cutoutOuterRadiusRatio?: number;
  /** Ngưỡng sáng/tối tùy chỉnh để tách nền sạch chi tiết ren, mây, sao */
  darkThreshold?: number;
  lightThreshold?: number;
  /** Xóa các ô nền tối khép kín nằm lọt bên trong vùng tâm (như mạng nhện ren trắng) */
  clearEnclosedInnerDark?: boolean;
  accentColor: string;
  glowRgba: string;
  unlockTitle: string;
  unlockHint: string;
  unlockedDesc: string;
}

export const AVATAR_FRAMES: AvatarFrameDefinition[] = [
  {
    id: 'bang-vu-pha-le',
    name: 'Băng Vũ Pha Lê',
    subtitle: 'Đôi cánh băng tuyết & nơ pha lê ánh lam',
    imageUrl: '/assets/aistudio/5089b912d30bcfaa54095726f54a1899_b91ac606.jpg',
    cutoutMode: 'dark-ring',
    centerX: 0.5,
    centerY: 0.48,
    avatarDiameterRatio: 0.54,
    accentColor: '#9ED8FF',
    glowRgba: 'rgba(158, 216, 255, 0.45)',
    unlockTitle: 'Đổi Theme & Sắc Đêm',
    unlockHint: 'Thử đổi Theme giao diện hoặc bật Bạc Ánh Trăng / Đêm Sâu trong phiên này.',
    unlockedDesc: 'Ánh băng pha lê tỏa sáng khi bạn khoác lên ngôi nhà một sắc màu không gian mới.',
  },
  {
    id: 'bach-long-ho-ly',
    name: 'Bạch Long & Hồ Ly',
    subtitle: 'Bạch long bảo châu & hồ ly giữa hoa anh đào',
    imageUrl: '/assets/aistudio/de5f84e16708b0cfa5c9b8c68f7f6fc0_8dfcf422.jpg',
    cutoutMode: 'dark-ring',
    centerX: 0.49,
    centerY: 0.5,
    avatarDiameterRatio: 0.56,
    accentColor: '#F7C5D8',
    glowRgba: 'rgba(247, 197, 216, 0.44)',
    unlockTitle: 'Gõ Cửa Nhân Vật',
    unlockHint: 'Gõ cửa xem hồ sơ một nhân vật, gửi thư tâm tình hoặc chạm chú mèo đen 3 lần.',
    unlockedDesc: 'Bạch long và hồ ly ghi dấu cuộc tương ngộ dịu dàng đầu tiên cùng các nhân vật.',
  },
  {
    id: 'long-van-thuy-mac',
    name: 'Long Vân Thủy Mặc',
    subtitle: 'Ngân long uốn lượn bên cổ tự & mây bạc',
    imageUrl: '/assets/aistudio/2293343e305f063a64a8fc4a339baad0_0da44d30.jpg',
    cutoutMode: 'dark-ring',
    centerX: 0.505,
    centerY: 0.495,
    avatarDiameterRatio: 0.64,
    accentColor: '#DCE4EE',
    glowRgba: 'rgba(220, 228, 238, 0.42)',
    unlockTitle: 'Tarot & Chòm Sao',
    unlockHint: 'Lật một lá bài trong Gặp gỡ định mệnh hoặc thắp sáng đủ 5 ngôi sao ẩn.',
    unlockedDesc: 'Ngân long theo ánh sao và lá bài định mệnh đáp xuống vòng tròn hộ mệnh.',
  },
  {
    id: 'huyet-nguyet-kiem-khach',
    name: 'Huyết Nguyệt Kiếm Khách',
    subtitle: 'Trăng máu, kiếm khách cô độc & hắc long',
    imageUrl: '/assets/aistudio/415dc21da6a4d5cf977f2a16abcd281d_35445610.jpg',
    cutoutMode: 'dark-ring',
    centerX: 0.505,
    centerY: 0.5,
    avatarDiameterRatio: 0.57,
    accentColor: '#E85B6C',
    glowRgba: 'rgba(232, 91, 108, 0.46)',
    unlockTitle: 'Mini-game Huyền Bí',
    unlockHint: 'Trải nghiệm một mini-game trong Góc Huyền Bí hoặc mở Hai Cánh Cửa Định Mệnh.',
    unlockedDesc: 'Dưới ánh huyết nguyệt, thanh kiếm và hắc long mở khóa sau nghi thức huyền bí.',
  },
  {
    id: 'hac-long-net-co',
    name: 'Hắc Long Nét Cọ',
    subtitle: 'Rồng mực tàu tung nét cọ thủy mặc',
    imageUrl: '/assets/aistudio/0940386b5a2e341777e3be9d9912abe5_7b1bd0f5.jpg',
    cutoutMode: 'ink-white',
    centerX: 0.49,
    centerY: 0.48,
    avatarDiameterRatio: 0.59,
    accentColor: '#EFE4CE',
    glowRgba: 'rgba(239, 228, 206, 0.42)',
    unlockTitle: 'Bí Mật Ẩn Của Nhà',
    unlockHint: 'Tìm một bí mật ẩn: giữ chữ ký Tần Nhi, gõ mật mã "tannhi" hoặc nhận lời thì thầm.',
    unlockedDesc: 'Nét mực rồng đen cổ tự dành riêng cho người đủ tinh tế lắng nghe bí mật ngôi nhà.',
  },
  {
    id: 'kim-lien-pho-do',
    name: 'Kim Liên & Phổ Độ',
    subtitle: 'Sen mực, cổ tự hoàng kim & hai bờ thiện ác',
    imageUrl: '/assets/aistudio/d4743ce7006124794ebb2b21b3aa22ea_f4683215.jpg',
    cutoutMode: 'light-ring',
    centerX: 0.5,
    centerY: 0.495,
    avatarDiameterRatio: 0.52,
    cutoutInnerRadiusRatio: 0.41,
    cutoutOuterRadiusRatio: 0.41,
    lightThreshold: 232,
    accentColor: '#F1C86E',
    glowRgba: 'rgba(241, 200, 110, 0.46)',
    unlockTitle: 'Lan Tỏa & Gửi Lời',
    unlockHint: 'Bấm Chia sẻ trang web/nhân vật hoặc mở một liên kết trò chuyện DokiChat / GGAI.',
    unlockedDesc: 'Ánh kim liên nở rộ giữa mực và vàng khi bạn kết nối câu chuyện với thế giới bên ngoài.',
  },
  {
    id: 'day-gai-ban-tay',
    name: 'Dây Gai & Bàn Tay',
    subtitle: 'Vòng dây gai đỏ thẫm & những bàn tay đan siết',
    imageUrl: '/assets/aistudio/def7b129bbcf3bddffb2216caa541f5b_12fce8bb.jpg',
    cutoutMode: 'dark-ring',
    centerX: 0.5,
    centerY: 0.5,
    avatarDiameterRatio: 0.55,
    cutoutInnerRadiusRatio: 0.33,
    cutoutOuterRadiusRatio: 0.41,
    darkThreshold: 32,
    accentColor: '#D65A73',
    glowRgba: 'rgba(214, 90, 115, 0.45)',
    unlockTitle: 'Khí Chất Đêm Nay',
    unlockHint: 'Chọn một bộ lọc Khí Chất Đêm Nay hoặc bấm Bốc ngẫu nhiên nhân vật.',
    unlockedDesc: 'Những bàn tay gai góc khép vòng giữ trọn tâm hồn bạn vừa chọn theo khí chất đêm nay.',
  },
  {
    id: 'ren-trang-you-fool',
    name: 'Ren Trắng You Fool',
    subtitle: 'Ren gothic trắng tinh xảo & dòng chữ You Fool.',
    imageUrl: '/assets/aistudio/0d48036dde8a3d89e86cd787fc1aa6fb_26e8308d.jpg',
    cutoutMode: 'dark-ring',
    centerX: 0.495,
    centerY: 0.485,
    avatarDiameterRatio: 0.47,
    cutoutInnerRadiusRatio: 0.29,
    cutoutOuterRadiusRatio: 0.305,
    darkThreshold: 40,
    clearEnclosedInnerDark: true,
    accentColor: '#F3F5FA',
    glowRgba: 'rgba(243, 245, 250, 0.42)',
    unlockTitle: 'Dấu Ấn Tri Kỷ',
    unlockHint: 'Thử đổi ảnh đại diện mẫu/tải ảnh lên hoặc lưu hồ sơ tại Góc Tri Kỷ.',
    unlockedDesc: 'Từng sợi ren gothic trắng tinh khôi đáp xuống khoảnh khắc bạn tự tay trang trí chân dung mình.',
  },
  {
    id: 'buom-trang-ngoc-trai',
    name: 'Bướm Trăng Ngọc Trai',
    subtitle: 'Ngọc trai ngũ sắc, nơ lụa & cánh bướm dưới trăng',
    imageUrl: '/assets/aistudio/232a29b32d997ce9d210a321e39fec8e_d3204790.jpg',
    cutoutMode: 'dark-ring',
    centerX: 0.495,
    centerY: 0.475,
    avatarDiameterRatio: 0.48,
    cutoutInnerRadiusRatio: 0.275,
    cutoutOuterRadiusRatio: 0.325,
    darkThreshold: 46,
    accentColor: '#E8C5FF',
    glowRgba: 'rgba(232, 197, 255, 0.46)',
    unlockTitle: 'Giai Điệu Đêm Khuya',
    unlockHint: 'Bật Phát nhạc hoặc chuyển sang bài hát khác trong trình phát nhạc mini.',
    unlockedDesc: 'Cánh bướm ngọc trai khẽ đậu bên vòng trăng khi giai điệu trong ngôi nhà bắt đầu ngân vang.',
  },
  {
    id: 'thien-vu-vuong-mien',
    name: 'Thiên Vũ Vương Miện',
    subtitle: 'Đôi cánh thiên thần phớt hồng, vương miện & dây sao',
    imageUrl: '/assets/aistudio/46c9d88b16cb65e04fd34d742c54c0ad_a2e0fc29.jpg',
    cutoutMode: 'dark-ring',
    centerX: 0.505,
    centerY: 0.385,
    avatarDiameterRatio: 0.34,
    cutoutInnerRadiusRatio: 0.195,
    cutoutOuterRadiusRatio: 0.185,
    darkThreshold: 36,
    accentColor: '#FFD6EA',
    glowRgba: 'rgba(255, 214, 234, 0.48)',
    unlockTitle: 'Khám Phá Sâu Hơn',
    unlockHint: 'Mở Chìa khóa Sổ Tay Bí Mật dưới đáy trang hoặc chuyển trang xem thêm nhân vật.',
    unlockedDesc: 'Đôi cánh thiên vũ và vương miện bạc tỏa sáng dành cho người kiên nhẫn khám phá từng trang.',
  },
];

export const AVATAR_FRAME_MAP: Record<AvatarFrameId, AvatarFrameDefinition> = AVATAR_FRAMES.reduce(
  (acc, frame) => {
    acc[frame.id] = frame;
    return acc;
  },
  {} as Record<AvatarFrameId, AvatarFrameDefinition>
);

export interface SampleAvatarChoice {
  id: string;
  label: string;
  avatarUrl: string;
  avatarIcon: DefaultAvatarIconId;
}

export const SAMPLE_CAT_AVATAR_CHOICES: SampleAvatarChoice[] = [
  {
    id: 'cat-black',
    label: 'Mèo Đen',
    avatarUrl: '',
    avatarIcon: 'black-cat',
  },
  {
    id: 'cat-moon',
    label: 'Trăng Khuyết',
    avatarUrl: '',
    avatarIcon: 'crescent-moon',
  },
  {
    id: 'cat-star',
    label: 'Sao Tarot',
    avatarUrl: '',
    avatarIcon: 'tarot-star',
  },
];
