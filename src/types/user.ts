export type DefaultAvatarIconId =
  | 'black-cat'
  | 'crescent-moon'
  | 'tarot-star'
  | 'royal-crown'
  | 'night-rose'
  | 'warm-tea';

export type AvatarFrameId =
  | 'bang-vu-pha-le'
  | 'bach-long-ho-ly'
  | 'long-van-thuy-mac'
  | 'huyet-nguyet-kiem-khach'
  | 'hac-long-net-co';

export interface AvatarFramesState {
  unlocked: Partial<Record<AvatarFrameId, number>>;
  equippedFrameId: AvatarFrameId | null;
}

export interface UserProfile {
  displayName: string;
  avatarUrl: string;
  avatarIcon: DefaultAvatarIconId;
  equippedFrameId?: AvatarFrameId | null;
  createdAt: string;
}

export interface HeartfeltLetter {
  id: string;
  characterId: string;
  authorName: string;
  authorAvatarUrl: string;
  authorAvatarIcon: DefaultAvatarIconId;
  authorFrameId?: AvatarFrameId | null;
  content: string;
  createdAt: number;
}

export const STORAGE_KEYS = {
  USER_PROFILE: 'tannhi_user_profile_v1',
  LETTERS_BY_CHAR: 'tannhi_heartfelt_letters_v1',
} as const;

export function loadUserProfile(): UserProfile | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (!parsed || typeof parsed.displayName !== 'string' || !parsed.displayName.trim()) {
      return null;
    }
    return {
      displayName: parsed.displayName.trim(),
      avatarUrl: typeof parsed.avatarUrl === 'string' ? parsed.avatarUrl.trim() : '',
      avatarIcon: parsed.avatarIcon || 'black-cat',
      equippedFrameId: parsed.equippedFrameId ?? null,
      createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile | null): void {
  try {
    if (!profile) {
      window.localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      return;
    }
    // Tránh lưu chuỗi ảnh base64 quá lớn vào localStorage để chạy mượt trong phiên
    const safeAvatarUrl =
      profile.avatarUrl.startsWith('data:') && profile.avatarUrl.length > 60000
        ? ''
        : profile.avatarUrl;
    window.localStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify({ ...profile, avatarUrl: safeAvatarUrl })
    );
  } catch {
    // Ignore storage quota errors
  }
}

export function loadHeartfeltLetters(): Record<string, HeartfeltLetter[]> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.LETTERS_BY_CHAR);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, HeartfeltLetter[]>;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

export function saveHeartfeltLetters(lettersByChar: Record<string, HeartfeltLetter[]>): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.LETTERS_BY_CHAR, JSON.stringify(lettersByChar));
  } catch {
    // Ignore storage quota errors
  }
}
