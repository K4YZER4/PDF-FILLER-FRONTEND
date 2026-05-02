/**
 * Archivo: components/ui/Spinner.tsx
 * Propósito: Componente de spinner animado para indicar carga.
 * Se usa durante procesos de escaneo OCR y generación de PDF.
 */
import { Loader2 } from "lucide-react"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

/** Mapa de tamaños para el spinner */
const sizeMap = {
  sm: 14,
  md: 20,
  lg: 32,
}

/** Spinner animado con diferentes tamaños */
function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <Loader2
      size={sizeMap[size]}
      className={`animate-spin ${className}`}
    />
  )
}

export { Spinner }
export type { SpinnerProps }
