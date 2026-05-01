/**
 * Archivo: components/layout/Header.tsx
 * Propósito: Encabezado de la aplicación con título, subtítulo y botón de tema.
 * Se mantiene fijo en la parte superior (sticky) durante el scroll.
 */
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
        <div className="w-9 h-9 bg-teal-800 rounded-md flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
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
            // Ícono de sol para cambiar a tema claro
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            // Ícono de luna para cambiar a tema oscuro
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

export { Header }
export type { HeaderProps }
