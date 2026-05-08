/** Contenedor visual con bordes redondeados, sombra suave y fondo blanco.
 *  Se usa para agrupar secciones: formularios, tarjetas de resumen, etc. */
import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-surface rounded-xl border border-border shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export { Card }
export type { CardProps }
