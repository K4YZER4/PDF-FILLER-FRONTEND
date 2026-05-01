/**
 * Archivo: components/feedback/AutofillBadge.tsx
 * Propósito: Badge pequeño que indica que un campo fue llenado automáticamente.
 * Se muestra junto a campos que recibieron datos del escaneo OCR.
 */
interface AutofillBadgeProps {
  className?: string
}

/** Badge que indica "Auto" cuando un campo fue llenado por OCR */
function AutofillBadge({ className = "" }: AutofillBadgeProps) {
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 ${className}`}>
      Auto \u2713
    </span>
  )
}

export { AutofillBadge }
export type { AutofillBadgeProps }
