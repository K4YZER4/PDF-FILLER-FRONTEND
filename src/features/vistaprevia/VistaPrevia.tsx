/**
 * Archivo: features/vistaprevia/VistaPrevia.tsx
 * Propósito: Paso 4 del flujo - Vista previa del contrato.
 * Simula visualización del PDF y permite descargar/compartir.
 */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileDown, Share2, Pencil, CheckCircle } from "lucide-react"
import { Button } from "@/components"
import { useContractStore } from "@/store/useContractStore"

function VistaPrevia() {
  const navigate = useNavigate()
  const store = useContractStore()
  const [showToast, setShowToast] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 4

  /** Datos del contrato para mostrar */
  const clientName = [
    store.formData.ine.nombre1,
    store.formData.ine.nombre2,
    store.formData.ine.apellidoPaterno,
    store.formData.ine.apellidoMaterno,
  ].filter(Boolean).join(" ").toUpperCase()

  /** Maneja descarga del PDF */
  const handleDownload = () => {
    // Simular descarga
    const blob = new Blob(["Contrato PDF simulado"], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contrato-${Date.now()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  /** Maneja compartir */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Contrato Generado",
          text: `Contrato de ${clientName}`,
          url: window.location.href,
        })
      } catch {
        // Usuario canceló
      }
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  /** Maneja edición de datos (regresa al paso 2) */
  const handleEdit = () => {
    store.setStep(2)
  }

  /** Finaliza el flujo */
  const handleFinish = () => {
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate("/")
    }, 2000)
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Simulación visual del PDF */}
      <div className="bg-white border-2 border-stone-300 rounded-lg p-6 min-h-[400px] shadow-sm">
        <div className="border-b border-stone-200 pb-4 mb-4">
          <h2 className="text-lg font-bold text-center text-primary">
            VISTA PREVIA DEL CONTRATO
          </h2>
        </div>
        
        {/* Líneas de contenido simulado */}
        <div className="space-y-3">
          <div className="h-3 bg-stone-200 rounded w-full" />
          <div className="h-3 bg-stone-200 rounded w-3/4" />
          <div className="h-3 bg-stone-200 rounded w-5/6" />
          <div className="h-3 bg-stone-200 rounded w-2/3" />
          <div className="h-3 bg-stone-200 rounded w-full" />
          <div className="h-3 bg-stone-200 rounded w-4/5" />
          <div className="h-3 bg-stone-200 rounded w-3/4" />
          <div className="h-3 bg-stone-200 rounded w-5/6" />
        </div>

        <div className="mt-6 text-center text-xs text-stone-400">
          Página {currentPage} de {totalPages}
        </div>
      </div>

      {/* Navegación de páginas */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
              currentPage === page
                ? "bg-primary text-white"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Información del contrato */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-stone-900">Datos del Contrato</h3>
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-stone-500">Cliente:</span>
            <span className="font-medium">{clientName || "---"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Monto:</span>
            <span className="font-medium text-primary">
              ${store.formData.tabla?.montoPagare?.toLocaleString() || "0"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Plazo:</span>
            <span className="font-medium">{store.formData.tabla?.descuentoQuincenal || "0"} QNAs</span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            onClick={handleDownload}
          >
            <FileDown size={16} />
            Descargar
          </Button>
          <Button
            variant="secondary"
            onClick={handleShare}
          >
            <Share2 size={16} />
            Compartir
          </Button>
        </div>

        <Button
          variant="secondary"
          onClick={handleEdit}
          className="w-full"
        >
          <Pencil size={16} />
          Editar datos
        </Button>

        <Button
          variant="primary"
          size="lg"
          className="w-full bg-success hover:bg-success-hover"
          onClick={handleFinish}
        >
          <CheckCircle size={16} />
          Finalizar
        </Button>
      </div>

      {/* Toast de éxito */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[999] pointer-events-none">
          <div className="bg-success-tint border border-success-tint text-success px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm">
            <CheckCircle size={16} />
            <span>Contrato generado exitosamente</span>
          </div>
        </div>
      )}
    </div>
  )
}

export { VistaPrevia }
