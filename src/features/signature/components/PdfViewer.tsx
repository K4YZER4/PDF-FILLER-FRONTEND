/** Visor de PDF embebido para la página de firma.
 *
 *  Renderiza un iframe con el PDF del contrato usando la URL
 *  proporcionada por el backend (redirige a Cloudinary o sirve local).
 *
 *  Uso:
 *    <PdfViewer pdfUrl={data.pdfUrl} /> */
interface PdfViewerProps {
  pdfUrl: string;
}

function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const fullUrl = pdfUrl.startsWith("http")
    ? pdfUrl
    : `${import.meta.env.VITE_API_BASE ?? ""}${pdfUrl}`;

  return (
    <div className="w-full rounded-xl overflow-hidden border-2 border-border">
      <iframe
        src={fullUrl}
        className="w-full h-[500px] md:h-[600px]"
        title="Vista previa del contrato"
      />
    </div>
  );
}

export { PdfViewer };
