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
  success: "bg-success-tint text-success border-success-tint",
  warning: "bg-warning-tint text-warning border-warning-tint",
  error: "bg-error-tint text-error border-error-tint",
  info: "bg-primary-tint text-primary border-primary-tint",
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
