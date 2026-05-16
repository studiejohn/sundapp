"use client";

import { Trash2 } from "lucide-react";
import { FoodEntry } from "@/lib/types";
import { totalNutrition } from "@/lib/nutrition";

interface Props {
  foods: FoodEntry[];
  onRemove: (id: string) => void;
  onSave: () => void;
}

export default function FoodList({ foods, onRemove, onSave }: Props) {
  if (foods.length === 0) return null;

  const total = totalNutrition(foods);
  const hasNutrition = foods.some((f) => f.nutritionLoaded);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-600">Tilføjede madevarer:</p>

      {foods.map((f) => (
        <div
          key={f.id}
          className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {f.name}{" "}
              <span className="text-gray-400 font-normal">({f.amount})</span>
            </p>
            {f.nutritionLoaded ? (
              <p className="text-xs text-gray-500">
                {Math.round(f.calories ?? 0)} kcal · P: {Math.round(f.protein ?? 0)}g · K:{" "}
                {Math.round(f.carbs ?? 0)}g · F: {Math.round(f.fat ?? 0)}g
                <span className="ml-1 text-green-600">✨ AI</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400">Ingen næringsdata</p>
            )}
          </div>
          <button onClick={() => onRemove(f.id)} className="text-red-300 hover:text-red-500 ml-2">
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {hasNutrition && (
        <div className="bg-green-50 rounded-lg px-3 py-2 text-xs text-green-700">
          {Math.round(total.calories)} kcal · Protein: {Math.round(total.protein)}g · Kulhydrater:{" "}
          {Math.round(total.carbs)}g · Fedt: {Math.round(total.fat)}g
        </div>
      )}

      <button
        onClick={onSave}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
      >
        Gem måltid
      </button>
    </div>
  );
}
