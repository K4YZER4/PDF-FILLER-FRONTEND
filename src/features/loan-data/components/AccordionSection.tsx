/**
 * Archivo: features/loan-data/components/AccordionSection.tsx
 *
 * Wrapper de sección accordion reutilizable para el paso 3.
 *
 * Comportamiento visual:
 *   - Expandida + completa → borde verde + check
 *   - Expandida + incompleta → borde default
 *   - Colapsada + completa → borde verde
 *   - Colapsada + incompleta → borde rojo + alerta naranja
 *
 * Recibe todo por props (incluyendo el ícono y el título) para que
 * cada sección se configure desde el orquestador sin duplicar JSX.
 */
import type { LucideIcon } from "lucide-react"
import { ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card } from "@/components"

interface AccordionSectionProps {
  id: string
  title: string
  icon: LucideIcon
  isComplete: boolean
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function AccordionSection({
  id, title, icon: Icon, isComplete,
  isExpanded, onToggle, children,
}: AccordionSectionProps) {
  const isCollapsedWithIssues = !isExpanded && !isComplete

  const cardBorder = isComplete
    ? "border-success/30"
    : isCollapsedWithIssues
      ? "border-error/40"
      : "border-border"

  return (
    <Card className={`overflow-hidden border-2 transition-colors ${cardBorder}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-bg transition-colors"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`accordion-${id}`}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={20} className="text-primary shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold text-text-primary">{title}</span>
          {isComplete ? (
            <CheckCircle2 size={16} className="text-success shrink-0" aria-label="Sección completa" />
          ) : isCollapsedWithIssues ? (
            <AlertTriangle size={16} className="text-warning shrink-0" aria-label="Faltan datos" />
          ) : null}
        </div>
        <ChevronDown
          size={18}
          className={`text-text-secondary transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <div id={`accordion-${id}`} className="px-4 md:px-5 pb-5">
          {children}
        </div>
      )}
    </Card>
  )
}

export { AccordionSection }
