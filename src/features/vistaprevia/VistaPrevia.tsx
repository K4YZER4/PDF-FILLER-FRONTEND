/**
 * Archivo: features/vistaprevia/VistaPrevia.tsx
 * Propósito: Paso 4 - Vista previa del contrato con diseño profesional.
 */
import { useState } from "react"
import { FileDown, Share2, Pencil, CheckCircle } from "lucide-react"
import { Button, Card } from "@/components"
import { useContractStore } from "@/store/useContractStore"

function VistaPrevia() {
  const store = useContractStore()
  const [showToast, setShowToast] = useState(false)

  const clientName = [
    (store.formData.ine as any)?.primerNombre,
    (store.formData.ine as any)?.segundoNombre,
    (store.formData.ine as any)?.primerApellido,
    (store.formData.ine as any)?.segundoApellido,
  ].filter(Boolean).join(" ").toUpperCase() || "CLIENTE"

  const handleDownload = () => {
    const blob = new Blob(["Contrato PDF simulado"], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contrato-${Date.now()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

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
      await navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  const handleEdit = () => store.setStep(2)

  const handleFinish = () => {
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      window.location.href = "/"
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">Vista Previa</h2>
        <p className="text-sm text-stone-500">Revisa el contrato antes de finalizar</p>
      </div>

      {/* Simulación visual del PDF */}
      <Card className="p-6 md:p-8">
        <div className="border-b border-stone-200 pb-4 mb-6">
          <h3 className="text-lg font-bold text-center text-primary">VISTA PREVIA DEL CONTRATO</h3>
        </div>

        <div className="space-y-3 mb-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-3 bg-stone-100 rounded" style={{ width: `${75 + Math.random() * 25}%` }} />
          ))}
        </div>

        <div className="text-center text-xs text-stone-400">Página 1 de 4</div>
      </Card>

      {/* Información del contrato */}
      <Card className="p-5 md:p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-4">Datos del Contrato</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Cliente:</span>
            <span className="font-medium">{clientName}</span>
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
      </Card>

      {/* Botones de acción */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={handleDownload}>
            <FileDown size={16} />
            Descargar
          </Button>
          <Button variant="secondary" onClick={handleShare}>
            <Share2 size={16} />
            Compartir
          </Button>
        </div>

        <Button variant="secondary" onClick={handleEdit} className="w-full">
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
        <div className="fixed top-6 right-6 z-[999]">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <CheckCircle size={16} />
            <span>Contrato generado exitosamente</span>
          </div>
        </div>
      )}
    </div>
  )
}

export { VistaPrevia }
