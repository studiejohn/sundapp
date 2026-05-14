import { WorkoutSession, MealLog } from "./types";

const WORKOUTS_KEY = "sundapp_workouts";
const MEALS_KEY = "sundapp_meals";

export function getWorkouts(): WorkoutSession[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(WORKOUTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveWorkout(session: WorkoutSession): void {
  const sessions = getWorkouts();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(sessions));
}

export function deleteWorkout(id: string): void {
  const sessions = getWorkouts().filter((s) => s.id !== id);
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(sessions));
}

export function getMeals(): MealLog[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMeal(meal: MealLog): void {
  const meals = getMeals();
  const idx = meals.findIndex((m) => m.id === meal.id);
  if (idx >= 0) meals[idx] = meal;
  else meals.unshift(meal);
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function deleteMeal(id: string): void {
  const meals = getMeals().filter((m) => m.id !== id);
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}
