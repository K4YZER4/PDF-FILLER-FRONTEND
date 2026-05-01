/**
 * Archivo: components/feedback/ScanStatus.tsx
 * Propósito: Badge que muestra el estado del proceso de escaneo OCR.
 * Cambia de color e icono según el estado (idle, scanning, done, error).
 */
import type { ScanStatus } from "@/types"

interface ScanStatusBadgeProps {
  status: ScanStatus
  idleText?: string       // Texto cuando no se ha escaneado
  scanningText?: string   // Texto durante el escaneo
  doneText?: string       // Texto cuando terminó exitosamente
  errorText?: string      // Texto cuando hubo un error
}

/** Configuración visual para cada estado de escaneo */
const statusConfig: Record<ScanStatus, { classes: string; icon: string }> = {
  idle: {
    classes: "bg-stone-50 text-stone-400 border border-stone-200",
    icon: "\u2014",
  },
  scanning: {
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: "\u23F3",
  },
  done: {
    classes: "bg-green-50 text-green-700 border border-green-200",
    icon: "\u2713",
  },
  error: {
    classes: "bg-red-50 text-red-700 border border-red-200",
    icon: "\u2717",
  },
}

/** Badge que indica el estado del escaneo OCR */
function ScanStatusBadge({
  status,
  idleText = "Sin escanear",
  scanningText = "Escaneando...",
  doneText = "Escaneado",
  errorText = "Error",
}: ScanStatusBadgeProps) {
  const config = statusConfig[status]
  const textMap: Record<ScanStatus, string> = {
    idle: idleText,
    scanning: scanningText,
    done: doneText,
    error: errorText,
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${config.classes}`}>
      <span>{config.icon}</span>
      {textMap[status]}
    </span>
  )
}

export { ScanStatusBadge }
export type { ScanStatusBadgeProps }
