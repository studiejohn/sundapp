"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, UtensilsCrossed, Trash2 } from "lucide-react";
import { MealLog } from "@/lib/types";
import { totalNutrition, formatDate } from "@/lib/nutrition";
import NutritionBadge from "./NutritionBadge";

interface Props {
  byDate: Record<string, MealLog[]>;
  sortedDates: string[];
  onDelete: (id: string) => void;
}

export default function DayHistory({ byDate, sortedDates, onDelete }: Props) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <UtensilsCrossed size={40} className="mx-auto mb-3 opacity-30" />
        <p>Ingen måltider logget endnu</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedDates.map((date) => {
        const dayMeals = byDate[date];
        const dayTotal = totalNutrition(dayMeals.flatMap((m) => m.foods));
        const isExpanded = expandedDate === date;

        return (
          <div key={date} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedDate(isExpanded ? null : date)}
            >
              <div>
                <p className="font-semibold text-gray-800">{formatDate(date)}</p>
                <p className="text-xs text-gray-500">
                  {dayMeals.length} måltider · {Math.round(dayTotal.calories)} kcal
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex gap-1">
                  <NutritionBadge label="P" value={dayTotal.protein} unit="g" color="bg-blue-50" />
                  <NutritionBadge label="K" value={dayTotal.carbs} unit="g" color="bg-yellow-50" />
                  <NutritionBadge label="F" value={dayTotal.fat} unit="g" color="bg-red-50" />
                </div>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {dayMeals.map((meal) => (
                  <div key={meal.id} className="p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-gray-700 capitalize">{meal.mealType}</p>
                      <button onClick={() => onDelete(meal.id)} className="text-red-300 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {meal.foods.map((f) => (
                      <div key={f.id} className="text-sm text-gray-600 py-0.5 flex justify-between">
                        <span>
                          {f.name} <span className="text-gray-400">({f.amount})</span>
                        </span>
                        {f.nutritionLoaded && (
                          <span className="text-gray-400 text-xs">{Math.round(f.calories ?? 0)} kcal</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
