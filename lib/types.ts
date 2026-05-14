export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Set {
  id: string;
  reps: number;
  weight: number; // kg
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO date string
  name: string;
  exercises: Exercise[];
  notes?: string;
}

export interface FoodEntry {
  id: string;
  name: string;
  amount: string; // e.g. "100g", "1 stk", "2 dl"
  calories?: number;
  protein?: number; // g
  carbs?: number;   // g
  fat?: number;     // g
  nutritionLoaded: boolean;
}

export interface MealLog {
  id: string;
  date: string; // ISO date string
  mealType: "morgenmad" | "frokost" | "aftensmad" | "snack";
  foods: FoodEntry[];
}
