/** Visor de PDF embebido para la página de firma.
 *
 *  Renderiza un visor robusto (<object> con fallback <iframe>) del contrato
 *  usando la URL directa servida por el backend, con barra de herramientas
 *  para abrir en nueva pestaña o descargar en caso de bloqueos del navegador.
 *
 *  Uso:
 *    <PdfViewer pdfUrl={data.pdfUrl} /> */
interface PdfViewerProps {
  pdfUrl: string;
}

function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const fullUrl = pdfUrl.startsWith("blob:") || pdfUrl.startsWith("http")
    ? pdfUrl
    : `${import.meta.env.VITE_API_BASE ?? "http://localhost:3000"}${pdfUrl}`;

  if (!pdfUrl) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 border-2 border-dashed border-border rounded-xl">
        <p className="text-text-secondary text-sm">Cargando documento PDF...</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border-2 border-border shadow-sm bg-white flex flex-col">
      <div className="relative w-full h-[550px] md:h-[650px] bg-gray-100">
        <object
          data={fullUrl}
          type="application/pdf"
          className="w-full h-full"
        >
          <iframe
            src={fullUrl}
            className="w-full h-full border-0"
            title="Vista previa del contrato"
          >
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50">
              <p className="text-sm text-text-secondary mb-4">
                Tu navegador no permite previsualizar el PDF incrustado directamente.
              </p>
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
              >
                Abrir PDF en pestaña nueva ↗
              </a>
            </div>
          </iframe>
        </object>
      </div>

      <div className="py-2.5 px-4 bg-gray-50 border-t border-border flex items-center justify-between text-xs text-text-secondary">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          Documento cargado
        </span>
        <div className="flex items-center gap-3">
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover font-semibold transition-colors flex items-center gap-1"
          >
            Abrir en ventana completa ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export { PdfViewer };
