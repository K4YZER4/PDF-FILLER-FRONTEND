/**
 * Archivo: components/ui/Input.tsx
 * Propósito: Componente de input reutilizable con estados de error y autollenado.
 * Cambia el borde a rojo si hay error o verde si fue autollenado por OCR.
 */
import { forwardRef } from "react"

/** Props del componente Input */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string        // Mensaje de error a mostrar
  autofilled?: boolean  // Si el campo fue llenado automáticamente por OCR
}

/** Input con soporte para ref, mensajes de error y estado de autollenado */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, autofilled, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0.5">
        <input
          id={id}
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm rounded-md border border-stone-200 bg-stone-50 text-stone-900
            transition-all placeholder:text-stone-400
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
            ${error ? "border-error-border focus:border-error focus:ring-error/15" : ""}
            ${autofilled ? "border-success-border bg-success-tint" : ""}
            ${className}
          `}
          {...props}
        />
          {error && (
            <span className="text-xs text-error" role="alert">
              {error}
            </span>
          )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
export type { InputProps }
