/**
 * Archivo: components/layout/FooterBar.tsx
 * Propósito: Barra inferior fija con botones de acción y mensajes de validación.
 * Permite limpiar el formulario y generar el contrato PDF.
 */
import { Button } from "@/components/ui"
import { RotateCcw, FileDown } from "lucide-react"

interface FooterBarProps {
  validationMessage: string  // Mensaje que indica qué falta para continuar
  canGenerate: boolean       // Si se puede generar el contrato
  isGenerating: boolean      // Si se está generando el PDF
  onClean: () => void      // Función para limpiar todo el formulario
  onGenerate: () => void   // Función para generar el contrato
}

function FooterBar({
  validationMessage,
  canGenerate,
  isGenerating,
  onClean,
  onGenerate,
}: FooterBarProps) {
  return (
    <footer className="sticky bottom-0 z-10 bg-white border-t border-stone-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
      {/* Mensaje de validación */}
      <span className="text-xs text-stone-500">{validationMessage}</span>
      {/* Botones de acción */}
      <div className="flex gap-3">
        {/* Botón para limpiar todo el formulario */}
        <Button variant="secondary" size="sm" onClick={onClean}>
          <RotateCcw size={14} />
          Limpiar
        </Button>
        {/* Botón para generar el contrato PDF */}
        <Button
          variant="primary"
          size="lg"
          loading={isGenerating}
          disabled={!canGenerate}
          onClick={onGenerate}
        >
          <FileDown size={16} />
          Generar Contrato PDF
        </Button>
      </div>
    </footer>
  )
}

export { FooterBar }
export type { FooterBarProps }
