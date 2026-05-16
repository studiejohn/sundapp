"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus } from "lucide-react";
import { MealLog, FoodEntry } from "@/lib/types";
import { getMeals, saveMeal, deleteMeal } from "@/lib/storage";
import { totalNutrition, today, generateId } from "@/lib/nutrition";
import FoodForm from "./nutrition/FoodForm";
import FoodList from "./nutrition/FoodList";
import DayHistory from "./nutrition/DayHistory";
import NutritionBadge from "./nutrition/NutritionBadge";

const MEAL_TYPES: { value: MealLog["mealType"]; label: string }[] = [
  { value: "morgenmad", label: "Morgenmad" },
  { value: "frokost", label: "Frokost" },
  { value: "aftensmad", label: "Aftensmad" },
  { value: "snack", label: "Snack" },
];

export default function NutritionTracker() {
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [view, setView] = useState<"log" | "history">("log");
  const [selectedDate, setSelectedDate] = useState(today());
  const [selectedMealType, setSelectedMealType] = useState<MealLog["mealType"]>("morgenmad");
  const [currentFoods, setCurrentFoods] = useState<FoodEntry[]>([]);

  useEffect(() => {
    setMeals(getMeals());
  }, []);

  function handleSave() {
    if (currentFoods.length === 0) return;
    const meal: MealLog = {
      id: generateId(),
      date: selectedDate,
      mealType: selectedMealType,
      foods: currentFoods,
    };
    saveMeal(meal);
    setMeals(getMeals());
    setCurrentFoods([]);
  }

  function handleDelete(id: string) {
    deleteMeal(id);
    setMeals(getMeals());
  }

  const byDate = meals.reduce((acc: Record<string, MealLog[]>, m) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(m);
    return acc;
  }, {});
  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  const todayMeals = byDate[today()] ?? [];
  const todayTotal = totalNutrition(todayMeals.flatMap((m) => m.foods));

  return (
    <div className="space-y-4">
      {/* Tab buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("log")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            view === "log" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Plus size={16} /> Log mad
        </button>
        <button
          onClick={() => setView("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            view === "history" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Calendar size={16} /> Historik ({meals.length})
        </button>
      </div>

      {/* Today's summary */}
      {view === "log" && todayMeals.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm font-medium text-green-800 mb-2">I dag i alt</p>
          <div className="flex gap-2 flex-wrap">
            <NutritionBadge label="Kalorier" value={todayTotal.calories} unit=" kcal" color="bg-white" />
            <NutritionBadge label="Protein" value={todayTotal.protein} unit="g" color="bg-white" />
            <NutritionBadge label="Kulhydrater" value={todayTotal.carbs} unit="g" color="bg-white" />
            <NutritionBadge label="Fedt" value={todayTotal.fat} unit="g" color="bg-white" />
          </div>
        </div>
      )}

      {/* Log form */}
      {view === "log" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Måltid</label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value as MealLog["mealType"])}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {MEAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dato</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <FoodForm onAdd={(food) => setCurrentFoods((f) => [...f, food])} />
          <FoodList
            foods={currentFoods}
            onRemove={(id) => setCurrentFoods((f) => f.filter((fi) => fi.id !== id))}
            onSave={handleSave}
          />
        </div>
      )}

      {/* History */}
      {view === "history" && (
        <DayHistory byDate={byDate} sortedDates={sortedDates} onDelete={handleDelete} />
      )}
    </div>
  );
}
