interface Props {
  label: string;
  value?: number;
  unit: string;
  color: string;
}

export default function NutritionBadge({ label, value, unit, color }: Props) {
  return (
    <div className={`flex flex-col items-center px-3 py-1.5 rounded-lg ${color}`}>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-semibold text-sm">
        {value !== undefined ? `${Math.round(value)}${unit}` : "—"}
      </span>
    </div>
  );
}
