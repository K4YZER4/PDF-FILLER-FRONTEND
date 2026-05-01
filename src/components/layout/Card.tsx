/**
 * Archivo: components/layout/Card.tsx
 * Propósito: Contenedor con título y badge para agrupar secciones de formularios.
 * Usado en las pantallas de INE, Nómina y Crédito.
 */
interface CardProps {
  title: string               // Título de la sección
  badge?: React.ReactNode    // Badge opcional (ej: estado de escaneo)
  children: React.ReactNode  // Contenido de la tarjeta
  className?: string          // Clases CSS adicionales
}

function Card({ title, badge, children, className = "" }: CardProps) {
  return (
    <div className={`bg-white border border-stone-200 rounded-lg p-5 shadow-sm ${className}`}>
      {/* Encabezado de la tarjeta con título y badge */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
          {title}
        </h2>
        {badge}
      </div>
      {/* Contenido de la tarjeta */}
      {children}
    </div>
  )
}

export { Card }
export type { CardProps }
