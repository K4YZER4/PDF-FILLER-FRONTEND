/** Paso 1 del flujo: Subir documentos (INE, Nóminas, Estado de cuenta).
 *  Cada documento tiene botones para tomar foto (cámara) o seleccionar archivo.
 *  - Estado visual: pendiente / cargado con nombre / icono de éxito o error post-escaneo.
 *  - Botón "Leer documentos" se habilita solo cuando los 4 docs están cargados.
 *  - Modal de escaneo simulado con progreso por documento.
 *  - Al terminar, guarda scanStatus en el store ("done" si todos OK, "error" si alguno falló). */
import { useRef, useState } from "react";
import {
  Camera,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { Button, Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";

interface DocItem {
  id: string;
  label: string;
  file: File | null;
  status: "idle" | "success" | "error";
}

function SubirDocs() {
  const store = useContractStore();
  const [docs, setDocs] = useState<DocItem[]>([
    { id: "ine", label: "INE", file: null, status: "idle" },
    { id: "nomina1", label: "Nómina 1", file: null, status: "idle" },
    { id: "nomina2", label: "Nómina 2", file: null, status: "idle" },
    {
      id: "estadoCuenta",
      label: "Estado de cuenta",
      file: null,
      status: "idle",
    },
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<
    Record<string, "success" | "error">
  >({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const readyCount = docs.filter((d) => d.file).length;

  const handleFile = (id: string, file: File) => {
    const keyMap: Record<
      string,
      "ineFile" | "nomina1File" | "nomina2File" | "estadoCuentaFile"
    > = {
      ine: "ineFile",
      nomina1: "nomina1File",
      nomina2: "nomina2File",
      estadoCuenta: "estadoCuentaFile",
    };
    store.setDocument(keyMap[id], file);
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, file, status: "idle" } : d)),
    );
  };

  const handleScanAll = async () => {
    setIsScanning(true);
    setScanResults({});
    const results: Record<string, "success" | "error"> = {};
    for (let i = 0; i < docs.length; i++) {
      if (!docs[i].file) continue;
      await new Promise((r) => setTimeout(r, 800));
      const success = Math.random() > 0.2;
      results[docs[i].id] = success ? "success" : "error";
      setScanResults({ ...results });
    }
    setIsScanning(false);
    const allOk = Object.values(results).every((r) => r === "success");
    store.setScanStatus(allOk ? "done" : "error");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Subir Documentos
        </h2>
        <p className="text-sm text-text-secondary">
          Sube los 4 documentos requeridos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <Card
            key={doc.id}
            className={`p-5 border-2 transition-colors ${doc.file ? "border-primary/20" : "border-border"}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">
                    {doc.label}
                  </span>
                </div>
                {scanResults[doc.id] === "success" && (
                  <CheckCircle size={16} className="text-success" />
                )}
                {scanResults[doc.id] === "error" && (
                  <AlertCircle size={16} className="text-error" />
                )}
              </div>

              {doc.file ? (
                <div className="flex items-center gap-2 p-3 bg-bg rounded-lg border border-border">
                  <FileText size={16} className="text-primary" />
                  <span className="text-xs text-text-secondary flex-1 truncate">
                    {doc.file.name}
                  </span>
                  <button
                    onClick={() =>
                      setDocs((prev) =>
                        prev.map((d) =>
                          d.id === doc.id
                            ? { ...d, file: null, status: "idle" }
                            : d,
                        ),
                      )
                    }
                  >
                    <X size={14} className="text-text-secondary" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      fileRefs.current[`${doc.id}-camera`]?.click()
                    }
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary-tint transition-colors"
                  >
                    <Camera size={20} className="text-text-secondary mb-1" />
                    <span className="text-xs text-text-secondary">Cámara</span>
                  </button>
                  <button
                    onClick={() => fileRefs.current[`${doc.id}-file`]?.click()}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary-tint transition-colors"
                  >
                    <Upload size={20} className="text-text-secondary mb-1" />
                    <span className="text-xs text-text-secondary">Archivo</span>
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {docs.map((doc) => (
        <div key={`${doc.id}-inputs`}>
          <input
            ref={(el) => {
              fileRefs.current[`${doc.id}-file`] = el;
            }}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(doc.id, e.target.files[0]);
                e.target.value = "";
              }
            }}
          />
          <input
            ref={(el) => {
              fileRefs.current[`${doc.id}-camera`] = el;
            }}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(doc.id, e.target.files[0]);
                e.target.value = "";
              }
            }}
          />
        </div>
      ))}

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-text-secondary">Documentos:</span>
        <span
          className={`font-semibold ${readyCount === 4 ? "text-success" : "text-warning"}`}
        >
          {readyCount}/4
        </span>
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleScanAll}
          disabled={readyCount < 4 || isScanning}
          loading={isScanning}
          className="min-w-[200px]"
        >
          <Upload size={16} /> Leer documentos
        </Button>
      </div>

      {isScanning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span className="font-medium text-text-primary">
                Escaneando...
              </span>
            </div>
            <div className="space-y-2">
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 text-sm">
                  {scanResults[doc.id] === "success" ? (
                    <CheckCircle size={14} className="text-success" />
                  ) : scanResults[doc.id] === "error" ? (
                    <AlertCircle size={14} className="text-error" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-border" />
                  )}
                  <span className="text-text-secondary">{doc.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export { SubirDocs };
