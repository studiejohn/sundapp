"use client";

import { useState, useEffect } from "react";
import { Dumbbell, ClipboardList, Plus } from "lucide-react";
import { WorkoutSession, Exercise, Set } from "@/lib/types";
import { getWorkouts, saveWorkout, deleteWorkout } from "@/lib/storage";
import { generateId, today } from "@/lib/nutrition";
import ExerciseCard from "./workout/ExerciseCard";
import SessionHistory from "./workout/SessionHistory";

function emptySession(): WorkoutSession {
  return { id: generateId(), date: today(), name: "", exercises: [] };
}

export default function WorkoutTracker() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [view, setView] = useState<"log" | "history">("log");
  const [current, setCurrent] = useState<WorkoutSession>(emptySession);

  useEffect(() => {
    setSessions(getWorkouts());
  }, []);

  // Exercise mutations
  function addExercise() {
    const ex: Exercise = { id: generateId(), name: "", sets: [{ id: generateId(), reps: 0, weight: 0 }] };
    setCurrent((c) => ({ ...c, exercises: [...c.exercises, ex] }));
  }

  function updateExerciseName(exId: string, name: string) {
    setCurrent((c) => ({
      ...c,
      exercises: c.exercises.map((e) => (e.id === exId ? { ...e, name } : e)),
    }));
  }

  function removeExercise(exId: string) {
    setCurrent((c) => ({ ...c, exercises: c.exercises.filter((e) => e.id !== exId) }));
  }

  // Set mutations
  function addSet(exId: string) {
    setCurrent((c) => ({
      ...c,
      exercises: c.exercises.map((e) =>
        e.id === exId ? { ...e, sets: [...e.sets, { id: generateId(), reps: 0, weight: 0 }] } : e
      ),
    }));
  }

  function updateSet(exId: string, setId: string, field: keyof Set, value: number) {
    setCurrent((c) => ({
      ...c,
      exercises: c.exercises.map((e) =>
        e.id === exId
          ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)) }
          : e
      ),
    }));
  }

  function removeSet(exId: string, setId: string) {
    setCurrent((c) => ({
      ...c,
      exercises: c.exercises.map((e) =>
        e.id === exId ? { ...e, sets: e.sets.filter((s) => s.id !== setId) } : e
      ),
    }));
  }

  function handleSave() {
    if (!current.name.trim() || current.exercises.length === 0) return;
    saveWorkout(current);
    setSessions(getWorkouts());
    setCurrent(emptySession());
  }

  function handleDelete(id: string) {
    deleteWorkout(id);
    setSessions(getWorkouts());
  }

  const canSave = current.name.trim().length > 0 && current.exercises.length > 0;

  return (
    <div className="space-y-4">
      {/* Tab buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("log")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            view === "log" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Dumbbell size={16} /> Log træning
        </button>
        <button
          onClick={() => setView("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            view === "history" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <ClipboardList size={16} /> Historik ({sessions.length})
        </button>
      </div>

      {/* Log form */}
      {view === "log" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Træningsnavn</label>
              <input
                type="text"
                placeholder="f.eks. Bryst & Triceps"
                value={current.name}
                onChange={(e) => setCurrent((c) => ({ ...c, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dato</label>
              <input
                type="date"
                value={current.date}
                onChange={(e) => setCurrent((c) => ({ ...c, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {current.exercises.map((ex, ei) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                index={ei}
                onNameChange={(name) => updateExerciseName(ex.id, name)}
                onAddSet={() => addSet(ex.id)}
                onUpdateSet={(setId, field, value) => updateSet(ex.id, setId, field, value)}
                onRemoveSet={(setId) => removeSet(ex.id, setId)}
                onRemove={() => removeExercise(ex.id)}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={addExercise}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Plus size={16} /> Tilføj øvelse
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Gem træning
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {view === "history" && (
        <SessionHistory sessions={sessions} onDelete={handleDelete} />
      )}
    </div>
  );
}
