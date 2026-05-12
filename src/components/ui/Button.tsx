/**
 * Archivo: shared/components/Button.tsx
 * Propósito: Botón reutilizable y agnóstico al dominio.
 *
 * Variantes visuales:
 *   primary   → morado sólido, texto blanco (acción principal)
 *   secondary → fondo blanco, borde gris (acción secundaria)
 *   outline   → fondo transparente, borde morado, texto morado
 *   ghost     → sin fondo ni borde, solo texto (acciones terciarias)
 *   danger    → rojo sólido (acciones destructivas como "Eliminar")
 *
 * Tamaños:
 *   sm → compacto para acciones en listas o tablas
 *   md → tamaño por defecto para la mayoría de contextos
 *   lg → formularios y CTAs principales (ej: "Iniciar sesión")
 *
 * Props especiales:
 *   loading    → muestra spinner y deshabilita el botón
 *   leftIcon   → ícono antes del texto (ej: <Plus size={16} />)
 *   rightIcon  → ícono después del texto
 *   fullWidth  → ocupa el 100% del contenedor padre
 */
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estilo visual del botón. Default: "primary" */
  variant?: ButtonVariant;
  /** Tamaño del botón. Default: "md" */
  size?: ButtonSize;
  /** Muestra un spinner y deshabilita el botón mientras carga */
  loading?: boolean;
  /** Ícono que aparece a la izquierda del texto */
  leftIcon?: React.ReactNode;
  /** Ícono que aparece a la derecha del texto */
  rightIcon?: React.ReactNode;
  /** Si true, el botón ocupa el 100% del ancho del contenedor */
  fullWidth?: boolean;
}

// ─── Clases por variante ─────────────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  /**
   * Acción principal — "Iniciar sesión", "Crear contrato", "Generar PDF"
   * Fondo morado sólido, texto blanco
   */
  primary: [
    "bg-primary text-white border border-transparent",
    "hover:bg-primary-hover",
    "active:bg-primary-active",
    "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
  ].join(" "),

  /**
   * Acción secundaria — "Volver", "Cancelar", "Limpiar"
   * Fondo blanco, borde gris
   */
  secondary: [
    "bg-primary text-white border border-transparent",
    "hover:bg-primary-hover",
    "active:bg-primary-active",
    "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
  ].join(" "),

  /**
   * Acción de apoyo — "Escanear documentos", "Calcular tabla"
   * Sin fondo, borde morado, texto morado
   */
  outline: [
    "bg-transparent text-primary border border-primary",
    "hover:bg-primary-tint",
    "active:bg-primary-tint",
    "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
  ].join(" "),

  /**
   * Acción terciaria — links de texto como "¿Olvidaste tu contraseña?"
   * Sin fondo ni borde, solo texto morado
   */
  ghost: [
    "bg-transparent text-primary border border-transparent",
    "hover:bg-primary-tint",
    "active:bg-primary-tint",
    "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
  ].join(" "),

  /**
   * Acción destructiva — "Eliminar contrato", "Borrar datos"
   * Fondo rojo, texto blanco
   */
  danger: [
    "bg-error text-white border border-transparent",
    "hover:bg-error/90",
    "active:bg-error/80",
    "focus-visible:ring-2 focus-visible:ring-error/40 focus-visible:outline-none",
  ].join(" "),
};

// ─── Clases por tamaño ────────────────────────────────────────────────────────

const sizeClasses: Record<ButtonSize, string> = {
  /**
   * Compacto — para acciones dentro de cards, listas o tablas
   * Mínimo 36px de alto para cumplir tap target en móvil
   */
  sm: "px-3 py-2 text-xs rounded-md min-h-[36px]",

  /**
   * Default — la mayoría de botones en formularios y barras de acción
   * Mínimo 40px de alto
   */
  md: "px-4 py-2.5 text-sm rounded-md min-h-[40px]",

  /**
   * Grande — CTAs principales como "Iniciar sesión", "Generar contrato"
   * Mínimo 48px de alto — tap target óptimo en móvil según Apple HIG
   */
  lg: "px-6 py-3 text-base rounded-lg min-h-[48px]",
};

// ─── Clases base ─────────────────────────────────────────────────────────────

/**
 * Clases compartidas por todas las variantes y tamaños.
 * - inline-flex + items-center + justify-center: centra contenido
 * - gap-2: espacio entre ícono y texto
 * - font-medium: peso visual consistente
 * - transition-all: animación suave en hover/active
 * - select-none: evita selección de texto al hacer clic rápido
 * - disabled:opacity-50: opacidad 50% cuando está deshabilitado
 * - disabled:cursor-not-allowed: cursor de prohibido
 * - disabled:pointer-events-none: evita hover effects en disabled
 */
const baseClasses = [
  "inline-flex items-center justify-center gap-2",
  "font-medium transition-all duration-150",
  "select-none",
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
].join(" ");

// ─── Componente ───────────────────────────────────────────────────────────────

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    /**
     * El botón se deshabilita si:
     * 1. disabled=true es pasado explícitamente por el padre
     * 2. loading=true — evita múltiples submits mientras carga
     */
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          // fullWidth ocupa todo el ancho del contenedor padre
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {/**
         * Spinner de carga — reemplaza el ícono izquierdo cuando loading=true
         * Usa el mismo espacio que leftIcon para evitar saltos de layout
         */}
        {loading ? (
          <Loader2
            className="animate-spin shrink-0"
            size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
            aria-hidden="true"
          />
        ) : (
          leftIcon && (
            <span className="shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}

        {/**
         * Texto del botón — siempre visible
         * El padre pasa el texto como children: <Button>Iniciar sesión</Button>
         */}
        {children}

        {/**
         * Ícono derecho — solo aparece si no está cargando
         * Útil para íconos de flecha, chevron o acciones secundarias
         */}
        {!loading && rightIcon && (
          <span className="shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
