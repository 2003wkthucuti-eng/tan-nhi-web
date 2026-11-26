import type { AvatarFrameId, DefaultAvatarIconId } from '../types/user';

export type FrameCutoutMode = 'dark-ring' | 'ink-white';

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
