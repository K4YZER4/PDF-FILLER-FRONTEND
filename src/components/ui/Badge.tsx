/** Etiqueta de estado con variantes de color.
 *  success → verde | warning → naranja | error → rojo | info → morado.
 *  Útil para badges de estado en contratos y documentos. */
// TODO: Este componente no se usa de momento, despues se implementara
type BadgeVariant = "success" | "warning" | "error" | "info";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

// Mapa de variante → clases Tailwind
const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success-tint text-success border-success-tint",
  warning: "bg-warning-tint text-warning border-warning-tint",
  error: "bg-error-tint text-error border-error-tint",
  info: "bg-primary-tint text-primary border-primary-tint",
};

function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeVariant, BadgeProps };
