/** Tarjeta individual de contrato en el historial.
 *  Muestra: nombre del cliente, fecha, asesor, monto, plazo y botones de acción.
 *  El sharing usa navigator.share con fallback a clipboard. */
import { Eye, Share2 } from "lucide-react";
import { Card } from "@/features/history/componenrs/index";

interface ContractCardProps {
  contract: {
    id: string;
    clientName: string;
    date: string;
    asesor: string;
    monto: number;
    plazo: number;
  };
  onView: () => void;
}

function ContractCard({ contract, onView }: ContractCardProps) {
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
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {contract.clientName}
            </h3>
            <p className="text-xs text-text-secondary">
              {contract.date} · {contract.asesor}
            </p>
          </div>
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
          <div className="flex gap-1">
            <button
              onClick={onView}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export { ContractCard };
