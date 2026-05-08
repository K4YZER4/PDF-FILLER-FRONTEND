/**
 * Archivo: components/ui/Card.tsx
 * Propósito: Contenedor de contenido con estilos profesionales.
 */
import type { ReactNode } from "react"

export interface CardProps {
  children: ReactNode
  className?: string
  title?: string
}

function Card({ children, className = "", title }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-stone-200 shadow-sm ${className}`}>
      {title && <div className="px-5 py-4 border-b border-stone-100 font-medium text-sm">{title}</div>}
      {children}
    </div>
  )
}

export { Card }
