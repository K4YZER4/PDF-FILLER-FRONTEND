/**
 * Archivo: components/ui/Button.tsx
 * Propósito: Componente de botón reutilizable con variantes y estados.
 * Soporta diferentes tamaños, variantes (primary/secondary) y estado de carga.
 */
import { forwardRef } from "react"
import { Loader2 } from "lucide-react"

/** Variantes visuales del botón */
type ButtonVariant = "primary" | "secondary"

/** Tamaños disponibles para el botón */
type ButtonSize = "sm" | "md" | "lg"

/** Props del componente Button */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

/** Clases CSS para cada variante */
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active border border-transparent",
  secondary: "bg-white text-stone-900 hover:bg-stone-50 border border-stone-200",
}

/** Clases CSS para cada tamaño */
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-md",
}

/** Clases base compartidas por todos los botones */
const baseClasses =
  "inline-flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"

/** Ícono de spinner para estado de carga */
const SpinnerIcon = () => (
  <Loader2 className="animate-spin h-4 w-4" />
)

/** Componente Button con soporte para ref y estado de carga */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", loading, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <SpinnerIcon />}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
