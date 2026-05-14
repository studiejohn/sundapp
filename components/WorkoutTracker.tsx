"use client";

import { useState, useEffect } from "react";
import { WorkoutSession, Exercise, Set } from "@/lib/types";
import { getWorkouts, saveWorkout, deleteWorkout } from "@/lib/storage";
import { Plus, Trash2, ChevronDown, ChevronUp, Dumbbell, Calendar, ClipboardList } from "lucide-react";

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

export default function WorkoutTracker() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [view, setView] = useState<"log" | "history">("log");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [current, setCurrent] = useState<WorkoutSession>({
    id: generateId(),
    date: today(),
    name: "",
    exercises: [],
  });

  useEffect(() => {
    setSessions(getWorkouts());
  }, []);

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

  function removeExercise(exId: string) {
    setCurrent((c) => ({ ...c, exercises: c.exercises.filter((e) => e.id !== exId) }));
  }

  function saveSession() {
    if (!current.name.trim() || current.exercises.length === 0) return;
    saveWorkout(current);
    const updated = getWorkouts();
    setSessions(updated);
    setCurrent({ id: generateId(), date: today(), name: "", exercises: [], notes: "" });
  }

  function handleDelete(id: string) {
    deleteWorkout(id);
    setSessions(getWorkouts());
  }

  return (
    <div className="space-y-4">
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
              <div key={ex.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder={`Øvelse ${ei + 1}, f.eks. Bænkpres`}
                    value={ex.name}
                    onChange={(e) => updateExerciseName(ex.id, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <button onClick={() => removeExercise(ex.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 px-1">
                    <span>Sæt</span>
                    <span>Reps</span>
                    <span>Kg</span>
                  </div>
                  {ex.sets.map((set, si) => (
                    <div key={set.id} className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-sm text-gray-500 px-1 font-medium">#{si + 1}</span>
                      <input
                        type="number"
                        min={0}
                        value={set.reps || ""}
                        onChange={(e) => updateSet(ex.id, set.id, "reps", Number(e.target.value))}
                        placeholder="0"
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          min={0}
                          step={0.5}
                          value={set.weight || ""}
                          onChange={(e) => updateSet(ex.id, set.id, "weight", Number(e.target.value))}
                          placeholder="0"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <button onClick={() => removeSet(ex.id, set.id)} className="text-red-300 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addSet(ex.id)}
                    className="text-blue-600 text-xs hover:underline flex items-center gap-1 px-1"
                  >
                    <Plus size={12} /> Tilføj sæt
                  </button>
                </div>
              </div>
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
              onClick={saveSession}
              disabled={!current.name.trim() || current.exercises.length === 0}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Gem træning
            </button>
          </div>
        </div>
      )}

      {view === "history" && (
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
              <p>Ingen træninger logget endnu</p>
            </div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <Dumbbell size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(s.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {s.exercises.length} øvelser
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                      className="text-red-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                    {expandedId === s.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                {expandedId === s.id && (
                  <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
                    {s.exercises.map((ex) => (
                      <div key={ex.id}>
                        <p className="font-medium text-gray-700 mb-1">{ex.name}</p>
                        <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 mb-1 px-1">
                          <span>Sæt</span><span>Reps</span><span>Kg</span>
                        </div>
                        {ex.sets.map((set, si) => (
                          <div key={set.id} className="grid grid-cols-3 gap-1 text-sm px-1 py-0.5">
                            <span className="text-gray-400">#{si + 1}</span>
                            <span className="font-medium">{set.reps}</span>
                            <span className="font-medium">{set.weight} kg</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
