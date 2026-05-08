/** Indicador de carga animado. Usa el icono Loader2 de Lucide con spin de Tailwind.
 *  Tamaños: sm=14px, md=20px, lg=32px. */
import { Loader2 } from "lucide-react"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

// Mapa de tamaño → píxeles del icono
const sizeMap = { sm: 14, md: 20, lg: 32 }

function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return <Loader2 size={sizeMap[size]} className={`animate-spin ${className}`} />
}

export { Spinner }
export type { SpinnerProps }
