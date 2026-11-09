/** Página pública de firma digital de contratos.
 *
 *  Ruta: /firmar/:token
 *
 *  Flujo:
 *    1. Lee el token de la URL
 *    2. GET /api/enlaces-firma/:token → datos del contrato + URL del PDF
 *    3. Muestra resumen del contrato + PDF embebido + canvas de firma
 *    4. Cliente firma + acepta términos → POST /api/enlaces-firma/:token/firmas
 *
 *  Sin autenticación — cualquier persona con el link puede firmar.
 *  Sigue la misma estructura que LoginPage.tsx. */
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components";
import { Button } from "@/components/ui";
import { Spinner } from "@/components";
import { useFirmaToken } from "./hooks";
import {
  SignatureCanvas,
  ContratoInfo,
  PdfViewer,
  type SignatureCanvasRef,
} from "./components";

type PageStatus = "loading" | "error" | "ready" | "sending" | "done";

function FirmarPage() {
  const { token } = useParams<{ token: string }>();
  const { contrato, pdfUrl, loading, error, enviando, firmado, firmar, reabrirFirma } = useFirmaToken(token);
  const signatureRef = useRef<SignatureCanvasRef>(null);
  const [acepto, setAcepto] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reabriendo, setReabriendo] = useState(false);

  const status: PageStatus = loading
    ? "loading"
    : error
      ? "error"
      : firmado
        ? "done"
        : enviando
          ? "sending"
          : "ready";

  const handleReabrir = async () => {
    setReabriendo(true);
    setErrorMsg("");
    const result = await reabrirFirma();
    if (result?.link) {
      window.location.href = result.link;
    } else {
      setErrorMsg("No se pudo generar un nuevo enlace. Intenta más tarde.");
    }
    setReabriendo(false);
  };

  const handleFirmar = async () => {
    if (!acepto) {
      setErrorMsg("Debes aceptar los términos y condiciones");
      return;
    }
    if (signatureRef.current?.isEmpty() ?? true) {
      setErrorMsg("Debes dibujar tu firma");
      return;
    }

    setErrorMsg("");
    const firmaBase64 = signatureRef.current!.toDataURL()!;
    const ok = await firmar(firmaBase64);
    if (!ok) {
      setErrorMsg("Error al enviar la firma. Intenta de nuevo.");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-text-secondary">Cargando datos del contrato...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    const errorConfig = {
      expirado: {
        title: "Link expirado",
        desc: "El plazo para firmar este contrato ha vencido. Solicita un nuevo enlace al asesor.",
      },
      usado: {
        title: "Contrato ya firmado",
        desc: "Este contrato ya fue firmado anteriormente. Si tienes dudas, contacta a tu asesor.",
      },
      no_encontrado: {
        title: "Link inválido",
        desc: "El enlace que intentas usar no es válido. Verifica que sea correcto o solicita uno nuevo.",
      },
      conexion: {
        title: "Error de conexión",
        desc: "No pudimos conectar con el servidor. Verifica tu conexión a internet e intenta de nuevo.",
      },
    };

    const cfg = errorConfig[error ?? "no_encontrado"];

    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <AlertCircle className="text-error" size={32} />
          </div>
          <h1 className="text-xl font-bold text-text-primary">{cfg.title}</h1>
          <p className="text-sm text-text-secondary">{cfg.desc}</p>
          {(error === "expirado" || error === "usado") && (
            <Button
              variant="primary"
              size="md"
              fullWidth
              loading={reabriendo}
              onClick={handleReabrir}
            >
              {reabriendo ? "Generando nuevo enlace..." : "Volver a Firmar"}
            </Button>
          )}
        </Card>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="text-success" size={32} />
          </div>
          <h1 className="text-xl font-bold text-text-primary">
            ¡Contrato firmado exitosamente!
          </h1>
          <p className="text-sm text-text-secondary">
            Tu contrato {contrato?.folio} ha sido firmado y enviado para
            aprobación. Recibirás una notificación cuando esté activo.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Firma de Contrato
          </h1>
          <p className="text-sm text-text-secondary">
            Revisa el contrato y fírmalo digitalmente
          </p>
        </div>

        {/* Datos del contrato */}
        {contrato && <ContratoInfo contrato={contrato} />}

        {/* PDF embebido */}
        {pdfUrl && <PdfViewer pdfUrl={pdfUrl} />}

        {/* Firma */}
        <Card className="p-5 space-y-4 border-2 border-border">
          <h3 className="text-base font-semibold text-text-primary">
            Firma aquí
          </h3>
          <SignatureCanvas ref={signatureRef} />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => signatureRef.current?.clear()}
              className="text-sm text-text-secondary hover:text-text-primary underline"
            >
              Limpiar firma
            </button>
          </div>
        </Card>

        {/* Aceptar términos */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acepto}
            onChange={(e) => { setAcepto(e.target.checked); setErrorMsg(""); }}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-text-secondary">
            Acepto los términos y condiciones del contrato de crédito, y
            reconozco que la firma electrónica tiene la misma validez legal
            que mi firma autógrafa.
          </span>
        </label>

        {/* Error message */}
        {errorMsg && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-error-border bg-error-tint p-3 text-sm text-error"
          >
            <AlertCircle size={16} aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Botón firmar */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={status === "sending"}
          onClick={handleFirmar}
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Enviando firma...
            </span>
          ) : (
            "Firmar Contrato"
          )}
        </Button>
      </div>
    </div>
  );
}

export { FirmarPage };
