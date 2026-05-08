/** Botón reutilizable con variantes (primary/secondary), tamaños y estado de carga.
 *  Si loading=true, muestra un spinner y deshabilita el botón. */
import { forwardRef } from "react"
import { Loader2 } from "lucide-react"

// Tipos de variante visual y tamaño
type ButtonVariant = "primary" | "secondary"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

// Clases Tailwind para cada variante
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover border border-transparent",
  secondary: "bg-white text-stone-900 hover:bg-stone-50 border border-border",
}

// Clases Tailwind para cada tamaño
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-md",
}

// Clases base compartidas por todos los botones
const baseClasses =
  "inline-flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin h-4 w-4" />}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
