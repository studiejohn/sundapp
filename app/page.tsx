"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Dumbbell, UtensilsCrossed } from "lucide-react";

const WorkoutTracker = dynamic(() => import("@/components/WorkoutTracker"), { ssr: false });
const NutritionTracker = dynamic(() => import("@/components/NutritionTracker"), { ssr: false });

export default function Home() {
  const [tab, setTab] = useState<"workout" | "nutrition">("workout");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">SundApp</h1>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setTab("workout")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                tab === "workout"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Dumbbell size={17} />
              Træning
            </button>
            <button
              onClick={() => setTab("nutrition")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                tab === "nutrition"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UtensilsCrossed size={17} />
              Mad & Næring
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {tab === "workout" ? <WorkoutTracker /> : <NutritionTracker />}
      </main>
    </div>
  );
}
