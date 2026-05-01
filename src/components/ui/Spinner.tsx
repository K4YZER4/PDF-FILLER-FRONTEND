/**
 * Archivo: components/ui/Spinner.tsx
 * Propósito: Componente de spinner animado para indicar carga.
 * Se usa durante procesos de escaneo OCR y generación de PDF.
 */
interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

/** Mapa de tamaños para el spinner */
const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-8 w-8",
}

/** Spinner animado con diferentes tamaños */
function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${sizeMap[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export { Spinner }
export type { SpinnerProps }
