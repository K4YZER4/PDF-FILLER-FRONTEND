/**
 * Archivo: features/documentos/SubirDocs.tsx
 * Propósito: Paso 1 - Subir documentos con diseño profesional.
 */
import { useState, useCallback } from "react"
import { CheckCircle, AlertCircle, Loader2, Upload, FileText } from "lucide-react"
import { Card, UploadArea, Button } from "@/components"
import { useContractStore } from "@/store/useContractStore"
import type { ScanStatus } from "@/types"

interface DocItem {
  id: string
  label: string
  file: File | null
  status: ScanStatus
}

function SubirDocs() {
  const store = useContractStore()
  const [docs, setDocs] = useState<DocItem[]>([
    { id: "ine", label: "INE", file: store.documents.ineFile, status: "idle" },
    { id: "nomina1", label: "Nómina 1", file: store.documents.nomina1File, status: "idle" },
    { id: "nomina2", label: "Nómina 2", file: store.documents.nomina2File, status: "idle" },
    { id: "estadoCuenta", label: "Estado de cuenta", file: store.documents.estadoCuentaFile, status: "idle" },
  ])

  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResults, setScanResults] = useState<Record<string, "success" | "error">>({})

  const readyCount = docs.filter((d) => d.file !== null).length

  const handleFileSelect = useCallback(
    (id: string, file: File | null) => {
      if (!file) return
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, file, status: "idle" } : d)))
      if (id === "ine") store.setDocument("ineFile", file)
      if (id === "nomina1") store.setDocument("nomina1File", file)
      if (id === "nomina2") store.setDocument("nomina2File", file)
      if (id === "estadoCuenta") store.setDocument("estadoCuentaFile", file)
    },
    [store]
  )

  const scanDocument = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(Math.random() > 0.2), 800)
    })
  }

  const handleScanAll = async () => {
    setIsScanning(true)
    setScanProgress(0)
    setScanResults({})
    const total = docs.length
    let completed = 0

    for (const doc of docs) {
      if (!doc.file) continue
      const success = await scanDocument()
      setScanResults((prev) => ({ ...prev, [doc.id]: success ? "success" : "error" }))
      completed++
      setScanProgress(Math.round((completed / total) * 100))
    }

    setIsScanning(false)
    store.setScanStatus(Object.values(scanResults).every((r) => r === "success") ? "done" : "error")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">Subir Documentos</h2>
        <p className="text-sm text-stone-500">Sube los 4 documentos requeridos para continuar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <Card key={doc.id} className="p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  <span className="text-sm font-medium text-stone-700">{doc.label}</span>
                </div>
                {scanResults[doc.id] === "success" && <CheckCircle size={16} className="text-green-500" />}
                {scanResults[doc.id] === "error" && <AlertCircle size={16} className="text-red-500" />}
              </div>
              <UploadArea
                label=""
                accept="image/*,.pdf"
                onFileSelect={(file) => handleFileSelect(doc.id, file)}
                file={doc.file}
                showFilename={true}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-stone-500">Documentos subidos:</span>
        <span className={`font-semibold ${readyCount === 4 ? "text-green-600" : "text-amber-600"}`}>
          {readyCount}/4
        </span>
      </div>

      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleScanAll}
          disabled={readyCount < 4 || isScanning}
          loading={isScanning}
          className="min-w-[200px]"
        >
          <Upload size={16} />
          Escanear documentos
        </Button>
      </div>

      {isScanning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-sm w-full">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-primary" />
                <span className="font-medium text-stone-900">Escaneando documentos...</span>
              </div>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 text-sm">
                    {scanResults[doc.id] === "success" ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : scanResults[doc.id] === "error" ? (
                      <AlertCircle size={14} className="text-red-500" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-300" />
                    )}
                    <span className="text-stone-600">{doc.label}</span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export { SubirDocs }
