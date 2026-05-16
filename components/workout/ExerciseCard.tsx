"use client";

import { Trash2, Plus } from "lucide-react";
import { Exercise, Set } from "@/lib/types";

interface Props {
  exercise: Exercise;
  index: number;
  onNameChange: (name: string) => void;
  onAddSet: () => void;
  onUpdateSet: (setId: string, field: keyof Set, value: number) => void;
  onRemoveSet: (setId: string) => void;
  onRemove: () => void;
}

export default function ExerciseCard({
  exercise,
  index,
  onNameChange,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onRemove,
}: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder={`Øvelse ${index + 1}, f.eks. Bænkpres`}
          value={exercise.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 px-1">
          <span>Sæt</span>
          <span>Reps</span>
          <span>Kg</span>
        </div>

        {exercise.sets.map((set, si) => (
          <div key={set.id} className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm text-gray-500 px-1 font-medium">#{si + 1}</span>
            <input
              type="number"
              min={0}
              value={set.reps || ""}
              onChange={(e) => onUpdateSet(set.id, "reps", Number(e.target.value))}
              placeholder="0"
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <div className="flex gap-1 items-center">
              <input
                type="number"
                min={0}
                step={0.5}
                value={set.weight || ""}
                onChange={(e) => onUpdateSet(set.id, "weight", Number(e.target.value))}
                placeholder="0"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button onClick={() => onRemoveSet(set.id)} className="text-red-300 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={onAddSet}
          className="text-blue-600 text-xs hover:underline flex items-center gap-1 px-1"
        >
          <Plus size={12} /> Tilføj sæt
        </button>
      </div>
    </div>
  );
}
