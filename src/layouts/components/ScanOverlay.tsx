/** Overlay modal que muestra el progreso del escaneo de documentos.
 *  Aparece cuando scanStatus === "scanning" y muestra el estado
 *  de cada documento (INE, Nómina 1, Nómina 2, Estado de cuenta)
 *  con iconos de carga, éxito o error. */
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components";

interface ScanOverlayProps {
  scanResults: Record<string, "pending" | "success" | "error">;
}

const DOC_SCAN_ITEMS = [
  { id: "ine", label: "INE" },
  { id: "nomina1", label: "Nómina 1" },
  { id: "nomina2", label: "Nómina 2" },
  { id: "estadoCuenta", label: "Estado de cuenta" },
] as const;

function ScanOverlay({ scanResults }: ScanOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="p-6 max-w-sm w-full space-y-4">
        <div className="flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-primary" />
          <span className="font-medium text-text-primary">Escaneando...</span>
        </div>
        <div className="space-y-2">
          {DOC_SCAN_ITEMS.map((item) => {
            const result = scanResults[item.id];
            return (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                {result === "success" ? (
                  <CheckCircle size={14} className="text-success" />
                ) : result === "error" ? (
                  <AlertCircle size={14} className="text-error" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-border" />
                )}
                <span className="text-text-secondary">{item.label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export { ScanOverlay };
