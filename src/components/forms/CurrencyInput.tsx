/**
 * Archivo: components/forms/CurrencyInput.tsx
 * Propósito: Input especializado para montos monetarios con prefijo "MXN $".
 * Solo acepta números, rango de 1000 a 200000, incrementos de 500.
 */
import { forwardRef } from "react"

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string
  autofilled?: boolean
}

/** Input con prefijo de moneda mexicana */
const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className = "", error, autofilled, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-stone-50 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
          {/* Prefijo de moneda */}
          <span className="px-3 py-2 bg-white border-r border-stone-200 font-semibold text-sm text-stone-500 whitespace-nowrap">
            MXN $
          </span>
          <input
             id={id}
             ref={ref}
             type="number"
             className={`
               flex-1 px-3 py-2 text-base font-semibold bg-transparent
               focus:outline-none placeholder:text-stone-400
               ${error ? "border-error-border" : ""}
               ${autofilled ? "bg-success-tint" : ""}
               ${className}
             `}
            step="500"
            min="1000"
            max="200000"
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-error" role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
export type { CurrencyInputProps }
