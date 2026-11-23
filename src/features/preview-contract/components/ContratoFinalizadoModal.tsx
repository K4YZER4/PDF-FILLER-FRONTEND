import { useState } from "react";
import { CheckCircle2, Copy, ExternalLink, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components";
import { Button } from "@/components/ui";

interface ContratoFinalizadoModalProps {
  isOpen: boolean;
  folio: string;
  linkFirma: string;
  codigoOtp?: string;
  onGoToDashboard: () => void;
}

export function ContratoFinalizadoModal({
  isOpen,
  folio,
  linkFirma,
  codigoOtp,
  onGoToDashboard,
}: ContratoFinalizadoModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkFirma);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyOtp = () => {
    if (codigoOtp) {
      navigator.clipboard.writeText(codigoOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg p-6 sm:p-8 space-y-6 bg-card border-2 border-border shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success mb-2">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            ¡Contrato Guardado Exitosamente!
          </h2>
          <p className="text-sm font-medium text-text-secondary">
            Folio asignado: <span className="text-primary font-bold text-base">{folio}</span>
          </p>
        </div>

        {/* Demo Alert Box */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-text-secondary space-y-2">
          <div className="flex items-center gap-2 font-semibold text-text-primary">
            <span>📢</span>
            <span>Aviso de Demostración Pública</span>
          </div>
          <p className="text-xs leading-relaxed">
            El servicio de correos reales está deshabilitado en este entorno de demo. Para firmar el contrato como si fueras el cliente, usa el siguiente enlace generado:
          </p>
        </div>

        {/* Enlace de Firma */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Enlace de Firma Digital
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={linkFirma}
              className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border-2 border-border bg-bg text-text-secondary select-all font-mono truncate focus:outline-none"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0 flex items-center gap-1.5"
            >
              {copiedLink ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              <span>{copiedLink ? "Copiado" : "Copiar"}</span>
            </Button>
          </div>
        </div>

        {/* Código OTP */}
        {codigoOtp && (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-bg">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="text-primary shrink-0" size={20} />
              <div>
                <p className="text-xs font-medium text-text-secondary">Código de seguridad (OTP)</p>
                <p className="text-lg font-bold font-mono tracking-widest text-text-primary">{codigoOtp}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyOtp}
              className="text-xs text-text-secondary hover:text-text-primary"
            >
              {copiedOtp ? "¡Copiado!" : "Copiar código"}
            </Button>
          </div>
        )}

        {/* Acciones */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <a
            href={linkFirma}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
          >
            <span>Firmar como Cliente</span>
            <ExternalLink size={16} />
          </a>
          <Button
            variant="secondary"
            onClick={onGoToDashboard}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <span>Ir al Historial</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
}
