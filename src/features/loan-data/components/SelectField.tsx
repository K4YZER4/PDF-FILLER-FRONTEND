/**
 * Archivo: features/loan-data/components/SelectField.tsx
 *
 * Select nativo estilizado consistente con el Input del design system.
 *
 * Diferencias con el select HTML por defecto:
 *   - Estados visuales success/error (borde verde/rojo)
 *   - Placeholder con opción deshabilitada
 *   - Flecha decorativa con SVG (no la flecha nativa del SO)
 *   - id explícito (no aleatorio) para accesibilidad y reconciliación de React
 */
import { cn } from "@/utils/cn"

interface SelectFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
  disabled?: boolean
  success?: boolean
  error?: string
}

function SelectField({
  id, value, onChange, options,
  placeholder, disabled, success, error,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-md border px-3 py-2 text-sm",
            "bg-surface text-text-primary",
            "transition-all duration-150 appearance-none pr-8",
            "focus:outline-none focus:ring-2",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            success && !error && "border-success focus:border-success focus:ring-success/15",
            error           && "border-error  focus:border-error  focus:ring-error/15",
            !success && !error && "border-border focus:border-primary focus:ring-primary/15",
          )}
          aria-invalid={!!error}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" className="text-text-secondary">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs text-error">{error}</p>
      )}
    </div>
  )
}

export { SelectField }
