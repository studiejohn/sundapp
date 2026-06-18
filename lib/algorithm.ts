import { Property, SwipeRecord, UserPreferences } from './types';

export function getRecommendedStack(
  allProperties: Property[],
  swipeHistory: SwipeRecord[],
  preferences: UserPreferences
): Property[] {
  const seenIds = new Set(swipeHistory.map((r) => r.propertyId));
  const likedIds = new Set(swipeHistory.filter((r) => r.liked).map((r) => r.propertyId));
  const likedProperties = allProperties.filter((p) => likedIds.has(p.id));

  const unseen = allProperties.filter((p) => {
    if (seenIds.has(p.id)) return false;
    if (p.price < preferences.minPrice || p.price > preferences.maxPrice) return false;
    if (p.rooms < preferences.minRooms || p.rooms > preferences.maxRooms) return false;
    if (p.area < preferences.minArea || p.area > preferences.maxArea) return false;
    if (!preferences.types.includes(p.type)) return false;
    return true;
  });

  if (likedProperties.length === 0) {
    return shuffle(unseen);
  }

  return unseen
    .map((p) => ({ property: p, score: scoreProperty(p, likedProperties) }))
    .sort((a, b) => b.score - a.score)
    .map((s) => s.property);
}

function scoreProperty(property: Property, liked: Property[]): number {
  const avgPrice = liked.reduce((s, p) => s + p.price, 0) / liked.length;
  const priceDiff = Math.abs(property.price - avgPrice) / avgPrice;
  const priceScore = Math.max(0, 1 - priceDiff);

  const typeCounts: Record<string, number> = {};
  liked.forEach((p) => { typeCounts[p.type] = (typeCounts[p.type] || 0) + 1; });
  const typeScore = (typeCounts[property.type] || 0) / liked.length;

  const avgArea = liked.reduce((s, p) => s + p.area, 0) / liked.length;
  const areaDiff = Math.abs(property.area - avgArea) / avgArea;
  const areaScore = Math.max(0, 1 - areaDiff);

  const cityCounts: Record<string, number> = {};
  liked.forEach((p) => { cityCounts[p.city] = (cityCounts[p.city] || 0) + 1; });
  const cityScore = (cityCounts[property.city] || 0) / liked.length;

  const avgRooms = liked.reduce((s, p) => s + p.rooms, 0) / liked.length;
  const roomsDiff = Math.abs(property.rooms - avgRooms) / avgRooms;
  const roomsScore = Math.max(0, 1 - roomsDiff);

  return (
    priceScore * 0.30 +
    typeScore * 0.25 +
    areaScore * 0.20 +
    cityScore * 0.15 +
    roomsScore * 0.10
  );
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
