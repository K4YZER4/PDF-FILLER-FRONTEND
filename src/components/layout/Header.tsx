/**
 * Archivo: components/layout/Header.tsx
 * Propósito: Encabezado de la aplicación con título, subtítulo y botón de tema.
 * Se mantiene fijo en la parte superior (sticky) durante el scroll.
 */
import { FileText, Sun, Moon } from "lucide-react"

interface HeaderProps {
  title: string              // Título principal (ej: "Generador de Contratos")
  subtitle: string            // Subtítulo (ej: "CREDIFOM, S.A.P.I. de C.V.")
  theme: "light" | "dark"   // Tema actual
  onThemeToggle: () => void  // Función para cambiar el tema
}

function Header({ title, subtitle, theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm flex items-center justify-between px-4 py-2 sm:px-6 gap-4">
      {/* Logo e información de la aplicación */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
          <FileText size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">{title}</h1>
          <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
      </div>
      {/* Botón para cambiar tema claro/oscuro */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onThemeToggle}
          className="w-9 h-9 rounded-md flex items-center justify-center text-stone-500 border border-stone-200 hover:bg-stone-50 hover:text-stone-900 transition-colors"
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? (
            <Sun size={16} />
          ) : (
            <Moon size={16} />
          )}
        </button>
      </div>
    </header>
  )
}

export { Header }
export type { HeaderProps }
