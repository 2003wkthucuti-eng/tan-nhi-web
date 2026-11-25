import type { CharacterItem } from '../App';

const INTERACTIONS_STORAGE_KEY = 'tannhi_char_interactions_v1';

export interface TrendingCharacterEntry {
  character: CharacterItem;
  rank: 1 | 2 | 3;
  views: number;
  interactions: number;
}

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// Điểm nhấn độ phổ biến giả lập ban đầu cho một số gương mặt tiêu biểu, cộng thêm biến thiên ổn định theo ID
const FEATURED_BASE_WEIGHTS: Record<string, number> = {
  'luc-tu-than': 1580,
  'tham-canh-tham': 1490,
  'tong-canh-ngon': 1435,
  'lang-van-triet': 1370,
  'mac-bac': 1320,
  'tan-tram': 1285,
  'lucien-devereux': 1240,
  'bui-tu-han': 1210,
};

export function getSimulatedBaseMetrics(character: CharacterItem): {
  baseViews: number;
  baseInteractions: number;
} {
  const hash = hashString(character.id);
  const featuredBase = FEATURED_BASE_WEIGHTS[character.id];
  const baseViews = featuredBase
    ? featuredBase + (hash % 47)
    : 520 + (hash % 640);
  const baseInteractions = Math.round(baseViews * (0.28 + ((hash % 15) / 100)));

  return { baseViews, baseInteractions };
}

export function loadCharacterInteractions(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(INTERACTIONS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const cleaned: Record<string, number> = {};
    for (const [key, val] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof val === 'number' && Number.isFinite(val) && val > 0) {
        cleaned[key] = Math.floor(val);
      }
    }
    return cleaned;
  } catch {
    return {};
  }
}

export function saveCharacterInteractions(map: Record<string, number>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(INTERACTIONS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Bỏ qua nếu bộ nhớ trình duyệt bị giới hạn
  }
}

export function getTopTrendingCharacters(
  characters: CharacterItem[],
  liveInteractions: Record<string, number>,
  limit = 3
): TrendingCharacterEntry[] {
  const ranked = characters
    .map((character) => {
      const { baseViews, baseInteractions } = getSimulatedBaseMetrics(character);
      const userBonus = liveInteractions[character.id] ?? 0;
      const views = baseViews + userBonus;
      const interactions = baseInteractions + userBonus;
      return {
        character,
        views,
        interactions,
      };
    })
    .sort((a, b) => b.views - a.views || b.interactions - a.interactions)
    .slice(0, limit);

  return ranked.map((item, idx) => ({
    ...item,
    rank: (idx + 1) as 1 | 2 | 3,
  }));
}
