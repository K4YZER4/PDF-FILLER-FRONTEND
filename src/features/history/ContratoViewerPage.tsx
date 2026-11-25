import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileDown } from "lucide-react";
import { Card } from "@/components";
import { Button } from "@/components/ui";
import { api } from "@/lib/api";
import { downloadContract } from "@/utils/downloadContract";

function ContratoViewerPage() {
  const { folio } = useParams<{ folio: string }>();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!folio) return;
    let cancelled = false;
    let objectUrl: string | null = null;

    api.get(`/api/contratos/${folio}/pdf`, { responseType: "blob" })
      .then((response) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(response.data as Blob);
        setPdfUrl(objectUrl);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el contrato");
        }
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [folio]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={16} />}>
          Volver
        </Button>
        {folio && (
          <Button variant="secondary" size="sm" onClick={() => void downloadContract(folio)} leftIcon={<FileDown size={16} />}>
            Descargar
          </Button>
        )}
      </div>
      <Card className="p-4 md:p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Contrato {folio}</h2>
        {pdfUrl ? (
          <iframe src={pdfUrl} title={`Contrato ${folio}`} className="w-full h-[75vh] rounded-lg border border-border" />
        ) : (
          <div className="flex min-h-40 items-center justify-center text-sm text-error">
            {error || "Cargando contrato..."}
          </div>
        )}
      </Card>
    </div>
  );
}

export { ContratoViewerPage };
