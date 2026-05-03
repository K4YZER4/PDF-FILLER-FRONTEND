/**
 * Archivo: features/documentos/SubirDocs.tsx
 * Propósito: Paso 1 del flujo - Subir documentos.
 */
import { useState, useCallback } from "react"
import { CheckCircle, AlertCircle, Loader2, Upload } from "lucide-react"
import { Card, UploadArea, Button } from "@/components"
import { useContractStore } from "@/store/useContractStore"
import type { ScanStatus } from "@/types"

interface DocItem {
  id: string
  label: string
  file: File | null
  name: string | null
  status: ScanStatus
}

function SubirDocs() {
  const store = useContractStore()
  const [docs, setDocs] = useState<DocItem[]>([
    { id: "ine", label: "INE (Foto del cliente)", file: store.documents.ineFile, name: null, status: "idle" },
    { id: "nomina1", label: "Nómina 1", file: store.documents.nomina1File, name: null, status: "idle" },
    { id: "nomina2", label: "Nómina 2", file: store.documents.nomina2File, name: null, status: "idle" },
    { id: "estadoCuenta", label: "Estado de cuenta", file: store.documents.estadoCuentaFile, name: null, status: "idle" },
  ])

  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResults, setScanResults] = useState<Record<string, "success" | "error">>({})

  const readyCount = docs.filter((d) => d.file !== null).length
  const counterColor = readyCount <= 2 ? "text-error" : readyCount === 3 ? "text-warning" : "text-success"

  const handleFileSelect = useCallback(
    (id: string, file: File) => {
      setDocs((prev) =>
        prev.map((d) => d.id === id ? { ...d, file, name: file.name, status: "idle" as ScanStatus } : d)
      )
      if (id === "ine") store.setDocument("ineFile", file)
      if (id === "nomina1") store.setDocument("nomina1File", file)
      if (id === "nomina2") store.setDocument("nomina2File", file)
      if (id === "estadoCuenta") store.setDocument("estadoCuentaFile", file)
    },
    [store]
  )

  const scanDocument = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2
        resolve(success)
      }, 800)
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
    if (Object.values(scanResults).every((r) => r === "success")) {
      store.setScanStatus("done")
    } else {
      store.setScanStatus("error")
    }
  }

  const handleRetry = async (docId: string) => {
    setScanResults((prev) => {
      const next = { ...prev }
      delete next[docId]
      return next
    })
    const success = await scanDocument()
    setScanResults((prev) => ({ ...prev, [docId]: success ? "success" : "error" }))
    if (success) {
      store.setScanStatus("done")
    }
  }

  return (
    <div className="space-y-4 pb-4">
      <Card title="Documento Principal">
        <div className="space-y-2">
          <UploadArea
            label="INE (Foto del cliente)"
            accept="image/*"
            onFileSelect={(file) => handleFileSelect("ine", file)}
            file={docs[0].file}
            fileName={docs[0].name}
            showFilename={false}
          />
          {docs[0].file && (
            <div className="flex items-center gap-2 text-xs">
              {scanResults["ine"] === "success" ? (
                <CheckCircle size={14} className="text-success" />
              ) : scanResults["ine"] === "error" ? (
                <AlertCircle size={14} className="text-error" />
              ) : null}
              <span className={scanResults["ine"] === "error" ? "text-error" : "text-success"}>
                {docs[0].name}
              </span>
              {scanResults["ine"] === "error" && (
                <button onClick={() => handleRetry("ine")} className="text-primary underline text-xs">
                  Reintentar
                </button>
              )}
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {docs.slice(1).map((doc) => (
          <Card key={doc.id} title={doc.label}>
            <div className="space-y-2">
              <UploadArea
                label={doc.label}
                accept="image/*"
                onFileSelect={(file) => handleFileSelect(doc.id, file)}
                file={doc.file}
                fileName={doc.name}
                showFilename={false}
              />
              {doc.file && (
                <div className="flex items-center gap-1 text-xs">
                  {scanResults[doc.id] === "success" ? (
                    <CheckCircle size={12} className="text-success" />
                  ) : scanResults[doc.id] === "error" ? (
                    <AlertCircle size={12} className="text-error" />
                  ) : null}
                  <span className="truncate">{doc.name}</span>
                  {scanResults[doc.id] === "error" && (
                    <button onClick={() => handleRetry(doc.id)} className="text-primary underline text-xs">
                      Reintentar
                    </button>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className={`text-center text-sm font-medium ${counterColor}`}>
        {readyCount} de 4 documentos listos
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={readyCount < 4 || isScanning}
        onClick={handleScanAll}
        loading={isScanning}
      >
        <Upload size={16} />
        Escanear todo
      </Button>

      {isScanning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 mx-4">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span className="text-sm font-medium">Escaneando documentos...</span>
            </div>
            <div className="space-y-2">
              {docs.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {scanResults[docs[index].id] === "success" ? (
                    <CheckCircle size={14} className="text-success" />
                  ) : scanResults[docs[index].id] === "error" ? (
                    <AlertCircle size={14} className="text-error" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-300" />
                  )}
                  <span>{doc.label}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { SubirDocs }
