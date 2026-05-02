/**
 * Archivo: components/ui/Select.tsx
 * Propósito: Componente de selección (dropdown) reutilizable.
 * Soporta opciones dinámicas, placeholder, error y estado de autollenado.
 */
import { forwardRef } from "react"

/** Opcion para el componente Select */
interface SelectOption {
  label: string
  value: string
}

/** Props del componente Select */
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[]
  error?: string
  autofilled?: boolean
  placeholder?: string
}

/** Select con soporte para ref y estados visuales */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", options, error, autofilled, placeholder, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0.5">
        <select
          id={id}
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm rounded-md border border-stone-200 bg-stone-50 text-stone-900
            transition-all
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
            ${error ? "border-error-border focus:border-error focus:ring-error/15" : ""}
            ${autofilled ? "border-success-border bg-success-tint" : ""}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
          {error && (
            <span className="text-xs text-error" role="alert">
              {error}
            </span>
          )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select }
export type { SelectProps, SelectOption }
