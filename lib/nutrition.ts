import { FoodEntry } from "./types";

export function totalNutrition(foods: FoodEntry[]) {
  return foods.reduce(
    (acc, f) => ({
      calories: acc.calories + (f.calories ?? 0),
      protein: acc.protein + (f.protein ?? 0),
      carbs: acc.carbs + (f.carbs ?? 0),
      fat: acc.fat + (f.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("da-DK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function generateId() {
  return Math.random().toString(36).slice(2, 9);
}
