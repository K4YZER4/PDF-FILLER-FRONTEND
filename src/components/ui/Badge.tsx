/**
 * Archivo: components/ui/Badge.tsx
 * Propósito: Componente de insignia (badge) para estados y etiquetas.
 * Se usa para mostrar estados de escaneo, validación y otros indicadores.
 */
type BadgeVariant = "success" | "warning" | "error" | "info"

/** Props del componente Badge */
interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

/** Clases CSS para cada variante de badge */
const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-teal-50 text-teal-800 border-teal-200",
}

/** Badge con diferentes variantes de color según el estado */
function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border
        ${variantClasses[variant]} ${className}
      `}
    >
      {children}
    </span>
  )
}

export { Badge }
export type { BadgeVariant, BadgeProps }
