import { DateInput } from "@/components/ui";
import type { TimeFilter as TimeFilterType } from "@/features/history/hooks";

interface TimeFilterProps {
  /** Filtro activo actualmente */
  value: TimeFilterType;
  /** Callback cuando el usuario selecciona un filtro distinto */
  onChange: (v: TimeFilterType) => void;
  /** Fecha desde (para filtro rango) */
  dateFrom?: string;
  /** Fecha hasta (para filtro rango) */
  dateTo?: string;
  /** Callback cuando cambia la fecha desde */
  onDateFromChange?: (v: string) => void;
  /** Callback cuando cambia la fecha hasta */
  onDateToChange?: (v: string) => void;
}

/** Opciones disponibles para el filtro temporal */
const OPTIONS: { value: TimeFilterType; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "semana", label: "Semana" },
  { value: "hoy", label: "Hoy" },
  { value: "rango", label: "Rango" },
];

function TimeFilter({ value, onChange, dateFrom, dateTo, onDateFromChange, onDateToChange }: TimeFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
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
      {value === "rango" && (
        <div className="flex items-center gap-2">
          <DateInput
            value={dateFrom || ""}
            onChange={(v) => onDateFromChange?.(v)}
            className="w-40"
            inputSize="sm"
            placeholder="Desde"
          />
          <span className="text-text-secondary text-sm">—</span>
          <DateInput
            value={dateTo || ""}
            onChange={(v) => onDateToChange?.(v)}
            className="w-40"
            inputSize="sm"
            placeholder="Hasta"
          />
        </div>
      )}
    </div>
  );
}

export { TimeFilter };
