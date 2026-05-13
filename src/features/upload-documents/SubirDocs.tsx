/** Paso 1 del flujo: Subir documentos (INE, Nóminas, Estado de cuenta).
 *  Cada documento tiene botones para tomar foto (cámara) o seleccionar archivo.
 *  El escaneo se dispara desde el footer de ContractLayout. */
import { useRef, useState } from "react";
import { Camera, Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";

import { Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";

interface DocItem {
  id: string;
  label: string;
  file: File | null;
}

const KEY_MAP: Record<string, "ineFile" | "nomina1File" | "nomina2File" | "estadoCuentaFile"> = {
  ine: "ineFile",
  nomina1: "nomina1File",
  nomina2: "nomina2File",
  estadoCuenta: "estadoCuentaFile",
};

function SubirDocs() {
  const store = useContractStore();
  const scanResults = useContractStore((s) => s.documents.scanResults);
  const scanStatus = useContractStore((s) => s.documents.scanStatus);
  const [docs, setDocs] = useState<DocItem[]>(() => {
    const s = useContractStore.getState();
    return [
      { id: "ine", label: "INE", file: s.documents.ineFile },
      { id: "nomina1", label: "Nómina 1", file: s.documents.nomina1File },
      { id: "nomina2", label: "Nómina 2", file: s.documents.nomina2File },
      { id: "estadoCuenta", label: "Estado de cuenta", file: s.documents.estadoCuentaFile },
    ];
  });
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const readyCount = docs.filter((d) => d.file).length;

  const handleFile = (id: string, file: File) => {
    store.setDocument(KEY_MAP[id], file);
    if (scanStatus === "error") {
      store.setScanStatus("idle");
    }
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, file } : d)));
  };

  const handleRemove = (id: string) => {
    store.setDocument(KEY_MAP[id], null);
    store.setScanStatus("idle");
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, file: null } : d)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Subir Documentos</h2>
        <p className="text-sm text-text-secondary">Sube los 4 documentos requeridos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => {
          const docResult = scanResults[doc.id];
          const hasError = docResult === "error";
          const hasSuccess = docResult === "success";

          let borderClass = "border-border";
          if (hasError) borderClass = "border-error";
          else if (hasSuccess) borderClass = "border-success/30";
          else if (doc.file) borderClass = "border-primary/20";

          return (
          <Card
            key={doc.id}
            className={`p-5 border-2 transition-colors ${borderClass}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasError ? (
                    <AlertCircle size={18} className="text-error" />
                  ) : hasSuccess ? (
                    <CheckCircle size={18} className="text-success" />
                  ) : (
                    <FileText size={18} className="text-primary" />
                  )}
                  <span className={`text-sm font-medium ${hasError ? "text-error" : "text-text-primary"}`}>
                    {doc.label}
                  </span>
                  {hasError && (
                    <span className="text-[10px] text-error font-medium px-1.5 py-0.5 bg-error/10 rounded">
                      Error
                    </span>
                  )}
                </div>
              </div>

              {doc.file ? (
                <div className="flex items-center gap-2 p-3 bg-bg rounded-lg border border-border">
                  <FileText size={16} className="text-primary" />
                  <span className="text-xs text-text-secondary flex-1 truncate">{doc.file.name}</span>
                  <button onClick={() => handleRemove(doc.id)}>
                    <X size={14} className="text-text-secondary" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => fileRefs.current[`${doc.id}-camera`]?.click()}
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
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-text-secondary">Documentos:</span>
        <span className={`font-semibold ${readyCount === 4 ? "text-success" : "text-warning"}`}>
          {readyCount}/4
        </span>
      </div>

      {docs.map((doc) => (
        <div key={`${doc.id}-inputs`}>
          <input
            ref={(el) => { fileRefs.current[`${doc.id}-file`] = el; }}
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
            ref={(el) => { fileRefs.current[`${doc.id}-camera`] = el; }}
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
    </div>
  );
}

export { SubirDocs };
