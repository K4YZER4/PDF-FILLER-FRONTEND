/** Paso 4 del flujo: Vista previa del contrato antes de finalizar.
 *  - Muestra una simulación visual del PDF (contenido placeholder).
 *  - Las acciones (descargar, editar, finalizar) están en el footer del layout.
 *  - Botón flotante "Compartir" en el layout (compartir vía Web Share API).
 *  - Botón para generar link de firma después de finalizar el contrato. */
import { useEffect, useRef, useState } from "react";
import { Copy, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";
import { Card } from "@/components";
import { Button } from "@/components/ui";
import { api } from "@/lib/api";
import { useContractStore } from "@/store/useContractStore";
import { buildContratoPayload } from "@/utils/mapping";
import type { GenerarEnlaceResponse } from "@/types";

function VistaPrevia() {
  const [generando, setGenerando] = useState(false);
  const [firmaLink, setFirmaLink] = useState<GenerarEnlaceResponse | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [cargandoPdf, setCargandoPdf] = useState(false);
  const [errorPdf, setErrorPdf] = useState("");
  const requestId = useRef(0);

  const formData = useContractStore((s) => s.formData);
  const contratoFolio = useContractStore((s) => s.formData.contratoFolio);

  const cargarPdf = async () => {
    const currentRequest = ++requestId.current;
    setCargandoPdf(true);
    setErrorPdf("");

    try {
      const response = contratoFolio
        ? await api.get(`/api/contratos/${contratoFolio}/pdf`, {
            responseType: "blob",
          })
        : await api.post("/api/pdfs/vista-previa", buildContratoPayload(formData), {
            responseType: "blob",
          });
      const nextUrl = URL.createObjectURL(response.data as Blob);
      if (currentRequest !== requestId.current) {
        URL.revokeObjectURL(nextUrl);
        return;
      }
      setPdfUrl((previousUrl) => {
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        return nextUrl;
      });
    } catch (previewError: unknown) {
      setErrorPdf(
        previewError instanceof Error
          ? previewError.message
          : "No se pudo generar la vista previa",
      );
    } finally {
      if (currentRequest === requestId.current) setCargandoPdf(false);
    }
  };

  useEffect(() => {
    void cargarPdf();
    const handlePdfUpdated = (event: Event) => {
      const nextUrl = (event as CustomEvent<string>).detail;
      if (!nextUrl) return;
      setPdfUrl((previousUrl) => {
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        return nextUrl;
      });
    };
    window.addEventListener("contract:pdf-updated", handlePdfUpdated);

    return () => {
      requestId.current++;
      window.removeEventListener("contract:pdf-updated", handlePdfUpdated);
      setPdfUrl((previousUrl) => {
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        return null;
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generarLink = async () => {
    if (!contratoFolio) {
      setError("Primero debes crear el contrato desde el footer");
      return;
    }

    setGenerando(true);
    setError("");

    try {
      const { data } = await api.post<GenerarEnlaceResponse>(
        `/api/contratos/${contratoFolio}/enlaces-firma`
      );
      setFirmaLink(data);
    } catch {
      setError("No se pudo generar el link. Verifica que el contrato exista.");
    } finally {
      setGenerando(false);
    }
  };

  const copiarLink = () => {
    if (!firmaLink?.link) return;
    navigator.clipboard.writeText(firmaLink.link).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Vista Previa
        </h2>
        <p className="text-sm text-text-secondary">
          Revisa el contrato antes de finalizar
        </p>
      </div>

      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-primary">CONTRATO DE PRÉSTAMO</h3>
            <p className="text-xs text-text-secondary">
              {contratoFolio
                ? `Contrato ${contratoFolio}`
                : "Vista previa sin guardar"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void cargarPdf()}
            disabled={cargandoPdf}
            leftIcon={<RefreshCw size={14} />}
          >
            Actualizar
          </Button>
        </div>
        {cargandoPdf && (
          <div className="flex justify-center items-center h-[600px] text-sm text-text-secondary">
            Generando vista previa...
          </div>
        )}
        {!cargandoPdf && pdfUrl && (
          <iframe
            src={pdfUrl}
            title="Vista previa del contrato"
            className="w-full h-[600px] rounded-lg border border-border"
          />
        )}
        {!cargandoPdf && !pdfUrl && (
          <div className="flex justify-center items-center h-40 text-sm text-error">
            {errorPdf || "No hay vista previa disponible"}
          </div>
        )}
      </Card>

      {/* Generar link de firma */}
      <Card className="p-5 space-y-4 border-2 border-border">
        <h3 className="text-base font-semibold text-text-primary">
          Link de Firma Digital
        </h3>
          <p className="text-sm text-text-secondary">
            {contratoFolio
              ? "Genera un enlace para que el cliente firme el contrato digitalmente."
              : "Finaliza el contrato para habilitar el link de firma. Primero puedes revisar el PDF arriba."}
          </p>

          {!firmaLink ? (
            <Button
            variant="secondary"
            size="md"
            loading={generando}
            onClick={generarLink}
            disabled={!contratoFolio}
          >
            {generando ? "Generando..." : "Generar link de firma"}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-success-tint rounded-lg border border-success/30">
              <CheckCircle2 size={18} className="text-success shrink-0" />
              <span className="text-sm text-text-primary">
                {firmaLink.modoDemo
                  ? "Link generado para demostración"
                  : "Link generado correctamente"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-bg p-2 rounded border border-border truncate">
                {firmaLink.link}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copiarLink}
                leftIcon={copiado ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              >
                {copiado ? "Copiado" : "Copiar"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(firmaLink.link, "_blank", "noopener,noreferrer")}
                leftIcon={<ExternalLink size={14} />}
              >
                Abrir firma
              </Button>
            </div>
            <p className="text-xs text-text-secondary">
              {firmaLink.mensajeCorreo}
            </p>
            <p className="text-xs text-text-secondary">
              Expira: {new Date(firmaLink.expira).toLocaleString("es-MX")}
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs text-error">{error}</p>
        )}
      </Card>
    </div>
  );
}

export { VistaPrevia };
