import type { TimeFilter as TimeFilterType } from "@/features/history/hooks";

interface TimeFilterProps {
  /** Filtro activo actualmente */
  value: TimeFilterType;
  /** Callback cuando el usuario selecciona un filtro distinto */
  onChange: (v: TimeFilterType) => void;
}

/** Opciones disponibles para el filtro temporal */
const OPTIONS: { value: TimeFilterType; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "semana", label: "Semana" },
  { value: "hoy", label: "Hoy" },
];

function TimeFilter({ value, onChange }: TimeFilterProps) {
  return (
    <div className="flex gap-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
            value === opt.value
              ? "bg-primary text-white shadow-sm"
              : "bg-surface text-text-secondary border border-border hover:bg-bg-dark"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export { TimeFilter };
