"use client";

import { useState, useEffect } from "react";
import { MealLog, FoodEntry } from "@/lib/types";
import { getMeals, saveMeal, deleteMeal } from "@/lib/storage";
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, UtensilsCrossed, Calendar, Loader2 } from "lucide-react";

const MEAL_TYPES: { value: MealLog["mealType"]; label: string }[] = [
  { value: "morgenmad", label: "Morgenmad" },
  { value: "frokost", label: "Frokost" },
  { value: "aftensmad", label: "Aftensmad" },
  { value: "snack", label: "Snack" },
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("da-DK", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function NutritionBadge({ label, value, unit, color }: { label: string; value?: number; unit: string; color: string }) {
  return (
    <div className={`flex flex-col items-center px-3 py-1.5 rounded-lg ${color}`}>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-semibold text-sm">{value !== undefined ? `${Math.round(value)}${unit}` : "—"}</span>
    </div>
  );
}

function totalNutrition(foods: FoodEntry[]) {
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

function FoodForm({ onAdd }: { onAdd: (food: FoodEntry) => void }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("100g");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(withAI: boolean) {
    if (!name.trim()) return;
    setError("");

    const food: FoodEntry = {
      id: generateId(),
      name: name.trim(),
      amount: amount.trim(),
      nutritionLoaded: false,
    };

    if (withAI) {
      setLoading(true);
      try {
        const res = await fetch("/api/nutrition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foodName: name.trim(), amount: amount.trim() }),
        });
        if (!res.ok) throw new Error("API fejl");
        const data = await res.json();
        food.calories = data.calories;
        food.protein = data.protein;
        food.carbs = data.carbs;
        food.fat = data.fat;
        food.nutritionLoaded = true;
      } catch {
        setError("Kunne ikke hente næringsværdier. Tilføjer uden.");
        food.nutritionLoaded = false;
      } finally {
        setLoading(false);
      }
    }

    onAdd(food);
    setName("");
    setAmount("100g");
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">{error}</p>}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Madevare, f.eks. Havregryn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(true); }}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Mængde"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleAdd(true)}
          disabled={!name.trim() || loading}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-40 transition-colors"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          Tilføj med AI-næring
        </button>
        <button
          onClick={() => handleAdd(false)}
          disabled={!name.trim() || loading}
          className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          <Plus size={15} /> Tilføj uden
        </button>
      </div>
    </div>
  );
}

export default function NutritionTracker() {
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [view, setView] = useState<"log" | "history">("log");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(today());
  const [selectedMealType, setSelectedMealType] = useState<MealLog["mealType"]>("morgenmad");
  const [currentFoods, setCurrentFoods] = useState<FoodEntry[]>([]);

  useEffect(() => {
    setMeals(getMeals());
  }, []);

  function addFood(food: FoodEntry) {
    setCurrentFoods((f) => [...f, food]);
  }

  function removeFood(id: string) {
    setCurrentFoods((f) => f.filter((fi) => fi.id !== id));
  }

  function saveMealLog() {
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

  // Group meals by date for history
  const byDate = meals.reduce((acc: Record<string, MealLog[]>, m) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(m);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  const todayMeals = byDate[today()] || [];
  const todayTotal = totalNutrition(todayMeals.flatMap((m) => m.foods));

  return (
    <div className="space-y-4">
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
      {todayMeals.length > 0 && view === "log" && (
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

          <FoodForm onAdd={addFood} />

          {currentFoods.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Tilføjede madevarer:</p>
              {currentFoods.map((f) => (
                <div key={f.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{f.name} <span className="text-gray-400 font-normal">({f.amount})</span></p>
                    {f.nutritionLoaded ? (
                      <p className="text-xs text-gray-500">
                        {Math.round(f.calories ?? 0)} kcal · P: {Math.round(f.protein ?? 0)}g · K: {Math.round(f.carbs ?? 0)}g · F: {Math.round(f.fat ?? 0)}g
                        <span className="ml-1 text-green-600">✨ AI</span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Ingen næringsdata</p>
                    )}
                  </div>
                  <button onClick={() => removeFood(f.id)} className="text-red-300 hover:text-red-500 ml-2">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {currentFoods.some((f) => f.nutritionLoaded) && (
                <div className="flex gap-2 bg-green-50 rounded-lg px-3 py-2 text-xs text-green-700">
                  {(() => {
                    const t = totalNutrition(currentFoods);
                    return <span>{Math.round(t.calories)} kcal · Protein: {Math.round(t.protein)}g · Kulhydrater: {Math.round(t.carbs)}g · Fedt: {Math.round(t.fat)}g</span>;
                  })()}
                </div>
              )}

              <button
                onClick={saveMealLog}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Gem måltid
              </button>
            </div>
          )}
        </div>
      )}

      {view === "history" && (
        <div className="space-y-4">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <UtensilsCrossed size={40} className="mx-auto mb-3 opacity-30" />
              <p>Ingen måltider logget endnu</p>
            </div>
          ) : (
            sortedDates.map((date) => {
              const dayMeals = byDate[date];
              const dayTotal = totalNutrition(dayMeals.flatMap((m) => m.foods));
              const isExpanded = expandedId === date;
              return (
                <div key={date} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedId(isExpanded ? null : date)}
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
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {dayMeals.map((meal) => (
                        <div key={meal.id} className="p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-gray-700 capitalize">{meal.mealType}</p>
                            <button onClick={() => handleDelete(meal.id)} className="text-red-300 hover:text-red-500">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {meal.foods.map((f) => (
                            <div key={f.id} className="text-sm text-gray-600 py-0.5 flex justify-between">
                              <span>{f.name} <span className="text-gray-400">({f.amount})</span></span>
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
            })
          )}
        </div>
      )}
    </div>
  );
}
