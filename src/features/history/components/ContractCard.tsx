import { Eye, FileDown, Pencil, Share2, RefreshCw, Check, X } from "lucide-react";
import { Card } from "@/components";
import { downloadContract } from "@/utils/downloadContract";

interface ContractCardProps {
  contract: {
    id: string;
    clientName: string;
    date: string;
    asesor: string;
    monto: number;
    plazo: number;
    estado: string;
  };
  onView: () => void;
  onEdit: () => void;
  onReSign?: () => void;
  canReview?: boolean;
  canEdit?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

function estadoTextColor(estado: string): string {
  switch (estado) {
    case "POR FIRMAR":
      return "text-yellow-600";
    case "POR APROBAR":
      return "text-blue-600";
    case "ACTIVO":
    case "APROBADO":
      return "text-green-600";
    default:
      return "text-red-600";
  }
}

function ContractCard({ contract, onView, onEdit, onReSign, canReview, canEdit = true, onApprove, onReject }: ContractCardProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/contracts/preview`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contrato ${contract.id}`,
          text: `Contrato de ${contract.clientName}`,
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            {contract.clientName}
          </h3>
          <p className={`text-xs font-semibold ${estadoTextColor(contract.estado)}`}>
            {contract.estado}
          </p>
          <p className="text-xs text-text-secondary">
            {contract.date} · {contract.asesor}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-xs text-text-secondary">Monto</p>
            <p className="font-semibold text-money">
              ${contract.monto?.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Plazo</p>
            <p className="font-semibold">{contract.plazo} QNAs</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1">
            <button
              onClick={async () => {
                try {
                  await downloadContract(contract.id);
                } catch (err: unknown) {
                  const msg =
                    err instanceof Error
                      ? err.message
                      : "Error desconocido al descargar";
                  alert(`No se pudo descargar el PDF:\n${msg}`);
                }
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
              title="Descargar PDF"
            >
              <FileDown size={14} />
            </button>
            {canEdit && (
              <button
                onClick={onEdit}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
                title="Editar contrato"
              >
                <Pencil size={14} />
              </button>
            )}
            <button
              onClick={onView}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
              title="Ver contrato"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
              title="Compartir"
            >
              <Share2 size={14} />
            </button>
            {(contract.estado === "POR FIRMAR" || contract.estado === "POR APROBAR") && (
              <button
                onClick={onReSign}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
                title="Volver a Firmar"
              >
                <RefreshCw size={14} />
              </button>
            )}
            {canReview && contract.estado === "POR APROBAR" && (
              <>
                <button
                  onClick={onApprove}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-success/40 bg-success/10 text-success transition-colors hover:bg-success/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success/40"
                  title="Aprobar contrato"
                  aria-label={`Aprobar contrato ${contract.id}`}
                >
                  <Check size={15} strokeWidth={2.5} />
                </button>
                <button
                  onClick={onReject}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-error/40 bg-error/10 text-error transition-colors hover:bg-error/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40"
                  title="Rechazar contrato"
                  aria-label={`Rechazar contrato ${contract.id}`}
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export { ContractCard };
