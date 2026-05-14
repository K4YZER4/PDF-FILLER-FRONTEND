/** Paso 1 del flujo: Subir documentos (INE, Nóminas, Estado de cuenta).
 *
 *  Cada documento se muestra como una tarjeta con un botón para seleccionar
 *  archivo. Una vez seleccionado, se muestra el nombre del archivo con opción
 *  a removerlo.
 *
 *  El escaneo de los documentos se dispara desde el footer de ContractLayout
 *  (botón "Leer documentos"). Los resultados del escaneo (éxito/error por doc)
 *  se leen del store para resaltar visualmente en rojo los documentos que
 *  fallaron, permitiendo al usuario reemplazarlos.
 *
 *  Flujo:
 *    1. Usuario sube los 4 archivos (INE, Nómina 1, Nómina 2, Estado de cuenta)
 *    2. Desde ContractLayout se presiona "Leer documentos"
 *    3. Los resultados del escaneo se reflejan aquí con colores:
 *       - Verde: documento escaneado correctamente
 *       - Rojo: documento falló → el usuario puede reemplazarlo
 *       - Normal: aún no se ha escaneado */

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";

import { Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Representa un documento individual en la UI.
 *  - id: identificador interno (ine, nomina1, nomina2, estadoCuenta)
 *  - label: nombre visible para el usuario
 *  - file: archivo seleccionado o null si aún no se ha subido */
interface DocItem {
  id: string;
  label: string;
  file: File | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Traduce el id interno del documento a la clave del store de Zustand.
 *  Ej: "ine" → "ineFile", "nomina1" → "nomina1File" */
const KEY_MAP: Record<
  string,
  "ineFile" | "nomina1File" | "nomina2File" | "estadoCuentaFile"
> = {
  ine: "ineFile",
  nomina1: "nomina1File",
  nomina2: "nomina2File",
  estadoCuenta: "estadoCuentaFile",
};

// ─── Componente ───────────────────────────────────────────────────────────────

function SubirDocs() {
  // ── Store ──────────────────────────────────────────────────────────────────
  // Se usa useContractStore.getState() en el inicializador de useState para
  // que al volver al paso 1 (desde pasos posteriores) los archivos previamente
  // subidos sigan apareciendo en lugar de perderse.

  const store = useContractStore();
  const scanResults = useContractStore((s) => s.documents.scanResults);
  const scanStatus = useContractStore((s) => s.documents.scanStatus);
  const [docs, setDocs] = useState<DocItem[]>(() => {
    const s = useContractStore.getState();
    return [
      { id: "ine", label: "INE", file: s.documents.ineFile },
      { id: "nomina1", label: "Nómina 1", file: s.documents.nomina1File },
      { id: "nomina2", label: "Nómina 2", file: s.documents.nomina2File },
      {
        id: "estadoCuenta",
        label: "Estado de cuenta",
        file: s.documents.estadoCuentaFile,
      },
    ];
  });

  // Refs ocultos tipo file → se disparan al hacer clic en Cámara o Archivo
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── Restaurar archivos desde IndexedDB al montar ─────────────────────────
  // Al recargar la página, los File objects se pierden del store (no son
  // serializables a JSON). Se recuperan desde IndexedDB donde quedaron
  // guardados por setDocument.
  useEffect(() => {
    const s = useContractStore.getState();
    const needsRestore = !s.documents.ineFile
      && !s.documents.nomina1File
      && !s.documents.nomina2File
      && !s.documents.estadoCuentaFile;

    if (needsRestore) {
      s.restoreDocuments().then(() => {
        const updated = useContractStore.getState();
        setDocs([
          { id: "ine", label: "INE", file: updated.documents.ineFile },
          { id: "nomina1", label: "Nómina 1", file: updated.documents.nomina1File },
          { id: "nomina2", label: "Nómina 2", file: updated.documents.nomina2File },
          { id: "estadoCuenta", label: "Estado de cuenta", file: updated.documents.estadoCuentaFile },
        ]);
      });
    }
  }, []);

  // ── Derivados ──────────────────────────────────────────────────────────────

  const readyCount = docs.filter((d) => d.file).length;

  // ── Handlers ───────────────────────────────────────────────────────────────

  /** Guarda el archivo seleccionado en el store y en el estado local.
   *  Si se reemplaza un archivo después de un escaneo fallido, resetea
   *  scanStatus a "idle" para permitir un nuevo intento de escaneo. */
  const handleFile = (id: string, file: File) => {
    store.setDocument(KEY_MAP[id], file);
    if (scanStatus === "error") {
      store.setScanStatus("idle");
    }
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, file } : d)));
  };

  /** Elimina el archivo del store y del estado local.
   *  Resetea scanStatus a "idle" porque ya no están los 4 docs completos. */
  const handleRemove = (id: string) => {
    store.setDocument(KEY_MAP[id], null);
    store.setScanStatus("idle");
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, file: null } : d)),
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Subir Documentos
        </h2>
        <p className="text-sm text-text-secondary">
          Sube los 4 documentos requeridos
        </p>
      </div>

      {/* Tarjetas de documentos (grid 2 columnas en desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => {
          const docResult = scanResults[doc.id];
          const hasError = docResult === "error";
          const hasSuccess = docResult === "success";

          // Borde de la tarjeta según estado del escaneo
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
                {/* Encabezado: icono + label + badge de error */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasError ? (
                      <AlertCircle size={18} className="text-error" />
                    ) : hasSuccess ? (
                      <CheckCircle size={18} className="text-success" />
                    ) : (
                      <FileText size={18} className="text-primary" />
                    )}
                    <span
                      className={`text-sm font-medium ${hasError ? "text-error" : "text-text-primary"}`}
                    >
                      {doc.label}
                    </span>
                    {hasError && (
                      <span className="text-[10px] text-error font-medium px-1.5 py-0.5 bg-error/10 rounded">
                        Error
                      </span>
                    )}
                  </div>
                </div>

                {/* Zona de archivo seleccionado o botones de carga */}
                {doc.file ? (
                  /* Archivo ya seleccionado: muestra nombre + botón para quitar */
                  <div className="flex items-center gap-2 p-3 bg-bg rounded-lg border border-border">
                    <FileText size={16} className="text-primary" />
                    <span className="text-xs text-text-secondary flex-1 truncate">
                      {doc.file.name}
                    </span>
                    <button type="button" onClick={() => handleRemove(doc.id)}>
                      <X size={14} className="text-text-secondary" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        fileRefs.current[`${doc.id}-file`]?.click()
                      }
                      className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary-tint transition-colors"
                    >
                      <Upload size={20} className="text-text-secondary mb-1" />
                      <span className="text-xs text-text-secondary">
                        Archivo
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contador de documentos subidos */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-text-secondary">Documentos:</span>
        <span
          className={`font-semibold ${readyCount === 4 ? "text-success" : "text-warning"}`}
        >
          {readyCount}/4
        </span>
      </div>

      {/* Inputs ocultos tipo file — se abren al hacer clic en Archivo */}
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
        </div>
      ))}
    </div>
  );
}

export { SubirDocs };
