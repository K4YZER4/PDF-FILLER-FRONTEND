/**
 * Archivo: hooks/useToast.ts
 * Propósito: Hook personalizado para mostrar notificaciones toast.
 * Dispara un evento personalizado que es escuchado por el componente App.
 */
import { useCallback } from "react"
import type { ToastType } from "@/components/feedback"

/**
 * Hook para mostrar notificaciones toast desde cualquier componente.
 * Utiliza CustomEvent para comunicarse con el componente App.
 * @returns Función showToast para mostrar notificaciones
 */
export function useToast() {
  const showToast = useCallback((message: string, type: ToastType = "info") => {
    // Dispara un evento personalizado con los datos del toast
    const event = new CustomEvent("toast", { detail: { message, type } })
    window.dispatchEvent(event)
  }, [])

  return { showToast }
}
