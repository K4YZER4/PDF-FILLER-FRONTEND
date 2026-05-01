/**
 * Archivo: components/layout/FooterBar.tsx
 * Propósito: Barra inferior fija con botones de acción y mensajes de validación.
 * Permite limpiar el formulario y generar el contrato PDF.
 */
import { Button } from "@/components/ui"

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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.85" />
          </svg>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          Generar Contrato PDF
        </Button>
      </div>
    </footer>
  )
}

export { FooterBar }
export type { FooterBarProps }
