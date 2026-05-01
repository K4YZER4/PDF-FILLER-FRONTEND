/**
 * Archivo: components/feedback/Toast.tsx
 * Propósito: Notificación toast que se auto-oculta tras un tiempo.
 * Soporta tipos success, error e info con iconos y colores distintos.
 */
import { useEffect, useState } from "react"

type ToastType = "success" | "error" | "info"

interface ToastProps {
  message: string
  type: ToastType
  duration?: number    // Tiempo en ms antes de ocultarse (default: 4000)
  onClose: () => void  // Callback cuando se cierra el toast
}

/** Configuración visual para cada tipo de toast */
const typeConfig: Record<ToastType, { borderClass: string; icon: string }> = {
  success: { borderClass: "border-l-green-600", icon: "\u2713" },
  error: { borderClass: "border-l-red-600", icon: "\u2717" },
  info: { borderClass: "border-l-teal-800", icon: "\u2139" },
}

/** Componente Toast con animación de entrada y salida */
function Toast({ message, type, duration = 4000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)
  const config = typeConfig[type]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 200) // Espera a que termine la animación de salida
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      role="alert"
      className={`
        bg-white border border-stone-200 ${config.borderClass} rounded-md p-3 shadow-lg
        text-xs flex items-center gap-2 max-w-[320px] pointer-events-auto
        transition-all duration-200
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"}
      `}
    >
      <span className="font-semibold">{config.icon}</span>
      {message}
    </div>
  )
}

export { Toast }
export type { ToastType, ToastProps }
