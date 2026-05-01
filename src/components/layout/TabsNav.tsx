/**
 * Archivo: components/layout/TabsNav.tsx
 * Propósito: Navegación por pestañas para las 3 secciones principales.
 * Muestra el estado de cada pestaña mediante badges numerados o checkmarks.
 */
import type { TabStatus } from "@/types"

/** Configuración de cada pestaña */
interface TabItem {
  id: string
  label: string
  number: number      // Número de la pestaña (1, 2, 3)
  status: TabStatus   // Estado actual (idle, scanning, complete)
}

/** Props para el componente TabsNav */
interface TabsNavProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

/** Devuelve el contenido del badge según el estado */
function getBadgeContent(status: TabStatus, number: number): string {
  if (status === "complete") return "\u2713"  // Checkmark si está completo
  return String(number)                       // Número si está pendiente
}

/** Devuelve las clases CSS del badge según el estado */
function getBadgeClasses(status: TabStatus, isActive: boolean): string {
  const base = "w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors"
  if (isActive) return `${base} bg-primary-tint text-primary border border-transparent`
  if (status === "complete") return `${base} bg-success-tint text-success border border-transparent`
  if (status === "scanning") return `${base} bg-warning-tint text-warning border border-transparent animate-pulse`
  return `${base} bg-stone-50 text-stone-500 border border-stone-200`
}

/** Devuelve las clases CSS de la pestaña según si está activa */
function getTabClasses(isActive: boolean): string {
  const base = "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2"
  if (isActive) return `${base} text-primary border-primary`
  return `${base} text-stone-500 border-transparent hover:text-stone-900`
}

/** Barra de navegación por pestañas */
function TabsNav({ tabs, activeTab, onTabChange }: TabsNavProps) {
  return (
    <nav className="bg-white border-b border-stone-200 px-4 sm:px-6 flex overflow-x-auto" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={getTabClasses(isActive)}
            onClick={() => onTabChange(tab.id)}
          >
            <span className={getBadgeClasses(tab.status, isActive)}>
              {getBadgeContent(tab.status, tab.number)}
            </span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}

export { TabsNav }
export type { TabItem, TabsNavProps }
