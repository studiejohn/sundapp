import { SwipeRecord, UserPreferences, DEFAULT_PREFERENCES } from './types';

const SWIPE_KEY = 'boligswipe_history';
const PREFS_KEY = 'boligswipe_prefs';

export function getSwipeHistory(): SwipeRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SWIPE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSwipe(record: SwipeRecord): void {
  const history = getSwipeHistory();
  history.push(record);
  localStorage.setItem(SWIPE_KEY, JSON.stringify(history));
}

export function removeLastSwipe(): SwipeRecord | null {
  const history = getSwipeHistory();
  if (history.length === 0) return null;
  const last = history.pop()!;
  localStorage.setItem(SWIPE_KEY, JSON.stringify(history));
  return last;
}

export function getLikedIds(): Set<string> {
  return new Set(
    getSwipeHistory()
      .filter((r) => r.liked)
      .map((r) => r.propertyId)
  );
}

export function getSeenIds(): Set<string> {
  return new Set(getSwipeHistory().map((r) => r.propertyId));
}

export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function clearAll(): void {
  localStorage.removeItem(SWIPE_KEY);
  localStorage.removeItem(PREFS_KEY);
}
