/**
 * Archivo: App.tsx
 * Propósito: Componente raíz de la aplicación.
 * Gestiona la navegación por pestañas, tema claro/oscuro, notificaciones toast,
 * y renderiza las pantallas principales según la pestaña activa.
 */
import { useState, useCallback, useEffect } from "react"
import { Header, TabsNav, FooterBar } from "@/components/layout"
import { Toast } from "@/components/feedback"
import { IneScreen } from "@/features/ine"
import { NominaScreen } from "@/features/nomina"
import { CreditoScreen } from "@/features/credito"
import { useContractStore } from "@/store/useContractStore"
import type { ToastType } from "@/components/feedback"
import type { TabItem } from "@/components/layout"

// Configuración de las 3 pestañas principales de la aplicación
const TABS: TabItem[] = [
  { id: "ine", label: "Cliente (INE)", number: 1, status: "idle" },
  { id: "docs", label: "Nómina y Cuenta", number: 2, status: "idle" },
  { id: "extras", label: "Extras y Monto", number: 3, status: "idle" },
]

// Tipo para las notificaciones toast
type ToastMessage = { id: number; message: string; type: ToastType }

function App() {
  // Estado para el tema de la aplicación (claro/oscuro)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  // Estado para las notificaciones toast activas
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  // Obtiene el estado global del store de contratos
  const { activeTab, tabStatuses, setActiveTab, reset } = useContractStore()

  // Agrega una nueva notificación toast
  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  // Elimina una notificación toast por su id
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Auto-elimina las notificaciones después de 4 segundos
  useEffect(() => {
    if (toasts.length === 0) return
    const latest = toasts[toasts.length - 1]
    const timer = setTimeout(() => removeToast(latest.id), 4000)
    return () => clearTimeout(timer)
  }, [toasts, removeToast])

  // Alterna entre tema claro y oscuro
  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  // Cambia la pestaña activa
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  // Limpia todos los datos del formulario y muestra notificación
  const handleClean = () => {
    reset()
    addToast("Formulario limpiado", "info")
  }

  // Verifica si se puede generar el contrato (pestaña 3 completada)
  const canGenerate = tabStatuses.extras === "complete"

  // Mensajes de validación para cada pestaña
  const validationMessages: Record<string, string> = {
    ine: "Completa los datos personales y domicilio",
    docs: "Sube y escanea los 3 documentos",
    extras: canGenerate ? "Listo para generar" : "Calcula la tabla de crédito primero",
  }

  // Combina las pestañas con su estado actual del store
  const tabsWithStatus = TABS.map((tab) => ({
    ...tab,
    status: tabStatuses[tab.id] || tab.status,
  }))

  return (
    <div className={`min-h-screen bg-stone-100 flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      {/* Encabezado de la aplicación */}
      <Header
        title="Generador de Contratos"
        subtitle="CREDIFOM, S.A.P.I. de C.V."
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      {/* Navegación por pestañas */}
      <TabsNav tabs={tabsWithStatus} activeTab={activeTab} onTabChange={handleTabChange} />
      {/* Contenido principal según la pestaña activa */}
      <main className="flex-1 py-6 px-4 sm:px-6 max-w-[900px] w-full mx-auto">
        {activeTab === "ine" && <IneScreen onToast={addToast} />}
        {activeTab === "docs" && <NominaScreen onToast={addToast} />}
        {activeTab === "extras" && <CreditoScreen onToast={addToast} />}
      </main>
      {/* Barra inferior con botones de acción */}
      <FooterBar
        validationMessage={validationMessages[activeTab] || ""}
        canGenerate={canGenerate}
        isGenerating={false}
        onClean={handleClean}
        onGenerate={() => {
          if (!canGenerate) {
            addToast("Primero calcula la tabla en el Tab 3", "error")
          } else {
            addToast("PDF generado", "success")
          }
        }}
      />
      {/* Contenedor de notificaciones toast */}
      <div className="fixed top-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
