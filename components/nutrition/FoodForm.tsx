"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Loader2, Sparkles } from "lucide-react";
import { FoodEntry } from "@/lib/types";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function FoodForm({ onAdd }: { onAdd: (food: FoodEntry) => void }) {
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
      {error && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">{error}</p>
      )}
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
