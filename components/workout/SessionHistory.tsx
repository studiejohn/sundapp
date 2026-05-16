"use client";

import { useState } from "react";
import { Dumbbell, Calendar, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { WorkoutSession } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("da-DK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface Props {
  sessions: WorkoutSession[];
  onDelete: (id: string) => void;
}

export default function SessionHistory({ sessions, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
        <p>Ingen træninger logget endnu</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((s) => (
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
                onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                className="text-red-300 hover:text-red-500 p-1"
              >
                <Trash2 size={15} />
              </button>
              {expandedId === s.id ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </div>
          </div>

          {expandedId === s.id && (
            <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
              {s.exercises.map((ex) => (
                <div key={ex.id}>
                  <p className="font-medium text-gray-700 mb-1">{ex.name}</p>
                  <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 mb-1 px-1">
                    <span>Sæt</span>
                    <span>Reps</span>
                    <span>Kg</span>
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
      ))}
    </div>
  );
}
