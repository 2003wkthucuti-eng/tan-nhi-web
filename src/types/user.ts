export type DefaultAvatarIconId =
  | 'black-cat'
  | 'crescent-moon'
  | 'tarot-star'
  | 'royal-crown'
  | 'night-rose'
  | 'warm-tea';

export interface UserProfile {
  displayName: string;
  avatarUrl: string;
  avatarIcon: DefaultAvatarIconId;
  createdAt: string;
}

export interface HeartfeltLetter {
  id: string;
  characterId: string;
  authorName: string;
  authorAvatarUrl: string;
  authorAvatarIcon: DefaultAvatarIconId;
  hasSoulmateBadge: boolean;
  content: string;
  createdAt: number;
}

export const STORAGE_KEYS = {
  USER_PROFILE: 'tannhi_user_profile_v1',
  SOULMATE_BADGE: 'tannhi_soulmate_badge_v1',
  LETTERS_BY_CHAR: 'tannhi_heartfelt_letters_v1',
  EASTER_EGG_BADGES: 'tannhi_easter_egg_badges_v1',
} as const;

export type SecretBadgeId =
  | 'soulmate'
  | 'night_decoder'
  | 'night_owl'
  | 'lost_returner'
  | 'star_weaver'
  | 'moon_keeper';

export interface SecretBadgesState {
  nightDecoder: boolean;
  nightOwl: boolean;
  lostReturner: boolean;
  starWeaver: boolean;
  moonKeeper: boolean;
  signatureSealUnlocked: boolean;
  unlockedAt: Partial<Record<SecretBadgeId, number>>;
}

export function loadSecretBadgesState(): SecretBadgesState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.EASTER_EGG_BADGES);
    if (!raw) {
      return {
        nightDecoder: false,
        nightOwl: false,
        lostReturner: false,
        starWeaver: false,
        moonKeeper: false,
        signatureSealUnlocked: false,
        unlockedAt: {},
      };
    }
    const parsed = JSON.parse(raw) as Partial<SecretBadgesState>;
    return {
      nightDecoder: Boolean(parsed?.nightDecoder),
      nightOwl: Boolean(parsed?.nightOwl),
      lostReturner: Boolean(parsed?.lostReturner),
      starWeaver: Boolean(parsed?.starWeaver),
      moonKeeper: Boolean(parsed?.moonKeeper),
      signatureSealUnlocked: Boolean(parsed?.signatureSealUnlocked),
      unlockedAt:
        parsed?.unlockedAt && typeof parsed.unlockedAt === 'object' ? parsed.unlockedAt : {},
    };
  } catch {
    return {
      nightDecoder: false,
      nightOwl: false,
      lostReturner: false,
      starWeaver: false,
      moonKeeper: false,
      signatureSealUnlocked: false,
      unlockedAt: {},
    };
  }
}

export function saveSecretBadgesState(state: SecretBadgesState): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.EASTER_EGG_BADGES, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

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
    window.localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSoulmateUnlocked(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.SOULMATE_BADGE) === 'true';
  } catch {
    return false;
  }
}

export function saveSoulmateUnlocked(unlocked: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.SOULMATE_BADGE, unlocked ? 'true' : 'false');
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
